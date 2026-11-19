Jellyfin Discovery 0.5.8 and the independently installable Jellyfin Request Hub:

Discovery (0.5.8):
- Eliminate search page and page-to-page navigation freezes: debounce search input, cache normalized item search metadata, progressively batch large result grids, coalesce popover MutationObserver work, halve loop carousel clones, and replace global html:has() selectors with lightweight root attributes.
- Fix duplicate search button at half-screen desktop widths by only injecting the mobile search shortcut when SleekFin's native search button is actually overflowed.
- Unify every dropdown (Profile, Movies/Shows/Collections, Filters, Sort, Three-Dots, Downloads) to a single crisp glassy dark rectangle by stripping outer .sleekfin-menu-host box borders, eliminating right-edge clipping on Filters, and placing rotating right-side chevrons on expandable filter rows.
- Align category subpage top spacing with other pages, move the back arrow to the fixed top-left header position matching detail pages, fix back-navigation from a movie/show so parent carousels never leak underneath and category titles/items always resolve, and hide the Load more button in favor of a bottom-of-page message.
- Overhaul TV badges: rename New Season to New Episodes, show New Episodes strictly when a downloaded playable episode premiered within the past 30 days, and reserve Recently Added strictly for Movies.

Request Hub (0.5.8):
- Keep the Discover tab visible in the top header bar at half-screen desktop widths (only collapsing into the overflow drawer on narrow/touch viewports or when overflow is active) and skip popover mutations in the observer.
