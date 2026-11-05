using System.Text.Json;
using MediaBrowser.Controller.Library;
using MediaBrowser.Controller.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FazFort.Discovery;

public sealed class ProfileWrite
{
    public int ExpectedVersion { get; set; }
    public JsonElement Config { get; set; }
}
[ApiController]
[Route("FazFortDiscovery")]
[Authorize]
public sealed class DiscoveryController(DiscoveryStore store, ILibraryManager library, IUserManager users) : ControllerBase
{
    private Guid? OwnUser()
    {
        string? claim = User.Claims.FirstOrDefault(c => c.Type.Equals("Jellyfin-UserId", StringComparison.OrdinalIgnoreCase))?.Value;
        return Guid.TryParse(claim, out Guid id) && id != Guid.Empty && users.GetUserById(id) is not null ? id : null;
    }
    [HttpGet("Tracking")]
    public ActionResult GetTracking([FromQuery] string ids = "")
    {
        Guid? userId = OwnUser(); if (userId is null) return Forbid();
        var parts = ids.Split(',', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length > 300 || parts.Any(p => !Guid.TryParse(p, out _))) return BadRequest("Use at most 300 valid item IDs.");
        var requested = parts.Select(Guid.Parse).Distinct().ToArray();
        if (requested.Length == 0) return Ok(store.Tracking([]));
        var user = users.GetUserById(userId.Value)!;
        // ItemIds queries can bypass automatic library-parent scoping. Use the
        // same standalone visibility check as Jellyfin's per-item user lookup.
        var visible = requested.Select(id => library.GetItemById<BaseItem>(id, user))
            .Where(item => item is not null && item.GetBaseItemKind().ToString() is "Movie" or "Series")
            .Select(item => item!.Id);
        return Ok(store.Tracking(visible));
    }
    [HttpGet("Preferences")]
    public ActionResult GetPreferences()
    {
        Guid? user = OwnUser(); if (user is null) return Forbid();
        if (!store.Ready || store.Faulted) return StatusCode(503, "Discovery storage is not ready.");
        var profile = store.Profile(user.Value);
        return Ok(new { Version = profile?.Version ?? 0, Config = profile?.Config });
    }
    [HttpPost("Preferences")]
    [RequestSizeLimit(150000)]
    public ActionResult SavePreferences([FromBody] ProfileWrite body)
    {
        Guid? user = OwnUser(); if (user is null) return Forbid();
        if (!ConfigPolicy.Valid(body.Config)) return BadRequest("Invalid discovery configuration.");
        try { return Ok(new { Version = store.UpdateProfile(user.Value, body.ExpectedVersion, body.Config) }); }
        catch (InvalidOperationException) { return Conflict("Preferences changed on another device. Reload before saving."); }
        catch (IOException) { return StatusCode(503, "Discovery storage could not save preferences."); }
    }
}
