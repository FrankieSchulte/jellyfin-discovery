using System.Text.RegularExpressions;
namespace Jellyfin.RequestHub;
public sealed class UserLink
{
    public Guid JellyfinUserId { get; set; }
    public int SeerrUserId { get; set; }
    public bool AllowRequests { get; set; }
}
public static class HubPolicy
{
    public static UserLink? OwnMapping(IEnumerable<UserLink> links, Guid user) => user==Guid.Empty?null:links.SingleOrDefault(l=>l.JellyfinUserId==user&&l.SeerrUserId>0);
    public static Uri BaseUri(string value)
    {
        if(!Uri.TryCreate(value,UriKind.Absolute,out var uri)||uri.Scheme is not("http" or "https")||uri.UserInfo!=""||uri.Query!=""||uri.Fragment!="")throw new ArgumentException("Use an HTTP(S) server URL without credentials, query or fragment.");
        return new Uri(uri.AbsoluteUri.TrimEnd('/')+"/api/v1/");
    }
    public static string BrowsePath(string kind, int page, string? query, int? filter)
    {
        if(page<1||page>500)throw new ArgumentException("Page must be 1–500.");
        string suffix=$"?page={page}";
        return kind switch {
            "trending"=>"discover/trending"+suffix,
            "movies"=>"discover/movies"+suffix,
            "tv"=>"discover/tv"+suffix,
            "search" when !string.IsNullOrWhiteSpace(query)&&query.Length<=200=>"search"+suffix+"&query="+Uri.EscapeDataString(query),
            "genres"=>"discover/genreslider/movie",
            "genre" when filter>0=>$"discover/movies/genre/{filter}"+suffix,
            "studio" when filter>0=>$"discover/movies/studio/{filter}"+suffix,
            "network" when filter>0=>$"discover/tv/network/{filter}"+suffix,
            _=>throw new ArgumentException("Unsupported browse operation.")};
    }
    public static bool RequestValid(string type,int id,int[] seasons) => id>0&&type is "movie" or "tv"&&seasons.Length<=100&&seasons.Distinct().Count()==seasons.Length&&seasons.All(s=>s>=0&&s<1000)&&(type=="tv"?seasons.Length>0:seasons.Length==0);
    public static string? Poster(string? path)=>path is not null&&Regex.IsMatch(path,@"^/[A-Za-z0-9_-]+\.(jpg|png|webp)$",RegexOptions.IgnoreCase)?"https://image.tmdb.org/t/p/w500"+path:null;
    public static string? Backdrop(string? path)=>path is not null&&Regex.IsMatch(path,@"^/[A-Za-z0-9_-]+\.(jpg|png|webp)$",RegexOptions.IgnoreCase)?path:null;
}
