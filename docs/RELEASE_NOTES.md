Jellyfin Discovery 0.6.1 and the independently installable Jellyfin Request Hub:

Discovery (0.6.1):
- Critical hotfix: eliminate browser tab freeze / microtask loop in `fetchRatingsBatch` / `syncHeroAndDetailRatings` when `/FazFortDiscovery/Ratings` requests are in-flight, return `pending: true`, or fail. `fetchRatingsBatch` now returns `null` when nothing is eligible to fetch, enforces per-item cooldowns and retry caps, and coalesces hero/detail rating DOM observer updates via `requestAnimationFrame`.

Request Hub (0.6.1):
- Version parity release alongside Jellyfin Discovery 0.6.1.
