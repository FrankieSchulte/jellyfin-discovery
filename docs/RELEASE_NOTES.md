Jellyfin Discovery 0.4.3 and the independently installable Jellyfin Request Hub:

Discovery (0.4.3):
- Eliminate scroll jumpiness when loading more shelves: disable CSS scroll anchoring (`overflow-anchor: none`) across Discovery containers and shelves, remove scroll-snap and manual `scrollTop` resets that interrupted smooth compositor scrolling, lock card aspect-ratio width before image decode, and ignore SleekFin header/Request Hub mutations in the Discovery MutationObserver.

Request Hub (0.4.3):
- Subpage title replaces `Discover` in the top-left heading (e.g., `Popular Movies`, `Adventure`, `A24`, `Netflix`), removing the `← Back to Discover` button and duplicate sub-heading.
- De-select the `Discover` header button when viewing any Discover subpage (matching Jellyfin/SleekFin's `Collections` subpage behavior) so clicking the de-selected `Discover` header button returns directly to the main Discover overview.
- Eliminate scroll jumpiness on the Discover page and subpages: stop toggling `<p class="rh-row-status">Loading…</p>` between `display: none` and `display: block` during horizontal/vertical scroll loads, batch newly fetched cards in a `DocumentFragment`, and set `overflow-anchor: none` across all Discover rows, tracks, and grids.
- Replace the `Search` and `Browse all` buttons with a live search input (`"Search new movies and TV"`) featuring a faded search icon on the left that updates results as you type and returns to the Discover overview when cleared.
- Add a `Networks` section (`Netflix`, `Disney+`, `Prime Video`, `Apple TV+`, `HBO`, `Hulu`, `Paramount+`, `Peacock`, `FX`, `AMC`, `Showtime`, `Adult Swim`) alongside `Movie Genres` and `Studios`, backed by `/api/v1/discover/tv/network/{id}`.
