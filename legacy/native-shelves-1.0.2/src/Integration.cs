using Jellyfin.Data.Enums;
using System.Runtime.Loader;
using MediaBrowser.Controller;
using MediaBrowser.Controller.Dto;
using MediaBrowser.Controller.Entities;
using MediaBrowser.Controller.Library;
using MediaBrowser.Controller.Plugins;
using MediaBrowser.Model.Dto;
using MediaBrowser.Model.Entities;
using MediaBrowser.Model.Querying;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace FazFort.Shelves;

public sealed class Registrator : IPluginServiceRegistrator
{
    public void RegisterServices(IServiceCollection services, IServerApplicationHost host) => services.AddHostedService<Registration>();
}

public sealed class Registration(ILogger<Registration> logger) : IHostedService
{
    public Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            Plugin.Instance.Configuration.Validate();
            var assembly = AssemblyLoadContext.All.SelectMany(c => c.Assemblies)
                .FirstOrDefault(a => a.GetName().Name == "Jellyfin.Plugin.HomeScreenSections");
            var register = assembly?.GetType("Jellyfin.Plugin.HomeScreenSections.PluginInterface")?.GetMethod("RegisterSection");
            if (register is null) throw new InvalidOperationException("Home Screen Sections is missing or incompatible.");
            foreach (ShelfRule rule in ShelfEngine.Parse(Plugin.Instance.Configuration.RulesJson))
            {
                register.Invoke(null, [JObject.FromObject(new
                {
                    id = ShelfEngine.SectionId(rule.Key).ToString(), displayText = rule.Title,
                    limit = 1, additionalData = rule.Key,
                    resultsAssembly = typeof(Results).Assembly.FullName,
                    resultsClass = typeof(Results).FullName, resultsMethod = nameof(Results.GetResults)
                })]);
            }
            logger.LogInformation("FazFort themed shelves registered. Add them in Home Screen Sections → Section Settings.");
        }
        catch (Exception ex) { logger.LogError(ex, "FazFort shelves registration failed; built-in sections are unaffected."); }
        return Task.CompletedTask;
    }
    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}

public sealed class Request
{
    public Guid UserId { get; set; }
    public string? AdditionalData { get; set; }
}

public sealed class Results(IUserManager users, ILibraryManager library, IDtoService dtos, IUserDataManager userData, ILogger<Results> logger)
{
    public QueryResult<BaseItemDto> GetResults(Request request)
    {
        try
        {
            Configuration config = Plugin.Instance.Configuration;
            if (!config.Enabled || request.UserId == Guid.Empty || string.IsNullOrEmpty(request.AdditionalData)) return Empty();
            config.Validate();
            var user = users.GetUserById(request.UserId);
            if (user is null) return Empty();
            List<ShelfRule> rules = ShelfEngine.Parse(config.RulesJson);
            DateOnly date = DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, TimeZoneInfo.FindSystemTimeZoneById(config.TimeZone)).DateTime);
            // Query only through permitted folders and with the authenticated user. No
            // global item cache: permissions and watched state are rechecked each request.
            List<BaseItem> items = [];
            foreach (VirtualFolderInfo folderInfo in library.GetVirtualFolders())
            {
                if (!Guid.TryParse(folderInfo.ItemId, out Guid folderId)) continue;
                if (library.GetItemById<BaseItem>(folderId, user) is not Folder folder) continue;
                items.AddRange(folder.GetItems(new InternalItemsQuery(user)
                {
                    ParentId = folderId, Recursive = true,
                    IncludeItemTypes = [BaseItemKind.Movie, BaseItemKind.Series],
                    DtoOptions = new DtoOptions { EnableImages = false, Fields = [ItemFields.Genres, ItemFields.Tags] }
                }).Items);
            }
            items = items.DistinctBy(i => i.Id).ToList();
            Candidate[] candidates = items.Select(i => new Candidate(i.Id, i.GetBaseItemKind().ToString(), i.Genres, i.Tags,
                i.CommunityRating, i.RunTimeTicks, config.HideWatched && userData.GetUserData(user,i)?.Played == true)).ToArray();
            var plan = ShelfEngine.Plan(rules,candidates,user.Id,date,config.DailyShelfCount,config.CardsPerShelf,config.MinimumItems,config.HideWatched);
            if (!plan.TryGetValue(request.AdditionalData, out Guid[]? ids) || ids.Length == 0) return Empty();
            DtoOptions options = new()
            {
                EnableImages = true, EnableUserData = true, ImageTypeLimit = 1,
                Fields = [ItemFields.PrimaryImageAspectRatio, ItemFields.Genres, ItemFields.Tags],
                ImageTypes = [ImageType.Primary, ImageType.Backdrop, ImageType.Thumb]
            };
            // Candidate objects were deliberately loaded without images. Setting
            // EnableImages on DTO conversion does not hydrate their image metadata.
            // Reload just the selected permitted IDs with image-enabled options.
            var hydrated = library.GetItemList(new InternalItemsQuery(user)
            {
                ItemIds = ids,
                IncludeItemTypes = [BaseItemKind.Movie, BaseItemKind.Series],
                DtoOptions = options
            });
            Dictionary<Guid, BaseItem> byId = hydrated.Where(i => ids.Contains(i.Id)).ToDictionary(i => i.Id);
            List<BaseItem> ordered = ids.Where(byId.ContainsKey).Select(id => byId[id]).ToList();
            return new QueryResult<BaseItemDto>(dtos.GetBaseItemDtos(ordered, options, user));
        }
        catch (Exception ex)
        {
            logger.LogError(ex,"FazFort shelf {Shelf} could not load.",request.AdditionalData);
            return Empty();
        }
    }
    private static QueryResult<BaseItemDto> Empty() => new(Array.Empty<BaseItemDto>());
}
