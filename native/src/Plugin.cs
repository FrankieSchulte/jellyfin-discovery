using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;
using MediaBrowser.Controller;
using MediaBrowser.Controller.Plugins;
using Microsoft.Extensions.DependencyInjection;

namespace FazFort.Discovery;

public sealed class Configuration : BasePluginConfiguration
{
    public bool Enabled { get; set; } = true;
    public string TimeZone { get; set; } = "UTC";
    public int DailyShelfCount { get; set; } = 4;
    public int CardsPerShelf { get; set; } = 12;
    public int MinimumItems { get; set; } = 4;
    public bool HideWatched { get; set; } = false;
    public string RulesJson { get; set; } = ShelfEngine.DefaultRules;

    public void Validate()
    {
        _ = TimeZoneInfo.FindSystemTimeZoneById(TimeZone);
        if (DailyShelfCount < 0 || DailyShelfCount > 20) throw new ArgumentException("Daily shelves must be 0–20.");
        if (CardsPerShelf < 1 || CardsPerShelf > 40) throw new ArgumentException("Cards per shelf must be 1–40.");
        if (MinimumItems < 1 || MinimumItems > CardsPerShelf) throw new ArgumentException("Minimum must be 1 through cards per shelf.");
        _ = ShelfEngine.Parse(RulesJson);
    }
}

public sealed class Plugin : BasePlugin<Configuration>, IHasWebPages
{
    public static Plugin Instance { get; private set; } = null!;
    public override Guid Id => Guid.Parse("da85d59b-cd29-4f4a-9b72-820a298cdb9d");
    public override string Name => "Jellyfin Discovery";
    public override string Description => "Discovery feeds, themed HSS shelves, arrival tracking and per-user preferences.";
    public Plugin(IApplicationPaths paths, IXmlSerializer serializer) : base(paths, serializer) { Instance = this; }
    public override void UpdateConfiguration(BasePluginConfiguration configuration)
    {
        ((Configuration)configuration).Validate();
        base.UpdateConfiguration(configuration);
    }
    public IEnumerable<PluginPageInfo> GetPages() => [new() { Name="DiscoveryShelves", EmbeddedResourcePath="FazFort.Discovery.config.html" }];
}
public sealed class Registrator : IPluginServiceRegistrator
{
    public void RegisterServices(IServiceCollection services, IServerApplicationHost host)
    {
        services.AddSingleton<DiscoveryStore>();
        services.AddHostedService<ArrivalMonitor>();
        services.AddHostedService<Registration>();
    }
}
