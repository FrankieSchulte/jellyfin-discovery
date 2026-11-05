# FazFort Discovery 0.3.0 — preview

Custom Home, Movies and Shows feeds for Jellyfin Web's legacy layout with SleekFin. This release adds explained **More like this**, interactive browsing filters, reliable arrival tracking through a native companion, synchronized rules, and mobile/TV navigation improvements.

**Target:** Jellyfin 12.4, HSS 3.0.4, the existing FazFort Shelves 1.0.2, and a modern web browser/wrapper. The native Android TV app, Swiftfin and other independent interfaces do not load this web extension. Modern React page mounts remain outside this release. Live installation, physical remotes and mobile playback have not been verified here.

## Install the update

There are two parts. Keep your existing HSS, SleekFin and FazFort Shelves plugins installed.

### 1. Install the addition-tracking companion

The prebuilt `server/fazfort-discovery-companion-0.3.0.tar.gz` contains the compiled DLL and installer. No SDK is needed on your server. From your Mac, after extracting this ZIP:

```sh
scp ~/Downloads/fazfort-discovery/server/fazfort-discovery-companion-0.3.0.tar.gz root@192.168.1.10:/root/
```

Adjust the local Downloads path if you extracted elsewhere. On the Proxmox host:

```sh
tar -xzf /root/fazfort-discovery-companion-0.3.0.tar.gz -C /root
bash /root/fazfort-discovery-companion/deploy-from-proxmox.sh --check
bash /root/fazfort-discovery-companion/deploy-from-proxmox.sh --install
```

The deploy script targets Jellyfin **CT 100**. Installation briefly restarts Jellyfin, assigns files to its service user, and checks the local `/health` endpoint. If readiness fails it restores the previous companion. The health check confirms Jellyfin startup, not every companion feature. A customized local port/base URL requires `JELLYFIN_HEALTH_URL` inside the container; read `native/install.sh` before installation in that case.

The companion is separate from FazFort Shelves: plugin ID `da85d59b-cd29-4f4a-9b72-820a298cdb9d`, folder `FazFort.Discovery_0.3.0.0`. It does not replace or rewrite the earlier plugin or HSS rules.

### 2. Replace the browser script

1. Open Jellyfin → Dashboard → JavaScript Injector.
2. Disable the old Discovery 0.2.0, Home Feed and interleaving scripts. Leave unrelated scripts/theme settings enabled.
3. Add or replace one script named **FazFort Discovery 0.3.0**, using the entire `dist/fazfort-discovery.js` file. Enable it and leave module mode off.
4. Save and refresh. Open Home, Movies and Shows.
5. Wait for the companion's initial baseline. `window.FazFortDiscovery.diagnostics()` reports `trackingReady` and `preferencesSync`.

The browser script can work without the companion: browsing, filtering and recommendations remain available, but tracked arrival badges and cross-device rule synchronization are unavailable. It displays that status rather than guessing dates.

## New controls

- **⋯ on a local card:** opens More like this with the matching tags/genres/director/cast explained. Recommendations use only the current page/library's accessible inventory, exclude the source title and obey active filters. Movies can recommend movies; Shows recommends shows; Home can mix both. Your default Hide Watched preference is respected unless an explicit watch-status filter overrides it.
- **Filters:** title/person search, genre, tag, watched/unwatched, movie runtime, community score, decade, Home media type, and sorting. Numeric filters exclude unknown data. Active filters/sorts produce a finite, paginated list of matches; empty results stay empty instead of showing the unfiltered library. Clear filters to return to curated endless browsing.
- **Full library / Normal home:** restores native Jellyfin browsing. Our filters are disabled in that mode; native sorting/filtering remains available. **Discover shelves** switches back.
- **Controls: auto / tv / touch:** a device-specific override. Auto recognizes Jellyfin TV layout and common TV user agents. If TV Bro appears as a generic Android browser, explicitly choose **tv**.
- **TV controls:** Left/Right moves between cards; Up/Down moves between shelves. Select opens a title; holding Select for about 650 ms opens More like this. Info/context-menu is another shortcut where the remote provides it. Back closes our dialog or open filters first. Player keys and text input are left to the client outside our owned controls.
- **Return from a title:** the same feed, filters, focused card and horizontal/vertical positions are restored within the same tab for up to 30 minutes. Restart feed explicitly reshuffles. Full page reloads or leaving the app/browser process do not preserve this in-memory history.

Mobile controls have 44 px touch targets, safe-area spacing, scrollable dialogs and narrow-screen layouts. The bundle is compiled for Chrome 69+/Safari 13+ JavaScript, with a `replaceChildren` fallback and a dialog fallback. This does not guarantee that every older TV can run Jellyfin/SleekFin themselves. TV shell playback/codec support is a separate device test.

## How reliable addition tracking works

The companion stores a persistent ID ledger in Jellyfin's data directory at `fazfort-discovery/ledger.json`, with a previous-write `.bak` copy. Back up this directory with your server data.

- The first scan establishes the existing library as a **baseline without arrival badges**. Historical import times are not reconstructed from filesystem dates.
- A movie is recorded when first observed with a local path and playable runtime metadata.
- A show is recorded when its first playable episode is observed. Empty/virtual series do not immediately earn a badge.
- A **New Season** timestamp is recorded on the first playable episode of a previously unseen Season 2+. Later episodes in that season do not reset it. Specials and Season 1 do not qualify as New Season.
- Item-added events are processed in batches, and a one-minute reconciliation catches missed events or metadata that became playable later. Typical visibility is seconds to a minute, followed by a feed refresh.
- Duplicate scan/metadata events and restarts retain the original observation timestamp. Removing/reimporting the same Jellyfin item ID is conservatively treated as the same arrival; rebuilding IDs requires a fresh baseline/review rather than manufacturing historical dates.
- When the server was offline, the time is **first observed after startup**, not a claim about the exact import time during downtime.
- Badges expire after one calendar month. A recent season takes precedence over a recently added show. No media tags or NFO files are changed.
- Corrupt/unwritable tracking storage disables tracking and leaves Jellyfin's library/playback running. Do not delete the ledger to repair a date; preserve it for diagnosis.

Recently Added shelves prioritize tracked arrivals, including tracked season arrivals for Shows. Baseline titles without tracked history use Jellyfin's existing DateCreated only for the remaining shelf ordering, never to award a tracked arrival badge.

## Rules and synchronization

Customize retains separate Home, Movies and Shows rules. With the companion ready, Apply saves them to your authenticated Jellyfin user; another compatible device picks them up when it opens/restarts the feed. Concurrent changes use version checks so a stale editor cannot overwrite a newer save. If the companion is unavailable, preferences can be saved locally and transferred using Export/Import.

Only the discovery configuration is synchronized. Control mode and native/discovery toggles are device/browser preferences. Browsing filters and scroll history are session-local. No watchlist or playback engine is added by this release.

Existing Home names, seasonal Halloween/Christmas rules, and the previous alternating opening anchors are retained. Further shelves mix themes, genres, directors, cast, studios and decades. The planner favors family variety and recent-title cooldowns. Endless browsing revisits titles from your finite collection; it is not an unlimited external catalogue.

IMDb Top 250 and Award Winners still require explicit membership tags (`imdb-top-250` / `award-winner`). They are not inferred from high ratings. See [docs/RULES.md](docs/RULES.md).

## Security and performance

The companion's APIs require a signed-in Jellyfin user. Preferences are addressed by the authenticated identity; there is no caller-supplied target user. Tracking requests are limited to specific item IDs and each is rechecked through Jellyfin's per-item user visibility lookup. The global arrival ledger is never returned to clients. Configuration writes are size-limited, validated and versioned.

Browser metadata inventory still loads in pages of 200. This release does not move full feed planning to the server or introduce a server-side feed cursor. Images load lazily; only nearby shelf rows keep live card DOM, plus a focused row. Offscreen rows are reconstructed as you scroll back. HSS may still perform its usual background home loading. Initial catalogues are cached in memory for five minutes, per user/server/page/library.

The companion periodically reads Movie, Series and Episode IDs/availability metadata for tracking, without artwork or names in the persisted ledger. It does not scrape external recommendation services. Rules/profiles are stored on the server, and browser fallbacks contain only configuration—not integration credentials.

## Rollback

Disable Discovery 0.3.0 in JS Injector and refresh. Re-enable your prior script if desired. To remove the companion too, from Proxmox:

```sh
pct exec 100 -- bash /root/fazfort-discovery-companion/uninstall.sh
```

Uninstall briefly restarts Jellyfin and retains arrival history/preferences for reinstallation. Existing HSS and FazFort Shelves remain installed. Runtime stop for this tab is `window.FazFortDiscovery.stop()`.

## Develop / upload to GitHub

The extracted folder is the repository root. Upload its contents, including `.github`, `.gitignore`, the npm lockfile and the browser bundle. No repository has been created or pushed for you. Avoid uploading private ledger files, configuration backups or `node_modules`.

```sh
npm ci --ignore-scripts
npm run build
npm run check
npm test
npm run preview
```

The preview at `http://127.0.0.1:8088` uses synthetic data only. For native development, install .NET 10:

```sh
dotnet build native/src -c Release
dotnet run --project native/tests -c Release
bash scripts/build-native.sh
python3 scripts/package.py
```

The native build creates `server/fazfort-discovery-companion-0.3.0.tar.gz`; packaging includes that prebuilt tarball and source in `release/fazfort-discovery-0.3.0.zip`. The legacy native Shelves source remains under `legacy/native-shelves-1.0.2/`. Current implementation and remaining live checks are recorded in [docs/VALIDATION.md](docs/VALIDATION.md).
