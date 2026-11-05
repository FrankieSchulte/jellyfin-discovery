# Rule reference

Each page has its own `rules`, `anchors`, and `families`. A rule is eligible only when its media type also matches the page. Home can mix movies and series; Movies contains movies; Shows contains series, with episodes allowed only in Continue Watching.

```json
{
  "Key": "miyazaki",
  "Title": "Directed by Hayao Miyazaki",
  "Enabled": true,
  "Types": ["Movie"],
  "DirectorsAny": ["Hayao Miyazaki"]
}
```

The `director` family already creates a Miyazaki shelf when enough matching credits exist, so an explicit rule is optional. Remove that generated family if you want only named director rules; avoid adding the same category twice.

| Field | Meaning |
| --- | --- |
| Key | Unique 1–60 letters, digits or hyphens within this page |
| Title | Display title, 1–120 characters |
| Enabled | Optional; defaults to true |
| Types | `Movie`, `Series`, or both |
| GenresAny / TagsAny | Any exact match, ignoring case and leading/trailing whitespace |
| DirectorsAny / ActorsAny | Matching credited people; their credit type must match |
| StudiosAny | Matching studio metadata |
| MinRating | Community score from 0–10; missing ratings don't pass |
| MaxMinutes | Exclusive runtime ceiling; 120 means under two hours; unknown runtimes don't pass |
| Years | Inclusive pair, for example `[1990,1999]` |
| Months | Active calendar months, 1–12; absent/empty means all year |

Filters combine with AND across fields, OR within each array. GenresAny Horror and TagsAny halloween means a title must match both. Seasonality follows `timeZone` (America/Los_Angeles by default). A title does not need genre Horror to join a Halloween tag-only shelf.

The supplied Halloween rule runs in October and Christmas in December. Add `halloween` and `christmas` tags to the movies you actually want included. Enabling a rule does not automatically add tags to items.

## Accurate list names

- **IMDb Top 250** uses only the explicit `imdb-top-250` Jellyfin tag. Populate it from a list you maintain, or use a separate list-sync integration. No IMDb scraping or automatic list sync is included, and a high community rating is not proof of membership. The shelf is membership-based, not sorted by IMDb rank.
- **Award Winners** uses `award-winner`. Jellyfin's general ratings do not prove an award win. You can use more specific tags/rules for Oscars, Emmys, etc.
- **Highly Rated from the 1990s** requires production years in that decade and a community rating at least 7. It is not labeled an authoritative "best of" ranking.
- **Worth Another Watch** requires the current user's actual Played flag. It does not claim "Most rewatched" without play-count ranking.
- "Family Guy Funny Moments" is your existing custom title for the Movie + Comedy rule. It still means all matching comedy movies, not clips from Family Guy. Change its Types/filters or name if that is not intended.

## Feed controls

`cardsPerShelf`: 3–24; `batchSize`: 1–8; `minimumItems`: 1–12 and no greater than card count; `maxLiveRows`: 12–60; `endless`: true/false; `hideWatched`: true/false. A rewatch family intentionally uses watched items even when hideWatched is enabled for discovery rules. Disable the rewatch family to omit it.

Generated families: `genre`, `director`, `actor`, `decade`, `studio`, `rating`, `rewatch`, and optional `runtime`. `theme` denotes the explicit rules; enable/disable individual rules with their Enabled field. Up to 60 eligible groups are considered per generated grouping family. Actors use the first eight cast credits on each item.

Anchors: `ContinueWatchingNextUp`, `RecentlyAddedMovies`, `RecentlyAddedShows`, `DiscoverMovies`, `DiscoverTV`, `MyJellyseerrRequests`, `MyMedia`. Reorder these in each page profile; the feed inserts a theme after each available anchor, then diversifies the remaining generated feed. If no fresh theme is eligible, it uses another eligible family. Empty anchors disappear. Director/actor/decade entries are generated individually and are spaced by the planner, not appended as whole blocks.

Seasons, scores, runtimes, tags and credits must actually be present in Jellyfin metadata. Unknown data never earns a badge, rating threshold or tag-filtered shelf. The customization editor validates structure, but it cannot infer missing metadata.

## Interactive filters and recommendations (0.3.0)

Filters apply to the current Home/Movies/Shows library scope. Title/person search, exact genre/tag, watched state, movie runtime, minimum community rating, decade and type combine with AND. Unknown ratings/runtime/year do not satisfy numeric restrictions. Results are finite and load in card batches; clearing filters returns to the mixed feed. Native Full library has its own independent controls.

More like this uses shared tags (rarer tags weigh more), genres, directors and cast. A high rating alone is not enough for a match. Source titles are excluded, and recommendations contain real matching reasons. These are metadata-based similarities, not claims of behavioral personalization. Filters are applied to the candidate pool before ranking.

Recent badges now use the companion's persisted observation ledger. DateCreated is no longer used to infer badges. Existing baseline titles do not get new arrival times; future arrivals are tracked when playable. See README for New Season rules and offline/first-install limits.
