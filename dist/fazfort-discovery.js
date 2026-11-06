/* FazFort Discovery 0.4.1 — paste this entire file into one non-module JS Injector script. */
(() => {
  (() => {
    "use strict";
    if (!Element.prototype.replaceChildren) Element.prototype.replaceChildren = function(...nodes) {
      while (this.firstChild) this.removeChild(this.firstChild);
      this.append(...nodes);
    };
    const DEFAULT_CONFIG = {
      "schemaVersion": 1,
      "timeZone": "America/Los_Angeles",
      "cardsPerShelf": 8,
      "batchSize": 4,
      "minimumItems": 3,
      "maxLiveRows": 24,
      "endless": true,
      "hideWatched": false,
      "pages": {
        "home": {
          "anchors": [
            "ContinueWatchingNextUp",
            "RecentlyAddedMovies",
            "DiscoverMovies",
            "MyJellyseerrRequests",
            "DiscoverTV",
            "MyMedia"
          ],
          "families": [
            "theme",
            "genre",
            "director",
            "actor",
            "decade",
            "studio",
            "rating",
            "rewatch"
          ],
          "rules": [
            {
              "Key": "popcorn",
              "Title": "Perfect Popcorn Movies",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "GenresAny": [
                "Action",
                "Adventure"
              ]
            },
            {
              "Key": "laugh",
              "Title": "Family Guy Funny Moments",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "GenresAny": [
                "Comedy"
              ]
            },
            {
              "Key": "incredible",
              "Title": "Iancredible Movies",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "MinRating": 8
            },
            {
              "Key": "short",
              "Title": "Movie Night Under Two Hours",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "MaxMinutes": 120
            },
            {
              "Key": "scifi",
              "Title": "Sci-Fi & Fantasy Movies",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "GenresAny": [
                "Science Fiction",
                "Fantasy"
              ]
            },
            {
              "Key": "horror",
              "Title": "Something Spooky",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "GenresAny": [
                "Horror",
                "Thriller"
              ]
            },
            {
              "Key": "anime",
              "Title": "Weeb Slop",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "anime"
              ]
            },
            {
              "Key": "games",
              "Title": "Gamer Movies",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "based on video game"
              ]
            },
            {
              "Key": "time",
              "Title": "Time Travel Slop",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "time travel"
              ]
            },
            {
              "Key": "comfort",
              "Title": "Comfort Watches",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "comforting",
                "lighthearted"
              ]
            },
            {
              "Key": "halloween",
              "Title": "Halloween Movies",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "halloween"
              ],
              "Months": [
                10
              ]
            },
            {
              "Key": "christmas",
              "Title": "Christmas Movies",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "christmas"
              ],
              "Months": [
                12
              ]
            },
            {
              "Key": "page-to-screen",
              "Title": "Novel Adaptations",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "based on novel or book"
              ]
            },
            {
              "Key": "masks-and-capes",
              "Title": "Superheroes",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "superhero"
              ]
            },
            {
              "Key": "movie-magic",
              "Title": "Wizards United",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "magic"
              ]
            },
            {
              "Key": "bleak-futures",
              "Title": "Dystopian Slop",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "dystopia"
              ]
            },
            {
              "Key": "sing-along",
              "Title": "Musical Musicals",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "musical"
              ]
            },
            {
              "Key": "growing-up",
              "Title": "Come of Age and Lock In",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "coming of age"
              ]
            },
            {
              "Key": "among-the-stars",
              "Title": "Stellar Nucleosynthesis Spallation",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "space"
              ]
            },
            {
              "Key": "dark-side-laughs",
              "Title": "Relax Liberal, It's Called Dark Humor",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "dark comedy"
              ]
            },
            {
              "Key": "mind-benders",
              "Title": "Mind F**kers",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "psychological thriller",
                "psychological horror"
              ]
            },
            {
              "Key": "imdb-top-250",
              "Title": "IMDb Top 250",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "imdb-top-250"
              ]
            },
            {
              "Key": "award-winners",
              "Title": "Award Winners",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "award-winner"
              ]
            },
            {
              "Key": "cyberpunk",
              "Title": "Cyberpunk",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "cyberpunk"
              ]
            }
          ]
        },
        "movies": {
          "anchors": [
            "ContinueWatchingNextUp",
            "RecentlyAddedMovies",
            "DiscoverMovies",
            "MyJellyseerrRequests"
          ],
          "families": [
            "theme",
            "genre",
            "director",
            "actor",
            "decade",
            "studio",
            "rating",
            "rewatch"
          ],
          "rules": [
            {
              "Key": "popcorn",
              "Title": "Perfect Popcorn Movies",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "GenresAny": [
                "Action",
                "Adventure"
              ]
            },
            {
              "Key": "laugh",
              "Title": "Family Guy Funny Moments",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "GenresAny": [
                "Comedy"
              ]
            },
            {
              "Key": "incredible",
              "Title": "Iancredible Movies",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "MinRating": 8
            },
            {
              "Key": "short",
              "Title": "Movie Night Under Two Hours",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "MaxMinutes": 120
            },
            {
              "Key": "scifi",
              "Title": "Sci-Fi & Fantasy Movies",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "GenresAny": [
                "Science Fiction",
                "Fantasy"
              ]
            },
            {
              "Key": "horror",
              "Title": "Something Spooky",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "GenresAny": [
                "Horror",
                "Thriller"
              ]
            },
            {
              "Key": "anime",
              "Title": "Weeb Slop",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "anime"
              ]
            },
            {
              "Key": "games",
              "Title": "Gamer Movies",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "based on video game"
              ]
            },
            {
              "Key": "time",
              "Title": "Time Travel Slop",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "time travel"
              ]
            },
            {
              "Key": "comfort",
              "Title": "Comfort Watches",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "comforting",
                "lighthearted"
              ]
            },
            {
              "Key": "halloween",
              "Title": "Halloween Movies",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "halloween"
              ],
              "Months": [
                10
              ]
            },
            {
              "Key": "christmas",
              "Title": "Christmas Movies",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "christmas"
              ],
              "Months": [
                12
              ]
            },
            {
              "Key": "page-to-screen",
              "Title": "Novel Adaptations",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "based on novel or book"
              ]
            },
            {
              "Key": "masks-and-capes",
              "Title": "Superheroes",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "superhero"
              ]
            },
            {
              "Key": "movie-magic",
              "Title": "Wizards United",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "magic"
              ]
            },
            {
              "Key": "bleak-futures",
              "Title": "Dystopian Slop",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "dystopia"
              ]
            },
            {
              "Key": "sing-along",
              "Title": "Musical Musicals",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "musical"
              ]
            },
            {
              "Key": "growing-up",
              "Title": "Come of Age and Lock In",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "coming of age"
              ]
            },
            {
              "Key": "among-the-stars",
              "Title": "Stellar Nucleosynthesis Spallation",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "space"
              ]
            },
            {
              "Key": "dark-side-laughs",
              "Title": "Relax Liberal, It's Called Dark Humor",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "dark comedy"
              ]
            },
            {
              "Key": "mind-benders",
              "Title": "Mind F**kers",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "psychological thriller",
                "psychological horror"
              ]
            },
            {
              "Key": "imdb-top-250",
              "Title": "IMDb Top 250",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "imdb-top-250"
              ]
            },
            {
              "Key": "award-winners",
              "Title": "Award Winners",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "award-winner"
              ]
            },
            {
              "Key": "cyberpunk",
              "Title": "Cyberpunk",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "cyberpunk"
              ]
            }
          ]
        },
        "shows": {
          "anchors": [
            "ContinueWatchingNextUp",
            "RecentlyAddedShows",
            "DiscoverTV",
            "MyJellyseerrRequests"
          ],
          "families": [
            "theme",
            "genre",
            "director",
            "actor",
            "decade",
            "studio",
            "rating",
            "rewatch"
          ],
          "rules": [
            {
              "Key": "anime",
              "Title": "Weeb Slop",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "anime"
              ]
            },
            {
              "Key": "games",
              "Title": "From Controller to Screen",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "based on video game"
              ]
            },
            {
              "Key": "time",
              "Title": "Time Travel Slop",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "time travel"
              ]
            },
            {
              "Key": "comfort",
              "Title": "Comfort Watches",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "comforting",
                "lighthearted"
              ]
            },
            {
              "Key": "page-to-screen",
              "Title": "Novel Adaptations",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "based on novel or book"
              ]
            },
            {
              "Key": "masks-and-capes",
              "Title": "Superheroes",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "superhero"
              ]
            },
            {
              "Key": "movie-magic",
              "Title": "Magic & Myth",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "magic"
              ]
            },
            {
              "Key": "bleak-futures",
              "Title": "Dystopian Slop",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "dystopia"
              ]
            },
            {
              "Key": "sing-along",
              "Title": "Musical Shows",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "musical"
              ]
            },
            {
              "Key": "growing-up",
              "Title": "Come of Age and Lock In",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "coming of age"
              ]
            },
            {
              "Key": "among-the-stars",
              "Title": "Stellar Nucleosynthesis Spallation",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "space"
              ]
            },
            {
              "Key": "dark-side-laughs",
              "Title": "Relax Liberal, It's Called Dark Humor",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "dark comedy"
              ]
            },
            {
              "Key": "mind-benders",
              "Title": "Mind F**kers",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "psychological thriller",
                "psychological horror"
              ]
            },
            {
              "Key": "award-winners",
              "Title": "Award Winners",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "award-winner"
              ]
            },
            {
              "Key": "cyberpunk",
              "Title": "Cyberpunk",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "cyberpunk"
              ]
            },
            {
              "Key": "drama",
              "Title": "TV Dramas",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "GenresAny": [
                "Drama"
              ]
            },
            {
              "Key": "great-tv",
              "Title": "Highly Rated Shows",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "MinRating": 8
            },
            {
              "Key": "funny-tv",
              "Title": "Need a Good Laugh?",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "GenresAny": [
                "Comedy"
              ]
            },
            {
              "Key": "scifi-tv",
              "Title": "Sci-Fi & Fantasy Shows",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "GenresAny": [
                "Sci-Fi & Fantasy",
                "Science Fiction",
                "Fantasy"
              ]
            },
            {
              "Key": "crime-tv",
              "Title": "Crime & Mystery",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "GenresAny": [
                "Crime",
                "Mystery"
              ]
            },
            {
              "Key": "animated-tv",
              "Title": "Animated Worlds",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "GenresAny": [
                "Animation"
              ]
            },
            {
              "Key": "horror-tv",
              "Title": "Something Spooky",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "GenresAny": [
                "Horror",
                "Thriller"
              ]
            },
            {
              "Key": "tv-drama",
              "Title": "Drama Worth Your Time",
              "Types": [
                "Series"
              ],
              "GenresAny": [
                "Drama"
              ],
              "Enabled": true
            },
            {
              "Key": "tv-comedy",
              "Title": "Familiar TV Favorites",
              "Types": [
                "Series"
              ],
              "GenresAny": [
                "Comedy"
              ],
              "Enabled": true
            },
            {
              "Key": "tv-anime",
              "Title": "Animated Worlds",
              "Types": [
                "Series"
              ],
              "GenresAny": [
                "Animation",
                "Anime"
              ],
              "Enabled": true
            },
            {
              "Key": "tv-scifi",
              "Title": "Strange Worlds",
              "Types": [
                "Series"
              ],
              "GenresAny": [
                "Sci-Fi & Fantasy",
                "Science Fiction",
                "Fantasy"
              ],
              "Enabled": true
            },
            {
              "Key": "tv-crime",
              "Title": "Crime and Consequences",
              "Types": [
                "Series"
              ],
              "GenresAny": [
                "Crime"
              ],
              "Enabled": true
            },
            {
              "Key": "tv-acclaimed",
              "Title": "Highly Rated TV",
              "Types": [
                "Series"
              ],
              "MinRating": 8,
              "Enabled": true
            }
          ]
        }
      }
    };
    const DISCOVERY_CSS = `.fx-discovery{color:inherit;padding:12px clamp(16px,4vw,80px) 36px;font-family:inherit;clear:both;box-sizing:border-box}
.fx-toolbar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:16px 0 26px}
.fx-toolbar h2{margin:0 auto 0 0;font-size:1.25rem}.fx-discovery button,.fx-dialog button{font:inherit;color:#fff;background:#292929;border:1px solid #555;border-radius:8px;padding:9px 15px;cursor:pointer}
.fx-discovery button:hover,.fx-dialog button:hover{background:#454545}.fx-discovery button:focus-visible,.fx-discovery a:focus-visible,.fx-dialog :focus-visible{outline:3px solid #fff;outline-offset:3px}
.fx-discovery button:disabled{opacity:.45;cursor:default}.fx-status{color:#ccc;line-height:1.5}.fx-status:empty{display:none}
.fx-shelf{margin:0 0 32px;min-width:0}.fx-row-head{display:flex;align-items:center;gap:10px;margin-bottom:14px}.fx-row-head h2{font-size:clamp(19px,1.7vw,28px);font-weight:600;margin:0 auto 0 0;border-left:3px solid #e50914;padding-left:10px}
.fx-row-head button{padding:3px 11px;font-size:22px;border:0;background:transparent}
.fx-track{display:flex;gap:14px;overflow-x:auto;padding:4px 3px 12px;scroll-snap-type:x proximity;scrollbar-width:thin}
.fx-card-entry{position:relative;flex:0 0 260px;width:260px;flex-basis:clamp(205px,23vw,310px);width:clamp(205px,23vw,310px);scroll-snap-align:start;min-width:0}
.fx-card{width:100%;display:block;text-decoration:none;color:inherit;min-width:0}
.fx-card-more{position:absolute;right:7px;top:7px;border-radius:50%!important;min-width:44px;min-height:44px;background:rgba(15,15,15,.85)!important;padding:0!important;font-size:24px!important}
.fx-card-visual{position:relative;aspect-ratio:16/9;background:#20252a;border-radius:9px;overflow:hidden;display:flex;align-items:center;justify-content:center}
.fx-card-visual img{width:100%;height:100%;object-fit:cover}.fx-card-visual img.fx-poster{object-fit:contain;background:linear-gradient(110deg,#252c33,#101215)}
.fx-placeholder{position:absolute;padding:18px;text-align:center;color:#bbb}.fx-name{display:block;margin:8px 2px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px}
.fx-card:hover .fx-name{color:#fff;text-decoration:underline}.fx-badge{position:absolute;bottom:0;left:50%;transform:translateX(-50%);background:#e50914;color:white;padding:3px 9px;line-height:1.3;font-size:13px;font-weight:700;white-space:nowrap;border-radius:3px 3px 0 0;z-index:2;pointer-events:none}
.fx-progress{position:absolute;left:0;right:0;bottom:0;height:3px;background:#595959;z-index:3}.fx-progress span{display:block;height:100%;background:#e50914}.fx-progress~.fx-badge{bottom:3px}
.fx-footer{text-align:center;padding:20px}.fx-footer p{color:#aaa;font-size:14px}.fx-placeholder-row{contain:strict}
.fx-dialog{color:#eee;background:#151515;border:1px solid #777;border-radius:12px;width:min(850px,90vw);max-height:86vh;padding:22px;box-sizing:border-box;z-index:100001}.fx-dialog::backdrop{background:rgba(0,0,0,.8)}
.fx-dialog h2{margin-top:0}.fx-dialog textarea{width:100%;height:42vh;box-sizing:border-box;background:#090909;color:#eee;border:1px solid #777;border-radius:6px;padding:12px;font:13px/1.5 monospace}.fx-dialog p{line-height:1.5}.fx-dialog-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.fx-dialog input{max-width:100%}
/* Hide only the native content this mounted feed explicitly owns; failure/stop removes the attribute. */
[data-fx-native-hidden="true"]{display:none!important}
.fx-discovery [hidden]{display:none!important}
.cardScalable[data-fx-badge-host]{position:relative}
.fx-filters{display:flex;flex-wrap:wrap;gap:14px;padding:18px;background:#181818;border:1px solid #444;border-radius:10px;margin-bottom:18px}
.fx-filter-field{display:flex;flex-direction:column;gap:7px;min-width:145px;font-size:14px;color:#ccc}
.fx-filter-field input,.fx-filter-field select{font:inherit;min-height:44px;border-radius:6px;border:1px solid #666;background:#242424;color:#fff;padding:8px;max-width:100%;box-sizing:border-box}
.fx-match-count{color:#ccc}.fx-match-count:empty{display:none}
.fx-dialog-overlay{position:fixed;left:0;top:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;z-index:100000;background:rgba(0,0,0,.75);padding:12px;box-sizing:border-box}
.fx-dialog{width:90vw;max-width:850px;overflow:auto;padding-bottom:calc(22px + env(safe-area-inset-bottom,0px))}
.fx-dialog-fallback{display:block;position:relative;left:auto;right:auto;top:auto;bottom:auto;margin:auto}
.fx-similar-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.fx-similar-grid .fx-card-entry{width:100%}.fx-match-reason{font-size:13px;color:#aaa;margin:7px 2px}
.fx-tv .fx-card:focus,.fx-tv button:focus{outline:4px solid #fff;outline-offset:3px;box-shadow:0 0 0 6px rgba(229,9,20,.5)}
.fx-tv .fx-card-entry:focus-within{z-index:3}.fx-discovery button,.fx-dialog button{min-height:44px;touch-action:manipulation}
.fx-discovery{padding-bottom:calc(36px + env(safe-area-inset-bottom,0px))}
@supports not (aspect-ratio:16/9){.fx-card-visual{height:0;padding-bottom:56.25%}.fx-card-visual img{position:absolute;top:0;left:0}.fx-placeholder{top:30%;left:0;right:0}}
@media(max-width:600px){.fx-discovery{padding:10px 16px 25px;padding-bottom:calc(25px + env(safe-area-inset-bottom,0px))}.fx-card-entry{width:72vw;flex-basis:72vw}.fx-toolbar{gap:7px}.fx-toolbar h2{width:100%;margin-bottom:5px}.fx-row-head h2{font-size:20px}.fx-dialog{padding:15px;max-height:85vh;max-height:85dvh}.fx-discovery button{padding:8px 10px}.fx-filter-field{flex:1 1 140px}.fx-similar-grid{grid-template-columns:minmax(0,1fr)}}
@media(prefers-reduced-motion:reduce){.fx-track{scroll-behavior:auto}}
/* Keep SleekFin's mount anchor visible; hide its native rows individually and immediately via CSS so late HSS rows never flash. */
[data-fx-hero-anchor="true"]{min-height:1px}
[data-fx-hero-anchor="true"] > :not(.sleekfin-hero):not(.hero):not(#slides-container):not(.fx-discovery):not(.sections){display:none!important}
.fx-toolbar{justify-content:flex-end;margin:4px 0 12px;position:relative;z-index:5}
.fx-feed-menu{position:relative}.fx-feed-menu>summary{cursor:pointer;list-style:none;color:#ccc;border:1px solid #555;border-radius:22px;padding:9px 16px;min-height:24px;font-size:14px}
.fx-feed-menu>summary::-webkit-details-marker{display:none}.fx-feed-menu>summary:focus-visible{outline:3px solid #fff;outline-offset:3px}
.fx-feed-menu-actions{display:flex;flex-direction:column;gap:8px;position:absolute;right:0;top:100%;margin-top:8px;padding:12px;background:#181818;border:1px solid #555;border-radius:12px;box-shadow:0 12px 40px #000a;min-width:190px;z-index:10}
.fx-feed-menu:not([open])>.fx-feed-menu-actions{display:none}
.fx-card-entry.fx-card-portrait{width:clamp(135px,14vw,205px);flex-basis:clamp(135px,14vw,205px)}
.fx-card-portrait .fx-card-visual{aspect-ratio:2/3}
.fx-card-portrait .fx-card-visual img{object-fit:contain}
.fx-card-more{opacity:0;transition:opacity .15s}.fx-card-entry:hover .fx-card-more,.fx-card-entry:focus-within .fx-card-more,.fx-tv .fx-card-more{opacity:1}
.fx-dialog{width:min(1040px,94vw);max-width:1040px;background:#14151b;border:1px solid rgba(255,255,255,.14);border-radius:18px;box-shadow:0 28px 80px rgba(0,0,0,.72)}
.fx-inline-studio{color:#f3f4f6;background:#14151b;border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:24px;margin-bottom:24px;box-shadow:0 16px 40px rgba(0,0,0,.35)}
.fx-inline-studio button{font:inherit;color:#fff;background:#252630;border:1px solid rgba(255,255,255,.16);border-radius:10px;padding:8px 14px;min-height:40px;cursor:pointer}
.fx-inline-studio button:hover{background:#323442}
.fx-dialog button.fx-btn-primary,.fx-inline-studio button.fx-btn-primary{background:#e50914;border-color:#ff2c37;color:#fff;font-weight:700}
.fx-dialog button.fx-btn-primary:hover,.fx-inline-studio button.fx-btn-primary:hover{background:#f6121d}
.fx-editor-tabs,.fx-editor-fields,.fx-order-row,.fx-category-row{display:flex;align-items:center;flex-wrap:wrap;gap:10px}
.fx-editor-tabs{position:sticky;top:-22px;background:#14151b;padding:12px 0;z-index:4;border-bottom:1px solid rgba(255,255,255,.1);margin-bottom:16px}
.fx-inline-studio .fx-editor-tabs{position:static;padding-top:4px}
.fx-editor-tabs [aria-pressed="true"]{background:#e50914!important;border-color:#ff2c37!important;color:#fff!important;font-weight:700}
.fx-editor-section{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:18px 20px;margin-bottom:18px}
.fx-editor-section h3{margin:0 0 6px;font-size:1.12rem;color:#fff;border-left:3px solid #e50914;padding-left:10px}
.fx-editor-help{margin:0 0 14px;font-size:.88rem;color:rgba(255,255,255,.66);line-height:1.45}
.fx-editor-field{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:rgba(255,255,255,.86);min-width:130px;flex:1}
.fx-editor-field input,.fx-editor-field select{box-sizing:border-box;width:100%;min-height:42px;background:#0e0f14;color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:8px;padding:8px 11px;font:inherit}
.fx-editor-field input[type="checkbox"]{width:20px;min-height:20px;accent-color:#e50914}
.fx-editor-presets{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
.fx-order-list{list-style:none;padding:0;margin:0 0 14px;display:flex;flex-direction:column;gap:8px}
.fx-order-row{padding:10px 12px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(0,0,0,.22);flex-wrap:wrap}
.fx-order-label{flex:1;min-width:160px;font-weight:600;color:#fff}
.fx-row-badge{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:3px 8px;border-radius:999px;background:rgba(255,255,255,.1);color:#ddd}
.fx-row-badge-core{background:rgba(59,130,246,.22);color:#93c5fd;border:1px solid rgba(59,130,246,.4)}
.fx-row-badge-category{background:rgba(229,9,20,.22);color:#fca5a5;border:1px solid rgba(229,9,20,.4)}
.fx-row-badge-rotating{background:rgba(16,185,129,.2);color:#6ee7b7;border:1px solid rgba(16,185,129,.38)}
.fx-chip-toggles .fx-editor-field{flex:0 0 auto;min-width:0;flex-direction:row;align-items:center;gap:8px;padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1)}
.fx-explorer-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
.fx-subtab-btn.is-active{background:rgba(229,9,20,.24)!important;border-color:#e50914!important;color:#fff!important;font-weight:700}
.fx-explorer-search,.fx-library-toolbar{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px}
.fx-explorer-search input,.fx-library-toolbar input{flex:1;min-width:220px;min-height:42px;background:#0e0f14;color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:8px 14px;font:inherit}
.fx-candidate-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px;max-height:340px;overflow-y:auto;padding-right:4px}
.fx-candidate-card{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-radius:10px;background:rgba(0,0,0,.26);border:1px solid rgba(255,255,255,.08)}
.fx-candidate-card.is-enabled{background:rgba(229,9,20,.14);border-color:rgba(229,9,20,.45)}
.fx-candidate-main{display:flex;align-items:center;gap:10px;cursor:pointer;min-width:0;flex:1}
.fx-candidate-main input[type="checkbox"]{width:18px;height:18px;accent-color:#e50914;flex:0 0 18px}
.fx-candidate-text{display:flex;flex-direction:column;min-width:0}
.fx-candidate-text strong{font-size:.88rem;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fx-candidate-count{font-size:.76rem;color:rgba(255,255,255,.58)}
.fx-btn-mini{min-height:32px!important;padding:4px 10px!important;font-size:.78rem!important;border-radius:999px!important}
.fx-btn-mini.is-pinned{background:rgba(229,9,20,.25)!important;border-color:#e50914!important}
.fx-template-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:14px;padding:10px 12px;border-radius:10px;background:rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.07)}
.fx-template-label{font-size:.82rem;font-weight:700;color:rgba(255,255,255,.7);margin-right:4px}
.fx-category-list{display:flex;flex-direction:column;gap:8px;max-height:440px;overflow-y:auto;padding-right:4px}
.fx-category-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(0,0,0,.22)}
.fx-category-row.is-editing{border-color:#e50914;background:rgba(229,9,20,.1)}
.fx-category-main{display:flex;flex-direction:column;gap:4px;min-width:200px;flex:1}
.fx-category-main .fx-editor-field{flex-direction:row-reverse;justify-content:flex-end;align-items:center;gap:10px;font-size:.95rem;font-weight:700;color:#fff}
.fx-category-main input{flex:0 0 18px;width:18px;min-height:18px}
.fx-category-meta{font-size:.8rem;color:rgba(255,255,255,.6);padding-left:28px}
.fx-category-actions{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.fx-rule-form{margin:14px 0 18px;padding:18px;border:1px solid rgba(229,9,20,.5);border-radius:12px;background:rgba(16,17,23,.95);display:flex;flex-direction:column;gap:14px}
.fx-rule-form legend{font-weight:800;color:#fff;padding:0 8px;font-size:1rem}
.fx-editor-meta-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
.fx-meta-col{display:flex;flex-direction:column;gap:6px}
.fx-quick-picks{display:flex;flex-wrap:wrap;gap:6px}
.fx-pick-chip{min-height:28px!important;padding:3px 9px!important;font-size:.75rem!important;border-radius:999px!important;background:rgba(255,255,255,.06)!important}
.fx-pick-chip.is-selected{background:rgba(229,9,20,.25)!important;border-color:#e50914!important}
.fx-advanced{margin-top:18px;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:8px 14px;background:rgba(0,0,0,.2)}.fx-advanced>summary{padding:8px 4px;cursor:pointer;font-weight:600}.fx-advanced textarea{margin-top:12px}
.fx-editor-alert{color:#fde047;font-weight:600}
@supports not (aspect-ratio:2/3){.fx-card-portrait .fx-card-visual{height:0;padding-bottom:150%}}
@media(hover:none){.fx-card-more{opacity:1}}
@media(max-width:600px){.fx-card-entry.fx-card-portrait{width:38vw;flex-basis:38vw}.fx-editor-tabs{top:-15px}}
.fx-track{scrollbar-width:none;-ms-overflow-style:none}.fx-track::-webkit-scrollbar{display:none;width:0;height:0}
.fx-shelf{margin-bottom:18px}.fx-row-head{margin-bottom:16px}.fx-name{font-weight:700}
.fx-toolbar h1{font-size:28px;margin:0 auto 0 0;border-left:3px solid #e50914;padding-left:12px}
.fx-toolbar select{font:inherit;border-radius:22px;padding:10px 18px;color:inherit;background:#222;border:1px solid #555}
.fx-profile-settings{display:block;width:100%;padding:18px;text-align:left;background:#181920;color:#fff;border:1px solid rgba(255,255,255,.14);border-radius:12px;margin-bottom:14px;font:inherit;font-weight:700;cursor:pointer}
#moviesPage .btnPlayAll,#moviesPage .btnShuffle,#tvshowsPage .btnPlayAll,#tvshowsPage .btnShuffle,#tvRecommendedPage .btnPlayAll,#tvRecommendedPage .btnShuffle{display:none!important}
#moviesPage .cardText-first,#tvshowsPage .cardText-first,#tvRecommendedPage .cardText-first{font-weight:700}
`;
    const normalize = (value) => String(value != null ? value : "").trim().toLocaleLowerCase("en-US");
    const intersects = (wanted, actual) => !(wanted == null ? void 0 : wanted.length) || wanted.some((x) => (actual || []).some((y) => normalize(x) === normalize(y)));
    function hash(value) {
      let result = 2166136261;
      for (const c of String(value)) result = Math.imul(result ^ c.charCodeAt(0), 16777619);
      return result >>> 0;
    }
    function dayInZone(now, zone) {
      const parts = new Intl.DateTimeFormat("en-US", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
      const part = (key) => parts.find((p) => p.type === key).value;
      return `${part("year")}-${part("month")}-${part("day")}`;
    }
    function monthAgo(now) {
      const cutoff = new Date(now);
      const day = cutoff.getUTCDate();
      cutoff.setUTCDate(1);
      cutoff.setUTCMonth(cutoff.getUTCMonth() - 1);
      const lastDay = new Date(Date.UTC(cutoff.getUTCFullYear(), cutoff.getUTCMonth() + 1, 0)).getUTCDate();
      cutoff.setUTCDate(Math.min(day, lastDay));
      return cutoff;
    }
    function recent(date, now) {
      const time = Date.parse(date);
      return Number.isFinite(time) && time >= monthAgo(now).getTime() && time <= now.getTime();
    }
    function seasonBadges(seasons, now) {
      const map = /* @__PURE__ */ new Map();
      for (const season of seasons) {
        if (season.Type !== "Season" || !(season.IndexNumber >= 2) || !recent(season.DateCreated, now)) continue;
        const series = season.SeriesId || season.ParentId;
        if (series) map.set(series, "New Season");
      }
      return map;
    }
    function badgeFor(item, seasons, now, tracking = null) {
      if (tracking) {
        const record = tracking.get(item.Id);
        if (item.Type === "Series" && recent(record == null ? void 0 : record.NewSeasonAt, now)) return "New Season";
        return recent(record == null ? void 0 : record.AddedAt, now) ? "Recently Added" : "";
      }
      if (item.Type === "Series" && seasons.has(item.Id)) return "New Season";
      return ["Movie", "Series"].includes(item.Type) && recent(item.DateCreated, now) ? "Recently Added" : "";
    }
    const DEFAULT_FILTERS = { query: "", genre: "", tag: "", watched: "all", maxMinutes: "", minRating: "", decade: "", type: "", sort: "recommended" };
    function filtersActive(filters) {
      return Object.keys(DEFAULT_FILTERS).some((k) => {
        var _a;
        return k !== "sort" && String((_a = filters[k]) != null ? _a : "") !== String(DEFAULT_FILTERS[k]);
      });
    }
    function filterItems(items, filters, tracking = /* @__PURE__ */ new Map()) {
      let result = items.filter((i) => {
        var _a;
        const query = normalize(filters.query);
        const haystack = normalize([i.Name, ...(i.People || []).map((p) => p.Name)].join(" "));
        return (!query || haystack.includes(query)) && (!filters.genre || intersects([filters.genre], i.Genres)) && (!filters.tag || intersects([filters.tag], i.Tags)) && (!filters.type || i.Type === filters.type) && (filters.watched === "all" || !!((_a = i.UserData) == null ? void 0 : _a.Played) === (filters.watched === "watched")) && (!filters.maxMinutes || i.Type === "Movie" && i.RunTimeTicks > 0 && i.RunTimeTicks < Number(filters.maxMinutes) * 6e8) && (!filters.minRating || i.CommunityRating != null && i.CommunityRating >= Number(filters.minRating)) && (!filters.decade || i.ProductionYear >= Number(filters.decade) && i.ProductionYear < Number(filters.decade) + 10);
      });
      if (filters.sort !== "recommended") result = result.slice().sort((a, b) => {
        var _a, _b, _c, _d;
        if (filters.sort === "rating") return ((_a = b.CommunityRating) != null ? _a : -1) - ((_b = a.CommunityRating) != null ? _b : -1) || String(a.Name).localeCompare(String(b.Name));
        if (filters.sort === "year") return (b.ProductionYear || 0) - (a.ProductionYear || 0) || String(a.Name).localeCompare(String(b.Name));
        if (filters.sort === "added") return (Date.parse((_c = tracking.get(b.Id)) == null ? void 0 : _c.AddedAt) || 0) - (Date.parse((_d = tracking.get(a.Id)) == null ? void 0 : _d.AddedAt) || 0) || String(a.Name).localeCompare(String(b.Name));
        return String(a.Name || "").localeCompare(String(b.Name || ""));
      });
      return result;
    }
    function similarItems(seed, items, limit = 24) {
      const tokens = (item, field) => new Set((item[field] || []).map(normalize).filter(Boolean));
      const shared = (a, b) => [...a].filter((x) => b.has(x));
      const seedTags = tokens(seed, "Tags"), seedGenres = tokens(seed, "Genres");
      const credits = (item, type) => new Set((item.People || []).filter((p) => p.Type === type).map((p) => normalize(p.Name)));
      const directors = credits(seed, "Director"), actors = credits(seed, "Actor");
      const frequencies = /* @__PURE__ */ new Map();
      items.forEach((item) => tokens(item, "Tags").forEach((tag) => frequencies.set(tag, (frequencies.get(tag) || 0) + 1)));
      return items.filter((i) => i.Id !== seed.Id && ["Movie", "Series"].includes(i.Type)).map((item) => {
        const tags = shared(seedTags, tokens(item, "Tags")), genres = shared(seedGenres, tokens(item, "Genres"));
        const ds = shared(directors, credits(item, "Director")), cast = shared(actors, credits(item, "Actor"));
        const score = tags.reduce((sum, t) => sum + 3 * Math.log(2 + items.length / (frequencies.get(t) || 1)), 0) + genres.length * 1.5 + ds.length * 4 + Math.min(3, cast.length);
        const names = tags.length ? tags.slice(0, 2) : ds.length ? ["same director"] : genres.length ? genres.slice(0, 2) : cast.length ? ["shared cast"] : [];
        return { item, score, reason: names.join(" \xB7 ") };
      }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score || String(a.item.Name).localeCompare(String(b.item.Name))).slice(0, limit);
    }
    function cloneJson(value) {
      return JSON.parse(JSON.stringify(value));
    }
    function matches(rule, item, hideWatched = false) {
      var _a, _b;
      const people = item.People || [];
      return (rule.Types || ["Movie"]).includes(item.Type) && (!hideWatched || !((_a = item.UserData) == null ? void 0 : _a.Played)) && intersects(rule.GenresAny, item.Genres) && intersects(rule.TagsAny, item.Tags) && intersects(rule.DirectorsAny, people.filter((p) => p.Type === "Director").map((p) => p.Name)) && intersects(rule.ActorsAny, people.filter((p) => p.Type === "Actor").map((p) => p.Name)) && intersects(rule.StudiosAny, (item.Studios || []).map((s) => s.Name)) && (rule.MinRating == null || item.CommunityRating != null && item.CommunityRating >= rule.MinRating) && (rule.MaxMinutes == null || item.RunTimeTicks > 0 && item.RunTimeTicks < rule.MaxMinutes * 6e8) && (!((_b = rule.Years) == null ? void 0 : _b.length) || item.ProductionYear >= rule.Years[0] && item.ProductionYear <= rule.Years[1]);
    }
    const familiesAllowed = /* @__PURE__ */ new Set(["theme", "genre", "director", "actor", "decade", "studio", "rating", "rewatch", "runtime"]);
    const anchorsAllowed = /* @__PURE__ */ new Set(["ContinueWatchingNextUp", "RecentlyAddedMovies", "RecentlyAddedShows", "DiscoverMovies", "DiscoverTV", "MyJellyseerrRequests", "MyMedia"]);
    function validateConfig(config) {
      var _a;
      if ((config == null ? void 0 : config.schemaVersion) !== 1) throw Error("schemaVersion must be 1.");
      dayInZone(/* @__PURE__ */ new Date(), config.timeZone);
      for (const [key, min, max] of [["cardsPerShelf", 3, 24], ["batchSize", 1, 8], ["minimumItems", 1, 12], ["maxLiveRows", 12, 60]]) {
        if (!Number.isInteger(config[key]) || config[key] < min || config[key] > max) throw Error(`${key} must be ${min}\u2013${max}.`);
      }
      if (config.minimumItems > config.cardsPerShelf) throw Error("minimumItems cannot exceed cardsPerShelf.");
      if (typeof config.endless !== "boolean" || typeof config.hideWatched !== "boolean") throw Error("endless and hideWatched must be true or false.");
      for (const page of ["home", "movies", "shows"]) {
        const profile = (_a = config.pages) == null ? void 0 : _a[page];
        if (!profile || !Array.isArray(profile.rules) || profile.rules.length > 100) throw Error(`${page}: use up to 100 rules.`);
        if (!Array.isArray(profile.anchors) || profile.anchors.some((a) => !anchorsAllowed.has(a)) || new Set(profile.anchors).size !== profile.anchors.length) throw Error(`${page}: invalid or duplicate anchors.`);
        if (!Array.isArray(profile.families) || profile.families.some((f) => !familiesAllowed.has(f))) throw Error(`${page}: invalid families.`);
        if (profile.opening != null && (!Array.isArray(profile.opening) || profile.opening.length > 100 || profile.opening.some((t) => typeof t !== "string" || !(t.startsWith("anchor:") && anchorsAllowed.has(t.slice(7)) || t.startsWith("family:") && familiesAllowed.has(t.slice(7)) || t.startsWith("rule:") && profile.rules.some((r) => (r == null ? void 0 : r.Key) === t.slice(5)))))) throw Error(`${page}: invalid opening rows.`);
        if (profile.layouts != null && (typeof profile.layouts !== "object" || Array.isArray(profile.layouts) || Object.keys(profile.layouts).length > 200 || Object.entries(profile.layouts).some(([k, v]) => !["auto", "portrait", "landscape"].includes(v) || !(k.startsWith("anchor:") && anchorsAllowed.has(k.slice(7)) || k.startsWith("family:") && familiesAllowed.has(k.slice(7)) || k.startsWith("rule:") && profile.rules.some((r) => (r == null ? void 0 : r.Key) === k.slice(5)))))) throw Error(`${page}: invalid card layouts.`);
        const keys = /* @__PURE__ */ new Set();
        for (const r of profile.rules) {
          if (!r || !/^[a-zA-Z0-9-]{1,60}$/.test(r.Key) || keys.has(r.Key)) throw Error(`${page}: rule keys must be unique letters, digits or hyphens.`);
          keys.add(r.Key);
          if (typeof r.Title !== "string" || !r.Title.trim() || r.Title.length > 120) throw Error(`${r.Key}: title needs 1\u2013120 characters.`);
          if (r.Layout != null && !["auto", "portrait", "landscape"].includes(r.Layout)) throw Error(`${r.Key}: invalid layout.`);
          if (r.Enabled != null && typeof r.Enabled !== "boolean") throw Error(`${r.Key}: Enabled must be true or false.`);
          if (!Array.isArray(r.Types) || !r.Types.length || r.Types.some((t) => !["Movie", "Series"].includes(t))) throw Error(`${r.Key}: Types must contain Movie and/or Series.`);
          for (const field of ["GenresAny", "TagsAny", "DirectorsAny", "ActorsAny", "StudiosAny"]) {
            if (r[field] != null && (!Array.isArray(r[field]) || r[field].some((v) => typeof v !== "string" || !v.trim()))) throw Error(`${r.Key}: ${field} must be a string array.`);
          }
          if (r.Months != null && (!Array.isArray(r.Months) || r.Months.some((m) => !Number.isInteger(m) || m < 1 || m > 12))) throw Error(`${r.Key}: Months must contain 1\u201312.`);
          if (r.Years != null && (!Array.isArray(r.Years) || r.Years.length !== 2 || r.Years.some((y) => !Number.isInteger(y)) || r.Years[0] > r.Years[1])) throw Error(`${r.Key}: Years must be [first, last].`);
          if (r.MinRating != null && (!Number.isFinite(r.MinRating) || r.MinRating < 0 || r.MinRating > 10)) throw Error(`${r.Key}: MinRating must be 0\u201310.`);
          if (r.MaxMinutes != null && (!Number.isInteger(r.MaxMinutes) || r.MaxMinutes <= 0)) throw Error(`${r.Key}: MaxMinutes must be a positive whole number.`);
        }
      }
      return config;
    }
    function buildShelves(items, profile, config, page, now) {
      var _a, _b;
      const eligible = items.filter((i) => {
        var _a2;
        return (page === "home" ? ["Movie", "Series"].includes(i.Type) : i.Type === (page === "movies" ? "Movie" : "Series")) && (!config.hideWatched || !((_a2 = i.UserData) == null ? void 0 : _a2.Played));
      });
      const month = Number(dayInZone(now, config.timeZone).split("-")[1]);
      const shelves = [];
      const add = (key, title, family, list) => {
        const unique = Array.from(new Map(list.map((i) => [i.Id, i])).values());
        if (unique.length >= config.minimumItems) shelves.push({ key, title, family, items: unique });
      };
      for (const rule of profile.rules) {
        if (!profile.families.includes("theme") && !((_a = profile.opening) == null ? void 0 : _a.includes(`rule:${rule.Key}`))) continue;
        if (rule.Enabled === false || ((_b = rule.Months) == null ? void 0 : _b.length) && !rule.Months.includes(month)) continue;
        add(`rule:${rule.Key}`, rule.Title, "theme", eligible.filter((i) => matches(rule, i)));
        const added = shelves.find((r) => r.key === `rule:${rule.Key}`);
        if (added) added.layout = rule.Layout || "auto";
      }
      const grouping = (family, values, title, filter = () => true) => {
        if (!profile.families.includes(family)) return;
        const groups = /* @__PURE__ */ new Map();
        for (const item of eligible.filter(filter)) {
          for (const value of new Set(values(item).filter(Boolean))) {
            const key = normalize(value);
            if (!groups.has(key)) groups.set(key, { name: value, items: [] });
            groups.get(key).items.push(item);
          }
        }
        Array.from(groups.entries()).sort((a, b) => b[1].items.length - a[1].items.length || a[0].localeCompare(b[0])).slice(0, 60).forEach(([key, g]) => add(`${family}:${key}`, title(g.name), family, g.items));
      };
      const label = page === "movies" ? "Movies" : page === "shows" ? "Shows" : "Movies & Shows";
      grouping("genre", (i) => i.Genres || [], (g) => `${g} ${label}`);
      grouping("director", (i) => (i.People || []).filter((p) => p.Type === "Director").map((p) => p.Name), (p) => `Directed by ${p}`);
      grouping("actor", (i) => (i.People || []).filter((p) => p.Type === "Actor").slice(0, 8).map((p) => p.Name), (p) => `Starring ${p}`);
      grouping("studio", (i) => (i.Studios || []).map((s) => s.Name), (s) => `From ${s}`);
      grouping("decade", (i) => i.ProductionYear ? [String(Math.floor(i.ProductionYear / 10) * 10)] : [], (d) => `Highly Rated from the ${d}s`, (i) => i.CommunityRating >= 7);
      if (profile.families.includes("rating")) add("rating:8", `Highly Rated ${label}`, "rating", eligible.filter((i) => i.CommunityRating >= 8));
      if (profile.families.includes("rewatch")) add("rewatch:played", "Worth Another Watch", "rewatch", items.filter((i) => {
        var _a2;
        return ((_a2 = i.UserData) == null ? void 0 : _a2.Played) && (page === "home" || i.Type === (page === "movies" ? "Movie" : "Series"));
      }));
      if (profile.families.includes("runtime")) add("runtime:short", "Movie Night Under Two Hours", "runtime", eligible.filter((i) => i.Type === "Movie" && i.RunTimeTicks > 0 && i.RunTimeTicks < 72e9));
      add("genre:explore", `Explore More ${label}`, "genre", eligible);
      return shelves;
    }
    class FeedPlanner {
      constructor(shelves, config, seed) {
        this.shelves = shelves;
        this.config = config;
        this.seed = seed;
        this.counts = /* @__PURE__ */ new Map();
        this.lastFamilies = [];
        this.lastKeys = [];
        this.lastItems = [];
        this.index = 0;
      }
      take(key) {
        return this.next(null, key);
      }
      next(preferredFamily = null, exactKey = null) {
        if (!this.shelves.length) return null;
        let pool = this.shelves.filter((s) => (!exactKey || s.key === exactKey) && (this.config.endless || !this.counts.has(s.key)));
        if (!pool.length) return null;
        const fresh = pool.filter((s) => !this.lastKeys.includes(s.key));
        if (fresh.length) pool = fresh;
        const preferred = pool.filter((s) => s.family === preferredFamily);
        if (preferred.length) pool = preferred;
        const familyDiverse = pool.filter((s) => !this.lastFamilies.includes(s.family));
        if (familyDiverse.length) pool = familyDiverse;
        pool.sort((a, b) => (this.counts.get(a.key) || 0) - (this.counts.get(b.key) || 0) || hash(`${this.seed}:${this.index}:${a.key}`) - hash(`${this.seed}:${this.index}:${b.key}`));
        const shelf = pool[0], recentIds = new Set(this.lastItems);
        const selected = shelf.items.slice().sort((a, b) => Number(recentIds.has(a.Id)) - Number(recentIds.has(b.Id)) || hash(`${this.seed}:${this.index}:${a.Id}`) - hash(`${this.seed}:${this.index}:${b.Id}`)).slice(0, this.config.cardsPerShelf);
        this.counts.set(shelf.key, (this.counts.get(shelf.key) || 0) + 1);
        this.lastKeys.push(shelf.key);
        const cooldown = Math.min(12, Math.max(0, this.shelves.length - 1));
        this.lastKeys = cooldown ? this.lastKeys.slice(-cooldown) : [];
        this.lastFamilies.push(shelf.family);
        this.lastFamilies = this.lastFamilies.slice(-2);
        this.lastItems.push(...selected.map((i) => i.Id));
        this.lastItems = this.lastItems.slice(-this.config.cardsPerShelf * 5);
        this.index++;
        return { ...shelf, items: selected, ordinal: this.index };
      }
    }
    function routeInfo(hashValue) {
      var _a;
      const value = String(hashValue || "").replace(/^#!?\/?/, "").replace(/^\//, "");
      const [path, query = ""] = value.split("?");
      const p = new URLSearchParams(query), name = path.replace(/\.html$/, "").toLowerCase();
      if ([...p.keys()].some((k) => ["seerrfintab", "requesthub"].includes(k.toLowerCase()))) return null;
      const collection = (_a = p.get("collectionType")) == null ? void 0 : _a.toLowerCase();
      const page = ["home", ""].includes(name) ? "home" : name === "movies" ? "movies" : ["tv", "tvshows"].includes(name) ? "shows" : name === "list" && ["movies", "tvshows"].includes(collection) ? collection === "movies" ? "movies" : "shows" : null;
      const tab = p.get("tab");
      if (page === "home" && tab && tab !== "0") return null;
      let view = "suggestions";
      if (page && page !== "home") {
        if (tab === "0") view = "library";
        else if (tab === (page === "movies" ? "4" : "3")) view = "genres";
        else if (tab && tab !== "1") return null;
      }
      return page ? { page, ...page !== "home" ? { view } : {}, parentId: p.get("topParentId") || p.get("parentId") || "", serverId: p.get("serverId") || "" } : null;
    }
    class JellyfinClient {
      constructor(api, current = () => true) {
        var _a;
        this.api = api;
        this.userId = api.getCurrentUserId();
        this.current = current;
        this.serverId = ((_a = api.serverId) == null ? void 0 : _a.call(api)) || "";
        if (!this.userId) throw Error("Sign in to Jellyfin first.");
      }
      assertCurrent() {
        var _a, _b;
        if (!this.current() || this.api.getCurrentUserId() !== this.userId || (((_b = (_a = this.api).serverId) == null ? void 0 : _b.call(_a)) || "") !== this.serverId) throw Error("This view has changed.");
      }
      async request(promise) {
        this.assertCurrent();
        let timer;
        try {
          const result = await Promise.race([promise, new Promise((_, reject) => {
            timer = setTimeout(() => reject(Error("Jellyfin request timed out.")), 2e4);
          })]);
          this.assertCurrent();
          return result;
        } finally {
          clearTimeout(timer);
        }
      }
      json(path, params = {}) {
        return this.request(this.api.getJSON(this.api.getUrl(path, params)));
      }
      items(params) {
        return this.request(this.api.getItems(this.userId, params));
      }
      async preferences() {
        var _a, _b, _c, _d;
        const value = await this.json("FazFortDiscovery/Preferences");
        if (!Number.isInteger((_a = value.Version) != null ? _a : value.version)) throw Error("Companion preferences are unavailable.");
        return { version: (_b = value.Version) != null ? _b : value.version, config: (_d = (_c = value.Config) != null ? _c : value.config) != null ? _d : null };
      }
      async savePreferences(config, version) {
        this.assertCurrent();
        return this.request(this.api.ajax({ url: this.api.getUrl("FazFortDiscovery/Preferences"), type: "POST", contentType: "application/json", dataType: "json", data: JSON.stringify({ ExpectedVersion: version, Config: config }) }));
      }
      async tracking(items) {
        var _a, _b, _c, _d, _e;
        const records = /* @__PURE__ */ new Map();
        let ready = false;
        for (let offset = 0; offset < items.length || offset === 0; offset += 200) {
          const ids = items.slice(offset, offset + 200).map((i) => i.Id);
          const result = await this.json("FazFortDiscovery/Tracking", { Ids: ids.join(",") });
          if (((_a = result.Ready) != null ? _a : result.ready) !== true) throw Error("Arrival tracking is not ready.");
          ready = true;
          const map = (_c = (_b = result.Records) != null ? _b : result.records) != null ? _c : {};
          for (const item of items.slice(offset, offset + 200)) {
            const r = map[item.Id] || map[item.Id.replace(/-/g, "").toLowerCase()];
            if (r) records.set(item.Id, { AddedAt: (_d = r.AddedAt) != null ? _d : r.addedAt, NewSeasonAt: (_e = r.NewSeasonAt) != null ? _e : r.newSeasonAt });
          }
          if (!items.length) break;
        }
        return { ready, records };
      }
      async inventory(route, progress) {
        const views = await this.json(`Users/${encodeURIComponent(this.userId)}/Views`);
        this.views = (views.Items || []).filter((v) => ["movies", "tvshows", "", null, void 0].includes(v.CollectionType));
        const folders = route.parentId ? [{ Id: route.parentId }] : this.views.filter((v) => route.page === "home" || !v.CollectionType || v.CollectionType === (route.page === "movies" ? "movies" : "tvshows"));
        const type = route.page === "movies" ? "Movie" : route.page === "shows" ? "Series" : "Movie,Series";
        const all = /* @__PURE__ */ new Map(), seasons = /* @__PURE__ */ new Map();
        for (const folder of folders) {
          for (const types of [type, ...route.page === "movies" ? [] : ["Season"]]) {
            let offset = 0;
            for (; ; ) {
              this.assertCurrent();
              const response = await this.items({
                ParentId: folder.Id,
                Recursive: true,
                IncludeItemTypes: types,
                Fields: "Genres,Tags,People,Studios,DateCreated,ParentId,PrimaryImageAspectRatio",
                EnableUserData: true,
                EnableImages: true,
                ImageTypeLimit: 1,
                EnableImageTypes: "Primary,Backdrop,Thumb",
                SortBy: "SortName",
                SortOrder: "Ascending",
                StartIndex: offset,
                Limit: 200
              });
              const list = response.Items || [], target = types === "Season" ? seasons : all;
              let added = 0;
              for (const item of list) if (item.Id && !target.has(item.Id)) {
                target.set(item.Id, item);
                added++;
              }
              offset += list.length;
              progress == null ? void 0 : progress(all.size, seasons.size);
              if (list.length === 0 || added === 0 || list.length < 200 || Number.isFinite(response.TotalRecordCount) && offset >= response.TotalRecordCount) break;
              if (offset >= 1e5) throw Error("Library exceeds the 100,000-item safety limit. Use a smaller library.");
            }
          }
        }
        return { items: [...all.values()], seasons: [...seasons.values()], views: this.views };
      }
      async hydrate(items) {
        const ids = items.filter((i) => /^[a-f0-9-]{32,36}$/i.test(i.Id || "")).map((i) => i.Id);
        if (!ids.length) return items;
        const response = await this.items({ Ids: ids.join(","), Fields: "DateCreated,PrimaryImageAspectRatio", EnableImages: true, EnableUserData: true, ImageTypeLimit: 1, EnableImageTypes: "Primary,Backdrop,Thumb" });
        const byId = new Map((response.Items || []).map((i) => [i.Id, i]));
        return items.filter((i) => !ids.includes(i.Id) || byId.has(i.Id)).map((i) => byId.has(i.Id) ? { ...i, ...byId.get(i.Id) } : i);
      }
      groupResume(items, inventory) {
        var _a, _b;
        const grouped = /* @__PURE__ */ new Map();
        for (const item of items) {
          const key = item.Type === "Episode" && item.SeriesId ? item.SeriesId : item.Id;
          const old = grouped.get(key);
          const priority = (i) => {
            var _a2;
            return ((_a2 = i.UserData) == null ? void 0 : _a2.PlaybackPositionTicks) > 0 ? 2 : 1;
          };
          if (old && (priority(old) > priority(item) || priority(old) === priority(item) && (Date.parse((_a = old.UserData) == null ? void 0 : _a.LastPlayedDate) || 0) >= (Date.parse((_b = item.UserData) == null ? void 0 : _b.LastPlayedDate) || 0))) continue;
          grouped.set(key, item);
        }
        return [...grouped.values()].map((item) => {
          if (item.Type !== "Episode" || !item.SeriesId) return item;
          const show = inventory.items.find((i) => i.Id === item.SeriesId);
          return {
            ...item,
            Name: item.SeriesName || (show == null ? void 0 : show.Name) || item.Name,
            Type: "Series",
            ResumeItemId: item.Id,
            Id: item.SeriesId,
            ImageTags: (show == null ? void 0 : show.ImageTags) || {},
            BackdropImageTags: (show == null ? void 0 : show.BackdropImageTags) || item.ParentBackdropImageTags || [],
            SeriesName: void 0,
            PrimaryImageAspectRatio: show == null ? void 0 : show.PrimaryImageAspectRatio
          };
        });
      }
      async anchor(id, route, inventory, config) {
        const typed = (list) => route.page === "home" ? list : list.filter((i) => route.page === "movies" ? i.Type === "Movie" || i.SourceType === "movie" : ["Series", "Episode"].includes(i.Type) || i.SourceType === "tv");
        const arrival = (item) => {
          var _a;
          const r = (_a = inventory.tracking) == null ? void 0 : _a.get(item.Id);
          return Date.parse(kindDate(item, r)) || 0;
        };
        const kindDate = (item, r) => item.Type === "Series" ? (r == null ? void 0 : r.NewSeasonAt) || (r == null ? void 0 : r.AddedAt) : r == null ? void 0 : r.AddedAt;
        const recentItems = (kind) => inventory.items.filter((i) => i.Type === kind).sort((a, b) => Number(!!arrival(b)) - Number(!!arrival(a)) || arrival(b) - arrival(a) || (Date.parse(b.DateCreated) || 0) - (Date.parse(a.DateCreated) || 0)).slice(0, config.cardsPerShelf);
        const title = { ContinueWatchingNextUp: "Continue Watching / Next Up", RecentlyAddedMovies: "Recently Added in Movies", RecentlyAddedShows: "Recently Added in Shows", DiscoverMovies: "Discover Movies", DiscoverTV: "Discover TV Shows", MyJellyseerrRequests: "My Requests", MyMedia: "My Media" }[id];
        if (id === "RecentlyAddedMovies" || id === "RecentlyAddedShows") return { key: id, title, family: "anchor", items: recentItems(id === "RecentlyAddedMovies" ? "Movie" : "Series") };
        if (id === "MyMedia") return { key: id, title, family: "anchor", items: inventory.views };
        try {
          const response = await this.json(`HomeScreen/Section/${id}`, { UserId: this.userId });
          let list = typed(response.Items || []);
          if (route.parentId && !id.startsWith("Discover")) {
            const allowed = new Set(inventory.items.map((i) => i.Id));
            list = list.filter((i) => allowed.has(i.Id) || allowed.has(i.SeriesId));
          }
          if (id === "ContinueWatchingNextUp") list = this.groupResume(list, inventory);
          return { key: id, title, family: "anchor", items: list.slice(0, config.cardsPerShelf), external: id.startsWith("Discover") };
        } catch (error) {
          this.assertCurrent();
          if (id !== "ContinueWatchingNextUp") throw error;
          const resume = await this.json("Items/Resume", { UserId: this.userId, Limit: config.cardsPerShelf, ...route.parentId ? { ParentId: route.parentId } : {}, Fields: "DateCreated,PrimaryImageAspectRatio", EnableImages: true });
          return { key: id, title: "Continue Watching", family: "anchor", items: this.groupResume(typed(resume.Items || []), inventory).slice(0, config.cardsPerShelf) };
        }
      }
    }
    function createVisualEditor(host, initial, selectedPage, inventory, changed, { element, button, supplied }) {
      let draft = cloneJson(initial), page = selectedPage || "home", editing = null, explorerKind = "director", explorerQuery = "", libraryQuery = "";
      const anchors = { ContinueWatchingNextUp: "Continue Watching / Next Up", RecentlyAddedMovies: "Recently Added in Movies", RecentlyAddedShows: "Recently Added in Shows", DiscoverMovies: "Discover Movies", DiscoverTV: "Discover TV Shows", MyJellyseerrRequests: "My Requests", MyMedia: "My Media" };
      const families = { theme: "Rotating theme", genre: "Rotating genre", director: "Directed by\u2026", actor: "Starring\u2026", decade: "Best of a decade", studio: "Studio / network", rating: "Highly rated", rewatch: "Worth another watch", runtime: "Short movies" };
      const emit = () => changed(cloneJson(draft));
      function field(parent, label, value, save, choices = null, type = "text") {
        const wrap = element("label", "fx-editor-field", label), control = element(choices ? "select" : "input");
        control.setAttribute("aria-label", label);
        if (choices) {
          choices.forEach(([v, t]) => {
            const o = element("option", "", t);
            o.value = v;
            o.selected = String(value) === v;
            control.append(o);
          });
        } else {
          control.type = type;
          if (type === "checkbox") control.checked = !!value;
          else control.value = value != null ? value : "";
        }
        control.addEventListener("change", () => {
          save(type === "checkbox" ? control.checked : control.value);
          emit();
        });
        wrap.append(control);
        parent.append(wrap);
        return control;
      }
      const layoutChoices = [["auto", "Automatic"], ["landscape", "Landscape"], ["portrait", "Portrait"]];
      const defaultTypesForPage = (p) => p === "shows" ? ["Series"] : p === "movies" ? ["Movie"] : ["Movie", "Series"];
      const pageItems = () => {
        const all = (inventory == null ? void 0 : inventory.items) || [];
        if (page === "movies") return all.filter((i) => i.Type === "Movie");
        if (page === "shows") return all.filter((i) => i.Type === "Series");
        return all.filter((i) => i.Type === "Movie" || i.Type === "Series");
      };
      function countRuleMatches(rule) {
        const items = pageItems();
        if (!items.length) return null;
        try {
          return items.filter((i) => matchesRule(i, rule, (/* @__PURE__ */ new Date()).getMonth() + 1)).length;
        } catch {
          return null;
        }
      }
      function slug(prefix, name) {
        const clean = String(name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
        return `${prefix}-${clean || hash(String(name)).toString(16)}`;
      }
      function discoverCandidates() {
        const items = pageItems();
        const minCount = Math.max(1, Math.min(3, Number(draft.minimumItems) || 2));
        const mediaWord = page === "movies" ? "Movies" : page === "shows" ? "Shows" : "Titles";
        const byDirector = /* @__PURE__ */ new Map(), byActor = /* @__PURE__ */ new Map(), byStudio = /* @__PURE__ */ new Map(), byYear = /* @__PURE__ */ new Map(), byDecade = /* @__PURE__ */ new Map(), byGenre = /* @__PURE__ */ new Map(), byTag = /* @__PURE__ */ new Map();
        const bump = (map, name) => {
          if (!name) return;
          const k = String(name).trim();
          if (!k) return;
          map.set(k, (map.get(k) || 0) + 1);
        };
        for (const item of items) {
          for (const p of item.People || []) {
            if ((p == null ? void 0 : p.Type) === "Director") bump(byDirector, p.Name);
            else if ((p == null ? void 0 : p.Type) === "Actor") bump(byActor, p.Name);
          }
          for (const s of item.Studios || []) bump(byStudio, typeof s === "string" ? s : s == null ? void 0 : s.Name);
          for (const g of item.Genres || []) bump(byGenre, g);
          for (const t of item.Tags || []) bump(byTag, t);
          const yr = Number(item.ProductionYear);
          if (yr >= 1900 && yr <= 2100) {
            bump(byYear, String(yr));
            bump(byDecade, String(Math.floor(yr / 10) * 10));
          }
        }
        const list = [];
        const toSorted = (map, limit = 60) => [...map.entries()].filter(([, c]) => c >= minCount || map.size <= 12).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit);
        for (const [name, count] of toSorted(byDirector, 60)) {
          list.push({
            kind: "director",
            name,
            count,
            title: `Directed by ${name}`,
            key: slug("dir", name),
            match: (r) => {
              var _a, _b;
              return (r.DirectorsAny || []).some((x) => x.toLowerCase() === name.toLowerCase()) && !((_a = r.ActorsAny) == null ? void 0 : _a.length) && !((_b = r.GenresAny) == null ? void 0 : _b.length);
            },
            create: () => ({ Key: slug("dir", name), Title: `Directed by ${name}`, Enabled: true, Types: defaultTypesForPage(page), GenresAny: [], TagsAny: [], DirectorsAny: [name], Months: [] })
          });
        }
        for (const [name, count] of toSorted(byActor, 60)) {
          list.push({
            kind: "actor",
            name,
            count,
            title: `Starring ${name}`,
            key: slug("cast", name),
            match: (r) => {
              var _a, _b;
              return (r.ActorsAny || []).some((x) => x.toLowerCase() === name.toLowerCase()) && !((_a = r.DirectorsAny) == null ? void 0 : _a.length) && !((_b = r.GenresAny) == null ? void 0 : _b.length);
            },
            create: () => ({ Key: slug("cast", name), Title: `Starring ${name}`, Enabled: true, Types: defaultTypesForPage(page), GenresAny: [], TagsAny: [], ActorsAny: [name], Months: [] })
          });
        }
        for (const [name, count] of toSorted(byStudio, 50)) {
          list.push({
            kind: "studio",
            name,
            count,
            title: `From ${name}`,
            key: slug("studio", name),
            match: (r) => (r.StudiosAny || []).some((x) => x.toLowerCase() === name.toLowerCase()),
            create: () => ({ Key: slug("studio", name), Title: `From ${name}`, Enabled: true, Types: defaultTypesForPage(page), GenresAny: [], TagsAny: [], StudiosAny: [name], Months: [] })
          });
        }
        for (const [dec, count] of [...byDecade.entries()].sort((a, b) => Number(b[0]) - Number(a[0]))) {
          const d = Number(dec);
          list.push({
            kind: "year",
            name: `${d}s`,
            count,
            title: `${mediaWord} from the ${d}s`,
            key: `decade-${d}s`,
            match: (r) => {
              var _a, _b;
              return ((_a = r.Years) == null ? void 0 : _a[0]) === d && ((_b = r.Years) == null ? void 0 : _b[1]) === d + 9;
            },
            create: () => ({ Key: `decade-${d}s`, Title: `${mediaWord} from the ${d}s`, Enabled: true, Types: defaultTypesForPage(page), GenresAny: [], TagsAny: [], Years: [d, d + 9], Months: [] })
          });
        }
        for (const [yr, count] of [...byYear.entries()].sort((a, b) => Number(b[0]) - Number(a[0])).slice(0, 35)) {
          const y = Number(yr);
          list.push({
            kind: "year",
            name: yr,
            count,
            title: `${mediaWord} from ${y}`,
            key: `year-${y}`,
            match: (r) => {
              var _a, _b;
              return ((_a = r.Years) == null ? void 0 : _a[0]) === y && ((_b = r.Years) == null ? void 0 : _b[1]) === y;
            },
            create: () => ({ Key: `year-${y}`, Title: `${mediaWord} from ${y}`, Enabled: true, Types: defaultTypesForPage(page), GenresAny: [], TagsAny: [], Years: [y, y], Months: [] })
          });
        }
        for (const [name, count] of toSorted(byGenre, 40)) {
          list.push({
            kind: "genre",
            name,
            count,
            title: `${name} Spotlight`,
            key: slug("genre", name),
            match: (r) => {
              var _a;
              return (r.GenresAny || []).length === 1 && r.GenresAny[0].toLowerCase() === name.toLowerCase() && !((_a = r.TagsAny) == null ? void 0 : _a.length);
            },
            create: () => ({ Key: slug("genre", name), Title: `${name} Spotlight`, Enabled: true, Types: defaultTypesForPage(page), GenresAny: [name], TagsAny: [], Months: [] })
          });
        }
        for (const [name, count] of toSorted(byTag, 50)) {
          const pretty = name.replace(/\b\w/g, (c) => c.toUpperCase());
          list.push({
            kind: "tag",
            name,
            count,
            title: pretty,
            key: slug("tag", name),
            match: (r) => {
              var _a;
              return (r.TagsAny || []).length === 1 && r.TagsAny[0].toLowerCase() === name.toLowerCase() && !((_a = r.GenresAny) == null ? void 0 : _a.length);
            },
            create: () => ({ Key: slug("tag", name), Title: pretty, Enabled: true, Types: defaultTypesForPage(page), GenresAny: [], TagsAny: [name], Months: [] })
          });
        }
        return list;
      }
      function ruleSummary(rule) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i;
        const parts = [];
        const types = ((_a = rule.Types) == null ? void 0 : _a.length) === 2 ? "Movies & Shows" : ((_b = rule.Types) == null ? void 0 : _b[0]) === "Series" ? "Shows" : "Movies";
        parts.push(types);
        if ((_c = rule.DirectorsAny) == null ? void 0 : _c.length) parts.push(`Dir: ${rule.DirectorsAny.slice(0, 2).join(", ")}`);
        if ((_d = rule.ActorsAny) == null ? void 0 : _d.length) parts.push(`Cast: ${rule.ActorsAny.slice(0, 2).join(", ")}`);
        if ((_e = rule.StudiosAny) == null ? void 0 : _e.length) parts.push(`Studio: ${rule.StudiosAny.slice(0, 2).join(", ")}`);
        if ((_f = rule.GenresAny) == null ? void 0 : _f.length) parts.push(`Genres: ${rule.GenresAny.slice(0, 2).join(", ")}`);
        if ((_g = rule.TagsAny) == null ? void 0 : _g.length) parts.push(`Tags: ${rule.TagsAny.slice(0, 2).join(", ")}`);
        if (((_h = rule.Years) == null ? void 0 : _h.length) === 2) {
          parts.push(rule.Years[0] === rule.Years[1] ? `Year: ${rule.Years[0]}` : `Years: ${rule.Years[0]}\u2013${rule.Years[1]}`);
        }
        if (rule.MinRating) parts.push(`${rule.MinRating}+ \u2605`);
        if (rule.MaxMinutes) parts.push(`< ${rule.MaxMinutes}m`);
        if ((_i = rule.Months) == null ? void 0 : _i.length) parts.push(`Months: ${rule.Months.join(",")}`);
        const matches2 = countRuleMatches(rule);
        if (matches2 !== null) parts.push(`${matches2} match${matches2 === 1 ? "" : "es"}`);
        return parts.join(" \xB7 ");
      }
      function uniqueValues(kind) {
        const items = (inventory == null ? void 0 : inventory.items) || [];
        if (kind === "DirectorsAny") return [...new Set(items.flatMap((i) => (i.People || []).filter((p) => (p == null ? void 0 : p.Type) === "Director").map((p) => p.Name)).filter(Boolean))].sort();
        if (kind === "ActorsAny") return [...new Set(items.flatMap((i) => (i.People || []).filter((p) => (p == null ? void 0 : p.Type) === "Actor").map((p) => p.Name)).filter(Boolean))].sort();
        if (kind === "StudiosAny") return [...new Set(items.flatMap((i) => (i.Studios || []).map((s) => typeof s === "string" ? s : s == null ? void 0 : s.Name)).filter(Boolean))].sort();
        if (kind === "GenresAny") return [...new Set(items.flatMap((i) => i.Genres || []).filter(Boolean))].sort();
        if (kind === "TagsAny") return [...new Set(items.flatMap((i) => i.Tags || []).filter(Boolean))].sort();
        return [];
      }
      function createFromTemplate(kind) {
        var _a;
        const profile = draft.pages[page];
        const key = `category-${hash(String(Date.now()) + profile.rules.length + kind).toString(16)}`;
        const base = { Key: key, Title: "New category", Enabled: true, Types: defaultTypesForPage(page), GenresAny: [], TagsAny: [], Months: [] };
        const dirs = uniqueValues("DirectorsAny"), actors = uniqueValues("ActorsAny"), studios = uniqueValues("StudiosAny");
        const yr = (/* @__PURE__ */ new Date()).getFullYear();
        if (kind === "director") {
          base.Title = dirs[0] ? `Directed by ${dirs[0]}` : "Directed by\u2026";
          base.DirectorsAny = dirs[0] ? [dirs[0]] : [];
        } else if (kind === "actor") {
          base.Title = actors[0] ? `Starring ${actors[0]}` : "Starring\u2026";
          base.ActorsAny = actors[0] ? [actors[0]] : [];
        } else if (kind === "studio") {
          base.Title = studios[0] ? `From ${studios[0]}` : "Studio Spotlight";
          base.StudiosAny = studios[0] ? [studios[0]] : [];
        } else if (kind === "year") {
          base.Title = `${page === "shows" ? "Shows" : "Movies"} from ${yr - 1}`;
          base.Years = [yr - 1, yr];
        } else if (kind === "short") {
          base.Title = "Under 100 Minutes";
          base.Types = ["Movie"];
          base.MaxMinutes = 100;
        } else if (kind === "acclaimed") {
          base.Title = "Critics\u2019 Choice (8.0+)";
          base.MinRating = 8;
        } else if (kind === "seasonal") {
          base.Title = "October Chills";
          base.GenresAny = ["Horror", "Thriller"];
          base.Months = [10];
        }
        profile.rules.push(base);
        editing = key;
        emit();
        draw();
        (_a = host.querySelector('[aria-label="Category title"]')) == null ? void 0 : _a.focus();
      }
      function draw() {
        var _a, _b, _c;
        host.replaceChildren();
        const tabs = element("div", "fx-editor-tabs");
        for (const name of ["home", "movies", "shows"]) {
          const b = button(name[0].toUpperCase() + name.slice(1), () => {
            page = name;
            editing = null;
            draw();
          });
          b.className = `fx-tab-btn ${page === name ? "is-active" : ""}`.trim();
          b.setAttribute("aria-pressed", String(page === name));
          tabs.append(b);
        }
        host.append(tabs);
        const profile = draft.pages[page];
        const sharedSec = element("section", "fx-editor-section");
        sharedSec.append(element("h3", "", "Shared feed preferences"), element("p", "fx-editor-help", "Global display limits and behavior shared across Home, Movies and Shows."));
        const general = element("div", "fx-editor-fields");
        field(general, "Timezone", draft.timeZone, (v) => draft.timeZone = v);
        field(general, "Cards per shelf", draft.cardsPerShelf, (v) => draft.cardsPerShelf = Number(v), null, "number");
        field(general, "Minimum matching titles", draft.minimumItems, (v) => draft.minimumItems = Number(v), null, "number");
        field(general, "Continuous scrolling", draft.endless, (v) => draft.endless = v, null, "checkbox");
        field(general, "Hide watched titles", draft.hideWatched, (v) => draft.hideWatched = v, null, "checkbox");
        sharedSec.append(general);
        host.append(sharedSec);
        const openingSec = element("section", "fx-editor-section");
        openingSec.append(
          element("h3", "", "Opening rows & shelf order"),
          element("p", "fx-editor-help", "Arrange the exact shelves that appear at the top of this page. Mix core sections (Continue Watching, Recently Added), specific custom categories, and rotating pools (e.g. a random Director or Studio shelf). After these opening rows, the endless varied feed continues.")
        );
        const options = () => [
          ...Object.entries(anchors).map(([key, label]) => [`anchor:${key}`, label]),
          ...profile.rules.map((r) => [`rule:${r.Key}`, r.Title]),
          ...Object.entries(families).map(([key, label]) => [`family:${key}`, label])
        ];
        const opening = profile.opening || profile.anchors.flatMap((a) => [`anchor:${a}`, "family:theme"]);
        const updateOpening = () => {
          profile.opening = [...opening];
          emit();
          draw();
        };
        const presetRow = element("div", "fx-editor-presets");
        presetRow.append(
          button("Interleave Core & Custom", () => {
            const core = profile.anchors.map((a) => `anchor:${a}`);
            const rot = ["family:theme", "family:director", "family:actor", "family:studio", "family:decade", "family:genre"];
            const nextOpening = [];
            const max = Math.max(core.length, rot.length);
            for (let i = 0; i < max; i++) {
              if (core[i]) nextOpening.push(core[i]);
              if (rot[i]) nextOpening.push(rot[i]);
            }
            profile.opening = nextOpening;
            emit();
            draw();
          }),
          button("Pin enabled categories first", () => {
            const pinned = profile.rules.filter((r) => r.Enabled !== false).slice(0, 6).map((r) => `rule:${r.Key}`);
            profile.opening = ["anchor:ContinueWatchingNextUp", ...pinned, "anchor:RecentlyAddedMovies", "family:director", "family:actor"];
            emit();
            draw();
          }),
          button("Use automatic ordering", () => {
            delete profile.opening;
            emit();
            draw();
          })
        );
        openingSec.append(presetRow);
        const rows = element("ol", "fx-order-list");
        opening.forEach((token, n) => {
          var _a2, _b2;
          const row = element("li", "fx-order-row");
          const badgeType = token.startsWith("anchor:") ? "Core" : token.startsWith("rule:") ? "Category" : "Rotating";
          const badge = element("span", `fx-row-badge fx-row-badge-${badgeType.toLowerCase()}`, badgeType);
          const label = element("span", "fx-order-label", ((_a2 = options().find(([id]) => id === token)) == null ? void 0 : _a2[1]) || token);
          row.append(badge, label);
          const up = button("\u2191", () => {
            [opening[n - 1], opening[n]] = [opening[n], opening[n - 1]];
            updateOpening();
          });
          up.disabled = n === 0;
          up.setAttribute("aria-label", `Move row ${n + 1} up`);
          const down = button("\u2193", () => {
            [opening[n + 1], opening[n]] = [opening[n], opening[n + 1]];
            updateOpening();
          });
          down.disabled = n === opening.length - 1;
          down.setAttribute("aria-label", `Move row ${n + 1} down`);
          field(row, `Row ${n + 1} artwork`, ((_b2 = profile.layouts) == null ? void 0 : _b2[token]) || "auto", (v) => {
            profile.layouts = { ...profile.layouts, [token]: v };
            profile.opening = [...opening];
          }, layoutChoices);
          const rem = button("Remove", () => {
            if (token.startsWith("anchor:")) profile.anchors = profile.anchors.filter((a) => a !== token.slice(7));
            opening.splice(n, 1);
            updateOpening();
          });
          row.append(up, down, rem);
          rows.append(row);
        });
        openingSec.append(rows);
        const addRow = element("div", "fx-editor-fields fx-add-opening-bar");
        let next = ((_a = options()[0]) == null ? void 0 : _a[0]) || "family:theme";
        field(addRow, "Add opening row", next, (v) => next = v, options());
        addRow.append(button("Add row", () => {
          if (next.startsWith("family:")) profile.families = [.../* @__PURE__ */ new Set([...profile.families, next.slice(7)])];
          opening.push(next);
          updateOpening();
        }));
        openingSec.append(addRow);
        host.append(openingSec);
        const rotSec = element("section", "fx-editor-section");
        rotSec.append(
          element("h3", "", "Automatic rotating shelf pools"),
          element("p", "fx-editor-help", "Toggle which auto-generated shelf families can appear as you scroll (e.g. Directed by X, Starring X, Best of a decade, Studio / network).")
        );
        const rotation = element("div", "fx-editor-fields fx-chip-toggles");
        Object.entries(families).forEach(([key, label]) => field(rotation, label, profile.families.includes(key), (checked) => {
          profile.families = checked ? [.../* @__PURE__ */ new Set([...profile.families, key])] : profile.families.filter((k) => k !== key);
        }, null, "checkbox"));
        rotSec.append(rotation);
        host.append(rotSec);
        const explorerSec = element("section", "fx-editor-section");
        explorerSec.append(
          element("h3", "", "Discover & toggle possible categories"),
          element("p", "fx-editor-help", "Browse directors, actors, studios, release years/decades, genres and tags discovered in your library. Toggle any item on to add it as a dedicated category shelf, or pin it directly to your Opening Rows.")
        );
        const candidates = discoverCandidates();
        const kindTabs = element("div", "fx-explorer-tabs");
        const kindDefs = [
          ["director", "Directed by\u2026"],
          ["actor", "Starring\u2026"],
          ["studio", "From Studio\u2026"],
          ["year", "Years & Decades"],
          ["genre", "Genres"],
          ["tag", "Themes & Tags"]
        ];
        for (const [k, lbl] of kindDefs) {
          const count = candidates.filter((c) => c.kind === k).length;
          const b = button(`${lbl} (${count})`, () => {
            explorerKind = k;
            draw();
          });
          b.className = `fx-subtab-btn ${explorerKind === k ? "is-active" : ""}`.trim();
          kindTabs.append(b);
        }
        const searchBar = element("div", "fx-explorer-search");
        const searchInput = element("input");
        searchInput.type = "search";
        searchInput.placeholder = "Filter possible categories (e.g. Nolan, A24, 2024, Willem Dafoe, anime)\u2026";
        searchInput.value = explorerQuery;
        searchInput.setAttribute("aria-label", "Filter possible categories");
        searchInput.addEventListener("input", () => {
          explorerQuery = searchInput.value;
          renderCandidateGrid();
        });
        searchBar.append(searchInput);
        const candidateGrid = element("div", "fx-candidate-grid");
        function renderCandidateGrid() {
          var _a2;
          candidateGrid.replaceChildren();
          const q = explorerQuery.trim().toLowerCase();
          const filtered = candidates.filter((c) => q ? c.title.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) : c.kind === explorerKind).slice(0, 36);
          if (!filtered.length) {
            candidateGrid.append(element("p", "fx-editor-empty", ((_a2 = inventory == null ? void 0 : inventory.items) == null ? void 0 : _a2.length) ? "No matching library categories found for this filter." : "Open Customize from Home, Movies, or Shows (or wait a moment) to scan library metadata for possible categories."));
            return;
          }
          for (const cand of filtered) {
            const existing = profile.rules.find((r) => r.Key === cand.key || cand.match(r));
            const active = Boolean(existing && existing.Enabled !== false);
            const card = element("div", `fx-candidate-card ${active ? "is-enabled" : ""}`.trim());
            const checkWrap = element("label", "fx-candidate-main");
            const box = element("input");
            box.type = "checkbox";
            box.checked = active;
            box.addEventListener("change", () => {
              const found = profile.rules.find((r) => r.Key === cand.key || cand.match(r));
              if (box.checked) {
                if (found) found.Enabled = true;
                else profile.rules.push(cand.create());
              } else if (found) {
                found.Enabled = false;
              }
              emit();
              draw();
            });
            const textCol = element("div", "fx-candidate-text");
            textCol.append(element("strong", "", cand.title), element("span", "fx-candidate-count", `${cand.count} title${cand.count === 1 ? "" : "s"}`));
            checkWrap.append(box, textCol);
            const pinBtn = button("Pin to top", () => {
              let found = profile.rules.find((r) => r.Key === cand.key || cand.match(r));
              if (!found) {
                found = cand.create();
                profile.rules.push(found);
              }
              found.Enabled = true;
              const token = `rule:${found.Key}`;
              const cur = profile.opening || profile.anchors.flatMap((a) => [`anchor:${a}`, "family:theme"]);
              if (!cur.includes(token)) cur.unshift(token);
              profile.opening = [...cur];
              emit();
              draw();
            });
            pinBtn.className = "fx-btn-mini";
            card.append(checkWrap, pinBtn);
            candidateGrid.append(card);
          }
        }
        renderCandidateGrid();
        explorerSec.append(kindTabs, searchBar, candidateGrid);
        host.append(explorerSec);
        const libSec = element("section", "fx-editor-section");
        libSec.append(
          element("h3", "", "Category library"),
          element("p", "fx-editor-help", "Enable or disable categories, reorder them, pin them to Opening Rows, or craft your own custom categories from directors, actors, studios, years, ratings, runtime, genres and tags.")
        );
        const templateBar = element("div", "fx-template-bar");
        templateBar.append(
          element("span", "fx-template-label", "Quick create:"),
          button("Add category", () => {
            var _a2;
            const key = `category-${hash(String(Date.now()) + profile.rules.length).toString(16)}`;
            profile.rules.push({ Key: key, Title: "New category", Enabled: true, Types: [page === "shows" ? "Series" : "Movie"], GenresAny: [], TagsAny: [], Months: [] });
            editing = key;
            emit();
            draw();
            (_a2 = host.querySelector('[aria-label="Category title"]')) == null ? void 0 : _a2.focus();
          }),
          button("+ Director Spotlight", () => createFromTemplate("director")),
          button("+ Actor Spotlight", () => createFromTemplate("actor")),
          button("+ Studio Collection", () => createFromTemplate("studio")),
          button("+ Year / Era", () => createFromTemplate("year")),
          button("+ Under 100m", () => createFromTemplate("short")),
          button("+ 8.0+ Acclaimed", () => createFromTemplate("acclaimed")),
          button("+ Seasonal", () => createFromTemplate("seasonal")),
          button("Add supplied categories", () => {
            for (const r of supplied.pages[page].rules) {
              if (!profile.rules.some((x) => x.Key === r.Key)) profile.rules.push(cloneJson(r));
            }
            emit();
            draw();
          })
        );
        libSec.append(templateBar);
        const ruleFilterBar = element("div", "fx-library-toolbar");
        const ruleSearch = element("input");
        ruleSearch.type = "search";
        ruleSearch.placeholder = "Search your categories\u2026";
        ruleSearch.value = libraryQuery;
        ruleSearch.setAttribute("aria-label", "Search your categories");
        ruleSearch.addEventListener("input", () => {
          libraryQuery = ruleSearch.value;
          renderRuleList();
        });
        const enableAllBtn = button("Enable all", () => {
          profile.rules.forEach((r) => {
            r.Enabled = true;
          });
          emit();
          draw();
        });
        const disableAllBtn = button("Disable all", () => {
          profile.rules.forEach((r) => {
            r.Enabled = false;
          });
          emit();
          draw();
        });
        ruleFilterBar.append(ruleSearch, enableAllBtn, disableAllBtn);
        libSec.append(ruleFilterBar);
        const ruleFormContainer = element("div", "fx-rule-form-host");
        libSec.append(ruleFormContainer);
        const rules = element("div", "fx-category-list");
        function renderRuleList() {
          rules.replaceChildren();
          const q = libraryQuery.trim().toLowerCase();
          profile.rules.forEach((r, n) => {
            if (q && !r.Title.toLowerCase().includes(q) && !ruleSummary(r).toLowerCase().includes(q)) return;
            const row = element("div", `fx-category-row ${editing === r.Key ? "is-editing" : ""}`.trim());
            const mainInfo = element("div", "fx-category-main");
            field(mainInfo, r.Title, r.Enabled !== false, (v) => {
              r.Enabled = v;
            }, null, "checkbox");
            mainInfo.append(element("span", "fx-category-meta", ruleSummary(r)));
            const actions = element("div", "fx-category-actions");
            const upBtn = button("\u2191", () => {
              if (n > 0) {
                [profile.rules[n - 1], profile.rules[n]] = [profile.rules[n], profile.rules[n - 1]];
                emit();
                draw();
              }
            });
            upBtn.disabled = n === 0;
            upBtn.title = "Move category up";
            const downBtn = button("\u2193", () => {
              if (n < profile.rules.length - 1) {
                [profile.rules[n + 1], profile.rules[n]] = [profile.rules[n], profile.rules[n + 1]];
                emit();
                draw();
              }
            });
            downBtn.disabled = n === profile.rules.length - 1;
            downBtn.title = "Move category down";
            const isPinned = (profile.opening || []).includes(`rule:${r.Key}`);
            const pinBtn = button(isPinned ? "Pinned" : "Pin to top", () => {
              const cur = profile.opening ? [...profile.opening] : profile.anchors.flatMap((a) => [`anchor:${a}`, "family:theme"]);
              const token = `rule:${r.Key}`;
              const idx = cur.indexOf(token);
              if (idx >= 0) cur.splice(idx, 1);
              else cur.unshift(token);
              profile.opening = cur;
              emit();
              draw();
            });
            pinBtn.className = `fx-btn-mini ${isPinned ? "is-pinned" : ""}`.trim();
            const editBtn = button("Edit", () => {
              var _a2;
              editing = r.Key;
              draw();
              (_a2 = host.querySelector('[aria-label="Category title"]')) == null ? void 0 : _a2.focus();
            });
            const delBtn = button("Delete", () => {
              var _a2;
              profile.rules.splice(n, 1);
              profile.opening = (_a2 = profile.opening) == null ? void 0 : _a2.filter((t) => t !== `rule:${r.Key}`);
              if (profile.layouts) delete profile.layouts[`rule:${r.Key}`];
              if (editing === r.Key) editing = null;
              emit();
              draw();
            });
            actions.append(upBtn, downBtn, pinBtn, editBtn, delBtn);
            row.append(mainInfo, actions);
            rules.append(row);
          });
        }
        renderRuleList();
        libSec.append(rules);
        const activeRule = profile.rules.find((r) => r.Key === editing);
        if (activeRule) {
          const form = element("fieldset", "fx-rule-form");
          const liveMatches = countRuleMatches(activeRule);
          form.append(element("legend", "", `Edit category: ${activeRule.Title}${liveMatches !== null ? ` (${liveMatches} matching titles)` : ""}`));
          const grid = element("div", "fx-editor-fields");
          field(grid, "Category title", activeRule.Title, (v) => {
            activeRule.Title = v;
          });
          field(grid, "Media type", activeRule.Types.length === 2 ? "both" : activeRule.Types[0], (v) => activeRule.Types = v === "both" ? ["Movie", "Series"] : [v], [["Movie", "Movies"], ["Series", "Shows"], ["both", "Movies and shows"]]);
          field(grid, "Category artwork", activeRule.Layout || "auto", (v) => activeRule.Layout = v, layoutChoices);
          field(grid, "Minimum community rating", activeRule.MinRating, (v) => activeRule.MinRating = v === "" ? null : Number(v), null, "number");
          field(grid, "Under minutes", activeRule.MaxMinutes, (v) => activeRule.MaxMinutes = v === "" ? null : Number(v), null, "number");
          field(grid, "Scheduled months", (activeRule.Months || []).join(", "), (v) => activeRule.Months = v.split(",").map((x) => x.trim()).filter(Boolean).map(Number));
          field(grid, "From year", (_b = activeRule.Years) == null ? void 0 : _b[0], (v) => {
            var _a2, _b2, _c2;
            activeRule.Years = v === "" && !((_a2 = activeRule.Years) == null ? void 0 : _a2[1]) ? null : [v === "" ? 0 : Number(v), (_c2 = (_b2 = activeRule.Years) == null ? void 0 : _b2[1]) != null ? _c2 : 9999];
          }, null, "number");
          field(grid, "Through year", (_c = activeRule.Years) == null ? void 0 : _c[1], (v) => {
            var _a2, _b2, _c2;
            activeRule.Years = v === "" && !((_a2 = activeRule.Years) == null ? void 0 : _a2[0]) ? null : [(_c2 = (_b2 = activeRule.Years) == null ? void 0 : _b2[0]) != null ? _c2 : 0, v === "" ? 9999 : Number(v)];
          }, null, "number");
          form.append(grid);
          const metaGrid = element("div", "fx-editor-meta-grid");
          for (const [key, label, hint] of [
            ["GenresAny", "Genres", "e.g. Action, Sci-Fi, Horror"],
            ["TagsAny", "Tags", "e.g. superhero, anime, space"],
            ["DirectorsAny", "Directors", "e.g. Christopher Nolan, Denis Villeneuve"],
            ["ActorsAny", "Cast", "e.g. Willem Dafoe, Christian Bale"],
            ["StudiosAny", "Studios", "e.g. A24, Marvel Studios, Pixar"]
          ]) {
            const col = element("div", "fx-meta-col");
            const control = field(col, label, (activeRule[key] || []).join(", "), (v) => {
              activeRule[key] = v.split(",").map((x) => x.trim()).filter(Boolean);
            });
            control.placeholder = hint || "Comma-separated names";
            const vals = uniqueValues(key);
            if (vals.length) {
              const list = element("datalist");
              list.id = `fx-values-${key}`;
              vals.slice(0, 250).forEach((v) => {
                const o = element("option");
                o.value = v;
                list.append(o);
              });
              control.setAttribute("list", list.id);
              col.append(list);
              const picks = element("div", "fx-quick-picks");
              vals.slice(0, 10).forEach((v) => {
                const active = (activeRule[key] || []).some((x) => x.toLowerCase() === v.toLowerCase());
                const chip = button(active ? `\u2713 ${v}` : `+ ${v}`, () => {
                  const cur = activeRule[key] || [];
                  const idx = cur.findIndex((x) => x.toLowerCase() === v.toLowerCase());
                  if (idx >= 0) cur.splice(idx, 1);
                  else cur.push(v);
                  activeRule[key] = [...cur];
                  emit();
                  draw();
                });
                chip.className = `fx-pick-chip ${active ? "is-selected" : ""}`.trim();
                picks.append(chip);
              });
              col.append(picks);
            }
            metaGrid.append(col);
          }
          form.append(metaGrid);
          form.append(element("p", "fx-editor-help", "Months: blank = all year; 10 = October; 12 = December. Names match ignoring case. Each populated filter group must match; comma-separated values within a field act as OR alternatives."));
          const formActions = element("div", "fx-rule-form-actions");
          formActions.append(button("Done editing", () => {
            editing = null;
            emit();
            draw();
          }));
          form.append(formActions);
          ruleFormContainer.append(form);
        }
        host.append(libSec);
      }
      draw();
      return {
        setConfig(config) {
          draft = cloneJson(config);
          editing = null;
          draw();
        },
        setInventory(inv) {
          inventory = inv;
          draw();
        },
        getConfig() {
          return cloneJson(draft);
        }
      };
    }
    function bootDiscovery(DEFAULT_CONFIG2, DISCOVERY_CSS2) {
      var _a, _b, _c, _d, _e;
      const VERSION = "0.4.1";
      if (((_a = window.FazFortDiscovery) == null ? void 0 : _a.version) === VERSION) return;
      (_c = (_b = window.FazFortDiscovery) == null ? void 0 : _b.stop) == null ? void 0 : _c.call(_b);
      (_e = (_d = window.FazFortHomeFeed) == null ? void 0 : _d.stop) == null ? void 0 : _e.call(_d);
      let state = null, generation = 0, observer, timer, heartbeat, stopped = false;
      const snapshots = /* @__PURE__ */ new Map();
      const savedFeeds = /* @__PURE__ */ new Map();
      let activeDialog = null, lastScope = "", selectHold = null;
      const element = (tag, cls, text) => {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
      };
      const button = (text, action) => {
        const b = element("button", "", text);
        b.type = "button";
        b.addEventListener("click", action);
        return b;
      };
      const scopeKey = (api) => {
        var _a2;
        return `${((_a2 = api.serverId) == null ? void 0 : _a2.call(api)) || location.origin}:${api.getCurrentUserId()}`;
      };
      const configKey = (api) => `fazfort-discovery:config:v1:${scopeKey(api)}`;
      const prefKey = (api, page) => `fazfort-discovery:view:${scopeKey(api)}:${page}`;
      function readConfig(api) {
        try {
          const raw = localStorage.getItem(configKey(api));
          return validateConfig(raw ? JSON.parse(raw) : cloneJson(DEFAULT_CONFIG2));
        } catch {
          throw Error("Saved discovery rules are invalid. Open Customize to repair them, or reset to the supplied rules.");
        }
      }
      function closeDialog() {
        var _a2;
        if (!activeDialog) return;
        const { dialog, overlay, previous } = activeDialog;
        activeDialog = null;
        if (typeof dialog.close === "function") {
          try {
            dialog.close();
          } catch {
          }
        }
        overlay.remove();
        if (previous == null ? void 0 : previous.isConnected) (_a2 = previous.focus) == null ? void 0 : _a2.call(previous, { preventScroll: true });
      }
      function openDialog(dialog) {
        var _a2, _b2;
        closeDialog();
        const previous = document.activeElement;
        const overlay = element("div", "fx-dialog-overlay");
        overlay.append(dialog);
        document.body.append(overlay);
        activeDialog = { dialog, overlay, previous };
        dialog.setAttribute("aria-modal", "true");
        dialog.setAttribute("role", "dialog");
        dialog.addEventListener("cancel", (event) => {
          event.preventDefault();
          closeDialog();
        });
        try {
          if (typeof dialog.showModal !== "function") throw Error();
          dialog.showModal();
        } catch {
          dialog.setAttribute("open", "");
          dialog.classList.add("fx-dialog-fallback");
        }
        (_b2 = (_a2 = dialog.querySelector("button,input,select,textarea,a[href]") || dialog).focus) == null ? void 0 : _b2.call(_a2);
      }
      function controlsMode(s) {
        let mode = "auto";
        try {
          mode = localStorage.getItem(`fazfort-discovery:controls:${s.scope}`) || "auto";
        } catch {
        }
        const automatic = document.documentElement.classList.contains("layout-tv") || document.body.classList.contains("layout-tv") || /Tizen|SmartTV|TV Bro|Android TV|GoogleTV/i.test(typeof navigator === "object" ? navigator.userAgent || "" : "");
        return { mode, tv: mode === "tv" || mode === "auto" && automatic };
      }
      function controlToggle(s, b) {
        const current = controlsMode(s).mode, modes = ["auto", "tv", "touch"];
        const next = modes[(modes.indexOf(current) + 1) % modes.length];
        try {
          localStorage.setItem(`fazfort-discovery:controls:${s.scope}`, next);
        } catch {
        }
        b.textContent = `Controls: ${next}`;
        s.root.classList.toggle("fx-tv", controlsMode(s).tv);
      }
      function focusNode(node) {
        var _a2, _b2;
        if (!node) return;
        (_a2 = node.focus) == null ? void 0 : _a2.call(node, { preventScroll: true });
        (_b2 = node.scrollIntoView) == null ? void 0 : _b2.call(node, { block: "nearest", inline: "nearest", behavior: "auto" });
      }
      function moreLikeThis(item, s) {
        const source = s.inventory.items.find((i) => i.Id === item.Id) || item;
        const base = s.config.hideWatched && s.filters.watched === "all" ? s.inventory.items.filter((i) => {
          var _a2;
          return !((_a2 = i.UserData) == null ? void 0 : _a2.Played);
        }) : s.inventory.items;
        const pool = filterItems(base, s.filters, s.tracking);
        const recommendations = similarItems(source, pool, 24);
        const dialog = element("dialog", "fx-dialog fx-similar");
        dialog.setAttribute("aria-label", `More like ${source.Name}`);
        dialog.append(element("h2", "", `More like ${source.Name}`), button("Close", closeDialog));
        const info = element("p", "", "Matches use shared tags, genres, directors and cast in your accessible library. Active filters also apply.");
        dialog.append(info);
        if (!recommendations.length) dialog.append(element("p", "", "No matching titles with these filters. Clear a filter or add more library metadata."));
        const grid = element("div", "fx-similar-grid");
        recommendations.forEach((r) => {
          const entry = element("div", "fx-similar-entry");
          entry.append(renderCard(r.item, s, false), element("p", "fx-match-reason", r.reason));
          grid.append(entry);
        });
        dialog.append(grid);
        openDialog(dialog);
      }
      function safeUrl(value, base = location.href) {
        try {
          const url = new URL(value, base);
          return ["http:", "https:"].includes(url.protocol) ? url.href : "";
        } catch {
          return "";
        }
      }
      function imageChoices(item, api, layout = "landscape") {
        var _a2, _b2, _c2, _d2, _e2;
        const results = [];
        const add = (id, type, tag, poster = false) => {
          if (!id || !tag) return;
          const url = safeUrl(api.getImageUrl(id, { type, tag, maxWidth: 700, quality: 88, ...type === "Backdrop" ? { index: 0 } : {} }));
          if (url) results.push({ url, poster });
        };
        add(item.Id, "Thumb", (_a2 = item.ImageTags) == null ? void 0 : _a2.Thumb);
        add(item.Id, "Backdrop", (_b2 = item.BackdropImageTags) == null ? void 0 : _b2[0]);
        add(item.ParentBackdropItemId || item.SeriesId, "Backdrop", (_c2 = item.ParentBackdropImageTags) == null ? void 0 : _c2[0]);
        add(item.Id, "Primary", (_d2 = item.ImageTags) == null ? void 0 : _d2.Primary, true);
        add(item.SeriesId, "Primary", item.SeriesPrimaryImageTag, true);
        if ((_e2 = item.ProviderIds) == null ? void 0 : _e2.JellyseerrPoster) {
          const raw = item.ProviderIds.JellyseerrPoster;
          const url = safeUrl(/^https?:/i.test(raw) ? raw : api.getUrl(raw));
          if (url) results.push({ url, poster: true });
        }
        return layout === "portrait" ? results.filter((c) => c.poster) : results;
      }
      function itemHref(item, api) {
        var _a2, _b2, _c2, _d2;
        if (((_a2 = item.ProviderIds) == null ? void 0 : _a2.JellyseerrRoot) && ((_b2 = item.ProviderIds) == null ? void 0 : _b2.Jellyseerr) && ["movie", "tv"].includes(item.SourceType)) {
          if (window.JellyfinRequestHub) return `#/home?requesthub=discover&mediaType=${item.SourceType}&mediaId=${encodeURIComponent(item.ProviderIds.Jellyseerr)}`;
          return safeUrl(`${item.ProviderIds.JellyseerrRoot.replace(/\/$/, "")}/${item.SourceType}/${encodeURIComponent(item.ProviderIds.Jellyseerr)}`);
        }
        const q = new URLSearchParams({ id: item.ResumeItemId || item.Id || "", serverId: ((_c2 = api.serverId) == null ? void 0 : _c2.call(api)) || "" });
        if (item.CollectionType) {
          const page = item.CollectionType === "movies" ? "movies" : item.CollectionType === "tvshows" ? "tv" : "list";
          return `#/${page}?${new URLSearchParams({ topParentId: item.Id, collectionType: item.CollectionType, serverId: ((_d2 = api.serverId) == null ? void 0 : _d2.call(api)) || "" })}`;
        }
        return item.Id ? `#/details?${q}` : "";
      }
      function renderCard(item, s, withSimilar = true, layout = "landscape") {
        var _a2, _b2;
        const card = element("a", "fx-card");
        card.href = itemHref(item, s.api) || "#";
        card.dataset.itemId = item.Id || "";
        card.addEventListener("click", () => {
          s.lastFocus = { row: s.slots.findIndex((slot) => slot.node.contains(card)), id: item.Id };
          saveFeed(s);
          if (activeDialog) closeDialog();
        });
        if (/^https?:/i.test(card.getAttribute("href"))) card.rel = "noopener noreferrer";
        const name = item.Type === "Episode" ? `${item.SeriesName || item.Name} \xB7 ${item.Name}` : item.Name || "Untitled";
        const visual = element("div", "fx-card-visual");
        const placeholder = element("span", "fx-placeholder", name);
        visual.append(placeholder);
        const choices = imageChoices(item, s.api, layout);
        if (choices.length) {
          const img = element("img");
          img.alt = "";
          img.loading = "lazy";
          img.decoding = "async";
          let index = 0;
          const use = () => {
            const choice = choices[index++];
            img.className = choice.poster ? "fx-poster" : "";
            img.src = choice.url;
          };
          img.addEventListener("load", () => {
            placeholder.hidden = true;
          });
          img.addEventListener("error", () => {
            if (index < choices.length) use();
            else {
              img.remove();
              placeholder.hidden = false;
            }
          });
          use();
          visual.append(img);
        }
        const percent = Math.max(0, Math.min(100, Number(((_a2 = item.UserData) == null ? void 0 : _a2.PlayedPercentage) || (item.RunTimeTicks ? 100 * (((_b2 = item.UserData) == null ? void 0 : _b2.PlaybackPositionTicks) || 0) / item.RunTimeTicks : 0))));
        if (percent > 0 && percent < 100) {
          const progress = element("div", "fx-progress");
          const fill = element("span");
          fill.style.width = percent + "%";
          progress.append(fill);
          visual.append(progress);
        }
        const badge = badgeFor(item, s.badges, s.now, s.tracking);
        if (badge) visual.append(element("span", "fx-badge", badge));
        card.append(visual, element("span", "fx-name", name));
        card.title = name;
        const entry = element("div", `fx-card-entry fx-card-${layout}`);
        entry.append(card);
        if (withSimilar && ["Movie", "Series"].includes(item.Type) && s.inventory.items.some((i) => i.Id === item.Id)) {
          const more = button("\u22EF", () => moreLikeThis(item, s));
          more.className = "fx-card-more";
          more.title = "More like this";
          more.setAttribute("aria-label", `More like ${name}`);
          entry.append(more);
          card.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            moreLikeThis(item, s);
          });
        }
        return entry;
      }
      function fillSlot(slot, s) {
        var _a2;
        const row = slot.data;
        slot.node.replaceChildren();
        slot.node.className = "fx-shelf";
        slot.node.style.height = "";
        const head = element("div", "fx-row-head"), title = element("h2", "", row.title), track = element("div", "fx-track");
        const baseCount = row.items.length;
        const copies = row.key !== "MyMedia" && baseCount >= 2 ? Math.max(4, Math.ceil(20 / baseCount)) : 1;
        const cycleWidth = () => {
          if (copies <= 1) return 0;
          const first = track.children[0], secondCycle = track.children[baseCount];
          return first && secondCycle && typeof secondCycle.offsetLeft === "number" && secondCycle.offsetLeft > first.offsetLeft ? secondCycle.offsetLeft - first.offsetLeft : 0;
        };
        const normalizeLoop = () => {
          const cw = cycleWidth();
          if (!cw) return;
          while (track.scrollLeft >= cw * 2) track.scrollLeft -= cw;
          if (track.scrollLeft <= 2 && track._fxMoved) track.scrollLeft += cw;
        };
        const scroll = (direction) => {
          const cw = cycleWidth(), step = Math.max(250, track.clientWidth * 0.85);
          if (cw > 0) {
            if (direction > 0) {
              while (track.scrollLeft >= cw * 2) track.scrollLeft -= cw;
              track._fxMoved = true;
              track.scrollBy({ left: step, behavior: "smooth" });
            } else {
              if (track.scrollLeft < step) track.scrollLeft += cw;
              track._fxMoved = true;
              track.scrollBy({ left: -step, behavior: "smooth" });
            }
            return;
          }
          const end = Math.max(0, track.scrollWidth - track.clientWidth);
          if (direction > 0 && track.scrollLeft >= end - 2) track.scrollLeft = 0;
          else if (direction < 0 && track.scrollLeft <= 2) track.scrollLeft = end;
          else track.scrollBy({ left: direction * step, behavior: "smooth" });
        };
        track.addEventListener("scroll", () => {
          if (track.scrollLeft > 12) track._fxMoved = true;
          normalizeLoop();
        }, { passive: true });
        track.addEventListener("wheel", (e) => {
          if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
          const cw = cycleWidth();
          if (cw > 0) {
            if (e.deltaX < 0 && track.scrollLeft <= 12) {
              track.scrollLeft += cw;
              track._fxMoved = true;
            } else if (e.deltaX > 0 && track.scrollLeft >= cw * (copies - 1.5)) {
              track.scrollLeft -= cw;
              track._fxMoved = true;
            }
            return;
          }
          const end = track.scrollWidth - track.clientWidth;
          if (end > 0 && (e.deltaX > 0 && track.scrollLeft >= end - 2 || e.deltaX < 0 && track.scrollLeft <= 2)) {
            e.preventDefault();
            scroll(e.deltaX > 0 ? 1 : -1);
          }
        }, { passive: false });
        let touchX;
        track.addEventListener("touchstart", (e) => {
          var _a3;
          touchX = (_a3 = e.touches[0]) == null ? void 0 : _a3.clientX;
          const cw = cycleWidth();
          if (cw > 0 && track.scrollLeft <= 12) {
            track.scrollLeft += cw;
            track._fxMoved = true;
          }
        }, { passive: true });
        track.addEventListener("touchend", (e) => {
          var _a3;
          const delta = touchX - ((_a3 = e.changedTouches[0]) == null ? void 0 : _a3.clientX);
          if (Math.abs(delta) > 40) {
            const cw = cycleWidth();
            if (cw > 0) {
              normalizeLoop();
              return;
            }
            const end = track.scrollWidth - track.clientWidth;
            if (end > 0 && (delta > 0 && track.scrollLeft >= end - 2 || delta < 0 && track.scrollLeft <= 2)) scroll(delta > 0 ? 1 : -1);
          }
        }, { passive: true });
        const back = button("\u2039", () => scroll(-1)), forward = button("\u203A", () => scroll(1));
        back.setAttribute("aria-label", `Previous ${row.title}`);
        forward.setAttribute("aria-label", `More ${row.title}`);
        const token = row.family === "anchor" ? `anchor:${row.key}` : row.family === "theme" ? row.key : `family:${row.family}`;
        const requested = ((_a2 = s.profile.layouts) == null ? void 0 : _a2[token]) || row.layout || "auto";
        const portraitOnly = row.key !== "MyMedia" && row.items.filter((i) => {
          var _a3, _b2, _c2, _d2, _e2;
          return !((_a3 = i.ImageTags) == null ? void 0 : _a3.Thumb) && !((_b2 = i.BackdropImageTags) == null ? void 0 : _b2.length) && !((_c2 = i.ParentBackdropImageTags) == null ? void 0 : _c2.length) && (((_d2 = i.ImageTags) == null ? void 0 : _d2.Primary) || ((_e2 = i.ProviderIds) == null ? void 0 : _e2.JellyseerrPoster)) && (!i.PrimaryImageAspectRatio || i.PrimaryImageAspectRatio < 1);
        }).length > row.items.length / 2;
        const layout = requested === "auto" ? row.external || row.key === "DiscoverMovies" || row.key === "DiscoverTV" || portraitOnly ? "portrait" : "landscape" : requested;
        slot.node.dataset.layout = layout;
        head.append(title, back, forward);
        for (let copy = 0; copy < copies; copy++) {
          row.items.forEach((item) => {
            const cardNode = renderCard(item, s, true, layout);
            if (copy > 0) cardNode.dataset.loopClone = String(copy);
            track.append(cardNode);
          });
        }
        slot.node.append(head, track);
        slot.live = true;
      }
      function virtualize(s) {
        if (state !== s || !s.root.isConnected || s.full) return;
        const center = innerHeight / 2;
        const ranked = s.slots.map((slot) => ({ slot, distance: Math.abs((slot.node.getBoundingClientRect().top + slot.node.getBoundingClientRect().bottom) / 2 - center) })).sort((a, b) => a.distance - b.distance);
        const keep = new Set(ranked.slice(0, s.config.maxLiveRows).map((x) => x.slot));
        for (const slot of s.slots) {
          if (keep.has(slot) && !slot.live) fillSlot(slot, s);
          else if (!keep.has(slot) && slot.live && !slot.node.contains(document.activeElement)) {
            const height = slot.node.getBoundingClientRect().height;
            if (height <= 0) continue;
            slot.node.style.height = `${height}px`;
            slot.node.replaceChildren();
            slot.node.className = "fx-shelf fx-placeholder-row";
            slot.live = false;
          }
        }
      }
      function appendRow(row, s) {
        const slot = { node: element("section", "fx-shelf"), data: row, live: false };
        slot.node.dataset.shelfKey = row.key;
        s.list.append(slot.node);
        s.slots.push(slot);
        fillSlot(slot, s);
      }
      function filterPanel(s) {
        s.panel.replaceChildren();
        const field = (label, name, values2) => {
          const wrap = element("label", "fx-filter-field", label), input = element("select");
          input.setAttribute("aria-label", label);
          values2.forEach(([value, title]) => {
            const option = element("option", "", title);
            option.value = value;
            option.selected = value === s.filters[name];
            input.append(option);
          });
          input.addEventListener("change", () => {
            s.filters[name] = input.value;
            applyFilters(s);
          });
          wrap.append(input);
          s.panel.append(wrap);
        };
        const queryWrap = element("label", "fx-filter-field", "Title or person"), query = element("input");
        query.type = "search";
        query.placeholder = "Search this library";
        query.value = s.filters.query;
        query.addEventListener("input", () => {
          clearTimeout(s.filterTimer);
          s.filterTimer = setTimeout(() => {
            if (state === s) {
              s.filters.query = query.value;
              applyFilters(s);
            }
          }, 200);
        });
        queryWrap.append(query);
        s.panel.append(queryWrap);
        const values = (key) => [...new Set(s.inventory.items.flatMap((i) => i[key] || []))].sort((a, b) => a.localeCompare(b)).map((v) => [v, v]);
        field("Genre", "genre", [["", "Any genre"], ...values("Genres")]);
        field("Theme / tag", "tag", [["", "Any tag"], ...values("Tags")]);
        field("Watch status", "watched", [["all", "All titles"], ["unwatched", "Unwatched"], ["watched", "Watched"]]);
        if (s.route.page !== "shows") field("Movie runtime", "maxMinutes", [["", "Any runtime"], ["90", "Under 90 minutes"], ["120", "Under two hours"], ["180", "Under three hours"]]);
        field("Rating", "minRating", [["", "Any rating"], ["7", "7+"], ["8", "8+"], ["9", "9+"]]);
        const decades = [...new Set(s.inventory.items.filter((i) => i.ProductionYear).map((i) => Math.floor(i.ProductionYear / 10) * 10))].sort((a, b) => b - a);
        field("Decade", "decade", [["", "Any decade"], ...decades.map((d) => [String(d), `${d}s`])]);
        if (s.route.page === "home") field("Type", "type", [["", "Movies & shows"], ["Movie", "Movies"], ["Series", "Shows"]]);
        field("Sort", "sort", [["recommended", "Curated shelves"], ["title", "Title"], ["rating", "Highest rated"], ["year", "Newest release year"], ["added", "Tracked additions"]]);
        s.panel.append(button("Clear filters", () => {
          s.filters = cloneJson(DEFAULT_FILTERS);
          filterPanel(s);
          applyFilters(s);
        }));
      }
      function preparePlanner(s) {
        const items = filterItems(s.inventory.items, s.filters, s.tracking);
        s.planner = new FeedPlanner(buildShelves(items, s.profile, s.config, s.route.page, s.now), s.config, `${s.scope}:${dayInZone(s.now, s.config.timeZone)}:${s.route.page}:${s.shuffle}`);
        s.filteredQueue = s.route.view === "genres" ? s.planner.shelves.filter((r) => r.family === "genre" && r.key !== "genre:explore").sort((a, b) => a.title.localeCompare(b.title)) : null;
        if (filtersActive(s.filters) || s.filters.sort !== "recommended") {
          s.filteredQueue = [];
          for (let n = 0; n < items.length; n += s.config.cardsPerShelf) s.filteredQueue.push({ key: `filtered:${n}`, title: `Matches ${n + 1}\u2013${Math.min(n + s.config.cardsPerShelf, items.length)} of ${items.length}`, family: "filtered", items: items.slice(n, n + s.config.cardsPerShelf) });
        }
        s.matchCount.textContent = s.filteredQueue && s.route.view !== "genres" ? `${items.length} matching titles` : "";
      }
      function applyFilters(s) {
        if (state !== s || s.loading) {
          s.filterPending = true;
          return;
        }
        s.filterPending = false;
        s.finished = false;
        s.pending = null;
        s.pauseAutomatic = false;
        s.anchorIndex = 0;
        s.openingIndex = 0;
        s.anchorTurn = true;
        s.slots = [];
        s.list.replaceChildren();
        s.more.hidden = false;
        preparePlanner(s);
        loadMore(s);
      }
      function findScrollRoot(node) {
        for (let current = node == null ? void 0 : node.parentElement; current && current !== document.body; current = current.parentElement) {
          const style = getComputedStyle(current);
          if (/auto|scroll/.test(style.overflowY || "") && current.scrollHeight > current.clientHeight) return current;
        }
        return document.scrollingElement || document.documentElement;
      }
      function saveFeed(s) {
        var _a2;
        if (!s.inventory || !s.config || !s.planner) return;
        const root = findScrollRoot(s.root);
        savedFeeds.set(s.key, { config: JSON.stringify(s.config), inventory: s.inventory, tracking: s.tracking, filters: cloneJson(s.filters), planner: s.planner, pending: s.pending, filteredQueue: ((_a2 = s.filteredQueue) == null ? void 0 : _a2.slice()) || null, rows: s.slots.map((slot) => slot.data), openingIndex: s.openingIndex || 0, anchorIndex: s.anchorIndex, anchorTurn: s.anchorTurn, finished: s.finished, shuffle: s.shuffle, focus: s.lastFocus, scrollTop: root.scrollTop || 0, tracks: s.slots.map((slot) => {
          var _a3;
          return ((_a3 = slot.node.querySelector(".fx-track")) == null ? void 0 : _a3.scrollLeft) || 0;
        }), at: Date.now() });
        if (savedFeeds.size > 6) savedFeeds.delete(savedFeeds.keys().next().value);
      }
      function restoreFeed(s, saved) {
        var _a2;
        s.filters = cloneJson(saved.filters);
        s.planner = saved.planner;
        s.pending = saved.pending;
        s.filteredQueue = ((_a2 = saved.filteredQueue) == null ? void 0 : _a2.slice()) || null;
        s.openingIndex = saved.openingIndex || 0;
        s.anchorIndex = saved.anchorIndex;
        s.anchorTurn = saved.anchorTurn;
        s.finished = saved.finished;
        s.shuffle = saved.shuffle;
        s.lastFocus = saved.focus;
        saved.rows.forEach((row) => appendRow(row, s));
        s.more.hidden = s.finished;
        s.more.disabled = false;
        s.matchCount.textContent = s.filteredQueue ? `${filterItems(s.inventory.items, s.filters, s.tracking).length} matching titles` : "";
        s.note.textContent = s.finished ? "You\u2019ve reached the available matches." : "More shelves load as you scroll.";
        setMode(s, s.full, false);
        filterPanel(s);
        requestAnimationFrame(() => {
          var _a3, _b2;
          if (state !== s || !s.root.isConnected) return;
          const root = findScrollRoot(s.root);
          root.scrollTop = saved.scrollTop;
          s.slots.forEach((slot2, n) => {
            const track = slot2.node.querySelector(".fx-track");
            if (track) track.scrollLeft = saved.tracks[n] || 0;
          });
          const slot = s.slots[(_a3 = saved.focus) == null ? void 0 : _a3.row];
          if (slot) {
            const card = [...slot.node.querySelectorAll(".fx-card")].find((c) => c.dataset.itemId === saved.focus.id);
            (_b2 = card == null ? void 0 : card.focus) == null ? void 0 : _b2.call(card, { preventScroll: true });
          }
          virtualize(s);
        });
      }
      function syncNative(s, hide) {
        s.native.removeAttribute("data-fx-native-hidden");
        s.native.querySelectorAll("[data-fx-native-hidden]").forEach((n) => n.removeAttribute("data-fx-native-hidden"));
        s.native.removeAttribute("data-fx-hero-anchor");
        if (!hide) return;
        if (s.route.page !== "home") {
          s.native.setAttribute("data-fx-native-hidden", "true");
          return;
        }
        s.native.dataset.fxHeroAnchor = "true";
        const protect = ".sleekfin-hero,.hero,#slides-container";
        const walk = (parent) => [...parent.children].forEach((node) => {
          if (node.matches(protect) || node.closest(".fx-discovery")) return;
          if (node.matches(".sections") || node.querySelector(`${protect},.sections`)) walk(node);
          else node.setAttribute("data-fx-native-hidden", "true");
        });
        walk(s.native);
      }
      function setMode(s, full, remember = true) {
        s.full = full;
        s.list.hidden = full;
        s.footer.hidden = full;
        s.filterToggle.disabled = full || !s.inventory;
        s.matchCount.hidden = full;
        if (full) s.panel.hidden = true;
        s.toggle.textContent = full ? "Discover shelves" : s.route.page === "home" ? "Normal home" : "Full library";
        syncNative(s, !(full || s.failed));
        if (remember) {
          try {
            localStorage.setItem(prefKey(s.api, s.route.page), full ? "native" : "discover");
          } catch {
            s.status.textContent = "View preference could not be saved in this browser.";
          }
        }
        if (!s.started) initialize(s);
        else if (!full && s.planner && !s.slots.length) loadMore(s);
        if (!full) scheduleScroll();
      }
      async function nextRow(s) {
        if (s.filteredQueue) return s.filteredQueue.shift() || null;
        const opening = s.profile.opening || [];
        while ((s.openingIndex || 0) < opening.length) {
          const token = opening[s.openingIndex || 0];
          s.openingIndex = (s.openingIndex || 0) + 1;
          if (token.startsWith("anchor:")) {
            const id = token.slice(7);
            try {
              const row = await s.client.anchor(id, s.route, s.inventory, s.config);
              if (row.items.length) return row;
            } catch {
              s.client.assertCurrent();
              s.warnings.add(`Couldn't load ${id}.`);
            }
          } else {
            const row = token.startsWith("rule:") ? s.planner.take(token) : s.planner.shelves.some((r) => r.family === token.slice(7)) ? s.planner.next(token.slice(7)) : null;
            if (row) return row;
          }
        }
        while (s.anchorIndex < s.profile.anchors.length || s.planner.shelves.length) {
          if (s.anchorTurn && s.anchorIndex < s.profile.anchors.length) {
            const id = s.profile.anchors[s.anchorIndex++];
            if (opening.includes(`anchor:${id}`)) continue;
            s.anchorTurn = false;
            try {
              const row = await s.client.anchor(id, s.route, s.inventory, s.config);
              if (row.items.length) return row;
            } catch {
              s.client.assertCurrent();
              s.warnings.add(`Couldn't load ${id}. Check HSS/Jellyseerr, then restart this feed.`);
            }
          } else {
            s.anchorTurn = true;
            const row = s.planner.next(s.anchorIndex <= s.profile.anchors.length && s.anchorIndex > 0 && s.slots.length < s.profile.anchors.length * 2 ? "theme" : null);
            if (row) return row;
            if (s.anchorIndex >= s.profile.anchors.length) return null;
          }
        }
        return null;
      }
      async function loadMore(s, automatic = false) {
        if (state !== s || s.loading || s.full || s.finished || !s.planner || automatic && s.pauseAutomatic) return;
        s.loading = true;
        s.more.disabled = true;
        s.more.textContent = "Loading\u2026";
        try {
          for (let n = 0; n < s.config.batchSize; n++) {
            const row = s.pending || await nextRow(s);
            if (!row) {
              s.finished = true;
              break;
            }
            s.pending = row;
            const items = row.key === "MyMedia" || row.external || row.key === "ContinueWatchingNextUp" ? row.items : await s.client.hydrate(row.items);
            s.client.assertCurrent();
            if (state !== s) return;
            if (items.length) {
              appendRow({ ...row, items }, s);
              if (s.slots.length === 1 && !s.full) {
                s.failed = false;
                syncNative(s, true);
              }
            }
            s.pending = null;
          }
          s.status.textContent = [...s.warnings].join(" ");
          s.pauseAutomatic = false;
          if ((s.slots.length || s.filteredQueue) && !s.full) {
            s.failed = false;
            setMode(s, false, false);
          }
          if (!s.slots.length) {
            if (!s.filteredQueue) {
              s.failed = true;
              syncNative(s, false);
            }
            s.status.textContent = s.filteredQueue ? "No matching titles. Clear a filter to broaden your search." : "No matching shelves. The normal Jellyfin view is still available. Try fewer filters in Customize.";
          }
          s.more.hidden = s.finished;
          s.note.textContent = s.finished ? "You\u2019ve reached the available matches. Clear filters or use Restart feed to explore again." : s.filteredQueue ? "Filtered results load as you scroll." : "Keeps browsing your library; titles can return in different shelves further down.";
          virtualize(s);
        } catch {
          if (state === s) {
            s.pauseAutomatic = true;
            s.status.textContent = "Could not load the next shelves. Your existing rows are intact. Use Try again or the normal view.";
          }
        } finally {
          s.loading = false;
          if (state === s) {
            s.more.disabled = false;
            s.more.textContent = s.pauseAutomatic ? "Try again" : "Load more";
          }
          if (state === s && s.filterPending) applyFilters(s);
        }
      }
      function findCachedInventory(scope, route) {
        const exactKey = `${scope}:${route.page}:${route.parentId}`;
        const exact = snapshots.get(exactKey);
        if (exact && Date.now() - exact.at < 5 * 6e4) return exact.value;
        if (!route.parentId && (route.page === "movies" || route.page === "shows")) {
          const homeSnap = snapshots.get(`${scope}:home:`);
          if (homeSnap && Date.now() - homeSnap.at < 5 * 6e4) {
            const wantType = route.page === "movies" ? "Movie" : "Series";
            return {
              items: homeSnap.value.items.filter((i) => i.Type === wantType),
              seasons: route.page === "shows" ? homeSnap.value.seasons : []
            };
          }
        }
        return null;
      }
      async function initialize(s) {
        if (s.started) return;
        s.started = true;
        s.status.textContent = "Reading library metadata\u2026";
        try {
          let localError;
          try {
            s.config = readConfig(s.api);
          } catch (e) {
            localError = e;
          }
          const cacheKey = `${s.scope}:${s.route.page}:${s.route.parentId}`;
          const cachedInv = findCachedInventory(s.scope, s.route);
          const prefPromise = s.client.preferences().then((profile) => ({ ok: true, profile })).catch(() => ({ ok: false }));
          const invPromise = cachedInv ? Promise.resolve(cachedInv) : s.client.inventory(s.route, (count, seasons) => {
            if (state === s) s.status.textContent = `Reading metadata: ${count} movies/shows, ${seasons} seasons\u2026`;
          });
          const [prefRes, inv] = await Promise.all([prefPromise, invPromise]);
          s.client.assertCurrent();
          if (prefRes.ok) {
            s.profileVersion = prefRes.profile.version;
            s.syncAvailable = true;
            if (prefRes.profile.config) {
              s.config = validateConfig(prefRes.profile.config);
              try {
                localStorage.setItem(configKey(s.api), JSON.stringify(s.config));
              } catch {
              }
            }
          } else {
            s.syncAvailable = false;
          }
          if (!s.config) throw localError || Error("No valid discovery configuration.");
          s.profile = s.config.pages[s.route.page];
          s.inventory = inv;
          snapshots.set(cacheKey, { at: Date.now(), value: s.inventory });
          if (snapshots.size > 6) snapshots.delete(snapshots.keys().next().value);
          s.badges = seasonBadges(s.inventory.seasons, s.now);
          s.tracking = /* @__PURE__ */ new Map();
          try {
            const arrival = await s.client.tracking(s.inventory.items);
            s.tracking = arrival.records;
            s.trackingReady = arrival.ready;
          } catch {
            s.client.assertCurrent();
            s.trackingReady = false;
            s.warnings.add("Arrival badges are unavailable until the Discovery Companion is installed and its baseline is ready.");
          }
          s.inventory.tracking = s.tracking;
          s.byId = new Map(s.inventory.items.map((i) => [i.Id, i]));
          s.filterToggle.disabled = s.full;
          const saved = savedFeeds.get(s.key);
          if (saved && Date.now() - saved.at < 30 * 6e4 && saved.config === JSON.stringify(s.config)) {
            restoreFeed(s, saved);
            s.status.textContent = [...s.warnings].join(" ");
          } else {
            preparePlanner(s);
            filterPanel(s);
            s.status.textContent = "";
            await loadMore(s);
          }
          decorateNative(s);
        } catch {
          if (state !== s) return;
          s.failed = true;
          s.status.textContent = "Discovery could not start. The normal view is restored. Check Customize for invalid rules or use Restart feed to try again.";
          setMode(s, true, false);
        }
      }
      function decorateNative(s) {
        if (!s.byId || state !== s) return;
        for (const card of s.page.querySelectorAll(".card[data-id]")) {
          const item = s.byId.get(card.dataset.id), host = card.querySelector(".cardScalable");
          if (!host || !item) continue;
          const text = badgeFor(item, s.badges, /* @__PURE__ */ new Date(), s.tracking);
          let badge = host.querySelector("[data-fx-native-badge]");
          if (!text) {
            badge == null ? void 0 : badge.remove();
            continue;
          }
          if (!badge) {
            badge = element("span", "fx-badge");
            badge.dataset.fxNativeBadge = "";
            host.dataset.fxBadgeHost = "";
            host.append(badge);
          }
          if (badge.textContent !== text) badge.textContent = text;
        }
      }
      function download(name, obj) {
        const url = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" }));
        const a = element("a");
        a.href = url;
        a.download = name;
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1e3);
      }
      function buildSettingsContent(s, container, isDialog = true) {
        var _a2, _b2;
        const title = element("h2", "", "Customize discovery");
        const help = element("p", "fx-dialog-lead", s.syncAvailable ? "Home, Movies and Shows have separate rules. Apply saves these preferences to your Jellyfin user for other compatible devices." : "The server companion is unavailable. Apply saves to this browser; export/import can transfer your rules.");
        const input = element("textarea");
        input.spellcheck = false;
        input.setAttribute("aria-label", "Discovery configuration JSON");
        try {
          input.value = JSON.stringify(s.config || readConfig(s.api), null, 2);
        } catch {
          input.value = localStorage.getItem(configKey(s.api)) || JSON.stringify(DEFAULT_CONFIG2, null, 2);
        }
        const error = element("p", "fx-editor-alert");
        error.setAttribute("role", "alert");
        const visual = element("div", "fx-visual-editor");
        let initial;
        try {
          initial = validateConfig(JSON.parse(input.value));
        } catch {
          initial = DEFAULT_CONFIG2;
        }
        const editor = createVisualEditor(visual, initial, s.route.page, s.inventory, (c) => {
          input.value = JSON.stringify(c, null, 2);
        }, { element, button, supplied: DEFAULT_CONFIG2 });
        if (!((_b2 = (_a2 = s.inventory) == null ? void 0 : _a2.items) == null ? void 0 : _b2.length) && s.client) {
          s.client.inventory({ page: "home", parentId: "" }).then((inv) => {
            var _a3;
            s.inventory = inv;
            snapshots.set(`${s.scope}:home:`, { at: Date.now(), value: inv });
            (_a3 = editor.setInventory) == null ? void 0 : _a3.call(editor, inv);
          }).catch(() => {
          });
        }
        const advanced = element("details", "fx-advanced");
        advanced.append(element("summary", "", "Advanced: JSON import / export"));
        input.addEventListener("change", () => {
          try {
            editor.setConfig(validateConfig(JSON.parse(input.value)));
            error.textContent = "";
          } catch (e) {
            error.textContent = e.message;
          }
        });
        const actions = element("div", "fx-dialog-actions");
        const apply = button("Apply", async () => {
          apply.disabled = true;
          try {
            const config = validateConfig(JSON.parse(input.value));
            if (s.syncAvailable) {
              const saved = await s.client.savePreferences(config, s.profileVersion);
              if ((saved == null ? void 0 : saved.version) !== void 0) s.profileVersion = saved.version;
            }
            localStorage.setItem(configKey(s.api), JSON.stringify(config));
            if (isDialog) {
              closeDialog();
              restart(true);
            } else {
              error.textContent = "Saved to your Jellyfin profile! Reload Home, Movies, or Shows to see your updated shelves.";
              restart(true);
            }
          } catch (e) {
            error.textContent = (e == null ? void 0 : e.status) === 409 ? "Preferences changed on another device. Close and reopen Customize before saving." : (e == null ? void 0 : e.message) || "Could not save preferences. Check the connection and try again.";
          } finally {
            apply.disabled = false;
          }
        });
        apply.className = "fx-btn-primary";
        const reset = button("Load supplied rules", () => {
          input.value = JSON.stringify(DEFAULT_CONFIG2, null, 2);
          editor.setConfig(DEFAULT_CONFIG2);
          error.textContent = "Review the rules, then Apply to save.";
        });
        const exportButton = button("Export JSON", () => {
          try {
            download("fazfort-discovery-config.json", validateConfig(JSON.parse(input.value)));
          } catch (e) {
            error.textContent = e.message;
          }
        });
        const device = element("div", "fx-dialog-actions fx-device-bar"), control = button(`Controls: ${controlsMode(s).mode}`, () => controlToggle(s, control));
        device.append(control, button("Use normal Home", () => {
          localStorage.setItem(prefKey(s.api, "home"), "native");
          error.textContent = "Normal Home selected for this device.";
        }), button("Use Discovery Home", () => {
          localStorage.setItem(prefKey(s.api, "home"), "discover");
          error.textContent = "Discovery Home selected for this device.";
        }), button("Reshuffle feed", () => {
          if (isDialog) closeDialog();
          restart(true);
        }));
        const file = element("input");
        file.type = "file";
        file.accept = ".json,application/json";
        file.setAttribute("aria-label", "Import discovery configuration or old shelf rules");
        file.addEventListener("change", async () => {
          var _a3;
          try {
            const selected = (_a3 = file.files) == null ? void 0 : _a3[0];
            if (!selected) return;
            if (selected.size > 1e6) throw Error("Use a JSON file smaller than 1 MB.");
            const imported = JSON.parse(await selected.text());
            if (Array.isArray(imported)) {
              const c = validateConfig(JSON.parse(input.value));
              c.pages.home.rules = imported;
              c.pages.movies.rules = imported.filter((r) => {
                var _a4;
                return (_a4 = r.Types) == null ? void 0 : _a4.includes("Movie");
              }).map((r) => ({ ...r, Types: ["Movie"] }));
              c.pages.shows.rules = imported.filter((r) => {
                var _a4;
                return (_a4 = r.Types) == null ? void 0 : _a4.includes("Series");
              }).map((r) => ({ ...r, Types: ["Series"] }));
              input.value = JSON.stringify(validateConfig(c), null, 2);
            } else input.value = JSON.stringify(validateConfig(imported), null, 2);
            editor.setConfig(validateConfig(JSON.parse(input.value)));
            error.textContent = "Imported for review. Apply to save.";
          } catch (e) {
            error.textContent = e.message;
          }
        });
        advanced.replaceChildren(element("summary", "", "Advanced: JSON import / export"), file, input, exportButton, reset);
        if (isDialog) actions.replaceChildren(apply, button("Cancel", closeDialog));
        else actions.replaceChildren(apply);
        container.append(title, help, device, visual, advanced, error, actions);
      }
      function customize(s) {
        closeDialog();
        const dialog = element("dialog", "fx-dialog");
        dialog.id = "fx-customize";
        buildSettingsContent(s, dialog, true);
        openDialog(dialog);
      }
      let settingsScope = "";
      async function buildStandaloneSettingsState(api) {
        var _a2;
        const scope = scopeKey(api);
        const inv = (state == null ? void 0 : state.inventory) || findCachedInventory(scope, { page: "home", parentId: "" });
        const s = { api, scope, root: element("div"), route: { page: ((_a2 = state == null ? void 0 : state.route) == null ? void 0 : _a2.page) || "home" }, config: null, inventory: inv };
        try {
          s.config = readConfig(api);
        } catch {
        }
        s.client = new JellyfinClient(api, () => scopeKey(api) === scope);
        try {
          const profile = await s.client.preferences();
          s.config = profile.config ? validateConfig(profile.config) : s.config;
          s.profileVersion = profile.version;
          s.syncAvailable = true;
        } catch {
          s.client.assertCurrent();
        }
        return s;
      }
      async function openUserSettings(api) {
        var _a2;
        if (!((_a2 = api == null ? void 0 : api.getCurrentUserId) == null ? void 0 : _a2.call(api))) return;
        const s = await buildStandaloneSettingsState(api);
        customize(s);
      }
      async function mountInlineSettings(host, api = window.ApiClient) {
        var _a2;
        if (!host || !((_a2 = api == null ? void 0 : api.getCurrentUserId) == null ? void 0 : _a2.call(api))) return;
        host.replaceChildren(element("p", "fx-status", "Loading your Discovery profile and library categories\u2026"));
        const s = await buildStandaloneSettingsState(api);
        host.replaceChildren();
        host.classList.add("fx-inline-studio");
        buildSettingsContent(s, host, false);
      }
      function syncSettings(api) {
        var _a2;
        const scope = ((_a2 = api == null ? void 0 : api.getCurrentUserId) == null ? void 0 : _a2.call(api)) ? scopeKey(api) : "";
        if (settingsScope && scope !== settingsScope) {
          closeDialog();
          document.querySelectorAll("[data-fx-settings-link]").forEach((n) => n.remove());
        }
        settingsScope = scope;
        if (!scope || !/^#\/mypreferencesmenu(?:[?]|$)/i.test(location.hash)) return;
        const page = [...document.querySelectorAll(".userPreferencesPage")].find(visible);
        if (!page || page.querySelector("[data-fx-settings-link]")) return;
        const link = button("Discovery settings", () => openUserSettings(api));
        link.dataset.fxSettingsLink = "true";
        link.className = "fx-profile-settings";
        page.prepend(link);
      }
      function visible(node) {
        if (!(node == null ? void 0 : node.isConnected) || node.closest(".hide,[hidden],.hidePage")) return false;
        return getComputedStyle(node).display !== "none";
      }
      function locate(route) {
        const selector = route.page === "home" ? "#indexPage, .homePage" : route.page === "movies" ? "#moviesPage" : "#tvshowsPage, #tvRecommendedPage";
        for (const page of document.querySelectorAll(selector)) {
          if (!visible(page)) continue;
          const native = route.page === "home" ? page.querySelector(".homeSectionsContainer") : page.querySelector(`.pageTabContent[data-index="${route.view === "genres" ? route.page === "movies" ? 4 : 3 : route.view === "library" ? 0 : new URLSearchParams(location.hash.split("?")[1] || "").get("tab") || 0}"]`);
          if (native && !native.closest(".fx-discovery")) return { page, native };
        }
        return null;
      }
      function cleanup(preserve = true) {
        var _a2, _b2;
        generation++;
        if (selectHold) {
          clearTimeout(selectHold.timer);
          selectHold = null;
        }
        closeDialog();
        if (!state) return;
        if (preserve) saveFeed(state);
        clearTimeout(state.filterTimer);
        (_a2 = state.io) == null ? void 0 : _a2.disconnect();
        syncNative(state, false);
        state.root.remove();
        state = null;
        (_b2 = document.getElementById("fx-customize")) == null ? void 0 : _b2.remove();
        document.querySelectorAll("[data-fx-native-badge]").forEach((n) => n.remove());
        document.querySelectorAll("[data-fx-badge-host]").forEach((n) => n.removeAttribute("data-fx-badge-host"));
      }
      function restart(clearCache = false) {
        const key = state == null ? void 0 : state.key;
        if (clearCache) snapshots.clear();
        cleanup(false);
        if (key) savedFeeds.delete(key);
        reconcile();
      }
      function reconcile() {
        var _a2, _b2;
        clearTimeout(timer);
        timer = 0;
        if (stopped) return;
        const api = window.ApiClient, route = routeInfo(location.hash);
        syncSettings(api);
        if (!((_a2 = api == null ? void 0 : api.getCurrentUserId) == null ? void 0 : _a2.call(api))) {
          cleanup(false);
          savedFeeds.clear();
          snapshots.clear();
          lastScope = "";
          return;
        }
        if (!route) {
          if (state) cleanup();
          else if (!/^#\/mypreferencesmenu(?:[?]|$)/i.test(location.hash)) closeDialog();
          return;
        }
        if (route.serverId && route.serverId.toLowerCase() !== (((_b2 = api.serverId) == null ? void 0 : _b2.call(api)) || "").toLowerCase()) {
          cleanup();
          return;
        }
        const target = locate(route), scope = scopeKey(api);
        if (lastScope && lastScope !== scope) {
          cleanup(false);
          savedFeeds.clear();
          snapshots.clear();
        }
        lastScope = scope;
        if (!target) {
          if (state) cleanup();
          return;
        }
        const key = `${scope}:${route.page}:${route.parentId}:${route.view || "home"}`;
        if ((state == null ? void 0 : state.key) === key && state.root.isConnected && state.page === target.page && state.native === target.native) {
          if (!state.full && !state.failed) syncNative(state, true);
          decorateNative(state);
          return;
        }
        cleanup();
        const token = generation;
        const root = element("div", "fx-discovery"), toolbar = element("div", "fx-toolbar"), list = element("div"), status = element("p", "fx-status"), footer = element("div", "fx-footer"), panel = element("div", "fx-filters"), matchCount = element("p", "fx-match-count");
        panel.hidden = true;
        status.setAttribute("role", "status");
        const s = { ...target, api, scope, key, route, root, list, status, footer, panel, matchCount, token, now: /* @__PURE__ */ new Date(), slots: [], badges: /* @__PURE__ */ new Map(), tracking: /* @__PURE__ */ new Map(), filters: cloneJson(DEFAULT_FILTERS), warnings: /* @__PURE__ */ new Set(), anchorIndex: 0, anchorTurn: true, started: false, loading: false, full: false, failed: false, shuffle: hash(String(Date.now())) };
        s.client = new JellyfinClient(api, () => state === s && generation === token && root.isConnected);
        s.toggle = button(route.page === "home" ? "Normal home" : "Full library", () => setMode(s, !s.full));
        s.more = button("Load more", () => {
          s.pauseAutomatic = false;
          loadMore(s);
        });
        s.note = element("p", "", "Loading shelves on demand.");
        s.filterToggle = button("Filters", () => {
          var _a3;
          (_a3 = s.root.querySelector(".fx-feed-menu")) == null ? void 0 : _a3.removeAttribute("open");
          panel.hidden = !panel.hidden;
          if (!panel.hidden) focusNode(panel.querySelector("input,select"));
        });
        s.filterToggle.disabled = true;
        const controlButton = button(`Controls: ${controlsMode(s).mode}`, () => controlToggle(s, controlButton));
        root.classList.toggle("fx-tv", controlsMode(s).tv);
        const menu = element("details", "fx-feed-menu"), summary = element("summary", "", "Browse options"), actions = element("div", "fx-feed-menu-actions");
        actions.append(s.toggle, s.filterToggle, button("Customize", () => customize(s)), controlButton, button("Restart feed", () => restart(true)));
        menu.append(summary, actions);
        toolbar.append(menu);
        if (route.page === "home") toolbar.hidden = true;
        else {
          menu.hidden = true;
          const heading = element("h1", "", route.page === "movies" ? "Movies" : "TV Shows"), switcher = element("select");
          switcher.setAttribute("aria-label", "Browse mode");
          for (const [value, label] of [["suggestions", "Suggestions"], ["library", "Library"], ["genres", "Genres"]]) {
            const option = element("option", "", label);
            option.value = value;
            option.selected = route.view === value;
            switcher.append(option);
          }
          switcher.addEventListener("change", () => {
            const q = new URLSearchParams(location.hash.split("?")[1] || "");
            q.set("tab", switcher.value === "library" ? "0" : switcher.value === "genres" ? route.page === "movies" ? "4" : "3" : "1");
            location.hash = location.hash.split("?")[0] + "?" + q;
          });
          toolbar.prepend(heading, switcher);
          if (route.view !== "library") toolbar.append(s.filterToggle);
        }
        footer.append(s.more, s.note);
        root.append(toolbar, panel, matchCount, status, list, footer);
        if (route.page === "home") target.native.after(root);
        else target.native.before(root);
        state = s;
        let full = route.view === "library";
        try {
          if (route.page === "home") full = localStorage.getItem(prefKey(api, route.page)) === "native";
        } catch {
        }
        if (typeof IntersectionObserver === "function") {
          s.io = new IntersectionObserver((entries) => {
            if (entries.some((e) => e.isIntersecting)) loadMore(s, true);
          }, { rootMargin: "600px 0px" });
          s.io.observe(footer);
        }
        setMode(s, full, false);
      }
      let scrollQueued = false;
      function scheduleScroll() {
        if (scrollQueued || stopped) return;
        scrollQueued = true;
        requestAnimationFrame(() => {
          scrollQueued = false;
          const s = state;
          if (!s || s.full || !s.root.isConnected) return;
          if (s.config) virtualize(s);
          const rect = s.footer.getBoundingClientRect();
          if (rect.top < innerHeight + 600 && rect.bottom >= 0) loadMore(s, true);
        });
      }
      function schedule() {
        if (!timer && !stopped) timer = setTimeout(reconcile, 120);
      }
      function navSuggestions(event) {
        var _a2, _b2, _c2;
        const target = (_b2 = (_a2 = event.target).closest) == null ? void 0 : _b2.call(_a2, "[data-sleekfin-header-proxy-item],a[href]");
        if (!target) return;
        const proxy = target.getAttribute("data-sleekfin-header-proxy-item");
        const page = proxy === "jellyfin:movies" ? "movies" : proxy === "jellyfin:shows" ? "tv" : null;
        let route = page ? `#/${page}` : target.getAttribute("href");
        if (!page && !target.closest("header,.headerTabs")) return;
        if (!/^#\/(movies|tv|tvshows)(?:[?]|$)/.test(route || "")) return;
        const [path, raw = ""] = route.split("?"), q = new URLSearchParams(raw);
        q.set("tab", "1");
        event.preventDefault();
        (_c2 = event.stopImmediatePropagation) == null ? void 0 : _c2.call(event);
        event.stopPropagation();
        location.hash = path + "?" + q;
      }
      function rememberFocus(event) {
        var _a2, _b2;
        const s = state, card = (_b2 = (_a2 = event.target).closest) == null ? void 0 : _b2.call(_a2, ".fx-card");
        if (s && card && s.root.contains(card)) s.lastFocus = { row: s.slots.findIndex((slot) => slot.node.contains(card)), id: card.dataset.itemId };
      }
      function remoteKey(event) {
        var _a2, _b2, _c2, _d2, _e2;
        const s = state;
        const key = { 37: "ArrowLeft", 38: "ArrowUp", 39: "ArrowRight", 40: "ArrowDown", 13: "Enter", 27: "Escape", 10009: "Escape", 461: "Escape", 457: "ContextMenu" }[event.keyCode] || event.key;
        const target = event.target || document.activeElement;
        if (activeDialog) {
          if (key === "Escape" || event.keyCode === 10009) {
            event.preventDefault();
            event.stopPropagation();
            closeDialog();
            return;
          }
          if (key === "Tab") {
            const controls = [...activeDialog.dialog.querySelectorAll("button,a[href],input,select,textarea")].filter((n2) => !n2.disabled && !n2.hidden);
            const n = controls.indexOf(document.activeElement);
            if (controls.length && (event.shiftKey && n <= 0 || !event.shiftKey && n === controls.length - 1)) {
              event.preventDefault();
              focusNode(controls[event.shiftKey ? controls.length - 1 : 0]);
            }
          }
          if (!s || !controlsMode(s).tv || ((_a2 = target == null ? void 0 : target.matches) == null ? void 0 : _a2.call(target, "input,select,textarea"))) return;
          if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)) {
            const controls = [...activeDialog.dialog.querySelectorAll("button,a[href]")].filter((n) => !n.disabled), index = controls.indexOf(document.activeElement);
            const rect = (_b2 = document.activeElement || controls[0]) == null ? void 0 : _b2.getBoundingClientRect();
            if (controls.length && rect) {
              const x = (rect.left + rect.right) / 2, y = (rect.top + rect.bottom) / 2;
              const ranked = controls.filter((n) => n !== document.activeElement).map((node) => {
                const r = node.getBoundingClientRect(), dx = (r.left + r.right) / 2 - x, dy = (r.top + r.bottom) / 2 - y;
                const primary = key === "ArrowLeft" ? -dx : key === "ArrowRight" ? dx : key === "ArrowUp" ? -dy : dy;
                return { node, primary, score: primary + 3 * Math.abs(key === "ArrowLeft" || key === "ArrowRight" ? dy : dx) };
              }).filter((n) => n.primary > 2).sort((a, b) => a.score - b.score);
              event.preventDefault();
              event.stopPropagation();
              if (ranked.length) focusNode(ranked[0].node);
            }
          }
          return;
        }
        if (!s || s.full || !controlsMode(s).tv || !s.root.isConnected || document.fullscreenElement || ((_c2 = target == null ? void 0 : target.matches) == null ? void 0 : _c2.call(target, 'input,select,textarea,[contenteditable="true"]'))) return;
        if (!s.root.contains(target) && target !== document.body) return;
        const card = (_d2 = target.closest) == null ? void 0 : _d2.call(target, ".fx-card");
        if ((key === "ContextMenu" || event.keyCode === 457) && card) {
          const item = (_e2 = s.inventory) == null ? void 0 : _e2.items.find((i) => i.Id === card.dataset.itemId);
          if (item) {
            event.preventDefault();
            event.stopPropagation();
            moreLikeThis(item, s);
          }
          return;
        }
        if (key === "Enter" && card) {
          event.preventDefault();
          event.stopPropagation();
          if (event.repeat || selectHold) return;
          selectHold = { node: card, fired: false, timer: setTimeout(() => {
            if ((selectHold == null ? void 0 : selectHold.node) === card && state === s) {
              selectHold.fired = true;
              const item = s.inventory.items.find((i) => i.Id === card.dataset.itemId);
              if (item) moreLikeThis(item, s);
            }
          }, 650) };
          return;
        }
        if (key === "Escape" && s.root.querySelector(".fx-feed-menu[open]")) {
          event.preventDefault();
          event.stopPropagation();
          s.root.querySelector(".fx-feed-menu").removeAttribute("open");
          focusNode(s.root.querySelector(".fx-feed-menu>summary"));
          return;
        }
        if (key === "Escape" && !s.panel.hidden) {
          event.preventDefault();
          event.stopPropagation();
          s.panel.hidden = true;
          focusNode(s.filterToggle);
          return;
        }
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)) return;
        let next;
        if (card) {
          const slotIndex = s.slots.findIndex((slot) => slot.node.contains(card)), track = card.closest(".fx-track"), cards = [...track.querySelectorAll(".fx-card")], index = cards.indexOf(card);
          if (key === "ArrowLeft" || key === "ArrowRight") next = cards[(index + (key === "ArrowLeft" ? -1 : 1) + cards.length) % cards.length];
          else {
            const nextSlot = s.slots[slotIndex + (key === "ArrowUp" ? -1 : 1)];
            if (nextSlot) {
              if (!nextSlot.live) fillSlot(nextSlot, s);
              const options = [...nextSlot.node.querySelectorAll(".fx-card")];
              next = options[Math.min(index, options.length - 1)];
            } else if (key === "ArrowUp") next = s.route.page === "home" ? s.page.querySelector(".sleekfin-hero button,.sleekfin-hero a[href]") : s.root.querySelector(".fx-toolbar select");
            else {
              next = s.more;
              if (!s.finished) loadMore(s);
            }
          }
        } else {
          const bar = [...s.root.querySelectorAll(".fx-toolbar summary,.fx-toolbar details[open] button")].filter((b) => !b.disabled), n = bar.indexOf(target);
          if (key === "ArrowDown") next = s.list.querySelector(".fx-card") || s.more;
          else next = bar[Math.max(0, Math.min(bar.length - 1, n + (key === "ArrowLeft" ? -1 : 1)))];
        }
        if (next) {
          event.preventDefault();
          event.stopPropagation();
          focusNode(next);
        }
      }
      function remoteKeyUp(event) {
        if (!selectHold || !(event.key === "Enter" || event.keyCode === 13)) return;
        event.preventDefault();
        event.stopPropagation();
        const held = selectHold;
        selectHold = null;
        clearTimeout(held.timer);
        if (!held.fired && held.node.isConnected) held.node.click();
      }
      function start() {
        const style = element("style");
        style.id = "fx-discovery-style";
        style.textContent = DISCOVERY_CSS2;
        document.head.append(style);
        if (!window.JellyfinRequestHub && document.querySelector('script[data-fazfort-discovery],[src*="FazFortDiscovery"]') && !document.querySelector("script[data-requesthub-asset]")) {
          const rh = element("script");
          rh.defer = true;
          rh.src = "../RequestHub/Assets/web.js";
          rh.dataset.requesthubAsset = "browser";
          document.head.append(rh);
        }
        observer = new MutationObserver((records) => {
          if (records.some((r) => {
            var _a2, _b2;
            return !((_b2 = (_a2 = r.target).closest) == null ? void 0 : _b2.call(_a2, ".fx-discovery,.fx-dialog,.fx-inline-studio")) && (r.type === "childList" || r.attributeName === "class");
          })) schedule();
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
        document.addEventListener("click", navSuggestions, true);
        window.addEventListener("hashchange", schedule);
        document.addEventListener("viewshow", schedule);
        document.addEventListener("keydown", remoteKey, true);
        document.addEventListener("keyup", remoteKeyUp, true);
        document.addEventListener("focusin", rememberFocus);
        document.addEventListener("scroll", scheduleScroll, { passive: true, capture: true });
        window.addEventListener("resize", scheduleScroll);
        heartbeat = setInterval(schedule, 2e3);
        reconcile();
      }
      window.FazFortDiscovery = {
        version: VERSION,
        restart,
        openSettings: () => openUserSettings(window.ApiClient),
        mountSettings: (host) => mountInlineSettings(host, window.ApiClient),
        diagnostics: () => {
          var _a2, _b2;
          return { version: VERSION, page: (state == null ? void 0 : state.route.page) || null, mounted: !!state, items: ((_a2 = state == null ? void 0 : state.inventory) == null ? void 0 : _a2.items.length) || 0, shelves: ((_b2 = state == null ? void 0 : state.planner) == null ? void 0 : _b2.shelves.length) || 0, loadedRows: (state == null ? void 0 : state.slots.length) || 0, liveRows: (state == null ? void 0 : state.slots.filter((s) => s.live).length) || 0, trackingReady: !!(state == null ? void 0 : state.trackingReady), preferencesSync: !!(state == null ? void 0 : state.syncAvailable), controls: state ? controlsMode(state).mode : null, warnings: [...(state == null ? void 0 : state.warnings) || []], supportedPageFound: !!(routeInfo(location.hash) && locate(routeInfo(location.hash))) };
        },
        stop() {
          var _a2;
          stopped = true;
          clearTimeout(timer);
          clearInterval(heartbeat);
          observer == null ? void 0 : observer.disconnect();
          cleanup(false);
          snapshots.clear();
          savedFeeds.clear();
          document.removeEventListener("click", navSuggestions, true);
          window.removeEventListener("hashchange", schedule);
          document.removeEventListener("viewshow", schedule);
          document.removeEventListener("scroll", scheduleScroll, true);
          window.removeEventListener("resize", scheduleScroll);
          document.removeEventListener("keydown", remoteKey, true);
          document.removeEventListener("keyup", remoteKeyUp, true);
          document.removeEventListener("focusin", rememberFocus);
          document.querySelectorAll("[data-fx-settings-link]").forEach((n) => n.remove());
          (_a2 = document.getElementById("fx-discovery-style")) == null ? void 0 : _a2.remove();
          delete window.FazFortDiscovery;
        }
      };
      if (document.body) start();
      else document.addEventListener("DOMContentLoaded", start, { once: true });
    }
    bootDiscovery(DEFAULT_CONFIG, DISCOVERY_CSS);
  })();
})();
