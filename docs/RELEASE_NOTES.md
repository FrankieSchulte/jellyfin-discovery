Jellyfin Discovery 0.5.12 and the independently installable Jellyfin Request Hub:

Discovery (0.5.12):
- Fix mobile playback click/tap blocking: remove position:fixed stacking-context trap on .mainAnimatedPages/.skinBody (which buried #videoOsdPage beneath .videoPlayerContainer), enforce explicit z-index layering (.videoPlayerContainer z-index:0 pointer-events:none < #videoOsdPage z-index:10 < .skinHeader z-index:999 < .playerStats < .dialogContainer), and allow <=10px tap jitter on the video canvas so single-tap OSD toggles and button taps always register while blocking vertical swipes.
- Make Jellyfin web library view patching (applyWebpackViewPatch) future-proof against Jellyfin 10.12+ webpack module renumbering by scanning loaded webpack cache exports structurally when 10.11 IDs are absent.
- Silence harmless startup error stack trace when Home Screen Sections is not installed (log informational standalone-mode message instead).

Request Hub (0.5.12):
- Version parity release alongside Jellyfin Discovery 0.5.12.
