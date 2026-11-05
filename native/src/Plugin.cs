using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;
using MediaBrowser.Controller;
using MediaBrowser.Controller.Plugins;
using Microsoft.Extensions.DependencyInjection;

namespace FazFort.Discovery;

public sealed class Configuration : BasePluginConfiguration { }
public sealed class Plugin : BasePlugin<Configuration>
{
    public override Guid Id => Guid.Parse("da85d59b-cd29-4f4a-9b72-820a298cdb9d");
    public override string Name => "FazFort Discovery Companion";
    public override string Description => "Persistent library arrival tracking and authenticated per-user discovery preferences.";
    public Plugin(IApplicationPaths paths, IXmlSerializer serializer) : base(paths, serializer) { }
}
public sealed class Registrator : IPluginServiceRegistrator
{
    public void RegisterServices(IServiceCollection services, IServerApplicationHost host)
    {
        services.AddSingleton<DiscoveryStore>();
        services.AddHostedService<ArrivalMonitor>();
    }
}
