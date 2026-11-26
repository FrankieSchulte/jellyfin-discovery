using System.Text.Json;
using Jellyfin.Data.Enums;
using MediaBrowser.Controller.Entities;
using MediaBrowser.Controller.Entities.TV;
using MediaBrowser.Controller.Library;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace Jellyfin.RequestHub;
public sealed class RequestBody {public string Type{get;set;}="";public int Id{get;set;}public int[] Seasons{get;set;}=[];public int? ProfileId{get;set;}public int? ServerId{get;set;}public bool? Is4k{get;set;}}
public sealed class CancelBody {public int RequestId{get;set;}}
[ApiController,Route("RequestHub"),Authorize]
public sealed class HubController(SeerrGateway gateway,IUserManager users,ILibraryManager? library=null):ControllerBase
{
    private static readonly object OwnedLock=new();
    private static readonly object ProfilesLock=new();
    private static readonly Dictionary<string,(DateTimeOffset CachedAt,QualityProfile[] Profiles)> CachedProfiles=[];
    private static DateTimeOffset OwnedCachedAt=DateTimeOffset.MinValue;
    private static HashSet<int> CachedMovies=[];
    private static HashSet<int> CachedSeries=[];
    private static (HashSet<int> Movies,HashSet<int> Series) GetOwnedTmdb(ILibraryManager? lib)
    {
        if(lib is null)return([],[]);
        var now=DateTimeOffset.UtcNow;
        lock(OwnedLock){if(now-OwnedCachedAt<TimeSpan.FromSeconds(45))return(CachedMovies,CachedSeries);}
        var movies=new HashSet<int>();var seriesItems=new List<(Guid Id,int Tmdb)>();var playableSeries=new HashSet<Guid>();
        int offset=0;
        for(;;)
        {
            var batch=lib.GetItemList(new InternalItemsQuery{IncludeItemTypes=[BaseItemKind.Movie,BaseItemKind.Series,BaseItemKind.Episode],Recursive=true,StartIndex=offset,Limit=1000,DtoOptions=new(){EnableImages=false,EnableUserData=false}});
            foreach(var item in batch)
            {
                bool playable=!item.IsVirtualItem&&!string.IsNullOrWhiteSpace(item.Path)&&item.RunTimeTicks>0;
                if(item is Episode ep){if(playable&&ep.SeriesId!=Guid.Empty)playableSeries.Add(ep.SeriesId);continue;}
                if(item.ProviderIds is null||(!item.ProviderIds.TryGetValue("Tmdb",out var raw)&&!item.ProviderIds.TryGetValue("tmdb",out raw))||!int.TryParse(raw,out var tmdb)||tmdb<=0)continue;
                var kind=item.GetBaseItemKind();
                if(kind==BaseItemKind.Movie&&playable)movies.Add(tmdb);
                else if(kind==BaseItemKind.Series)seriesItems.Add((item.Id,tmdb));
            }
            offset+=batch.Count;
            if(batch.Count<1000||offset>=500000)break;
        }
        var series=seriesItems.Where(s=>playableSeries.Contains(s.Id)).Select(s=>s.Tmdb).ToHashSet();
        lock(OwnedLock){CachedMovies=movies;CachedSeries=series;OwnedCachedAt=now;return(movies,series);}
    }
    private UserLink? Link(){var c=Plugin.Instance.Configuration;if(!c.Enabled)return null;var claim=User.Claims.FirstOrDefault(c=>c.Type.Equals("Jellyfin-UserId",StringComparison.OrdinalIgnoreCase))?.Value;return Guid.TryParse(claim,out var id)&&users.GetUserById(id)is not null?HubPolicy.OwnMapping(c.Users,id):null;}
    private async Task<IActionResult> Run(Func<UserLink,Task<IActionResult>> action){var link=Link();if(link is null)return StatusCode(403,new{error="Request Hub is disabled or your account has not been mapped by the administrator."});try{return await action(link);}catch(HubException e){return StatusCode(e.Status is 403 or 404 or 409 or 429?e.Status:502,new{error=e.Status==403?"Jellyseerr denied this operation. Check account permissions and request quota.":e.Status==404?"Request not found or already cancelled.":e.Status==409?"This title or season has already been requested.":"Jellyseerr could not complete the operation. Try again later."});}catch(Exception e)when(e is HttpRequestException or TaskCanceledException or JsonException or InvalidOperationException or KeyNotFoundException){return StatusCode(502,new{error="Jellyseerr is unavailable or returned an unsupported response."});}}
    [HttpGet("Status")]
    public IActionResult Status(){var link=Link();return Ok(new{enabled=link is not null,canRequest=link?.AllowRequests==true});}
    [HttpGet("Browse")]
    public Task<IActionResult> Browse(string kind="trending",int page=1,string? query=null,int? filter=null)=>Run(async link=>{
        string path;try{path=HubPolicy.BrowsePath(kind,page,query,filter);}catch(ArgumentException){return BadRequest();}
        using var response=await gateway.Send(link,path,null,HttpContext.RequestAborted);var root=response.RootElement;
        if(kind=="genres")return Ok(new{results=root.ValueKind==JsonValueKind.Array?root.EnumerateArray().Where(g=>Projection.Int(g,"id") is > 0).Select(g=>(object)new{id=Projection.Int(g,"id")??0,name=g.TryGetProperty("name",out var gn)&&gn.ValueKind==JsonValueKind.String?gn.GetString():"",backdrop=g.TryGetProperty("backdrops",out var b)&&b.ValueKind==JsonValueKind.Array&&b.GetArrayLength()>0&&((b.GetArrayLength()>4?b[4]:b[0]).ValueKind==JsonValueKind.String)?HubPolicy.Backdrop((b.GetArrayLength()>4?b[4]:b[0]).GetString()):null}).ToArray():Array.Empty<object>(),pages=1});
        var today=DateOnly.FromDateTime(DateTime.UtcNow);
        var fallbackType=kind is "movies" or "genre" or "studio"?"movie":kind is "tv" or "network"?"tv":null;
        var (ownedMovies,ownedSeries)=GetOwnedTmdb(library);
        bool isSearch=kind=="search";
        var rawResults=root.ValueKind==JsonValueKind.Object&&root.TryGetProperty("results",out var resProp)&&resProp.ValueKind==JsonValueKind.Array?resProp.EnumerateArray().ToArray():Array.Empty<JsonElement>();
        var items=rawResults.Where(i=>Projection.ShouldIncludeBrowseItem(i,fallbackType,today,ownedMovies,ownedSeries,allowOwned:isSearch)).Select(i=>{
            int? statusOverride=null;
            if(isSearch)
            {
                int itemId=Projection.Int(i,"id")??0;
                string itemType=fallbackType??(i.TryGetProperty("mediaType",out var mt)&&mt.ValueKind==JsonValueKind.String?(mt.GetString()??""):"");
                int st=Projection.StatusOf(i);
                if(itemId>0&&((itemType=="movie"&&ownedMovies.Contains(itemId))||(itemType=="tv"&&st!=4&&ownedSeries.Contains(itemId))))statusOverride=5;
            }
            return Projection.Item(i,fallbackType,statusOverride);
        }).ToArray();
        return Ok(new{results=items,pages=Projection.Int(root,"totalPages")??1,canRequest=link.AllowRequests});
    });
    private async Task<QualityProfile[]> GetProfilesAsync(string type,CancellationToken token)
    {
        var key=type=="tv"?"tv":"movie";
        var now=DateTimeOffset.UtcNow;
        lock(ProfilesLock){if(CachedProfiles.TryGetValue(key,out var cached)&&now-cached.CachedAt<TimeSpan.FromMinutes(5))return cached.Profiles;}
        var service=key=="tv"?"sonarr":"radarr";
        try
        {
            using var listDoc=await gateway.SendAdmin($"service/{service}",token);
            if(listDoc.RootElement.ValueKind!=JsonValueKind.Array)return [];
            var servers=new List<(int Id,string RootFolder,bool Is4k,bool IsDefault,int ActiveProfileId)>();
            foreach(var s in listDoc.RootElement.EnumerateArray())
            {
                if(Projection.Int(s,"id") is not int sid||sid<0)continue;
                var rootFolder=s.ValueKind==JsonValueKind.Object&&s.TryGetProperty("activeDirectory",out var dirProp)&&dirProp.ValueKind==JsonValueKind.String?(dirProp.GetString()??""):"";
                var is4k=s.ValueKind==JsonValueKind.Object&&s.TryGetProperty("is4k",out var k4)&&k4.ValueKind==JsonValueKind.True;
                var isDef=s.ValueKind==JsonValueKind.Object&&s.TryGetProperty("isDefault",out var def)&&def.ValueKind==JsonValueKind.True;
                var activeProf=Projection.Int(s,"activeProfileId")??0;
                servers.Add((sid,rootFolder,is4k,isDef,activeProf));
            }
            servers.Sort((a,b)=>{int d=(b.IsDefault?1:0).CompareTo(a.IsDefault?1:0);return d!=0?d:a.Id.CompareTo(b.Id);});
            var all=new List<QualityProfile>();
            foreach(var srv in servers)
            {
                using var detailDoc=await gateway.SendAdmin($"service/{service}/{srv.Id}",token);
                all.AddRange(Projection.ParseProfiles(detailDoc.RootElement,srv.Id,srv.RootFolder,srv.Is4k,srv.IsDefault,srv.ActiveProfileId));
            }
            var result=all.ToArray();
            lock(ProfilesLock){CachedProfiles[key]=(now,result);}
            return result;
        }
        catch
        {
            return [];
        }
    }
    private async Task<object?> FetchMovieRatingsAsync(UserLink link,int id,CancellationToken token)
    {
        try
        {
            using var doc=await gateway.Send(link,$"movie/{id}/ratings",null,token);
            return Projection.MovieRatings(doc.RootElement);
        }
        catch
        {
            return null;
        }
    }
    [HttpGet("Details")]
    public Task<IActionResult> Details(string type,int id)=>Run(async link=>{
        if(type is not("movie" or "tv")||id<=0)return BadRequest();
        var ct=HttpContext.RequestAborted;
        var detailsTask=gateway.Send(link,$"{type}/{id}",null,ct);
        var profilesTask=GetProfilesAsync(type,ct);
        var ratingsTask=type=="movie"?FetchMovieRatingsAsync(link,id,ct):Task.FromResult<object?>(null);
        await Task.WhenAll(detailsTask,profilesTask,ratingsTask);
        using var response=await detailsTask;var r=response.RootElement;
        var seasons=r.ValueKind==JsonValueKind.Object&&r.TryGetProperty("seasons",out var ss)&&ss.ValueKind==JsonValueKind.Array
            ?ss.EnumerateArray().Select(s=>Projection.Int(s,"seasonNumber")).Where(n=>n is >= 0).Select(n=>n!.Value).Distinct().ToArray()
            :Array.Empty<int>();
        var profiles=await profilesTask;
        var defaultProfile=profiles.FirstOrDefault(p=>p.IsDefault)??profiles.FirstOrDefault();
        var ratings=type=="movie"?await ratingsTask:null;
        var (ownedMovies,ownedSeries)=GetOwnedTmdb(library);
        int? statusOverride=(type=="movie"&&ownedMovies.Contains(id))||(type=="tv"&&Projection.StatusOf(r)!=4&&ownedSeries.Contains(id))?5:null;
        var requests=Projection.ActiveRequests(r,link.SeerrUserId);
        return Ok(new{
            item=Projection.Details(r,type,statusOverride),
            seasons,
            profiles=profiles.Select(p=>new{id=p.Id,name=p.Name,serverId=p.ServerId,is4k=p.Is4k,isDefault=p.IsDefault}).ToArray(),
            defaultProfileId=defaultProfile?.Id,
            ratings,
            requests,
            canRequest=link.AllowRequests
        });
    });
    [HttpPost("Request"),RequestSizeLimit(8192)]
    public Task<IActionResult> RequestTitle([FromBody]RequestBody body)=>Run(async link=>{
        if(!link.AllowRequests)return Forbid();
        if(body.Seasons is null||!HubPolicy.RequestValid(body.Type,body.Id,body.Seasons))return BadRequest();
        if(!gateway.PermitWrite(link.JellyfinUserId))return StatusCode(429);
        object payload;
        if(body.ProfileId is > 0)
        {
            var profiles=await GetProfilesAsync(body.Type,HttpContext.RequestAborted);
            var chosen=profiles.FirstOrDefault(p=>p.Id==body.ProfileId.Value&&(!body.ServerId.HasValue||p.ServerId==body.ServerId.Value))??profiles.FirstOrDefault(p=>p.Id==body.ProfileId.Value);
            if(chosen is null)return BadRequest();
            payload=string.IsNullOrWhiteSpace(chosen.RootFolder)
                ?new{mediaType=body.Type,mediaId=body.Id,seasons=body.Seasons,is4k=chosen.Is4k,serverId=chosen.ServerId,profileId=chosen.Id}
                :(object)new{mediaType=body.Type,mediaId=body.Id,seasons=body.Seasons,is4k=chosen.Is4k,serverId=chosen.ServerId,profileId=chosen.Id,rootFolder=chosen.RootFolder};
        }
        else
        {
            payload=new{mediaType=body.Type,mediaId=body.Id,seasons=body.Seasons,is4k=false};
        }
        using var response=await gateway.Send(link,"request",payload,HttpContext.RequestAborted);
        return Ok(new{message="Request submitted. Jellyseerr approval rules and quotas apply.",request=Projection.CreatedRequest(response.RootElement)});
    });
    [HttpPost("Cancel"),RequestSizeLimit(1024)]
    public Task<IActionResult> CancelRequest([FromBody]CancelBody body)=>Run(async link=>{
        if(!link.AllowRequests)return Forbid();
        if(body.RequestId<=0)return BadRequest();
        if(!gateway.PermitWrite(link.JellyfinUserId))return StatusCode(429);
        await gateway.Delete(link,$"request/{body.RequestId}",HttpContext.RequestAborted);
        return Ok(new{message="Request cancelled."});
    });
}
