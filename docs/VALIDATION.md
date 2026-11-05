# Validation for 0.3.2 preview

Target: Jellyfin 12.4 / HSS 3.0.4, SleekFin and the legacy Jellyfin Web pages. Mobile web wrappers and TV browser shells are intended targets; independent native client interfaces and Modern React mounts are not supported.

Completed locally for 0.3.2: **47 JavaScript/DOM/installer tests, 25 native ledger/config/HTML checks, 36 merged shelf-engine checks and 4 catalog packaging tests passed.** The native build completed with zero warnings/errors. Installer duplicate-assembly guards were exercised with command fixtures.

- Browser build downleveled to Chrome 69/Safari 13 syntax, with source/bundle syntax checks.
- Node tests for matching, filtering, scopes, arrival-badge truthfulness, explained recommendations, 200-row feed diversity, finite results, hydration, pagination and profile request versioning.
- DOM/API fixture tests for default/theme alternation, mobile dialog fallback, Samsung Back, TV card navigation and text-input handling, exact feed/scroll restoration, zero results, native-view toggles, failed requests, stale sessions, badge cleanup and bounded live rows.
- Native plugin built against Jellyfin.Controller/Model 12.4.0 and .NET 10 with warnings treated as errors.
- Native ledger/config checks cover baseline suppression, virtual/unplayable items, repeated events, empty series, first playable seasons, later episodes, specials, persistence roundtrip, and invalid configuration.
- Install/deploy/uninstall scripts syntax-checked. Installer health-check and recovery branches exercised against local command fixtures, not a live service. The unprivileged harness substitutes its root guard and mocks package/service/ownership commands in temporary directories.

Not completed:

- Installation into the user's Jellyfin, authenticated HTTP tests against its real library permissions, real item-added events, or live cross-device settings synchronization.
- Real browser visual/performance tests. Chromium launch in this workspace is blocked by process socket permissions.
- Actual Samsung/Android TV remotes, TV media-key integration, codec playback, or official mobile-app playback.

Live acceptance sequence:

1. Install companion, refresh matching script and verify diagnostics show trackingReady/preferencesSync true after baseline.
2. Verify old titles get no inferred arrival badges. Add a playable movie; refresh after reconciliation and check Recently Added.
3. Add the first playable episode of a new Season 2+; verify New Season. Add another episode in the same season and verify the timestamp does not reset.
4. Open More like this via card ellipsis, long Select and Info. Check reasons and media/library filters, then close with Back.
5. Apply combined filters, including a zero-result combination. Clear filters and verify curated shelves return. Toggle Full library and verify native controls.
6. Open a title and return. Check focus, vertical page position and horizontal shelf position. Try with several batches loaded.
7. Edit rules on one device and open/restart the feed on another. Verify the same user's changes arrive; verify another user's rules/library remain separate. Check stale-save conflict handling.
8. On phone, test portrait/landscape, keyboard, safe areas, dialogs, playback and returning from the native player.
9. On Android TV and Samsung browser/shell, choose Controls: tv, test arrows/hold Select/Back and playback. Confirm player keys are not captured by the feed.
10. Disable the script and, if needed, uninstall the companion. Confirm the original UI and previous plugins work.

Use window.FazFortDiscovery.diagnostics() for a shareable status summary. Do not share the ledger or complete server backups: they contain user preferences and item identifiers.

## 0.3.1 consolidation acceptance

The native plugin now embeds the HSS engine and configuration page. Stable section IDs and existing Discovery storage/routes are retained. Test the explicit migration in [MIGRATION.md](MIGRATION.md), especially restoring old rules, HSS ordering, artwork, startup with HSS absent, and rollback. No live migration has been performed here.

## Catalog and browser delivery

New checks exercise flat ZIP layout, exact manifest checksum/download URLs, version mismatch and missing-asset rejection, deterministic ZIP bytes, idempotent HTML injection, disabling injection, version replacement and relative asset paths. Live GitHub publication, catalog download/install, File Transformation reflection registration, proxied HTTP asset serving and native-device behavior still require acceptance testing. No release or live install has been performed by the local checks.
