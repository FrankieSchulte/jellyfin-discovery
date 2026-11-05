using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;

namespace FazFort.Shelves;

public sealed class Configuration : BasePluginConfiguration
{
    public bool Enabled { get; set; } = true;
    public string TimeZone { get; set; } = "America/Los_Angeles";
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
    public const string PluginId = "278398d1-df9f-46aa-9952-97b45795c957";
    public static Plugin Instance { get; private set; } = null!;
    public override Guid Id => Guid.Parse(PluginId);
    public override string Name => "FazFort Themed Shelves";
    public override string Description => "Daily themed shelves and seasonal Halloween/Christmas rows for Home Screen Sections.";
    public Plugin(IApplicationPaths paths, IXmlSerializer serializer) : base(paths, serializer) { Instance = this; }
    public override void UpdateConfiguration(BasePluginConfiguration configuration)
    {
        ((Configuration)configuration).Validate();
        base.UpdateConfiguration(configuration);
    }
    public IEnumerable<PluginPageInfo> GetPages() => [new() { Name="FazFortShelves", EmbeddedResourcePath="FazFort.Shelves.config.html" }];
}
