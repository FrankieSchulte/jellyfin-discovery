using System.Text.Json;

namespace FazFort.Discovery;

public sealed record Observation(Guid Id, string Type, bool Playable, Guid SeriesId = default, int SeasonNumber = 0);
public sealed class Arrival
{
    public DateTimeOffset? AddedAt { get; set; }
    public DateTimeOffset? NewSeasonAt { get; set; }
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
    }
    public bool Observe(Observation item, DateTimeOffset now)
    {
        if (!BaselineComplete || item.Id == Guid.Empty || (item.Type != "Series" && !item.Playable)) return false;
        if (!KnownItems.Add(item.Id)) return false;
        if (item.Type == "Movie") Get(item.Id).AddedAt = now;
        else if (item.Type == "Series") PendingSeries.Add(item.Id);
        else if (item.Type == "Episode" && item.SeriesId != Guid.Empty)
        {
            bool seriesNew = KnownItems.Add(item.SeriesId);
            if (PendingSeries.Remove(item.SeriesId) || seriesNew) Get(item.SeriesId).AddedAt = now;
            if (KnownSeasons.Add(SeasonKey(item)) && item.SeasonNumber >= 2) Get(item.SeriesId).NewSeasonAt = now;
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
