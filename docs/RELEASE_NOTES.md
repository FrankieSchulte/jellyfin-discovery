Jellyfin Discovery 0.5.7 and the independently installable Jellyfin Request Hub:

Discovery (0.5.7):
- Restore full desktop top spacing in half-width window mode across Library, Movies, Shows, Collections, Favorites, Search, and Settings by scoping compact phone top-padding and toolbar-collapse rules strictly to touch/phone viewports.
- Fix `Recently Added` badges across Movies & Shows by preserving historical `DateCreated` timestamps in `ArrivalMonitor` / `Ledger.Observe` across remuxes and rescans and tightening the client `recent()` window to 7 days.
- Exclude already-downloaded and available Movies and TV Shows from `Discover Movies` and `Discover TV Shows` shelves across Home, Movies, and Shows.
- Replace `#searchPage` horizontal carousels with a unified, uncapped Library-style poster grid titled `Results for "xxx"` (Movies and Shows only, no individual Episode clutter), sorted with title matches first followed by closest tag, curated-category, genre, and cast/director alignment.
- Restore the clean `v0.5.5` Profile dropdown (`#app-user-menu`), unify all dropdowns (`#library-view-menu`, `#filter-popover`, Sort, View, Season X, SleekFin popups, and Downloads) with identical frosted-glass opacity, `blur(18px)`, typography, and `fx-dropdown-enter` entrance animation, and anchor all open dropdowns in place so they stay stationary when scrolling down.
- Overhaul the Library Filters popover (`#filter-popover`): thinner `216px` width, thin category-scroll chevron arrows (`›`), zero-lag removal of the 2,500-item `Tags` checkbox list, an auto-mirroring `Year` / `Year Range` input (`From` – `To`), and a bottom `Reset filters` button.

Request Hub (0.5.7):
- Exclude already-downloaded and available Movies and TV Shows (`mediaInfo.status == 5` or playable in the Jellyfin library) across all Discover rails, subviews, genres, studios, networks, and search results, and preserve desktop half-width top spacing.
