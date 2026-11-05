import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { parseHTML } from 'linkedom';
const source = await readFile(new URL('../dist/fazfort-discovery.js', import.meta.url), 'utf8');
const id=n=>n.toString(16).padStart(32,'0');
const fixtureItems=Array.from({length:45},(_,n)=>({Id:id(n+1),Name:`Movie ${n}`,Type:n%3?'Movie':'Series',DateCreated:new Date().toISOString(),ProductionYear:2000+n%20,Genres:['Action','Adventure','Comedy'],Tags:['space','superhero','anime','based on video game'],CommunityRating:8,ImageTags:{Primary:'primary'},BackdropImageTags:['bg'],People:[{Name:'Director '+n%3,Type:'Director'},{Name:'Actor '+n%4,Type:'Actor'}],UserData:{}}));
function fixture({hash='#/home',failure=false,delay=false}={}){
  const {window,document}=parseHTML('<html><head></head><body><div id="indexPage" class="page"><div class="hero">Keep hero</div><div class="homeSectionsContainer"><div class="card" data-id="'+id(1)+'"><div class="cardScalable"></div></div></div></div><div id="moviesPage" class="page hide"><div class="pageTabContent" data-index="0"><p>Original movie list</p></div></div><div id="tvshowsPage" class="page hide"><div class="pageTabContent" data-index="0">Original shows</div></div></body></html>');
  let timeouts=[],frames=[],mutation,intersect,requests=0,resolver,focused=document.body;
  const listeners=new Map();
  Object.defineProperty(document,'activeElement',{configurable:true,get:()=>focused});
  window.HTMLElement.prototype.focus=function(){focused=this;};
  window.HTMLElement.prototype.scrollIntoView=function(){};
  const storage=new Map();
  const api={getCurrentUserId:()=> 'u',serverId:()=> 's',getImageUrl:(i,o)=>`https://example.test/Items/${i}/Images/${o.type}`,getUrl:(p,q)=>({p,q}),getJSON:async ({p})=>{
    if(p==='FazFortDiscovery/Preferences')return {Version:0,Config:null};
    if(p==='FazFortDiscovery/Tracking')return {Ready:true,Records:Object.fromEntries(fixtureItems.map(i=>[i.Id,{AddedAt:new Date().toISOString()}]))};
    if(p.endsWith('/Views'))return {Items:[{Id:'m',Name:'Movies',CollectionType:'movies'},{Id:'t',Name:'Shows',CollectionType:'tvshows'}]};
    return {Items:fixtureItems.slice(0,3)};
  },getItems:async(u,p)=>{
    requests++;
    if(failure)throw Error('fixture failure');
    if(delay)await new Promise(r=>{resolver=r;});
    if(p.Ids)return {Items:fixtureItems.filter(i=>p.Ids.split(',').includes(i.Id))};
    if(p.IncludeItemTypes==='Season')return {Items:[]};
    return {Items:fixtureItems.filter(i=>p.IncludeItemTypes.split(',').includes(i.Type))};
  }};
  const location={hash,origin:'https://example.test',href:'https://example.test/web/'+hash};
  const fakeWindow={ApiClient:api,addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
  const context={window:fakeWindow,document,Element:window.Element,location,console,structuredClone,URL,URLSearchParams,Blob,Intl,Date,Map,Set,innerHeight:800,
    localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
    getComputedStyle:n=>({display:n.classList.contains('hide')?'none':'block'}),
    setTimeout:(fn,ms)=>{timeouts.push({fn,ms});return timeouts.length;},clearTimeout(){},setInterval:()=>1,clearInterval(){},
    requestAnimationFrame:fn=>frames.push(fn),
    MutationObserver:class{constructor(cb){mutation=cb}observe(){}disconnect(){}},IntersectionObserver:class{constructor(cb){intersect=cb}observe(){}disconnect(){}}};
  window.HTMLElement.prototype.getBoundingClientRect=function(){const n=this.parentNode?.children?Array.from(this.parentNode.children).indexOf(this):0;return {top:1000+n*250,bottom:1250+n*250,height:250};};
  window.HTMLElement.prototype.scrollBy=function(){};
  const ctx=vm.createContext(context);
  vm.runInContext(source,ctx);
  const settle=async()=>{for(let n=0;n<80;n++)await Promise.resolve();};
  return {ctx,document,api,location,storage,settle,runAgain:()=>vm.runInContext(source,ctx),intersection:()=>intersect([{isIntersecting:true}]),resolve:()=>resolver?.(),requests:()=>requests,frames:()=>{const f=frames;frames=[];f.forEach(fn=>fn());},notify:()=>mutation([{target:document.body,type:'childList'}]),navigate:hash=>{location.hash=hash;listeners.get('hashchange')?.();const queued=timeouts.filter(t=>t.ms===120);timeouts=timeouts.filter(t=>t.ms!==120);queued.forEach(t=>t.fn());},key:(node,key,keyCode)=>{const event=new window.Event('keydown',{bubbles:true,cancelable:true});Object.defineProperties(event,{key:{value:key},keyCode:{value:keyCode}});node.dispatchEvent(event);return event;},select:(label,value)=>{const select=document.querySelector(`select[aria-label="${label}"]`);for(const option of select.querySelectorAll('option'))option.toggleAttribute('selected',option.value===value);select.dispatchEvent(new window.Event('change',{bubbles:true}));}};
}
test('home mounts, alternates core/theme, preserves hero and restores native on stop',async()=>{
  const f=fixture();await f.settle();
  assert.equal(f.document.querySelectorAll('.fx-discovery').length,1);
  const rows=[...f.document.querySelectorAll('.fx-shelf')].map(x=>x.dataset.shelfKey);
  assert.equal(rows[0],'ContinueWatchingNextUp');assert.ok(rows[1].startsWith('rule:'));assert.equal(rows[2],'RecentlyAddedMovies');assert.ok(rows[3].startsWith('rule:'));
  assert.equal(f.document.querySelector('.hero').textContent,'Keep hero');
  assert.equal(f.document.querySelector('.homeSectionsContainer').getAttribute('data-fx-native-hidden'),'true');
  f.ctx.window.FazFortDiscovery.stop();
  assert.equal(f.document.querySelector('.fx-discovery'),null);assert.equal(f.document.querySelector('[data-fx-native-hidden]'),null);
});
test('intersection fetches more, duplicate script evaluation does not duplicate UI',async()=>{
  const f=fixture();await f.settle();const before=f.document.querySelectorAll('.fx-shelf').length;
  f.intersection();await f.settle();assert.ok(f.document.querySelectorAll('.fx-shelf').length>before);
  f.runAgain();assert.equal(f.document.querySelectorAll('.fx-discovery').length,1);f.ctx.window.FazFortDiscovery.stop();
});
test('Movies and Shows mounts preserve toggle and typed shelves',async()=>{
  const f=fixture();await f.settle();
  for(const [page,dom] of [['movies','moviesPage'],['tv','tvshowsPage']]){
    f.document.querySelectorAll('.page').forEach(n=>n.classList.add('hide'));f.document.getElementById(dom).classList.remove('hide');
    f.location.hash='#/'+page;f.ctx.window.FazFortDiscovery.restart();await f.settle();
    const root=f.document.querySelector('.fx-discovery');assert.ok(f.document.getElementById(dom).contains(root));
    const toggle=root.querySelector('.fx-toolbar button');assert.equal(toggle.textContent,'Full library');
    toggle.click();assert.equal(toggle.textContent,'Discover shelves');assert.equal(f.document.querySelector('[data-fx-native-hidden]'),null);
    toggle.click();assert.equal(toggle.textContent,'Full library');
  }
  f.ctx.window.FazFortDiscovery.stop();
});
test('metadata failure fails open instead of an empty home',async()=>{
  const f=fixture({failure:true});await f.settle();
  assert.equal(f.document.querySelector('[data-fx-native-hidden]'),null);
  assert.match(f.document.querySelector('.fx-status').textContent,/normal view is restored/);
  f.ctx.window.FazFortDiscovery.stop();
});
test('detached async result cannot hide the next route',async()=>{
  const f=fixture({delay:true});await f.settle();
  f.location.hash='#/details?id=example';f.ctx.window.FazFortDiscovery.restart();f.resolve();await f.settle();
  assert.equal(f.document.querySelector('.fx-discovery'),null);assert.equal(f.document.querySelector('[data-fx-native-hidden]'),null);
  f.ctx.window.FazFortDiscovery.stop();
});
test('native card gets Recently Added and cleanup removes badge',async()=>{
  const f=fixture();await f.settle();assert.equal(f.document.querySelector('[data-fx-native-badge]').textContent,'Recently Added');
  f.ctx.window.FazFortDiscovery.stop();assert.equal(f.document.querySelector('[data-fx-native-badge]'),null);
});
test('continuous loading bounds live image rows and preserves shelf slots',async()=>{
  const f=fixture();await f.settle();
  for(let n=0;n<12;n++){f.intersection();await f.settle();}
  const d=f.ctx.window.FazFortDiscovery.diagnostics();
  assert.ok(d.loadedRows>40);assert.ok(d.liveRows<=24);assert.equal(f.document.querySelectorAll('.fx-shelf').length,d.loadedRows);
  f.ctx.window.FazFortDiscovery.stop();
});
test('saved full-library view stays native and can enable shelves later',async()=>{
  const f=fixture();await f.settle();
  f.storage.set('fazfort-discovery:view:s:u:home','native');
  f.ctx.window.FazFortDiscovery.restart();await f.settle();
  assert.equal(f.document.querySelector('[data-fx-native-hidden]'),null);
  f.document.querySelector('.fx-toolbar button').click();await f.settle();
  assert.ok(f.document.querySelector('[data-fx-native-hidden]'));
  assert.ok(f.document.querySelector('.fx-shelf'));
  f.ctx.window.FazFortDiscovery.stop();
});
test('full-library preference is not overridden by a later loading response',async()=>{
  const f=fixture();await f.settle();
  let resolve; const original=f.api.getItems;
  f.api.getItems=async(...args)=>{await new Promise(r=>{resolve=r});return original(...args)};
  f.intersection();await f.settle();
  f.document.querySelector('.fx-toolbar button').click();
  for(let n=0;n<5;n++){resolve?.();await f.settle();}
  assert.equal(f.document.querySelector('[data-fx-native-hidden]'),null);
  assert.equal(f.document.querySelector('.fx-toolbar button').textContent,'Discover shelves');
  f.ctx.window.FazFortDiscovery.stop();
});
test('invalid saved configuration fails open with working Customize control',async()=>{
  const f=fixture();await f.settle();
  f.storage.set('fazfort-discovery:config:v1:s:u','{not json');
  f.ctx.window.FazFortDiscovery.restart();await f.settle();
  assert.equal(f.document.querySelector('[data-fx-native-hidden]'),null);
  assert.ok([...f.document.querySelectorAll('.fx-toolbar button')].some(n=>n.textContent==='Customize'));
  f.ctx.window.FazFortDiscovery.stop();
});
test('More like this opens an explained modal and TV Back closes it',async()=>{
  const f=fixture();await f.settle();f.document.querySelector('.fx-card-more').click();
  assert.ok(f.document.querySelector('.fx-similar'));assert.ok(f.document.querySelector('.fx-match-reason'));
  f.key(f.document.querySelector('.fx-similar button'),'Unidentified',10009);
  assert.equal(f.document.querySelector('.fx-dialog-overlay'),null);f.ctx.window.FazFortDiscovery.stop();
});
test('filtering narrows the feed and a zero-result filter does not reveal the unfiltered grid',async()=>{
  const f=fixture();await f.settle();f.select('Movie runtime','90');await f.settle();
  assert.match(f.document.querySelector('.fx-status').textContent,/No matching titles/);
  assert.equal(f.document.querySelector('.fx-match-count').textContent,'0 matching titles');
  assert.ok(f.document.querySelector('[data-fx-native-hidden]'));
  f.ctx.window.FazFortDiscovery.stop();
});
test('detail return restores the same rows and horizontal/vertical positions',async()=>{
  const f=fixture();await f.settle();f.intersection();await f.settle();
  const rows=[...f.document.querySelectorAll('.fx-shelf')].map(n=>n.dataset.shelfKey);
  f.document.documentElement.scrollTop=450;f.document.querySelector('.fx-track').scrollLeft=120;
  const card=f.document.querySelector('.fx-card');card.focus();card.click();
  f.navigate('#/details?id=example');await f.settle();assert.equal(f.document.querySelector('.fx-discovery'),null);
  f.navigate('#/home');await f.settle();f.frames();
  assert.deepEqual([...f.document.querySelectorAll('.fx-shelf')].map(n=>n.dataset.shelfKey),rows);
  assert.equal(f.document.documentElement.scrollTop,450);assert.equal(f.document.querySelector('.fx-track').scrollLeft,120);
  f.ctx.window.FazFortDiscovery.stop();
});
test('TV arrows move card focus and do not consume typing in filters',async()=>{
  const f=fixture();await f.settle();f.storage.set('fazfort-discovery:controls:s:u','tv');
  const cards=[...f.document.querySelector('.fx-track').querySelectorAll('.fx-card')];cards[0].focus();
  const event=f.key(cards[0],'Unidentified',39);assert.ok(event.defaultPrevented);assert.equal(f.document.activeElement,cards[1]);
  const input=f.document.querySelector('.fx-filters input');input.focus();const typing=f.key(input,'ArrowLeft',37);assert.ok(!typing.defaultPrevented);
  f.ctx.window.FazFortDiscovery.stop();
});
test('Customize works without structuredClone or native dialog.showModal',async()=>{
  const f=fixture();delete f.ctx.structuredClone;await f.settle();
  [...f.document.querySelectorAll('.fx-toolbar button')].find(b=>b.textContent==='Customize').click();
  assert.ok(f.document.querySelector('.fx-dialog-fallback[open]'));f.ctx.window.FazFortDiscovery.stop();
});
