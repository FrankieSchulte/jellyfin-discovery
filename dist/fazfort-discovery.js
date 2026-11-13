/* FazFort Discovery 0.5.4 — paste this entire file into one non-module JS Injector script. */
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
      "cardsPerShelf": 20,
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
            },
            {
              "Key": "crime-heist-movies",
              "Title": "Crime & Heist Movies",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "GenresAny": [
                "Crime",
                "Mystery"
              ]
            },
            {
              "Key": "animated-movies",
              "Title": "Animated Features",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "GenresAny": [
                "Animation"
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
              "Title": "Crime & Mystery Shows",
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
              "Key": "sequels",
              "Title": "Bigger & Wilder Sequels",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "sequel"
              ]
            },
            {
              "Key": "credits-stingers",
              "Title": "Stay Through the Credits",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "aftercreditsstinger",
                "duringcreditsstinger"
              ]
            },
            {
              "Key": "mcu-movies",
              "Title": "Marvel Cinematic Universe",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "marvel cinematic universe (mcu)"
              ]
            },
            {
              "Key": "comic-books",
              "Title": "From Comic Panels to Screen",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "based on comic",
                "superhero team",
                "secret identity"
              ]
            },
            {
              "Key": "3d-animation",
              "Title": "3D Animated Worlds",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "3d animation"
              ]
            },
            {
              "Key": "witches-wizards",
              "Title": "Witches, Wizards & Spells",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "witch",
                "wizard",
                "castle",
                "sorcery"
              ]
            },
            {
              "Key": "dragons-quests",
              "Title": "Dragons, Castles & Epic Quests",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "dragon",
                "quest",
                "fantasy world",
                "good versus evil"
              ]
            },
            {
              "Key": "talking-animals-toys",
              "Title": "Talking Animals & Living Toys",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "anthropomorphism",
                "animals",
                "toy comes to life"
              ]
            },
            {
              "Key": "friendship-bonds",
              "Title": "Ride-or-Die Friendships & Siblings",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "friendship",
                "friends",
                "sibling relationship",
                "group of friends"
              ]
            },
            {
              "Key": "nyc-stories",
              "Title": "Set in New York City",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "new york city"
              ]
            },
            {
              "Key": "ghosts-demons",
              "Title": "Ghosts, Demons & The Occult",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "ghost",
                "demon",
                "supernatural horror",
                "supernatural"
              ]
            },
            {
              "Key": "slashers-killers",
              "Title": "Slashers, Killers & Murder Mysteries",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "serial killer",
                "murder",
                "sadism",
                "whodunit"
              ]
            },
            {
              "Key": "zombies-monsters",
              "Title": "Zombies, Creatures & Survival Horror",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "zombie",
                "survival horror",
                "monster",
                "creature",
                "epidemic"
              ]
            },
            {
              "Key": "aliens-first-contact",
              "Title": "Aliens & First Contact",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "alien",
                "alien invasion",
                "alien life-form"
              ]
            },
            {
              "Key": "space-odysseys",
              "Title": "Space Operas & Deep-Space Voyages",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "space opera",
                "space travel",
                "spacecraft"
              ]
            },
            {
              "Key": "true-stories",
              "Title": "Inspired by True Stories",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "based on true story",
                "biography"
              ]
            },
            {
              "Key": "dreams-surreal",
              "Title": "Fever Dreams & Surreal Worlds",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "dreams",
                "surrealism",
                "philosophical",
                "absurdism"
              ]
            },
            {
              "Key": "martial-arts-brawls",
              "Title": "Martial Arts & Showdowns",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "martial arts",
                "fight",
                "battle",
                "shounen"
              ]
            },
            {
              "Key": "revenge-thrillers",
              "Title": "Tales of Revenge",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "revenge"
              ]
            },
            {
              "Key": "nostalgia-throwbacks",
              "Title": "Pure Nostalgia",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "nostalgic",
                "1980s",
                "1960s"
              ]
            },
            {
              "Key": "feel-good-inspiring",
              "Title": "Hopeful & Inspirational",
              "Enabled": true,
              "Types": [
                "Movie",
                "Series"
              ],
              "TagsAny": [
                "hopeful",
                "inspirational",
                "cheerful",
                "joyful"
              ]
            },
            {
              "Key": "manga-light-novel-tv",
              "Title": "Manga & Light Novel Adaptations",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "based on manga",
                "based on light novel"
              ]
            },
            {
              "Key": "workplace-tv",
              "Title": "Clock In: Workplace Chaos",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "workplace",
                "workplace comedy",
                "office",
                "work",
                "mockumentary",
                "small business",
                "hospital",
                "fast food restaurant"
              ]
            },
            {
              "Key": "adult-animation-tv",
              "Title": "Adult Swim & Late-Night Toons",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "adult animation",
                "adult humor",
                "absurdism",
                "psychedelic",
                "slacker"
              ]
            },
            {
              "Key": "satire-parody-tv",
              "Title": "Biting Satire & Parody",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "satire",
                "parody",
                "social satire",
                "mockumentary",
                "scathing"
              ]
            },
            {
              "Key": "survival-high-stakes-tv",
              "Title": "High-Stakes Survival",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "survival",
                "death game",
                "epidemic",
                "post-apocalyptic future",
                "virus",
                "war",
                "rebellion"
              ]
            },
            {
              "Key": "mystery-conspiracy-tv",
              "Title": "Whodunits, Secrets & Conspiracies",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "whodunit",
                "detective",
                "impostor",
                "conspiracy",
                "spy thriller",
                "memory",
                "alternative reality"
              ]
            },
            {
              "Key": "prestige-streaming-tv",
              "Title": "Prestige Streaming Originals",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "StudiosAny": [
                "HBO",
                "Max",
                "HBO Max",
                "Apple TV",
                "Apple TV+",
                "Netflix",
                "Prime Video",
                "Hulu",
                "Disney+",
                "Crave"
              ]
            },
            {
              "Key": "new-era-hits-tv",
              "Title": "2020s Breakout Series",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "Years": [
                2020,
                2029
              ],
              "MinRating": 8
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
            },
            {
              "Key": "crime-heist-movies",
              "Title": "Crime & Heist Movies",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "GenresAny": [
                "Crime",
                "Mystery"
              ]
            },
            {
              "Key": "animated-movies",
              "Title": "Animated Features",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "GenresAny": [
                "Animation"
              ]
            },
            {
              "Key": "sequels",
              "Title": "Bigger & Wilder Sequels",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "sequel"
              ]
            },
            {
              "Key": "credits-stingers",
              "Title": "Stay Through the Credits",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "aftercreditsstinger",
                "duringcreditsstinger"
              ]
            },
            {
              "Key": "mcu-movies",
              "Title": "Marvel Cinematic Universe",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "marvel cinematic universe (mcu)"
              ]
            },
            {
              "Key": "comic-books",
              "Title": "From Comic Panels to Screen",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "based on comic",
                "superhero team",
                "secret identity"
              ]
            },
            {
              "Key": "3d-animation",
              "Title": "3D Animated Worlds",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "3d animation"
              ]
            },
            {
              "Key": "classic-cartoons",
              "Title": "Hand-Drawn & Cartoon Favorites",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "cartoon",
                "live action and animation"
              ]
            },
            {
              "Key": "manga-movies",
              "Title": "Manga Adaptations",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "based on manga"
              ]
            },
            {
              "Key": "witches-wizards",
              "Title": "Witches, Wizards & Spells",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "witch",
                "wizard",
                "castle"
              ]
            },
            {
              "Key": "dragons-quests",
              "Title": "Dragons, Castles & Epic Quests",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "dragon",
                "quest",
                "fantasy world",
                "good versus evil"
              ]
            },
            {
              "Key": "fairy-tales",
              "Title": "Fairy Tales & Folklore",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "based on fairy tale",
                "princess"
              ]
            },
            {
              "Key": "talking-animals-toys",
              "Title": "Talking Animals & Living Toys",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "anthropomorphism",
                "animals",
                "toy comes to life"
              ]
            },
            {
              "Key": "friendship-bonds",
              "Title": "Ride-or-Die Friendships & Siblings",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "friendship",
                "friends",
                "sibling relationship"
              ]
            },
            {
              "Key": "nyc-stories",
              "Title": "Set in New York City",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "new york city"
              ]
            },
            {
              "Key": "la-hollywood",
              "Title": "L.A. & Hollywood Stories",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "los angeles, california"
              ]
            },
            {
              "Key": "ghosts-demons",
              "Title": "Ghosts, Demons & The Occult",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "ghost",
                "demon",
                "supernatural horror",
                "supernatural"
              ]
            },
            {
              "Key": "slashers-killers",
              "Title": "Slashers, Killers & Murder Mysteries",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "serial killer",
                "murder",
                "sadism"
              ]
            },
            {
              "Key": "zombies-monsters",
              "Title": "Zombies, Creatures & Survival Horror",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "zombie",
                "survival horror",
                "monster",
                "creature"
              ]
            },
            {
              "Key": "aliens-first-contact",
              "Title": "Aliens & First Contact",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "alien",
                "alien invasion",
                "alien life-form"
              ]
            },
            {
              "Key": "space-odysseys",
              "Title": "Space Operas & Deep-Space Voyages",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "space opera",
                "space travel",
                "spacecraft"
              ]
            },
            {
              "Key": "true-stories",
              "Title": "Inspired by True Stories",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "based on true story",
                "biography"
              ]
            },
            {
              "Key": "dreams-surreal",
              "Title": "Fever Dreams & Surreal Cinema",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "dreams",
                "surrealism",
                "philosophical"
              ]
            },
            {
              "Key": "martial-arts-brawls",
              "Title": "Martial Arts & Showdowns",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "martial arts",
                "fight",
                "battle"
              ]
            },
            {
              "Key": "revenge-thrillers",
              "Title": "Tales of Revenge",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "revenge"
              ]
            },
            {
              "Key": "ya-adaptations",
              "Title": "Young Adult Book Adaptations",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "based on young adult novel"
              ]
            },
            {
              "Key": "female-leads-auteurs",
              "Title": "Leading Women & Female Directors",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "female protagonist",
                "woman director"
              ]
            },
            {
              "Key": "nostalgia-throwbacks",
              "Title": "Pure Nostalgia",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "nostalgic",
                "1980s",
                "1960s"
              ]
            },
            {
              "Key": "feel-good-inspiring",
              "Title": "Hopeful & Inspirational",
              "Enabled": true,
              "Types": [
                "Movie"
              ],
              "TagsAny": [
                "hopeful",
                "inspirational",
                "cheerful",
                "joyful"
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
                "lighthearted",
                "playful",
                "amused"
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
                "dark comedy",
                "black comedy",
                "dark humor",
                "cynical"
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
                "psychological horror",
                "psychological",
                "paranoia",
                "suspenseful"
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
              "Key": "manga-light-novel-tv",
              "Title": "Manga & Light Novel Adaptations",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "based on manga",
                "based on light novel"
              ]
            },
            {
              "Key": "shounen-martial-arts-tv",
              "Title": "Shounen & Martial Arts",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "shounen",
                "martial arts",
                "combat"
              ]
            },
            {
              "Key": "workplace-tv",
              "Title": "Clock In: Workplace Chaos",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "workplace",
                "workplace comedy",
                "office",
                "work",
                "mockumentary",
                "small business",
                "hospital",
                "fast food restaurant"
              ]
            },
            {
              "Key": "adult-animation-tv",
              "Title": "Adult Swim & Late-Night Toons",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "adult animation",
                "adult humor",
                "absurdism",
                "psychedelic",
                "slacker"
              ]
            },
            {
              "Key": "cartoon-favorites-tv",
              "Title": "Cartoon & Animated Classics",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "StudiosAny": [
                "Nickelodeon",
                "Cartoon Network",
                "Paramount+",
                "FOX"
              ]
            },
            {
              "Key": "satire-parody-tv",
              "Title": "Biting Satire & Parody",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "satire",
                "parody",
                "social satire",
                "mockumentary",
                "scathing"
              ]
            },
            {
              "Key": "sitcoms-hangout-tv",
              "Title": "Sitcoms & Hangout Comedies",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "sitcom",
                "group of friends",
                "high school friends",
                "playful",
                "amused"
              ]
            },
            {
              "Key": "survival-high-stakes-tv",
              "Title": "High-Stakes Survival",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "survival",
                "death game",
                "epidemic",
                "post-apocalyptic future",
                "virus",
                "war",
                "rebellion"
              ]
            },
            {
              "Key": "supernatural-powers-tv",
              "Title": "Curses, Psychics & Superpowers",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "supernatural",
                "sorcery",
                "psychic power",
                "super power",
                "magic"
              ]
            },
            {
              "Key": "mystery-conspiracy-tv",
              "Title": "Whodunits, Secrets & Conspiracies",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "whodunit",
                "detective",
                "impostor",
                "conspiracy",
                "spy thriller",
                "memory",
                "alternative reality"
              ]
            },
            {
              "Key": "anthology-feuds-tv",
              "Title": "Anthologies, Grudges & Rivalries",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "TagsAny": [
                "anthology",
                "revenge",
                "rivalry",
                "sibling rivalry"
              ]
            },
            {
              "Key": "action-adventure-tv",
              "Title": "Action & Adventure Series",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "GenresAny": [
                "Action & Adventure"
              ]
            },
            {
              "Key": "prestige-streaming-tv",
              "Title": "Prestige Streaming Originals",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "StudiosAny": [
                "HBO",
                "Max",
                "HBO Max",
                "Apple TV",
                "Apple TV+",
                "Netflix",
                "Prime Video",
                "Hulu",
                "Disney+",
                "Crave"
              ]
            },
            {
              "Key": "classic-throwback-tv",
              "Title": "90s & 2000s Throwback TV",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "Years": [
                1989,
                2012
              ]
            },
            {
              "Key": "new-era-hits-tv",
              "Title": "2020s Breakout Series",
              "Enabled": true,
              "Types": [
                "Series"
              ],
              "Years": [
                2020,
                2029
              ],
              "MinRating": 8
            }
          ]
        }
      }
    };
    const DISCOVERY_CSS = `.fx-discovery{color:inherit;padding:18px var(--sleekfin-page-gutter,clamp(16px,4vw,80px)) 36px;font-family:inherit;clear:both;box-sizing:border-box;overflow-anchor:none}
.fx-discovery[hidden],
.fx-discovery.fx-mode-full:not(:has(.fx-library-toolbar:not([hidden]),.fx-inline-studio:not([hidden]),.fx-grid > *)),
.fx-discovery.fx-mode-full:has(> .fx-toolbar:not(:has(> :not([hidden])))),
.fx-discovery:not(:has(> :not([hidden]):not(:empty))),
.fx-discovery:has(> .fx-toolbar:not(:has(> :not([hidden])))):not(:has(> :not(.fx-toolbar):not([hidden]):not(:empty))){display:none!important;padding:0!important;margin:0!important}
.fx-toolbar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:16px 0 26px}
.fx-toolbar:not(:has(> :not([hidden]))){display:none!important;margin:0!important}
.fx-toolbar h2{margin:0 auto 0 0;font-size:1.25rem}.fx-discovery button,.fx-dialog button{font:inherit;color:#f1f2f4;background:#1a1c20;border:1px solid #26292e;border-radius:8px;padding:9px 15px;cursor:pointer}
.fx-discovery button:hover,.fx-dialog button:hover{background:#26292e}.fx-discovery button:focus-visible,.fx-discovery a:focus-visible,.fx-dialog :focus-visible{outline:3px solid #fff;outline-offset:3px}
.fx-discovery button:disabled{opacity:.45;cursor:default}.fx-status{color:#ccc;line-height:1.5}.fx-status:empty{display:none}
.fx-shelf{margin:0 0 24px;min-width:0}.fx-row-head{display:flex;align-items:center;gap:10px;margin-bottom:14px}.fx-row-head h2{font-size:24px;line-height:32px;font-weight:600;margin:0 auto 0 0;border-left:3px solid var(--sleekfin-accent,#e50914);padding-left:10px;color:#fff}
.fx-row-head button{padding:3px 11px;font-size:22px;border:0;background:transparent}
.fx-track{display:flex;gap:14px;overflow-x:auto;padding:4px 3px 12px;scrollbar-width:thin;overflow-anchor:none;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}
.fx-card-entry{position:relative;flex:0 0 260px;width:260px;flex-basis:clamp(205px,23vw,310px);width:clamp(205px,23vw,310px);min-width:0}
.fx-card{width:100%;display:block;text-decoration:none;color:inherit;min-width:0}
.fx-card-more,.card:not(.sleekfin-details-episode) :is(button.cardOverlayButton[data-action="menu"],.cardOverlayContainer button[data-action="menu"],.cardFooter button[data-action="menu"]){display:none!important}
@keyframes fx-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
.fx-card-visual{position:relative;width:100%;aspect-ratio:16/9;background:#101113;border-radius:9px;overflow:hidden;display:flex;align-items:center;justify-content:center}
.fx-card-visual.is-loading,.fx-skeleton-box,.fx-skeleton-title,.fx-skeleton-line{background:linear-gradient(90deg,#16181b 25%,#23262b 50%,#16181b 75%)!important;background-size:200% 100%!important;animation:fx-shimmer 1.5s infinite linear}
.fx-card-visual img{width:100%;height:100%;object-fit:cover;transition:opacity .18s ease}.fx-card-visual img.is-instant{transition:none!important;opacity:1!important}.fx-card-visual.is-loading img{opacity:0}.fx-card-visual img.fx-poster{object-fit:contain;background:linear-gradient(110deg,#1a1c20,#101113)}
.fx-card-visual .fx-progress,.fx-card-visual .fx-badge{transition:opacity .18s ease}
.fx-card-visual:has(img.is-instant) .fx-progress,.fx-card-visual:has(img.is-instant) .fx-badge{transition:none!important;opacity:1!important}
.fx-card-visual.is-loading .fx-progress,.fx-card-visual.is-loading .fx-badge{opacity:0}
.fx-skeleton-title{width:220px;height:26px;border-radius:6px;border-left:3px solid var(--sleekfin-accent,#e50914)}
.fx-skeleton-line{width:68%;height:14px;border-radius:4px;margin:8px 2px 0}
.fx-placeholder{position:absolute;padding:18px;text-align:center;color:#bbb}.fx-name{display:block;margin:8px 2px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px}
.fx-card:hover .fx-name{color:#fff;text-decoration:underline}.fx-badge{position:absolute;bottom:0;left:50%;transform:translateX(-50%);background:#e50914;color:white;padding:3px 9px;line-height:1.3;font-size:13px;font-weight:700;white-space:nowrap;border-radius:3px 3px 0 0;z-index:2;pointer-events:none}
.fx-progress{position:absolute;left:0;right:0;bottom:0;height:3px;background:#595959;z-index:3}.fx-progress span{display:block;height:100%;background:#e50914}.fx-progress~.fx-badge{bottom:3px}
.fx-footer{text-align:center;padding:20px;overflow-anchor:none}.fx-footer p{color:#aaa;font-size:14px}.fx-shelf,.fx-placeholder-row,.fx-status,.fx-toolbar{overflow-anchor:none;box-sizing:border-box}
.fx-dialog{color:#f1f2f4;background:#101113;border:1px solid #26292e;border-radius:12px;width:min(850px,90vw);max-height:86vh;padding:22px;box-sizing:border-box;z-index:100001}.fx-dialog::backdrop{background:rgba(0,0,0,.8)}
.fx-dialog h2{margin-top:0}.fx-dialog textarea{width:100%;height:42vh;box-sizing:border-box;background:#0b0b0c;color:#f1f2f4;border:1px solid #26292e;border-radius:6px;padding:12px;font:13px/1.5 monospace}.fx-dialog p{line-height:1.5}.fx-dialog-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.fx-dialog input{max-width:100%}
/* Hide only the native content this mounted feed explicitly owns; failure/stop removes the attribute. */
[data-fx-native-hidden="true"]{display:none!important}
[data-fx-react-host="true"] > :not(.fx-discovery){display:none!important}
.fx-discovery [hidden]{display:none!important}
.cardScalable[data-fx-badge-host]{position:relative}
.fx-filters{display:flex;flex-wrap:wrap;gap:14px;padding:18px;background:rgba(22,22,24,.92);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.1);border-radius:14px;margin-bottom:18px}
.fx-filter-field{display:flex;flex-direction:column;gap:7px;min-width:145px;font-size:14px;color:#ccc}
.fx-filter-field input,.fx-filter-field select{font:inherit;min-height:42px;border-radius:10px;border:1px solid #26292e;background:#101113;color:#f1f2f4;padding:8px 12px;max-width:100%;box-sizing:border-box}
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
@media(max-width:600px){.fx-discovery{padding:10px 14px 25px;padding-bottom:calc(92px + env(safe-area-inset-bottom,0px))}.fx-card-entry{width:clamp(154px,44vw,215px);flex-basis:clamp(154px,44vw,215px)}.fx-toolbar{gap:7px}.fx-toolbar h2{width:100%;margin-bottom:5px}.fx-row-head h2{font-size:19px}.fx-dialog{padding:15px;max-height:85vh;max-height:85dvh}.fx-discovery button{padding:8px 10px}.fx-filter-field{flex:1 1 140px}.fx-similar-grid{grid-template-columns:minmax(0,1fr)}}
@media(prefers-reduced-motion:reduce){.fx-track{scroll-behavior:auto}}
/* Keep SleekFin's mount anchor visible; hide its native rows individually and immediately via CSS so late HSS/native rows never flash. */
[data-fx-hero-anchor="true"]{min-height:1px}
[data-fx-hero-anchor="true"] > :not(.sleekfin-hero):not(.hero):not(#slides-container):not(.fx-discovery):not(.sections),
html:not([data-fx-home-mode="native"]):not([data-rh-active="true"]) #indexPage .homeSectionsContainer > :not(.sleekfin-hero):not(.hero):not(#slides-container):not(.fx-discovery):not(.sections),
html:not([data-fx-home-mode="native"]):not([data-rh-active="true"]) #indexPage .homeSectionsContainer > .sections > :not(.sleekfin-hero):not(.hero):not(#slides-container):not(.fx-discovery){display:none!important}
.fx-toolbar{justify-content:flex-end;margin:4px 0 12px;position:relative;z-index:5}
.fx-feed-menu{position:relative}.fx-feed-menu>summary{cursor:pointer;list-style:none;color:#ccc;border:1px solid #26292e;border-radius:22px;padding:9px 16px;min-height:24px;font-size:14px}
.fx-feed-menu>summary::-webkit-details-marker{display:none}.fx-feed-menu>summary:focus-visible{outline:3px solid #fff;outline-offset:3px}
.fx-feed-menu-actions{display:flex;flex-direction:column;gap:8px;position:absolute;right:0;top:100%;margin-top:8px;padding:8px;background:linear-gradient(rgba(255,255,255,.055),rgba(255,255,255,.01)),rgba(22,22,24,.82);backdrop-filter:blur(18px) saturate(140%);border:1px solid rgba(255,255,255,.07);border-radius:12px;box-shadow:inset 0 1px rgba(255,255,255,.08),0 16px 40px -6px rgba(0,0,0,.65);min-width:190px;z-index:10}
.fx-feed-menu:not([open])>.fx-feed-menu-actions{display:none}
.fx-card-entry.fx-card-portrait{width:clamp(135px,14vw,205px);flex-basis:clamp(135px,14vw,205px)}
.fx-card-portrait .fx-card-visual{aspect-ratio:2/3}
.fx-card-portrait .fx-card-visual img{object-fit:contain}
.fx-see-more-poster{flex-direction:column;gap:10px;padding:16px;text-align:center;background:linear-gradient(145deg,rgba(229,9,20,.22) 0%,rgba(20,20,24,.96) 100%)!important;border:1px solid rgba(229,9,20,.45);box-sizing:border-box;transition:border-color .16s ease,background .16s ease,transform .16s ease}
.fx-see-more-card:hover .fx-see-more-poster,.fx-see-more-link:hover .fx-see-more-poster{border-color:#e50914;background:linear-gradient(145deg,rgba(229,9,20,.34) 0%,rgba(28,28,34,.98) 100%)!important;transform:translateY(-2px)}
.fx-see-more-arrow{width:48px;height:48px;border-radius:999px;background:#e50914;border:0;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;line-height:1}
.fx-see-more-label{font-size:1rem;font-weight:700;color:#fff}
.fx-see-more-sub{font-size:.78rem;color:rgba(255,255,255,.72);line-height:1.3}
.fx-dialog{width:min(1040px,94vw);max-width:1040px;background:#101113;border:1px solid #26292e;border-radius:18px;box-shadow:0 28px 80px rgba(0,0,0,.72)}
.fx-inline-studio{color:#f1f2f4;background:#101113;border:1px solid #26292e;border-radius:18px;padding:24px;margin-bottom:24px;box-shadow:0 16px 40px rgba(0,0,0,.35)}
.fx-inline-studio button{font:inherit;color:#f1f2f4;background:#1a1c20;border:1px solid #26292e;border-radius:10px;padding:8px 14px;min-height:40px;cursor:pointer}
.fx-inline-studio button:hover{background:#26292e}
.fx-dialog button.fx-btn-primary,.fx-inline-studio button.fx-btn-primary{background:#e50914;border-color:#ff2c37;color:#fff;font-weight:700}
.fx-dialog button.fx-btn-primary:hover,.fx-inline-studio button.fx-btn-primary:hover{background:#f6121d}
.fx-editor-tabs,.fx-editor-fields,.fx-order-row,.fx-category-row{display:flex;align-items:center;flex-wrap:wrap;gap:10px}
.fx-editor-tabs{position:sticky;top:-22px;background:#101113;padding:12px 0;z-index:4;border-bottom:1px solid #26292e;margin-bottom:16px}
.fx-inline-studio .fx-editor-tabs{position:static;padding-top:4px}
.fx-editor-tabs [aria-pressed="true"]{background:#e50914!important;border-color:#ff2c37!important;color:#fff!important;font-weight:700}
.fx-editor-section{background:#15171a;border:1px solid #26292e;border-radius:14px;padding:18px 20px;margin-bottom:18px}
.fx-editor-section h3{margin:0 0 6px;font-size:1.12rem;color:#fff;border-left:3px solid #e50914;padding-left:10px}
.fx-editor-help{margin:0 0 14px;font-size:.88rem;color:rgba(255,255,255,.66);line-height:1.45}
.fx-editor-field{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:rgba(255,255,255,.86);min-width:130px;flex:1}
.fx-editor-field input,.fx-editor-field select{box-sizing:border-box;width:100%;min-height:42px;background:#0b0b0c;color:#f1f2f4;border:1px solid #26292e;border-radius:8px;padding:8px 11px;font:inherit}
.fx-editor-field input[type="checkbox"]{width:20px;min-height:20px;accent-color:#e50914}
.fx-editor-presets{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
.fx-order-list{list-style:none;padding:0;margin:0 0 14px;display:flex;flex-direction:column;gap:8px}
.fx-order-row{padding:10px 12px;border:1px solid #26292e;border-radius:10px;background:#101113;flex-wrap:wrap}
.fx-order-label{flex:1;min-width:160px;font-weight:600;color:#fff}
.fx-row-badge{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:3px 8px;border-radius:999px;background:rgba(255,255,255,.1);color:#ddd}
.fx-row-badge-core{background:rgba(255,255,255,.12);color:#e5e7eb;border:1px solid rgba(255,255,255,.22)}
.fx-row-badge-category{background:rgba(229,9,20,.22);color:#fca5a5;border:1px solid rgba(229,9,20,.4)}
.fx-row-badge-rotating{background:rgba(16,185,129,.2);color:#6ee7b7;border:1px solid rgba(16,185,129,.38)}
.fx-chip-toggles .fx-editor-field{flex:0 0 auto;min-width:0;flex-direction:row;align-items:center;gap:8px;padding:8px 12px;border-radius:999px;background:#1a1c20;border:1px solid #26292e}
.fx-explorer-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
.fx-subtab-btn.is-active{background:rgba(229,9,20,.24)!important;border-color:#e50914!important;color:#fff!important;font-weight:700}
.fx-explorer-search,.fx-library-toolbar{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px}
.fx-explorer-search input,.fx-library-toolbar input{flex:1;min-width:220px;min-height:42px;background:#0b0b0c;color:#f1f2f4;border:1px solid #26292e;border-radius:10px;padding:8px 14px;font:inherit}
.fx-candidate-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px;max-height:340px;overflow-y:auto;padding-right:4px}
.fx-candidate-card{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-radius:10px;background:#101113;border:1px solid #26292e}
.fx-candidate-card.is-enabled{background:rgba(229,9,20,.14);border-color:rgba(229,9,20,.45)}
.fx-candidate-main{display:flex;align-items:center;gap:10px;cursor:pointer;min-width:0;flex:1}
.fx-candidate-main input[type="checkbox"]{width:18px;height:18px;accent-color:#e50914;flex:0 0 18px}
.fx-candidate-text{display:flex;flex-direction:column;min-width:0}
.fx-candidate-text strong{font-size:.88rem;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fx-candidate-count{font-size:.76rem;color:rgba(255,255,255,.58)}
.fx-btn-mini{min-height:32px!important;padding:4px 10px!important;font-size:.78rem!important;border-radius:999px!important}
.fx-btn-mini.is-pinned{background:rgba(229,9,20,.25)!important;border-color:#e50914!important}
.fx-template-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:14px;padding:10px 12px;border-radius:10px;background:#101113;border:1px solid #26292e}
.fx-template-label{font-size:.82rem;font-weight:700;color:rgba(255,255,255,.7);margin-right:4px}
.fx-category-list{display:flex;flex-direction:column;gap:8px;max-height:440px;overflow-y:auto;padding-right:4px}
.fx-category-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border:1px solid #26292e;border-radius:10px;background:#101113}
.fx-category-row.is-editing{border-color:#e50914;background:rgba(229,9,20,.1)}
.fx-category-main{display:flex;flex-direction:column;gap:4px;min-width:200px;flex:1}
.fx-category-main .fx-editor-field{flex-direction:row-reverse;justify-content:flex-end;align-items:center;gap:10px;font-size:.95rem;font-weight:700;color:#fff}
.fx-category-main input{flex:0 0 18px;width:18px;min-height:18px}
.fx-category-meta{font-size:.8rem;color:rgba(255,255,255,.6);padding-left:28px}
.fx-category-actions{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.fx-rule-form{margin:14px 0 18px;padding:18px;border:1px solid rgba(229,9,20,.5);border-radius:12px;background:#101113;display:flex;flex-direction:column;gap:14px}
.fx-rule-form legend{font-weight:800;color:#fff;padding:0 8px;font-size:1rem}
.fx-editor-meta-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
.fx-meta-col{display:flex;flex-direction:column;gap:6px}
.fx-quick-picks{display:flex;flex-wrap:wrap;gap:6px}
.fx-pick-chip{min-height:28px!important;padding:3px 9px!important;font-size:.75rem!important;border-radius:999px!important;background:#1a1c20!important}
.fx-pick-chip.is-selected{background:rgba(229,9,20,.25)!important;border-color:#e50914!important}
.fx-advanced{margin-top:18px;border:1px solid #26292e;border-radius:12px;padding:8px 14px;background:#101113}.fx-advanced>summary{padding:8px 4px;cursor:pointer;font-weight:600}.fx-advanced textarea{margin-top:12px}
.fx-editor-alert{color:#fde047;font-weight:600}
@supports not (aspect-ratio:2/3){.fx-card-portrait .fx-card-visual{height:0;padding-bottom:150%}}
@media(max-width:600px){.fx-card-entry.fx-card-portrait{width:clamp(98px,28vw,136px);flex-basis:clamp(98px,28vw,136px)}.fx-editor-tabs{top:-15px}}
.fx-track{scrollbar-width:none;-ms-overflow-style:none}.fx-track::-webkit-scrollbar{display:none;width:0;height:0}
.fx-shelf{margin-bottom:24px}.fx-row-head{margin-bottom:14px}.fx-name{font-weight:700}
.fx-toolbar{justify-content:space-between;margin:4px 0 22px;position:relative;z-index:5}
.fx-title-picker{position:relative;display:inline-flex;align-items:center;gap:12px;margin:0 auto 0 0;padding:4px 14px 4px 0;border-radius:10px;cursor:pointer;user-select:none;transition:background .15s ease}
.fx-title-picker:hover{background:rgba(255,255,255,.06)}
.fx-title-picker:focus-within{outline:3px solid #fff;outline-offset:3px;box-shadow:0 0 0 5px rgba(229,9,20,.5)}
.fx-toolbar h1{font-size:28px;line-height:34px;font-weight:700;margin:0;border-left:3px solid var(--sleekfin-accent,#e50914);padding-left:10px;color:#fff}
.fx-title-mode{display:inline-flex;align-items:center;padding:6px 14px;border-radius:999px;background:rgba(22,22,24,.82);backdrop-filter:blur(14px);border:1px solid #26292e;font-size:.9rem;font-weight:600;color:#f1f2f4;transition:background .15s ease,border-color .15s ease}
.fx-title-picker:hover .fx-title-mode{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.22);color:#fff}
.fx-title-select{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font:inherit;color:#f1f2f4;background:#101113}
.fx-title-select option{background:#101113;color:#f1f2f4;padding:8px 12px}
.fx-dropdown-menu{position:absolute;left:0;top:calc(100% + 8px);min-width:210px;padding:6px;background:linear-gradient(rgba(255,255,255,.055),rgba(255,255,255,.01)),rgba(22,22,24,.82);backdrop-filter:blur(18px) saturate(140%);-webkit-backdrop-filter:blur(18px) saturate(140%);border:1px solid rgba(255,255,255,.07);border-radius:12px;box-shadow:inset 0 1px rgba(255,255,255,.08),0 16px 40px -6px rgba(0,0,0,.65);display:flex;flex-direction:column;gap:2px;z-index:1000}
.fx-dropdown-menu[hidden]{display:none!important}
.fx-discovery button.fx-dropdown-item{display:flex;align-items:center;justify-content:space-between;width:100%;text-align:left;padding:8px 10px;min-height:38px;border-radius:8px;border:0;background:transparent;color:rgba(255,255,255,.72);font-size:13px;font-weight:500}
.fx-discovery button.fx-dropdown-item:hover{background:rgba(255,255,255,.12);color:#f1f2f4}
.fx-discovery button.fx-dropdown-item.is-selected{background:rgba(255,255,255,.14);color:#fff;font-weight:600}
.fx-profile-settings{display:block;width:100%;padding:18px;text-align:left;background:#1a1c20;color:#f1f2f4;border:1px solid #26292e;border-radius:12px;margin-bottom:14px;font:inherit;font-weight:700;cursor:pointer}

/* Keep Library/Collections Top Subheader Non-Sticky at the Top of the Document & Unify Title Size/Weight */
header.MuiAppBar-root:has(> .MuiToolbar-root + .MuiToolbar-root){
  position:relative!important;
  top:auto!important;
  left:auto!important;
  right:auto!important;
  backdrop-filter:none!important;
  -webkit-backdrop-filter:none!important;
  filter:none!important;
  transform:none!important;
}
header.MuiAppBar-root:has(> .MuiToolbar-root + .MuiToolbar-root) + div[aria-hidden="true"]{
  display:none!important;
  height:0!important;
  min-height:0!important;
}
header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root{min-height:48px!important;padding-inline:var(--sleekfin-page-gutter,clamp(16px,4vw,80px))!important}
header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root > button:first-child::before,
header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root button[aria-controls="library-view-menu"]::before{
  display:none!important;
  content:none!important;
}
header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root button[aria-controls="library-view-menu"],
header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root > button:first-child,
header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root > .MuiTypography-h6{
  font-size:28px!important;
  line-height:34px!important;
  font-weight:700!important;
  color:#fff!important;
  border-left:3px solid var(--sleekfin-accent,#e50914)!important;
  padding:2px 12px 2px 10px!important;
  border-radius:0 10px 10px 0!important;
  text-transform:none!important;
  letter-spacing:normal!important;
  background:transparent!important;
  min-height:36px!important;
  gap:8px!important;
}
header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root button[aria-controls="library-view-menu"] .MuiTypography-root,
header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root > button:first-child .MuiTypography-root{
  font-size:28px!important;
  line-height:34px!important;
  font-weight:700!important;
  color:#fff!important;
  border:0!important;
  padding:0!important;
  margin:0!important;
}
header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root button[aria-controls="library-view-menu"]:hover,
header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root > button:first-child:hover{
  background:rgba(255,255,255,.06)!important;
}
header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root button[aria-controls="library-view-menu"] .MuiButton-endIcon svg,
header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root > button:first-child .MuiButton-endIcon svg{
  font-size:24px!important;
  color:rgba(255,255,255,.78)!important;
}

/* Remove Play All & Shuffle Buttons Across Library Pages (Movies -> Library, Shows -> Library, Collections -> Collections) */
header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root :is(button[title="Play all" i],button[title="Shuffle" i],button[aria-label="Play all" i],button[aria-label="Shuffle" i]),
:is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,.libraryPage) :is(.btnPlayAll,.btnShuffle){
  display:none!important;
}

/* Hide Total Library Item Count Chip on Curated Suggestions, Genres, Live TV, Home & Search (Keep Only on Library/Favorites/Collections Grids) */
html[data-fx-hide-count-chip="true"] header.MuiAppBar-root .MuiChip-root,
html:has(.fx-discovery:not(.fx-mode-full):not([hidden])) header.MuiAppBar-root .MuiChip-root,
html:has(#boxsetsPage:not(.hide) .emby-scroller) header.MuiAppBar-root .MuiChip-root,
html:has(#liveTvSuggestedPage:not(.hide),#liveTvPage:not(.hide)) header.MuiAppBar-root .MuiChip-root{
  display:none!important;
}

/* Suppress Centered Loading Spinner & Top-Right Library Pagination Arrows on Curated Movies/Shows & Genres Tabs */
html[data-fx-curated-tab="true"] :is(.docspinner,.mdl-spinner.docspinner),
html:has(:is(#moviesPage,#tvshowsPage,#tvRecommendedPage):not(.hide) .fx-discovery:not(.fx-mode-full):not([hidden])) :is(.docspinner,.mdl-spinner.docspinner,#moviesPage .MuiCircularProgress-root,#tvshowsPage .MuiCircularProgress-root,#tvRecommendedPage .MuiCircularProgress-root){
  display:none!important;
  opacity:0!important;
  pointer-events:none!important;
}
html[data-fx-curated-tab="true"] header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root > :not(button[aria-controls="library-view-menu"]):not(#library-view-menu),
html:has(:is(#moviesPage,#tvshowsPage,#tvRecommendedPage):not(.hide) .fx-discovery:not(.fx-mode-full):not([hidden])) header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root > :not(button[aria-controls="library-view-menu"]):not(#library-view-menu){
  display:none!important;
}

/* SleekFin Three-Dots Style Dropdown Menus Across All Switchers (Movies, Shows, Live TV, Collections, Season X, Downloads & User Menu) Without Dimming Background */
html.sleekfin-main-ui :is(.MuiPopover-root,.MuiMenu-root,#library-view-menu,#app-user-menu) > .MuiBackdrop-root,
html.sleekfin-main-ui .MuiBackdrop-root.MuiBackdrop-invisible,
.MuiPopover-root > .MuiBackdrop-root,
.MuiMenu-root > .MuiBackdrop-root,
.MuiBackdrop-root.MuiBackdrop-invisible,
html.sleekfin-main-ui .dialogBackdrop:has(+ .dialogContainer .sleekfin-more-menu),
html.sleekfin-main-ui .dialogBackdrop:has(+ .sleekfin-more-menu),
html.sleekfin-main-ui .dialogBackdrop.dialogBackdropOpened:has(+ .dialogContainer .actionSheet){
  background:transparent!important;
  background-color:transparent!important;
  backdrop-filter:none!important;
  -webkit-backdrop-filter:none!important;
  opacity:0!important;
}
.MuiPopover-root .MuiPaper-root,
.MuiMenu-paper,
#library-view-menu .MuiPaper-root,
#app-user-menu .MuiPaper-root,
.dialog.actionSheet{
  background:linear-gradient(rgba(255,255,255,.055),rgba(255,255,255,.01)),rgba(22,22,24,.82)!important;
  backdrop-filter:blur(18px) saturate(140%)!important;
  -webkit-backdrop-filter:blur(18px) saturate(140%)!important;
  border:1px solid rgba(255,255,255,.07)!important;
  border-radius:12px!important;
  box-shadow:inset 0 1px rgba(255,255,255,.08),0 16px 40px -6px rgba(0,0,0,.65)!important;
  color:var(--sleekfin-text,#f1f2f4)!important;
  padding:6px!important;
  overflow:hidden!important;
}
#library-view-menu .MuiPaper-root,
#app-user-menu .MuiPaper-root{
  margin-top:10px!important;
}
.MuiPopover-root .MuiList-root,
#library-view-menu .MuiList-root,
#app-user-menu .MuiList-root{
  padding:0!important;
}
.MuiPopover-root .MuiMenuItem-root,
#library-view-menu .MuiMenuItem-root,
#app-user-menu .MuiMenuItem-root,
.dialog.actionSheet .listItem{
  border-radius:8px!important;
  margin:1px 0!important;
  padding:8px 10px!important;
  border:0!important;
  font-family:var(--sleekfin-font-family,Inter,"Noto Sans",sans-serif)!important;
  font-size:13px!important;
  font-weight:500!important;
  line-height:1.25!important;
  color:rgba(255,255,255,.72)!important;
  min-height:38px!important;
  background:transparent!important;
  transition:background-color .14s ease,color .14s ease!important;
}
.MuiPopover-root .MuiMenuItem-root:hover,
#library-view-menu .MuiMenuItem-root:hover,
#app-user-menu .MuiMenuItem-root:hover,
.dialog.actionSheet .listItem:hover{
  background:rgba(255,255,255,.12)!important;
  color:var(--sleekfin-text,#f1f2f4)!important;
}
.MuiPopover-root .MuiMenuItem-root.Mui-selected,
#library-view-menu .MuiMenuItem-root.Mui-selected,
#app-user-menu .MuiMenuItem-root.Mui-selected{
  background:rgba(255,255,255,.14)!important;
  border:0!important;
  color:#fff!important;
  font-weight:600!important;
}
.MuiPopover-root .MuiMenuItem-root.Mui-selected:hover,
#library-view-menu .MuiMenuItem-root.Mui-selected:hover{
  background:rgba(255,255,255,.18)!important;
}
.MuiPopover-root .MuiDivider-root,
#app-user-menu .MuiDivider-root{
  border-color:rgba(255,255,255,.08)!important;
  margin:5px 4px!important;
}
#app-user-menu .MuiListItemIcon-root{
  color:rgba(255,255,255,.72)!important;
  min-width:30px!important;
}

/* Unify Category Headings Across Home, Movies, Shows, Live TV, Collections (including Genres) & Search (Single Red Bar Only) */
:is(#indexPage,#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) :is(.sectionTitle,.sectionTitle-cards,h2.sectionTitle,a.sectionTitle-cards,.sectionTitleTextButton > .sectionTitle){
  font-size:24px!important;
  line-height:32px!important;
  font-weight:600!important;
  border-left:3px solid var(--sleekfin-accent,#e50914)!important;
  padding-left:10px!important;
  margin:0 auto 0 0!important;
  color:#fff!important;
  opacity:1!important;
}
:is(#indexPage,#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) :is(.sectionTitle,.sectionTitle-cards,h2.sectionTitle,a.sectionTitle-cards,.sectionTitleTextButton > .sectionTitle)::before{
  display:none!important;
  content:none!important;
}
.sleekfin-section-heading :is(.sectionTitle,.sectionTitle-cards,h2,a),
#itemDetailPage :is(.sectionTitle,.sectionTitle-cards,h2.sectionTitle,a.sectionTitle-cards){
  border-left:0!important;
  padding-left:0!important;
}
.sleekfin-section-heading :is(.sectionTitle,.sectionTitle-cards,h2,a)::before,
#itemDetailPage :is(.sectionTitle,.sectionTitle-cards,h2.sectionTitle,a.sectionTitle-cards)::before{
  display:none!important;
  content:none!important;
}
:is(#indexPage,#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) .sectionTitleTextButton{
  padding:0!important;
  margin:0 auto 0 0!important;
  background:transparent!important;
  color:#fff!important;
  opacity:1!important;
  text-decoration:none!important;
}
:is(#indexPage,#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) .sectionTitleTextButton > .material-icons{
  color:rgba(255,255,255,.75)!important;
  opacity:1!important;
}
:is(#indexPage,#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) :is(.sectionTitleContainer,.sectionTitleContainer-cards){
  margin-bottom:14px!important;
  display:flex!important;
  align-items:center!important;
}

/* Season X Selector on Show Detail Pages: Borderless Title + Unified Caret + SleekFin Dropdown */
.sleekfin-details-season-select{
  display:inline-flex!important;
  align-items:center!important;
  gap:8px!important;
  padding:2px 10px 2px 0!important;
  border:0!important;
  outline:0!important;
  box-shadow:none!important;
  background:transparent!important;
  border-radius:0 10px 10px 0!important;
  cursor:pointer!important;
  position:relative!important;
}
.sleekfin-details-season-select:hover{
  background:rgba(255,255,255,.06)!important;
}
.sleekfin-details-season-select .selectContainer{
  margin:0!important;
  padding:0!important;
  border:0!important;
  outline:0!important;
  box-shadow:none!important;
  background:transparent!important;
  display:inline-flex!important;
  align-items:center!important;
}
.sleekfin-details-season-select .selectArrowContainer,
.sleekfin-details-season-select .selectLabel{
  display:none!important;
}
.sleekfin-details-season-select :is(select,.emby-select,.sleekfin-details-season-native){
  appearance:none!important;
  -webkit-appearance:none!important;
  -moz-appearance:none!important;
  border:0!important;
  outline:0!important;
  box-shadow:none!important;
  background:transparent!important;
  padding:0!important;
  margin:0!important;
  font-size:24px!important;
  line-height:32px!important;
  font-weight:700!important;
  color:#fff!important;
  cursor:pointer!important;
  pointer-events:none!important;
  width:auto!important;
}
.sleekfin-details-season-select::after{
  content:""!important;
  position:static!important;
  display:inline-block!important;
  width:24px!important;
  height:24px!important;
  margin-left:2px!important;
  border:0!important;
  transform:none!important;
  background-color:rgba(255,255,255,.78)!important;
  -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") center/24px 24px no-repeat!important;
  mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") center/24px 24px no-repeat!important;
  pointer-events:none!important;
  flex-shrink:0!important;
}

/* Hide A-Z Right Sidebar Across Movies, Shows, and Collections Subpages so Grid Width Matches Everywhere */
:is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage) :is(.alphaPicker,.alphaPicker-fixed-right),
#boxsetsPage > .alphaPicker-fixed-right,
#boxsetsPage:has(.emby-scroller) .alphaPicker-fixed-right,
#boxsetsPage:has(.emby-scroller) .alphaPicker,
:is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage) .padded-bottom-page:has(.noItemsMessage) .alphaPicker-fixed-right,
:is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage):has(.noItemsMessage) > .alphaPicker-fixed-right,
.pageTabContent .alphaPicker,
.pageTabContent .alphaPicker-fixed-right{
  display:none!important;
}

/* Comfortable Spacing for Empty Library / Favorites Views ("Nothing here / No Items are currently available.") */
:is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,.libraryPage) .noItemsMessage{
  display:flex!important;
  flex-direction:column!important;
  align-items:center!important;
  justify-content:center!important;
  gap:16px!important;
  padding:88px 24px!important;
  margin:24px auto!important;
  max-width:520px!important;
  text-align:center!important;
  box-sizing:border-box!important;
}
:is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,.libraryPage) .noItemsMessage :is(h1,.MuiTypography-h1){
  font-size:1.55rem!important;
  line-height:1.3!important;
  font-weight:700!important;
  color:var(--sleekfin-text,#f1f2f4)!important;
  margin:0!important;
}
:is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,.libraryPage) .noItemsMessage :is(p,.MuiTypography-body1){
  font-size:.98rem!important;
  line-height:1.6!important;
  color:var(--sleekfin-muted,#969aa1)!important;
  margin:0!important;
}

/* Unify Horizontal Gutter Alignment, Right Boundary, Vertical Top Spacing & Card Spacing Across Movies, Shows, Live TV, Collections, and Search */
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) .padded-left:not(.sectionTitle):not(.sectionTitle-cards),
html body :is(#boxsetsPage,#moviesPage,#tvshowsPage,#tvRecommendedPage,#searchPage) .verticalSection :is(.sectionTitleContainer,.sectionTitleContainer-cards){
  padding-left:var(--sleekfin-page-gutter,clamp(16px,4vw,80px))!important;
  padding-inline-start:var(--sleekfin-page-gutter,clamp(16px,4vw,80px))!important;
}
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) .padded-right:not(.sectionTitle):not(.sectionTitle-cards),
html body :is(#boxsetsPage,#moviesPage,#tvshowsPage,#tvRecommendedPage,#searchPage) .verticalSection :is(.sectionTitleContainer,.sectionTitleContainer-cards){
  padding-right:calc(var(--sleekfin-page-gutter,clamp(16px,4vw,80px)) + 12px)!important;
  padding-inline-end:calc(var(--sleekfin-page-gutter,clamp(16px,4vw,80px)) + 12px)!important;
}
html body :is(#boxsetsPage,#moviesPage,#tvshowsPage,#tvRecommendedPage,#searchPage) .verticalSection > :is(h2.sectionTitle,.sectionTitle.padded-left,.sectionTitle-cards.padded-left){
  margin-left:var(--sleekfin-page-gutter,clamp(16px,4vw,80px))!important;
  margin-right:calc(var(--sleekfin-page-gutter,clamp(16px,4vw,80px)) + 12px)!important;
  margin-bottom:14px!important;
  padding-left:10px!important;
  padding-inline-start:10px!important;
  padding-right:0!important;
  padding-inline-end:0!important;
}
html body :is(#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) .emby-scroller{
  margin-left:var(--sleekfin-page-gutter,clamp(16px,4vw,80px))!important;
  margin-right:calc(var(--sleekfin-page-gutter,clamp(16px,4vw,80px)) + 12px)!important;
  padding-left:0!important;
  padding-right:0!important;
  padding-inline:0!important;
  box-sizing:border-box!important;
}
html body :is(#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) .emby-scroller .itemsContainer{
  column-gap:14px!important;
}
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) .card :is(.cardBox,.cardBox-bottompadded),
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) :is(.cardBox,.cardBox-bottompadded,.card.portraitCard .cardBox,.card.overflowPortraitCard .cardBox){
  margin:0!important;
  margin-inline-end:0!important;
  margin-bottom:0!important;
}
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) .cardScalable{
  border-radius:9px!important;
  overflow:hidden!important;
}
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage) :is(.padded-top-page,.padded-bottom-page,.content-primary){
  padding-top:0!important;
  padding-left:0!important;
  padding-right:0!important;
  padding-inline:0!important;
  margin-top:0!important;
}
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage) :is(.pageTabContent,.pageTabContent.is-active){
  padding-top:0!important;
  padding-left:0!important;
  padding-right:0!important;
  padding-inline:0!important;
  margin-top:0!important;
}
html body :is(#liveTvSuggestedPage,#liveTvPage) > .padded-bottom-page,
html body #boxsetsPage:not(:has(.fx-discovery)) :is(.padded-top-page,.padded-bottom-page,.content-primary):has(.emby-scroller){
  padding-top:18px!important;
  padding-left:0!important;
  padding-right:0!important;
  padding-inline:0!important;
  margin-top:0!important;
}
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage) .pageTabContent.is-active > .itemsContainer{
  margin-top:0!important;
}
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage):has(.fx-discovery:not(.fx-mode-full):not([hidden])) :is(.padded-top-page,.padded-bottom-page,.pageTabContent,.content-primary){
  padding-top:0!important;
}
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) :is(.padded-right-withalphapicker,.itemsContainer.padded-right-withalphapicker){
  padding-right:calc(var(--sleekfin-page-gutter,clamp(16px,4vw,80px)) + 12px)!important;
  padding-inline-end:calc(var(--sleekfin-page-gutter,clamp(16px,4vw,80px)) + 12px)!important;
}
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage) .itemsContainer.vertical-wrap{
  display:grid!important;
  grid-template-columns:repeat(auto-fill,minmax(clamp(135px,14vw,205px),1fr))!important;
  gap:20px 14px!important;
  padding-top:26px!important;
  padding-left:var(--sleekfin-page-gutter,clamp(16px,4vw,80px))!important;
  padding-inline-start:var(--sleekfin-page-gutter,clamp(16px,4vw,80px))!important;
  padding-right:calc(var(--sleekfin-page-gutter,clamp(16px,4vw,80px)) + 12px)!important;
  padding-inline-end:calc(var(--sleekfin-page-gutter,clamp(16px,4vw,80px)) + 12px)!important;
  padding-bottom:48px!important;
  margin-top:0!important;
  margin-left:0!important;
  margin-right:0!important;
  width:100%!important;
  max-width:none!important;
  box-sizing:border-box!important;
}
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) .emby-scroller .itemsContainer > :is(.portraitCard,.overflowPortraitCard,.card[data-aspect="2/3"]){
  width:clamp(135px,14vw,205px)!important;
  flex:0 0 clamp(135px,14vw,205px)!important;
  max-width:clamp(135px,14vw,205px)!important;
}
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) .emby-scroller .itemsContainer > :is(.backdropCard,.overflowBackdropCard,.sixteenNineCard){
  width:clamp(205px,23vw,310px)!important;
  flex:0 0 clamp(205px,23vw,310px)!important;
  max-width:clamp(205px,23vw,310px)!important;
}
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage) .itemsContainer.vertical-wrap:has(.portraitCard,.overflowPortraitCard){
  display:grid!important;
  grid-template-columns:repeat(auto-fill,minmax(clamp(135px,14vw,205px),1fr))!important;
  gap:20px 14px!important;
}
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage) .itemsContainer.vertical-wrap:has(.backdropCard,.overflowBackdropCard,.sixteenNineCard){
  display:grid!important;
  grid-template-columns:repeat(auto-fill,minmax(clamp(205px,23vw,310px),1fr))!important;
  gap:20px 14px!important;
}
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage) .itemsContainer.vertical-wrap > .card{
  width:100%!important;
  max-width:none!important;
  margin:0!important;
}

html:not(:has(header.MuiAppBar-root)) :is(#moviesPage,#tvshowsPage,#tvRecommendedPage):has(.fx-discovery){padding-top:calc(var(--sleekfin-header-height,72px) + 4px)!important}
html:has(header.MuiAppBar-root) :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage){padding-top:0!important;margin-top:0!important}
#moviesPage:has(.fx-discovery) .content-primary,#tvshowsPage:has(.fx-discovery) .content-primary,#tvRecommendedPage:has(.fx-discovery) .content-primary{padding-top:0!important;margin-top:0!important}
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#searchPage) .cardText-first{padding:6px 2px 0!important;font-weight:700!important}
html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage) .cardText-secondary,html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage) [data-sleekfin-media-meta]{display:none!important}

/* Dedicated Search Page (#searchPage) & Leaving Soon Nav Suppression */
[data-sleekfin-header-proxy] button[data-sleekfin-header-proxy-item="jellyfin:search"]:not([data-sleekfin-header-overflowed="true"]){
  display:inline-flex!important;
}
[data-fx-leaving-hidden="true"],
html body [data-fx-leaving-hidden="true"],
html.sleekfin-header-mounted body [data-fx-leaving-hidden="true"],
html.sleekfin-header-mounted [data-sleekfin-header-proxy] [data-fx-leaving-hidden="true"],
[data-sleekfin-header-proxy] :is(button,a)[title*="Leaving Soon" i],
[data-sleekfin-header-proxy] :is(button,a)[aria-label*="Leaving Soon" i],
[data-sleekfin-header-overflow-drawer] :is(button,a)[title*="Leaving Soon" i],
[data-sleekfin-header-overflow-drawer] :is(button,a)[aria-label*="Leaving Soon" i],
header :is(button,a)[title*="Leaving Soon" i],
header :is(button,a)[aria-label*="Leaving Soon" i],
.mainDrawer :is(button,a)[title*="Leaving Soon" i],
.mainDrawer :is(button,a)[aria-label*="Leaving Soon" i],
.MuiDrawer-root :is(button,a)[title*="Leaving Soon" i],
.MuiDrawer-root :is(button,a)[aria-label*="Leaving Soon" i],
#user-view-overflow-menu :is(a,li)[title*="Leaving Soon" i],
#user-view-overflow-menu :is(a,li)[aria-label*="Leaving Soon" i]{
  display:none!important;
}
#searchPage:is(.hide,.hidePage,[hidden]){
  display:none!important;
}
html:not(:has(header.MuiAppBar-root)) #searchPage#searchPage{
  padding-top:calc(var(--sleekfin-header-height,80px) + 16px)!important;
}
html:has(header.MuiAppBar-root) #searchPage#searchPage{
  padding-top:16px!important;
  margin-top:0!important;
}
#searchPage#searchPage{
  background:var(--sleekfin-bg,#070809)!important;
  min-height:100vh!important;
  box-sizing:border-box!important;
}
#searchPage#searchPage .alphaPicker:empty{
  display:none!important;
}
#searchPage#searchPage .searchFields{
  padding:6px var(--sleekfin-page-gutter,clamp(16px,4vw,80px)) 24px!important;
  padding-inline:var(--sleekfin-page-gutter,clamp(16px,4vw,80px))!important;
  margin:0!important;
  box-sizing:border-box!important;
}
#searchPage#searchPage .searchFieldsInner{
  display:flex!important;
  flex-direction:row!important;
  align-items:center!important;
  justify-content:flex-start!important;
  gap:12px!important;
  max-width:640px!important;
  width:100%!important;
  height:50px!important;
  min-height:50px!important;
  margin:0 auto!important;
  padding:0 18px!important;
  background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.015)),rgba(20,21,25,.92)!important;
  border:1px solid rgba(255,255,255,.13)!important;
  border-radius:999px!important;
  box-shadow:inset 0 1px rgba(255,255,255,.06),0 14px 34px -10px rgba(0,0,0,.6)!important;
  transition:border-color .16s ease,box-shadow .16s ease!important;
  box-sizing:border-box!important;
}
#searchPage#searchPage .searchFieldsInner:focus-within{
  border-color:var(--sleekfin-accent,#e50914)!important;
  box-shadow:0 0 0 3px rgba(229,9,20,.22),0 14px 34px -10px rgba(0,0,0,.68)!important;
}
#searchPage#searchPage .searchFieldsInner .searchfields-icon{
  color:rgba(255,255,255,.65)!important;
  font-size:22px!important;
  width:22px!important;
  height:22px!important;
  margin:0!important;
  padding:0!important;
  position:static!important;
  transform:none!important;
  top:auto!important;
  bottom:auto!important;
  flex:0 0 22px!important;
  -webkit-align-self:center!important;
  align-self:center!important;
  display:inline-flex!important;
  align-items:center!important;
  justify-content:center!important;
  line-height:1!important;
}
#searchPage#searchPage .searchFieldsInner:focus-within .searchfields-icon{
  color:#fff!important;
}
#searchPage#searchPage .searchFieldsInner .inputContainer{
  flex:1 1 auto!important;
  min-width:0!important;
  width:auto!important;
  height:100%!important;
  margin:0!important;
  padding:0!important;
  display:flex!important;
  align-items:center!important;
  background:transparent!important;
  border:0!important;
  box-shadow:none!important;
}
#searchPage#searchPage .searchFieldsInner .inputLabel{
  display:none!important;
}
#searchPage#searchPage :is(#searchTextInput,input.emby-input,input.searchfields-txtSearch,.searchFieldsInner input){
  background:transparent!important;
  border:0!important;
  border-radius:0!important;
  outline:0!important;
  box-shadow:none!important;
  color:#fff!important;
  font-family:var(--sleekfin-font-family,Inter,"Noto Sans",sans-serif)!important;
  font-size:15.5px!important;
  font-weight:500!important;
  line-height:1.3!important;
  height:100%!important;
  min-height:0!important;
  margin:0!important;
  padding:0!important;
  width:100%!important;
  box-sizing:border-box!important;
}
#searchPage#searchPage :is(#searchTextInput,input.emby-input,input.searchfields-txtSearch,.searchFieldsInner input)::placeholder{
  color:rgba(255,255,255,.48)!important;
}
#searchPage#searchPage .searchSuggestions{
  max-width:960px!important;
  width:calc(100% - 2 * var(--sleekfin-page-gutter,clamp(16px,4vw,80px)))!important;
  margin:4px auto 40px!important;
  padding:22px 26px 24px!important;
  background:linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.008)),rgba(17,18,22,.84)!important;
  border:1px solid rgba(255,255,255,.08)!important;
  border-radius:16px!important;
  box-shadow:inset 0 1px rgba(255,255,255,.05),0 16px 40px -12px rgba(0,0,0,.55)!important;
  text-align:left!important;
  box-sizing:border-box!important;
}
#searchPage#searchPage .searchSuggestions > div:first-child{
  margin:0 0 16px!important;
  padding:0!important;
  text-align:left!important;
}
#searchPage#searchPage .searchSuggestions :is(h2,.sectionTitle,.sectionTitle.padded-left){
  display:block!important;
  width:auto!important;
  max-width:100%!important;
  font-size:22px!important;
  line-height:28px!important;
  font-weight:600!important;
  color:#fff!important;
  border-left:3px solid var(--sleekfin-accent,#e50914)!important;
  margin:0!important;
  padding:0 0 0 10px!important;
  padding-block:0!important;
  padding-inline:10px 0!important;
  text-align:left!important;
}
#searchPage#searchPage .searchSuggestionsList{
  display:flex!important;
  flex-wrap:wrap!important;
  justify-content:flex-start!important;
  align-items:center!important;
  gap:10px!important;
  margin:0!important;
  padding:0!important;
  padding-inline:0!important;
}
#searchPage#searchPage .searchSuggestionsList > div{
  margin:0!important;
  display:inline-flex!important;
}
#searchPage#searchPage .searchSuggestionsList a,
#searchPage#searchPage .searchSuggestions a.button-link{
  display:inline-flex!important;
  align-items:center!important;
  padding:8px 16px!important;
  margin:0!important;
  border-radius:999px!important;
  background:rgba(255,255,255,.055)!important;
  border:1px solid rgba(255,255,255,.1)!important;
  color:rgba(255,255,255,.88)!important;
  text-decoration:none!important;
  font-size:13.5px!important;
  font-weight:500!important;
  line-height:1.25!important;
  transition:background .15s ease,border-color .15s ease,color .15s ease,transform .15s ease!important;
}
#searchPage#searchPage .searchSuggestionsList a:hover,
#searchPage#searchPage .searchSuggestions a.button-link:hover{
  background:rgba(229,9,20,.2)!important;
  border-color:var(--sleekfin-accent,#e50914)!important;
  color:#fff!important;
  transform:translateY(-1px)!important;
}
#searchPage#searchPage .searchResults{
  padding:4px 0 56px!important;
  margin:0!important;
}
#searchPage#searchPage .searchResults .verticalSection{
  position:relative!important;
  margin:0 0 28px!important;
  padding:0!important;
}
#searchPage#searchPage .searchResults :is(.sectionTitleContainer,.sectionTitleContainer-cards){
  padding:0!important;
  padding-block:0!important;
  padding-inline:var(--sleekfin-page-gutter,clamp(16px,4vw,80px)) calc(var(--sleekfin-page-gutter,clamp(16px,4vw,80px)) + 12px)!important;
  margin:0 0 14px!important;
}
#searchPage#searchPage .searchResults .verticalSection > :is(h2,.sectionTitle,.sectionTitle-cards){
  display:block!important;
  font-size:24px!important;
  line-height:32px!important;
  font-weight:600!important;
  color:#fff!important;
  border-left:3px solid var(--sleekfin-accent,#e50914)!important;
  margin:0 calc(var(--sleekfin-page-gutter,clamp(16px,4vw,80px)) + 116px) 14px var(--sleekfin-page-gutter,clamp(16px,4vw,80px))!important;
  padding:0 0 0 10px!important;
  padding-block:0!important;
  padding-inline:10px 0!important;
}
#searchPage#searchPage .searchResults .verticalSection > :is(h2,.sectionTitle,.sectionTitle-cards)::before{
  display:none!important;
  content:none!important;
}
#searchPage#searchPage .searchResults .emby-scrollbuttons{
  position:absolute!important;
  top:0!important;
  right:calc(var(--sleekfin-page-gutter,clamp(16px,4vw,80px)) + 12px)!important;
  left:auto!important;
  height:32px!important;
  min-height:32px!important;
  min-width:0!important;
  padding:0!important;
  margin:0!important;
  display:inline-flex!important;
  align-items:center!important;
  gap:4px!important;
  z-index:2!important;
}
#searchPage#searchPage .searchResults .emby-scroller{
  margin:0 calc(var(--sleekfin-page-gutter,clamp(16px,4vw,80px)) + 12px) 0 var(--sleekfin-page-gutter,clamp(16px,4vw,80px))!important;
  padding:4px 0 12px!important;
  padding-inline:0!important;
  box-sizing:border-box!important;
}
#searchPage#searchPage .searchResults .emby-scroller .itemsContainer{
  column-gap:14px!important;
  gap:14px!important;
}
#searchPage#searchPage .searchResults .emby-scroller .itemsContainer > :is(.squareCard,.overflowSquareCard){
  width:clamp(135px,14vw,195px)!important;
  flex:0 0 clamp(135px,14vw,195px)!important;
  max-width:clamp(135px,14vw,195px)!important;
}

/* Download Quality & Season Selector Dropdown Menu (Unified with SleekFin More Menu & Download Button) */
@keyframes fx-dropdown-enter{
  from{opacity:0;transform:translateY(-6px) scale(.96)}
  to{opacity:1;transform:translateY(0) scale(1)}
}
.fx-download-menu{
  position:fixed;
  z-index:100005;
  width:min(190px,86vw);
  padding:6px;
  background:linear-gradient(rgba(255,255,255,.055),rgba(255,255,255,.01)),rgba(22,22,24,.82);
  backdrop-filter:blur(18px) saturate(140%);
  -webkit-backdrop-filter:blur(18px) saturate(140%);
  border:1px solid rgba(255,255,255,.07);
  border-radius:12px;
  box-shadow:inset 0 1px rgba(255,255,255,.08),0 16px 40px -6px rgba(0,0,0,.65);
  display:flex;
  flex-direction:column;
  gap:2px;
  box-sizing:border-box;
  transform-origin:top left;
  animation:fx-dropdown-enter .16s cubic-bezier(.22,1,.36,1);
}
.fx-download-menu.fx-season-menu{
  width:min(210px,86vw);
  max-height:min(340px,70vh);
  overflow-y:auto;
}
.fx-download-option,
a.fx-download-option{
  display:flex!important;
  flex-direction:row!important;
  align-items:center!important;
  justify-content:flex-start!important;
  width:100%!important;
  text-align:left!important;
  text-decoration:none!important;
  padding:8px 10px!important;
  min-height:38px!important;
  border-radius:8px!important;
  border:0!important;
  background:transparent!important;
  color:rgba(255,255,255,.72)!important;
  font-family:var(--sleekfin-font-family,Inter,"Noto Sans",sans-serif)!important;
  font-size:13px!important;
  font-weight:500!important;
  line-height:1.25!important;
  cursor:pointer!important;
  box-sizing:border-box!important;
  transition:background-color .14s ease,color .14s ease!important;
}
.fx-download-option:hover,
a.fx-download-option:hover{
  background:rgba(255,255,255,.12)!important;
  color:var(--sleekfin-text,#f1f2f4)!important;
  text-decoration:none!important;
}
.fx-download-option.is-selected,
a.fx-download-option.is-selected{
  background:rgba(255,255,255,.14)!important;
  color:#fff!important;
  font-weight:600!important;
  text-decoration:none!important;
}

/* Sign-In Page (#loginPage) Styled to Match SleekFin & Discovery Monochrome Dark Glass UI */
#loginPage:is(.hide,.hidePage,[hidden]),
#loginPage#loginPage:is(.hide,.hidePage,[hidden]){
  display:none!important;
}
#loginPage:not(.hide):not(.hidePage):not([hidden]),
#loginPage#loginPage:not(.hide):not(.hidePage):not([hidden]){
  background:radial-gradient(circle at 50% 18%,rgba(229,9,20,.12),transparent 52%),var(--sleekfin-bg,#070809)!important;
  min-height:100vh!important;
  min-height:100dvh!important;
  display:flex!important;
  flex-direction:column!important;
  align-items:center!important;
  justify-content:flex-start!important;
  padding:clamp(16px,3.5vh,40px) clamp(12px,3vw,32px)!important;
  overflow-y:auto!important;
  overflow-x:hidden!important;
  box-sizing:border-box!important;
}
#loginPage#loginPage > :is(.padded-left.padded-right,.content-primary){
  --fx-login-cols:5;
  --fx-login-gap:clamp(12px,1.6vw,20px);
  --fx-login-card-max:168px;
  --fx-login-box-max:1004px;
  max-width:var(--fx-login-box-max)!important;
  width:min(var(--fx-login-box-max),94vw)!important;
  margin:auto!important;
  padding:clamp(22px,3.2vw,34px) clamp(18px,3vw,32px)!important;
  background:linear-gradient(rgba(255,255,255,.04),rgba(255,255,255,.01)),rgba(16,17,19,.88)!important;
  backdrop-filter:blur(20px) saturate(140%)!important;
  -webkit-backdrop-filter:blur(20px) saturate(140%)!important;
  border:1px solid #26292e!important;
  border-radius:18px!important;
  box-shadow:inset 0 1px rgba(255,255,255,.07),0 24px 64px rgba(0,0,0,.65)!important;
  box-sizing:border-box!important;
}
/* Even user-row splits: 1x1, 1x2, 1x3, 1x4, 1x5, 2x3 (6), 1x7 (7), 2x4 (8), 3x3 (9), 2x5+ (10+, max 5 per row) */
#loginPage#loginPage > :is(.padded-left.padded-right,.content-primary):has(#divUsers > .card:nth-child(1):last-child){
  --fx-login-cols:1;
  --fx-login-card-max:176px;
  --fx-login-box-max:440px;
}
#loginPage#loginPage > :is(.padded-left.padded-right,.content-primary):has(#divUsers > .card:nth-child(2):last-child){
  --fx-login-cols:2;
  --fx-login-card-max:174px;
  --fx-login-box-max:490px;
}
#loginPage#loginPage > :is(.padded-left.padded-right,.content-primary):is(:has(#divUsers > .card:nth-child(3):last-child),:has(#divUsers > .card:nth-child(6):last-child),:has(#divUsers > .card:nth-child(9):last-child)){
  --fx-login-cols:3;
  --fx-login-card-max:172px;
  --fx-login-box-max:640px;
}
#loginPage#loginPage > :is(.padded-left.padded-right,.content-primary):is(:has(#divUsers > .card:nth-child(4):last-child),:has(#divUsers > .card:nth-child(8):last-child)){
  --fx-login-cols:4;
  --fx-login-card-max:170px;
  --fx-login-box-max:824px;
}
#loginPage#loginPage > :is(.padded-left.padded-right,.content-primary):has(#divUsers > .card:nth-child(5):last-child){
  --fx-login-cols:5;
  --fx-login-card-max:168px;
  --fx-login-box-max:1004px;
}
#loginPage#loginPage > :is(.padded-left.padded-right,.content-primary):has(#divUsers > .card:nth-child(7):last-child){
  --fx-login-cols:7;
  --fx-login-card-max:148px;
  --fx-login-box-max:1184px;
}
#loginPage#loginPage > :is(.padded-left.padded-right,.content-primary):is(:has(.manualLoginForm:not(.hide)),:not(:has(.visualLoginForm:not(.hide))),:not(:has(#divUsers:not(:empty)))){
  --fx-login-box-max:450px;
}
#loginPage#loginPage .manualLoginForm{
  max-width:420px!important;
  width:100%!important;
  margin:0 auto!important;
  padding:0!important;
  background:transparent!important;
  border:0!important;
  box-shadow:none!important;
  box-sizing:border-box!important;
}
#loginPage#loginPage .manualLoginForm > .padded-left.padded-right{
  padding:0!important;
  margin:0!important;
  justify-content:flex-start!important;
}
#loginPage#loginPage .visualLoginForm{
  max-width:100%!important;
  width:100%!important;
  margin:0 auto!important;
  padding:0!important;
  background:transparent!important;
  border:0!important;
  box-shadow:none!important;
  box-sizing:border-box!important;
}
#loginPage#loginPage .readOnlyContent{
  max-width:460px!important;
  width:100%!important;
  margin:6px auto 0!important;
  padding:0!important;
  display:flex!important;
  flex-wrap:wrap!important;
  justify-content:center!important;
  gap:8px!important;
  background:transparent!important;
  border:0!important;
  box-shadow:none!important;
  box-sizing:border-box!important;
}
#loginPage#loginPage .readOnlyContent > :is(button,.raised){
  flex:1 1 170px!important;
  max-width:220px!important;
  margin:0!important;
}
#loginPage#loginPage .readOnlyContent > .hide{
  display:none!important;
}
#loginPage#loginPage .loginDisclaimerContainer{
  flex:1 1 100%!important;
  width:100%!important;
  text-align:center!important;
}
#loginPage#loginPage :is(h1,.sectionTitle,.sectionTitle-cards){
  font-size:clamp(22px,2.4vw,26px)!important;
  line-height:1.25!important;
  font-weight:700!important;
  color:#fff!important;
  border-left:3px solid var(--sleekfin-accent,#e50914)!important;
  padding-left:10px!important;
  margin:0 0 clamp(16px,2.2vh,22px)!important;
  text-align:left!important;
}
#loginPage#loginPage .inputLabel{
  font-size:13px!important;
  font-weight:600!important;
  color:rgba(255,255,255,.82)!important;
  margin-bottom:6px!important;
}
#loginPage#loginPage :is(input.emby-input,.inputContainer input){
  background:#0b0b0c!important;
  color:#f1f2f4!important;
  border:1px solid #26292e!important;
  border-radius:10px!important;
  padding:11px 14px!important;
  min-height:44px!important;
  font-size:14px!important;
  box-sizing:border-box!important;
  transition:border-color .15s ease,box-shadow .15s ease!important;
}
#loginPage#loginPage :is(input.emby-input:focus,.inputContainer input:focus){
  outline:none!important;
  border-color:var(--sleekfin-accent,#e50914)!important;
  box-shadow:0 0 0 3px rgba(229,9,20,.22)!important;
}
#loginPage#loginPage :is(.button-submit,button[type="submit"]){
  background:var(--sleekfin-accent,#e50914)!important;
  border:1px solid #ff2c37!important;
  color:#fff!important;
  font-weight:700!important;
  font-size:14px!important;
  border-radius:10px!important;
  min-height:44px!important;
  margin-top:10px!important;
  transition:background .15s ease!important;
}
#loginPage#loginPage :is(.button-submit:hover,button[type="submit"]:hover){
  background:#f6121d!important;
}
#loginPage#loginPage :is(.raised:not(.button-submit),.btnCancel,.btnManual,.btnForgotPassword){
  background:#1a1c20!important;
  border:1px solid #26292e!important;
  color:#f1f2f4!important;
  border-radius:10px!important;
  min-height:42px!important;
  margin-top:8px!important;
}
#loginPage#loginPage .readOnlyContent > :is(.raised:not(.button-submit),.btnManual,.btnForgotPassword){
  margin-top:0!important;
}
#loginPage#loginPage :is(.raised:not(.button-submit):hover,.btnCancel:hover,.btnManual:hover,.btnForgotPassword:hover){
  background:#26292e!important;
}
#loginPage#loginPage .checkboxOutline{
  border-color:#26292e!important;
  background:#0b0b0c!important;
  border-radius:5px!important;
}
#loginPage#loginPage #divUsers{
  display:flex!important;
  flex-wrap:wrap!important;
  justify-content:center!important;
  align-items:stretch!important;
  gap:var(--fx-login-gap,18px)!important;
  width:100%!important;
  margin:clamp(12px,2vh,18px) 0 clamp(16px,2.4vh,22px)!important;
  padding:0!important;
  box-sizing:border-box!important;
}
#loginPage#loginPage #divUsers > .card{
  display:flex!important;
  flex-direction:column!important;
  flex:0 1 calc((100% - (var(--fx-login-cols,5) - 1) * var(--fx-login-gap,18px) - 1px) / var(--fx-login-cols,5))!important;
  width:calc((100% - (var(--fx-login-cols,5) - 1) * var(--fx-login-gap,18px) - 1px) / var(--fx-login-cols,5))!important;
  max-width:var(--fx-login-card-max,168px)!important;
  min-width:0!important;
  margin:0!important;
  padding:0!important;
  border:0!important;
  background:transparent!important;
  appearance:none!important;
  -webkit-appearance:none!important;
  cursor:pointer!important;
  box-sizing:border-box!important;
}
#loginPage#loginPage #divUsers .cardBox{
  flex:1 1 auto!important;
  display:flex!important;
  flex-direction:column!important;
  width:100%!important;
  margin:0!important;
  padding:0!important;
  background:#16181b!important;
  border:1px solid #26292e!important;
  border-radius:14px!important;
  overflow:hidden!important;
  transition:border-color .16s ease,transform .16s ease,box-shadow .16s ease!important;
}
#loginPage#loginPage #divUsers .card:hover .cardBox,
#loginPage#loginPage #divUsers .card:focus-visible .cardBox{
  border-color:var(--sleekfin-accent,#e50914)!important;
  transform:translateY(-2px)!important;
  box-shadow:0 12px 28px rgba(0,0,0,.45)!important;
}
#loginPage#loginPage #divUsers .cardScalable{
  width:100%!important;
  aspect-ratio:1/1!important;
}
#loginPage#loginPage #divUsers .cardImageIcon.person{
  font-size:clamp(38px,5vw,62px)!important;
}
#loginPage#loginPage #divUsers :is(.cardFooter,.innerCardFooter){
  flex:1 1 auto!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  padding:clamp(8px,1.2vw,11px) 8px clamp(9px,1.4vw,12px)!important;
  background:#16181b!important;
  text-align:center!important;
}
#loginPage#loginPage #divUsers :is(.cardText,.cardText-first,.cardText button,.cardText a){
  font-size:clamp(12.5px,1.2vw,14px)!important;
  line-height:1.3!important;
  font-weight:600!important;
  color:#f1f2f4!important;
  text-align:center!important;
  white-space:normal!important;
  overflow:visible!important;
  text-overflow:clip!important;
  word-break:break-word!important;
  padding:0!important;
  margin:0!important;
  width:100%!important;
}
@media(max-width:920px){
  #loginPage#loginPage > :is(.padded-left.padded-right,.content-primary):has(#divUsers > .card:nth-child(7):last-child){
    --fx-login-cols:4;
    --fx-login-card-max:164px;
    --fx-login-box-max:780px;
  }
}
@media(max-width:680px){
  #loginPage#loginPage > :is(.padded-left.padded-right,.content-primary):is(:has(#divUsers > .card:nth-child(4):last-child),:has(#divUsers > .card:nth-child(8):last-child)){
    --fx-login-cols:2;
    --fx-login-card-max:172px;
    --fx-login-box-max:460px;
  }
  #loginPage#loginPage > :is(.padded-left.padded-right,.content-primary):is(:has(#divUsers > .card:nth-child(5):last-child),:has(#divUsers > .card:nth-child(7):last-child),:has(#divUsers > .card:nth-child(10))){
    --fx-login-cols:3;
    --fx-login-card-max:166px;
    --fx-login-box-max:600px;
  }
}
@media(max-width:460px){
  #loginPage#loginPage > :is(.padded-left.padded-right,.content-primary):not(:has(#divUsers > .card:nth-child(1):last-child)){
    --fx-login-cols:2;
    --fx-login-gap:12px;
    --fx-login-card-max:168px;
  }
  #loginPage#loginPage .readOnlyContent > :is(button,.raised){
    flex:1 1 100%!important;
    max-width:100%!important;
  }
}
@media(max-height:700px){
  #loginPage#loginPage:not(.hide):not(.hidePage):not([hidden]){
    padding:12px 14px!important;
  }
  #loginPage#loginPage > :is(.padded-left.padded-right,.content-primary){
    padding:18px 20px!important;
  }
  #loginPage#loginPage #divUsers{
    margin:10px 0 14px!important;
  }
}

/* Standardize Profile & Settings Pages (Profile, Settings, Quick Connect, Display, Home, Playback, Subtitles, Controls) */
:is(#userProfilePage,#myPreferencesMenuPage,#quickConnectPreferencesPage,#displayPreferencesPage,#homeScreenPreferencesPage,#languagePreferencesPage,#subtitlePreferencesPage,#controlsPreferencesPage,.userPreferencesPage) .readOnlyContent,
:is(#userProfilePage,#myPreferencesMenuPage,#quickConnectPreferencesPage,#displayPreferencesPage,#homeScreenPreferencesPage,#languagePreferencesPage,#subtitlePreferencesPage,#controlsPreferencesPage,.userPreferencesPage) .content-primary{
  max-width:1040px!important;
  width:100%!important;
  margin:0 auto!important;
  padding:18px var(--sleekfin-page-gutter,clamp(16px,4vw,80px)) 56px!important;
  box-sizing:border-box!important;
}
:is(#userProfilePage,#myPreferencesMenuPage,#quickConnectPreferencesPage,#displayPreferencesPage,#homeScreenPreferencesPage,#languagePreferencesPage,#subtitlePreferencesPage,#controlsPreferencesPage,.userPreferencesPage) :is(.verticalSection,.detailSection){
  background:#101113!important;
  border:1px solid #26292e!important;
  border-radius:16px!important;
  padding:22px 24px!important;
  margin:0 0 20px!important;
  box-shadow:0 10px 28px rgba(0,0,0,.28)!important;
  box-sizing:border-box!important;
}
:is(#userProfilePage,#myPreferencesMenuPage,#quickConnectPreferencesPage,#displayPreferencesPage,#homeScreenPreferencesPage,#languagePreferencesPage,#subtitlePreferencesPage,#controlsPreferencesPage,.userPreferencesPage) :is(.sectionTitle,h1,h2.sectionTitle,h2.username){
  font-size:24px!important;
  line-height:32px!important;
  font-weight:700!important;
  color:#fff!important;
  border-left:3px solid var(--sleekfin-accent,#e50914)!important;
  padding-left:10px!important;
  margin:0 0 16px!important;
}
:is(#myPreferencesMenuPage,.userPreferencesPage) .listItem-border{
  background:#1a1c20!important;
  border:1px solid #26292e!important;
  border-radius:12px!important;
  margin:0 0 10px!important;
  padding:10px 14px!important;
  transition:background .15s ease,border-color .15s ease!important;
}
:is(#myPreferencesMenuPage,.userPreferencesPage) .listItem-border:hover{
  background:#26292e!important;
  border-color:rgba(255,255,255,.2)!important;
}
:is(#userProfilePage,#myPreferencesMenuPage,#quickConnectPreferencesPage,#displayPreferencesPage,#homeScreenPreferencesPage,#languagePreferencesPage,#subtitlePreferencesPage,#controlsPreferencesPage,.userPreferencesPage) :is(input.emby-input,select.emby-select,.inputContainer input,.selectContainer select){
  background:#0b0b0c!important;
  color:#f1f2f4!important;
  border:1px solid #26292e!important;
  border-radius:10px!important;
  padding:10px 12px!important;
  min-height:42px!important;
  box-sizing:border-box!important;
}
:is(#userProfilePage,#myPreferencesMenuPage,#quickConnectPreferencesPage,#displayPreferencesPage,#homeScreenPreferencesPage,#languagePreferencesPage,#subtitlePreferencesPage,#controlsPreferencesPage,.userPreferencesPage) :is(input.emby-input:focus,select.emby-select:focus){
  outline:none!important;
  border-color:var(--sleekfin-accent,#e50914)!important;
  box-shadow:0 0 0 3px rgba(229,9,20,.22)!important;
}
:is(#userProfilePage,#myPreferencesMenuPage,#quickConnectPreferencesPage,#displayPreferencesPage,#homeScreenPreferencesPage,#languagePreferencesPage,#subtitlePreferencesPage,#controlsPreferencesPage,.userPreferencesPage) :is(.button-submit,.btnSave){
  background:var(--sleekfin-accent,#e50914)!important;
  border:1px solid #ff2c37!important;
  color:#fff!important;
  font-weight:700!important;
  border-radius:10px!important;
  min-height:42px!important;
  padding:10px 20px!important;
}
:is(#userProfilePage,#myPreferencesMenuPage,#quickConnectPreferencesPage,#displayPreferencesPage,#homeScreenPreferencesPage,#languagePreferencesPage,#subtitlePreferencesPage,#controlsPreferencesPage,.userPreferencesPage) :is(.button-submit:hover,.btnSave:hover){
  background:#f6121d!important;
}

/* Responsive Half-Screen Mode Polish for Jellyfin Discovery Inline Studio */
.fx-inline-studio,.fx-visual-editor,.fx-editor-section,.fx-rule-form{
  max-width:100%!important;
  min-width:0!important;
  box-sizing:border-box!important;
}
.fx-candidate-grid{
  grid-template-columns:repeat(auto-fill,minmax(min(220px,100%),1fr))!important;
}
.fx-editor-meta-grid{
  grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr))!important;
}
.fx-explorer-search input,.fx-library-toolbar input{
  min-width:min(180px,100%)!important;
}
.fx-category-main{
  min-width:min(160px,100%)!important;
}

/* Settings Row Parity, Legacy Home Settings Toggle, Download Toast & Mobile OSD Gesture Pill */
button.fx-settings-menu-row{
  display:flex!important;
  flex-direction:row!important;
  align-items:center!important;
  justify-content:flex-start!important;
  width:100%!important;
  text-align:left!important;
  cursor:pointer!important;
  font:inherit!important;
  color:#f1f2f4!important;
  box-sizing:border-box!important;
  appearance:none!important;
  -webkit-appearance:none!important;
}
button.fx-settings-menu-row .listItemIcon{
  color:rgba(255,255,255,.76)!important;
  font-size:22px!important;
  margin-right:16px!important;
  flex:0 0 auto!important;
}
button.fx-settings-menu-row .listItemBody{
  flex:1 1 auto!important;
  min-width:0!important;
  padding:0!important;
}
button.fx-settings-menu-row .listItemBodyText{
  font-size:15px!important;
  font-weight:500!important;
  color:#f1f2f4!important;
  margin:0!important;
}
.fx-legacy-home-settings{
  margin:20px 0 0!important;
  background:#101113!important;
  border:1px solid #26292e!important;
  border-radius:16px!important;
  padding:14px 18px!important;
  box-sizing:border-box!important;
}
.fx-legacy-home-settings > summary{
  cursor:pointer!important;
  font-size:14px!important;
  font-weight:600!important;
  color:rgba(255,255,255,.78)!important;
  padding:4px 2px!important;
  user-select:none!important;
}
.fx-legacy-home-settings[open] > summary{
  margin-bottom:16px!important;
  color:#fff!important;
}
.fx-toast{
  position:fixed;
  left:50%;
  bottom:calc(88px + env(safe-area-inset-bottom,0px));
  transform:translateX(-50%) translateY(8px);
  opacity:0;
  pointer-events:none;
  z-index:100020;
  padding:10px 18px;
  border-radius:999px;
  background:linear-gradient(rgba(255,255,255,.08),rgba(255,255,255,.02)),rgba(18,19,23,.92);
  backdrop-filter:blur(18px) saturate(140%);
  -webkit-backdrop-filter:blur(18px) saturate(140%);
  border:1px solid rgba(255,255,255,.14);
  box-shadow:0 14px 36px rgba(0,0,0,.6);
  color:#fff;
  font-size:13.5px;
  font-weight:600;
  white-space:nowrap;
  max-width:calc(100vw - 32px);
  overflow:hidden;
  text-overflow:ellipsis;
  transition:opacity .18s ease,transform .18s ease;
}
.fx-toast.is-visible{
  opacity:1;
  transform:translateX(-50%) translateY(0);
}
.fx-osd-gesture-pill{
  position:fixed;
  z-index:100015;
  pointer-events:none;
  padding:9px 18px;
  border-radius:999px;
  background:rgba(14,15,18,.78);
  backdrop-filter:blur(14px) saturate(140%);
  -webkit-backdrop-filter:blur(14px) saturate(140%);
  border:1px solid rgba(255,255,255,.16);
  box-shadow:0 10px 28px rgba(0,0,0,.55);
  color:#fff;
  font-size:14px;
  font-weight:700;
  letter-spacing:.02em;
  opacity:0;
  transition:opacity .14s ease,transform .14s ease;
}
.fx-osd-gesture-pill[hidden]{
  display:none!important;
}
.fx-osd-gesture-pill[data-pos="top"],
.fx-osd-gesture-pill:not([data-pos]),
.fx-osd-gesture-pill-speed{
  top:calc(22px + env(safe-area-inset-top,0px));
  left:50%;
  transform:translateX(-50%) scale(.96);
}
.fx-osd-gesture-pill[data-pos="top"].is-visible,
.fx-osd-gesture-pill:not([data-pos]).is-visible,
.fx-osd-gesture-pill-speed.is-visible{
  opacity:1;
  transform:translateX(-50%) scale(1);
}
.fx-osd-gesture-pill[data-pos="right"],
.fx-osd-gesture-pill-right{
  top:50%;
  right:12%;
  transform:translateY(-50%) scale(.94);
}
.fx-osd-gesture-pill[data-pos="right"].is-visible,
.fx-osd-gesture-pill-right.is-visible{
  opacity:1;
  transform:translateY(-50%) scale(1);
}
.fx-osd-gesture-pill[data-pos="left"],
.fx-osd-gesture-pill-left{
  top:50%;
  left:12%;
  transform:translateY(-50%) scale(.94);
}
.fx-osd-gesture-pill[data-pos="left"].is-visible,
.fx-osd-gesture-pill-left.is-visible{
  opacity:1;
  transform:translateY(-50%) scale(1);
}

/* Smooth Touch Scrolling on Native Scrollers */
.emby-scroller{
  -webkit-overflow-scrolling:touch;
  overscroll-behavior-x:contain;
}

/* Mobile Layout, Bottom Nav Priority, Overflow Prevention, Compact Cards & Detail Button Alignment */
@media(max-width:899px){
  html,body{
    max-width:100%;
    overflow-x:clip;
  }
  .mainAnimatedPages,
  .page:not(#videoOsdPage),
  #indexPage,
  #moviesPage,
  #tvshowsPage,
  #tvRecommendedPage,
  #boxsetsPage,
  #searchPage,
  #itemDetailPage,
  #userProfilePage,
  #myPreferencesMenuPage,
  #quickConnectPreferencesPage,
  #displayPreferencesPage,
  #homeScreenPreferencesPage,
  #languagePreferencesPage,
  #subtitlePreferencesPage,
  #controlsPreferencesPage,
  .userPreferencesPage{
    max-width:100vw!important;
    box-sizing:border-box!important;
    overflow-x:clip!important;
  }
  :is(#userProfilePage,#myPreferencesMenuPage,#quickConnectPreferencesPage,#displayPreferencesPage,#homeScreenPreferencesPage,#languagePreferencesPage,#subtitlePreferencesPage,#controlsPreferencesPage,.userPreferencesPage) .readOnlyContent,
  :is(#userProfilePage,#myPreferencesMenuPage,#quickConnectPreferencesPage,#displayPreferencesPage,#homeScreenPreferencesPage,#languagePreferencesPage,#subtitlePreferencesPage,#controlsPreferencesPage,.userPreferencesPage) .content-primary{
    padding:16px 14px calc(96px + env(safe-area-inset-bottom,0px))!important;
    max-width:100%!important;
  }
  :is(#userProfilePage,#myPreferencesMenuPage,#quickConnectPreferencesPage,#displayPreferencesPage,#homeScreenPreferencesPage,#languagePreferencesPage,#subtitlePreferencesPage,#controlsPreferencesPage,.userPreferencesPage) :is(.verticalSection,.detailSection){
    padding:16px!important;
    max-width:100%!important;
  }
  .fx-discovery{
    padding-bottom:calc(96px + env(safe-area-inset-bottom,0px))!important;
  }
  html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage) .itemsContainer.vertical-wrap{
    padding-bottom:calc(96px + env(safe-area-inset-bottom,0px))!important;
  }
  #searchPage#searchPage .searchResults{
    padding-bottom:calc(96px + env(safe-area-inset-bottom,0px))!important;
  }
  html.sleekfin-details-mounted #itemDetailPage[data-sleekfin-details] .detailPageSecondaryContainer{
    padding-bottom:calc(96px + env(safe-area-inset-bottom,0px))!important;
  }
  /* Prioritize Home, Movies, and Shows on the Mobile Bottom Bar; Overflow Collections, Discover, Live TV & Settings into Menu */
  html.sleekfin-header-mounted [data-sleekfin-header] [data-sleekfin-header-proxy]{
    max-width:min(calc(100vw - 20px),348px)!important;
  }
  header.MuiAppBar-root:has(> .MuiToolbar-root + .MuiToolbar-root) > .MuiToolbar-root[data-sleekfin-header-toolbar]:not(:has([data-sleekfin-header-brand])){
    height:auto!important;
    min-height:10px!important;
    padding-top:env(safe-area-inset-top,0px)!important;
    padding-bottom:0!important;
  }
}
@media(max-width:360px){
  html.sleekfin-header-mounted [data-sleekfin-header] [data-sleekfin-header-proxy] > button[data-sleekfin-header-zone="tabs"]{
    padding-inline:9px!important;
    font-size:12px!important;
  }
}

@media(max-width:768px){
  .fx-discovery{
    padding-inline:14px!important;
  }
  .fx-inline-studio{
    padding:16px 14px!important;
  }
  .fx-editor-section{
    padding:14px!important;
  }
  .fx-rule-form{
    padding:14px!important;
  }
  .fx-toolbar h1,
  header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root button[aria-controls="library-view-menu"],
  header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root button[aria-controls="library-view-menu"] .MuiTypography-root,
  header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root > button:first-child,
  header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root > button:first-child .MuiTypography-root,
  header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root > .MuiTypography-h6{font-size:22px!important;line-height:28px!important}
  header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root{padding-inline:14px!important}
  .fx-row-head h2,:is(#indexPage,#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) :is(.sectionTitle,.sectionTitle-cards,h2.sectionTitle,a.sectionTitle-cards,.sectionTitleTextButton > .sectionTitle){font-size:18.5px!important;line-height:25px!important}
  .fx-shelf{margin-bottom:20px}
  .fx-row-head{margin-bottom:10px}
  .fx-track{gap:10px;padding:2px 2px 10px}
  .fx-card-entry{
    width:clamp(154px,44vw,215px)!important;
    flex:0 0 clamp(154px,44vw,215px)!important;
  }
  .fx-card-entry.fx-card-portrait{
    width:clamp(98px,28vw,136px)!important;
    flex:0 0 clamp(98px,28vw,136px)!important;
  }
  .fx-name,
  html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#searchPage) .cardText-first{
    font-size:12.5px!important;
    margin-top:6px!important;
  }
  .fx-badge{
    font-size:10.5px!important;
    padding:2px 7px!important;
  }
  .fx-see-more-arrow{
    width:38px!important;
    height:38px!important;
    font-size:1.2rem!important;
  }
  .fx-see-more-label{
    font-size:.88rem!important;
  }
  .fx-see-more-sub{
    font-size:.72rem!important;
  }
  html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) .emby-scroller .itemsContainer{
    column-gap:10px!important;
    gap:10px!important;
  }
  html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) .emby-scroller .itemsContainer > :is(.portraitCard,.overflowPortraitCard,.card[data-aspect="2/3"]){
    width:clamp(98px,28vw,136px)!important;
    flex:0 0 clamp(98px,28vw,136px)!important;
    max-width:clamp(98px,28vw,136px)!important;
  }
  html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage,#searchPage) .emby-scroller .itemsContainer > :is(.backdropCard,.overflowBackdropCard,.sixteenNineCard){
    width:clamp(154px,44vw,215px)!important;
    flex:0 0 clamp(154px,44vw,215px)!important;
    max-width:clamp(154px,44vw,215px)!important;
  }
  #searchPage#searchPage .searchResults .emby-scroller .itemsContainer > :is(.squareCard,.overflowSquareCard){
    width:clamp(98px,28vw,136px)!important;
    flex:0 0 clamp(98px,28vw,136px)!important;
    max-width:clamp(98px,28vw,136px)!important;
  }
  html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage) .itemsContainer.vertical-wrap,
  html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage) .itemsContainer.vertical-wrap:has(.portraitCard,.overflowPortraitCard){
    grid-template-columns:repeat(3,minmax(0,1fr))!important;
    gap:14px 10px!important;
    padding-top:16px!important;
    padding-left:14px!important;
    padding-inline-start:14px!important;
    padding-right:14px!important;
    padding-inline-end:14px!important;
  }
  html body :is(#moviesPage,#tvshowsPage,#tvRecommendedPage,#boxsetsPage,#liveTvSuggestedPage,#liveTvPage) .itemsContainer.vertical-wrap:has(.backdropCard,.overflowBackdropCard,.sixteenNineCard){
    grid-template-columns:repeat(2,minmax(0,1fr))!important;
    gap:14px 10px!important;
  }
  #searchPage#searchPage .searchFields{
    padding:6px 14px 18px!important;
  }
  #searchPage#searchPage .searchSuggestions{
    width:calc(100% - 28px)!important;
    padding:16px!important;
  }
  .fx-header-search.is-open{width:clamp(180px,56vw,280px)}
  .fx-search-grid{grid-template-columns:repeat(auto-fill,minmax(44vw,1fr))}
}

@media(max-width:767px){
  /* Clean Two-Row Media Detail Actions on Mobile: Row 1 = Play + Download, Row 2 = Centered Icon Actions */
  #itemDetailPage .mainDetailButtons.sleekfin-details-actions:not([data-sleekfin-details-action-preview="desktop"]){
    display:flex!important;
    flex-wrap:wrap!important;
    justify-content:center!important;
    align-items:center!important;
    gap:12px!important;
    width:100%!important;
  }
  #itemDetailPage .mainDetailButtons.sleekfin-details-actions:not([data-sleekfin-details-action-preview="desktop"]) > .sleekfin-details-action-spacer{
    display:none!important;
  }
  #itemDetailPage .mainDetailButtons.sleekfin-details-actions:not([data-sleekfin-details-action-preview="desktop"]) > :is([data-sleekfin-action-id="play"],[data-sleekfin-action-id="resume"],[data-sleekfin-action-id="replay"],[data-sleekfin-action-id="download"],.btnPlay,.btnResume,.btnReplay,.btnDownload){
    order:1!important;
    flex:1 1 calc(50% - 6px)!important;
    min-width:120px!important;
    justify-content:center!important;
    margin:0!important;
  }
  #itemDetailPage .mainDetailButtons.sleekfin-details-actions:not([data-sleekfin-details-action-preview="desktop"]):not(:has(> .btnDownload:not(.hide):not([hidden]):not([data-sleekfin-action-hidden="true"]))) > :is([data-sleekfin-action-id="play"],[data-sleekfin-action-id="resume"],[data-sleekfin-action-id="replay"],.btnPlay,.btnResume,.btnReplay){
    flex:1 1 100%!important;
  }
  #itemDetailPage .mainDetailButtons.sleekfin-details-actions:not([data-sleekfin-details-action-preview="desktop"]) > .sleekfin-details-action-control:not(:is([data-sleekfin-action-id="play"],[data-sleekfin-action-id="resume"],[data-sleekfin-action-id="replay"],[data-sleekfin-action-id="download"],.btnPlay,.btnResume,.btnReplay,.btnDownload)){
    order:2!important;
    flex:0 0 var(--sleekfin-details-button-height,44px)!important;
    margin:0!important;
    margin-left:0!important;
    margin-top:0!important;
  }
}
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
        if (!profile || !Array.isArray(profile.rules) || profile.rules.length > 250) throw Error(`${page}: use up to 250 rules.`);
        if (!Array.isArray(profile.anchors) || profile.anchors.some((a) => !anchorsAllowed.has(a)) || new Set(profile.anchors).size !== profile.anchors.length) throw Error(`${page}: invalid or duplicate anchors.`);
        if (!Array.isArray(profile.families) || profile.families.some((f) => !familiesAllowed.has(f))) throw Error(`${page}: invalid families.`);
        if (profile.opening != null && (!Array.isArray(profile.opening) || profile.opening.length > 250 || profile.opening.some((t) => typeof t !== "string" || !(t.startsWith("anchor:") && anchorsAllowed.has(t.slice(7)) || t.startsWith("family:") && familiesAllowed.has(t.slice(7)) || t.startsWith("rule:") && profile.rules.some((r) => (r == null ? void 0 : r.Key) === t.slice(5)))))) throw Error(`${page}: invalid opening rows.`);
        if (profile.layouts != null && (typeof profile.layouts !== "object" || Array.isArray(profile.layouts) || Object.keys(profile.layouts).length > 500 || Object.entries(profile.layouts).some(([k, v]) => !["auto", "portrait", "landscape"].includes(v) || !(k.startsWith("anchor:") && anchorsAllowed.has(k.slice(7)) || k.startsWith("family:") && familiesAllowed.has(k.slice(7)) || k.startsWith("rule:") && profile.rules.some((r) => (r == null ? void 0 : r.Key) === k.slice(5)))))) throw Error(`${page}: invalid card layouts.`);
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
    const normalizeGuid = (id) => String(id || "").replace(/-/g, "").toLowerCase();
    const leavingSoonState = {
      viewIds: /* @__PURE__ */ new Set(["5ebc3f61ab8138bcfac3c68317a6be0b", "98081fc4b7413c896b48aaf1e35e8457"]),
      itemIds: /* @__PURE__ */ new Set(),
      loadedViews: /* @__PURE__ */ new Set()
    };
    function isLeavingSoonItem(item) {
      if (!item || typeof item !== "object") return false;
      const id = normalizeGuid(item.Id);
      const parentId = normalizeGuid(item.ParentId);
      const seriesId = normalizeGuid(item.SeriesId);
      if (id && (leavingSoonState.viewIds.has(id) || leavingSoonState.itemIds.has(id))) return true;
      if (parentId && leavingSoonState.viewIds.has(parentId)) return true;
      if (seriesId && (leavingSoonState.viewIds.has(seriesId) || leavingSoonState.itemIds.has(seriesId))) return true;
      if (/leaving\s+soon/i.test(String(item.Name || "")) || /leaving\s+soon/i.test(String(item.SeriesName || ""))) return true;
      return false;
    }
    class JellyfinClient {
      constructor(api, current = () => true) {
        var _a;
        this.api = api;
        this.userId = api.getCurrentUserId();
        this.current = current;
        this.serverId = ((_a = api.serverId) == null ? void 0 : _a.call(api)) || "";
        this.prefetchedSections = /* @__PURE__ */ new Map();
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
        var _a;
        const views = await this.json(`Users/${encodeURIComponent(this.userId)}/Views`);
        const rawViews = views.Items || [];
        const leavingViews = rawViews.filter((v) => /leaving\s+soon/i.test((v == null ? void 0 : v.Name) || "") || leavingSoonState.viewIds.has(normalizeGuid(v == null ? void 0 : v.Id)));
        for (const lv of leavingViews) {
          const gid = normalizeGuid(lv == null ? void 0 : lv.Id);
          if (gid) leavingSoonState.viewIds.add(gid);
          if (gid && !leavingSoonState.loadedViews.has(gid) && typeof ((_a = this.api) == null ? void 0 : _a.getItems) === "function") {
            leavingSoonState.loadedViews.add(gid);
            Promise.resolve(this.api.getItems(this.userId, { ParentId: lv.Id, Recursive: true, IncludeItemTypes: "Movie,Series", Limit: 500 })).then((res) => {
              for (const it of (res == null ? void 0 : res.Items) || []) {
                const iid = normalizeGuid(it == null ? void 0 : it.Id);
                if (iid) leavingSoonState.itemIds.add(iid);
              }
            }).catch(() => {
            });
          }
        }
        this.views = rawViews.filter((v) => ["movies", "tvshows", "", null, void 0].includes(v.CollectionType) && !isLeavingSoonItem(v));
        const safeParentId = route.parentId && !leavingSoonState.viewIds.has(normalizeGuid(route.parentId)) ? route.parentId : "";
        const folders = safeParentId ? [{ Id: safeParentId }] : this.views.filter((v) => route.page === "home" || !v.CollectionType || v.CollectionType === (route.page === "movies" ? "movies" : "tvshows"));
        const type = route.page === "movies" ? "Movie" : route.page === "shows" ? "Series" : "Movie,Series";
        const all = /* @__PURE__ */ new Map(), seasons = /* @__PURE__ */ new Map();
        const tasks = [];
        for (const folder of folders) {
          const folderTypes = [type, ...route.page === "movies" || folder.CollectionType === "movies" ? [] : ["Season"]];
          for (const types of folderTypes) {
            tasks.push((async () => {
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
            })());
          }
        }
        await Promise.all(tasks);
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
        const invItems = (inventory == null ? void 0 : inventory.items) || [];
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
          const show = invItems.find((i) => i.Id === item.SeriesId);
          return {
            ...item,
            Name: item.SeriesName || (show == null ? void 0 : show.Name) || item.Name,
            Type: "Series",
            ResumeItemId: item.Id,
            Id: item.SeriesId,
            ImageTags: (show == null ? void 0 : show.ImageTags) || (item.SeriesPrimaryImageTag ? { Primary: item.SeriesPrimaryImageTag } : item.ImageTags || {}),
            BackdropImageTags: (show == null ? void 0 : show.BackdropImageTags) || item.ParentBackdropImageTags || [],
            SeriesName: void 0,
            PrimaryImageAspectRatio: show == null ? void 0 : show.PrimaryImageAspectRatio
          };
        });
      }
      async fetchContinueWatching(route, inventory, limit = 16) {
        var _a, _b, _c;
        const parentFilter = route.parentId ? { ParentId: route.parentId } : {};
        const fields = "DateCreated,PrimaryImageAspectRatio,ParentId";
        const mediaTypes = route.page === "movies" ? "Movie" : route.page === "shows" ? "Episode" : "Movie,Episode";
        const tasks = [
          this.json("Items/Resume", { UserId: this.userId, Limit: limit, IncludeItemTypes: mediaTypes, ...parentFilter, Fields: fields, EnableImages: true, EnableUserData: true, ImageTypeLimit: 1, EnableImageTypes: "Primary,Backdrop,Thumb" }).catch(() => ({ Items: [] }))
        ];
        if (route.page !== "movies") {
          tasks.push(
            this.json("Shows/NextUp", { UserId: this.userId, Limit: limit, ...parentFilter, Fields: fields, EnableImages: true, EnableUserData: true, ImageTypeLimit: 1, EnableImageTypes: "Primary,Backdrop,Thumb" }).catch(() => ({ Items: [] }))
          );
        }
        const results = await Promise.all(tasks);
        this.assertCurrent();
        const combined = [...((_a = results[0]) == null ? void 0 : _a.Items) || [], ...((_b = results[1]) == null ? void 0 : _b.Items) || []].filter((i) => !isLeavingSoonItem(i));
        if (!combined.length && this.prefetchedSections.has("ContinueWatchingNextUp")) {
          try {
            const pref = await this.prefetchedSections.get("ContinueWatchingNextUp");
            this.prefetchedSections.delete("ContinueWatchingNextUp");
            if ((_c = pref == null ? void 0 : pref.Items) == null ? void 0 : _c.length) return this.groupResume(pref.Items.filter((i) => !isLeavingSoonItem(i)), inventory).slice(0, limit);
          } catch {
          }
        }
        return this.groupResume(combined, inventory).slice(0, limit);
      }
      async fastOpening(route, config) {
        var _a;
        if (route.view === "genres" || route.view === "library" || route.view === "favorites") return [];
        const profile = (_a = config == null ? void 0 : config.pages) == null ? void 0 : _a[route.page];
        const opening = Array.isArray(profile == null ? void 0 : profile.opening) ? profile.opening : [];
        const firstToken = opening.length ? opening[0] : Array.isArray(profile == null ? void 0 : profile.anchors) && profile.anchors.length ? `anchor:${profile.anchors[0]}` : "anchor:ContinueWatchingNextUp";
        if (firstToken !== "anchor:ContinueWatchingNextUp") return [];
        const limit = Math.min((config == null ? void 0 : config.cardsPerShelf) || 20, 20);
        const items = await this.fetchContinueWatching(route, { items: [] }, limit).catch(() => []);
        this.assertCurrent();
        return items.length ? [{ key: "ContinueWatchingNextUp", title: "Continue Watching / Next Up", family: "anchor", items }] : [];
      }
      async anchor(id, route, inventory, config) {
        var _a, _b, _c;
        const typed = (list) => route.page === "home" ? list : list.filter((i) => route.page === "movies" ? i.Type === "Movie" || i.SourceType === "movie" : ["Series", "Episode"].includes(i.Type) || i.SourceType === "tv");
        const arrival = (item) => {
          var _a2;
          const r = (_a2 = inventory.tracking) == null ? void 0 : _a2.get(item.Id);
          return Date.parse(kindDate(item, r)) || 0;
        };
        const kindDate = (item, r) => item.Type === "Series" ? (r == null ? void 0 : r.NewSeasonAt) || (r == null ? void 0 : r.AddedAt) : r == null ? void 0 : r.AddedAt;
        const recentItems = (kind) => inventory.items.filter((i) => i.Type === kind).sort((a, b) => Number(!!arrival(b)) - Number(!!arrival(a)) || arrival(b) - arrival(a) || (Date.parse(b.DateCreated) || 0) - (Date.parse(a.DateCreated) || 0)).slice(0, config.cardsPerShelf);
        const title = { ContinueWatchingNextUp: "Continue Watching / Next Up", RecentlyAddedMovies: "Recently Added in Movies", RecentlyAddedShows: "Recently Added in Shows", DiscoverMovies: "Discover Movies", DiscoverTV: "Discover TV Shows", MyJellyseerrRequests: "My Requests", MyMedia: "My Media" }[id];
        const seeMoreItem = id === "DiscoverMovies" ? { Id: "fx-see-more:movies", Name: "All Popular Movies", Type: "SeeMore", SeeMoreKind: "movies", SeeMoreLabel: "See More", SeeMoreSub: "Popular Movies" } : id === "DiscoverTV" ? { Id: "fx-see-more:tv", Name: "All Popular Series", Type: "SeeMore", SeeMoreKind: "tv", SeeMoreLabel: "See More", SeeMoreSub: "Popular Series" } : null;
        if (id === "RecentlyAddedMovies" || id === "RecentlyAddedShows") return { key: id, title, family: "anchor", items: recentItems(id === "RecentlyAddedMovies" ? "Movie" : "Series") };
        if (id === "MyMedia") return { key: id, title, family: "anchor", items: inventory.views };
        if (id === "ContinueWatchingNextUp" && !this.prefetchedSections.has(id) && typeof ((_a = this.api) == null ? void 0 : _a.getUrl) === "function") {
          try {
            const items = await this.fetchContinueWatching(route, inventory, config.cardsPerShelf);
            if (items.length) {
              let list = typed(items).filter((i) => !isLeavingSoonItem(i));
              if ((route.parentId || leavingSoonState.itemIds.size > 0) && ((_b = inventory.items) == null ? void 0 : _b.length)) {
                const allowed = new Set(inventory.items.map((i) => i.Id));
                list = list.filter((i) => allowed.has(i.Id) || allowed.has(i.SeriesId));
              }
              return { key: id, title, family: "anchor", items: list.slice(0, config.cardsPerShelf), external: false };
            }
          } catch {
            this.assertCurrent();
          }
        }
        if ((id === "DiscoverMovies" || id === "DiscoverTV") && !this.prefetchedSections.has(id)) {
          try {
            const kind = id === "DiscoverMovies" ? "movies" : "tv";
            const targetCount = Math.max(config.cardsPerShelf || 20, 20);
            const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
            const isReleased = (r) => !(r == null ? void 0 : r.releaseDate) || String(r.releaseDate).slice(0, 10) <= today;
            const rh = await this.json("RequestHub/Browse", { kind, page: 1 });
            let rawList = Array.isArray(rh == null ? void 0 : rh.results) ? rh.results.filter(isReleased) : [];
            if (rawList.length > 0 && rawList.length < targetCount && ((rh == null ? void 0 : rh.totalPages) || 1) >= 2) {
              try {
                const rh2 = await this.json("RequestHub/Browse", { kind, page: 2 });
                if (Array.isArray(rh2 == null ? void 0 : rh2.results)) {
                  const seenIds = new Set(rawList.map((r) => r.id));
                  for (const r of rh2.results.filter(isReleased)) {
                    if (!seenIds.has(r.id)) {
                      seenIds.add(r.id);
                      rawList.push(r);
                    }
                  }
                }
              } catch {
              }
            }
            if (rawList.length) {
              const mapped = rawList.slice(0, targetCount).map((r) => ({
                Id: `rh:${kind}:${r.id}`,
                Name: r.title || "Untitled",
                Type: kind === "movies" ? "Movie" : "Series",
                SourceType: r.type || (kind === "movies" ? "movie" : "tv"),
                ProductionYear: r.year,
                ProviderIds: {
                  Jellyseerr: String(r.id),
                  JellyseerrRoot: "https://jellyseerr.local",
                  ...r.poster ? { JellyseerrPoster: r.poster } : {}
                }
              }));
              if (seeMoreItem) mapped.push(seeMoreItem);
              return { key: id, title, family: "anchor", items: mapped, external: true };
            }
          } catch {
            this.assertCurrent();
          }
        }
        try {
          const prefetched = this.prefetchedSections.get(id);
          if (prefetched) this.prefetchedSections.delete(id);
          const response = prefetched ? await prefetched : await this.json(`HomeScreen/Section/${id}`, { UserId: this.userId });
          let list = typed(response.Items || []).filter((i) => id.startsWith("Discover") || !isLeavingSoonItem(i));
          if ((route.parentId || leavingSoonState.itemIds.size > 0) && !id.startsWith("Discover") && ((_c = inventory.items) == null ? void 0 : _c.length)) {
            const allowed = new Set(inventory.items.map((i) => i.Id));
            list = list.filter((i) => allowed.has(i.Id) || allowed.has(i.SeriesId));
          }
          if (id === "ContinueWatchingNextUp") list = this.groupResume(list, inventory);
          const maxItems = id.startsWith("Discover") ? Math.max(config.cardsPerShelf || 20, 20) : config.cardsPerShelf;
          const sliced = list.slice(0, maxItems);
          if (seeMoreItem && sliced.length) sliced.push(seeMoreItem);
          return { key: id, title, family: "anchor", items: sliced, external: id.startsWith("Discover") };
        } catch (error) {
          this.assertCurrent();
          if (id !== "ContinueWatchingNextUp") throw error;
          const resume = await this.json("Items/Resume", { UserId: this.userId, Limit: config.cardsPerShelf, ...route.parentId ? { ParentId: route.parentId } : {}, Fields: "DateCreated,PrimaryImageAspectRatio", EnableImages: true });
          return { key: id, title: "Continue Watching", family: "anchor", items: this.groupResume(typed(resume.Items || []).filter((i) => !isLeavingSoonItem(i)), inventory).slice(0, config.cardsPerShelf) };
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
      const VERSION = "0.5.4";
      if (((_a = window.FazFortDiscovery) == null ? void 0 : _a.version) === VERSION) return;
      (_c = (_b = window.FazFortDiscovery) == null ? void 0 : _b.stop) == null ? void 0 : _c.call(_b);
      (_e = (_d = window.FazFortHomeFeed) == null ? void 0 : _d.stop) == null ? void 0 : _e.call(_d);
      let state = null, generation = 0, observer, timer, heartbeat, stopped = false;
      const snapshots = /* @__PURE__ */ new Map();
      const savedFeeds = /* @__PURE__ */ new Map();
      const loadedImages = /* @__PURE__ */ new Set();
      let activeDialog = null, lastScope = "", selectHold = null, downloadMenu = null, downloadMenuTrigger = null;
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
      const bootRowsKey = (scope, route) => `fazfort-discovery:boot:v2:${scope}:${route.page}:${route.parentId || ""}:${route.view || "home"}`;
      const trackingCacheKey = (scope) => `fazfort-discovery:tracking:v1:${scope}`;
      function readTrackingCache(scope) {
        if (!scope) return /* @__PURE__ */ new Map();
        try {
          const raw = localStorage.getItem(trackingCacheKey(scope));
          if (!raw) return /* @__PURE__ */ new Map();
          const parsed = JSON.parse(raw);
          if (!parsed || !Array.isArray(parsed.entries)) return /* @__PURE__ */ new Map();
          return new Map(parsed.entries);
        } catch {
          return /* @__PURE__ */ new Map();
        }
      }
      function writeTrackingCache(scope, map) {
        if (!scope || !(map instanceof Map)) return;
        try {
          localStorage.setItem(trackingCacheKey(scope), JSON.stringify({ at: Date.now(), entries: [...map.entries()] }));
        } catch {
        }
      }
      function readBootRows(s, configStr) {
        if (s.full || s.route.view === "genres") return null;
        try {
          const raw = localStorage.getItem(bootRowsKey(s.scope, s.route));
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          if (!parsed || parsed.config !== configStr || !Array.isArray(parsed.rows) || !parsed.rows.length) return null;
          if (Date.now() - (parsed.at || 0) > 7 * 24 * 3600 * 1e3) return null;
          return { rows: parsed.rows, shuffle: parsed.shuffle };
        } catch {
          return null;
        }
      }
      function writeBootRows(s) {
        if (s.full || s.route.view === "genres" || filtersActive(s.filters) || s.filters.sort !== "recommended" || !s.slots.length || !s.config) return;
        try {
          const rows = s.slots.filter((slot) => !slot.boot).slice(0, 4).map((slot) => slot.data);
          if (!rows.length) return;
          localStorage.setItem(bootRowsKey(s.scope, s.route), JSON.stringify({ at: Date.now(), shuffle: s.shuffle, config: JSON.stringify(s.config), rows }));
        } catch {
        }
      }
      function clearBootRows(scope) {
        if (!scope) return;
        try {
          for (const page of ["home", "movies", "shows"]) {
            for (const view of ["home", "suggestions"]) {
              localStorage.removeItem(bootRowsKey(scope, { page, parentId: "", view }));
            }
          }
        } catch {
        }
      }
      function applyWebpackViewPatch(req) {
        var _a2, _b2;
        if (!(req == null ? void 0 : req.m)) return;
        try {
          if (req.m[57826]) {
            const modViews = req(57826);
            const list = modViews == null ? void 0 : modViews.u;
            if (Array.isArray(list)) {
              const moviesEntry = list.find((x) => (x == null ? void 0 : x.path) === "/movies");
              if (moviesEntry) {
                moviesEntry.views = [
                  { index: 1, label: "Movies", view: "suggestions", isDefault: true },
                  { index: 0, label: "Library", view: "movies" },
                  { index: 2, label: "Favorites", view: "favorites" },
                  { index: 4, label: "Genres", view: "genres" }
                ];
              }
              const tvEntry = list.find((x) => (x == null ? void 0 : x.path) === "/tv");
              if (tvEntry) {
                tvEntry.views = [
                  { index: 1, label: "TV Shows", view: "suggestions", isDefault: true },
                  { index: 0, label: "Library", view: "series" },
                  { index: 2, label: "Favorites", view: "favorites" },
                  { index: 3, label: "Genres", view: "genres" }
                ];
              }
            }
          }
          if (req.m[95753]) {
            const modMap = req(95753);
            const map = modMap == null ? void 0 : modMap.A;
            if (map == null ? void 0 : map.movies) {
              const emptySuggestions = { suggestionSections: [], isMovieRecommendations: false };
              map.movies[1] = {
                viewType: "suggestions",
                collectionType: "movies",
                sectionsView: emptySuggestions,
                itemType: [],
                isPaginationEnabled: false,
                isBtnPlayAllEnabled: false,
                isBtnShuffleEnabled: false,
                isBtnFilterEnabled: false,
                isBtnGridListEnabled: false,
                isBtnSortEnabled: false,
                isAlphabetPickerEnabled: false,
                isAlphaPickerEnabled: false
              };
              map.movies[4] = {
                viewType: "suggestions",
                collectionType: "movies",
                sectionsView: emptySuggestions,
                itemType: [],
                isPaginationEnabled: false,
                isBtnPlayAllEnabled: false,
                isBtnShuffleEnabled: false,
                isBtnFilterEnabled: false,
                isBtnGridListEnabled: false,
                isBtnSortEnabled: false,
                isAlphabetPickerEnabled: false,
                isAlphaPickerEnabled: false
              };
              for (const k of [0, 1, 2, 3, 4]) {
                if (map.movies[k] && typeof map.movies[k] === "object") {
                  map.movies[k].isAlphabetPickerEnabled = false;
                  map.movies[k].isAlphaPickerEnabled = false;
                }
              }
              Object.values(map.movies).forEach((v) => {
                if (v && typeof v === "object") {
                  v.isBtnPlayAllEnabled = false;
                  v.isBtnShuffleEnabled = false;
                  v.isAlphabetPickerEnabled = false;
                  v.isAlphaPickerEnabled = false;
                }
              });
            }
            if (map == null ? void 0 : map.tvshows) {
              const emptyTvSuggestions = { suggestionSections: [], isMovieRecommendations: false };
              map.tvshows[1] = {
                viewType: "suggestions",
                collectionType: "tvshows",
                sectionsView: emptyTvSuggestions,
                itemType: [],
                isPaginationEnabled: false,
                isBtnPlayAllEnabled: false,
                isBtnShuffleEnabled: false,
                isBtnFilterEnabled: false,
                isBtnGridListEnabled: false,
                isBtnSortEnabled: false,
                isAlphabetPickerEnabled: false,
                isAlphaPickerEnabled: false
              };
              map.tvshows[2] = {
                viewType: "favorites",
                collectionType: "tvshows",
                itemType: ["Series"],
                isBtnPlayAllEnabled: false,
                isBtnShuffleEnabled: false,
                isBtnFilterEnabled: true,
                isBtnGridListEnabled: true,
                isBtnSortEnabled: true,
                isAlphabetPickerEnabled: false,
                isAlphaPickerEnabled: false
              };
              map.tvshows[3] = {
                viewType: "suggestions",
                collectionType: "tvshows",
                sectionsView: emptyTvSuggestions,
                itemType: [],
                isPaginationEnabled: false,
                isBtnPlayAllEnabled: false,
                isBtnShuffleEnabled: false,
                isBtnFilterEnabled: false,
                isBtnGridListEnabled: false,
                isBtnSortEnabled: false,
                isAlphabetPickerEnabled: false,
                isAlphaPickerEnabled: false
              };
              for (const k of [0, 1, 2, 3, 4]) {
                if (map.tvshows[k] && typeof map.tvshows[k] === "object") {
                  map.tvshows[k].isAlphabetPickerEnabled = false;
                  map.tvshows[k].isAlphaPickerEnabled = false;
                }
              }
              Object.values(map.tvshows).forEach((v) => {
                if (v && typeof v === "object") {
                  v.isBtnPlayAllEnabled = false;
                  v.isBtnShuffleEnabled = false;
                  v.isAlphabetPickerEnabled = false;
                  v.isAlphaPickerEnabled = false;
                }
              });
            }
            if (map == null ? void 0 : map.boxsets) {
              for (const k of [0, 1, 2, 3, 4]) {
                if (map.boxsets[k] && typeof map.boxsets[k] === "object") {
                  map.boxsets[k].isAlphabetPickerEnabled = false;
                  map.boxsets[k].isAlphaPickerEnabled = false;
                }
              }
              Object.values(map.boxsets).forEach((v) => {
                if (v && typeof v === "object") {
                  v.isBtnPlayAllEnabled = false;
                  v.isBtnShuffleEnabled = false;
                  v.isAlphabetPickerEnabled = false;
                  v.isAlphaPickerEnabled = false;
                }
              });
            }
          }
          if (req.m[95988] && !req.m[95988]._fxPatched) {
            const orig95988 = req.m[95988];
            const wrapped95988 = function(module, exports, wreq) {
              orig95988(module, exports, wreq);
              try {
                const react = wreq(96540);
                const router = wreq(96303);
                if ((react == null ? void 0 : react.useState) && (router == null ? void 0 : router.useSearchParams)) {
                  const safeUseSearchParam = function(paramKey, defaultValue = "") {
                    const [searchParams, setSearchParams] = router.useSearchParams();
                    const urlVal = searchParams.get(paramKey) || defaultValue;
                    const [val, setVal] = react.useState(urlVal);
                    const typingRef = react.useRef(false);
                    const timerRef = react.useRef(0);
                    react.useEffect(() => {
                      if (!typingRef.current && urlVal !== val) {
                        setVal(urlVal);
                      }
                    }, [urlVal]);
                    react.useEffect(() => () => clearTimeout(timerRef.current), []);
                    const updateVal = react.useCallback((nextVal) => {
                      const str = String(nextVal != null ? nextVal : "");
                      typingRef.current = true;
                      setVal(str);
                      clearTimeout(timerRef.current);
                      timerRef.current = setTimeout(() => {
                        typingRef.current = false;
                        const currentUrlVal = searchParams.get(paramKey) || defaultValue;
                        if (currentUrlVal !== str) {
                          const nextParams = new URLSearchParams(searchParams);
                          if (str.trim()) nextParams.set(paramKey, str);
                          else nextParams.delete(paramKey);
                          setSearchParams(nextParams, { replace: true });
                        }
                      }, 450);
                    }, [paramKey, defaultValue, searchParams, setSearchParams]);
                    return [val, updateVal];
                  };
                  try {
                    Object.defineProperty(exports, "A", { configurable: true, enumerable: true, get: () => safeUseSearchParam });
                  } catch {
                    exports.A = safeUseSearchParam;
                  }
                }
              } catch {
              }
            };
            wrapped95988._fxPatched = true;
            req.m[95988] = wrapped95988;
            if ((_a2 = req.c) == null ? void 0 : _a2[95988]) {
              delete req.c[95988];
              try {
                req(95988);
              } catch {
              }
            }
          }
          if (req.m[42111] && !req.m[42111]._fxPatched) {
            const orig42111 = req.m[42111];
            const wrapped42111 = function(module, exports, wreq) {
              orig42111(module, exports, wreq);
              try {
                const origHook = exports.u;
                if (typeof origHook === "function") {
                  const cappedHook = function(parentId, collectionType, query) {
                    const trimmed = typeof query === "string" ? query.trim() : "";
                    const res = origHook(parentId, collectionType, trimmed);
                    if (res && Array.isArray(res.data)) {
                      return {
                        ...res,
                        data: res.data.map((sec) => sec && Array.isArray(sec.items) && sec.items.length > 24 ? { ...sec, items: sec.items.slice(0, 24) } : sec)
                      };
                    }
                    return res;
                  };
                  try {
                    Object.defineProperty(exports, "u", { configurable: true, enumerable: true, get: () => cappedHook });
                  } catch {
                    exports.u = cappedHook;
                  }
                }
              } catch {
              }
            };
            wrapped42111._fxPatched = true;
            req.m[42111] = wrapped42111;
            if ((_b2 = req.c) == null ? void 0 : _b2[42111]) {
              delete req.c[42111];
              try {
                req(42111);
              } catch {
              }
            }
          }
        } catch {
        }
      }
      function patchLibraryViews() {
        const chunks = window.webpackChunk;
        if (!chunks || typeof chunks.push !== "function") return;
        try {
          if (!chunks._fxHooked) {
            chunks.push([["fx-discovery-views-" + Date.now()], {}, (req) => {
              window._fxWebpackReq = req;
              applyWebpackViewPatch(req);
            }]);
            const origPush = chunks.push.bind(chunks);
            chunks.push = function(...args) {
              const res = origPush(...args);
              if (window._fxWebpackReq) applyWebpackViewPatch(window._fxWebpackReq);
              return res;
            };
            chunks._fxHooked = true;
          } else if (window._fxWebpackReq) {
            applyWebpackViewPatch(window._fxWebpackReq);
          }
        } catch {
        }
      }
      function patchApiClientLeavingSoon(api) {
        if (!api || typeof api !== "object" || api._fxLeavingPatched) return;
        try {
          api._fxLeavingPatched = true;
        } catch {
          return;
        }
        const isDashboard = () => /^#!?\/?(?:dashboard|configurationpage)/i.test(String(location.hash || ""));
        const rememberViews = (items) => {
          var _a2;
          if (!Array.isArray(items)) return;
          const uid = (_a2 = api.getCurrentUserId) == null ? void 0 : _a2.call(api);
          for (const v of items) {
            const gid = normalizeGuid(v == null ? void 0 : v.Id);
            if (/leaving\s+soon/i.test(String((v == null ? void 0 : v.Name) || "")) || gid && leavingSoonState.viewIds.has(gid)) {
              if (gid) leavingSoonState.viewIds.add(gid);
              if (gid && uid && !leavingSoonState.loadedViews.has(gid) && typeof origGetItems === "function") {
                leavingSoonState.loadedViews.add(gid);
                Promise.resolve(origGetItems(uid, { ParentId: v.Id, Recursive: true, IncludeItemTypes: "Movie,Series", Limit: 500 })).then((res) => {
                  for (const it of (res == null ? void 0 : res.Items) || []) {
                    const iid = normalizeGuid(it == null ? void 0 : it.Id);
                    if (iid) leavingSoonState.itemIds.add(iid);
                  }
                }).catch(() => {
                });
              }
            }
          }
        };
        const origGetItems = typeof api.getItems === "function" ? api.getItems.bind(api) : null;
        if (typeof api.getUserViews === "function") {
          const origViews = api.getUserViews.bind(api);
          api.getUserViews = function(...args) {
            return Promise.resolve(origViews(...args)).then((res) => {
              if (res && Array.isArray(res.Items)) {
                rememberViews(res.Items);
                if (!isDashboard()) {
                  const filtered = res.Items.filter((v) => !isLeavingSoonItem(v));
                  if (filtered.length !== res.Items.length) {
                    return { ...res, Items: filtered, TotalRecordCount: filtered.length };
                  }
                }
              }
              return res;
            });
          };
        }
        if (origGetItems) {
          api.getItems = function(userId, options, ...rest) {
            return Promise.resolve(origGetItems(userId, options, ...rest)).then((res) => {
              var _a2;
              if (!res || !Array.isArray(res.Items) || isDashboard()) return res;
              const requestedParent = normalizeGuid(options == null ? void 0 : options.ParentId);
              if (requestedParent && leavingSoonState.viewIds.has(requestedParent)) return res;
              if (!leavingSoonState.viewIds.size && !leavingSoonState.itemIds.size) return res;
              const filtered = res.Items.filter((it) => !isLeavingSoonItem(it));
              if (filtered.length !== res.Items.length) {
                return { ...res, Items: filtered, TotalRecordCount: Math.max(0, ((_a2 = res.TotalRecordCount) != null ? _a2 : res.Items.length) - (res.Items.length - filtered.length)) };
              }
              return res;
            });
          };
        }
      }
      function hideLeavingSoonNav() {
        var _a2, _b2;
        if (window.ApiClient) patchApiClientLeavingSoon(window.ApiClient);
        try {
          const raw = (_b2 = (_a2 = window.sessionStorage) == null ? void 0 : _a2.getItem) == null ? void 0 : _b2.call(_a2, "sleekfin:header-sources:v2");
          if (raw && /leaving\s+soon/i.test(raw)) {
            const parsed = JSON.parse(raw);
            const keep = (entry) => !/leaving\s+soon/i.test(String((entry == null ? void 0 : entry.caption) || (entry == null ? void 0 : entry.label) || (entry == null ? void 0 : entry.title) || (entry == null ? void 0 : entry.name) || ""));
            if (Array.isArray(parsed)) {
              window.sessionStorage.setItem("sleekfin:header-sources:v2", JSON.stringify(parsed.filter(keep)));
            } else if (parsed && typeof parsed === "object") {
              for (const k of Object.keys(parsed)) {
                if (Array.isArray(parsed[k])) parsed[k] = parsed[k].filter(keep);
              }
              window.sessionStorage.setItem("sleekfin:header-sources:v2", JSON.stringify(parsed));
            }
          }
        } catch {
        }
        let changed = false;
        document.querySelectorAll('[data-sleekfin-header-proxy] button, [data-sleekfin-header-proxy] a, [data-sleekfin-header-overflow-drawer] button, [data-sleekfin-header-overflow-drawer] a, header button, header a, .mainDrawer a, .mainDrawer button, .MuiDrawer-root a, .MuiDrawer-root button, #user-view-overflow-menu a, #user-view-overflow-menu li, #user-view-overflow-menu [role="menuitem"]').forEach((node) => {
          var _a3, _b3, _c2, _d2, _e2, _f, _g;
          const text = (node.getAttribute("aria-label") || node.getAttribute("title") || node.textContent || "").trim();
          if (!/leaving\s+soon/i.test(text)) return;
          if (node.getAttribute("data-fx-leaving-hidden") !== "true") {
            node.setAttribute("data-fx-leaving-hidden", "true");
            changed = true;
          }
          if (node.style.display !== "none") node.style.display = "none";
          if (!((_a3 = node.closest) == null ? void 0 : _a3.call(node, "[data-sleekfin-header-proxy],[data-sleekfin-header-overflow-drawer]"))) {
            if (!node.hidden) node.hidden = true;
            if (!((_b3 = node.classList) == null ? void 0 : _b3.contains("hide"))) (_d2 = (_c2 = node.classList) == null ? void 0 : _c2.add) == null ? void 0 : _d2.call(_c2, "hide");
            const listItem = (_e2 = node.closest) == null ? void 0 : _e2.call(node, ".MuiDrawer-root .MuiListItem-root");
            if (listItem && listItem.getAttribute("data-fx-leaving-hidden") !== "true") {
              listItem.setAttribute("data-fx-leaving-hidden", "true");
              listItem.hidden = true;
              (_g = (_f = listItem.classList) == null ? void 0 : _f.add) == null ? void 0 : _g.call(_f, "hide");
            }
          }
        });
        document.querySelectorAll("#indexPage .card, #indexPage .verticalSection, #homeScreenPreferencesPage .viewItem, #homeScreenPreferencesPage .checkboxList > *, #homeScreenPreferencesPage .folderList > *, #homeScreenPreferencesPage .listItem, #homeScreenPreferencesPage label, #userProfilePage .folderAccessListContainer label, #userProfilePage .checkboxList > *").forEach((node) => {
          var _a3, _b3;
          if ((_a3 = node.classList) == null ? void 0 : _a3.contains("verticalSection")) {
            const heading = ((_b3 = node.querySelector("h2, .sectionTitle")) == null ? void 0 : _b3.textContent) || "";
            if (!/leaving\s+soon/i.test(heading)) return;
          } else {
            const idAttr = normalizeGuid(node.getAttribute("data-id") || node.getAttribute("data-itemid") || "");
            const text = (node.getAttribute("aria-label") || node.getAttribute("title") || node.textContent || "").trim();
            const matchedId = idAttr && (leavingSoonState.viewIds.has(idAttr) || leavingSoonState.itemIds.has(idAttr));
            if (!matchedId && !/leaving\s+soon/i.test(text)) return;
          }
          if (node.getAttribute("data-fx-leaving-hidden") !== "true") {
            node.setAttribute("data-fx-leaving-hidden", "true");
            node.style.display = "none";
          }
        });
        if (changed && typeof Event === "function") {
          const fire = () => {
            var _a3;
            try {
              (_a3 = window.dispatchEvent) == null ? void 0 : _a3.call(window, new Event("resize"));
            } catch {
            }
          };
          if (typeof requestAnimationFrame === "function") requestAnimationFrame(fire);
          else setTimeout(fire, 0);
        }
      }
      function syncMobileOverflowDrawer(api = window.ApiClient) {
        var _a2;
        const drawer = document.querySelector("[data-sleekfin-header-overflow-drawer]");
        if (!drawer) return;
        if (!((_a2 = api == null ? void 0 : api.getCurrentUserId) == null ? void 0 : _a2.call(api))) {
          drawer.querySelectorAll("[data-fx-overflow-settings]").forEach((n) => n.remove());
          return;
        }
        const existingItems = [...drawer.querySelectorAll("button[data-sleekfin-header-overflow-item], a[data-sleekfin-header-overflow-item]")];
        if (!existingItems.length) return;
        const listHost = existingItems[0].parentElement;
        if (!listHost) return;
        const isSettingsActive = /^#!?\/?mypreferences/i.test(String(location.hash || ""));
        let settingsBtn = drawer.querySelector('[data-fx-overflow-settings="true"]');
        if (!settingsBtn) {
          const sample = existingItems.find((b) => (b.getAttribute("data-sleekfin-header-overflow-item") || "") !== "jellyfin:user-menu") || existingItems[0];
          settingsBtn = element("button", (sample == null ? void 0 : sample.className) || "");
          settingsBtn.type = "button";
          settingsBtn.dataset.fxOverflowSettings = "true";
          settingsBtn.setAttribute("data-sleekfin-header-overflow-item", "fx:settings");
          settingsBtn.title = "Settings";
          settingsBtn.setAttribute("aria-label", "Settings");
          const vis = element("span");
          vis.dataset.sleekfinHeaderSourceVisual = "true";
          const icon = element("span", "material-icons settings");
          icon.dataset.sleekfinHeaderSourceIcon = "true";
          icon.setAttribute("aria-hidden", "true");
          const lbl = element("span", "", "Settings");
          lbl.dataset.sleekfinHeaderSourceLabel = "true";
          vis.append(icon, lbl);
          settingsBtn.append(vis);
          settingsBtn.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            closeDrawers();
            scrollToTop();
            location.hash = "#/mypreferencesmenu";
            schedule();
          });
          const beforeAnchor = listHost.querySelector('[data-sleekfin-header-overflow-item="jellyfin:search"], [data-sleekfin-header-overflow-item="jellyfin:user-menu"]');
          if (beforeAnchor && beforeAnchor.parentElement === listHost) listHost.insertBefore(settingsBtn, beforeAnchor);
          else listHost.append(settingsBtn);
        }
        if (isSettingsActive) {
          settingsBtn.setAttribute("aria-current", "page");
          settingsBtn.dataset.sleekfinCurrent = "true";
        } else {
          settingsBtn.removeAttribute("aria-current");
          delete settingsBtn.dataset.sleekfinCurrent;
        }
      }
      function syncHomeModeAttr(api = window.ApiClient) {
        var _a2, _b2;
        const rootEl = document.documentElement;
        if (!rootEl) return;
        let isNative = false;
        if (((_a2 = state == null ? void 0 : state.route) == null ? void 0 : _a2.page) === "home") {
          isNative = !!(state.full || state.failed);
        } else if ((_b2 = api == null ? void 0 : api.getCurrentUserId) == null ? void 0 : _b2.call(api)) {
          try {
            isNative = localStorage.getItem(prefKey(api, "home")) === "native";
          } catch {
          }
        }
        if (isNative) {
          if (rootEl.getAttribute("data-fx-home-mode") !== "native") rootEl.setAttribute("data-fx-home-mode", "native");
        } else if (rootEl.hasAttribute("data-fx-home-mode")) {
          rootEl.removeAttribute("data-fx-home-mode");
        }
      }
      function scrollToTop() {
        try {
          window.scrollTo(0, 0);
        } catch {
        }
        if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        document.querySelectorAll(".page:not(.hide), #indexPage, #moviesPage, #tvshowsPage, #tvRecommendedPage, #boxsetsPage, #searchPage").forEach((p) => {
          if (p.scrollTop) p.scrollTop = 0;
        });
      }
      function syncLibraryViewMenu() {
        var _a2;
        patchLibraryViews();
        hideLeavingSoonNav();
        const h = String(location.hash || "").replace(/^#!?\/?/, "").replace(/^\//, "");
        const [path, query = ""] = h.split("?");
        const name = path.replace(/\.html$/, "").toLowerCase();
        const p = new URLSearchParams(query);
        const col = (_a2 = p.get("collectionType")) == null ? void 0 : _a2.toLowerCase();
        const rawTab = p.get("tab");
        const isMovies = name === "movies" || name === "list" && col === "movies";
        const isTv = name === "tv" || name === "tvshows" || name === "list" && col === "tvshows";
        const isBoxsets = name === "boxsets" || name === "list" && col === "boxsets";
        const isLiveTv = name.startsWith("livetv") || col === "livetv";
        const isHomeOrSearch = name === "" || name === "home" || name === "index" || name === "search";
        const movieOrTvTab = rawTab || "1";
        const isCuratedTab = isMovies && (movieOrTvTab === "1" || movieOrTvTab === "4") || isTv && (movieOrTvTab === "1" || movieOrTvTab === "3");
        const hideChip = isMovies && movieOrTvTab !== "0" && movieOrTvTab !== "2" || isTv && movieOrTvTab !== "0" && movieOrTvTab !== "2" || isBoxsets && Boolean(rawTab && rawTab !== "0" && rawTab !== "1") || isLiveTv || isHomeOrSearch;
        if (document.documentElement) {
          if (hideChip) {
            if (document.documentElement.getAttribute("data-fx-hide-count-chip") !== "true") {
              document.documentElement.setAttribute("data-fx-hide-count-chip", "true");
            }
          } else if (document.documentElement.hasAttribute("data-fx-hide-count-chip")) {
            document.documentElement.removeAttribute("data-fx-hide-count-chip");
          }
          if (isCuratedTab) {
            if (document.documentElement.getAttribute("data-fx-curated-tab") !== "true") {
              document.documentElement.setAttribute("data-fx-curated-tab", "true");
            }
            document.querySelectorAll(".docspinner").forEach((sp) => {
              var _a3, _b2;
              return (_b2 = (_a3 = sp.classList) == null ? void 0 : _a3.remove) == null ? void 0 : _b2.call(_a3, "mdlSpinnerActive", "is-active");
            });
          } else if (document.documentElement.hasAttribute("data-fx-curated-tab")) {
            document.documentElement.removeAttribute("data-fx-curated-tab");
          }
        }
        if (!isMovies && !isTv) return;
        const tab = movieOrTvTab;
        const expectedLabel = isMovies ? tab === "0" ? "Library" : tab === "2" ? "Favorites" : tab === "4" ? "Genres" : "Movies" : tab === "0" ? "Library" : tab === "2" ? "Favorites" : tab === "3" ? "Genres" : "TV Shows";
        const btn = document.querySelector('button[aria-controls="library-view-menu"]');
        if (btn) {
          const typo = btn.querySelector(".MuiTypography-root");
          if (typo) {
            if (typo.textContent !== expectedLabel) typo.textContent = expectedLabel;
          } else {
            const textNode = [...btn.childNodes].find((n) => n.nodeType === 3);
            if (textNode && textNode.nodeValue !== expectedLabel) textNode.nodeValue = expectedLabel;
          }
        }
        const menuList = document.querySelector("#library-view-menu .MuiList-root");
        if (menuList) {
          const items = [...menuList.querySelectorAll(".MuiMenuItem-root")];
          const removeLabels = /* @__PURE__ */ new Set(["studios", "playlists", "collections", "tv networks", "networks", "upcoming", "episodes"]);
          items.forEach((item, idx) => {
            const txt = (item.textContent || "").trim();
            const lower = txt.toLowerCase();
            if (removeLabels.has(lower)) {
              item.style.display = "none";
              return;
            }
            if (lower === "suggestions") {
              const tn = [...item.childNodes].find((n) => n.nodeType === 3);
              if (tn) tn.nodeValue = isMovies ? "Movies" : "TV Shows";
              else item.textContent = isMovies ? "Movies" : "TV Shows";
            } else if (isMovies && lower === "movies" && idx > 0 || isTv && (lower === "shows" || lower === "series")) {
              const tn = [...item.childNodes].find((n) => n.nodeType === 3);
              if (tn) tn.nodeValue = "Library";
              else item.textContent = "Library";
            }
          });
        }
      }
      const LEGACY_DUPLICATE_SHOW_KEYS = /* @__PURE__ */ new Set(["tv-drama", "tv-comedy", "tv-anime", "tv-scifi", "tv-crime", "tv-acclaimed"]);
      const LEGACY_DEFAULT_RULE_COUNTS = { home: 32, movies: 26, shows: 28 };
      function upgradeLegacyConfig(cfg) {
        var _a2;
        if (!cfg || typeof cfg !== "object") return cfg;
        if (cfg.cardsPerShelf === 8) {
          cfg.cardsPerShelf = 20;
        }
        if (cfg.pages && (DEFAULT_CONFIG2 == null ? void 0 : DEFAULT_CONFIG2.pages)) {
          for (const page of ["home", "movies", "shows"]) {
            const prof = cfg.pages[page];
            const supplied = (_a2 = DEFAULT_CONFIG2.pages[page]) == null ? void 0 : _a2.rules;
            if (!prof || !Array.isArray(prof.rules) || !Array.isArray(supplied)) continue;
            if (page === "shows") {
              const pinned = new Set(Array.isArray(prof.opening) ? prof.opening : []);
              const layouts = prof.layouts && typeof prof.layouts === "object" ? prof.layouts : null;
              prof.rules = prof.rules.filter((r) => {
                if (!LEGACY_DUPLICATE_SHOW_KEYS.has(r == null ? void 0 : r.Key)) return true;
                const tok = `rule:${r.Key}`;
                return pinned.has(tok) || Boolean(layouts && tok in layouts);
              });
            }
            if (prof.rules.length <= LEGACY_DEFAULT_RULE_COUNTS[page]) {
              const existingKeys = new Set(prof.rules.map((r) => r == null ? void 0 : r.Key).filter(Boolean));
              for (const rule of supplied) {
                if ((rule == null ? void 0 : rule.Key) && !existingKeys.has(rule.Key)) {
                  prof.rules.push(cloneJson(rule));
                  existingKeys.add(rule.Key);
                } else if (page === "shows" && ["comfort", "dark-side-laughs", "mind-benders"].includes(rule == null ? void 0 : rule.Key)) {
                  const target = prof.rules.find((r) => (r == null ? void 0 : r.Key) === rule.Key);
                  if (target && Array.isArray(target.TagsAny) && target.TagsAny.length <= 2) {
                    target.TagsAny = [...rule.TagsAny];
                  }
                }
              }
            }
          }
        }
        return cfg;
      }
      function isCompactTouchViewport() {
        var _a2, _b2, _c2, _d2;
        try {
          return Boolean(
            ((_b2 = (_a2 = window.matchMedia) == null ? void 0 : _a2.call(window, "(max-width: 768px)")) == null ? void 0 : _b2.matches) || ((_d2 = (_c2 = window.matchMedia) == null ? void 0 : _c2.call(window, "(pointer: coarse)")) == null ? void 0 : _d2.matches) && (window.innerWidth || 1024) <= 900
          );
        } catch {
          return false;
        }
      }
      function readConfig(api) {
        try {
          const raw = localStorage.getItem(configKey(api));
          const parsed = raw ? upgradeLegacyConfig(JSON.parse(raw)) : cloneJson(DEFAULT_CONFIG2);
          return validateConfig(parsed);
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
        const compact = isCompactTouchViewport();
        const maxWidth = compact ? layout === "portrait" ? 300 : 440 : 700;
        const quality = compact ? 82 : 88;
        const add = (id, type, tag, poster = false) => {
          if (!id || !tag) return;
          const url = safeUrl(api.getImageUrl(id, { type, tag, maxWidth, quality, ...type === "Backdrop" ? { index: 0 } : {} }));
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
        if (item.Type === "SeeMore") {
          const kind = item.SeeMoreKind || "movies";
          return `#/home?requesthub=discover&rhView=${encodeURIComponent(kind)}`;
        }
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
      function attachSimilarControls(entry, card, item, s) {
        var _a2, _b2, _c2;
        (_a2 = entry.querySelector(".fx-card-more")) == null ? void 0 : _a2.remove();
        if (card.dataset.fxSimilarBound === "true") return;
        if (["Movie", "Series"].includes(item.Type) && ((_c2 = (_b2 = s.inventory) == null ? void 0 : _b2.items) == null ? void 0 : _c2.some((i) => i.Id === item.Id))) {
          card.dataset.fxSimilarBound = "true";
          card.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            moreLikeThis(item, s);
          });
        }
      }
      function syncEntryBadge(entry, item, s) {
        const visual = entry.querySelector(".fx-card-visual");
        if (!visual) return;
        const text = badgeFor(item, s.badges, s.now, s.tracking);
        let badge = visual.querySelector(".fx-badge");
        if (!text) {
          badge == null ? void 0 : badge.remove();
          return;
        }
        if (!badge) {
          badge = element("span", "fx-badge");
          visual.append(badge);
        }
        if (badge.textContent !== text) badge.textContent = text;
      }
      function renderCard(item, s, withSimilar = true, layout = "landscape") {
        var _a2, _b2;
        const card = element("a", "fx-card");
        card.href = itemHref(item, s.api) || "#";
        card.dataset.itemId = item.Id || "";
        card.addEventListener("click", () => {
          var _a3;
          if ((_a3 = s.slots) == null ? void 0 : _a3.length) {
            s.lastFocus = { row: s.slots.findIndex((slot) => slot.node.contains(card)), id: item.Id };
            saveFeed(s);
          }
          if (item.Type === "SeeMore") {
            scrollToTop();
            setTimeout(scrollToTop, 40);
          }
          if (activeDialog) closeDialog();
        });
        if (/^https?:/i.test(card.getAttribute("href"))) card.rel = "noopener noreferrer";
        const name = item.Type === "Episode" ? `${item.SeriesName || item.Name} \xB7 ${item.Name}` : item.Name || "Untitled";
        if (item.Type === "SeeMore") {
          const isTv = item.SeeMoreKind === "tv" || /tv|series|show/i.test(item.Id || "") || /tv|series|show/i.test(item.Name || "");
          const boxLabel = item.SeeMoreLabel || "See More";
          const boxSub = item.SeeMoreSub && !/^Browse /i.test(item.SeeMoreSub) ? item.SeeMoreSub : isTv ? "Popular Series" : "Popular Movies";
          const caption = /^See More/i.test(name) ? isTv ? "All Popular Series" : "All Popular Movies" : name;
          card.classList.add("fx-see-more-link");
          const visual2 = element("div", "fx-card-visual fx-see-more-poster");
          visual2.append(
            element("span", "fx-see-more-arrow", "\u2192"),
            element("span", "fx-see-more-label", boxLabel),
            element("span", "fx-see-more-sub", boxSub)
          );
          card.append(visual2, element("span", "fx-name", caption));
          card.title = caption;
          const entry2 = element("div", `fx-card-entry fx-card-${layout} fx-see-more-card`);
          entry2.append(card);
          return entry2;
        }
        const visual = element("div", "fx-card-visual");
        const placeholder = element("span", "fx-placeholder", name);
        const choices = imageChoices(item, s.api, layout);
        if (choices.length) {
          placeholder.hidden = true;
          const firstCached = loadedImages.has(choices[0].url);
          if (!firstCached) visual.classList.add("is-loading");
          const img = element("img");
          img.alt = "";
          img.loading = firstCached ? "eager" : "lazy";
          img.decoding = firstCached ? "sync" : "async";
          let index = 0;
          const use = () => {
            const choice = choices[index++];
            const cached = loadedImages.has(choice.url);
            img.className = (choice.poster ? "fx-poster" : "") + (cached ? " is-loaded is-instant" : "");
            if (cached) visual.classList.remove("is-loading");
            img.src = choice.url;
            if (img.complete && img.naturalWidth > 0) {
              loadedImages.add(choice.url);
              placeholder.hidden = true;
              visual.classList.remove("is-loading");
              img.classList.add("is-loaded", "is-instant");
            }
          };
          img.addEventListener("load", () => {
            var _a3;
            const activeUrl = (_a3 = choices[Math.max(0, index - 1)]) == null ? void 0 : _a3.url;
            if (activeUrl) loadedImages.add(activeUrl);
            if (img.currentSrc) loadedImages.add(img.currentSrc);
            placeholder.hidden = true;
            visual.classList.remove("is-loading");
            img.classList.add("is-loaded");
          });
          img.addEventListener("error", () => {
            if (index < choices.length) use();
            else {
              img.remove();
              visual.classList.remove("is-loading");
              placeholder.hidden = false;
            }
          });
          use();
          visual.append(placeholder, img);
        } else {
          visual.append(placeholder);
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
        if (withSimilar) attachSimilarControls(entry, card, item, s, name);
        return entry;
      }
      function snapScrollDelta(track, direction, fallbackStep, clampEnd = false) {
        var _a2;
        const maxScroll = Math.max(0, (track.scrollWidth || 0) - (track.clientWidth || 0));
        const current = track.scrollLeft || 0;
        if (clampEnd && maxScroll > 0) {
          if (direction > 0 && current >= maxScroll - 2) return 0;
          if (direction < 0 && current <= 2) return 0;
        }
        const children = [...track.children];
        if (children.length < 2) {
          const raw = direction * fallbackStep;
          return clampEnd && maxScroll > 0 ? Math.max(-current, Math.min(maxScroll - current, raw)) : raw;
        }
        const base = typeof ((_a2 = children[0]) == null ? void 0 : _a2.offsetLeft) === "number" ? children[0].offsetLeft : 0;
        let snaps = children.map((c) => typeof c.offsetLeft === "number" ? c.offsetLeft - base : 0);
        if (!snaps.some((x) => x > 0)) {
          const raw = direction * fallbackStep;
          return clampEnd && maxScroll > 0 ? Math.max(-current, Math.min(maxScroll - current, raw)) : raw;
        }
        if (clampEnd && maxScroll > 0) {
          snaps = [...new Set(snaps.map((pos) => Math.min(pos, maxScroll)))];
        }
        const desired = clampEnd && maxScroll > 0 ? Math.max(0, Math.min(maxScroll, current + direction * fallbackStep)) : current + direction * fallbackStep;
        const candidates = snaps.filter((pos) => direction > 0 ? pos > current + 4 : pos < current - 4);
        if (!candidates.length) {
          if (clampEnd && maxScroll > 0) return direction > 0 ? Math.max(0, maxScroll - current) : -current;
          return direction * fallbackStep;
        }
        let best = candidates[0];
        for (const pos of candidates) {
          if (Math.abs(pos - desired) < Math.abs(best - desired)) best = pos;
        }
        return best - current;
      }
      function fillSlot(slot, s) {
        var _a2, _b2, _c2, _d2;
        const row = slot.data;
        const head = element("div", "fx-row-head"), title = element("h2", "", row.title), track = element("div", "fx-track");
        const baseCount = row.items.length;
        const hasSeeMore = row.key === "DiscoverMovies" || row.key === "DiscoverTV" || row.items.some((i) => i.Type === "SeeMore");
        const compactTouch = isCompactTouchViewport();
        const noLoop = hasSeeMore || row.key === "MyMedia" || compactTouch;
        if (noLoop) track.dataset.noLoop = "true";
        const copies = !noLoop && baseCount >= 2 ? s.route.view === "genres" ? Math.max(2, Math.ceil(12 / baseCount)) : Math.max(6, Math.ceil(32 / baseCount)) : 1;
        const cycleWidth = () => {
          if (copies <= 1) return 0;
          const first = track.children[0], secondCycle = track.children[baseCount];
          return first && secondCycle && typeof secondCycle.offsetLeft === "number" && secondCycle.offsetLeft > first.offsetLeft ? secondCycle.offsetLeft - first.offsetLeft : 0;
        };
        const normalizeLoop = () => {
          if (track._fxProgrammatic) return;
          const cw = cycleWidth();
          if (!cw) return;
          while (track.scrollLeft >= cw * 2) track.scrollLeft -= cw;
          if (track.scrollLeft <= 2 && track._fxMoved) track.scrollLeft += cw;
        };
        const finishProgrammatic = () => {
          clearTimeout(track._fxScrollTimer);
          track._fxProgrammatic = false;
          normalizeLoop();
        };
        const bumpProgrammaticTimer = (ms = 200) => {
          clearTimeout(track._fxScrollTimer);
          track._fxScrollTimer = setTimeout(finishProgrammatic, ms);
        };
        const scroll = (direction) => {
          const cw = cycleWidth(), step = Math.max(180, Math.round((track.clientWidth || 320) * 0.85));
          if (cw > 0) {
            clearTimeout(track._fxScrollTimer);
            track._fxProgrammatic = true;
            const prevBehavior = track.style.scrollBehavior;
            track.style.scrollBehavior = "auto";
            if (direction > 0) {
              while (track.scrollLeft >= cw * 2 || track.scrollLeft + step >= cw * (copies - 1.2)) track.scrollLeft -= cw;
            } else {
              while (track.scrollLeft < step + 16) track.scrollLeft += cw;
            }
            track.style.scrollBehavior = prevBehavior;
            track._fxMoved = true;
            const delta = snapScrollDelta(track, direction, step, false);
            if (delta !== 0) {
              track.scrollBy({ left: delta, behavior: "smooth" });
              bumpProgrammaticTimer(750);
            } else {
              finishProgrammatic();
            }
            return;
          }
          if (hasSeeMore) {
            const delta = snapScrollDelta(track, direction, step, true);
            if (delta !== 0) track.scrollBy({ left: delta, behavior: "smooth" });
            return;
          }
          const end = Math.max(0, (track.scrollWidth || 0) - (track.clientWidth || 0));
          if (direction > 0 && track.scrollLeft >= end - 2) {
            if (typeof track.scrollTo === "function" && compactTouch) track.scrollTo({ left: 0, behavior: "smooth" });
            else track.scrollLeft = 0;
          } else if (direction < 0 && track.scrollLeft <= 2) {
            if (typeof track.scrollTo === "function" && compactTouch) track.scrollTo({ left: end, behavior: "smooth" });
            else track.scrollLeft = end;
          } else {
            const delta = snapScrollDelta(track, direction, step, true);
            if (delta !== 0) track.scrollBy({ left: delta, behavior: "smooth" });
          }
        };
        track.addEventListener("scroll", () => {
          if (track.scrollLeft > 12) track._fxMoved = true;
          if (track._fxProgrammatic) {
            bumpProgrammaticTimer(180);
            return;
          }
          normalizeLoop();
        }, { passive: true });
        track.addEventListener("scrollend", () => {
          if (track._fxProgrammatic) finishProgrammatic();
          else normalizeLoop();
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
          if (noLoop) return;
          const end = track.scrollWidth - track.clientWidth;
          if (end > 0 && (e.deltaX > 0 && track.scrollLeft >= end - 2 || e.deltaX < 0 && track.scrollLeft <= 2)) {
            e.preventDefault();
            scroll(e.deltaX > 0 ? 1 : -1);
          }
        }, { passive: false });
        if (!noLoop) {
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
        }
        const back = button("\u2039", () => scroll(-1)), forward = button("\u203A", () => scroll(1));
        back.setAttribute("aria-label", `Previous ${row.title}`);
        forward.setAttribute("aria-label", `More ${row.title}`);
        const token = row.family === "anchor" ? `anchor:${row.key}` : row.family === "theme" ? row.key : `family:${row.family}`;
        const requested = ((_b2 = (_a2 = s.profile) == null ? void 0 : _a2.layouts) == null ? void 0 : _b2[token]) || row.layout || "auto";
        const portraitOnly = row.key !== "MyMedia" && row.items.filter((i) => {
          var _a3, _b3, _c3, _d3, _e2;
          return !((_a3 = i.ImageTags) == null ? void 0 : _a3.Thumb) && !((_b3 = i.BackdropImageTags) == null ? void 0 : _b3.length) && !((_c3 = i.ParentBackdropImageTags) == null ? void 0 : _c3.length) && (((_d3 = i.ImageTags) == null ? void 0 : _d3.Primary) || ((_e2 = i.ProviderIds) == null ? void 0 : _e2.JellyseerrPoster)) && (!i.PrimaryImageAspectRatio || i.PrimaryImageAspectRatio < 1);
        }).length > row.items.length / 2;
        const layout = s.route.view === "genres" ? "landscape" : requested === "auto" ? row.external || row.key === "DiscoverMovies" || row.key === "DiscoverTV" || portraitOnly ? "portrait" : "landscape" : requested;
        const existingTrack = slot.node.querySelector(".fx-track");
        if (existingTrack && slot.node.dataset.layout === layout) {
          const existingEntries = [...existingTrack.querySelectorAll(".fx-card-entry")];
          const expectedIds = [];
          for (let copy = 0; copy < copies; copy++) {
            row.items.forEach((item) => expectedIds.push(item.Id || ""));
          }
          if (existingEntries.length === expectedIds.length && existingEntries.every((el, idx) => {
            var _a3, _b3;
            return (((_b3 = (_a3 = el.querySelector(".fx-card")) == null ? void 0 : _a3.dataset) == null ? void 0 : _b3.itemId) || "") === expectedIds[idx];
          })) {
            const existingHeading = slot.node.querySelector(".fx-row-head h2");
            if (existingHeading && existingHeading.textContent !== row.title) existingHeading.textContent = row.title;
            existingEntries.forEach((entry, idx) => {
              const item = row.items[idx % baseCount];
              const card = entry.querySelector(".fx-card");
              if (item && card) {
                const name = item.Type === "Episode" ? `${item.SeriesName || item.Name} \xB7 ${item.Name}` : item.Name || "Untitled";
                attachSimilarControls(entry, card, item, s, name);
                syncEntryBadge(entry, item, s);
              }
            });
            slot.node.className = "fx-shelf";
            slot.node.style.height = "";
            slot.live = true;
            return;
          }
        }
        const reusablePool = /* @__PURE__ */ new Map();
        if (existingTrack && slot.node.dataset.layout === layout) {
          for (const entry of existingTrack.querySelectorAll(".fx-card-entry")) {
            const itemId = ((_d2 = (_c2 = entry.querySelector(".fx-card")) == null ? void 0 : _c2.dataset) == null ? void 0 : _d2.itemId) || "";
            if (!itemId) continue;
            if (!reusablePool.has(itemId)) reusablePool.set(itemId, []);
            reusablePool.get(itemId).push(entry);
          }
        }
        const preservedScroll = existingTrack ? existingTrack.scrollLeft : slot.scrollLeft || 0;
        slot.node.dataset.layout = layout;
        head.append(title, back, forward);
        for (let copy = 0; copy < copies; copy++) {
          row.items.forEach((item) => {
            const pool = item.Id ? reusablePool.get(item.Id) : null;
            let cardNode = (pool == null ? void 0 : pool.length) ? pool.shift() : null;
            if (cardNode) {
              const card = cardNode.querySelector(".fx-card");
              const name = item.Type === "Episode" ? `${item.SeriesName || item.Name} \xB7 ${item.Name}` : item.Name || "Untitled";
              if (card) attachSimilarControls(cardNode, card, item, s, name);
              syncEntryBadge(cardNode, item, s);
            } else {
              cardNode = renderCard(item, s, true, layout);
            }
            if (copy > 0) cardNode.dataset.loopClone = String(copy);
            else delete cardNode.dataset.loopClone;
            track.append(cardNode);
          });
        }
        slot.node.replaceChildren(head, track);
        slot.node.className = "fx-shelf";
        slot.node.style.height = "";
        slot.live = true;
        if (preservedScroll) track.scrollLeft = preservedScroll;
      }
      function virtualize(s) {
        var _a2;
        if (state !== s || !s.root.isConnected || s.full) return;
        const center = innerHeight / 2;
        const measured = s.slots.map((slot) => {
          const r = slot.node.getBoundingClientRect();
          return { slot, distance: Math.abs((r.top + r.bottom) / 2 - center), height: r.height };
        });
        const keep = new Set(measured.slice().sort((a, b) => a.distance - b.distance).slice(0, s.config.maxLiveRows).map((x) => x.slot));
        for (const { slot, height } of measured) {
          if (keep.has(slot) && !slot.live) fillSlot(slot, s);
          else if (!keep.has(slot) && slot.live && !slot.node.contains(document.activeElement)) {
            if (height <= 0) continue;
            slot.scrollLeft = ((_a2 = slot.node.querySelector(".fx-track")) == null ? void 0 : _a2.scrollLeft) || 0;
            slot.node.style.height = `${height}px`;
            slot.node.replaceChildren();
            slot.node.className = "fx-shelf fx-placeholder-row";
            slot.live = false;
          }
        }
      }
      function renderSkeletonRows(s, count = 3) {
        if (s.full || s.slots.length) return;
        s.list.replaceChildren();
        for (let r = 0; r < count; r++) {
          const sec = element("section", "fx-shelf fx-skeleton-row");
          sec.dataset.skeleton = "true";
          const head = element("div", "fx-row-head");
          head.append(element("div", "fx-skeleton-title"));
          const track = element("div", "fx-track");
          for (let c = 0; c < 6; c++) {
            const entry = element("div", "fx-card-entry");
            const vis = element("div", "fx-card-visual is-loading fx-skeleton-box");
            const line = element("div", "fx-skeleton-line");
            entry.append(vis, line);
            track.append(entry);
          }
          sec.append(head, track);
          s.list.append(sec);
        }
      }
      function appendRow(row, s, isBoot = false) {
        s.list.querySelectorAll('[data-skeleton="true"]').forEach((n) => n.remove());
        const slot = { node: element("section", "fx-shelf"), data: row, live: false, boot: isBoot };
        if (isBoot) slot.node.dataset.bootRow = "true";
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
        const hasActiveFilter = filtersActive(s.filters) || s.filters.sort !== "recommended";
        if (hasActiveFilter) {
          s.filteredQueue = [];
          for (let n = 0; n < items.length; n += s.config.cardsPerShelf) s.filteredQueue.push({ key: `filtered:${n}`, title: `Matches ${n + 1}\u2013${Math.min(n + s.config.cardsPerShelf, items.length)} of ${items.length}`, family: "filtered", items: items.slice(n, n + s.config.cardsPerShelf) });
        }
        s.matchCount.textContent = hasActiveFilter ? `${items.length} matching titles` : "";
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
        savedFeeds.set(s.key, { config: JSON.stringify(s.config), inventory: s.inventory, tracking: s.tracking, filters: cloneJson(s.filters), planner: s.planner, pending: s.pending, filteredQueue: ((_a2 = s.filteredQueue) == null ? void 0 : _a2.slice()) || null, rows: s.slots.filter((slot) => !slot.boot).map((slot) => slot.data), openingIndex: s.openingIndex || 0, anchorIndex: s.anchorIndex, anchorTurn: s.anchorTurn, finished: s.finished, shuffle: s.shuffle, focus: s.lastFocus, scrollTop: root.scrollTop || 0, tracks: s.slots.filter((slot) => !slot.boot).map((slot) => {
          var _a3;
          return ((_a3 = slot.node.querySelector(".fx-track")) == null ? void 0 : _a3.scrollLeft) || 0;
        }), at: Date.now() });
        if (savedFeeds.size > 6) savedFeeds.delete(savedFeeds.keys().next().value);
      }
      function restoreFeed(s, saved) {
        var _a2;
        s.slots = [];
        s.list.replaceChildren();
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
        s.footer.hidden = s.full;
        s.more.hidden = s.finished;
        s.more.disabled = false;
        const hasActiveFilter = filtersActive(s.filters) || s.filters.sort !== "recommended";
        s.matchCount.textContent = hasActiveFilter ? `${filterItems(s.inventory.items, s.filters, s.tracking).length} matching titles` : "";
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
        var _a2, _b2, _c2, _d2, _e2, _f;
        if (!hide) {
          s.native.removeAttribute("data-fx-native-hidden");
          s.native.removeAttribute("data-fx-react-host");
          (_b2 = (_a2 = s.page) == null ? void 0 : _a2.removeAttribute) == null ? void 0 : _b2.call(_a2, "data-fx-react-host");
          s.native.querySelectorAll("[data-fx-native-hidden]").forEach((n) => n.removeAttribute("data-fx-native-hidden"));
          (_d2 = (_c2 = s.page) == null ? void 0 : _c2.querySelectorAll) == null ? void 0 : _d2.call(_c2, "[data-fx-native-hidden]").forEach((n) => n.removeAttribute("data-fx-native-hidden"));
          s.native.removeAttribute("data-fx-hero-anchor");
          if (s.route.page !== "home" && s.page) {
            const tabs = [...s.page.querySelectorAll(".pageTabContent")];
            if (tabs.length > 1) {
              tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.index === "0"));
            }
          }
          return;
        }
        if (s.route.page !== "home") {
          if (s.native === s.page) {
            if (s.page.getAttribute("data-fx-react-host") !== "true") s.page.setAttribute("data-fx-react-host", "true");
            [...s.page.children].forEach((child) => {
              if (!child.classList.contains("fx-discovery") && child.getAttribute("data-fx-native-hidden") !== "true") {
                child.setAttribute("data-fx-native-hidden", "true");
              }
            });
            return;
          }
          if (s.native.getAttribute("data-fx-native-hidden") !== "true") s.native.setAttribute("data-fx-native-hidden", "true");
          (_f = (_e2 = s.page) == null ? void 0 : _e2.querySelectorAll) == null ? void 0 : _f.call(_e2, ".pageTabContent").forEach((tab) => {
            if (tab.getAttribute("data-fx-native-hidden") !== "true") tab.setAttribute("data-fx-native-hidden", "true");
          });
          return;
        }
        if (s.native.dataset.fxHeroAnchor !== "true") s.native.dataset.fxHeroAnchor = "true";
        if (s.native.hasAttribute("data-fx-native-hidden")) s.native.removeAttribute("data-fx-native-hidden");
        const protect = ".sleekfin-hero,.hero,#slides-container";
        const walk = (parent) => [...parent.children].forEach((node) => {
          if (node.matches(protect) || node.closest(".fx-discovery")) return;
          if (node.matches(".sections") || node.querySelector(`${protect},.sections`)) {
            if (node.hasAttribute("data-fx-native-hidden")) node.removeAttribute("data-fx-native-hidden");
            walk(node);
          } else if (node.getAttribute("data-fx-native-hidden") !== "true") {
            node.setAttribute("data-fx-native-hidden", "true");
          }
        });
        walk(s.native);
      }
      function setMode(s, full, remember = true) {
        s.full = full;
        s.root.classList.toggle("fx-mode-full", !!full);
        s.list.hidden = full;
        s.footer.hidden = full || !s.slots.length && !s.finished;
        const hasHeaderViewMenu = !!document.querySelector('button[aria-controls="library-view-menu"]');
        const titlePicker = s.root.querySelector(".fx-title-picker");
        if (titlePicker) titlePicker.hidden = hasHeaderViewMenu;
        s.root.hidden = !!(full && s.route.page !== "home" && hasHeaderViewMenu && !s.failed);
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
        syncHomeModeAttr(s.api);
        if (!s.started) initialize(s);
        else if (!full && s.planner && !s.slots.filter((slot) => !slot.boot).length) loadMore(s);
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
            }
          } else {
            s.anchorTurn = true;
            const row = s.planner.next(s.anchorIndex <= s.profile.anchors.length && s.anchorIndex > 0 && s.slots.filter((slot) => !slot.boot).length < s.profile.anchors.length * 2 ? "theme" : null);
            if (row) return row;
            if (s.anchorIndex >= s.profile.anchors.length) return null;
          }
        }
        return null;
      }
      async function loadMore(s, automatic = false) {
        var _a2;
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
            const items = row.key === "MyMedia" || row.external || row.key === "ContinueWatchingNextUp" || s.route.view === "genres" || s.initialHydrateSkip ? row.items : await s.client.hydrate(row.items);
            s.client.assertCurrent();
            if (state !== s) return;
            if (items.length && !s.full) {
              let hydratedRow = { ...row, items };
              const existingBoot = s.slots.find((slot) => {
                var _a3;
                return slot.boot && ((_a3 = slot.data) == null ? void 0 : _a3.key) === hydratedRow.key;
              });
              if (existingBoot) {
                if (hydratedRow.family !== "anchor" && Array.isArray((_a2 = existingBoot.data) == null ? void 0 : _a2.items) && existingBoot.data.items.length) {
                  const byIdMap = new Map(items.map((i) => [i.Id, i]));
                  const ordered = existingBoot.data.items.map((oldItem) => byIdMap.get(oldItem.Id) || oldItem).filter(Boolean);
                  const seen = new Set(ordered.map((i) => i.Id));
                  for (const item of items) {
                    if (!seen.has(item.Id)) {
                      seen.add(item.Id);
                      ordered.push(item);
                    }
                  }
                  hydratedRow = { ...hydratedRow, items: ordered.slice(0, s.config.cardsPerShelf) };
                }
                s.list.querySelectorAll('[data-skeleton="true"]').forEach((node) => node.remove());
                existingBoot.boot = false;
                delete existingBoot.node.dataset.bootRow;
                existingBoot.node.dataset.shelfKey = hydratedRow.key;
                existingBoot.data = hydratedRow;
                fillSlot(existingBoot, s);
              } else {
                appendRow(hydratedRow, s);
              }
              s.failed = false;
              s.footer.hidden = s.full;
              syncNative(s, true);
            }
            s.pending = null;
          }
          for (const staleBoot of s.slots.filter((slot) => slot.boot)) {
            staleBoot.node.remove();
          }
          s.slots = s.slots.filter((slot) => !slot.boot);
          s.list.querySelectorAll('[data-skeleton="true"]').forEach((n) => n.remove());
          s.status.textContent = [...s.warnings].join(" ");
          s.pauseAutomatic = false;
          if ((s.slots.length || s.filteredQueue) && !s.full) {
            s.failed = false;
            s.filterToggle.disabled = !s.inventory;
            s.footer.hidden = s.full;
            syncNative(s, true);
            writeBootRows(s);
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
            s.footer.hidden = s.full;
            s.status.textContent = "Could not load the next shelves. Your existing rows are intact. Use Try again or the normal view.";
          }
        } finally {
          s.loading = false;
          s.initialHydrateSkip = false;
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
        if (route.page === "movies" || route.page === "shows") {
          const homeSnap = snapshots.get(`${scope}:home:`);
          if (homeSnap && Date.now() - homeSnap.at < 5 * 6e4) {
            const wantCol = route.page === "movies" ? "movies" : "tvshows";
            const matchingViews = (homeSnap.value.views || []).filter((v) => v.CollectionType === wantCol);
            if (!route.parentId || matchingViews.length === 1 && matchingViews[0].Id === route.parentId) {
              const wantType = route.page === "movies" ? "Movie" : "Series";
              return {
                items: homeSnap.value.items.filter((i) => i.Type === wantType),
                seasons: route.page === "shows" ? homeSnap.value.seasons : [],
                views: homeSnap.value.views || []
              };
            }
          }
        }
        return null;
      }
      function refreshSlotBadges(s) {
        if (!s.byId || state !== s) return;
        for (const slot of s.slots) {
          if (!slot.live) continue;
          for (const card of slot.node.querySelectorAll(".fx-card[data-item-id]")) {
            const item = s.byId.get(card.dataset.itemId);
            const visual = card.querySelector(".fx-card-visual");
            if (!item || !visual) continue;
            const text = badgeFor(item, s.badges, s.now, s.tracking);
            let badge = visual.querySelector(".fx-badge");
            if (!text) {
              badge == null ? void 0 : badge.remove();
              continue;
            }
            if (!badge) {
              badge = element("span", "fx-badge");
              visual.append(badge);
            }
            if (badge.textContent !== text) badge.textContent = text;
          }
        }
      }
      async function initialize(s) {
        var _a2, _b2, _c2;
        if (s.started) return;
        s.started = true;
        s.status.textContent = "";
        s.footer.hidden = true;
        try {
          let localError, hasLocalConfig = false;
          try {
            hasLocalConfig = !!localStorage.getItem(configKey(s.api));
            s.config = readConfig(s.api);
          } catch (e) {
            localError = e;
          }
          let paintedBoot = false;
          if (s.config && !s.full) {
            s.profile = s.config.pages[s.route.page];
            const earlySaved = savedFeeds.get(s.key);
            if (earlySaved && Date.now() - earlySaved.at < 30 * 6e4 && earlySaved.config === JSON.stringify(s.config) && ((_a2 = earlySaved.rows) == null ? void 0 : _a2.length)) {
              if (earlySaved.shuffle) s.shuffle = earlySaved.shuffle;
              earlySaved.rows.slice(0, 4).forEach((row) => appendRow(row, s, true));
              paintedBoot = true;
            } else if (hasLocalConfig) {
              const bootData = readBootRows(s, JSON.stringify(s.config));
              if ((_b2 = bootData == null ? void 0 : bootData.rows) == null ? void 0 : _b2.length) {
                if (bootData.shuffle) s.shuffle = bootData.shuffle;
                bootData.rows.forEach((row) => appendRow(row, s, true));
                paintedBoot = true;
              }
            }
            if (!paintedBoot) renderSkeletonRows(s, 3);
            syncNative(s, true);
          }
          if (!s.full && s.route.view !== "genres") {
            const p = s.client.json("HomeScreen/Section/ContinueWatchingNextUp", { UserId: s.client.userId });
            p.catch(() => {
            });
            s.client.prefetchedSections.set("ContinueWatchingNextUp", p);
          }
          const cacheKey = `${s.scope}:${s.route.page}:${s.route.parentId}`;
          const cachedInv = findCachedInventory(s.scope, s.route);
          const prefPromise = s.client.preferences().then((profile) => ({ ok: true, profile })).catch(() => ({ ok: false }));
          const invPromise = cachedInv ? Promise.resolve(cachedInv) : s.client.inventory(s.route);
          invPromise.catch(() => {
          });
          const prefRes = await prefPromise;
          s.client.assertCurrent();
          if (prefRes.ok) {
            s.profileVersion = prefRes.profile.version;
            s.syncAvailable = true;
            if (prefRes.profile.config) {
              s.config = validateConfig(upgradeLegacyConfig(prefRes.profile.config));
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
          if (!s.full && !paintedBoot) {
            const bootData = readBootRows(s, JSON.stringify(s.config));
            if ((_c2 = bootData == null ? void 0 : bootData.rows) == null ? void 0 : _c2.length) {
              if (bootData.shuffle) s.shuffle = bootData.shuffle;
              bootData.rows.forEach((row) => appendRow(row, s, true));
              paintedBoot = true;
              syncNative(s, true);
            } else if (s.route.view !== "genres") {
              s.client.fastOpening(s.route, s.config).then((fastRows) => {
                if (state !== s || s.full || s.planner || s.slots.length || !(fastRows == null ? void 0 : fastRows.length)) return;
                fastRows.forEach((row) => appendRow(row, s, true));
                syncNative(s, true);
              }).catch(() => {
              });
            }
          }
          const inv = await invPromise;
          s.client.assertCurrent();
          s.inventory = inv;
          snapshots.set(cacheKey, { at: Date.now(), value: s.inventory });
          if (snapshots.size > 6) snapshots.delete(snapshots.keys().next().value);
          s.badges = seasonBadges(s.inventory.seasons, s.now);
          if (!(s.tracking instanceof Map)) s.tracking = readTrackingCache(s.scope);
          s.inventory.tracking = s.tracking;
          s.byId = new Map(s.inventory.items.map((i) => [i.Id, i]));
          s.filterToggle.disabled = s.full;
          decorateNative(s);
          const trackingTask = s.client.tracking(s.inventory.items).then((arrival) => {
            if (state !== s) return;
            s.tracking = arrival.records instanceof Map ? arrival.records : /* @__PURE__ */ new Map();
            s.trackingReady = arrival.ready;
            s.inventory.tracking = s.tracking;
            if (arrival.ready) writeTrackingCache(s.scope, s.tracking);
            decorateNative(s);
            refreshSlotBadges(s);
          }).catch(() => {
            if (state !== s) return;
            s.trackingReady = false;
            s.warnings.add("Arrival badges are unavailable until the Discovery Companion is installed and its baseline is ready.");
            if (!s.loading) s.status.textContent = [...s.warnings].join(" ");
          });
          const saved = savedFeeds.get(s.key);
          if (saved && Date.now() - saved.at < 30 * 6e4 && saved.config === JSON.stringify(s.config)) {
            restoreFeed(s, saved);
            s.status.textContent = [...s.warnings].join(" ");
          } else {
            preparePlanner(s);
            filterPanel(s);
            s.status.textContent = "";
            s.initialHydrateSkip = true;
            await loadMore(s);
          }
          await trackingTask;
        } catch {
          if (state !== s) return;
          s.slots = [];
          s.list.replaceChildren();
          s.failed = true;
          s.status.textContent = "Discovery could not start. The normal view is restored. Check Customize for invalid rules or use Restart feed to try again.";
          setMode(s, true, false);
        }
      }
      function decorateNative(s) {
        if (!s.byId || state !== s) return;
        if (!s.full && !s.failed && s.route.page !== "home") return;
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
      function closeDownloadMenu() {
        if (downloadMenu) {
          downloadMenu.remove();
          downloadMenu = null;
        }
        downloadMenuTrigger = null;
      }
      function sanitizeFilename(raw, fallback = "video") {
        const cleaned = String(raw || "").replace(/[<>:"/\\|?*\x00-\x1f]+/g, " ").replace(/\s+/g, " ").trim().replace(/[. ]+$/g, "");
        return cleaned || fallback;
      }
      function formatItemDownloadBase(item) {
        if (!(item == null ? void 0 : item.Name)) return "";
        if (item.Type === "Episode" && item.SeriesName) {
          const sNum = Number.isFinite(item.ParentIndexNumber) ? `S${String(item.ParentIndexNumber).padStart(2, "0")}` : "";
          const eNum = Number.isFinite(item.IndexNumber) ? `E${String(item.IndexNumber).padStart(2, "0")}` : "";
          const code = sNum || eNum ? ` - ${sNum}${eNum}` : "";
          return sanitizeFilename(`${item.SeriesName}${code} - ${item.Name}`);
        }
        return sanitizeFilename(item.Name);
      }
      function inferDownloadTitle(itemId, btn) {
        var _a2, _b2, _c2, _d2, _e2, _f, _g, _h, _i, _j;
        const cached = ((_a2 = state == null ? void 0 : state.byId) == null ? void 0 : _a2.get(itemId)) || ((_c2 = (_b2 = state == null ? void 0 : state.inventory) == null ? void 0 : _b2.items) == null ? void 0 : _c2.find((i) => i.Id === itemId));
        if (cached == null ? void 0 : cached.Name) return formatItemDownloadBase(cached);
        const epCard = (_d2 = btn == null ? void 0 : btn.closest) == null ? void 0 : _d2.call(btn, ".sleekfin-details-episode-card,[data-sleekfin-episode-id]");
        if (epCard) {
          const epTitle = (_f = (_e2 = epCard.querySelector(".sleekfin-details-episode-title,.cardText-first")) == null ? void 0 : _e2.textContent) == null ? void 0 : _f.trim();
          const seriesTitle = (_h = (_g = document.querySelector("#itemDetailPage .sleekfin-details-title,#itemDetailPage .itemName,#itemDetailPage h1")) == null ? void 0 : _g.textContent) == null ? void 0 : _h.trim();
          if (seriesTitle && epTitle) return sanitizeFilename(`${seriesTitle} - ${epTitle}`);
          if (epTitle) return sanitizeFilename(epTitle);
        }
        const detailTitle = (_j = (_i = document.querySelector("#itemDetailPage .sleekfin-details-title,#itemDetailPage .itemName,#itemDetailPage h1")) == null ? void 0 : _i.textContent) == null ? void 0 : _j.trim();
        if (detailTitle) return sanitizeFilename(detailTitle);
        return "";
      }
      function showToast(text) {
        let toast = document.querySelector(".fx-toast");
        if (!toast) {
          toast = element("div", "fx-toast");
          toast.setAttribute("role", "status");
          document.body.append(toast);
        }
        toast.textContent = text;
        toast.classList.add("is-visible");
        clearTimeout(toast._fxTimer);
        toast._fxTimer = setTimeout(() => {
          toast.classList.remove("is-visible");
        }, 2400);
      }
      function triggerUrlDownload(url, filename = "") {
        const a = element("a");
        a.href = url;
        a.setAttribute("download", filename || "");
        a.rel = "noopener noreferrer";
        if (isCompactTouchViewport()) a.target = "_blank";
        document.body.append(a);
        a.click();
        a.remove();
      }
      async function startMediaDownload({ url, itemId, baseTitle, filename, cachedItem, api }) {
        var _a2, _b2, _c2, _d2, _e2, _f;
        const absUrl = safeUrl(url, location.href) || url;
        const nativeShell = window.NativeShell;
        if (nativeShell && (typeof nativeShell.downloadFiles === "function" || typeof nativeShell.downloadFile === "function")) {
          let itemObj = cachedItem || ((_a2 = state == null ? void 0 : state.byId) == null ? void 0 : _a2.get(itemId)) || ((_c2 = (_b2 = state == null ? void 0 : state.inventory) == null ? void 0 : _b2.items) == null ? void 0 : _c2.find((i) => i.Id === itemId)) || null;
          const uid = (_d2 = api == null ? void 0 : api.getCurrentUserId) == null ? void 0 : _d2.call(api);
          if (!itemObj && uid && typeof (api == null ? void 0 : api.getJSON) === "function" && typeof (api == null ? void 0 : api.getUrl) === "function") {
            try {
              itemObj = await api.getJSON(api.getUrl(`Users/${encodeURIComponent(uid)}/Items/${encodeURIComponent(itemId)}`));
            } catch {
            }
          }
          const finalBase = formatItemDownloadBase(itemObj) || baseTitle || "video";
          const finalFilename = filename || `${finalBase}.mp4`;
          const payload = {
            url: absUrl,
            item: itemObj || { Id: itemId, Name: finalBase, ServerId: ((_e2 = api == null ? void 0 : api.serverId) == null ? void 0 : _e2.call(api)) || "" },
            itemId,
            serverId: (itemObj == null ? void 0 : itemObj.ServerId) || ((_f = api == null ? void 0 : api.serverId) == null ? void 0 : _f.call(api)) || "",
            title: (itemObj == null ? void 0 : itemObj.Name) || finalBase,
            filename: finalFilename
          };
          if (typeof nativeShell.downloadFiles === "function") {
            await nativeShell.downloadFiles([payload]);
          } else {
            await nativeShell.downloadFile(payload);
          }
          showToast("Added to Jellyfin Downloads");
          return;
        }
        triggerUrlDownload(absUrl, filename);
      }
      function openDownloadMenu(btn, itemId, api) {
        var _a2, _b2, _c2, _d2, _e2;
        if (downloadMenu && downloadMenuTrigger === btn) {
          closeDownloadMenu();
          return;
        }
        closeDownloadMenu();
        downloadMenuTrigger = btn;
        let baseTitle = inferDownloadTitle(itemId, btn);
        let resolvedItem = ((_a2 = state == null ? void 0 : state.byId) == null ? void 0 : _a2.get(itemId)) || ((_c2 = (_b2 = state == null ? void 0 : state.inventory) == null ? void 0 : _b2.items) == null ? void 0 : _c2.find((i) => i.Id === itemId)) || null;
        const token = ((_d2 = api.accessToken) == null ? void 0 : _d2.call(api)) || "";
        const resolveApiUrl = (path, params) => {
          var _a3;
          const raw = (_a3 = api.getUrl) == null ? void 0 : _a3.call(api, path, params);
          if (typeof raw === "string") return safeUrl(raw, location.href) || raw;
          const qs = new URLSearchParams(params || {}).toString();
          const rel = `/${String(path).replace(/^\/+/, "")}${qs ? "?" + qs : ""}`;
          return safeUrl(rel, location.href) || rel;
        };
        const fullUrl = resolveApiUrl(`Videos/${encodeURIComponent(itemId)}/stream.mp4`, {
          Static: "true",
          ...token ? { api_key: token } : {}
        });
        const transcodeUrl = resolveApiUrl(`Videos/${encodeURIComponent(itemId)}/stream.mp4`, {
          Static: "false",
          VideoCodec: "h264",
          AudioCodec: "aac",
          Profile: "high",
          Level: "41",
          MaxWidth: "1280",
          MaxHeight: "720",
          VideoBitRate: "1600000",
          AudioBitRate: "128000",
          MaxAudioChannels: "2",
          TranscodingProtocol: "http",
          TranscodingContainer: "mp4",
          PlaySessionId: "fx-dl-" + Date.now(),
          ...token ? { api_key: token } : {}
        });
        const menu = element("div", "fx-download-menu is-open");
        menu.setAttribute("role", "menu");
        menu.setAttribute("aria-label", "Download quality options");
        const fileFor = () => `${baseTitle || sanitizeFilename(inferDownloadTitle(itemId, btn), "video")}.mp4`;
        const makeOption = (title, url) => {
          const opt = element("button", "fx-download-option", title);
          opt.type = "button";
          opt.dataset.downloadUrl = url;
          opt.setAttribute("download", fileFor());
          opt.setAttribute("role", "menuitem");
          opt.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            const filename = fileFor();
            opt.setAttribute("download", filename);
            closeDownloadMenu();
            startMediaDownload({ url, itemId, baseTitle, filename, cachedItem: resolvedItem, api });
          });
          return opt;
        };
        const fullOpt = makeOption("Full Quality", fullUrl);
        const condensedOpt = makeOption("Condensed", transcodeUrl);
        menu.append(fullOpt, condensedOpt);
        const uid = (_e2 = api.getCurrentUserId) == null ? void 0 : _e2.call(api);
        if (uid && typeof api.getJSON === "function" && typeof api.getUrl === "function") {
          Promise.resolve(api.getJSON(api.getUrl(`Users/${encodeURIComponent(uid)}/Items/${encodeURIComponent(itemId)}`))).then((info) => {
            if (info && typeof info === "object") resolvedItem = info;
            const refined = formatItemDownloadBase(info);
            if (refined) {
              baseTitle = refined;
              fullOpt.setAttribute("download", fileFor());
              condensedOpt.setAttribute("download", fileFor());
            }
          }).catch(() => {
          });
        }
        document.body.append(menu);
        downloadMenu = menu;
        const rect = typeof btn.getBoundingClientRect === "function" ? btn.getBoundingClientRect() : null;
        if (rect && (rect.width > 0 || rect.height > 0)) {
          const top = Math.min((window.innerHeight || 800) - 150, Math.max(12, Math.round(rect.bottom + 8)));
          const left = Math.min((window.innerWidth || 1280) - 290, Math.max(12, Math.round(rect.left)));
          menu.style.top = `${top}px`;
          menu.style.left = `${left}px`;
        } else {
          menu.style.top = "120px";
          menu.style.left = "80px";
        }
      }
      function openSeasonMenu(seasonWrap, select) {
        if (downloadMenu && downloadMenuTrigger === seasonWrap) {
          closeDownloadMenu();
          return;
        }
        closeDownloadMenu();
        downloadMenuTrigger = seasonWrap;
        const menu = element("div", "fx-download-menu fx-season-menu is-open");
        menu.setAttribute("role", "menu");
        menu.setAttribute("aria-label", "Select season");
        [...select.options].forEach((opt) => {
          const label = (opt.textContent || opt.label || "").trim();
          const item = button(label, () => {
            var _a2, _b2;
            closeDownloadMenu();
            if (select.value !== opt.value) {
              for (const o of select.querySelectorAll("option")) {
                const isMatch = o.value === opt.value;
                o.selected = isMatch;
                (_a2 = o.toggleAttribute) == null ? void 0 : _a2.call(o, "selected", isMatch);
              }
              try {
                select.value = opt.value;
              } catch {
              }
              const Ev = typeof Event === "function" ? Event : (_b2 = document.defaultView) == null ? void 0 : _b2.Event;
              if (Ev) select.dispatchEvent(new Ev("change", { bubbles: true }));
            }
          });
          item.className = "fx-download-option fx-season-option" + (opt.value === select.value ? " is-selected" : "");
          item.setAttribute("role", "menuitemradio");
          item.setAttribute("aria-checked", opt.value === select.value ? "true" : "false");
          menu.append(item);
        });
        document.body.append(menu);
        downloadMenu = menu;
        const rect = typeof seasonWrap.getBoundingClientRect === "function" ? seasonWrap.getBoundingClientRect() : null;
        if (rect && (rect.width > 0 || rect.height > 0)) {
          const top = Math.min((window.innerHeight || 800) - 240, Math.max(12, Math.round(rect.bottom + 6)));
          const left = Math.min((window.innerWidth || 1280) - 220, Math.max(12, Math.round(rect.left)));
          menu.style.top = `${top}px`;
          menu.style.left = `${left}px`;
        } else {
          menu.style.top = "160px";
          menu.style.left = "80px";
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
          s.config = profile.config ? validateConfig(upgradeLegacyConfig(profile.config)) : s.config;
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
          document.querySelectorAll("[data-fx-settings-link],[data-fx-home-studio]").forEach((n) => n.remove());
        }
        settingsScope = scope;
        if (!scope) return;
        if (/^#!?\/?mypreferencesmenu(?:[?]|$)/i.test(location.hash)) {
          const page = [...document.querySelectorAll("#myPreferencesMenuPage,.userPreferencesPage")].find(visible);
          if (page && !page.querySelector("[data-fx-settings-link]")) {
            const section = page.querySelector(".verticalSection:has(.listItem-border)") || page.querySelector(".readOnlyContent .verticalSection") || page.querySelector(".verticalSection") || page;
            const link = element("button", "emby-button listItem-border fx-settings-menu-row");
            link.type = "button";
            link.dataset.fxSettingsLink = "true";
            const itemRow = element("div", "listItem");
            const icon = element("span", "material-icons tune listItemIcon", "");
            icon.setAttribute("aria-hidden", "true");
            const body = element("div", "listItemBody");
            body.append(element("div", "listItemBodyText", "Discovery"));
            itemRow.append(icon, body);
            link.append(itemRow);
            link.addEventListener("click", () => openUserSettings(api));
            const homeAnchor = section.querySelector('a[href*="mypreferenceshome"], [data-id="home"]');
            if (homeAnchor && homeAnchor.parentElement === section) homeAnchor.after(link);
            else section.append(link);
          }
        }
        if (/^#!?\/?mypreferenceshome(?:[?]|$)/i.test(location.hash)) {
          const homePref = [...document.querySelectorAll("#homeScreenPreferencesPage,.homeScreenPreferencesPage")].find(visible);
          if (homePref && !homePref.querySelector("[data-fx-home-studio]")) {
            const container = homePref.querySelector(".readOnlyContent") || homePref.querySelector(".content-primary") || homePref;
            const nativeForm = container.querySelector("form,.homeScreenSettingsContainer");
            if (nativeForm && !nativeForm.closest(".fx-legacy-home-settings")) {
              const details = element("details", "fx-legacy-home-settings");
              const summary = element("summary", "", "Legacy Jellyfin Home sections (used only when Normal Home is active)");
              nativeForm.before(details);
              details.append(summary, nativeForm);
            }
            const host = element("div");
            host.dataset.fxHomeStudio = "true";
            container.prepend(host);
            mountInlineSettings(host, api);
          }
        }
      }
      function visible(node) {
        if (!(node == null ? void 0 : node.isConnected) || node.closest(".hide,[hidden],.hidePage")) return false;
        return getComputedStyle(node).display !== "none";
      }
      function locate(route) {
        const selector = route.page === "home" ? "#indexPage, .homePage" : route.page === "movies" ? "#moviesPage" : "#tvshowsPage, #tvRecommendedPage";
        for (const page of document.querySelectorAll(selector)) {
          if (!visible(page)) continue;
          const wantIndex = route.view === "genres" ? route.page === "movies" ? 4 : 3 : route.view === "library" ? 0 : new URLSearchParams(location.hash.split("?")[1] || "").get("tab") || 1;
          const native = route.page === "home" ? page.querySelector(".homeSectionsContainer") : page.querySelector(`.pageTabContent[data-index="${wantIndex}"]`) || page.querySelector(".pageTabContent.is-active, .pageTabContent") || page;
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
        var _a2, _b2;
        const key = state == null ? void 0 : state.key;
        const scope = (state == null ? void 0 : state.scope) || (((_b2 = (_a2 = window.ApiClient) == null ? void 0 : _a2.getCurrentUserId) == null ? void 0 : _b2.call(_a2)) ? scopeKey(window.ApiClient) : "");
        if (clearCache) {
          snapshots.clear();
          clearBootRows(scope);
        }
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
        syncLibraryViewMenu();
        syncMobileOverflowDrawer(api);
        syncHomeModeAttr(api);
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
          const hasHeaderViewMenu = !!document.querySelector('button[aria-controls="library-view-menu"]');
          const titlePicker = state.root.querySelector(".fx-title-picker");
          if (titlePicker) titlePicker.hidden = hasHeaderViewMenu;
          state.root.hidden = !!(state.full && state.route.page !== "home" && hasHeaderViewMenu && !state.failed);
          if (!state.full && !state.failed) syncNative(state, true);
          decorateNative(state);
          return;
        }
        cleanup();
        const token = generation;
        const root = element("div", "fx-discovery"), toolbar = element("div", "fx-toolbar"), list = element("div"), status = element("p", "fx-status"), footer = element("div", "fx-footer"), panel = element("div", "fx-filters"), matchCount = element("p", "fx-match-count");
        panel.hidden = true;
        status.setAttribute("role", "status");
        const s = { ...target, api, scope, key, route, root, list, status, footer, panel, matchCount, token, now: /* @__PURE__ */ new Date(), slots: [], badges: /* @__PURE__ */ new Map(), tracking: readTrackingCache(scope), filters: cloneJson(DEFAULT_FILTERS), warnings: /* @__PURE__ */ new Set(), anchorIndex: 0, anchorTurn: true, started: false, loading: false, full: false, failed: false, shuffle: hash(String(Date.now())) };
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
          const defaultLabel = route.page === "movies" ? "Movies" : "TV Shows";
          const currentLabel = route.view === "library" ? "Library" : route.view === "genres" ? "Genres" : defaultLabel;
          const titlePicker = element("div", "fx-title-picker");
          const heading = element("h1", "", defaultLabel);
          const modeLabel = element("span", "fx-title-mode", `${currentLabel} \u25BE`);
          const switcher = element("select", "fx-title-select");
          switcher.setAttribute("aria-label", "Browse mode");
          const viewOptions = [
            ["suggestions", defaultLabel],
            ["library", "Library"],
            ["favorites", "Favorites"],
            ["genres", "Genres"]
          ];
          for (const [value, label] of viewOptions) {
            const option = element("option", "", label);
            option.value = value;
            option.selected = route.view === value;
            switcher.append(option);
          }
          const applySwitch = (val) => {
            var _a3;
            const chosen = ((_a3 = viewOptions.find(([v]) => v === val)) == null ? void 0 : _a3[1]) || defaultLabel;
            modeLabel.textContent = `${chosen} \u25BE`;
            const q = new URLSearchParams(location.hash.split("?")[1] || "");
            q.set("tab", val === "library" ? "0" : val === "favorites" ? "2" : val === "genres" ? route.page === "movies" ? "4" : "3" : "1");
            scrollToTop();
            location.hash = location.hash.split("?")[0] + "?" + q;
            schedule();
          };
          switcher.addEventListener("change", () => applySwitch(switcher.value));
          titlePicker.append(heading, modeLabel, switcher);
          titlePicker.hidden = !!document.querySelector('button[aria-controls="library-view-menu"]');
          toolbar.prepend(titlePicker);
        }
        footer.append(s.more, s.note);
        root.append(toolbar, panel, matchCount, status, list, footer);
        if (route.page === "home") target.native.after(root);
        else if (target.native === target.page) target.page.prepend(root);
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
        if (!savedFeeds.has(key)) scrollToTop();
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
      function closeDrawers() {
        var _a2, _b2;
        document.querySelectorAll(".mainDrawer.drawer-open,.touch-menu-la.drawer-open").forEach((d) => d.classList.remove("drawer-open"));
        (_b2 = (_a2 = document.body) == null ? void 0 : _a2.classList) == null ? void 0 : _b2.remove("menu-open", "withSectionTabs");
        document.querySelectorAll(".mainDrawer-backdrop,.backdrop-open,.MuiDrawer-root .MuiBackdrop-root,[data-sleekfin-header-overflow-backdrop]").forEach((b) => {
          var _a3;
          try {
            if (getComputedStyle(b).display !== "none" && getComputedStyle(b).visibility !== "hidden") (_a3 = b.click) == null ? void 0 : _a3.call(b);
          } catch {
          }
        });
        document.querySelectorAll('[data-sleekfin-header-overflow-toggle][aria-expanded="true"]').forEach((t) => {
          var _a3;
          try {
            (_a3 = t.click) == null ? void 0 : _a3.call(t);
          } catch {
          }
        });
      }
      function navSuggestions(event) {
        var _a2, _b2, _c2, _d2, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B;
        const seasonWrap = (_b2 = (_a2 = event.target).closest) == null ? void 0 : _b2.call(_a2, ".sleekfin-details-season-select");
        if (seasonWrap && !((_d2 = (_c2 = event.target).closest) == null ? void 0 : _d2.call(_c2, ".fx-download-menu"))) {
          const select = seasonWrap.querySelector("select.sleekfin-details-season-native, select");
          if (select && ((_e2 = select.options) == null ? void 0 : _e2.length)) {
            event.preventDefault();
            (_f = event.stopImmediatePropagation) == null ? void 0 : _f.call(event);
            event.stopPropagation();
            openSeasonMenu(seasonWrap, select);
            return;
          }
        }
        const dlBtn = (_h = (_g = event.target).closest) == null ? void 0 : _h.call(_g, 'button.btnDownload, button.sleekfin-details-episode-download, button[data-sleekfin-details-action="download"], button[data-id="download"], button[title="Download" i], button[aria-label="Download" i]');
        if (dlBtn && !dlBtn.closest(".fx-download-menu") && ((_j = (_i = window.ApiClient) == null ? void 0 : _i.getCurrentUserId) == null ? void 0 : _j.call(_i))) {
          const rawSelfId = dlBtn.getAttribute("data-item-id") || ((_k = dlBtn.dataset) == null ? void 0 : _k.itemId) || dlBtn.getAttribute("data-id") || ((_l = dlBtn.dataset) == null ? void 0 : _l.id);
          const parentIdNode = (_n = (_m = dlBtn.parentElement) == null ? void 0 : _m.closest) == null ? void 0 : _n.call(_m, "[data-item-id],[data-itemid],[data-id]");
          const parentId = (parentIdNode == null ? void 0 : parentIdNode.getAttribute("data-item-id")) || (parentIdNode == null ? void 0 : parentIdNode.getAttribute("data-itemid")) || (parentIdNode == null ? void 0 : parentIdNode.getAttribute("data-id"));
          const hashId = new URLSearchParams(location.hash.split("?")[1] || "").get("id");
          const itemId = (rawSelfId && rawSelfId.toLowerCase() !== "download" ? rawSelfId : "") || parentId || hashId;
          if (itemId) {
            event.preventDefault();
            (_o = event.stopImmediatePropagation) == null ? void 0 : _o.call(event);
            event.stopPropagation();
            openDownloadMenu(dlBtn, itemId, window.ApiClient);
            return;
          }
        }
        if (downloadMenu && !((_q = (_p = event.target).closest) == null ? void 0 : _q.call(_p, ".fx-download-menu"))) {
          closeDownloadMenu();
        }
        if ((_s = (_r = event.target).closest) == null ? void 0 : _s.call(_r, "#library-view-menu .MuiMenuItem-root")) {
          scrollToTop();
          setTimeout(scrollToTop, 40);
        }
        const searchTrigger = (_u = (_t = event.target).closest) == null ? void 0 : _u.call(_t, '[data-sleekfin-header-proxy] button[data-sleekfin-header-proxy-item="jellyfin:search"], [data-sleekfin-header-overflow-drawer] [data-sleekfin-header-overflow-item="jellyfin:search"], .skinHeader .headerSearchButton');
        if (searchTrigger && ((_w = (_v = window.ApiClient) == null ? void 0 : _v.getCurrentUserId) == null ? void 0 : _w.call(_v))) {
          event.preventDefault();
          (_x = event.stopImmediatePropagation) == null ? void 0 : _x.call(event);
          event.stopPropagation();
          closeDrawers();
          scrollToTop();
          if (!/^#!?\/?search(?:\.html)?(?:[?]|$)/i.test(location.hash)) {
            location.hash = "#/search";
          }
          schedule();
          setTimeout(() => {
            var _a3;
            scrollToTop();
            const inp = document.querySelector('#searchPage #searchTextInput, #searchPage input.searchfields-txtSearch, #searchPage input[type="search"], #searchPage input[type="text"]');
            (_a3 = inp == null ? void 0 : inp.focus) == null ? void 0 : _a3.call(inp);
          }, 80);
          return;
        }
        const target = (_z = (_y = event.target).closest) == null ? void 0 : _z.call(_y, "[data-sleekfin-header-proxy-item],[data-sleekfin-header-overflow-item],a[href]");
        if (!target) return;
        const proxy = target.getAttribute("data-sleekfin-header-proxy-item") || target.getAttribute("data-sleekfin-header-overflow-item") || "";
        if (proxy === "fx:settings") return;
        let route = null;
        if (proxy === "jellyfin:movies") route = "#/movies";
        else if (proxy === "jellyfin:shows") route = "#/tv";
        else if (proxy === "jellyfin:home") route = "#/home";
        else if (proxy.startsWith("jellyfin:view:")) {
          const viewId = proxy.slice("jellyfin:view:".length);
          const sourceLink = document.querySelector(`a[data-itemid="${viewId}"],a[data-id="${viewId}"],a[href*="topParentId=${viewId}"],a[href*="parentId=${viewId}"]`);
          if (sourceLink == null ? void 0 : sourceLink.getAttribute("href")) {
            route = sourceLink.getAttribute("href");
          } else {
            const label = (target.textContent || "").trim().toLowerCase();
            if (label === "movies") route = `#/movies.html?topParentId=${encodeURIComponent(viewId)}`;
            else if (label === "shows" || label === "tv shows") route = `#/tv.html?topParentId=${encodeURIComponent(viewId)}`;
            else if (label === "collections") route = `#/list.html?topParentId=${encodeURIComponent(viewId)}&collectionType=boxsets`;
          }
        } else {
          route = target.getAttribute("href");
        }
        if (!proxy && !target.closest("header,.headerTabs,[data-sleekfin-header-proxy],[data-sleekfin-header-overflow-drawer]")) return;
        if (!route) return;
        const normalized = route.startsWith("#") ? route : "#" + route.replace(/^\/+/, "/");
        if (/^#!?\/?(movies|tv|tvshows)(?:\.html)?(?:[?]|$)/i.test(normalized)) {
          const [path, raw = ""] = normalized.split("?"), q = new URLSearchParams(raw);
          q.set("tab", "1");
          event.preventDefault();
          (_A = event.stopImmediatePropagation) == null ? void 0 : _A.call(event);
          event.stopPropagation();
          closeDrawers();
          scrollToTop();
          location.hash = path + "?" + q;
          schedule();
          setTimeout(closeDrawers, 40);
          return;
        }
        if (proxy.startsWith("jellyfin:view:") || proxy === "jellyfin:home") {
          event.preventDefault();
          (_B = event.stopImmediatePropagation) == null ? void 0 : _B.call(event);
          event.stopPropagation();
          closeDrawers();
          scrollToTop();
          location.hash = normalized;
          schedule();
          setTimeout(closeDrawers, 40);
        }
      }
      function rememberFocus(event) {
        var _a2, _b2;
        const s = state, card = (_b2 = (_a2 = event.target).closest) == null ? void 0 : _b2.call(_a2, ".fx-card");
        if (s && card && s.root.contains(card)) s.lastFocus = { row: s.slots.findIndex((slot) => slot.node.contains(card)), id: card.dataset.itemId };
      }
      function remoteKey(event) {
        var _a2, _b2, _c2, _d2, _e2, _f;
        const s = state;
        const key = { 37: "ArrowLeft", 38: "ArrowUp", 39: "ArrowRight", 40: "ArrowDown", 13: "Enter", 27: "Escape", 10009: "Escape", 461: "Escape", 457: "ContextMenu" }[event.keyCode] || event.key;
        const target = event.target || document.activeElement;
        if (downloadMenu && (key === "Escape" || event.keyCode === 10009)) {
          event.preventDefault();
          event.stopPropagation();
          closeDownloadMenu();
          return;
        }
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
          if (key === "ArrowLeft" || key === "ArrowRight") {
            const delta = key === "ArrowLeft" ? -1 : 1;
            next = ((_f = track == null ? void 0 : track.dataset) == null ? void 0 : _f.noLoop) === "true" ? cards[Math.max(0, Math.min(cards.length - 1, index + delta))] : cards[(index + delta + cards.length) % cards.length];
          } else {
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
      const osdGesture = {
        holdTimer: 0,
        pillTimer: 0,
        streakTimer: 0,
        suppressClickUntil: 0,
        touching: false,
        moved: false,
        holdActive: false,
        savedRate: 1,
        activeVideo: null,
        startX: 0,
        startY: 0,
        startAt: 0,
        lastTap: null,
        streakZone: "",
        streakSec: 0
      };
      function findActiveOsdVideo() {
        const osd = document.getElementById("videoOsdPage");
        if (!osd || osd.classList.contains("hide") || osd.classList.contains("hidePage") || osd.hidden) return null;
        return document.querySelector("video.htmlvideoplayer") || osd.querySelector("video") || document.querySelector(".videoPlayerContainer video");
      }
      function showOsdGesturePill(label, position = "center", persistent = false) {
        let pill = document.querySelector(".fx-osd-gesture-pill");
        if (!pill) {
          pill = element("div", "fx-osd-gesture-pill");
          pill.setAttribute("aria-live", "polite");
          document.body.append(pill);
        }
        clearTimeout(osdGesture.pillTimer);
        pill.textContent = label;
        pill.dataset.pos = position;
        pill.classList.add("is-visible");
        if (!persistent) {
          osdGesture.pillTimer = setTimeout(() => {
            pill.classList.remove("is-visible");
          }, 720);
        }
      }
      function hideOsdGesturePill() {
        clearTimeout(osdGesture.pillTimer);
        const pill = document.querySelector(".fx-osd-gesture-pill");
        pill == null ? void 0 : pill.classList.remove("is-visible");
      }
      function releaseOsdSpeedHold() {
        clearTimeout(osdGesture.holdTimer);
        osdGesture.holdTimer = 0;
        if (osdGesture.holdActive) {
          if (osdGesture.activeVideo) {
            try {
              osdGesture.activeVideo.playbackRate = osdGesture.savedRate || 1;
            } catch {
            }
          }
          osdGesture.holdActive = false;
          osdGesture.activeVideo = null;
          hideOsdGesturePill();
        }
      }
      function isOsdInteractiveTarget(target) {
        var _a2;
        return Boolean((_a2 = target == null ? void 0 : target.closest) == null ? void 0 : _a2.call(target, 'button, a, input, select, textarea, [role="slider"], .mdl-slider, .mdl-slider-container, .paper-icon-button-light, .upNextContainer, .dialog, .actionSheet, .fx-download-menu'));
      }
      function onOsdTouchStart(event) {
        var _a2;
        if (!event.touches || event.touches.length !== 1) {
          releaseOsdSpeedHold();
          osdGesture.touching = false;
          return;
        }
        const video = findActiveOsdVideo();
        if (!video || isOsdInteractiveTarget(event.target)) return;
        const t = event.touches[0];
        const vw = window.innerWidth || ((_a2 = document.documentElement) == null ? void 0 : _a2.clientWidth) || 0;
        if (!vw) return;
        osdGesture.touching = true;
        osdGesture.moved = false;
        osdGesture.startX = t.clientX;
        osdGesture.startY = t.clientY;
        osdGesture.startAt = Date.now();
        clearTimeout(osdGesture.holdTimer);
        if (t.clientX >= vw * 0.72) {
          osdGesture.holdTimer = setTimeout(() => {
            if (!osdGesture.touching || osdGesture.moved || osdGesture.holdActive) return;
            const v = findActiveOsdVideo();
            if (!v || v.paused) return;
            osdGesture.holdActive = true;
            osdGesture.activeVideo = v;
            osdGesture.savedRate = Number.isFinite(v.playbackRate) && v.playbackRate > 0 ? v.playbackRate : 1;
            try {
              v.playbackRate = 2;
            } catch {
            }
            showOsdGesturePill("2\xD7 Speed \u25B8\u25B8", "top", true);
          }, 320);
        }
      }
      function onOsdTouchMove(event) {
        var _a2;
        if (!osdGesture.touching || !((_a2 = event.touches) == null ? void 0 : _a2.length)) return;
        const t = event.touches[0];
        if (Math.hypot(t.clientX - osdGesture.startX, t.clientY - osdGesture.startY) > 16) {
          osdGesture.moved = true;
          if (!osdGesture.holdActive) {
            clearTimeout(osdGesture.holdTimer);
            osdGesture.holdTimer = 0;
          }
        }
      }
      function onOsdTouchEnd(event) {
        var _a2, _b2, _c2, _d2;
        clearTimeout(osdGesture.holdTimer);
        osdGesture.holdTimer = 0;
        if (!osdGesture.touching) return;
        osdGesture.touching = false;
        if (osdGesture.holdActive) {
          releaseOsdSpeedHold();
          osdGesture.suppressClickUntil = Date.now() + 380;
          if (event.cancelable) event.preventDefault();
          (_a2 = event.stopImmediatePropagation) == null ? void 0 : _a2.call(event);
          event.stopPropagation();
          return;
        }
        if (event.type === "touchcancel" || osdGesture.moved || isOsdInteractiveTarget(event.target)) return;
        const video = findActiveOsdVideo();
        if (!video) return;
        const now = Date.now();
        if (now - osdGesture.startAt > 300) return;
        const t = (_b2 = event.changedTouches) == null ? void 0 : _b2[0];
        const x = t ? t.clientX : osdGesture.startX;
        const y = t ? t.clientY : osdGesture.startY;
        const vw = window.innerWidth || ((_c2 = document.documentElement) == null ? void 0 : _c2.clientWidth) || 0;
        if (!vw) return;
        const zone = x >= vw * 0.6 ? "right" : x <= vw * 0.4 ? "left" : "";
        if (!zone) {
          osdGesture.lastTap = null;
          return;
        }
        const streakContinue = osdGesture.streakZone === zone && osdGesture.lastTap && now - osdGesture.lastTap.time <= 650;
        const isDoubleTap = streakContinue || osdGesture.lastTap && osdGesture.lastTap.zone === zone && now - osdGesture.lastTap.time <= 340 && Math.hypot(x - osdGesture.lastTap.x, y - osdGesture.lastTap.y) <= 68;
        osdGesture.lastTap = { zone, x, y, time: now };
        if (!isDoubleTap) return;
        const delta = zone === "right" ? 10 : -10;
        osdGesture.streakZone = zone;
        osdGesture.streakSec = streakContinue ? osdGesture.streakSec + delta : delta;
        clearTimeout(osdGesture.streakTimer);
        osdGesture.streakTimer = setTimeout(() => {
          osdGesture.streakZone = "";
          osdGesture.streakSec = 0;
        }, 680);
        const dur = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : Infinity;
        const nextTime = Math.max(0, Math.min(dur, (Number(video.currentTime) || 0) + delta));
        try {
          video.currentTime = nextTime;
        } catch {
        }
        const absSec = Math.abs(osdGesture.streakSec);
        showOsdGesturePill(zone === "right" ? `+${absSec}s \u25B8\u25B8` : `\u25C2\u25C2 -${absSec}s`, zone, false);
        osdGesture.suppressClickUntil = now + 380;
        if (event.cancelable) event.preventDefault();
        (_d2 = event.stopImmediatePropagation) == null ? void 0 : _d2.call(event);
        event.stopPropagation();
      }
      function onOsdSuppressClick(event) {
        var _a2;
        if (Date.now() <= osdGesture.suppressClickUntil && findActiveOsdVideo() && !isOsdInteractiveTarget(event.target)) {
          event.preventDefault();
          (_a2 = event.stopImmediatePropagation) == null ? void 0 : _a2.call(event);
          event.stopPropagation();
        }
      }
      function onRouteEvent() {
        releaseOsdSpeedHold();
        syncLibraryViewMenu();
        syncMobileOverflowDrawer(window.ApiClient);
        schedule();
      }
      function start() {
        const style = element("style");
        style.id = "fx-discovery-style";
        style.textContent = DISCOVERY_CSS2;
        document.head.append(style);
        if (window.ApiClient) patchApiClientLeavingSoon(window.ApiClient);
        patchLibraryViews();
        syncLibraryViewMenu();
        syncMobileOverflowDrawer(window.ApiClient);
        syncHomeModeAttr(window.ApiClient);
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
            return r.type === "childList" && ((_b2 = (_a2 = r.target) == null ? void 0 : _a2.closest) == null ? void 0 : _b2.call(_a2, "[data-sleekfin-header-proxy],[data-sleekfin-header-overflow-drawer],header,.skinHeader,.MuiDrawer-root,#user-view-overflow-menu"));
          })) {
            hideLeavingSoonNav();
            syncMobileOverflowDrawer(window.ApiClient);
          }
          if (records.some((r) => {
            var _a2, _b2;
            return !((_b2 = (_a2 = r.target).closest) == null ? void 0 : _b2.call(_a2, ".fx-discovery,.fx-dialog,.fx-inline-studio,.fx-download-menu,.fx-osd-gesture-pill,.fx-toast,.rh-root,[data-sleekfin-header-proxy],[data-sleekfin-header-overflow-drawer],.skinHeader")) && (r.type === "childList" || r.attributeName === "class");
          })) schedule();
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
        document.addEventListener("click", onOsdSuppressClick, true);
        document.addEventListener("click", navSuggestions, true);
        window.addEventListener("hashchange", onRouteEvent);
        window.addEventListener("popstate", onRouteEvent);
        document.addEventListener("viewshow", onRouteEvent);
        document.addEventListener("touchstart", onOsdTouchStart, { passive: true, capture: true });
        document.addEventListener("touchmove", onOsdTouchMove, { passive: true, capture: true });
        document.addEventListener("touchend", onOsdTouchEnd, { passive: false, capture: true });
        document.addEventListener("touchcancel", onOsdTouchEnd, { passive: true, capture: true });
        window.addEventListener("blur", releaseOsdSpeedHold);
        window.addEventListener("sleekfin:header-catalog-changed", hideLeavingSoonNav);
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
          var _a2, _b2, _c2, _d2, _e2, _f, _g;
          stopped = true;
          clearTimeout(timer);
          clearInterval(heartbeat);
          observer == null ? void 0 : observer.disconnect();
          releaseOsdSpeedHold();
          clearTimeout(osdGesture.streakTimer);
          cleanup(false);
          closeDownloadMenu();
          snapshots.clear();
          savedFeeds.clear();
          (_b2 = (_a2 = document.documentElement) == null ? void 0 : _a2.removeAttribute) == null ? void 0 : _b2.call(_a2, "data-fx-hide-count-chip");
          (_d2 = (_c2 = document.documentElement) == null ? void 0 : _c2.removeAttribute) == null ? void 0 : _d2.call(_c2, "data-fx-curated-tab");
          (_f = (_e2 = document.documentElement) == null ? void 0 : _e2.removeAttribute) == null ? void 0 : _f.call(_e2, "data-fx-home-mode");
          document.removeEventListener("click", onOsdSuppressClick, true);
          document.removeEventListener("click", navSuggestions, true);
          window.removeEventListener("hashchange", onRouteEvent);
          window.removeEventListener("popstate", onRouteEvent);
          document.removeEventListener("viewshow", onRouteEvent);
          document.removeEventListener("scroll", scheduleScroll, true);
          window.removeEventListener("resize", scheduleScroll);
          document.removeEventListener("touchstart", onOsdTouchStart, true);
          document.removeEventListener("touchmove", onOsdTouchMove, true);
          document.removeEventListener("touchend", onOsdTouchEnd, true);
          document.removeEventListener("touchcancel", onOsdTouchEnd, true);
          window.removeEventListener("blur", releaseOsdSpeedHold);
          window.removeEventListener("sleekfin:header-catalog-changed", hideLeavingSoonNav);
          document.removeEventListener("keydown", remoteKey, true);
          document.removeEventListener("keyup", remoteKeyUp, true);
          document.removeEventListener("focusin", rememberFocus);
          document.querySelectorAll("[data-fx-settings-link],[data-fx-home-studio],[data-fx-overflow-settings],.fx-osd-gesture-pill,.fx-toast").forEach((n) => n.remove());
          (_g = document.getElementById("fx-discovery-style")) == null ? void 0 : _g.remove();
          delete window.FazFortDiscovery;
        }
      };
      if (document.body) start();
      else document.addEventListener("DOMContentLoaded", start, { once: true });
    }
    bootDiscovery(DEFAULT_CONFIG, DISCOVERY_CSS);
  })();
})();
