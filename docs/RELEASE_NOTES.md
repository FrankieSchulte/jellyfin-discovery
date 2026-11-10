Jellyfin Discovery 0.4.8 and the independently installable Jellyfin Request Hub:

Discovery (0.4.8):
- Increase horizontal shelf capacity from 8 to 20 items (`cardsPerShelf: 20`, auto-upgrading legacy `8`-item saved configs) so horizontal carousels scroll through 20 titles before looping.
- Expand `Discover Movies` and `Discover TV Shows` shelves to 20 released items plus a tail `"See More Movies"` / `"See More TV Shows"` portrait card linking directly to `Discover -> Popular Movies` (`rhView=movies`) and `Discover -> Popular Series` (`rhView=tv`).
- Update Download dropdown options to single-line `"Full Quality"` and `"Condensed"` with no underline, entrance animation (`@keyframes fx-dropdown-enter`), and optimized flight/mobile transcode parameters (`720p` `1280x720`, `H.264 High Profile` at `1.6 Mbps` video + `128 kbps` stereo AAC in `MP4`).
- Ingrain the header search bar directly inside `[data-sleekfin-header-proxy]` so it expands inline inside the header pill with a single `✕` button, searches the entire library regardless of the active page, and hides background page elements (`body.fx-searching`) while searching.
- Unify `Movies -> Library`, `Movies -> Favorites`, `Shows -> Library`, and `Shows -> Favorites` grid & top spacing with `Collections -> Collections` and `Collections -> Favorites`.
- Add top spacing (`margin-top: 10px`) to `#app-user-menu` and `#library-view-menu` dropdowns so they never clip the header pill, and style the Sign-In page (`#loginPage`) to match SleekFin's dark monochrome glass UI.
- Eliminate post-load category/movie switching by persisting `shuffle` alongside `bootRows` in `localStorage` and preserving displayed boot shelf item order during hydration.

Request Hub (0.4.8):
- Support direct `rhView=movies` (`Popular Movies`) and `rhView=tv` (`Popular Series`) deep links from `Discover Movies` and `Discover TV Shows` `"See More"` cards.
- Register `id="requesthub-discover-tab"` natively with SleekFin's Header Proxy and Header Bar UI editor (`Drag your favorite things into the header bar`) and eliminate window-resize header rebuild jank.
