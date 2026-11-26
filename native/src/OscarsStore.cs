using System.Text.Json;
using MediaBrowser.Common.Configuration;
using Microsoft.Extensions.Logging;

namespace FazFort.Discovery;

public sealed class OscarsStore
{
    private readonly object gate = new();
    private readonly string dir;
    private readonly string configPath;
    private readonly ILogger<OscarsStore> logger;
    private OscarsConfig current;
    private long assetVersion;
    private static readonly string[] AssetExts = [".png", ".jpg", ".webp", ".svg"];
    private static readonly JsonSerializerOptions JsonOpts = new() { PropertyNameCaseInsensitive = true, WriteIndented = false };

    public OscarsStore(IApplicationPaths paths, ILogger<OscarsStore> log)
    {
        dir = Path.Combine(paths.DataPath, "fazfort-discovery");
        configPath = Path.Combine(dir, "oscars.json");
        logger = log;
        assetVersion = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        current = LoadInitial();
    }

    private OscarsConfig LoadInitial()
    {
        try
        {
            if (File.Exists(configPath))
            {
                var parsed = JsonSerializer.Deserialize<OscarsConfig>(File.ReadAllText(configPath), JsonOpts);
                if (parsed is not null) return OscarsPolicy.ValidateAndNormalize(parsed);
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Could not load saved Oscars configuration; falling back to defaults.");
        }
        return OscarsPolicy.DefaultConfig();
    }

    public object GetPublicState(string? timeZoneId, DateTimeOffset utcNow)
    {
        lock (gate)
        {
            bool active = OscarsPolicy.IsActive(current, timeZoneId, utcNow);
            return new
            {
                enabled = current.Enabled,
                active,
                startDate = current.StartDate,
                endDate = current.EndDate,
                navTitle = current.NavTitle,
                ceremonyTitle = current.CeremonyTitle,
                hasCustomHero = FindCustomAssetPath("hero") is not null,
                hasCustomLogo = FindCustomAssetPath("logo") is not null,
                assetVersion,
                categories = current.Categories
            };
        }
    }

    public object SaveConfig(OscarsConfig incoming, string? timeZoneId, DateTimeOffset utcNow)
    {
        var clean = OscarsPolicy.ValidateAndNormalize(incoming);
        lock (gate)
        {
            Directory.CreateDirectory(dir);
            var temp = configPath + ".tmp";
            var bytes = JsonSerializer.SerializeToUtf8Bytes(clean, JsonOpts);
            using (var stream = new FileStream(temp, FileMode.Create, FileAccess.Write, FileShare.None))
            {
                stream.Write(bytes);
                stream.Flush(true);
            }
            if (File.Exists(configPath)) File.Copy(configPath, configPath + ".bak", true);
            File.Move(temp, configPath, true);
            current = clean;
            return GetPublicState(timeZoneId, utcNow);
        }
    }

    public (long Version, bool HasCustomHero, bool HasCustomLogo) SaveAsset(string kind, string? dataUrl)
    {
        var (bytes, ext, _) = OscarsPolicy.ValidateAsset(kind, dataUrl);
        lock (gate)
        {
            Directory.CreateDirectory(dir);
            DeleteCustomAssetUnlocked(kind);
            var target = Path.Combine(dir, $"oscars-{kind}{ext}");
            var temp = target + ".tmp";
            using (var stream = new FileStream(temp, FileMode.Create, FileAccess.Write, FileShare.None))
            {
                stream.Write(bytes);
                stream.Flush(true);
            }
            File.Move(temp, target, true);
            assetVersion = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            return (assetVersion, FindCustomAssetPath("hero") is not null, FindCustomAssetPath("logo") is not null);
        }
    }

    public (long Version, bool HasCustomHero, bool HasCustomLogo) DeleteAsset(string kind)
    {
        if (kind is not ("hero" or "logo")) throw new ArgumentException("Asset kind must be 'hero' or 'logo'.");
        lock (gate)
        {
            DeleteCustomAssetUnlocked(kind);
            assetVersion = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            return (assetVersion, FindCustomAssetPath("hero") is not null, FindCustomAssetPath("logo") is not null);
        }
    }

    public (string Path, string ContentType, bool IsSvg)? ResolveCustomAsset(string kind)
    {
        if (kind is not ("hero" or "logo")) return null;
        lock (gate)
        {
            var file = FindCustomAssetPath(kind);
            if (file is null) return null;
            var ext = Path.GetExtension(file).ToLowerInvariant();
            return ext switch
            {
                ".png" => (file, "image/png", false),
                ".jpg" => (file, "image/jpeg", false),
                ".webp" => (file, "image/webp", false),
                ".svg" => (file, "image/svg+xml; charset=utf-8", true),
                _ => null
            };
        }
    }

    private string? FindCustomAssetPath(string kind)
    {
        foreach (var ext in AssetExts)
        {
            var candidate = Path.Combine(dir, $"oscars-{kind}{ext}");
            if (File.Exists(candidate)) return candidate;
        }
        return null;
    }

    private void DeleteCustomAssetUnlocked(string kind)
    {
        foreach (var ext in AssetExts)
        {
            var candidate = Path.Combine(dir, $"oscars-{kind}{ext}");
            if (File.Exists(candidate)) File.Delete(candidate);
        }
    }
}
