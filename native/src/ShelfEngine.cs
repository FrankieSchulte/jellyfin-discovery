using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace FazFort.Discovery;

public sealed class ShelfRule
{
    public string Key { get; set; } = "";
    public string Title { get; set; } = "";
    public bool Enabled { get; set; } = true;
    public string[] Types { get; set; } = ["Movie"];
    public string[] GenresAny { get; set; } = [];
    public string[] TagsAny { get; set; } = [];
    public double? MinRating { get; set; }
    public int? MaxMinutes { get; set; }
    public int[] Months { get; set; } = [];
}

public sealed record Candidate(Guid Id, string Type, string[] Genres, string[] Tags,
    double? Rating, long? RuntimeTicks, bool Played);

public static class ShelfEngine
{
    public static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true, WriteIndented = true };
    public static string DefaultRules => JsonSerializer.Serialize(new ShelfRule[]
    {
        new() { Key="popcorn", Title="Perfect Popcorn Movies", GenresAny=["Action","Adventure"] },
        new() { Key="laugh", Title="Need a Good Laugh?", GenresAny=["Comedy"] },
        new() { Key="incredible", Title="Just Simply Incredible Movies", MinRating=8 },
        new() { Key="short", Title="Movie Night Under Two Hours", MaxMinutes=120 },
        new() { Key="scifi", Title="Sci-Fi & Fantasy Movies", GenresAny=["Science Fiction","Fantasy"] },
        new() { Key="horror", Title="Something Spooky", GenresAny=["Horror","Thriller"] },
        new() { Key="anime", Title="Anime Night", Types=["Movie","Series"], TagsAny=["anime"] },
        new() { Key="games", Title="From Controller to Screen", Types=["Movie","Series"], TagsAny=["based on video game"] },
        new() { Key="time", Title="Time Gets Weird", Types=["Movie","Series"], TagsAny=["time travel"] },
        new() { Key="comfort", Title="Comfort Watches", Types=["Movie","Series"], TagsAny=["comforting","lighthearted"] },
        new() { Key="halloween", Title="Halloween Movies", TagsAny=["halloween"], Months=[10] },
        new() { Key="christmas", Title="Christmas Movies", TagsAny=["christmas"], Months=[12] }
    }, JsonOptions);

    public static List<ShelfRule> Parse(string json)
    {
        List<ShelfRule> rules = JsonSerializer.Deserialize<List<ShelfRule>>(json, JsonOptions)
            ?? throw new ArgumentException("Rules must be an array.");
        if (rules.Count > 50) throw new ArgumentException("Use at most 50 shelves.");
        HashSet<string> keys = new(StringComparer.Ordinal);
        foreach (ShelfRule r in rules)
        {
            if (string.IsNullOrWhiteSpace(r.Key) || r.Key.Length > 60 ||
                r.Key.Any(c => !char.IsAsciiLetterOrDigit(c) && c != '-') || !keys.Add(r.Key))
                throw new ArgumentException("Shelf keys must be unique letters, digits or hyphens (1–60 characters).");
            if (string.IsNullOrWhiteSpace(r.Title) || r.Title.Length > 100) throw new ArgumentException("Each title needs 1–100 characters.");
            if (r.Types is null || r.Types.Length == 0 || r.Types.Any(t => t is not ("Movie" or "Series")))
                throw new ArgumentException("Types must contain Movie and/or Series.");
            if (r.GenresAny is null || r.TagsAny is null || r.Months is null ||
                r.GenresAny.Concat(r.TagsAny).Any(string.IsNullOrWhiteSpace)) throw new ArgumentException("Filters cannot contain null/blank entries.");
            if (r.Months.Any(m => m < 1 || m > 12)) throw new ArgumentException("Months must be 1–12, or [] for year-round.");
            if (r.MinRating is double rating && (!double.IsFinite(rating) || rating < 0 || rating > 10)) throw new ArgumentException("Rating must be 0–10.");
            if (r.MaxMinutes is <= 0) throw new ArgumentException("MaxMinutes must be positive.");
        }
        return rules;
    }

    public static bool Matches(ShelfRule r, Candidate c, bool hideWatched) =>
        r.Types.Contains(c.Type, StringComparer.Ordinal) && (!hideWatched || !c.Played) &&
        (r.GenresAny.Length == 0 || r.GenresAny.Intersect(c.Genres, StringComparer.OrdinalIgnoreCase).Any()) &&
        (r.TagsAny.Length == 0 || r.TagsAny.Intersect(c.Tags, StringComparer.OrdinalIgnoreCase).Any()) &&
        (r.MinRating is null || c.Rating >= r.MinRating) &&
        (r.MaxMinutes is null || (c.RuntimeTicks > 0 && c.RuntimeTicks < TimeSpan.FromMinutes(r.MaxMinutes.Value).Ticks));

    // SHA256 ordering avoids process-randomized string hashes. The same user/date/settings
    // produce a stable plan regardless of the order HSS requests individual shelves.
    private static string Rank(string seed, string value) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(seed + ":" + value)));
    public static Guid SectionId(string key)
    {
        // HSS 3.0.4 uses raw IDs in querySelector without CSS.escape. Keep valid
        // GUIDs, but ensure the first hex character is a letter for CSS safety.
        string legacy = new Guid(SHA256.HashData(Encoding.UTF8.GetBytes("FazFort.Shelves/v1/" + key)).AsSpan(0,16)).ToString();
        return Guid.Parse(char.IsAsciiDigit(legacy[0]) ? "a" + legacy[1..] : legacy);
    }

    public static Dictionary<string, Guid[]> Plan(List<ShelfRule> rules, IReadOnlyList<Candidate> candidates,
        Guid user, DateOnly date, int dailyCount, int cardCount, int minimum, bool hideWatched)
    {
        string seed = user.ToString("N") + ":" + date.ToString("yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
        Dictionary<string, Guid[]> result = new(StringComparer.Ordinal);
        HashSet<Guid> used = [];
        int normalCount = 0;
        IEnumerable<ShelfRule> ordered = rules.Where(r => r.Enabled && (r.Months.Length == 0 || r.Months.Contains(date.Month)))
            .OrderBy(r => r.Months.Length == 0 ? 1 : 0).ThenBy(r => Rank(seed, r.Key), StringComparer.Ordinal);
        foreach (ShelfRule rule in ordered)
        {
            bool seasonal = rule.Months.Length != 0;
            if (!seasonal && normalCount >= dailyCount) continue;
            Guid[] ids = candidates.Where(c => !used.Contains(c.Id) && Matches(rule,c,hideWatched))
                .OrderBy(c => Rank(seed + ":" + rule.Key, c.Id.ToString("N")), StringComparer.Ordinal)
                .Select(c => c.Id).Distinct().Take(cardCount).ToArray();
            if (ids.Length < minimum) continue;
            result.Add(rule.Key, ids);
            used.UnionWith(ids);
            if (!seasonal) normalCount++;
        }
        return result;
    }
}
