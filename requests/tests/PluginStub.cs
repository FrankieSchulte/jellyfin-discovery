namespace Jellyfin.RequestHub;
// Test-only configuration source; the real plugin is compiled separately.
public sealed class Plugin { public static Plugin Instance {get;}=new();public Configuration Configuration {get;}=new(); }
public sealed class Configuration {public string ServerUrl {get;set;}="http://host";public string ApiKey {get;set;}="server-secret";}
