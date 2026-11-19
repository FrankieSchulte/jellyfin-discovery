using System.Text.Json;

namespace FazFort.Discovery;

public sealed record Observation(Guid Id, string Type, bool Playable, Guid SeriesId = default, int SeasonNumber = 0, DateTimeOffset? CreatedAt = null, DateTimeOffset? PremiereDate = null);
public sealed class Arrival
{
    public DateTimeOffset? AddedAt { get; set; }
    public DateTimeOffset? NewSeasonAt { get; set; }
    public DateTimeOffset? NewEpisodesAt { get; set; }
}
public sealed class UserProfile
{
    public int Version { get; set; }
    public JsonElement Config { get; set; }
}
public sealed class Ledger
{
    public int Schema { get; set; } = 1;
    public bool BaselineComplete { get; set; }
    public DateTimeOffset? StartedAt { get; set; }
    public HashSet<Guid> KnownItems { get; set; } = [];
    public HashSet<string> KnownSeasons { get; set; } = [];
    public HashSet<Guid> PendingSeries { get; set; } = [];
    public Dictionary<Guid, Arrival> Arrivals { get; set; } = [];
    public Dictionary<Guid, UserProfile> Profiles { get; set; } = [];

    public void Baseline(IEnumerable<Observation> items, DateTimeOffset now)
    {
        var snapshot = items.ToArray();
        var playableSeries = snapshot.Where(i => i.Type == "Episode" && i.Playable).Select(i => i.SeriesId).ToHashSet();
        foreach (var item in snapshot)
        {
            if (item.Type == "Series" || item.Playable) KnownItems.Add(item.Id);
            if (item.Type == "Series" && !playableSeries.Contains(item.Id)) PendingSeries.Add(item.Id);
            if (item.Type == "Episode" && item.Playable && item.SeriesId != Guid.Empty)
                KnownSeasons.Add(SeasonKey(item));
        }
        BaselineComplete = true;
        StartedAt = now;
        SyncEpisodePremieres(snapshot, now);
    }
    public bool SyncEpisodePremieres(IEnumerable<Observation> items, DateTimeOffset now)
    {
        var cutoff = now.AddDays(-30);
        var maxFuture = now.AddDays(1);
        var latestBySeries = new Dictionary<Guid, DateTimeOffset>();
        foreach (var item in items)
        {
            if (item.Type != "Episode" || !item.Playable || item.SeriesId == Guid.Empty) continue;
            if (item.PremiereDate is not { } prem || prem < cutoff || prem > maxFuture) continue;
            if (!latestBySeries.TryGetValue(item.SeriesId, out var prev) || prem > prev)
                latestBySeries[item.SeriesId] = prem;
        }
        bool changed = false;
        foreach (var (seriesId, latest) in latestBySeries)
        {
            var record = Get(seriesId);
            if (record.NewEpisodesAt != latest) { record.NewEpisodesAt = latest; changed = true; }
            if (record.NewSeasonAt is not null) { record.NewSeasonAt = null; changed = true; }
        }
        foreach (var (id, record) in Arrivals)
        {
            if (latestBySeries.ContainsKey(id)) continue;
            if (record.NewEpisodesAt is not null) { record.NewEpisodesAt = null; changed = true; }
            if (record.NewSeasonAt is not null) { record.NewSeasonAt = null; changed = true; }
        }
        return changed;
    }
    public bool Observe(Observation item, DateTimeOffset now)
    {
        if (!BaselineComplete || item.Id == Guid.Empty || (item.Type != "Series" && !item.Playable)) return false;
        bool isNew = KnownItems.Add(item.Id);
        bool updated = false;
        if (item.Type == "Episode" && item.SeriesId != Guid.Empty && item.PremiereDate is { } prem && prem >= now.AddDays(-30) && prem <= now.AddDays(1))
        {
            var rec = Get(item.SeriesId);
            if (rec.NewEpisodesAt is null || prem > rec.NewEpisodesAt)
            {
                rec.NewEpisodesAt = prem;
                updated = true;
            }
        }
        if (!isNew) return updated;
        var effective = item.CreatedAt is { } created && created < now.AddHours(-2) ? created : now;
        if (item.Type == "Movie") Get(item.Id).AddedAt = effective;
        else if (item.Type == "Series") PendingSeries.Add(item.Id);
        else if (item.Type == "Episode" && item.SeriesId != Guid.Empty)
        {
            bool seriesNew = KnownItems.Add(item.SeriesId);
            if (PendingSeries.Remove(item.SeriesId) || seriesNew) Get(item.SeriesId).AddedAt = effective;
            KnownSeasons.Add(SeasonKey(item));
        }
        return true;
    }
    private Arrival Get(Guid id)
    {
        if (!Arrivals.TryGetValue(id, out var record)) Arrivals[id] = record = new Arrival();
        return record;
    }
    private static string SeasonKey(Observation item) => $"{item.SeriesId:N}:{item.SeasonNumber}";
}
