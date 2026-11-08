Jellyfin Discovery 0.4.7 and the independently installable Jellyfin Request Hub:

Discovery (0.4.7):
- Eliminate page-entry and endless-scroll transition flicker by upgrading boot shelves in-place (`fillSlot`), reusing card/image DOM nodes across `loadMore`, and tracking loaded poster URLs (`loadedImages`) so cached images render instantaneously without `.is-loading` shimmer.
- Fix `"Recently Added"` and `"New Season"` badge flash and false positives by persisting server arrival tracking in `localStorage` (`fazfort-discovery:tracking:v1:*`) and removing raw `DateCreated` / `seasons.has` fallbacks.
- Remove `"Couldn't load MyJellyseerrRequests..."` error banner on `Movies`, `Shows`, and `Home`.
- Unify all dropdown menus (`#library-view-menu`, `#app-user-menu`, `.fx-download-menu`, `.fx-season-menu`, `.fx-dropdown-menu`) with SleekFin's `.sleekfin-more-menu` 3D glass surface and transparent non-dimming backdrop.
- Unify colors across all shelves, cards, shimmers, and controls with SleekFin's neutral monochrome gray palette.
- Fix `Collections` subpage right boundary, `Collections -> Genres` A-Z sidebar, `Movies -> Library` / `Shows -> Library` poster & top spacing, empty `Favorites` message spacing, `#itemDetailPage` double vertical red lines, `Season X` border/arrow/dropdown menu, and `<Movie Title>.mp4` clean download filenames.

Request Hub (0.4.7):
- Unify poster shimmers, cards, logos, and modals with SleekFin's neutral monochrome gray palette and cache loaded TMDB poster URLs to eliminate re-render flicker.
