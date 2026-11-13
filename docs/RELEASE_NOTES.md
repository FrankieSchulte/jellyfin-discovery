Jellyfin Discovery 0.5.1 and the independently installable Jellyfin Request Hub:

Discovery (0.5.1):
- Eliminate the initial Home screen flash of `"Continue Watching / Next Up"` when a user's configured opening shelf starts with a custom category (`fastOpening` now respects `config.pages[page].opening` after loading profile preferences, extends cached boot-row TTL to 7 days, and hides native `.homeSectionsContainer` rows at frame 0 via CSS while preserving `.sleekfin-hero`).
- Prevent `#loginPage` from bleeding into the background of `Collections` (`#boxsetsPage`) or other pages by scoping `#loginPage` flex rules to `:not(.hide):not(.hidePage):not([hidden])` and enforcing `display: none !important` when hidden.
- Hide the total library item count chip (`.MuiChip-root`) on curated `Movies` (`tab=1`), `TV Shows` (`tab=1`), `Genres`, `Live TV`, `Home`, and `Search`, keeping it only on true grid views (`Library`, `Favorites`, `Collections`).
- Overhaul `#searchPage` with `#searchPage#searchPage` specificity to override `sleekfin-media.css`: clean centered dark-glass search bar, dark-glass `"Suggestions"` card without 80px `.padded-left` offset, and flush search result category headers (`padding-block: 0 !important`) eliminating the empty top line and double-height red bar.
- Permanently hide `Movies (Leaving Soon)` and `Shows (Leaving Soon)` from SleekFin's header proxy, overflow drawer, MUI drawer, and cached `sleekfin:header-sources:v2` entries, dispatching `resize` once to recalculate the header pill width.

Request Hub (0.5.1):
- Permanently hide `Movies (Leaving Soon)` and `Shows (Leaving Soon)` across SleekFin's header proxy, overflow drawer, and `sleekfin:header-sources:v2` session cache via `data-fx-leaving-hidden="true"` and immediate `MutationObserver` header syncing.
