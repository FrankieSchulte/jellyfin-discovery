Jellyfin Discovery 0.4.9 and the independently installable Jellyfin Request Hub:

Discovery (0.4.9):
- Fix `Movies -> Library`, `Movies -> Favorites`, `Shows -> Library`, and `Shows -> Favorites` top vertical spacing, row-to-row vertical gap (`20px` grid gap without SleekFin's `32px` `.cardBox-bottompadded` override), and right-edge gutter alignment (`calc(var(--sleekfin-page-gutter) + 12px)` via both `padding-right` and `padding-inline-end`) so all four subpages match `Collections -> Collections` and `Collections -> Favorites` pixel-for-pixel.
- Disable endless-loop edge wrapping on horizontal scroll tracks that end with a `"See More"` card (`Discover Movies` and `Discover TV Shows`) across arrow buttons, trackpad/wheel, touch swipe, and TV remote navigation.
- Unify `"See More"` portrait cards on `Discover Movies` and `Discover TV Shows` with the Discover page (`"See More"` primary label, `"Popular Movies"` / `"Popular Series"` subtitle inside the box, `"All Popular Movies"` / `"All Popular Series"` bottom caption, red-and-dark gradient card background, and solid `#e50914` red circular arrow).
- Restore Jellyfin's dedicated search page (`#/search`) when clicking the header search button so the search icon never disappears from the header and results never close on misclick, while styling `#searchPage` to match the SleekFin & Discovery visual identity.
- Fix the Sign-In page (`#loginPage`) user selection grid (`#divUsers`) so user avatar cards are never squished into a narrow box and user names are displayed in full without truncation.

Request Hub (0.4.9):
- Support direct `rhView=movies` (`Popular Movies`) and `rhView=tv` (`Popular Series`) deep links from `Discover Movies` and `Discover TV Shows` `"See More"` cards.
- Register `id="requesthub-discover-tab"` natively with SleekFin's Header Proxy and Header Bar UI editor (`Drag your favorite things into the header bar`) and eliminate window-resize header rebuild jank.
