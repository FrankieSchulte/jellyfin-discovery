using System.Text;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace FazFort.Discovery;

public sealed class OscarsNominee
{
    [JsonPropertyName("title")] public string Title { get; set; } = "";
    [JsonPropertyName("year")] public int? Year { get; set; }
    [JsonPropertyName("tmdbId")] public int? TmdbId { get; set; }
    [JsonPropertyName("poster")] public string? Poster { get; set; }
    [JsonPropertyName("note")] public string? Note { get; set; }
    [JsonPropertyName("winner")] public bool Winner { get; set; }
}

public sealed class OscarsCategory
{
    [JsonPropertyName("key")] public string Key { get; set; } = "";
    [JsonPropertyName("title")] public string Title { get; set; } = "";
    [JsonPropertyName("enabled")] public bool Enabled { get; set; } = true;
    [JsonPropertyName("nominees")] public List<OscarsNominee> Nominees { get; set; } = [];
}

public sealed class OscarsConfig
{
    [JsonPropertyName("enabled")] public bool Enabled { get; set; }
    [JsonPropertyName("startDate")] public string StartDate { get; set; } = "";
    [JsonPropertyName("endDate")] public string EndDate { get; set; } = "";
    [JsonPropertyName("navTitle")] public string NavTitle { get; set; } = "Oscars";
    [JsonPropertyName("ceremonyTitle")] public string CeremonyTitle { get; set; } = "98th Academy Awards";
    [JsonPropertyName("categories")] public List<OscarsCategory> Categories { get; set; } = [];
}

public sealed class OscarsAssetUpload
{
    [JsonPropertyName("dataUrl")] public string DataUrl { get; set; } = "";
}

public static partial class OscarsPolicy
{
    public const int MaxAssetBytes = 5_000_000;
    private static readonly Regex KeyPattern = BuildKeyPattern();
    private static readonly Regex TmdbPathPattern = BuildTmdbPathPattern();
    private static readonly Regex UnsafeSvgPattern = BuildUnsafeSvgPattern();

    [GeneratedRegex("^[a-zA-Z0-9-]{1,64}$")]
    private static partial Regex BuildKeyPattern();

    [GeneratedRegex("^/[a-zA-Z0-9._-]{1,120}\\.(jpg|jpeg|png|webp)$", RegexOptions.IgnoreCase)]
    private static partial Regex BuildTmdbPathPattern();

    [GeneratedRegex("<\\s*(script|foreignObject|iframe|object|embed|meta|link|base)\\b|\\bon[a-z]+\\s*=|javascript:|data:text/html", RegexOptions.IgnoreCase)]
    private static partial Regex BuildUnsafeSvgPattern();

    public static bool TryParseDate(string? raw, out DateOnly date)
    {
        if (string.IsNullOrWhiteSpace(raw))
        {
            date = default;
            return false;
        }
        return DateOnly.TryParseExact(raw.Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out date);
    }

    public static bool IsActive(OscarsConfig config, string? timeZoneId, DateTimeOffset utcNow)
    {
        if (config is null || !config.Enabled) return false;
        TimeZoneInfo tz;
        try { tz = string.IsNullOrWhiteSpace(timeZoneId) ? TimeZoneInfo.Utc : TimeZoneInfo.FindSystemTimeZoneById(timeZoneId); }
        catch { tz = TimeZoneInfo.Utc; }
        var localToday = DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(utcNow, tz).DateTime);
        if (TryParseDate(config.StartDate, out var start) && localToday < start) return false;
        if (TryParseDate(config.EndDate, out var end) && localToday > end) return false;
        return true;
    }

    public static string? NormalizePoster(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return null;
        var s = raw.Trim();
        if (TmdbPathPattern.IsMatch(s)) return "https://image.tmdb.org/t/p/w500" + s;
        if (Uri.TryCreate(s, UriKind.Absolute, out var uri) && uri.Scheme == Uri.UriSchemeHttps && uri.Host.Equals("image.tmdb.org", StringComparison.OrdinalIgnoreCase) && uri.AbsolutePath.StartsWith("/t/p/", StringComparison.Ordinal))
        {
            return uri.AbsoluteUri;
        }
        return null;
    }

    public static OscarsConfig ValidateAndNormalize(OscarsConfig? input)
    {
        if (input is null) throw new ArgumentException("Oscars configuration is required.");
        string startStr = (input.StartDate ?? "").Trim();
        string endStr = (input.EndDate ?? "").Trim();
        DateOnly? startDate = null;
        DateOnly? endDate = null;
        if (startStr.Length > 0)
        {
            if (!TryParseDate(startStr, out var s)) throw new ArgumentException("Start date must use YYYY-MM-DD format.");
            startDate = s;
        }
        if (endStr.Length > 0)
        {
            if (!TryParseDate(endStr, out var e)) throw new ArgumentException("End date must use YYYY-MM-DD format.");
            endDate = e;
        }
        if (startDate.HasValue && endDate.HasValue && startDate.Value > endDate.Value)
        {
            throw new ArgumentException("Start date cannot be after end date.");
        }
        string navTitle = string.IsNullOrWhiteSpace(input.NavTitle) ? "Oscars" : input.NavTitle.Trim();
        if (navTitle.Length > 32) throw new ArgumentException("Navigation title must be 1–32 characters.");
        string ceremonyTitle = string.IsNullOrWhiteSpace(input.CeremonyTitle) ? "Academy Awards" : input.CeremonyTitle.Trim();
        if (ceremonyTitle.Length > 80) throw new ArgumentException("Ceremony title must be 1–80 characters.");
        var rawCats = input.Categories ?? [];
        if (rawCats.Count > 50) throw new ArgumentException("Use at most 50 Oscars categories.");

        var seenKeys = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var cleanCats = new List<OscarsCategory>();
        foreach (var cat in rawCats)
        {
            if (cat is null) continue;
            string key = (cat.Key ?? "").Trim();
            string title = (cat.Title ?? "").Trim();
            if (!KeyPattern.IsMatch(key) || !seenKeys.Add(key)) throw new ArgumentException($"Invalid or duplicate category key: '{key}'.");
            if (title.Length == 0 || title.Length > 90) throw new ArgumentException($"Category '{key}' needs a title between 1 and 90 characters.");
            var rawNominees = cat.Nominees ?? [];
            if (rawNominees.Count > 40) throw new ArgumentException($"Category '{title}' has too many nominees (max 40).");
            var cleanNominees = new List<OscarsNominee>();
            foreach (var nom in rawNominees)
            {
                if (nom is null) continue;
                string nomTitle = (nom.Title ?? "").Trim();
                if (nomTitle.Length == 0 || nomTitle.Length > 160) throw new ArgumentException($"Invalid nominee title in '{title}'.");
                int? year = nom.Year is >= 1888 and <= 2100 ? nom.Year : null;
                int? tmdbId = nom.TmdbId is > 0 ? nom.TmdbId : null;
                string? poster = null;
                if (!string.IsNullOrWhiteSpace(nom.Poster))
                {
                    poster = NormalizePoster(nom.Poster) ?? throw new ArgumentException($"Poster URL for '{nomTitle}' must be a valid TMDb image path or URL.");
                }
                string? note = string.IsNullOrWhiteSpace(nom.Note) ? null : nom.Note.Trim();
                if (note is { Length: > 140 }) note = note[..140];
                cleanNominees.Add(new OscarsNominee
                {
                    Title = nomTitle,
                    Year = year,
                    TmdbId = tmdbId,
                    Poster = poster,
                    Note = note,
                    Winner = nom.Winner
                });
            }
            cleanCats.Add(new OscarsCategory
            {
                Key = key,
                Title = title,
                Enabled = cat.Enabled,
                Nominees = cleanNominees
            });
        }

        return new OscarsConfig
        {
            Enabled = input.Enabled,
            StartDate = startStr,
            EndDate = endStr,
            NavTitle = navTitle,
            CeremonyTitle = ceremonyTitle,
            Categories = cleanCats
        };
    }

    public static (byte[] Bytes, string Extension, string ContentType) ValidateAsset(string kind, string? dataUrl)
    {
        if (kind is not ("hero" or "logo")) throw new ArgumentException("Asset kind must be 'hero' or 'logo'.");
        if (string.IsNullOrWhiteSpace(dataUrl)) throw new ArgumentException("Image data is required.");
        int comma = dataUrl.IndexOf(',');
        if (comma <= 0 || !dataUrl[..comma].StartsWith("data:", StringComparison.OrdinalIgnoreCase) || !dataUrl[..comma].Contains(";base64", StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException("Upload must be a base64 image data URL.");
        }
        byte[] bytes;
        try { bytes = Convert.FromBase64String(dataUrl[(comma + 1)..].Trim()); }
        catch (FormatException) { throw new ArgumentException("Invalid base64 image payload."); }
        if (bytes.Length == 0 || bytes.Length > MaxAssetBytes) throw new ArgumentException("Image must be between 1 byte and 5 MB.");

        if (bytes.Length >= 8 && bytes[0] == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47 && bytes[4] == 0x0D && bytes[5] == 0x0A && bytes[6] == 0x1A && bytes[7] == 0x0A)
        {
            return (bytes, ".png", "image/png");
        }
        if (bytes.Length >= 3 && bytes[0] == 0xFF && bytes[1] == 0xD8 && bytes[2] == 0xFF)
        {
            return (bytes, ".jpg", "image/jpeg");
        }
        if (bytes.Length >= 12 && bytes[0] == 0x52 && bytes[1] == 0x49 && bytes[2] == 0x46 && bytes[3] == 0x46 && bytes[8] == 0x57 && bytes[9] == 0x45 && bytes[10] == 0x42 && bytes[11] == 0x50)
        {
            return (bytes, ".webp", "image/webp");
        }
        if (kind == "logo")
        {
            string text = Encoding.UTF8.GetString(bytes).TrimStart('\uFEFF', ' ', '\t', '\r', '\n');
            if ((text.StartsWith("<svg", StringComparison.OrdinalIgnoreCase) || text.StartsWith("<?xml", StringComparison.OrdinalIgnoreCase))
                && text.Contains("<svg", StringComparison.OrdinalIgnoreCase)
                && !UnsafeSvgPattern.IsMatch(text))
            {
                return (bytes, ".svg", "image/svg+xml; charset=utf-8");
            }
        }
        throw new ArgumentException(kind == "logo"
            ? "Unsupported image format. Upload a PNG, JPEG, WebP, or static SVG logo."
            : "Unsupported image format. Upload a PNG, JPEG, or WebP hero backdrop.");
    }

    private static OscarsNominee N(string title, int year, string? note = null, bool winner = false) => new()
    {
        Title = title,
        Year = year,
        Note = note,
        Winner = winner
    };

    private static OscarsCategory C(string key, string title, params OscarsNominee[] nominees) => new()
    {
        Key = key,
        Title = title,
        Enabled = true,
        Nominees = [.. nominees]
    };

    public static OscarsConfig DefaultConfig() => new()
    {
        Enabled = false,
        StartDate = "",
        EndDate = "",
        NavTitle = "Oscars",
        CeremonyTitle = "98th Academy Awards",
        Categories =
        [
            C("best-picture", "Best Picture",
                N("One Battle After Another", 2025, winner: true),
                N("Sinners", 2025),
                N("Hamnet", 2025),
                N("Marty Supreme", 2025),
                N("Sentimental Value", 2025),
                N("Bugonia", 2025),
                N("F1", 2025),
                N("Frankenstein", 2025),
                N("The Secret Agent", 2025),
                N("Train Dreams", 2025)),
            C("best-director", "Best Director",
                N("One Battle After Another", 2025, "Paul Thomas Anderson", true),
                N("Sinners", 2025, "Ryan Coogler"),
                N("Marty Supreme", 2025, "Josh Safdie"),
                N("Sentimental Value", 2025, "Joachim Trier"),
                N("Hamnet", 2025, "Chloé Zhao")),
            C("best-actor", "Best Actor",
                N("Sinners", 2025, "Michael B. Jordan", true),
                N("Marty Supreme", 2025, "Timothée Chalamet"),
                N("One Battle After Another", 2025, "Leonardo DiCaprio"),
                N("Blue Moon", 2025, "Ethan Hawke"),
                N("The Secret Agent", 2025, "Wagner Moura")),
            C("best-actress", "Best Actress",
                N("Hamnet", 2025, "Jessie Buckley", true),
                N("If I Had Legs I'd Kick You", 2025, "Rose Byrne"),
                N("Song Sung Blue", 2025, "Kate Hudson"),
                N("Sentimental Value", 2025, "Renate Reinsve"),
                N("Bugonia", 2025, "Emma Stone")),
            C("best-supporting-actor", "Best Supporting Actor",
                N("One Battle After Another", 2025, "Sean Penn", true),
                N("One Battle After Another", 2025, "Benicio Del Toro"),
                N("Frankenstein", 2025, "Jacob Elordi"),
                N("Sinners", 2025, "Delroy Lindo"),
                N("Sentimental Value", 2025, "Stellan Skarsgård")),
            C("best-supporting-actress", "Best Supporting Actress",
                N("Weapons", 2025, "Amy Madigan", true),
                N("Sentimental Value", 2025, "Elle Fanning"),
                N("Sentimental Value", 2025, "Inga Ibsdotter Lilleaas"),
                N("Sinners", 2025, "Wunmi Mosaku"),
                N("One Battle After Another", 2025, "Teyana Taylor")),
            C("best-casting", "Best Casting",
                N("One Battle After Another", 2025, "Cassandra Kulukundis", true),
                N("Hamnet", 2025, "Nina Gold"),
                N("Marty Supreme", 2025, "Jennifer Venditti"),
                N("The Secret Agent", 2025, "Gabriel Domingues"),
                N("Sinners", 2025, "Francine Maisler")),
            C("best-original-screenplay", "Best Original Screenplay",
                N("Sinners", 2025, "Ryan Coogler", true),
                N("Blue Moon", 2025, "Robert Kaplow"),
                N("It Was Just an Accident", 2025, "Jafar Panahi"),
                N("Marty Supreme", 2025, "Ronald Bronstein & Josh Safdie"),
                N("Sentimental Value", 2025, "Eskil Vogt & Joachim Trier")),
            C("best-adapted-screenplay", "Best Adapted Screenplay",
                N("One Battle After Another", 2025, "Paul Thomas Anderson", true),
                N("Bugonia", 2025, "Will Tracy"),
                N("Frankenstein", 2025, "Guillermo del Toro"),
                N("Hamnet", 2025, "Chloé Zhao & Maggie O'Farrell"),
                N("Train Dreams", 2025, "Clint Bentley & Greg Kwedar")),
            C("best-animated-feature", "Best Animated Feature",
                N("KPop Demon Hunters", 2025, winner: true),
                N("Arco", 2025),
                N("Elio", 2025),
                N("Little Amélie or the Character of Rain", 2025),
                N("Zootopia 2", 2025)),
            C("best-international-feature", "Best International Feature",
                N("Sentimental Value", 2025, "Norway", true),
                N("It Was Just an Accident", 2025, "France"),
                N("The Secret Agent", 2025, "Brazil"),
                N("Sirāt", 2025, "Spain"),
                N("The Voice of Hind Rajab", 2025, "Tunisia")),
            C("best-documentary-feature", "Best Documentary Feature",
                N("The Alabama Solution", 2025),
                N("Come See Me in the Good Light", 2025),
                N("Cutting Through Rocks", 2025),
                N("Mr Nobody Against Putin", 2025),
                N("The Perfect Neighbor", 2025)),
            C("best-cinematography", "Best Cinematography",
                N("Sinners", 2025, "Autumn Durald Arkapaw", true),
                N("Frankenstein", 2025, "Dan Laustsen"),
                N("Marty Supreme", 2025, "Darius Khondji"),
                N("One Battle After Another", 2025, "Michael Bauman"),
                N("Train Dreams", 2025, "Adolpho Veloso")),
            C("best-film-editing", "Best Film Editing",
                N("One Battle After Another", 2025, "Andy Jurgensen", true),
                N("F1", 2025, "Stephen Mirrione"),
                N("Marty Supreme", 2025, "Ronald Bronstein & Josh Safdie"),
                N("Sentimental Value", 2025, "Olivier Bugge Coutté"),
                N("Sinners", 2025, "Michael P. Shawver")),
            C("best-production-design", "Best Production Design",
                N("Frankenstein", 2025, winner: true),
                N("Hamnet", 2025),
                N("Marty Supreme", 2025),
                N("One Battle After Another", 2025),
                N("Sinners", 2025)),
            C("best-costume-design", "Best Costume Design",
                N("Avatar: Fire and Ash", 2025),
                N("Frankenstein", 2025),
                N("Hamnet", 2025),
                N("Marty Supreme", 2025),
                N("Sinners", 2025)),
            C("best-makeup-hairstyling", "Best Makeup and Hairstyling",
                N("Frankenstein", 2025, winner: true),
                N("Kokuho", 2025),
                N("Sinners", 2025),
                N("The Smashing Machine", 2025),
                N("The Ugly Stepsister", 2025)),
            C("best-original-score", "Best Original Score",
                N("Sinners", 2025, "Ludwig Göransson", true),
                N("Bugonia", 2025, "Jerskin Fendrix"),
                N("Frankenstein", 2025, "Alexandre Desplat"),
                N("Hamnet", 2025, "Max Richter"),
                N("One Battle After Another", 2025, "Jonny Greenwood")),
            C("best-original-song", "Best Original Song",
                N("KPop Demon Hunters", 2025, "“Golden”", true),
                N("Diane Warren: Relentless", 2025, "“Dear Me”"),
                N("Sinners", 2025, "“I Lied To You”"),
                N("Viva Verdi!", 2025, "“Sweet Dreams Of Joy”"),
                N("Train Dreams", 2025, "“Train Dreams”")),
            C("best-sound", "Best Sound",
                N("F1", 2025, winner: true),
                N("Frankenstein", 2025),
                N("One Battle After Another", 2025),
                N("Sinners", 2025),
                N("Sirāt", 2025)),
            C("best-visual-effects", "Best Visual Effects",
                N("Avatar: Fire and Ash", 2025, winner: true),
                N("F1", 2025),
                N("Jurassic World Rebirth", 2025),
                N("The Lost Bus", 2025),
                N("Sinners", 2025)),
            C("best-animated-short", "Best Animated Short Film",
                N("The Girl Who Cried Pearls", 2025, winner: true),
                N("Butterfly", 2025),
                N("Forevergreen", 2025),
                N("Retirement Plan", 2025),
                N("The Three Sisters", 2025)),
            C("best-live-action-short", "Best Live Action Short Film",
                N("The Singers", 2025, winner: true),
                N("Two People Exchanging Saliva", 2025, winner: true),
                N("Butcher's Stain", 2025),
                N("A Friend of Dorothy", 2025),
                N("Jane Austen's Period Drama", 2025)),
            C("best-documentary-short", "Best Documentary Short Film",
                N("All the Empty Rooms", 2025, winner: true),
                N("Armed Only with a Camera: The Life and Death of Brent Renaud", 2025),
                N("Children No More: \"Were and Are Gone\"", 2025),
                N("The Devil Is Busy", 2025),
                N("Perfectly a Strangeness", 2025))
        ]
    };
}
