using System.Collections.Concurrent;
using System.Globalization;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Jellyfin.Data.Enums;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Controller.Entities;
using MediaBrowser.Controller.Library;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FazFort.Discovery;

public sealed class RatingEntry
{
    public int? CriticScore { get; set; }
    public string? CriticState { get; set; }
    public int? AudienceScore { get; set; }
    public string? AudienceState { get; set; }
    public string? RtSlug { get; set; }
    public string Source { get; set; } = "none";
    public DateTimeOffset CheckedAt { get; set; }
}

public sealed class RatingResult
{
    public int? CriticScore { get; set; }
    public string? CriticState { get; set; }
    public int? AudienceScore { get; set; }
    public string? AudienceState { get; set; }
    public string Source { get; set; } = "none";
    public bool Pending { get; set; }
}

internal sealed class RatingsCacheFile
{
    public int Schema { get; set; } = 1;
    public Dictionary<string, RatingEntry> Items { get; set; } = [];
    public Dictionary<string, string> ImdbToSlug { get; set; } = [];
}

public sealed class RatingsService : IDisposable
{
    private static readonly TimeSpan HitTtl = TimeSpan.FromDays(14);
    private static readonly TimeSpan MissTtl = TimeSpan.FromDays(3);
    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = false };
    private static readonly Regex ImdbPattern = new(@"^tt\d{5,10}$", RegexOptions.Compiled | RegexOptions.CultureInvariant);
    private static readonly Regex ScorecardRegex = new(@"<script[^>]*id=[""']media-scorecard-json[""'][^>]*>(.*?)</script>", RegexOptions.Compiled | RegexOptions.Singleline | RegexOptions.IgnoreCase);
    private static readonly Regex JsonLdRegex = new(@"<script[^>]*type=[""']application/ld\+json[""'][^>]*>(.*?)</script>", RegexOptions.Compiled | RegexOptions.Singleline | RegexOptions.IgnoreCase);
    private static readonly Regex SearchRowRegex = new(@"<search-page-media-row\b[^>]*>.*?</search-page-media-row>", RegexOptions.Compiled | RegexOptions.Singleline | RegexOptions.IgnoreCase);
    private static readonly Regex ReleaseYearAttrRegex = new(@"release-year=[""'](\d{4})[""']", RegexOptions.Compiled | RegexOptions.IgnoreCase);
    private static readonly Regex RtHrefRegex = new(@"href=[""']https?://(?:www\.)?rottentomatoes\.com/((?:m|tv)/[a-z0-9_\-]+)[""']", RegexOptions.Compiled | RegexOptions.IgnoreCase);
    private static readonly Regex YearFourDigitRegex = new(@"\b(19\d{2}|20\d{2})\b", RegexOptions.Compiled);
    private static readonly Regex NonAlnumRegex = new(@"[^a-z0-9]+", RegexOptions.Compiled);

    private readonly object gate = new();
    private readonly string cachePath;
    private readonly ILibraryManager library;
    private readonly ILogger<RatingsService> logger;
    private readonly HttpClient http;
    private readonly SemaphoreSlim fetchGate = new(2, 2);
    private readonly ConcurrentQueue<Guid> priorityQueue = new();
    private readonly ConcurrentDictionary<Guid, byte> queuedSet = new();
    private readonly ConcurrentDictionary<Guid, Task<RatingEntry>> inflight = new();

    private RatingsCacheFile cache = new();
    private bool loaded;
    private bool dirty;
    private DateTimeOffset lastSaved = DateTimeOffset.MinValue;

    public RatingsService(IApplicationPaths paths, ILibraryManager libraryManager, ILogger<RatingsService> log)
    {
        cachePath = Path.Combine(paths.DataPath, "fazfort-discovery", "ratings-cache.json");
        library = libraryManager;
        logger = log;

        var handler = new SocketsHttpHandler
        {
            AutomaticDecompression = DecompressionMethods.All,
            PooledConnectionLifetime = TimeSpan.FromMinutes(5),
            AllowAutoRedirect = true,
            MaxAutomaticRedirections = 5
        };
        http = new HttpClient(handler, disposeHandler: true)
        {
            Timeout = TimeSpan.FromSeconds(8)
        };
        http.DefaultRequestHeaders.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36");
        http.DefaultRequestHeaders.TryAddWithoutValidation("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        http.DefaultRequestHeaders.TryAddWithoutValidation("Accept-Language", "en-US,en;q=0.9");
    }

    public void EnsureLoaded()
    {
        lock (gate)
        {
            if (loaded) return;
            loaded = true;
            try
            {
                if (File.Exists(cachePath))
                {
                    var parsed = JsonSerializer.Deserialize<RatingsCacheFile>(File.ReadAllText(cachePath), JsonOptions);
                    if (parsed is not null && parsed.Schema == 1)
                    {
                        cache = parsed;
                        cache.Items ??= [];
                        cache.ImdbToSlug ??= [];
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "FazFort could not load ratings cache; starting with a fresh cache.");
                cache = new RatingsCacheFile();
            }
        }
    }

    public async Task<Dictionary<string, RatingResult>> GetRatingsAsync(IReadOnlyList<BaseItem> items, bool syncFetch, CancellationToken ct)
    {
        EnsureLoaded();
        var now = DateTimeOffset.UtcNow;
        var results = new Dictionary<string, RatingResult>(items.Count);
        var toFetchSync = new List<BaseItem>();

        foreach (var item in items)
        {
            var key = item.Id.ToString("N");
            RatingEntry? entry;
            lock (gate)
            {
                cache.Items.TryGetValue(key, out entry);
            }

            if (entry is not null && IsFresh(entry, now))
            {
                results[key] = ToResult(entry, item, pending: false);
                continue;
            }

            if (syncFetch && toFetchSync.Count < 3)
            {
                toFetchSync.Add(item);
            }
            else
            {
                EnqueuePriority(item.Id);
                results[key] = ToResult(entry, item, pending: true);
            }
        }

        if (toFetchSync.Count > 0)
        {
            using var syncCts = CancellationTokenSource.CreateLinkedTokenSource(ct);
            syncCts.CancelAfter(TimeSpan.FromSeconds(5));
            var tasks = toFetchSync.Select(async item =>
            {
                var key = item.Id.ToString("N");
                try
                {
                    var fetched = await FetchOrJoinAsync(item, syncCts.Token).ConfigureAwait(false);
                    return (key, ToResult(fetched, item, pending: false));
                }
                catch
                {
                    EnqueuePriority(item.Id);
                    return (key, ToResult(null, item, pending: true));
                }
            }).ToArray();

            var completed = await Task.WhenAll(tasks).ConfigureAwait(false);
            foreach (var (key, res) in completed)
            {
                results[key] = res;
            }
            SaveIfDirty(force: true);
        }

        return results;
    }

    public void EnqueuePriority(Guid itemId)
    {
        if (itemId == Guid.Empty) return;
        if (queuedSet.TryAdd(itemId, 0))
        {
            priorityQueue.Enqueue(itemId);
        }
    }

    internal bool TryDequeuePriority(out Guid itemId)
    {
        if (priorityQueue.TryDequeue(out itemId))
        {
            queuedSet.TryRemove(itemId, out _);
            return true;
        }
        return false;
    }

    internal bool NeedsFetch(Guid itemId, DateTimeOffset now)
    {
        EnsureLoaded();
        var key = itemId.ToString("N");
        lock (gate)
        {
            return !cache.Items.TryGetValue(key, out var entry) || !IsFresh(entry, now);
        }
    }

    internal async Task ResolveWikidataSlugsAsync(IReadOnlyList<BaseItem> items, CancellationToken ct)
    {
        EnsureLoaded();
        var missingImdbs = new List<string>();
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        lock (gate)
        {
            foreach (var item in items)
            {
                var imdb = GetImdbId(item);
                if (imdb is null || !seen.Add(imdb)) continue;
                if (!cache.ImdbToSlug.ContainsKey(imdb)) missingImdbs.Add(imdb);
            }
        }

        for (int offset = 0; offset < missingImdbs.Count && !ct.IsCancellationRequested; offset += 40)
        {
            var batch = missingImdbs.Skip(offset).Take(40).ToArray();
            try
            {
                var resolved = await QueryWikidataBatchAsync(batch, ct).ConfigureAwait(false);
                lock (gate)
                {
                    foreach (var imdb in batch)
                    {
                        cache.ImdbToSlug[imdb] = resolved.TryGetValue(imdb, out var slug) ? slug : string.Empty;
                    }
                    dirty = true;
                }
                SaveIfDirty(force: false);
            }
            catch (OperationCanceledException) when (ct.IsCancellationRequested)
            {
                return;
            }
            catch (Exception ex)
            {
                logger.LogDebug(ex, "FazFort Wikidata RT slug batch lookup skipped.");
                break;
            }

            if (offset + 40 < missingImdbs.Count)
            {
                await Task.Delay(350, ct).ConfigureAwait(false);
            }
        }
    }

    internal async Task<RatingEntry> FetchOrJoinAsync(BaseItem item, CancellationToken ct)
    {
        var task = inflight.GetOrAdd(item.Id, _ => FetchItemInternalAsync(item, ct));
        try
        {
            return await task.ConfigureAwait(false);
        }
        finally
        {
            inflight.TryRemove(item.Id, out _);
        }
    }

    private async Task<RatingEntry> FetchItemInternalAsync(BaseItem item, CancellationToken ct)
    {
        EnsureLoaded();
        var now = DateTimeOffset.UtcNow;
        var key = item.Id.ToString("N");
        var isSeries = item.GetBaseItemKind() == BaseItemKind.Series;
        var prefix = isSeries ? "tv" : "m";
        var imdb = GetImdbId(item);

        string? wikidataSlug = null;
        if (imdb is not null)
        {
            bool known;
            lock (gate)
            {
                known = cache.ImdbToSlug.TryGetValue(imdb, out var cachedSlug);
                if (known) wikidataSlug = cachedSlug;
            }
            if (!known)
            {
                try
                {
                    var single = await QueryWikidataBatchAsync([imdb], ct).ConfigureAwait(false);
                    wikidataSlug = single.TryGetValue(imdb, out var s) ? s : string.Empty;
                    lock (gate)
                    {
                        cache.ImdbToSlug[imdb] = wikidataSlug;
                        dirty = true;
                    }
                }
                catch
                {
                    wikidataSlug = null;
                }
            }
        }

        RatingEntry? parsed = null;
        if (!string.IsNullOrWhiteSpace(wikidataSlug))
        {
            parsed = await TryFetchRtPageAsync(wikidataSlug, item.ProductionYear, verifyYear: false, ct).ConfigureAwait(false);
        }

        if (parsed is null)
        {
            foreach (var candidate in BuildSlugCandidates(item.Name, prefix, item.ProductionYear))
            {
                if (ct.IsCancellationRequested) break;
                if (string.Equals(candidate, wikidataSlug, StringComparison.OrdinalIgnoreCase)) continue;
                parsed = await TryFetchRtPageAsync(candidate, item.ProductionYear, verifyYear: item.ProductionYear is not null, ct).ConfigureAwait(false);
                if (parsed is not null) break;
            }
        }

        if (parsed is null && !string.IsNullOrWhiteSpace(item.Name))
        {
            var searchedSlug = await TrySearchRtSlugAsync(item.Name, prefix, item.ProductionYear, ct).ConfigureAwait(false);
            if (!string.IsNullOrWhiteSpace(searchedSlug))
            {
                parsed = await TryFetchRtPageAsync(searchedSlug, item.ProductionYear, verifyYear: false, ct).ConfigureAwait(false);
            }
        }

        if (parsed is null)
        {
            parsed = BuildFallbackEntry(item, now);
        }
        else
        {
            parsed.CheckedAt = now;
            if (parsed.CriticScore is null && item.CriticRating is { } cr && cr > 0)
            {
                int rounded = Math.Clamp((int)Math.Round(cr), 0, 100);
                parsed.CriticScore = rounded;
                parsed.CriticState = rounded >= 60 ? "fresh" : "rotten";
            }
        }

        lock (gate)
        {
            cache.Items[key] = parsed;
            dirty = true;
        }
        SaveIfDirty(force: false);
        return parsed;
    }

    private async Task<Dictionary<string, string>> QueryWikidataBatchAsync(IReadOnlyList<string> imdbs, CancellationToken ct)
    {
        var valid = imdbs.Where(id => ImdbPattern.IsMatch(id)).Distinct(StringComparer.OrdinalIgnoreCase).ToArray();
        var map = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        if (valid.Length == 0) return map;

        var values = string.Join(" ", valid.Select(id => $"\"{id}\""));
        var sparql = $"SELECT ?imdb ?rt WHERE {{ VALUES ?imdb {{ {values} }} ?item wdt:P345 ?imdb . ?item wdt:P1258 ?rt . }}";
        var url = $"https://query.wikidata.org/sparql?format=json&query={Uri.EscapeDataString(sparql)}";

        using var req = new HttpRequestMessage(HttpMethod.Get, url);
        req.Headers.TryAddWithoutValidation("Accept", "application/sparql-results+json");
        req.Headers.TryAddWithoutValidation("User-Agent", "JellyfinDiscovery/0.6 (https://github.com/FrankieSchulte/jellyfin-discovery)");

        using var resp = await http.SendAsync(req, ct).ConfigureAwait(false);
        if (!resp.IsSuccessStatusCode) return map;

        var json = await resp.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
        using var doc = JsonDocument.Parse(json);
        if (!doc.RootElement.TryGetProperty("results", out var res) || !res.TryGetProperty("bindings", out var bindings)) return map;

        foreach (var row in bindings.EnumerateArray())
        {
            var imdbVal = row.TryGetProperty("imdb", out var iEl) && iEl.TryGetProperty("value", out var iv) ? iv.GetString() : null;
            var rtVal = row.TryGetProperty("rt", out var rEl) && rEl.TryGetProperty("value", out var rv) ? rv.GetString() : null;
            if (string.IsNullOrWhiteSpace(imdbVal) || string.IsNullOrWhiteSpace(rtVal)) continue;
            var clean = rtVal.Trim().TrimStart('/');
            if (clean.StartsWith("m/", StringComparison.OrdinalIgnoreCase) || clean.StartsWith("tv/", StringComparison.OrdinalIgnoreCase))
            {
                map[imdbVal] = clean;
            }
        }
        return map;
    }

    private async Task<RatingEntry?> TryFetchRtPageAsync(string rtSlug, int? expectedYear, bool verifyYear, CancellationToken ct)
    {
        await fetchGate.WaitAsync(ct).ConfigureAwait(false);
        try
        {
            var url = $"https://www.rottentomatoes.com/{rtSlug.TrimStart('/')}";
            using var resp = await http.GetAsync(url, ct).ConfigureAwait(false);
            if (!resp.IsSuccessStatusCode) return null;

            var html = await resp.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
            var match = ScorecardRegex.Match(html);
            if (!match.Success) return null;

            if (verifyYear && expectedYear is { } targetYear)
            {
                int? pageYear = ExtractYearFromHtml(html);
                if (pageYear is { } found && Math.Abs(found - targetYear) > 2)
                {
                    return null;
                }
            }

            return ParseScorecardJson(match.Groups[1].Value, rtSlug);
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            throw;
        }
        catch
        {
            return null;
        }
        finally
        {
            fetchGate.Release();
        }
    }

    private async Task<string?> TrySearchRtSlugAsync(string name, string prefix, int? expectedYear, CancellationToken ct)
    {
        await fetchGate.WaitAsync(ct).ConfigureAwait(false);
        try
        {
            var url = $"https://www.rottentomatoes.com/search?search={Uri.EscapeDataString(name)}";
            using var resp = await http.GetAsync(url, ct).ConfigureAwait(false);
            if (!resp.IsSuccessStatusCode) return null;

            var html = await resp.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
            string? fallbackSlug = null;
            foreach (Match row in SearchRowRegex.Matches(html))
            {
                var href = RtHrefRegex.Match(row.Value);
                if (!href.Success) continue;
                var slug = href.Groups[1].Value;
                if (!slug.StartsWith(prefix + "/", StringComparison.OrdinalIgnoreCase)) continue;
                fallbackSlug ??= slug;

                if (expectedYear is null) return slug;
                var ym = ReleaseYearAttrRegex.Match(row.Value);
                if (ym.Success && int.TryParse(ym.Groups[1].Value, out int yr) && Math.Abs(yr - expectedYear.Value) <= 1)
                {
                    return slug;
                }
            }
            return expectedYear is null ? fallbackSlug : null;
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            throw;
        }
        catch
        {
            return null;
        }
        finally
        {
            fetchGate.Release();
        }
    }

    internal static RatingEntry? ParseScorecardJson(string rawJson, string rtSlug)
    {
        try
        {
            using var doc = JsonDocument.Parse(rawJson);
            var root = doc.RootElement;

            int? criticScore = null;
            string? criticState = null;
            if (root.TryGetProperty("criticsScore", out var cs) && cs.ValueKind == JsonValueKind.Object)
            {
                criticScore = ParsePercent(cs);
                if (criticScore is { } cVal)
                {
                    bool certified = cs.TryGetProperty("certified", out var certEl) && certEl.ValueKind == JsonValueKind.True;
                    string? sentiment = cs.TryGetProperty("sentiment", out var sentEl) ? sentEl.GetString() : null;
                    criticState = certified
                        ? "certified"
                        : (string.Equals(sentiment, "POSITIVE", StringComparison.OrdinalIgnoreCase) || (sentiment is null && cVal >= 60))
                            ? "fresh"
                            : "rotten";
                }
            }

            int? audienceScore = null;
            string? audienceState = null;
            if (root.TryGetProperty("audienceScore", out var aus) && aus.ValueKind == JsonValueKind.Object)
            {
                audienceScore = ParsePercent(aus);
                if (audienceScore is { } aVal)
                {
                    bool certified = aus.TryGetProperty("certified", out var certEl) && certEl.ValueKind == JsonValueKind.True;
                    string? sentiment = aus.TryGetProperty("sentiment", out var sentEl) ? sentEl.GetString() : null;
                    audienceState = certified
                        ? "hot"
                        : (string.Equals(sentiment, "POSITIVE", StringComparison.OrdinalIgnoreCase) || (sentiment is null && aVal >= 60))
                            ? "fresh"
                            : "spilled";
                }
            }

            if (criticScore is null && audienceScore is null) return null;
            return new RatingEntry
            {
                CriticScore = criticScore,
                CriticState = criticState,
                AudienceScore = audienceScore,
                AudienceState = audienceState,
                RtSlug = rtSlug,
                Source = "rt",
                CheckedAt = DateTimeOffset.UtcNow
            };
        }
        catch
        {
            return null;
        }
    }

    private static int? ParsePercent(JsonElement obj)
    {
        if (obj.TryGetProperty("scorePercent", out var pctEl) && pctEl.ValueKind == JsonValueKind.String)
        {
            var raw = pctEl.GetString()?.Trim().TrimEnd('%');
            if (int.TryParse(raw, NumberStyles.Integer, CultureInfo.InvariantCulture, out int n) && n >= 0 && n <= 100)
                return n;
        }
        if (obj.TryGetProperty("score", out var scEl))
        {
            if (scEl.ValueKind == JsonValueKind.Number && scEl.TryGetInt32(out int num) && num >= 0 && num <= 100)
                return num;
            if (scEl.ValueKind == JsonValueKind.String && int.TryParse(scEl.GetString()?.Trim(), out int sn) && sn >= 0 && sn <= 100)
                return sn;
        }
        return null;
    }

    private static int? ExtractYearFromHtml(string html)
    {
        var ldMatch = JsonLdRegex.Match(html);
        if (ldMatch.Success)
        {
            try
            {
                using var doc = JsonDocument.Parse(ldMatch.Groups[1].Value);
                foreach (var prop in new[] { "datePublished", "dateCreated" })
                {
                    if (doc.RootElement.TryGetProperty(prop, out var el) && el.ValueKind == JsonValueKind.String)
                    {
                        var ym = YearFourDigitRegex.Match(el.GetString() ?? string.Empty);
                        if (ym.Success && int.TryParse(ym.Groups[1].Value, out int y)) return y;
                    }
                }
            }
            catch { }
        }
        return null;
    }

    internal static IReadOnlyList<string> BuildSlugCandidates(string? title, string prefix, int? year)
    {
        if (string.IsNullOrWhiteSpace(title)) return [];
        var normalized = title.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(normalized.Length);
        foreach (var ch in normalized)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(ch) != UnicodeCategory.NonSpacingMark)
                sb.Append(ch);
        }
        var ascii = sb.ToString()
            .Replace("&", " and ", StringComparison.Ordinal)
            .Replace("'", string.Empty, StringComparison.Ordinal)
            .Replace("’", string.Empty, StringComparison.Ordinal)
            .ToLowerInvariant();
        var slug = NonAlnumRegex.Replace(ascii, "_").Trim('_');
        if (string.IsNullOrEmpty(slug)) return [];

        var list = new List<string>(4);
        if (year is { } yr && yr >= 1900) list.Add($"{prefix}/{slug}_{yr}");
        list.Add($"{prefix}/{slug}");
        foreach (var art in new[] { "the_", "a_", "an_" })
        {
            if (slug.StartsWith(art, StringComparison.Ordinal) && slug.Length > art.Length + 1)
            {
                var stripped = slug[art.Length..];
                if (year is { } yr2 && yr2 >= 1900) list.Add($"{prefix}/{stripped}_{yr2}");
                list.Add($"{prefix}/{stripped}");
                break;
            }
        }
        return list.Distinct(StringComparer.Ordinal).ToArray();
    }

    private static string? GetImdbId(BaseItem item)
    {
        if (item.ProviderIds is null) return null;
        foreach (var kv in item.ProviderIds)
        {
            if (kv.Key.Equals("Imdb", StringComparison.OrdinalIgnoreCase) && !string.IsNullOrWhiteSpace(kv.Value))
            {
                var trimmed = kv.Value.Trim();
                if (ImdbPattern.IsMatch(trimmed)) return trimmed;
            }
        }
        return null;
    }

    private static bool IsFresh(RatingEntry entry, DateTimeOffset now)
    {
        var ttl = entry.Source == "rt" ? HitTtl : MissTtl;
        return now - entry.CheckedAt < ttl;
    }

    private static RatingEntry BuildFallbackEntry(BaseItem item, DateTimeOffset now)
    {
        if (item.CriticRating is { } cr && cr > 0)
        {
            int rounded = Math.Clamp((int)Math.Round(cr), 0, 100);
            return new RatingEntry
            {
                CriticScore = rounded,
                CriticState = rounded >= 60 ? "fresh" : "rotten",
                Source = "jellyfin",
                CheckedAt = now
            };
        }
        return new RatingEntry { Source = "none", CheckedAt = now };
    }

    private static RatingResult ToResult(RatingEntry? entry, BaseItem item, bool pending)
    {
        if (entry is not null && (entry.CriticScore is not null || entry.AudienceScore is not null))
        {
            return new RatingResult
            {
                CriticScore = entry.CriticScore,
                CriticState = entry.CriticState,
                AudienceScore = entry.AudienceScore,
                AudienceState = entry.AudienceState,
                Source = entry.Source,
                Pending = pending
            };
        }
        if (item.CriticRating is { } cr && cr > 0)
        {
            int rounded = Math.Clamp((int)Math.Round(cr), 0, 100);
            return new RatingResult
            {
                CriticScore = rounded,
                CriticState = rounded >= 60 ? "fresh" : "rotten",
                Source = "jellyfin",
                Pending = pending
            };
        }
        return new RatingResult { Source = "none", Pending = pending };
    }

    public void SaveIfDirty(bool force)
    {
        lock (gate)
        {
            if (!dirty) return;
            var now = DateTimeOffset.UtcNow;
            if (!force && now - lastSaved < TimeSpan.FromSeconds(15)) return;
            try
            {
                Directory.CreateDirectory(Path.GetDirectoryName(cachePath)!);
                var temp = cachePath + ".tmp";
                var bytes = JsonSerializer.SerializeToUtf8Bytes(cache, JsonOptions);
                using (var fs = new FileStream(temp, FileMode.Create, FileAccess.Write, FileShare.None))
                {
                    fs.Write(bytes);
                    fs.Flush(true);
                }
                File.Move(temp, cachePath, true);
                dirty = false;
                lastSaved = now;
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "FazFort could not save ratings cache.");
            }
        }
    }

    public BaseItem? LookupItem(Guid id) => library.GetItemById(id);

    public void Dispose()
    {
        SaveIfDirty(force: true);
        http.Dispose();
        fetchGate.Dispose();
    }
}

public sealed class RatingsWarmupService(ILibraryManager library, RatingsService ratings, ILogger<RatingsWarmupService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Yield();
        try
        {
            await Task.Delay(TimeSpan.FromSeconds(18), stoppingToken).ConfigureAwait(false);
            ratings.EnsureLoaded();

            var allItems = ScanLibrary();
            await ratings.ResolveWikidataSlugsAsync(allItems, stoppingToken).ConfigureAwait(false);

            int bgIndex = 0;
            while (!stoppingToken.IsCancellationRequested)
            {
                if (ratings.TryDequeuePriority(out var priorityId))
                {
                    var item = ratings.LookupItem(priorityId);
                    if (item is not null && ratings.NeedsFetch(item.Id, DateTimeOffset.UtcNow))
                    {
                        try { await ratings.FetchOrJoinAsync(item, stoppingToken).ConfigureAwait(false); }
                        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) { break; }
                        catch { }
                        await Task.Delay(250, stoppingToken).ConfigureAwait(false);
                    }
                    continue;
                }

                if (bgIndex < allItems.Count)
                {
                    var item = allItems[bgIndex++];
                    if (ratings.NeedsFetch(item.Id, DateTimeOffset.UtcNow))
                    {
                        try { await ratings.FetchOrJoinAsync(item, stoppingToken).ConfigureAwait(false); }
                        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) { break; }
                        catch { }
                        await Task.Delay(550, stoppingToken).ConfigureAwait(false);
                    }
                    continue;
                }

                ratings.SaveIfDirty(force: true);
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken).ConfigureAwait(false);
            }
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) { }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "FazFort ratings warmup stopped unexpectedly; on-demand lookups remain available.");
        }
        finally
        {
            ratings.SaveIfDirty(force: true);
        }
    }

    private List<BaseItem> ScanLibrary()
    {
        var list = new List<BaseItem>();
        int offset = 0;
        for (;;)
        {
            var batch = library.GetItemList(new InternalItemsQuery
            {
                IncludeItemTypes = [BaseItemKind.Movie, BaseItemKind.Series],
                Recursive = true,
                StartIndex = offset,
                Limit = 500,
                DtoOptions = new() { EnableImages = false, EnableUserData = false }
            });
            list.AddRange(batch);
            offset += batch.Count;
            if (batch.Count < 500 || offset >= 100000) break;
        }
        return list;
    }
}
