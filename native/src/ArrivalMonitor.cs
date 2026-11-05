using System.Collections.Concurrent;
using Jellyfin.Data.Enums;
using MediaBrowser.Controller.Entities;
using MediaBrowser.Controller.Entities.TV;
using MediaBrowser.Controller.Library;
using MediaBrowser.Model.Entities;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FazFort.Discovery;

public sealed class ArrivalMonitor(ILibraryManager library, DiscoveryStore store, ILogger<ArrivalMonitor> logger) : BackgroundService
{
    private readonly ConcurrentQueue<Observation> queue = new();
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Yield so optional tracking cannot block Jellyfin's startup path.
        await Task.Yield();
        try
        {
            store.Initialize();
            store.Apply(Scan(), DateTimeOffset.UtcNow);
            library.ItemAdded += OnAdded;
            logger.LogInformation("FazFort arrival baseline ready. Subsequent playable additions will be recorded.");
            int ticks = 0;
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
                var batch = new List<Observation>();
                while (queue.TryDequeue(out var item)) batch.Add(item);
                // Reconciliation catches missed events and items whose playable metadata arrives later.
                if (++ticks % 12 == 0) batch.AddRange(Scan());
                if (batch.Count > 0) store.Apply(batch, DateTimeOffset.UtcNow);
            }
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) { }
        catch (Exception ex) { store.Fail(ex); }
        finally { library.ItemAdded -= OnAdded; }
    }
    private void OnAdded(object? sender, ItemChangeEventArgs args)
    {
        try { var value = Convert(args.Item); if (value is not null) queue.Enqueue(value); }
        catch (Exception ex) { logger.LogWarning(ex, "FazFort could not inspect an item-added event; reconciliation will retry."); }
    }
    private List<Observation> Scan()
    {
        var result = new List<Observation>();
        int offset = 0;
        for (;;)
        {
            var items = library.GetItemList(new InternalItemsQuery
            {
                IncludeItemTypes = [BaseItemKind.Movie, BaseItemKind.Series, BaseItemKind.Episode],
                Recursive = true, StartIndex = offset, Limit = 500,
                DtoOptions = new() { EnableImages = false, EnableUserData = false }
            });
            foreach (var item in items) { var value = Convert(item); if (value is not null) result.Add(value); }
            offset += items.Count;
            if (items.Count < 500) break;
            if (offset >= 500000) throw new IOException("Tracking scan exceeded its item safety limit.");
        }
        return result;
    }
    private static Observation? Convert(BaseItem item)
    {
        string type = item.GetBaseItemKind().ToString();
        if (type is not ("Movie" or "Series" or "Episode")) return null;
        bool playable = !item.IsVirtualItem && !string.IsNullOrWhiteSpace(item.Path) && item.RunTimeTicks > 0;
        return item is Episode episode
            ? new(item.Id, type, playable, episode.SeriesId, episode.ParentIndexNumber ?? 0)
            : new(item.Id, type, playable);
    }
}
