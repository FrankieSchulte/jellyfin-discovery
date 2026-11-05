# Publish and install through Jellyfin

The catalog is a release asset, generated from the actual compiled ZIP. It is not the GitHub project page and it does not exist publicly until the first successful release.

Repository URL to add in Jellyfin after publication:

```text
https://github.com/FrankieSchulte/jellyfin-discovery/releases/latest/download/manifest.json
```

## Publish a release

1. Commit the complete update (including `.github/workflows/release.yml`) and push/merge it onto `main`.
2. Check that **Check discovery** passes.
3. Under **Actions → Release plugin catalog**, choose **Run workflow**, with branch `main`.
4. Wait for success. Under **Releases**, confirm the version has two independent plugin ZIPs, `manifest.json` and `SHA256SUMS`. Open the manifest download URL and check that it returns JSON.

The workflow builds/tests browser and native code, creates a flat plugin ZIP and generates its Jellyfin MD5 catalog checksum plus a SHA-256 checksum file. Only then does it publish the release and create its version tag. Existing releases are never overwritten. The `latest` manifest advertises the current release only.

Alternatively, pushing a `v0.4.0` tag triggers the same workflow; the tag must match `package.json`. Future releases must update browser, assembly and metadata versions together. GitHub Actions needs permission to create releases; the workflow requests `contents: write` for its release job. Organization policy may restrict that permission.

The repository/releases must be publicly downloadable for a Jellyfin server without GitHub credentials. Never put a GitHub token in the catalog URL.

## Install in Jellyfin

1. Save/export existing rules and back up settings. If the standalone shelves plugin is installed, follow [Migration](MIGRATION.md) first.
2. Install **File Transformation** and **Home Screen Sections** through their respective catalogs, if not already installed. Restart Jellyfin. File Transformation provides automatic script delivery; HSS supplies optional HSS shelves and related default sections. Dependencies are documented, not automatically installed by this catalog.
3. Open Dashboard → Plugins → Repositories → **+ New Repository**. Name it **Jellyfin Discovery** and paste the manifest URL above. Save.
4. Open Catalog, refresh if necessary, select **Jellyfin Discovery**, install, then restart Jellyfin.
5. Optionally install Jellyfin Request Hub from the same catalog and follow requests/README.md for per-user mapping. It is a separate plugin.
6. Disable earlier Discovery/Home Feed/interleaving scripts in JavaScript Injector. The installed DLL now carries the browser script; do not run another copy manually.
7. Refresh Jellyfin Web. Dashboard → Plugins → Jellyfin Discovery includes **Automatically load Discovery in Jellyfin Web**, enabled by default. Check server logs for registration if the browser extension does not appear.
8. Restore server-wide HSS rules if migrating. Browser Customize profiles and arrival history retain their original storage paths.

No routine upload to Proxmox is required. Jellyfin downloads the published plugin ZIP itself. Native clients which use their own UI still do not load web-only screens.

## Test after installation

- Confirm installed version matches the release and Jellyfin starts normally.
- With manual Discovery scripts disabled, check that `/web/index.html` loads a single `FazFortDiscovery/Assets/discovery.js?v=...` script and the asset request succeeds. Include any configured server base path in the URL.
- Test Home/Movies/Shows, artwork, filters, More like this, returning from a title and several scrolling batches.
- Check `window.FazFortDiscovery.diagnostics()` for the expected version, `trackingReady` and `preferencesSync` after the baseline scan.
- Existing titles should not earn arrival badges from the baseline. Add playable content to test actual arrivals.
- Test a reverse-proxy base path and private library permissions with a non-admin user before broader rollout.

If File Transformation is unavailable, the server plugin logs a warning and leaves the native UI unchanged. Manual JavaScript Injector installation remains an optional fallback. Disable automatic injection before using that fallback, then restart.

To roll back, uninstall/disable the new plugin in the dashboard, restart and restore the prior build/settings as needed. Do not delete the arrival ledger. Keep exported rules until live checks pass.
