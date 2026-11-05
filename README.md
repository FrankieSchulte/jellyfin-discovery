# Jellyfin Discovery

Configurable discovery feeds for Jellyfin: themed shelves, continuous browsing, explained recommendations and useful filters across Home, Movies and Shows.

This project contains a browser extension and a server plugin. The server plugin also provides themed shelves through Home Screen Sections (HSS), persistent arrival tracking and per-user configuration synchronization.

## Features

- Separate Home, Movies and Shows profiles, with configurable opening sections.
- Themes based on genres, tags, ratings, runtime and scheduled months.
- Mixed shelves featuring genres, directors, cast, studios and decades, with repetition cooldowns.
- Continuous scrolling with bounded live card rendering. Titles eventually recur because the library is finite.
- **More like this**, with matching metadata explained and library permissions respected.
- Search, genre, tag, watch-status, runtime, rating, decade and media-type filters.
- **Recently Added** and **New Season** badges based on observations recorded by the server plugin.
- Touch controls, keyboard/remote navigation, and session-local feed/focus restoration.
- A toggle back to Jellyfin's normal library view.

## Compatibility

The current build targets **Jellyfin 12.4**, **HSS 3.0.4**, and Jellyfin Web's **legacy layout**. SleekFin can be used alongside it; the extension does not install or distribute that theme. Modern React page mounts are not implemented.

| Component | Where it works |
| --- | --- |
| Discovery feeds, filters, badges and navigation | Compatible web interfaces that load the browser script |
| Themed HSS shelves | Interfaces that support the HSS integration |
| Arrival tracking and stored discovery preferences | Server-side; their presentation requires a compatible client |
| Independent native interfaces | Do not automatically inherit the web extension, theme or custom screens |

Mobile web wrappers and TV browser shells may load the extension. Physical remotes, client playback and individual TV browsers still require device testing. This project does not replace Jellyfin's playback engine or guarantee identical interfaces across clients.

## Installation

Existing installations upgrading from a separate themed-shelves plugin or Discovery 0.3.0 should first follow [Migration](docs/MIGRATION.md). Do not run two assemblies registering the same HSS shelf IDs.

### Install from the plugin catalog

Once a release has been published, add **Jellyfin Discovery** under Dashboard → Plugins → Repositories → **+ New Repository**, using:

```text
https://github.com/FrankieSchulte/jellyfin-discovery/releases/latest/download/manifest.json
```

Install **File Transformation** and **Home Screen Sections** from their respective catalogs if needed, restart, then install **Jellyfin Discovery** from Catalog and restart again. File Transformation delivers the bundled browser script automatically; HSS supplies optional HSS shelves and related default sections. This catalog does not automatically install those dependencies.

Disable older Discovery/Home Feed/interleaving scripts in JavaScript Injector and refresh. Keep unrelated scripts and theme settings. Do not also paste the bundled browser script when automatic delivery is enabled.

The catalog URL becomes available only after the first successful **Release plugin catalog** workflow. Source uploads and passing checks alone do not publish an installable release. See [Catalog setup](docs/CATALOG.md) for publishing, updates and acceptance tests.

### Manual fallback

Manual installation is optional. The Linux package `server/fazfort-discovery-companion-0.4.0.tar.gz` supports Debian/Ubuntu systemd installations; its installer validates checksums and backs up replaced files. Review its paths and health-check configuration before use. An optional Proxmox helper is included.

If automatic browser delivery is unavailable, disable **Automatically load Discovery in Jellyfin Web** in plugin settings, restart, then add `dist/fazfort-discovery.js` as one enabled, non-module JavaScript Injector script. Without the server plugin, browsing still works but arrival tracking and synchronized preferences are unavailable.

### Themed HSS shelves

Open **Dashboard → Plugins → Jellyfin Discovery** to configure server-wide themed shelf rules, daily counts and seasonal schedules. Restart Jellyfin after adding/removing rules or changing shelf titles, then add the registered rows under **HSS → Section Settings**.

The HSS settings and browser profiles serve different interfaces. Use **Customize** in the browser feed for per-user Home, Movies and Shows profiles. Changing server-wide HSS rules does not overwrite those profiles.

## Controls and configuration

- **Profile → Settings → Discovery settings:** use the visual editor to add/edit categories, move opening rows up/down, choose artwork layouts and select rotating category types separately for Home, Movies and Shows. JSON is available under Advanced for import/export. Authenticated users save their own rules to the server when available; version checks prevent stale edits overwriting newer saves. Local fallback settings can be exported.
- **Movies / TV Shows → Filters:** combine criteria or change sorting. Filtered results are finite and paginated; clear filters to resume mixed discovery browsing.
- **⋯ on a local title:** open explained recommendations. Recommendations stay within the accessible inventory and active filters.
- **Full library / Normal home:** restore native browsing. **Discover shelves** switches back.
- **Controls: auto / tv / touch:** select a device-specific navigation mode. In TV mode, arrows move between cards/shelves, Select opens a title, and holding Select opens recommendations. Back closes the extension's dialogs first.
- Returning from a title restores the feed and positions within the same tab for up to 30 minutes. **Restart feed** reshuffles. Reloading or closing the process clears this in-memory history.

Rules support exact, case-insensitive genre/tag matching, optional rating/runtime limits and month schedules. Seasonal examples use `[10]` for October and `[12]` for December. Keep a rule's `Key` stable to preserve its HSS row identity. See [Rules](docs/RULES.md).

IMDb Top 250 and award categories require explicit membership tags; high community ratings alone do not establish membership. The project does not scrape or claim authoritative rankings.

## Arrival tracking

The first scan establishes a baseline without marking existing titles as new. A movie is recorded when first observed with a playable local path and runtime. A show is recorded when its first playable episode is observed.

**New Season** is recorded for the first playable episode in a previously unseen Season 2 or later. Later episodes do not reset it; specials and Season 1 do not qualify. Badges expire after one calendar month, with New Season taking precedence. No media tags or NFO files are changed.

Events are processed in batches and reconciled every minute. Times represent first observation, including after server downtime. Historical import dates are not reconstructed. Reimporting the same item ID does not create a fresh arrival.

Back up `fazfort-discovery/ledger.json` in Jellyfin's data directory, together with its `.bak` file and plugin configuration. Corrupt/unwritable tracking storage disables tracking without stopping library playback. Preserve the ledger for diagnosis rather than deleting it to change dates.

## Privacy and performance

Server APIs require authentication. Preferences belong to the signed-in user; tracking responses recheck visibility for each requested item. Clients never receive the entire arrival ledger or integration credentials.

Metadata loads in pages and is cached briefly per user/server/page/library. Images load lazily, and distant card rows are virtualized. Planning still runs in the browser; very large libraries may need further performance work. Existing HSS background loading may still occur.

## Development

```sh
npm ci --ignore-scripts
npm run build
npm run check
npm test
npm run preview
```

The preview uses synthetic data at `http://127.0.0.1:8088`. Edit `src/` and `config/`, then rebuild the tracked browser bundle.

Native development requires .NET 10:

```sh
dotnet build native/src -c Release
dotnet run --project native/tests -c Release
dotnet run --project native/shelf-tests -c Release
bash scripts/build-native.sh
python3 scripts/package.py
```

GitHub Actions checks both implementations and verifies that the browser bundle matches its source. Passing checks do not establish live server or device compatibility. See [Validation](docs/VALIDATION.md) for coverage and remaining acceptance checks.

Some internal assembly names, API routes and filenames retain their original identifiers for upgrade compatibility. They are implementation details, not separate plugins to install.

## Rollback

Disable the browser script and refresh to restore the previous interface. The server package includes `uninstall.sh`, which removes the plugin while retaining tracking/preferences. For an upgrade rollback, restore the backed-up plugin directory while Jellyfin is stopped; never leave multiple versions of the same assembly under its plugins directory. See [Migration](docs/MIGRATION.md) before restoring a standalone shelves build.

## License

MIT. See [LICENSE](LICENSE).

## Opening row layout

In Customize, mix default sections with specific categories or rotating slots such as Directed by…, Starring…, genre and decade. Move Up/Down sets the opening order. Removed default sections are disabled for that profile; remaining unlisted default sections follow the opening. Afterward, the existing varied feed continues. A scheduled category outside its months, a disabled category, or a row below the minimum match count is skipped.

Automatic artwork uses portrait cards for Discover sections and poster-only pools, and landscape cards for other rows. Explicit artwork overrides are available for category definitions and opening-row types. Repeated occurrences of a row type share its artwork setting.

SleekFin's hero remains owned by SleekFin. Discovery preserves its visible mount anchor and does not require changes to the theme. Ensure the hero is enabled in SleekFin settings.

## Suggestions, Library and Genres

Movies and TV Shows default to Suggestions with metadata-driven shelves. The page selector switches to the native Library (with filters/sort/view options) or styled genre shelves. Play All and Shuffle are hidden on these library pages. Other tabs, such as Favorites and Collections, retain their native behavior.

Home has no visible utility header. Open your profile's Settings page and choose Discovery settings for category editing, device control mode, normal/Discovery Home and reshuffling. The settings are for the signed-in user. Home filters are omitted; Movies and TV Shows keep a Filters action.

Category arrows and remote navigation wrap at either edge; horizontal trackpad/swipe edge gestures can also wrap. Each row loops its current loaded selection, whose size is controlled by Cards per shelf. This is bounded circular browsing rather than downloading every matching title into each row. Physical gesture behavior still needs device testing.

Continue Watching groups episodes by series and opens the selected resume episode's details. It prefers an in-progress episode over a Next Up entry, then the newest reported playback activity. It does not autoplay or modify playback state.

Existing saved profiles remain unchanged. In Discovery settings, select the appropriate page and choose **Add supplied categories** to merge the new defaults without replacing categories that already share those keys. Defaults use real metadata: genres, anime/theme tags, community scores and director/cast/studio groups. Categories below the minimum count stay hidden.

## Optional Request Hub

The release catalog also contains **Jellyfin Request Hub**, a separate plugin for Jellyseerr browsing and requests within Jellyfin Web. Install it separately, configure the server connection and explicitly map each user's Jellyfin/Jellyseerr IDs. See [Request Hub setup and security](requests/README.md). Its credentials and permissions are independent of Discovery and HSS.
