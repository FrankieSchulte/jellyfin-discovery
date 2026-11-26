using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
namespace Jellyfin.RequestHub;
public sealed class SeerrGateway : IDisposable
{
    private readonly HttpClient client;
    public SeerrGateway():this(new HttpClientHandler{AllowAutoRedirect=false,UseCookies=false}){}
    internal SeerrGateway(HttpMessageHandler handler){client=new HttpClient(handler){Timeout=TimeSpan.FromSeconds(15),MaxResponseContentBufferSize=4_000_000};}
    private readonly Dictionary<Guid,Queue<DateTimeOffset>> writes=[];
    public bool PermitWrite(Guid user){lock(writes){var now=DateTimeOffset.UtcNow;if(!writes.TryGetValue(user,out var queue))writes[user]=queue=new();while(queue.TryPeek(out var old)&&old<now.AddMinutes(-1))queue.Dequeue();if(queue.Count>=10)return false;queue.Enqueue(now);return true;}}
    public Task<JsonDocument> Send(UserLink link,string path,object? body,CancellationToken token)=>SendCore(link,path,body,token);
    public Task<JsonDocument> SendAdmin(string path,CancellationToken token)=>SendCore(null,path,null,token);
    public async Task Delete(UserLink link,string path,CancellationToken token)
    {
        var config=Plugin.Instance.Configuration;
        using var request=new HttpRequestMessage(HttpMethod.Delete,new Uri(HubPolicy.BaseUri(config.ServerUrl),path));
        request.Headers.Add("X-API-Key",config.ApiKey);
        request.Headers.Add("X-API-User",link.SeerrUserId.ToString(System.Globalization.CultureInfo.InvariantCulture));
        using var response=await client.SendAsync(request,token);
        if(!response.IsSuccessStatusCode)throw new HubException(response.StatusCode);
    }
    private async Task<JsonDocument> SendCore(UserLink? link,string path,object? body,CancellationToken token)
    {
        var config=Plugin.Instance.Configuration;
        using var request=new HttpRequestMessage(body is null?HttpMethod.Get:HttpMethod.Post,new Uri(HubPolicy.BaseUri(config.ServerUrl),path));
        request.Headers.Add("X-API-Key",config.ApiKey);
        if(link is not null)request.Headers.Add("X-API-User",link.SeerrUserId.ToString(System.Globalization.CultureInfo.InvariantCulture));
        if(body is not null)request.Content=JsonContent.Create(body);
        using var response=await client.SendAsync(request,token);
        if(!response.IsSuccessStatusCode)throw new HubException(response.StatusCode);
        var bytes=await response.Content.ReadAsByteArrayAsync(token);if(bytes.Length>4_000_000)throw new HubException(HttpStatusCode.BadGateway);
        return JsonDocument.Parse(bytes,new JsonDocumentOptions{MaxDepth=50});
    }
    public void Dispose()=>client.Dispose();
}
public sealed class HubException(HttpStatusCode status):Exception("Upstream operation failed") { public int Status=>(int)status; }
public static class Projection
{
    public static int? Int(JsonElement item,string field)=>item.ValueKind==JsonValueKind.Object&&item.TryGetProperty(field,out var v)&&v.ValueKind==JsonValueKind.Number&&v.TryGetInt32(out var n)?n:null;
    public static double? Double(JsonElement item,string field)=>item.ValueKind==JsonValueKind.Object&&item.TryGetProperty(field,out var v)&&v.ValueKind==JsonValueKind.Number&&v.TryGetDouble(out var d)&&double.IsFinite(d)?d:null;
    private static string Text(JsonElement item,string field)=>item.ValueKind==JsonValueKind.Object&&item.TryGetProperty(field,out var v)&&v.ValueKind==JsonValueKind.String?(v.GetString()??""):"";
    public static string ReleaseDate(JsonElement item)=>Text(item,"releaseDate") is {Length:>0} rd?rd:Text(item,"firstAirDate");
    public static int StatusOf(JsonElement item)=>item.ValueKind==JsonValueKind.Object&&item.TryGetProperty("mediaInfo",out var media)&&media.ValueKind==JsonValueKind.Object?(Int(media,"status")??0):0;
    public static bool IsAvailable(JsonElement item)=>StatusOf(item)==5;
    public static bool IsReleased(JsonElement item,DateOnly today)
    {
        var raw=ReleaseDate(item);
        if(raw.Length<10||!DateOnly.TryParseExact(raw[..10],"yyyy-MM-dd",System.Globalization.CultureInfo.InvariantCulture,System.Globalization.DateTimeStyles.None,out var date)||date>today)return false;
        var status=StatusOf(item);
        if(status>=4)return true;
        if(Int(item,"voteCount") is int votes&&votes<=0)return false;
        return true;
    }
    public static bool ShouldIncludeBrowseItem(JsonElement item,string? fallbackType,DateOnly today,IReadOnlySet<int>? ownedMovies=null,IReadOnlySet<int>? ownedSeries=null,bool allowOwned=false)
    {
        if(item.ValueKind!=JsonValueKind.Object)return false;
        string resolvedType=fallbackType??Text(item,"mediaType");
        if(resolvedType is not("movie" or "tv"))return false;
        int status=StatusOf(item);
        int id=Int(item,"id")??0;
        bool ownedInLibrary=id>0&&((resolvedType=="movie"&&ownedMovies?.Contains(id)==true)||(resolvedType=="tv"&&status!=4&&ownedSeries?.Contains(id)==true));
        if(allowOwned)
        {
            if(status==5||ownedInLibrary)return true;
            return IsReleased(item,today);
        }
        if(!IsReleased(item,today))return false;
        if(status==5||ownedInLibrary)return false;
        return true;
    }
    public static object Item(JsonElement item,string? type=null,int? statusOverride=null)=>new {
        id=Int(item,"id")??0,
        type=type??Text(item,"mediaType"),title=Text(item,"title") is {Length:>0} t?t:Text(item,"name"),
        overview=Text(item,"overview"),poster=HubPolicy.Poster(Text(item,"posterPath")),
        releaseDate=ReleaseDate(item),
        status=statusOverride??StatusOf(item)
    };
    private static string[] NamesOf(JsonElement item,string field,int limit)
    {
        if(item.ValueKind!=JsonValueKind.Object||!item.TryGetProperty(field,out var arr)||arr.ValueKind!=JsonValueKind.Array)return [];
        var list=new List<string>();
        foreach(var entry in arr.EnumerateArray())
        {
            var name=Text(entry,"name").Trim();
            if(name.Length>0&&!list.Contains(name,StringComparer.OrdinalIgnoreCase))list.Add(name);
            if(list.Count>=limit)break;
        }
        return list.ToArray();
    }
    private static string CertificationOf(JsonElement item,string type)
    {
        if(item.ValueKind!=JsonValueKind.Object)return "";
        if(type=="movie"&&item.TryGetProperty("releases",out var rel)&&rel.ValueKind==JsonValueKind.Object&&rel.TryGetProperty("results",out var res)&&res.ValueKind==JsonValueKind.Array)
        {
            foreach(var region in res.EnumerateArray())
            {
                if(region.ValueKind!=JsonValueKind.Object)continue;
                if(!string.Equals(Text(region,"iso_3166_1"),"US",StringComparison.OrdinalIgnoreCase))continue;
                if(!region.TryGetProperty("release_dates",out var dates)||dates.ValueKind!=JsonValueKind.Array)continue;
                foreach(var rd in dates.EnumerateArray())
                {
                    var cert=Text(rd,"certification").Trim();
                    if(cert.Length>0)return cert;
                }
            }
        }
        if(type=="tv"&&item.TryGetProperty("contentRatings",out var cr)&&cr.ValueKind==JsonValueKind.Object&&cr.TryGetProperty("results",out var cres)&&cres.ValueKind==JsonValueKind.Array)
        {
            foreach(var region in cres.EnumerateArray())
            {
                if(region.ValueKind!=JsonValueKind.Object)continue;
                if(!string.Equals(Text(region,"iso_3166_1"),"US",StringComparison.OrdinalIgnoreCase))continue;
                var rating=Text(region,"rating").Trim();
                if(rating.Length>0)return rating;
            }
        }
        return "";
    }
    private static int RuntimeOf(JsonElement item,string type)
    {
        if(item.ValueKind!=JsonValueKind.Object)return 0;
        if(type=="movie"&&Int(item,"runtime") is int mins&&mins>0)return mins;
        if(type=="tv"&&item.TryGetProperty("episodeRunTime",out var ert)&&ert.ValueKind==JsonValueKind.Array)
        {
            foreach(var entry in ert.EnumerateArray())
            {
                if(entry.ValueKind==JsonValueKind.Number&&entry.TryGetInt32(out var epMins)&&epMins>0)return epMins;
            }
        }
        return 0;
    }
    public static object Details(JsonElement item,string type,int? statusOverride=null)
    {
        var director="";
        string[] cast=[];
        if(item.ValueKind==JsonValueKind.Object&&item.TryGetProperty("credits",out var credits)&&credits.ValueKind==JsonValueKind.Object)
        {
            if(type=="movie"&&credits.TryGetProperty("crew",out var crew)&&crew.ValueKind==JsonValueKind.Array)
            {
                foreach(var member in crew.EnumerateArray())
                {
                    if(string.Equals(Text(member,"job"),"Director",StringComparison.OrdinalIgnoreCase))
                    {
                        var dn=Text(member,"name").Trim();
                        if(dn.Length>0){director=dn;break;}
                    }
                }
            }
            cast=NamesOf(credits,"cast",4);
        }
        double? voteAverage=Double(item,"voteAverage") is double score&&score>0?Math.Round(score,1):null;
        int seasonCount=Int(item,"numberOfSeasons") is int nsv&&nsv>0?nsv:0;
        int episodeCount=Int(item,"numberOfEpisodes") is int nev&&nev>0?nev:0;
        return new {
            id=Int(item,"id")??0,
            type,
            title=Text(item,"title") is {Length:>0} t?t:Text(item,"name"),
            overview=Text(item,"overview"),
            poster=HubPolicy.Poster(Text(item,"posterPath")),
            releaseDate=ReleaseDate(item),
            status=statusOverride??StatusOf(item),
            tagline=Text(item,"tagline").Trim(),
            runtime=RuntimeOf(item,type),
            genres=NamesOf(item,"genres",4),
            voteAverage,
            statusText=Text(item,"status").Trim(),
            certification=CertificationOf(item,type),
            director,
            cast,
            networks=type=="tv"?NamesOf(item,"networks",2):Array.Empty<string>(),
            numberOfSeasons=seasonCount,
            numberOfEpisodes=episodeCount
        };
    }
    private static int[] RequestSeasons(JsonElement req)
    {
        if(req.ValueKind!=JsonValueKind.Object||!req.TryGetProperty("seasons",out var arr)||arr.ValueKind!=JsonValueKind.Array)return [];
        var list=new List<int>();
        foreach(var entry in arr.EnumerateArray())
        {
            if(entry.ValueKind==JsonValueKind.Object&&Int(entry,"seasonNumber") is int sn&&sn>=0)
            {
                if(!list.Contains(sn))list.Add(sn);
            }
            else if(entry.ValueKind==JsonValueKind.Number&&entry.TryGetInt32(out var num)&&num>=0)
            {
                if(!list.Contains(num))list.Add(num);
            }
        }
        list.Sort();
        return list.ToArray();
    }
    public static object[] ActiveRequests(JsonElement item,int currentSeerrUserId)
    {
        if(item.ValueKind!=JsonValueKind.Object||!item.TryGetProperty("mediaInfo",out var media)||media.ValueKind!=JsonValueKind.Object||!media.TryGetProperty("requests",out var arr)||arr.ValueKind!=JsonValueKind.Array)return [];
        var list=new List<object>();
        foreach(var req in arr.EnumerateArray())
        {
            if(req.ValueKind!=JsonValueKind.Object)continue;
            if(Int(req,"id") is not int reqId||reqId<=0)continue;
            int status=Int(req,"status")??0;
            if(status is not(1 or 2))continue;
            int requestedById=req.TryGetProperty("requestedBy",out var rb)&&rb.ValueKind==JsonValueKind.Object?(Int(rb,"id")??0):0;
            bool is4k=req.TryGetProperty("is4k",out var k4)&&k4.ValueKind==JsonValueKind.True;
            int? profileId=Int(req,"profileId") is int pv&&pv>0?pv:null;
            list.Add(new {
                id=reqId,
                status,
                is4k,
                profileId,
                seasons=RequestSeasons(req),
                canCancel=currentSeerrUserId==1||(requestedById>0&&requestedById==currentSeerrUserId)
            });
        }
        return list.ToArray();
    }
    public static object? CreatedRequest(JsonElement req)
    {
        if(req.ValueKind!=JsonValueKind.Object)return null;
        if(Int(req,"id") is not int reqId||reqId<=0)return null;
        int status=Int(req,"status")??1;
        bool is4k=req.TryGetProperty("is4k",out var k4)&&k4.ValueKind==JsonValueKind.True;
        int? profileId=Int(req,"profileId") is int pv&&pv>0?pv:null;
        return new {
            id=reqId,
            status,
            is4k,
            profileId,
            seasons=RequestSeasons(req),
            canCancel=true
        };
    }
    public static object? MovieRatings(JsonElement ratings)
    {
        if(ratings.ValueKind!=JsonValueKind.Object)return null;
        int? criticsScore=Int(ratings,"criticsScore") is int csv&&csv>0?csv:null;
        int? audienceScore=Int(ratings,"audienceScore") is int ausv&&ausv>0?ausv:null;
        if(criticsScore is null&&audienceScore is null)return null;
        return new {
            criticsScore,
            criticsRating=Text(ratings,"criticsRating").Trim(),
            audienceScore,
            audienceRating=Text(ratings,"audienceRating").Trim()
        };
    }
    public static QualityProfile[] ParseProfiles(JsonElement detail,int fallbackServerId,string fallbackRootFolder,bool fallbackIs4k,bool fallbackIsDefault,int fallbackActiveProfileId)
    {
        if(detail.ValueKind!=JsonValueKind.Object)return [];
        int serverId=fallbackServerId;
        string rootFolder=fallbackRootFolder;
        bool is4k=fallbackIs4k;
        bool isDefaultServer=fallbackIsDefault;
        int activeProfileId=fallbackActiveProfileId;
        if(detail.TryGetProperty("server",out var srv)&&srv.ValueKind==JsonValueKind.Object)
        {
            if(Int(srv,"id") is int sv&&sv>=0)serverId=sv;
            if(srv.TryGetProperty("activeDirectory",out var dir)&&dir.ValueKind==JsonValueKind.String&&!string.IsNullOrWhiteSpace(dir.GetString()))rootFolder=dir.GetString()!;
            if(srv.TryGetProperty("is4k",out var k4)&&k4.ValueKind is JsonValueKind.True or JsonValueKind.False)is4k=k4.GetBoolean();
            if(srv.TryGetProperty("isDefault",out var def)&&def.ValueKind is JsonValueKind.True or JsonValueKind.False)isDefaultServer=def.GetBoolean();
            if(Int(srv,"activeProfileId") is int apv&&apv>0)activeProfileId=apv;
        }
        if(!detail.TryGetProperty("profiles",out var profiles)||profiles.ValueKind!=JsonValueKind.Array)return [];
        var list=new List<QualityProfile>();
        foreach(var p in profiles.EnumerateArray())
        {
            if(Int(p,"id") is not int idVal||idVal<=0)continue;
            var name=Text(p,"name").Trim();
            if(name.Length==0)continue;
            list.Add(new QualityProfile(idVal,name,serverId,rootFolder,is4k,isDefaultServer&&idVal==activeProfileId));
        }
        return list.ToArray();
    }
}
