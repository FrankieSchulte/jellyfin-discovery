Jellyfin Discovery 0.7.4 and the independently installable Jellyfin Request Hub:

Discovery (0.7.4):
- Fixed Header Bar Ordering & SleekFin UI Builder Integration: read `[data-sleekfin-header-source-label]` cleanly so `Movies` and `Shows` (`jellyfin:view:*`) always land in exact default order **Home, Movies, Shows, Oscars, Discover, Collections, Live TV** (shrinking right-to-left on narrower windows). Also registers `#fazfort-oscars-tab` natively in Jellyfin's visible modern header stack (`source:v1:440bcf1663dbfc236b411c747194f7b1`) so **Oscars** appears as a crisp draggable item with its gold trophy icon inside SleekFin's Header Bar UI Builder — and respects any custom order you drag in SleekFin's UI Builder.
- Centered Non-Scrollable Oscars Categories: Oscars categories whose nominees fit without scrolling (such as 5-nominee categories on widescreen displays) now center both their heading and nominee cards automatically and hide their `< >` scroll arrows; narrowing the window dynamically restores left-aligned scrolling and arrows.

Request Hub (0.7.4):
- Fixed SleekFin UI Builder Discovery for **Discover**: now injects `#requesthub-discover-tab` into the visible modern header stack (`header.MuiAppBar-root .MuiToolbar-root .MuiStack-root`) instead of the hidden legacy `.skinHeader`, turning the red `source:v1:96dd680085f8e0120c78fac6efbf540c` entry in SleekFin's UI Builder into a clean draggable **Discover** pill with its compass icon.
