Jellyfin Discovery 0.6.0 and the independently installable Jellyfin Request Hub:

Discovery (0.6.0):
- Netflix-style horizontal edge gradients on category rows (mask-based so textured backgrounds blend seamlessly with zero solid-black strips).
- One-way anchored endless horizontal scroll: every category starts cleanly at Item #1 with backward scrolling locked at start, dynamically loops endlessly rightward, and walks smoothly back to Item #1 on leftward scroll.
- Bring back Recently Added badges for TV Shows when new episodes/seasons arrive (7-day window), strictly prioritizing New Episodes (30-day premiere window) whenever a newly added episode also premiered recently.
- Netflix-style Hero Banner Carousel on curated Movies and Shows subpages (hidden on Library, Favorites, Genres, and category subpages), floating the Movies/TV Shows title dropdown cleanly over the hero with the first category starting right underneath matching Home.
- Subtle noisy textured charcoal-gray ambient background across all pages (GPU-composited radial glow mesh + static SVG film-grain tile) with a collapsible bottom-corner live Background Tuner widget (colors, concentration, distribution, noise, and optional GPU drift animation speed/intensity + copyable config JSON).
- Luminous diagonal GPU-composited loading shimmer on unloaded cards, skeletons, and native Jellyfin artwork.
- Origin-morphing modal animations emerging smoothly from the clicked trigger button (Movie/Show Info modal, Track dialogs, Customize, More Like This).
- Rotten Tomatoes rating system (Tomatometer + Popcornmeter) backed by a cached `/FazFortDiscovery/Ratings` endpoint (Wikidata IMDb-to-RT batch resolution + RT scorecard parser + disk cache + Jellyfin CriticRating fallback), crisp Certified Fresh / Fresh / Rotten / Verified Hot / Upright Popcorn / Spilled Popcorn / Star SVGs, Tomatometer everywhere stars appear, Popcornmeter exclusively on Movie/Show detail pages, and full plugin settings toggles (Tomatometer, Popcornmeter, Stars, any combination, or None).
- Smart-positioned Movie/Show detail page three-dots menu (below -> above -> vertically centered left/right side) with directional origin-morph animations springing directly from the three dots.
- Anchor SyncPlay ("Create a new group") and Cast to Device pop-ups directly below their header buttons on both playback and browsing pages.
- Playback OSD visual identity alignment (frosted dark-glass circular Back button, crisp circular hover rings, expanding accent scrub bar with glowing thumb & dark-glass timestamp bubble, matching volume slider).
- Fix empty Playback Info (.playerStats) when opened while paused by triggering an immediate synthetic timeupdate render poke on the active video element.
- Playback volume overhaul: hide the top-of-screen volume toast (.volumeOsd), disable scroll-wheel volume adjustments during playback, and implement true Mute-to-0 / Unmute-to-saved-volume memory plus drag-scrubber-to-unmute.

Request Hub (0.6.0):
- Upgrade loading shimmer to matching GPU-composited diagonal luminous wave and origin-morph title request modals from the clicked poster card.
