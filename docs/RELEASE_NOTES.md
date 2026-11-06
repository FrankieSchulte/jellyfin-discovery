Jellyfin Discovery 0.4.6 and the independently installable Jellyfin Request Hub:

Discovery (0.4.6):
- Cold-start instant opening shelves (`Continue Watching / Next Up`, `Recently Added Movies`, `Recently Added Series`) and Netflix-style gray shimmer skeleton rows so first-time users never wait for full library scans.
- Fix header search bar popup disappearing on click, fix `Shows -> Favorites` endless loading spinner (`viewType: 'favorites'`), and remove `Filters`, `Play All`, `Shuffle`, and `"### matching titles"` clutter across Movies, Shows, and Collections.
- Unify single red bar (`3px`), bold `28px/34px` page titles, `18px` top vertical spacing, `.overflowPortraitCard` poster sizing, `#boxsetsPage` / `#liveTvPage` horizontal alignment, and SleekFin-styled Profile & User Settings pages.
- Add Download quality dropdown (`Full Quality` original file vs `Condensed 1080p` H.264/AAC stream) on movie/episode detail download buttons.

Request Hub (0.4.6):
- Hide the `Discover` header tab for users without request permissions via `RequestHub/Status`, standardize row arrow buttons (`‹` / `›`) to match Home/Movies/Shows, and add Netflix gray shimmer placeholders while posters load.
- Make Request Hub and Jellyfin Discovery plugin settings pages responsive in half-screen mode.
