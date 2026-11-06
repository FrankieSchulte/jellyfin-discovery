Jellyfin Discovery 0.4.5 and the independently installable Jellyfin Request Hub:

Discovery (0.4.5):
- Instant opening shelf rendering on Home, Movies, and Shows via persistent boot cache (`fazfort-discovery:boot:v1:...`), eliminating the "Reading metadata..." loading screen and empty "Load more" footer on refresh.
- Support Jellyfin 12.4.0's React `#moviesPage` and `#tvshowsPage` containers without `.pageTabContent` children, and unify header (`28px/34px`), category title (`24px/32px`), and card sizes across Home, Movies, Shows, Live TV, and Collections (including Genres).
- SleekFin-styled dropdown menus for view switchers and user profile menus, plus customized view options for Movies (`Movies`, `Library`, `Favorites`, `Genres`) and Shows (`TV Shows`, `Library`, `Favorites`, `Genres`).
- Netflix-style slide-out header search bar with live `"More to explore:"` suggestions and backdrop results grid, plus card-aligned horizontal arrow scrolling.

Request Hub (0.4.5):
- Eliminate the Discover top gap and `sleekfin-hero` spacer vertical jump by hiding `header.MuiAppBar-root + div[aria-hidden="true"]` and matching `.rh-root` / `.rh-toolbar` top and horizontal offsets to Movies, Shows, Live TV, and Collections.
- Limit `Trending Now`, `Popular Movies`, and `Popular Series` rails to 20 released titles loaded once up front with the `See More` card at the end, and snap horizontal arrow scrolling to card left edges.
