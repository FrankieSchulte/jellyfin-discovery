Jellyfin Discovery 0.4.4 and the independently installable Jellyfin Request Hub:

Discovery (0.4.4):
- Progressive category-by-category loading: pre-fetch the opening Continue Watching row in parallel with library metadata, parallelize library inventory reads (`Limit: 500`), append each shelf immediately as it hydrates, and resolve arrival-tracking badges asynchronously in the background without blocking initial shelf rendering.
- Overhaul Movies and TV Shows pages: intercept SleekFin `jellyfin:view:<guid>` header tab clicks in capture phase so switching tabs lands on Suggestions without opening the left side drawer, hide inactive/active native tab content when viewing Suggestions or Genres, make the top-left `Movies` / `TV Shows` heading itself open the view mode dropdown (`Suggestions`, `Library`, `Genres`), use landscape cards on Genres without SleekFin metadata clutter below posters, and include both movie-specific and show-specific categories in the default profile.
- Smooth, even horizontal arrow scrolling across loop boundaries: pre-normalize `scrollLeft` before starting `scrollBy({ behavior: 'smooth' })` and guard `normalizeLoop` during programmatic smooth scrolling so arrow clicks never stop at loop boundaries.
- Standardize page title (`28px/34px`) and category header (`24px/32px`) typography, red accent bar (`3px`), `10px` left gap, and `14px` bottom margin across all pages.

Request Hub (0.4.4):
- Eliminate the Discover top gap and vertical jumpiness by locking `#indexPage.homePage.libraryPage { padding-top: 0 !important }` while `data-rh-active="true"`, preventing `sleekfin-hero`'s loading state toggles from shifting the page height.
- Replace the `Movie Genres`, `Studios`, and `Networks` text chip boxes with horizontal scrollable Jellyseerr-style `2:1` visual media card carousels using TMDB duotone backdrops and studio/network logos.
- Update the Discover live search placeholder to `"Search new content"` and match header/subheader typography and red bar spacing with Discovery.
