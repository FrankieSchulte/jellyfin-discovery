Jellyfin Discovery 0.5.0 and the independently installable Jellyfin Request Hub:

Discovery (0.5.0):
- Fix `#searchPage` search bar icon vertical alignment (`align-self: center !important`) and `"Suggestions"` heading red-bar spacing (`padding-left: 10px` without `.padded-left` page-gutter override).
- Fix `#searchPage` typing freeze/crash by debouncing `useSearchParam` (`95988`) URL synchronization without React state ping-pong loops and capping `useSearchItems` (`42111`) section cards to 24 per category.
- Hide `Movies (Leaving Soon)` (and any `Leaving Soon` library view) from the header bar, navigation drawer, and inventory views.
- Add comfortable top spacing (`padding-top: 26px`) above the poster grids on `Movies -> Library`, `Movies -> Favorites`, `Shows -> Library`, `Shows -> Favorites`, `Collections -> Collections`, and `Collections -> Favorites`.
- Eliminate the `Movies -> Genres` freeze by neutralizing hidden native React `suggestions`/`genres` queries and blurhash workers (`viewType: 'fx-suggestions'` / `'fx-genres'` in `95753`), skipping redundant per-row API hydration on Genres views, and reducing genre shelf clone copies.
- Scroll to the top of the page when navigating via `"See More"` cards, header tabs, or library subpage view switchers.

Request Hub (0.5.0):
- Scroll to the top of the page when opening `Popular Movies` / `Popular Series` (`rhView=movies` / `rhView=tv`), genre/studio/network grids, or returning to the Discover overview.
- Prevent `MutationObserver` feedback loops with the SleekFin header proxy and hide `Leaving Soon` header items.
