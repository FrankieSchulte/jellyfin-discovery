using System.Text.Json;
using MediaBrowser.Common.Configuration;
using Microsoft.Extensions.Logging;

namespace FazFort.Discovery;

public sealed class DiscoveryStore
{
    private readonly object gate = new();
    private readonly string path;
    private readonly ILogger<DiscoveryStore> logger;
    private Ledger ledger = new();
    public bool Ready { get; private set; }
    public bool Faulted { get; private set; }
    private static readonly JsonSerializerOptions Options = new() { WriteIndented = false };
    public DiscoveryStore(IApplicationPaths paths, ILogger<DiscoveryStore> log)
    {
        path = Path.Combine(paths.DataPath, "fazfort-discovery", "ledger.json"); logger = log;
    }
    public void Initialize()
    {
        lock (gate)
        {
            if (!File.Exists(path)) return;
            // Corrupt state must not silently reset the baseline and manufacture arrivals.
            ledger = JsonSerializer.Deserialize<Ledger>(File.ReadAllText(path), Options) ?? throw new IOException("Empty discovery ledger.");
            if (ledger.Schema != 1) throw new IOException("Unsupported discovery ledger schema.");
        }
    }
    public void Apply(IReadOnlyList<Observation> items, DateTimeOffset now)
    {
        lock (gate)
        {
            bool changed = false;
            if (!ledger.BaselineComplete) { ledger.Baseline(items, now); changed = true; }
            else foreach (var item in items) changed |= ledger.Observe(item, now);
            if (changed) Save();
            Ready = true;
        }
    }
    public object Tracking(IEnumerable<Guid> permittedIds)
    {
        lock (gate)
        {
            var records = permittedIds.Where(id => ledger.Arrivals.ContainsKey(id)).ToDictionary(id => id.ToString("N"), id => ledger.Arrivals[id]);
            return new { Ready = Ready && !Faulted, StartedAt = ledger.StartedAt, Records = records };
        }
    }
    public UserProfile? Profile(Guid user)
    {
        lock (gate) return ledger.Profiles.TryGetValue(user, out var p) ? new UserProfile { Version = p.Version, Config = p.Config.Clone() } : null;
    }
    public int UpdateProfile(Guid user, int expected, JsonElement config)
    {
        lock (gate)
        {
            if (!Ready || Faulted) throw new IOException("Discovery storage is not ready.");
            int version = ledger.Profiles.GetValueOrDefault(user)?.Version ?? 0;
            if (expected != version) throw new InvalidOperationException("Preferences changed on another device. Reload before saving.");
            var previous = ledger.Profiles.GetValueOrDefault(user);
            ledger.Profiles[user] = new UserProfile { Version = version + 1, Config = config.Clone() };
            try { Save(); }
            catch { if (previous is null) ledger.Profiles.Remove(user); else ledger.Profiles[user] = previous; throw; }
            return version + 1;
        }
    }
    public void Fail(Exception error)
    {
        lock (gate) { Ready = false; Faulted = true; }
        logger.LogError(error, "FazFort addition tracking is unavailable. Existing library and playback are unaffected.");
    }
    private void Save()
    {
        Directory.CreateDirectory(Path.GetDirectoryName(path)!);
        var temp = path + ".tmp";
        var bytes = JsonSerializer.SerializeToUtf8Bytes(ledger, Options);
        using (var stream = new FileStream(temp, FileMode.Create, FileAccess.Write, FileShare.None)) { stream.Write(bytes); stream.Flush(true); }
        if (File.Exists(path)) File.Copy(path, path + ".bak", true);
        File.Move(temp, path, true);
    }
}
