Jellyfin Discovery 0.6.3 and the independently installable Jellyfin Request Hub:

Discovery (0.6.3):
- Unified cached Hero Banner across Home, Movies, and TV Shows: brings the Play/More Info pills, circular frosted-glass side arrows, bottom-right dot navigation bar, and clean metadata layout to the Home page with instant memory + localStorage hero caching on page switches and reloads.
- Removed OfficialRating ("Rated") badges from hero banners, increased hero text thickness and shadow contrast for bright/white backdrops, and eliminated leftover raw star rating text nodes next to Rotten Tomatoes scores on detail pages.
- Fixed playback OSD bottom buttons: keeps record, rewind, fast-forward, skip, and favorite hidden cleanly while moving both Audio and AirPlay under Settings; aligned top playback title, SyncPlay, and Cast inline with the Back button; centered the Play/Pause glyph inside its circle; removed the white focus ring on pause/play.
- Fixed the three-dots (`...`) detail menu across all viewport sizes by clearing ancestor `contain` / `will-change` fixed-position traps and edge-anchoring strictly beyond the button with post-layout reflow.
- Removed hover text underlines on category headings and content titles.
- Fixed hard-reload detail page background bleed by hiding Jellyfin's redundant native `.backdropContainer` / `.backdropImage` behind `#itemDetailPage`.

Request Hub (0.6.3):
- Version parity release alongside Jellyfin Discovery 0.6.3.
