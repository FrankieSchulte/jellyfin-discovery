using System.Reflection;
using System.Runtime.Loader;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace Jellyfin.RequestHub;

public sealed class WebPatchRequest
{
    [JsonPropertyName("contents")]
    public string? Contents { get; set; }
}
public static class WebPatch
{
    public static string IndexHtml(WebPatchRequest request) => WebMarkup.Inject(request.Contents,
        typeof(Plugin).Assembly.GetName().Version!.ToString(), true);
}

public sealed class WebRegistration(ILogger<WebRegistration> logger) : IHostedService
{
    public Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            var assembly = AssemblyLoadContext.All.SelectMany(c => c.Assemblies)
                .FirstOrDefault(a => a.GetName().Name == "Jellyfin.Plugin.FileTransformation");
            var register = assembly?.GetType("Jellyfin.Plugin.FileTransformation.PluginInterface")?
                .GetMethod("RegisterTransformation", BindingFlags.Public | BindingFlags.Static, null, [typeof(JObject)], null);
            if (register is null || register.ReturnType != typeof(void))
            {
                logger.LogWarning("Request Hub browser delivery requires File Transformation. Install it and restart, or use the manual browser script.");
                return Task.CompletedTask;
            }
            register.Invoke(null, [new JObject
            {
                ["id"] = "548e9701-c8f0-4273-b84d-97472d47c395",
                ["fileNamePattern"] = "index.html",
                ["callbackAssembly"] = typeof(WebPatch).Assembly.FullName,
                ["callbackClass"] = typeof(WebPatch).FullName,
                ["callbackMethod"] = nameof(WebPatch.IndexHtml)
            }]);
            logger.LogInformation("Request Hub registered automatic browser script delivery.");
        }
        catch (Exception ex) { logger.LogWarning(ex, "Request Hub browser delivery could not register; native Jellyfin remains available."); }
        return Task.CompletedTask;
    }
    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}

// A fixed, public static asset only. No user data or integration configuration.
[ApiController]
[Route("RequestHub/Assets")]
public sealed class HubAssetsController : ControllerBase
{
    [AllowAnonymous]
    [HttpGet("web.js")]
    public IActionResult BrowserScript()
    {
        Stream? stream = typeof(Plugin).Assembly.GetManifestResourceStream("Jellyfin.RequestHub.web.js");
        if (stream is null) return NotFound();
        Response.Headers.CacheControl = "no-cache";
        Response.Headers["X-Content-Type-Options"] = "nosniff";
        return File(stream, "application/javascript; charset=utf-8");
    }
}
