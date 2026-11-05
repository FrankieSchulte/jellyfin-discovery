# Consolidating the standalone shelves extension

Discovery 0.3.1 includes the themed HSS engine previously shipped as FazFort Shelves 1.0.2. The separate shelves assembly is no longer needed after migration. Its source is retained under `legacy/` for reference, not deployment.

This is an explicit migration: configuration from the older plugin is **not automatically imported**. Back up first and keep the old files until the replacement has passed live checks.

## Before installing

1. Export/copy the old plugin's Rules JSON. Record Enabled, TimeZone, DailyShelfCount, CardsPerShelf, MinimumItems and HideWatched. Back up Jellyfin's plugin configurations and HSS settings.
2. Back up the Discovery data directory (`fazfort-discovery` under Jellyfin's data directory), if present. Existing arrival history and per-user profiles remain in the same location.
3. Stop Jellyfin. Move the entire directory containing `FazFort.Shelves.dll` **outside** Jellyfin's plugins directory. Renaming a directory inside plugins does not reliably disable loading.
4. If upgrading the companion from 0.3.0, also move its old plugin directory outside plugins. The installer refuses duplicate Discovery assemblies rather than guessing which build to remove. Keep these directories as rollback copies.
5. Install the new server package. If Jellyfin was stopped before installation, start it manually afterward. Replace the browser script with the matching bundle.

The installer refuses an active standalone shelves assembly. Runtime registration also skips Discovery's HSS shelves if that assembly is loaded, preventing duplicate registration while leaving arrival tracking and preferences independent.

## Restore shelf settings

1. Open Dashboard → Plugins → Jellyfin Discovery.
2. Paste the exported Rules JSON and restore the recorded values, including your timezone. New installations default to UTC.
3. Save and restart Jellyfin so all configured titles/keys register with HSS.
4. Review HSS → Section Settings. The old key-to-section-ID algorithm is preserved, so existing rows/order can carry over when their keys are unchanged. Add missing rows if necessary. Do not reset HSS settings.
5. Verify a Preview and Home with the current user. Check artwork, seasonal months and watched-title preferences.

Browser **Customize** profiles are separate from server-wide HSS rules. Existing synchronized profiles, API routes, plugin ID and ledger path are retained. Native HSS shelves remain optional when using the browser planner.

## Rollback

Stop Jellyfin. Move the new Discovery directory outside plugins, restore the earlier Discovery and standalone shelves directories, then start Jellyfin. Restore the matching older browser script. Do not restore overlapping versions of either assembly. Preserve data/configuration backups; do not delete the arrival ledger.

The local test suite validates matching, seasonal scheduling, stable IDs and installer guards. Real HSS registration, upgrade/rollback and permissions must still be verified on a test server before relying on this release in production.
