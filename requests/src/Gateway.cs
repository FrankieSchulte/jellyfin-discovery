using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
namespace Jellyfin.RequestHub;
public sealed class SeerrGateway : IDisposable
{
    private readonly HttpClient client;
    public SeerrGateway():this(new HttpClientHandler{AllowAutoRedirect=false,UseCookies=false}){}
    internal SeerrGateway(HttpMessageHandler handler){client=new HttpClient(handler){Timeout=TimeSpan.FromSeconds(15),MaxResponseContentBufferSize=2_000_000};}
    private readonly Dictionary<Guid,Queue<DateTimeOffset>> writes=[];
    public bool PermitWrite(Guid user){lock(writes){var now=DateTimeOffset.UtcNow;if(!writes.TryGetValue(user,out var queue))writes[user]=queue=new();while(queue.TryPeek(out var old)&&old<now.AddMinutes(-1))queue.Dequeue();if(queue.Count>=10)return false;queue.Enqueue(now);return true;}}
    public async Task<JsonDocument> Send(UserLink link,string path,object? body,CancellationToken token)
    {
        var config=Plugin.Instance.Configuration;
        using var request=new HttpRequestMessage(body is null?HttpMethod.Get:HttpMethod.Post,new Uri(HubPolicy.BaseUri(config.ServerUrl),path));
        request.Headers.Add("X-API-Key",config.ApiKey);request.Headers.Add("X-API-User",link.SeerrUserId.ToString(System.Globalization.CultureInfo.InvariantCulture));
        if(body is not null)request.Content=JsonContent.Create(body);
        using var response=await client.SendAsync(request,token);
        if(!response.IsSuccessStatusCode)throw new HubException(response.StatusCode);
        var bytes=await response.Content.ReadAsByteArrayAsync(token);if(bytes.Length>2_000_000)throw new HubException(HttpStatusCode.BadGateway);
        return JsonDocument.Parse(bytes,new JsonDocumentOptions{MaxDepth=50});
    }
    public void Dispose()=>client.Dispose();
}
public sealed class HubException(HttpStatusCode status):Exception("Upstream operation failed") { public int Status=>(int)status; }
public static class Projection
{
    private static string Text(JsonElement item,string field)=>item.TryGetProperty(field,out var v)&&v.ValueKind==JsonValueKind.String?(v.GetString()??""):"";
    public static object Item(JsonElement item,string? type=null)=>new {
        id=item.TryGetProperty("id",out var id)&&id.TryGetInt32(out var number)?number:0,
        type=type??Text(item,"mediaType"),title=Text(item,"title") is {Length:>0} t?t:Text(item,"name"),
        overview=Text(item,"overview"),poster=HubPolicy.Poster(Text(item,"posterPath")),
        status=item.TryGetProperty("mediaInfo",out var media)&&media.ValueKind==JsonValueKind.Object&&media.TryGetProperty("status",out var status)&&status.TryGetInt32(out var n)?n:0
    };
}
