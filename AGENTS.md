# Working on Jellyfin Discovery

This repository contains the browser feed and a server plugin with optional HSS shelves. Read README.md and docs/VALIDATION.md before changing integration behavior.

- Primary target: Jellyfin Web legacy 12.4 with HSS 3.0.4 and SleekFin. Do not assume that a passing DOM fixture validates the live Jellyfin UI or the React Modern layout.
- Edit src and config, then rebuild dist/fazfort-discovery.js. The one-file bundle is tracked for copy/paste installation.
- Run npm run build, npm run check and npm test. Add focused tests for changes affecting permissions, ordering, badges, pagination or SPA lifecycle.
- Preserve fail-open behavior: never hide native content until usable discovery rows exist. Restore it on stop, navigation and initial failure.
- Scope requests/cache/preferences to the current user, server and selected library. Do not use admin plugin configuration APIs to retrieve integration keys. Never include credentials, server backups or private inventories in commits or diagnostics.
- Guard stale async results, duplicate mounts and listeners. Keep DOM/image work bounded during continuous scrolling.
- Use textContent for titles and names. Permit only HTTP(S) external URLs. Keep CSS under fx-prefixed classes or explicitly owned attributes.
- Badges are UI-only. DateCreated is not guaranteed to be historical ingestion time; new episodes cannot imply a new season.
- IMDb, awards and other authoritative category names require explicit metadata/list membership. Do not fabricate ranking or personalization claims.
- Do not modify archived legacy source or deploy scripts unless the task needs it. Changes there require the pinned .NET build/tests and a separate deployment/rollback review.
- No automatic deployment, push or release is implied by code changes. Report exactly which local checks ran and which live checks remain.
