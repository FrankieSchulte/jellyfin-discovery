Jellyfin Discovery 0.5.10 and the independently installable Jellyfin Request Hub:

Discovery (0.5.10):
- Eliminate Filters dropdown flicker and duplicate Reset filters button flash by deferring footer mounting until SleekFin creates .sleekfin-menu-popup and disabling MUI Grow double-fade on .sleekfin-menu-host.
- Fix dropdown icon brightness flash on open/close: keep all dropdown icons uniform at rest and brighten only on :hover, :focus-visible, or active selection (suppressing auto-focus brightening of the top item).
- Position the video playback Settings popup cleanly above the gear icon (.btnVideoOsdSettings) with upward entrance animation and higher opacity (rgba(15, 16, 20, .97)) so bright frames do not wash it out, and match injected Audio/Favorites icon wrapping with SleekFin's native markup.
- Fix Settings menu (.listItem-border) inner hover box artifact and unify all Settings menu & preferences buttons with Jellyfin Discovery's sleek single-layer dark-glass button style.

Request Hub (0.5.10):
- Version parity release alongside Jellyfin Discovery 0.5.10.
