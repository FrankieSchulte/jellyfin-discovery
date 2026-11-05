Jellyfin Discovery 0.3.3 fixes presentation and adds visual feed editing.

- Preserve SleekFin's visible hero mount anchor and its adjacency while hiding native rows individually. Late HSS rows are hidden without removing the banner anchor.
- Replace the utility-button header with one compact Browse options disclosure. Keep native/full-library view, Filters, Customize, control mode and reshuffle actions available inside it.
- Render Discover posters in portrait cards and prefer Primary artwork for portrait rows. Automatically use portrait rows for poster-only pools; support explicit per-category and per-row-type artwork overrides.
- Add a visual category editor for Home, Movies and Shows. Edit names, media types, genres, tags, directors, cast, studios, score, runtime, years and scheduled months. JSON remains an advanced import/export option.
- Arrange opening rows with Move Up/Down: mix default sections, specific themes and rotating genre/director/cast/studio/decade slots. Empty/out-of-season rows are skipped; diverse continuous browsing follows the opening.
- Add the missing dashboard settings-menu link.

Existing rule keys, plugin ID, preferences storage and arrival history are retained. The saved profiles stay independent across Home, Movies and Shows. File Transformation delivers the matching browser bundle after update/restart; no JavaScript Injector copy is required.

Automated tests cover the integrations with synthetic DOM/API fixtures. Live visual layout, actual SleekFin registration timing, proxy HTTP behavior and physical remotes still need acceptance testing. An enabled, working SleekFin hero is required for its banner; Discovery does not replace a disabled theme hero with a second implementation.
