Jellyfin Discovery 0.6.5 and the independently installable Jellyfin Request Hub:

Discovery (0.6.5):
- Hero Banner shadow layering fix: tightened logo/title shadows and established explicit stacking layers so large logos (e.g. tall anime/movie wordmarks) never cast dark shadows over metadata or description text below them.
- Hero Banner manual switch timer reset: switching hero slides manually via dots, prev/next arrows, or touch swipe now cleanly resets the 9-second auto-advance interval.
- Stutter-free SyncPlay & Cast to Device popups: anchors header popovers on Frame 0 via `pointerdown` capture + `data-fx-header-menu-opening` and keeps `#app-sync-play-menu` / `#app-remote-play-menu` in fixed viewport coordinates without MUI scroll-offset jitter or double-entry animations.
- Full-window three-dots (`...`) menu visibility fix: binds menu coordinates (`--fx-more-left`, `--fx-more-top`, `--fx-more-max-w`, `--fx-more-max-h`) through stylesheet `!important` CSS variables so SleekFin's ResizeObserver `S(e)` relative-offset writes (`left: -240px`) can never teleport the popup off-screen on wide/full-sized windows.
- Horizontal category scroll lock: enforces `overflow-y: hidden !important` and `overscroll-behavior-y: auto` across `.fx-track`, `.rh-track`, and horizontal `.emby-scroller` rows so vertical page scrolling can never accidentally scroll a category vertically.
- In-place Discover card requests: clicking any movie or show under Discover Movies or Discover Shows on Home, Movies, or Shows opens the Request Hub pop-up directly in place without navigating away to the Discover page.

Request Hub (0.6.5):
- Standalone `window.JellyfinRequestHub.openDetails(item, triggerEl)` dialog mounted on `document.body` so request pop-ups open smoothly from any page with origin-morph animation.
- Movie Request pop-up enhancements: adds Radarr Quality Profile selection (cached from Jellyseerr `service/radarr`) plus rich details including Rotten Tomatoes Tomatometer & Popcornmeter scores, runtime, certification, genres, tagline, director, and cast.
- TV Show Request pop-up enhancements: adds Sonarr Quality Profile selection (cached from Jellyseerr `service/sonarr`) plus rich details (season count, networks, status, certification, genres, cast), intentionally omitting Rotten Tomatoes scores for multi-season series.
- Server-side profile validation: `POST RequestHub/Request` validates any requested `profileId`/`serverId` against configured Radarr/Sonarr servers and attaches the authoritative `serverId`, `profileId`, `rootFolder`, and `is4k` server-side.
