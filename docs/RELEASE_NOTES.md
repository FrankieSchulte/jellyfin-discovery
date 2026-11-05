Jellyfin Discovery now includes its browser bundle and themed HSS shelves in one server plugin.

- Install/update through a Jellyfin catalog after adding the release manifest URL.
- File Transformation injects the matching, versioned browser bundle automatically. Disable older Discovery scripts in JavaScript Injector.
- Existing Discovery plugin ID, preferences and arrival history are retained.
- Standalone Shelves users must export their rules and disable/remove the old Shelves plugin before using the consolidated HSS integration. See docs/MIGRATION.md.
- Target: Jellyfin 12.4, legacy Web layout. HSS 3.0.4 is needed for HSS-derived rows; File Transformation is needed for automatic web delivery. Install these separately.
- Independent native apps do not inherit custom web screens.

Local automated checks do not replace live migration, proxy/base-path, browser and device testing.
