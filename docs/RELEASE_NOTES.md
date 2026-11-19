Jellyfin Discovery 0.5.9 and the independently installable Jellyfin Request Hub:

Discovery (0.5.9):
- Fix page & video player interaction freeze after dismissing three-dots actionSheet menus or playback Settings dropdowns by preserving SleekFin's 1ms settle animationend lifecycle and adding a defensive closing guard.
- Overhaul Filters dropdown: eliminate individual year checkbox flash at frame 0, replace year picker with labeled From/To inputs and quick decade era preset chips that never clear while typing, and remove Tags and Studios filter sections completely.
- Reduce excess top spacing on the Search page, hide the SleekFin user settings option in the profile dropdown and Settings menu, and ensure pointer cursor on all navigation header buttons.
- Prevent Live TV header clicks from opening the side drawer and unify all Live TV subpages (On Now, Guide EPG, Channels, Recordings, Schedule, Series) with a non-sticky dark-glass tab bar and modern dark EPG styling.
- Streamline video playback OSD across desktop and mobile: move Audio and Favorites into the playback Settings dropdown, hide chapter markers and chapter/track/±skip buttons, and add YouTube-style ArrowLeft/ArrowRight ±30s keyboard seeking with animated overlay on desktop/laptop.

Request Hub (0.5.9):
- Add smooth fade-in and scale entrance animations to the Discover request modal overlay and dialog (with prefers-reduced-motion support).
