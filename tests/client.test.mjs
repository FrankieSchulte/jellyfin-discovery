import test from 'node:test';
import assert from 'node:assert/strict';
import { JellyfinClient } from '../src/client.js';
const id=n=>n.toString(16).padStart(32,'0');
function apiFixture(getItems) {
  const calls=[];
  const api={getCurrentUserId:()=> 'user-a',serverId:()=> 'server-a',getUrl:(p,q)=>({p,q}),getJSON:async ({p})=>{assert.equal(p,'Users/user-a/Views');return {Items:[{Id:'movies',CollectionType:'movies'},{Id:'shows',CollectionType:'tvshows'}]};},getItems:async(u,p)=>{calls.push({u,p});return getItems(p);}};
  return {api,calls};
}
test('inventory uses pagination and selected parent, deduplicates repeated IDs',async()=>{
  const {api,calls}=apiFixture(p=>({Items:Array.from({length:p.StartIndex?5:200},(_,n)=>({Id:id(p.StartIndex+n),Type:'Movie'})),TotalRecordCount:205}));
  const client=new JellyfinClient(api);
  const result=await client.inventory({page:'movies',parentId:'selected'});
  assert.equal(result.items.length,205);assert.equal(calls.length,2);
  assert.ok(calls.every(c=>c.u==='user-a'&&c.p.ParentId==='selected'&&c.p.Limit===200));
  assert.equal(calls[1].p.StartIndex,200);
});
test('session switch invalidates an in-flight result',async()=>{
  let valid=true;const {api}=apiFixture(()=>{valid=false;return {Items:[]};});
  const client=new JellyfinClient(api,()=>valid);
  await assert.rejects(client.inventory({page:'movies',parentId:'selected'}),/view has changed/);
});
test('hydration drops removed or inaccessible local items',async()=>{
  const {api}=apiFixture(()=>({Items:[{Id:id(1),ImageTags:{Primary:'tag'}}]}));
  const result=await new JellyfinClient(api).hydrate([{Id:id(1),Name:'yes'},{Id:id(2),Name:'no'}]);
  assert.equal(result.length,1);assert.equal(result[0].Name,'yes');assert.equal(result[0].ImageTags.Primary,'tag');
});
test('read-only client never writes settings or tags',async()=>{
  const {api,calls}=apiFixture(()=>({Items:[]}));
  await new JellyfinClient(api).inventory({page:'movies',parentId:''});
  assert.ok(calls.every(c=>c.p.ParentId==='movies'));
});
test('tracking requests only supplied IDs and normalizes record casing',async()=>{
  const {api}=apiFixture(()=>({Items:[]}));let seen;
  api.getJSON=async({p,q})=>{seen={p,q};return{ready:true,records:{[id(1)]:{addedAt:'2026-11-04'}}};};
  const result=await new JellyfinClient(api).tracking([{Id:id(1)}]);
  assert.equal(seen.p,'FazFortDiscovery/Tracking');assert.equal(seen.q.Ids,id(1));assert.equal(result.records.get(id(1)).AddedAt,'2026-11-04');
});
test('preference writes carry an optimistic version and no arbitrary user ID',async()=>{
  const {api}=apiFixture(()=>({Items:[]}));let sent;
  api.ajax=async request=>{sent=JSON.parse(request.data);return{Version:5};};
  await new JellyfinClient(api).savePreferences({schemaVersion:1},4);
  assert.deepEqual(sent,{ExpectedVersion:4,Config:{schemaVersion:1}});assert.ok(!('UserId' in sent));
});
test('tracked movie additions outrank old filesystem dates in recently added',async()=>{
  const {api}=apiFixture(()=>({Items:[]}));
  const items=[{Id:id(1),Name:'tracked',Type:'Movie',DateCreated:'1990-01-01'},{Id:id(2),Name:'old',Type:'Movie',DateCreated:'2026-11-04'}];
  const row=await new JellyfinClient(api).anchor('RecentlyAddedMovies',{page:'movies'},{items,tracking:new Map([[id(1),{AddedAt:'2026-11-03'}]])},{cardsPerShelf:8});
  assert.equal(row.items[0].Id,id(1));
});
