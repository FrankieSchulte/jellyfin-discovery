Jellyfin Discovery 0.5.6 and the independently installable Jellyfin Request Hub:

Discovery (0.5.6):
- Eliminate initial Home, Movies, and Shows category flash/swap by validating boot caches against the active plugin version and local calendar day (`dayInZone`), painting valid boot rows synchronously at `t=0ms` for all users, keeping session-stable daily shuffle seeds until explicit `Restart feed`, adding proactive CSS hiding for `#moviesPage` / `#tvshowsPage` native tabs, and updating `state.native` in place without tearing down `.fx-discovery` when `.pageTabContent` mounts asynchronously.
- Fix `Recently Added in Movies` & `Recently Added in Shows` race condition so already-mounted slots and boot caches automatically refresh in place as soon as `FazFortDiscovery/Tracking` resolves.
- Extend `Christmas Movies` across both November and December (`Months: [11, 12]`, including `christmas`, `christmas eve`, `christmas party`, `christmas tree`, `santa claus`, and `saving christmas` tags) and prioritize active seasonal shelves at the top of the theme queue (`Row 2` right below `Continue Watching / Next Up` on Home and Movies).
- Add clickable category headings (`h2.fx-clickable-heading`) across Home, Movies, Shows, and Genres that open a dedicated Category Subpage (`?fxCat=...`) displaying every matching title in a responsive poster grid with `←` back navigation, browser history, and TV `Escape`/`Back` support.
- Upgrade `#searchPage` (`@jellyfin/sdk` `getItemsApi` module `71857` & `useSearchItems` module `42111`) to deduplicate items across libraries, strip `Leaving Soon` entries, and match library items by `Tags`, `Genres`, and category themes (e.g., searching `"Christmas"` surfaces all Christmas-tagged movies).
- Restore smooth vertical scrolling on expanded Library Filters dropdowns (`.MuiPopover-root .MuiPaper-root` & `.MuiAccordionDetails-root`), unify Filter popover accordions/checkboxes and `.fx-filters` with the dark frosted-glass dropdown UI, and guard against blurry micro-logos (`< 180×30`).

Request Hub (0.5.6):
- Version parity bump (`0.5.6.0`) with Discovery `0.5.6` and seamless deep-link handoff from `Discover Movies` / `Discover TV Shows` category headings.
