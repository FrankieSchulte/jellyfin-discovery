Jellyfin Discovery 0.6.6 and the independently installable Jellyfin Request Hub:

Discovery (0.6.6):
- Home category layout updates: renamed `Continue Watching / Next Up` to `Continue Watching`, moved `Continue Watching` down to Category 4 (after Recently Added Movies, a curated theme shelf, and Recently Added Shows), and removed `My Media` from the Home screen (with seamless migration for legacy saved profiles).
- Single red bar on Movie & Show detail pages: fixed CSS selector specificity (`main > .page:not(#itemDetailPage)` and `.libraryPage:not(#itemDetailPage)`) so our `border-left` accent no longer duplicates SleekFin's `.sleekfin-section-rail` bar on `#itemDetailPage`.
- SyncPlay & Cast to Device anti-jitter fix: hides the raw pre-SleekFin Frame-0 popover box under `html.sleekfin-menu-ui` while preserving SleekFin's wrapping check, zero-hosts legacy ActionSheet SyncPlay/Cast popups, freezes anchor coordinates across `:active` release, and uses a crisp opacity-only fade with zero scale/translate movement.

Request Hub (0.6.6):
- Request cancellation (`POST RequestHub/Cancel` -> `DELETE /api/v1/request/{id}`): adds a **Cancel request** button inside both Movie and TV Show request pop-ups (immediately after requesting and when reopening an active request) so users can cancel and re-request at a different quality profile.
- Requested state locking: grays out **Confirm request** (`Already requested`) and locks the quality profile dropdown on movies that already have an active request, re-enabling both immediately once cancelled.
- Already-downloaded titles visible in Discover Search: search results (`kind=search`) now display already-downloaded/owned titles with an `Available` badge so users can tell when a title is already in Jellyfin, while scrollable Discover categories continue hiding owned content.
