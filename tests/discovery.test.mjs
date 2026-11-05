import test from 'node:test';
import assert from 'node:assert/strict';
import { filterItems, filtersActive, DEFAULT_FILTERS, similarItems, badgeFor } from '../src/engine.js';
const seed={Id:'seed',Name:'Space Story',Type:'Movie',Tags:['space','friendship'],Genres:['Science Fiction'],People:[{Name:'A Director',Type:'Director'}]};
const items=[seed,{Id:'near',Name:'Nearby Worlds',Type:'Movie',Tags:['space'],Genres:['Science Fiction'],People:[{Name:'A Director',Type:'Director'}],RunTimeTicks:80*600000000,CommunityRating:8,ProductionYear:1995,UserData:{Played:false}},
  {Id:'unrelated',Name:'Random Comedy',Type:'Movie',Tags:['cooking'],Genres:['Comedy'],CommunityRating:9},
  {Id:'show',Name:'Space Series',Type:'Series',Tags:['space'],Genres:['Science Fiction'],RunTimeTicks:40*600000000,CommunityRating:8,UserData:{Played:true}}];
test('recommendations exclude seed and unrelated high-rated items and explain real matches',()=>{
  const result=similarItems(seed,items);
  assert.equal(result[0].item.Id,'near');assert.ok(!result.some(r=>['seed','unrelated'].includes(r.item.Id)));
  assert.ok(result.every(r=>r.reason.includes('space')));
});
test('recommendations use only the supplied permitted pool',()=>{
  assert.deepEqual(similarItems(seed,[items[2]]),[]);
});
test('filters combine genre, tag, watched state, runtime, rating, decade and type',()=>{
  const f={...DEFAULT_FILTERS,genre:'Science Fiction',tag:'space',watched:'unwatched',maxMinutes:'90',minRating:'8',decade:'1990',type:'Movie'};
  assert.deepEqual(filterItems(items,f).map(i=>i.Id),['near']);assert.ok(filtersActive(f));
});
test('unknown runtimes and ratings do not pass numeric filters; series are not short movies',()=>{
  const f={...DEFAULT_FILTERS,maxMinutes:'90',minRating:'8'};
  assert.deepEqual(filterItems(items,f).map(i=>i.Id),['near']);
});
test('filter search includes names/credits and sort uses reliable tracked time',()=>{
  assert.deepEqual(filterItems(items,{...DEFAULT_FILTERS,query:'a director'}).map(i=>i.Id),['seed','near']);
  const tracking=new Map([['show',{AddedAt:'2026-11-05'}],['near',{AddedAt:'2026-11-04'}]]);
  assert.equal(filterItems(items,{...DEFAULT_FILTERS,sort:'added'},tracking)[0].Id,'show');
});
test('reliable badges never infer arrival from filesystem dates',()=>{
  const now=new Date('2026-11-05'),item={...seed,DateCreated:'2026-11-04'};
  assert.equal(badgeFor(item,new Map(),now,new Map()),'');
  assert.equal(badgeFor(item,new Map(),now,new Map([['seed',{AddedAt:'2026-11-04'}]])),'Recently Added');
  assert.equal(badgeFor({...item,Type:'Series'},new Map(),now,new Map([['seed',{NewSeasonAt:'2026-11-04',AddedAt:'2026-11-04'}]])),'New Season');
});
