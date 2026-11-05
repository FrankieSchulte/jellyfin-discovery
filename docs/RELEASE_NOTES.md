Jellyfin Discovery 0.4.0 and the independently installable Jellyfin Request Hub:

Discovery:
- Movies and TV Shows default to Suggestions, with a page heading and Suggestions / Library / Genres selector. Library preserves native filters, sorting and grid/list controls while hiding Play All/Shuffle. Genres uses the same shelf renderer as Home, without extra rating/year/type lines.
- Add metadata-based TV category defaults and an Add supplied categories action for existing saved profiles. Custom categories are not overwritten.
- Move Home controls into Profile → Settings → Discovery settings; remove the visible Home Browse options bar. Control mode, native/Discovery Home and category customization remain available there.
- Wrap horizontal category navigation through arrows, keyboard edges and edge gestures. This wraps each row's loaded selection, not an unlimited external catalogue. No duplicate card DOM is created.
- Hide category scrollbars, tighten spacing and bold titles.
- Group Continue Watching/Next Up episodes into one card per series, preferring the most recently resumed episode and linking to that episode's details. Clicking does not silently autoplay or change watched state.

Request Hub:
- A second catalog entry/DLL with its own plugin ID and administrator settings.
- Browse Trending, popular movies/series, genres, curated studio shortcuts and search inside Jellyfin Web.
- Show title details, choose TV seasons and explicitly confirm a request.
- Authenticate every call with an explicit Jellyfin→Jellyseerr user mapping. Keep API keys server-side for regular clients; retain Jellyseerr permissions, quotas and approvals.

Both target Jellyfin 12.4 legacy Web and need File Transformation for browser delivery. Request Hub is optional and does not make independent native apps display custom web screens. Live proxy, theme, request ownership and physical-device checks remain required; see docs/VALIDATION.md and requests/README.md.
