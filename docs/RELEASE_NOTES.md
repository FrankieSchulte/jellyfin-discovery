Jellyfin Discovery 0.6.4 and the independently installable Jellyfin Request Hub:

Discovery (0.6.4):
- Playback OSD polish: fixed CSS specificity so Favorite (`.btnUserRating`), Rewind (`<<`), and Fast-Forward (`>>`) stay strictly hidden on the bottom playback bar (leaving Favorite, Audio, and AirPlay neatly under Settings), and balanced vertical spacing (`18px`) evenly between the scrubbing bar and bottom edge.
- Three-dots (`...`) menu reliability across all window widths: resolves the visible `#itemDetailPage` (avoiding hidden cached SPA pages), neutralizes ancestor `.dialogContainer`/`.dialog.actionSheet` containing-block/clipping traps, and clamps viewport-space `top`/`left` placement strictly clear of the button and inside viewport margins.
- Header & Back button alignment across all screen widths: locks `[data-sleekfin-header-toolbar]`, `[data-sleekfin-legacy-top]`, `.sleekfin-details-back`, `.fx-subpage-back-top`, and `.osdHeader` playback controls onto the exact same vertical centerline.
- Collections -> Genres standardization & end-of-row gradient fix: unifies category titles, vertical spacing, and scroll arrows across Collections/Genres and dynamically disables the right-edge gradient mask whenever scrolled to the end of a finite row.
- Hero Banner Content Controls (per-page for Home, Movies, and Shows in Settings -> Customize Home): pin specific movies/shows in custom order, switch between Automatic / Pinned First / Pinned Only, set a minimum Rotten Tomatoes % threshold (with quick `75%`–`95%` presets), filter by genre/year/star rating, and exclude already watched titles.
- Direct Hero Playback: clicking Play on any Home, Movies, or Shows hero banner now triggers immediate playback via `emby-itemscontainer` `data-action="play"` and `playbackManager.play()`.
- Standardized Typography: unified font family, sizes, weights, and letter-spacing across all equivalent UI elements (headings, cards, subtitles, pill buttons, menus, and descriptions).
- Detail Page & More Like This ratings consistency: resolves the visible detail page reliably, stays resilient to Preact re-renders (fixing titles like *Only Yesterday* showing star scores on detail pages), and replaces star ratings on More Like This cards with the user's configured ratings preference (e.g. Rotten Tomatoes).

Request Hub (0.6.4):
- Version parity release alongside Jellyfin Discovery 0.6.4.
