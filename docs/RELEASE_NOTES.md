Jellyfin Discovery 0.4.1 and the independently installable Jellyfin Request Hub:

Discovery (0.4.1):
- Eliminate the brief flash of default native/HSS categories when loading Home, Movies, or TV Shows by hiding owned native sections immediately on mount and via CSS before async metadata fetches complete, while preserving fail-open restoration if initialization fails.
- Speed up initial shelf rendering by fetching user preferences and library inventory in parallel and reusing cached Home inventory across Movies and Shows views.
- Seamless endless horizontal carousel looping (`[1, 2, 3, 4, 5, 1, 2, 3, 4, 5, ...]`) that continuously wraps in both directions without hitting a hard wall or teleporting back to the start.
- Overhauled dark-theme Discovery Category Studio (available both in `Dashboard → Plugins → Jellyfin Discovery` and `Profile → Settings → Discovery settings`) with:
  - Library-discovered **Possible Categories Explorer** to browse and toggle categories for `Directed by X`, `Starring X`, `From Studio X`, `Movies/Shows from 20XX` / `20XXs`, `Genres`, and `Themes & Tags` with live title counts and one-click `Pin to top`.
  - Quick category templates (`+ Director Spotlight`, `+ Actor Spotlight`, `+ Studio Collection`, `+ Year / Era`, `+ Under 100m`, `+ 8.0+ Acclaimed`, `+ Seasonal`) and clickable metadata chips.
  - Visual category reordering (`↑`/`↓`), search, and live match counts.

Request Hub (0.4.1):
- SleekFin Header Bar integration: injects a properly structured `Discover` tab button into `[data-sleekfin-header-proxy]` before the toolbar separator and registers a `Discover` toolbar source in `.headerLeft` for SleekFin's Header Bar builder.
- Reliable route mounting on `#/home?requesthub=discover` across SPA page transitions, hiding late-arriving SleekFin hero/HSS elements and dynamically loading Request Hub's browser script when navigating from cached tabs.
- Overhauled dark-theme UI for both the Request Hub Discover view (hero search bar, genre/studio pills, 2:3 cover poster cards, two-column request modal with season chips) and `Dashboard → Plugins → Request Hub` settings (dark-theme cards, Jellyfin user dropdown selector, one-click current user mapping, and `Open Discover` launcher).
