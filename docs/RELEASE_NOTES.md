Jellyfin Discovery 0.7.3 and the independently installable Jellyfin Request Hub:

Discovery (0.7.3):
- Deterministic Priority-Ordered Header Overflow (Zero Jitter): replaced the oscillating mobile/desktop header nav add/remove toggle with a single-pass deterministic overflow manager (`syncHeaderNavPriority`) and glass dropdown menu (`.fx-header-overflow-menu`) that eliminates narrow-window jitter and page jumping while overflowing nav tabs in exact priority order: **Live TV → Collections → Discover → Oscars → Shows → Movies → Home**.
- Oscars Header Pill Polish: tightly cropped the Oscar statuette nav SVG (`viewBox="6.5 1.8 11 21.2"`) for optical centering alongside the `Oscars` label, and flattened the active Oscars pill to a clean solid flat gold highlight matching SleekFin's flat light-gray selection highlight.
- Oscars Page Polish: removed the top gap above the Oscars hero banner by hiding the MUI AppBar spacer (`header.MuiAppBar-root + div[aria-hidden="true"]`), removed clickable category subcategory pages on Oscars, increased category headings to Jellyfin's standard `24px / 32px` size (`18.5px` on mobile), and increased `.fx-oscars-track` top padding to `12px` so hovered posters never clip at the top edge.

Request Hub (0.7.3):
- Respects `data-fx-header-managed="true"` so the `Discover` tab cooperates seamlessly with priority-ordered header overflow on narrow viewports.
