using System.Text.Json;
using MediaBrowser.Controller.Library;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace Jellyfin.RequestHub;
public sealed class RequestBody {public string Type{get;set;}="";public int Id{get;set;}public int[] Seasons{get;set;}=[];}
[ApiController,Route("RequestHub"),Authorize]
public sealed class HubController(SeerrGateway gateway,IUserManager users):ControllerBase
{
    private UserLink? Link(){var c=Plugin.Instance.Configuration;if(!c.Enabled)return null;var claim=User.Claims.FirstOrDefault(c=>c.Type.Equals("Jellyfin-UserId",StringComparison.OrdinalIgnoreCase))?.Value;return Guid.TryParse(claim,out var id)&&users.GetUserById(id)is not null?HubPolicy.OwnMapping(c.Users,id):null;}
    private async Task<IActionResult> Run(Func<UserLink,Task<IActionResult>> action){var link=Link();if(link is null)return StatusCode(403,new{error="Request Hub is disabled or your account has not been mapped by the administrator."});try{return await action(link);}catch(HubException e){return StatusCode(e.Status is 403 or 409 or 429?e.Status:502,new{error=e.Status==403?"Jellyseerr denied this operation. Check account permissions and request quota.":e.Status==409?"This title or season has already been requested.":"Jellyseerr could not complete the operation. Try again later."});}catch(Exception e)when(e is HttpRequestException or TaskCanceledException or JsonException or InvalidOperationException or KeyNotFoundException){return StatusCode(502,new{error="Jellyseerr is unavailable or returned an unsupported response."});}}
    [HttpGet("Browse")]
    public Task<IActionResult> Browse(string kind="trending",int page=1,string? query=null,int? filter=null)=>Run(async link=>{
        string path;try{path=HubPolicy.BrowsePath(kind,page,query,filter);}catch(ArgumentException){return BadRequest();}
        using var response=await gateway.Send(link,path,null,HttpContext.RequestAborted);var root=response.RootElement;
        if(kind=="genres")return Ok(new{results=root.EnumerateArray().Select(g=>new{id=g.GetProperty("id").GetInt32(),name=g.GetProperty("name").GetString()}).ToArray(),pages=1});
        var today=DateOnly.FromDateTime(DateTime.UtcNow);
        var items=root.GetProperty("results").EnumerateArray().Where(i=>(kind!="search"||i.TryGetProperty("mediaType",out var t)&&t.GetString()is "movie" or "tv")&&Projection.IsReleased(i,today)).Select(i=>Projection.Item(i,kind is "movies" or "genre" or "studio"?"movie":kind=="tv"?"tv":null)).ToArray();
        return Ok(new{results=items,pages=root.TryGetProperty("totalPages",out var count)?count.GetInt32():1,canRequest=link.AllowRequests});
    });
    [HttpGet("Details")]
    public Task<IActionResult> Details(string type,int id)=>Run(async link=>{
        if(type is not("movie" or "tv")||id<=0)return BadRequest();
        using var response=await gateway.Send(link,$"{type}/{id}",null,HttpContext.RequestAborted);var r=response.RootElement;
        var seasons=r.TryGetProperty("seasons",out var ss)&&ss.ValueKind==JsonValueKind.Array?ss.EnumerateArray().Select(s=>s.GetProperty("seasonNumber").GetInt32()).ToArray():Array.Empty<int>();
        return Ok(new{item=Projection.Item(r,type),seasons,canRequest=link.AllowRequests});
    });
    [HttpPost("Request"),RequestSizeLimit(8192)]
    public Task<IActionResult> RequestTitle([FromBody]RequestBody body)=>Run(async link=>{
        if(!link.AllowRequests)return Forbid();
        if(body.Seasons is null||!HubPolicy.RequestValid(body.Type,body.Id,body.Seasons))return BadRequest();
        if(!gateway.PermitWrite(link.JellyfinUserId))return StatusCode(429);
        using var response=await gateway.Send(link,"request",new{mediaType=body.Type,mediaId=body.Id,seasons=body.Seasons,is4k=false},HttpContext.RequestAborted);
        return Ok(new{message="Request submitted. Jellyseerr approval rules and quotas apply."});
    });
}
