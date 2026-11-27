import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { badgeFor, buildShelves, FeedPlanner, isOscarsHash, matchOscarNominee, matches, monthAgo, normalizeOscarTitle, OPENING_MIN_ITEMS, OPENING_RICH_ROW_COUNT, recent, resolveHeroConfig, resolveRatingsConfig, routeInfo, searchAndRankInventory, seasonBadges, selectHeroItems, validateConfig } from '../src/engine.js';
const config = JSON.parse(await readFile(new URL('../config/default.json', import.meta.url)));
const now = new Date('2026-11-04T12:00:00Z');
const items = Array.from({length: 48}, (_, n) => ({ Id: n.toString(16).padStart(32,'0'), Name: 'Item '+n, Type: n % 3 ? 'Movie' : 'Series', Genres: ['Action', 'Comedy'], Tags: ['space', 'superhero'], CommunityRating: n % 2 ? 8 : 6, RunTimeTicks: 90*600000000, ProductionYear: 2000 + n % 20, People: [{ Name: 'Director '+(n % 4), Type: 'Director' }, { Name: 'Actor '+(n % 3), Type: 'Actor' }], Studios:[{Name:'Studio'}], UserData:{ Played: n % 5 === 0 } }));
test('shipped config validates and profiles differ', () => {
  assert.equal(validateConfig(config), config);
  assert.notDeepEqual(config.pages.movies.rules, config.pages.shows.rules);
});
test('invalid, duplicate, null and malformed filters rejected', () => {
  for (const patch of [{ Types:['Episode'] }, { Months:[13] }, { MinRating:NaN }, { TagsAny:[null] }, { Years:[2020,2000] }, { MaxMinutes:0 }]) {
    const c=structuredClone(config); Object.assign(c.pages.home.rules[0],patch); assert.throws(()=>validateConfig(c));
  }
  const c=structuredClone(config);c.pages.home.rules.push(c.pages.home.rules[0]);assert.throws(()=>validateConfig(c));
});
test('seven-day recent badge boundary and monthAgo helper', () => {
  assert.equal(monthAgo(new Date('2026-03-31T12:00:00Z')).toISOString(), '2026-02-28T12:00:00.000Z');
  assert.ok(recent('2026-10-28T12:00:00Z',now));
  assert.ok(!recent('2026-10-28T11:59:59Z',now));
  assert.ok(!recent('2026-10-15T12:00:00Z',now));
  assert.ok(!recent('2026-11-05',now));
  assert.ok(!recent(undefined,now));
});
test('new episodes uses 30-day premiere window and takes priority over 7-day Recently Added on TV shows', () => {
  const seasons=[{Id:'s',Type:'Season',SeriesId:'good',IndexNumber:2,PremiereDate:'2026-10-20'},
    {Type:'Episode',SeriesId:'episode',IndexNumber:2,PremiereDate:'2026-10-30'},
    {Type:'Season',SeriesId:'old',IndexNumber:2,PremiereDate:'2026-09-15'}];
  const map=seasonBadges(seasons,now);assert.deepEqual([...map.keys()],['good']);
  assert.equal(badgeFor({Id:'good',Type:'Series',DateCreated:'2026-11-01'},map,now),'New Episodes');
  assert.equal(badgeFor({Id:'otherShow',Type:'Series',DateCreated:'2026-11-01'},map,now),'Recently Added');
  assert.equal(badgeFor({Id:'olderShow',Type:'Series',DateCreated:'2026-10-15'},map,now),'');
  assert.equal(badgeFor({Id:'other',Type:'Movie',DateCreated:'2026-10-30'},map,now),'Recently Added');
  assert.equal(badgeFor({Id:'older',Type:'Movie',DateCreated:'2026-10-15'},map,now),'');
});
test('rules match OR within filters, AND across filters and exclude absent rating/runtime', () => {
  const rule={Types:['Movie'],TagsAny:['SPACE','time travel'],GenresAny:['Action'],MinRating:8,MaxMinutes:120};
  assert.ok(matches(rule,items[1]));
  assert.ok(!matches(rule,{...items[1],Tags:[]}));
  assert.ok(!matches(rule,{...items[1],RunTimeTicks:null}));
  assert.ok(!matches(rule,{...items[1],CommunityRating:null}));
  assert.ok(!matches(rule,{...items[1],RunTimeTicks:120*600000000}));
});
test('movie/show scopes do not leak other types', () => {
  for (const page of ['movies','shows']) {
    const shelves=buildShelves(items,config.pages[page],config,page,now);
    assert.ok(shelves.length);
    assert.ok(shelves.every(s=>s.items.every(i=>i.Type===(page==='movies'?'Movie':'Series'))));
  }
});
test('seasonal tags are not shown outside configured months and Christmas runs in November and December at top of theme pool', () => {
  const list=items.map(i=>({...i,Type:'Movie',Tags:['christmas','halloween']}));
  const keys=date=>buildShelves(list,config.pages.home,config,'home',new Date(date)).map(s=>s.key);
  assert.ok(!keys('2026-09-15T12:00:00Z').includes('rule:christmas'));
  assert.ok(keys('2026-10-15T12:00:00Z').includes('rule:halloween'));
  assert.ok(!keys('2026-10-15T12:00:00Z').includes('rule:christmas'));
  assert.ok(!keys('2026-11-15T12:00:00Z').includes('rule:halloween'));
  assert.ok(keys('2026-11-15T12:00:00Z').includes('rule:christmas'));
  assert.ok(keys('2026-12-15T12:00:00Z').includes('rule:christmas'));
  const novShelves=buildShelves(list,config.pages.movies,config,'movies',new Date('2026-11-17T12:00:00Z'));
  const novPlanner=new FeedPlanner(novShelves,config,'nov-seed');
  const firstTheme=novPlanner.next('theme');
  assert.equal(firstTheme.key,'rule:christmas');
  assert.ok(firstTheme.allItems.length > firstTheme.items.length);
  assert.deepEqual(routeInfo('#/movies?fxCat=rule%3Achristmas'),{page:'movies',view:'suggestions',cat:'rule:christmas',parentId:'',serverId:''});
});
test('IMDb shelf requires explicit membership, not high score', () => {
  assert.ok(!buildShelves(items,config.pages.movies,config,'movies',now).some(s=>s.key==='rule:imdb-top-250'));
});
test('director and actor shelves keep correct credits', () => {
  const shelves=buildShelves(items,config.pages.home,config,'home',now);
  assert.ok(shelves.some(s=>s.title==='Directed by Director 1'));
  assert.ok(shelves.filter(s=>s.family==='director').every(s=>s.items.every(i=>i.People.some(p=>p.Type==='Director'&&'Directed by '+p.Name===s.title))));
});
test('continuous feed produces 200 varied shelves without adjacent same families', () => {
  const shelves=buildShelves(items,config.pages.home,config,'home',now);
  const planner=new FeedPlanner(shelves,config,'test');
  const rows=Array.from({length:200},()=>planner.next());
  assert.ok(rows.every(Boolean));
  for(let n=1;n<rows.length;n++) {assert.notEqual(rows[n].family,rows[n-1].family);assert.notEqual(rows[n].key,rows[n-1].key);}
  assert.ok(rows.every(r=>new Set(r.items.map(i=>i.Id)).size===r.items.length));
});
test('preferred theme alternates with fixed anchors', () => {
  const shelves=buildShelves(items,config.pages.home,config,'home',now);
  const planner=new FeedPlanner(shelves,config,'test');
  assert.equal(planner.next('theme').family,'theme');
});
test('finite option stops and one-shelf libraries do not deadlock', () => {
  const shelves=buildShelves(items,config.pages.home,config,'home',now);
  const finite=new FeedPlanner(shelves,{...config,endless:false},'test');
  const rows=[];let r;while((r=finite.next()))rows.push(r);
  assert.equal(rows.length,shelves.length);
  const one=new FeedPlanner([shelves[0]],config,'test');assert.ok(one.next());assert.ok(one.next());
  assert.equal(new FeedPlanner([],config,'test').next(),null);
});
test('same seed has stable ordering and another seed varies it', () => {
  const shelves=buildShelves(items,config.pages.home,config,'home',now);
  const plan=seed=>{const p=new FeedPlanner(shelves,config,seed);return Array.from({length:20},()=>p.next().key);};
  assert.deepEqual(plan('a'),plan('a'));assert.notDeepEqual(plan('a'),plan('b'));
});
test('route detection preserves library scope and avoids favorites/details', () => {
  assert.deepEqual(routeInfo('#/movies?topParentId=abc&collectionType=movies'),{page:'movies',view:'suggestions',parentId:'abc',serverId:''});
  assert.equal(routeInfo('#/tv?topParentId=xyz').page,'shows');
  assert.equal(routeInfo('#/home?tab=1'),null);
  assert.equal(routeInfo('#/details?id=a'),null);
  assert.equal(routeInfo('#/dashboard'),null);
});
test('opening rows and artwork validate and missing category references fail',()=>{
  const c=JSON.parse(JSON.stringify(config));
  c.pages.home.opening=['anchor:MyMedia','rule:popcorn','family:director'];
  c.pages.home.layouts={'anchor:DiscoverMovies':'portrait'};
  assert.doesNotThrow(()=>validateConfig(c));
  c.pages.home.opening=['rule:missing'];assert.throws(()=>validateConfig(c),/opening/);
  c.pages.home.opening=['family:director'];c.pages.home.layouts={'anchor:DiscoverMovies':'stretch'};assert.throws(()=>validateConfig(c),/layout/);
});
test('Suggestions default, explicit Library/Genres and Request Hub routes remain separate',()=>{
  assert.equal(routeInfo('#/movies').view,'suggestions');assert.equal(routeInfo('#/tv?tab=1').view,'suggestions');
  assert.equal(routeInfo('#/movies?tab=0').view,'library');assert.equal(routeInfo('#/movies?tab=4').view,'genres');assert.equal(routeInfo('#/tv?tab=3').view,'genres');
  assert.equal(routeInfo('#/movies?tab=2'),null);assert.equal(routeInfo('#/home?requesthub=discover'),null);
});
test('searchAndRankInventory ranks title matches first, then closest tag alignment, excludes episodes, and stays uncapped',()=>{
  const pool=[
    {Id:'ep1',Name:'Christmas Episode',Type:'Episode',Tags:['christmas']},
    {Id:'m-diehard',Name:'Die Hard',Type:'Movie',Tags:['christmas party','hostage'],CommunityRating:8.2},
    {Id:'m-wonderful',Name:"It's a Wonderful Life",Type:'Movie',Tags:['christmas','christmas eve','saving christmas'],CommunityRating:8.6},
    {Id:'m-nightmare',Name:'The Nightmare Before Christmas',Type:'Movie',Tags:['halloween','christmas','santa claus'],CommunityRating:7.9},
    {Id:'m-leaving',Name:'Christmas Leaving Soon',Type:'Movie',Path:'/media/leaving-soon/movies/x.mkv',Tags:['christmas']},
    ...Array.from({length:60},(_,i)=>({Id:`tag-${i}`,Name:`Winter Film ${String(i).padStart(2,'0')}`,Type:'Movie',Tags:['christmas tree']}))
  ];
  const ranked=searchAndRankInventory(pool,'Christmas',config);
  assert.equal(ranked.length,63);
  assert.equal(ranked.some(i=>i.Type==='Episode'),false);
  assert.equal(ranked.some(i=>i.Id==='m-leaving'),false);
  assert.equal(ranked[0].Id,'m-nightmare');
  assert.equal(ranked[1].Id,'m-wonderful');
  assert.equal(ranked[2].Id,'m-diehard');
});
test('ratings preference validates allowed combinations and rejects malformed values', () => {
  assert.deepEqual(resolveRatingsConfig({}), { tomatometer: true, popcornmeter: true, stars: false });
  const c = structuredClone(config);
  c.ratings = { tomatometer: false, popcornmeter: true, stars: true };
  assert.doesNotThrow(() => validateConfig(c));
  assert.deepEqual(resolveRatingsConfig(c), { tomatometer: false, popcornmeter: true, stars: true });
  c.ratings = { tomatometer: 'yes' };
  assert.throws(() => validateConfig(c), /ratings/);
  c.ratings = { unknown: true };
  assert.throws(() => validateConfig(c), /ratings/);
});
test('hero banner controls validate config and filter by RT %, excludeWatched, genres, years, and pinned titles', () => {
  assert.equal(resolveHeroConfig({}).mode, 'auto');
  const c = structuredClone(config);
  c.pages.movies.hero = { mode: 'pinned-first', maxSlides: 6, excludeWatched: true, minCriticScore: 90, genresAny: ['Drama'], years: [1990, 2025], pinnedIds: ['m1'] };
  assert.doesNotThrow(() => validateConfig(c));
  const bad = structuredClone(config);
  bad.pages.home.hero = { minCriticScore: 150 };
  assert.throws(() => validateConfig(bad), /minCriticScore/);
  const pool = [
    { Id: 'm1', Name: 'Only Yesterday', Type: 'Movie', ProductionYear: 1991, Genres: ['Drama'], CriticRating: 100, CommunityRating: 7.4, BackdropImageTags: ['b'], UserData: { Played: false } },
    { Id: 'm2', Name: 'Watched Masterpiece', Type: 'Movie', ProductionYear: 2020, Genres: ['Drama'], CriticRating: 98, CommunityRating: 8.5, BackdropImageTags: ['b'], UserData: { Played: true } },
    { Id: 'm3', Name: 'Low RT Flick', Type: 'Movie', ProductionYear: 2022, Genres: ['Drama'], CriticRating: 65, CommunityRating: 7.0, BackdropImageTags: ['b'], UserData: { Played: false } },
    { Id: 'm4', Name: 'High RT Drama', Type: 'Movie', ProductionYear: 2019, Genres: ['Drama'], CriticRating: 94, CommunityRating: 8.2, BackdropImageTags: ['b'], UserData: { Played: false } },
    { Id: 'm5', Name: 'High RT Comedy', Type: 'Movie', ProductionYear: 2019, Genres: ['Comedy'], CriticRating: 96, CommunityRating: 8.0, BackdropImageTags: ['b'], UserData: { Played: false } }
  ];
  const filtered = selectHeroItems(pool, { mode: 'auto', minCriticScore: 90, excludeWatched: true, genresAny: ['Drama'] }, 'movies', 'seed');
  assert.deepEqual(filtered.map(i => i.Id).sort(), ['m1', 'm4']);
  const pinnedOnly = selectHeroItems(pool, { mode: 'pinned-only', pinnedIds: ['m3', 'm1'], excludeWatched: true }, 'movies', 'seed');
  assert.deepEqual(pinnedOnly.map(i => i.Id), ['m3', 'm1']);
  const pinnedFirst = selectHeroItems(pool, { mode: 'pinned-first', pinnedIds: ['m5'], minCriticScore: 90, excludeWatched: true, genresAny: ['Drama'] }, 'movies', 'seed');
  assert.equal(pinnedFirst[0].Id, 'm5');
  assert.equal(pinnedFirst.some(i => i.Id === 'm2'), false);
});
test('v0.6.7 family:any opening token validates and default.json ships expanded Movie and TV Show categories with random opening trio', () => {
  const c = structuredClone(config);
  for (const page of ['home', 'movies', 'shows']) {
    assert.deepEqual(c.pages[page].opening, ['family:any', 'family:any', 'family:any', 'anchor:ContinueWatchingNextUp']);
  }
  assert.ok(c.pages.movies.rules.length >= 90, 'Movies ships 90+ curated categories');
  assert.ok(c.pages.shows.rules.length >= 65, 'Shows ships 65+ curated categories');
  assert.ok(c.pages.home.rules.length >= 125, 'Home ships 125+ curated categories');
  c.pages.home.layouts = { 'family:any': 'portrait' };
  assert.doesNotThrow(() => validateConfig(c));
});
test('v0.7.0 Oscars route detection and nominee-to-library matching (TMDb ID, title+year, ±1 year, OriginalTitle)', () => {
  assert.equal(isOscarsHash('#/home?fxOscars=1'), true);
  assert.equal(isOscarsHash('#!/home.html?fxOscars=true'), true);
  assert.equal(isOscarsHash('#/home'), false);
  assert.equal(isOscarsHash('#/movies?fxOscars=1'), false);
  assert.equal(routeInfo('#/home?fxOscars=1'), null, 'Discovery Home skips mounting when fxOscars=1 is active');
  assert.equal(normalizeOscarTitle('F1: The Movie!'), 'f1 the movie');
  assert.equal(normalizeOscarTitle('Sentimental Value — Director’s Cut'), 'sentimental value directors cut');

  const movies = [
    { Id: 'm-sinners', Name: 'Sinners', Type: 'Movie', ProductionYear: 2025, ProviderIds: { Tmdb: '1233413' } },
    { Id: 'm-secret', Name: 'The Secret Agent', OriginalTitle: 'O Agente Secreto', Type: 'Movie', ProductionYear: 2025, ProviderIds: {} },
    { Id: 'm-marty', Name: 'Marty Supreme', Type: 'Movie', ProductionYear: 2026, ProviderIds: {} },
    { Id: 'm-old-frank', Name: 'Frankenstein', Type: 'Movie', ProductionYear: 1931, ProviderIds: { Tmdb: '3035' } }
  ];
  assert.equal(matchOscarNominee({ title: 'Different Localized Title', year: 2025, tmdbId: 1233413 }, movies)?.Id, 'm-sinners');
  assert.equal(matchOscarNominee({ title: 'O Agente Secreto', year: 2025 }, movies)?.Id, 'm-secret');
  assert.equal(matchOscarNominee({ title: 'Marty Supreme', year: 2025 }, movies)?.Id, 'm-marty', 'allows ±1 year festival release offset');
  assert.equal(matchOscarNominee({ title: 'Frankenstein', year: 2025 }, movies), null, 'does not mismatch 1931 remake against 2025 nominee');
});
test('v0.7.7 FeedPlanner restricts opening rows to 10+ item categories with progressive small-library fallback', () => {
  const mkItems = (prefix, count) => Array.from({ length: count }, (_, i) => ({ Id: `${prefix}-${i}`, Name: `${prefix} ${i}`, Type: 'Movie' }));
  const mixedShelves = [
    { key: 'rule:tiny-a', title: 'Tiny A', family: 'theme', items: mkItems('ta', 3) },
    { key: 'rule:tiny-b', title: 'Tiny B', family: 'director', items: mkItems('tb', 4) },
    { key: 'actor:small', title: 'Small Actor', family: 'actor', items: mkItems('sa', 5) },
    { key: 'studio:small', title: 'Small Studio', family: 'studio', items: mkItems('ss', 6) },
    { key: 'rule:big-theme', title: 'Big Theme', family: 'theme', items: mkItems('bt', 12) },
    { key: 'genre:action', title: 'Action Movies', family: 'genre', items: mkItems('ga', 15) },
    { key: 'decade:2010', title: '2010s', family: 'decade', items: mkItems('d1', 11) },
    { key: 'studio:big', title: 'Big Studio', family: 'studio', items: mkItems('bs', 10) },
    { key: 'genre:explore', title: 'Explore More Movies', family: 'genre', items: mkItems('ex', 40) }
  ];
  for (let s = 0; s < 12; s++) {
    const planner = new FeedPlanner(mixedShelves, config, `rich-seed-${s}`);
    const opening = Array.from({ length: OPENING_RICH_ROW_COUNT }, () => planner.next(null, null, OPENING_MIN_ITEMS));
    assert.equal(opening.length, OPENING_RICH_ROW_COUNT);
    for (const row of opening) {
      assert.ok(row.allItems.length >= OPENING_MIN_ITEMS, `Opening row ${row.key} has >= ${OPENING_MIN_ITEMS} items (got ${row.allItems.length})`);
      assert.notEqual(row.key, 'genre:explore', 'Skips generic Explore More when real 10+ categories exist');
    }
    assert.equal(new Set(opening.map(r => r.key)).size, OPENING_RICH_ROW_COUNT, 'Opening rows are all distinct');
  }
  // Explicit pinned rule via take() still works even if under 10 items
  const pinPlanner = new FeedPlanner(mixedShelves, config, 'pin-seed');
  assert.equal(pinPlanner.take('rule:tiny-a')?.key, 'rule:tiny-a');

  // Smaller libraries with zero 10+ categories fall back gracefully to the fullest available categories
  const smallShelves = [
    { key: 'rule:s1', title: 'Three', family: 'theme', items: mkItems('s1', 3) },
    { key: 'director:s2', title: 'Three Dir', family: 'director', items: mkItems('s2', 3) },
    { key: 'genre:s3', title: 'Seven', family: 'genre', items: mkItems('s3', 7) },
    { key: 'decade:s4', title: 'Six', family: 'decade', items: mkItems('s4', 6) }
  ];
  const smallPlanner = new FeedPlanner(smallShelves, config, 'small-lib');
  const firstTwo = [smallPlanner.next(null, null, OPENING_MIN_ITEMS), smallPlanner.next(null, null, OPENING_MIN_ITEMS)];
  assert.deepEqual(firstTwo.map(r => r.key).sort(), ['decade:s4', 'genre:s3'], 'Falls back to fullest shelves (6-7 items) over 3-item shelves');
});
