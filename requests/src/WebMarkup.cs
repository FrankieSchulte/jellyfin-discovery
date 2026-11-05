using System.Text.RegularExpressions;
namespace Jellyfin.RequestHub;

public static class WebMarkup
{
    private static readonly Regex OwnedScript = new("<script\\b[^>]*\\bdata-requesthub-asset=\"browser\"[^>]*>[\\s\\S]*?</script>", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant, TimeSpan.FromSeconds(1));
    public static string Inject(string? contents, string version, bool enabled)
    {
        if (string.IsNullOrEmpty(contents)) return contents ?? "";
        // Never interpolate configuration or request-controlled URLs into markup.
        if (!Version.TryParse(version, out _)) return contents;
        string clean = OwnedScript.Replace(contents, "");
        if (!enabled) return clean;
        int end = clean.LastIndexOf("</body>", StringComparison.OrdinalIgnoreCase);
        if (end < 0) return clean;
        string script = $"<script defer src=\"../RequestHub/Assets/web.js?v={version}\" data-requesthub-asset=\"browser\"></script>";
        return clean.Insert(end, script);
    }
}
