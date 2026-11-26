Jellyfin Discovery 0.7.1 and the independently installable Jellyfin Request Hub:

Discovery (0.7.1):
- Instant Oscars toggle save & accurate live status: checking or unchecking **Enable Oscars Page** in `Dashboard -> Plugins -> Jellyfin Discovery` now persists immediately to the server and updates the top navigation bar without requiring a separate Save click, while edits to dates, title, or categories clearly show an `Unsaved changes` badge until saved.
- SleekFin header bar parity & POST compatibility: added `POST` routes alongside `PUT`/`DELETE` for Oscars settings & asset resets, aligned `[data-sleekfin-header-source-icon="true"]` and overflow-hidden detection with Request Hub's Discover tab, ensured `Home` does not remain highlighted on `#/home?fxOscars=1`, and ensured newly mounted SleekFin headers pick up the Oscars tab immediately when returning from Dashboard.

Request Hub (0.7.1):
- Version parity release with Jellyfin Discovery 0.7.1.
