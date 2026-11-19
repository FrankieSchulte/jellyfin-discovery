Jellyfin Discovery 0.5.11 and the independently installable Jellyfin Request Hub:

Discovery (0.5.11):
- Fix Continue Watching / Next Up missing resumable movies by querying Jellyfin's official Users/{userId}/Items/Resume endpoint (previously calling non-existent Items/Resume which returned 404).
- Fix playback Back button (.headerBackButton) tap reliability on mobile: lift .skinHeader with safe-area padding and a 48x48px hit target, and stop cancelling taps with <=14px touch jitter on interactive buttons.
- Eliminate playback Settings & Subtitles popup position shift by anchoring all OSD menus from Frame 0 via --fx-osd-popup-bottom / --fx-osd-popup-right CSS variables captured on pointerdown/click, and lift & style Playback info (.playerStats) cleanly above the fixed video player.
- Strengthen mobile vertical swipe lock during playback via window-level capture touchmove blocking, .skinBody/.mainAnimatedPages fixed containment, and scroll-guard reset.
- Fix Search page top spacing on both desktop and mobile by removing MUI's redundant AppBar spacer div when #searchPage is active.
- Hide the top-right/overlay play button on portrait-oriented cards across mobile and touch devices.

Request Hub (0.5.11):
- Version parity release alongside Jellyfin Discovery 0.5.11.
