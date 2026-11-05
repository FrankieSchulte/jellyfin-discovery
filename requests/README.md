# Jellyfin Request Hub

A separate server plugin and web interface for browsing and requesting Jellyseerr titles inside Jellyfin Web. It can be installed, configured and removed independently of Jellyfin Discovery. Both plugins are distributed by the same catalog/release workflow.

## Features

- A Discover navigation link in supported SleekFin/legacy header containers; a user-settings link is a fallback when no header container is found.
- Trending, Popular Movies, Popular Series, search, Movie Genres and curated studio shortcuts.
- Optional integration: Discovery external title cards open the in-app Request Hub details when this plugin is loaded, retaining external Jellyseerr links when it is absent.
- Title details, availability/request status, explicit TV season selection and a confirmation button before a request is submitted.
- Paginated horizontal rows, lazy artwork and a 200-title limit per row. Refine search for larger result sets.

Studio shortcuts are a curated selection, not an automatic reproduction of every personalized Jellyseerr homepage section. This release does not embed an iframe or sign users into Jellyseerr in the browser. Browse all resets search/genre/studio navigation. Native clients with independent interfaces do not load this web screen.

## Install and configure

1. Publish the coordinated release using **Release plugin catalog**. Add the catalog as described in the main README. Its manifest contains two independent plugin entries.
2. Install **Jellyfin Request Hub** from Jellyfin's catalog and restart. File Transformation must already be installed for automatic browser delivery.
3. As an administrator, open Dashboard → Plugins → **Request Hub**.
4. Enter the internal **root URL** of your Jellyseerr server, such as `http://jellyseerr:5055`, and its API key. A reverse-proxy base path is supported. Do not append `/api/v1`; the plugin does that.
5. Add a mapping for each authorized user: the Jellyfin user GUID and that user's Jellyseerr numeric user ID. Jellyfin's Dashboard → Users → selected user URL contains the GUID. Jellyseerr's Settings → Users → selected user's profile URL contains its numeric ID. Verify both IDs before saving.
6. Check **Allow requests** only for users who should submit requests through this UI. Enable the connection and save. Existing Jellyseerr accounts, permissions and quotas are still required. Map ordinary users to their own ordinary accounts, never to the administrator.
7. Refresh Jellyfin Web and open **Discover**. Direct entry is `/web/#/home?requesthub=discover`, preserving any configured Jellyfin base path.

No default administrator mapping is created. Unmapped users receive an access/configuration error. A Jellyfin administrator does not automatically receive Jellyseerr access through this plugin.

The API key is stored in Jellyfin's plugin configuration and is entered/retrieved only through its administrator configuration API. Regular clients call authenticated Jellyfin endpoints and never receive the key or an unrestricted proxy. Protect configuration backups as secrets.

## Permissions and behavior

Every upstream call includes `X-API-Key` and an explicit `X-API-User` from the authenticated Jellyfin user's configured mapping. The client cannot supply a target user ID. Jellyseerr enforces that mapped account's request permissions, quota and approval/auto-approval rules. A successful submission does not mean the title was approved or downloaded.

The proxy exposes only fixed browse/detail/request operations, bounded pages and encoded search queries. It rejects arbitrary URLs/paths, disables HTTP redirects/cookies and sanitizes responses/errors. Movie requests and explicit season arrays are projected onto a minimal payload. Writes are capped at ten per minute per mapped Jellyfin user; upstream duplicate checks still apply. No approval, deletion, user-administration or download-management endpoints are exposed.

Available titles show availability status; this initial plugin does not yet resolve them to a local Jellyfin Play button. Requests use the standard, non-4K Jellyseerr workflow. Existing per-user settings in Jellyseerr remain authoritative.

## Validation and live acceptance

The native project builds against Jellyfin 12.4/.NET 10. Local checks cover mapping fail-closed behavior, safe URL/path handling, query escaping, request validation, response projection, the exact upstream identity headers, rate limits and idempotent asset injection. DOM/API fixtures cover browsing, escaped titles, season confirmation, denied accounts, sign-out and restoring native Home.

Still required on the live server:

- Verify navigation link placement and discovery asset loading with your actual SleekFin build and reverse proxy.
- Test one ordinary mapped account and one unmapped account. Confirm no upstream requests run as administrator by default.
- Submit a movie and one selected TV season, then inspect Jellyseerr to verify owner, pending/approved status and quota behavior.
- Check an already requested/available title, an offline backend, search pagination, dialogs, browser Back and physical remotes.
- Disable/remove Request Hub and confirm Discovery/Home remains usable. Do not enable duplicate injected scripts.

The plugin was compiled and tested with fixtures here; it has not been connected to a live Jellyseerr instance by those checks. The contract was checked against the upstream Jellyseerr authentication middleware and request/discover routes. Seerr forks/new versions need their own acceptance checks.
