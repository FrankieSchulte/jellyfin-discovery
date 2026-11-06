Jellyfin Discovery 0.4.2 and the independently installable Jellyfin Request Hub:

Discovery (0.4.2):
- Fix vertical scroll jump/jank when loading additional shelves in Suggestions: batch DOM insertions across async hydration, preserve scrollRoot offset, prevent CSS scroll anchoring on footer/placeholder rows, and avoid redundant native-attribute thrashing or layout reflows during virtualization.

Request Hub (0.4.2):
- Exclude unreleased movies and TV shows (`releaseDate` / `firstAirDate` in the future or 0 votes without availability) across server-side and client-side Discover browsing, automatically fetching additional pages when needed so rows stay full.
- Match SleekFin's exact `data-sleekfin-header-source-visual="true"` structure and flex alignment so the `Discover` compass icon in the header bar is properly centered and spaced like `Home`, `Movies`, `Shows`, and `Collections`.
- Align Discover page layout with Movies and TV Shows: full-width edge-to-edge shelves (`clamp(16px, 4vw, 80px)` padding) and a clean top-left `Discover` title bar with an inline search input instead of a boxed gradient banner.
- Replace single-row genre/studio/search results with a full multi-row responsive poster grid (`repeat(auto-fill, minmax(175px, 1fr))`) with infinite vertical scroll and a `← Back to Discover` button (plus clicking the `Discover` title/header button or pressing `Escape`/TV Back to return).
- Remove redundant `Load more` buttons above category headers and add a 2:3 portrait `See More` card at the end of each horizontal carousel (`Trending Now`, `Popular Movies`, `Popular Series`) to open the full grid view.
- Full TV remote directional navigation (`ArrowLeft`/`ArrowRight`/`ArrowUp`/`ArrowDown`, `Enter`, `Escape`/TV Back) across the Discover toolbar, filter chips, horizontal carousels, multi-row grid, and request modal.
