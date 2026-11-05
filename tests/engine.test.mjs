import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { badgeFor, buildShelves, FeedPlanner, matches, monthAgo, recent, routeInfo, seasonBadges, validateConfig } from '../src/engine.js';
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
test('calendar-month badge boundary including month ends', () => {
  assert.equal(monthAgo(new Date('2026-03-31T12:00:00Z')).toISOString(), '2026-02-28T12:00:00.000Z');
  assert.ok(recent('2026-10-04T12:00:00Z',now));
  assert.ok(!recent('2026-10-04T11:59:59Z',now));
  assert.ok(!recent('2026-11-05',now));
  assert.ok(!recent(undefined,now));
});
test('new season ignores episodes, first seasons, specials and old seasons', () => {
  const seasons=[{Id:'s',Type:'Season',SeriesId:'good',IndexNumber:2,DateCreated:'2026-10-20'},
    {Type:'Episode',SeriesId:'episode',IndexNumber:2,DateCreated:'2026-10-20'},
    {Type:'Season',SeriesId:'first',IndexNumber:1,DateCreated:'2026-10-20'},
    {Type:'Season',SeriesId:'special',IndexNumber:0,DateCreated:'2026-10-20'},
    {Type:'Season',SeriesId:'old',IndexNumber:2,DateCreated:'2026-01-01'}];
  const map=seasonBadges(seasons,now);assert.deepEqual([...map.keys()],['good']);
  assert.equal(badgeFor({Id:'good',Type:'Series',DateCreated:'2026-11-01'},map,now),'New Season');
  assert.equal(badgeFor({Id:'other',Type:'Movie',DateCreated:'2026-10-20'},map,now),'Recently Added');
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
test('seasonal tags are not shown outside configured months', () => {
  const list=items.map(i=>({...i,Type:'Movie',Tags:['christmas','halloween']}));
  const keys=date=>buildShelves(list,config.pages.home,config,'home',new Date(date)).map(s=>s.key);
  assert.ok(keys('2026-10-15T12:00:00Z').includes('rule:halloween'));
  assert.ok(!keys('2026-11-15T12:00:00Z').includes('rule:halloween'));
  assert.ok(keys('2026-12-15T12:00:00Z').includes('rule:christmas'));
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
  assert.deepEqual(routeInfo('#/movies?topParentId=abc&collectionType=movies'),{page:'movies',parentId:'abc',serverId:''});
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
