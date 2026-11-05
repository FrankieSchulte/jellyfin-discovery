using System.Text.RegularExpressions;
namespace FazFort.Discovery;

public static class WebMarkup
{
    private static readonly Regex OwnedScript = new("<script\\b[^>]*\\bdata-discovery-asset=\"browser\"[^>]*>[\\s\\S]*?</script>", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant, TimeSpan.FromSeconds(1));
    public static string Inject(string? contents, string version, bool enabled)
    {
        if (string.IsNullOrEmpty(contents)) return contents ?? "";
        // Never interpolate configuration or request-controlled URLs into markup.
        if (!Version.TryParse(version, out _)) return contents;
        string clean = OwnedScript.Replace(contents, "");
        if (!enabled) return clean;
        int end = clean.LastIndexOf("</body>", StringComparison.OrdinalIgnoreCase);
        if (end < 0) return clean;
        string script = $"<script defer src=\"../FazFortDiscovery/Assets/discovery.js?v={version}\" data-discovery-asset=\"browser\"></script>";
        return clean.Insert(end, script);
    }
}
