Jellyfin Discovery 0.5.2 and the independently installable Jellyfin Request Hub:

Discovery (0.5.2):
- Eliminate the centered loading circle (`.docspinner` / `<Loading />`) on `Movies -> Movies`, `Movies -> Genres`, `Shows -> TV Shows`, and `Shows -> Genres` by mapping owned tabs in webpack module `95753` to `viewType: 'suggestions'` with empty `sectionsView` (`{ suggestionSections: [], isMovieRecommendations: false }`) so React never mounts `ItemsView`'s indefinite pending spinner, paired with `data-fx-curated-tab="true"` CSS/DOM cleanup.
- Remove the top-right library pagination arrows (`< | >`) from `Movies -> Movies`, `Movies -> Genres`, `Shows -> TV Shows`, and `Shows -> Genres` (`isPaginationEnabled: false`, `viewType: 'suggestions'`, and `data-fx-curated-tab="true"` secondary toolbar filtering), while keeping horizontal scroll arrows on every category shelf and keeping pagination on `Library`, `Favorites`, and `Collections`.
- Make the Sign-In page (`#loginPage`) responsive across desktop, split-screen, tablet, mobile, and short landscape viewports (`100dvh` scroll-safe `margin: auto` centering, adaptive container width, compact action bar), and split user rows evenly by count (`1x1`, `1x2`, `1x3`, `1x4`, `1x5`, `2x3`, `1x7`, `2x4`, `3x3`, `2x5+` with max 5 per row and centered partial rows).

Request Hub (0.5.2):
- Clean up duplicate `hideLeavingSoonNav` definition and bump catalog version in lockstep with Discovery `0.5.2.0`.
