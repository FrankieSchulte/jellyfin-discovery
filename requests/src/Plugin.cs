using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;
using MediaBrowser.Controller;
using MediaBrowser.Controller.Plugins;
using Microsoft.Extensions.DependencyInjection;
namespace Jellyfin.RequestHub;
public sealed class Configuration : BasePluginConfiguration
{
    public bool Enabled { get; set; }
    public string ServerUrl { get; set; } = "";
    public string ApiKey { get; set; } = "";
    public List<UserLink> Users { get; set; } = [];
    public void Validate(){
        if(Users is null||Users.Count>500||Users.Any(u=>u.JellyfinUserId==Guid.Empty||u.SeerrUserId<=0)||Users.Select(u=>u.JellyfinUserId).Distinct().Count()!=Users.Count)throw new ArgumentException("Use unique Jellyfin user IDs and positive Seerr user IDs.");
        if(Enabled){_=HubPolicy.BaseUri(ServerUrl);if(string.IsNullOrWhiteSpace(ApiKey)||ApiKey.Length>512||ApiKey.Any(char.IsControl))throw new ArgumentException("Supply a valid API key.");}
    }
}
public sealed class Plugin : BasePlugin<Configuration>, IHasWebPages
{
    public const string PluginId="56cd1277-c4de-4f5c-93f6-080398c7432e";
    public static Plugin Instance {get;private set;}=null!;
    public override Guid Id=>Guid.Parse(PluginId);
    public override string Name=>"Jellyfin Request Hub";
    public override string Description=>"Browse and request Jellyseerr titles without leaving Jellyfin Web.";
    public Plugin(IApplicationPaths paths,IXmlSerializer xml):base(paths,xml){Instance=this;}
    public override void UpdateConfiguration(BasePluginConfiguration config){((Configuration)config).Validate();base.UpdateConfiguration(config);}
    public IEnumerable<PluginPageInfo> GetPages()=>[new(){Name="RequestHubSettings",EmbeddedResourcePath="Jellyfin.RequestHub.config.html",EnableInMainMenu=true,DisplayName="Request Hub",MenuIcon="movie"}];
}
public sealed class Registrator : IPluginServiceRegistrator
{
    public void RegisterServices(IServiceCollection services,IServerApplicationHost host){services.AddSingleton<SeerrGateway>();services.AddHostedService<WebRegistration>();}
}
