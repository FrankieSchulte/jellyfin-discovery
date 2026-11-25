Jellyfin Discovery 0.6.2 and the independently installable Jellyfin Request Hub:

Discovery (0.6.2):
- Permanently bake the finalized static, scrollable noisy textured ambient background (`#0a0b0f` base, `#323846` / `#222630` glows at 67% concentration & 51% spread, 12% 290px grain, zero animations) extending indefinitely down the page across all website widths, and remove the temporary BG Tuner widget.
- Make hero banner bottom transitions transparent across Home, Movies, Shows, and Detail pages so backdrops melt smoothly into the textured background with zero black band underneath.
- Remove the translucent pill box behind the Movies & TV Shows hero title dropdown button.
- Unify hero banner side navigation arrows and the playback top-left Back button (style and top-left alignment) with the circular frosted dark-glass back arrow used on detail and category pages.
- Fix the Info (`i`) modal flash/reappear glitch by keeping `.fx-modal-origin-anim` applied until dialog close so Jellyfin's underlying entry animation never restarts from `opacity: 0`.
- Fix SyncPlay (`#app-sync-play-menu`) and Cast to Device (`#app-remote-play-menu`) popups during playback so they anchor directly below their top-right buttons instead of bottom-right.
- Vertically center the playback bottom button row (Play/Pause, CC, Mute, Volume, Settings, PiP, Fullscreen) symmetrically between the scrub bar and bottom of screen.
- Fix playback volume slider click/drag offset by aligning with Jellyfin `htmlVideoPlayer`'s exact cubic volume curve (`Math.pow(v/100, 3)`) and thumb track padding.

Request Hub (0.6.2):
- Version parity release alongside Jellyfin Discovery 0.6.2.
