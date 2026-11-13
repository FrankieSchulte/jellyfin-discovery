using System.Text.Json;

namespace FazFort.Discovery;

public static class ConfigPolicy
{
    public static bool Valid(JsonElement c)
    {
        try
        {
            if (c.ValueKind != JsonValueKind.Object || c.GetRawText().Length > 256000 || !Integer(c,"schemaVersion",1,1)) return false;
            var allowed = new HashSet<string> { "schemaVersion","timeZone","cardsPerShelf","batchSize","minimumItems","maxLiveRows","endless","hideWatched","pages" };
            if (c.EnumerateObject().Any(p => !allowed.Contains(p.Name))) return false;
            _ = TimeZoneInfo.FindSystemTimeZoneById(c.GetProperty("timeZone").GetString()!);
            if (!Integer(c,"cardsPerShelf",3,24) || !Integer(c,"batchSize",1,8) || !Integer(c,"minimumItems",1,12) || !Integer(c,"maxLiveRows",12,60) || c.GetProperty("minimumItems").GetInt32() > c.GetProperty("cardsPerShelf").GetInt32()) return false;
            if (!Boolean(c.GetProperty("endless")) || !Boolean(c.GetProperty("hideWatched"))) return false;
            var pages=c.GetProperty("pages"); if (pages.ValueKind != JsonValueKind.Object) return false;
            foreach(var page in new[]{"home","movies","shows"})
            {
                var p=pages.GetProperty(page);
                if (!Strings(p.GetProperty("anchors"),new HashSet<string>{"ContinueWatchingNextUp","RecentlyAddedMovies","RecentlyAddedShows","DiscoverMovies","DiscoverTV","MyJellyseerrRequests","MyMedia"}) ||
                    !Strings(p.GetProperty("families"),new HashSet<string>{"theme","genre","director","actor","decade","studio","rating","rewatch","runtime"})) return false;
                var rules=p.GetProperty("rules"); if(rules.ValueKind!=JsonValueKind.Array || rules.GetArrayLength()>250)return false;
                var ruleKeys=rules.EnumerateArray().Select(r=>r.GetProperty("Key").GetString()).ToHashSet();
                bool Token(string? token) => token is not null && (
                    token.StartsWith("rule:",StringComparison.Ordinal)&&ruleKeys.Contains(token[5..]) ||
                    token.StartsWith("anchor:",StringComparison.Ordinal)&&new[]{"ContinueWatchingNextUp","RecentlyAddedMovies","RecentlyAddedShows","DiscoverMovies","DiscoverTV","MyJellyseerrRequests","MyMedia"}.Contains(token[7..]) ||
                    token.StartsWith("family:",StringComparison.Ordinal)&&new[]{"theme","genre","director","actor","decade","studio","rating","rewatch","runtime"}.Contains(token[7..]));
                if(p.TryGetProperty("opening",out var opening)&&opening.ValueKind!=JsonValueKind.Null&&(opening.ValueKind!=JsonValueKind.Array||opening.GetArrayLength()>250||opening.EnumerateArray().Any(t=>t.ValueKind!=JsonValueKind.String||!Token(t.GetString()))))return false;
                if(p.TryGetProperty("layouts",out var layouts)&&layouts.ValueKind!=JsonValueKind.Null&&(layouts.ValueKind!=JsonValueKind.Object||layouts.EnumerateObject().Count()>500||layouts.EnumerateObject().Any(l=>!Token(l.Name)||l.Value.ValueKind!=JsonValueKind.String||!new[]{"auto","landscape","portrait"}.Contains(l.Value.GetString()))))return false;
                var keys=new HashSet<string>();
                foreach(var rule in rules.EnumerateArray())
                {
                    var key=rule.GetProperty("Key").GetString();var title=rule.GetProperty("Title").GetString();
                    if(string.IsNullOrWhiteSpace(key)||key.Length>60||key.Any(ch=>!char.IsAsciiLetterOrDigit(ch)&&ch!='-')||!keys.Add(key)||string.IsNullOrWhiteSpace(title)||title.Length>120)return false;
                    if(!Strings(rule.GetProperty("Types"),new HashSet<string>{"Movie","Series"})||rule.GetProperty("Types").GetArrayLength()==0)return false;
                    if(rule.TryGetProperty("Layout",out var layout)&&layout.ValueKind!=JsonValueKind.Null&&(layout.ValueKind!=JsonValueKind.String||!new[]{"auto","landscape","portrait"}.Contains(layout.GetString())))return false;
                    if(rule.TryGetProperty("Enabled",out var enabled)&&enabled.ValueKind!=JsonValueKind.Null&&!Boolean(enabled))return false;
                    foreach(var filter in new[]{"GenresAny","TagsAny","DirectorsAny","ActorsAny","StudiosAny"})if(rule.TryGetProperty(filter,out var value)&&value.ValueKind!=JsonValueKind.Null&&!Strings(value))return false;
                    if(rule.TryGetProperty("MinRating",out var rating)&&rating.ValueKind!=JsonValueKind.Null&&(rating.ValueKind!=JsonValueKind.Number||!rating.TryGetDouble(out double d)||!double.IsFinite(d)||d<0||d>10))return false;
                    if(rule.TryGetProperty("MaxMinutes",out var max)&&max.ValueKind!=JsonValueKind.Null&&(max.ValueKind!=JsonValueKind.Number||!max.TryGetInt32(out int m)||m<=0))return false;
                    if(rule.TryGetProperty("Months",out var months)&&months.ValueKind!=JsonValueKind.Null&&(months.ValueKind!=JsonValueKind.Array||months.EnumerateArray().Any(m=>m.ValueKind!=JsonValueKind.Number||!m.TryGetInt32(out int n)||n<1||n>12)))return false;
                    if(rule.TryGetProperty("Years",out var years)&&years.ValueKind!=JsonValueKind.Null&&(years.ValueKind!=JsonValueKind.Array||years.GetArrayLength()!=2||years.EnumerateArray().Any(y=>y.ValueKind!=JsonValueKind.Number||!y.TryGetInt32(out _))||years[0].GetInt32()>years[1].GetInt32()))return false;
                }
            }
            return true;
        }
        catch(Exception e) when(e is InvalidOperationException or KeyNotFoundException or ArgumentException or TimeZoneNotFoundException or InvalidTimeZoneException) { return false; }
    }
    private static bool Integer(JsonElement c,string key,int min,int max)=>c.TryGetProperty(key,out var v)&&v.ValueKind==JsonValueKind.Number&&v.TryGetInt32(out int n)&&n>=min&&n<=max;
    private static bool Boolean(JsonElement value)=>value.ValueKind is JsonValueKind.True or JsonValueKind.False;
    private static bool Strings(JsonElement value,HashSet<string>? allowed=null)=>value.ValueKind==JsonValueKind.Array&&value.GetArrayLength()<=100&&value.EnumerateArray().All(v=>v.ValueKind==JsonValueKind.String&&!string.IsNullOrWhiteSpace(v.GetString())&&v.GetString()!.Length<=1000&&(allowed is null||allowed.Contains(v.GetString()!)));
}
