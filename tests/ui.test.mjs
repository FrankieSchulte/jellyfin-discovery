import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { parseHTML } from 'linkedom';
const source = await readFile(new URL('../dist/fazfort-discovery.js', import.meta.url), 'utf8');
const id=n=>n.toString(16).padStart(32,'0');
const fixtureItems=Array.from({length:45},(_,n)=>({Id:id(n+1),Name:`Movie ${n}`,Type:n%3?'Movie':'Series',DateCreated:new Date().toISOString(),ProductionYear:2000+n%20,Genres:['Action','Adventure','Comedy'],Tags:['space','superhero','anime','based on video game'],CommunityRating:8,ImageTags:{Primary:'primary'},BackdropImageTags:['bg'],People:[{Name:'Director '+n%3,Type:'Director'},{Name:'Actor '+n%4,Type:'Actor'}],UserData:{}}));
function fixture({hash='#/home',failure=false,delay=false,config=null}={}){
  const saves=[];
  const {window,document}=parseHTML('<html><head></head><body><div id="indexPage" class="page"><div class="hero">Keep hero</div><div class="homeSectionsContainer"><div class="card" data-id="'+id(1)+'"><div class="cardScalable"></div></div></div></div><div id="moviesPage" class="page hide"><div class="pageTabContent" data-index="0"><p>Original movie list</p></div></div><div id="tvshowsPage" class="page hide"><div class="pageTabContent" data-index="0">Original shows</div></div></body></html>');
  let timeouts=[],frames=[],mutation,intersect,requests=0,resolver,focused=document.body;
  const listeners=new Map();
  Object.defineProperty(document,'activeElement',{configurable:true,get:()=>focused});
  window.HTMLElement.prototype.focus=function(){focused=this;};
  window.HTMLElement.prototype.scrollIntoView=function(){};
  const storage=new Map();
  const api={ajax:async options=>{const body=JSON.parse(options.data);saves.push(body);config=body.Config;return {Version:saves.length};},getCurrentUserId:()=> 'u',serverId:()=> 's',getImageUrl:(i,o)=>`https://example.test/Items/${i}/Images/${o.type}`,getUrl:(p,q)=>({p,q}),getJSON:async ({p})=>{
    if(p==='FazFortDiscovery/Preferences')return {Version:saves.length,Config:config};
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
  return {ctx,document,api,location,storage,settle,saves,runAgain:()=>vm.runInContext(source,ctx),intersection:()=>intersect([{isIntersecting:true}]),resolve:()=>resolver?.(),requests:()=>requests,frames:()=>{const f=frames;frames=[];f.forEach(fn=>fn());},notify:()=>mutation([{target:document.body,type:'childList'}]),navigate:hash=>{location.hash=hash;listeners.get('hashchange')?.();const queued=timeouts.filter(t=>t.ms===120);timeouts=timeouts.filter(t=>t.ms!==120);queued.forEach(t=>t.fn());},key:(node,key,keyCode)=>{const event=new window.Event('keydown',{bubbles:true,cancelable:true});Object.defineProperties(event,{key:{value:key},keyCode:{value:keyCode}});node.dispatchEvent(event);return event;},select:(label,value)=>{const select=document.querySelector(`select[aria-label="${label}"]`);for(const option of select.querySelectorAll('option'))option.toggleAttribute('selected',option.value===value);select.dispatchEvent(new window.Event('change',{bubbles:true}));}};
}
test('home mounts, alternates core/theme, preserves hero and restores native on stop',async()=>{
  const f=fixture();await f.settle();
  assert.equal(f.document.querySelectorAll('.fx-discovery').length,1);
  const rows=[...f.document.querySelectorAll('.fx-shelf')].map(x=>x.dataset.shelfKey);
  assert.equal(rows[0],'ContinueWatchingNextUp');assert.ok(rows[1].startsWith('rule:'));assert.equal(rows[2],'RecentlyAddedMovies');assert.ok(rows[3].startsWith('rule:'));
  assert.equal(f.document.querySelector('.hero').textContent,'Keep hero');
  assert.equal(f.document.querySelector('.homeSectionsContainer').getAttribute('data-fx-native-hidden'),null);
  assert.equal(f.document.querySelector('.homeSectionsContainer .card').getAttribute('data-fx-native-hidden'),'true');
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
test('native section anchor stays visible and adjacent to SleekFin hero, including late rows',async()=>{
  const f=fixture();await f.settle();
  const native=f.document.querySelector('.homeSectionsContainer');native.classList.add('sections');
  const hero=f.document.createElement('div');hero.className='sleekfin-hero';hero.textContent='Featured title';native.before(hero);
  const late=f.document.createElement('section');late.textContent='late HSS row';native.append(late);
  f.navigate('#/home');await f.settle();
  assert.equal(hero.nextElementSibling,native);assert.equal(native.nextElementSibling.className.includes('fx-discovery'),true);
  assert.equal(native.getAttribute('data-fx-native-hidden'),null);assert.equal(hero.closest('[data-fx-native-hidden]'),null);
  assert.equal(late.getAttribute('data-fx-native-hidden'),'true');
  f.ctx.window.FazFortDiscovery.stop();assert.equal(late.getAttribute('data-fx-native-hidden'),null);
});
test('opening rows pin a theme and rotate a director between defaults; Discover stays portrait',async()=>{
  const config=JSON.parse(await readFile(new URL('../config/default.json',import.meta.url),'utf8'));
  config.pages.home.anchors=[];
  config.pages.home.opening=['anchor:MyMedia','rule:popcorn','family:director','anchor:DiscoverMovies'];
  config.pages.home.layouts={'rule:popcorn':'portrait'};
  const f=fixture({config});await f.settle();
  const rows=[...f.document.querySelectorAll('.fx-shelf')];
  assert.deepEqual(rows.map(r=>r.dataset.shelfKey).slice(0,2),['MyMedia','rule:popcorn']);
  assert.ok(rows[2].dataset.shelfKey.startsWith('director:'));assert.equal(rows[3].dataset.shelfKey,'DiscoverMovies');
  assert.equal(rows[1].dataset.layout,'portrait');assert.equal(rows[3].dataset.layout,'portrait');
  assert.ok(rows[3].querySelector('.fx-card-portrait img').src.endsWith('/Images/Primary'));
  f.intersection();await f.settle();assert.ok(f.document.querySelectorAll('.fx-shelf').length>4);
  f.ctx.window.FazFortDiscovery.stop();
});
test('visual editor creates and saves a category and ordering without JSON edits',async()=>{
  const f=fixture();await f.settle();
  [...f.document.querySelectorAll('.fx-toolbar button')].find(b=>b.textContent==='Customize').click();
  const dialog=f.document.querySelector('#fx-customize');
  const click=text=>[...dialog.querySelectorAll('button')].find(b=>b.textContent===text).click();
  const change=(label,value)=>{const field=dialog.querySelector(`input[aria-label="${label}"]`);field.value=value;field.dispatchEvent(new f.ctx.document.defaultView.Event('change',{bubbles:true}));};
  click('Add category');change('Category title','Space favorites');change('Tags','space');f.select('Category artwork','portrait');click('Done editing');
  const draft=JSON.parse(dialog.querySelector('textarea').value),rule=draft.pages.home.rules.find(r=>r.Title==='Space favorites');
  assert.ok(rule);assert.deepEqual(rule.TagsAny,['space']);assert.equal(rule.Layout,'portrait');
  f.select('Add opening row',`rule:${rule.Key}`);click('Add row');
  const rows=dialog.querySelectorAll('.fx-order-row');rows[rows.length-1].querySelector('button[aria-label$=" up"]').click();
  click('Apply');await f.settle();
  assert.equal(f.saves.length,1);assert.equal(f.saves[0].Config.pages.home.opening.at(-2),`rule:${rule.Key}`);
  assert.equal(f.saves[0].Config.pages.movies.rules.some(r=>r.Key===rule.Key),false);
  f.ctx.window.FazFortDiscovery.stop();
});
test('feed utilities are inside one closed disclosure without a second page heading',async()=>{
  const f=fixture();await f.settle();
  const toolbar=f.document.querySelector('.fx-toolbar');assert.equal(toolbar.querySelector('h2'),null);
  const menu=toolbar.querySelector('details');assert.ok(menu);assert.equal(menu.hasAttribute('open'),false);
  assert.equal(menu.querySelector('summary').textContent,'Browse options');f.ctx.window.FazFortDiscovery.stop();
});
test('Movies Suggestions mount by default; explicit Library stays native and Genres uses owned shelves',async()=>{
  const f=fixture();await f.settle();
  f.document.getElementById('indexPage').classList.add('hide');const page=f.document.getElementById('moviesPage');page.classList.remove('hide');
  for(const index of [1,4]){const tab=f.document.createElement('div');tab.className='pageTabContent';tab.dataset.index=String(index);tab.textContent='Native tab';page.append(tab);}
  f.navigate('#/movies?tab=1');await f.settle();assert.ok(f.document.querySelectorAll('.fx-shelf').length>2);assert.equal(f.document.querySelector('.fx-toolbar h1').textContent,'Movies');
  assert.ok([...page.querySelectorAll('.pageTabContent')].every(t=>t.getAttribute('data-fx-native-hidden')==='true'));
  f.navigate('#/movies?tab=0');await f.settle();assert.equal(f.document.querySelector('[data-fx-native-hidden]'),null);assert.equal(f.document.querySelector('.fx-shelf'),null);
  assert.equal(page.querySelector('.pageTabContent[data-index="0"]').classList.contains('is-active'),true);
  f.navigate('#/movies?tab=4');await f.settle();assert.ok([...f.document.querySelectorAll('.fx-shelf')].every(n=>n.dataset.shelfKey.startsWith('genre:')&&n.dataset.layout==='landscape'));
  f.ctx.window.FazFortDiscovery.stop();
});
test('SleekFin jellyfin:view header buttons navigate to Suggestions and close side drawer',async()=>{
  const f=fixture();await f.settle();
  const drawer=f.document.createElement('div');drawer.className='mainDrawer drawer-open';
  const link=f.document.createElement('a');link.dataset.itemid='tv-guid';link.setAttribute('href','#/tv.html?topParentId=tv-guid&collectionType=tvshows');
  drawer.append(link);f.document.body.append(drawer);
  const proxy=f.document.createElement('div');proxy.setAttribute('data-sleekfin-header-proxy','true');
  const btn=f.document.createElement('button');btn.setAttribute('data-sleekfin-header-proxy-item','jellyfin:view:tv-guid');btn.textContent='Shows';
  proxy.append(btn);f.document.body.append(proxy);
  btn.click();
  assert.equal(f.location.hash,'#/tv.html?topParentId=tv-guid&collectionType=tvshows&tab=1');
  assert.equal(drawer.classList.contains('drawer-open'),false);
  f.ctx.window.FazFortDiscovery.stop();
});
test('Home controls move to the user profile and stay open through reconciliation',async()=>{
  const f=fixture();await f.settle();assert.equal(f.document.querySelector('.fx-toolbar').hidden,true);
  const profile=f.document.createElement('div');profile.className='userPreferencesPage';f.document.body.append(profile);f.document.getElementById('indexPage').classList.add('hide');
  f.navigate('#/mypreferencesmenu');await f.settle();assert.ok(profile.querySelector('[data-fx-settings-link]'));
  profile.querySelector('button').click();await f.settle();assert.ok(f.document.querySelector('#fx-customize'));
  f.navigate('#/mypreferencesmenu');await f.settle();assert.ok(f.document.querySelector('#fx-customize'));f.ctx.window.FazFortDiscovery.stop();
});
test('category arrows wrap at either horizontal edge and remote navigation loops cards',async()=>{
  const f=fixture();await f.settle();const shelf=f.document.querySelector('.fx-shelf'),track=shelf.querySelector('.fx-track');
  Object.defineProperties(track,{clientWidth:{value:500},scrollWidth:{value:1500}});track.scrollLeft=1000;shelf.querySelectorAll('.fx-row-head button')[1].click();assert.equal(track.scrollLeft,0);
  shelf.querySelector('.fx-row-head button').click();assert.equal(track.scrollLeft,1000);
  f.storage.set('fazfort-discovery:controls:s:u','tv');const cards=track.querySelectorAll('.fx-card');cards[cards.length-1].focus();f.key(cards[cards.length-1],'ArrowRight',39);assert.equal(f.document.activeElement,cards[0]);f.ctx.window.FazFortDiscovery.stop();
});
test('default native categories are hidden immediately on mount before async inventory resolves',async()=>{
  const f=fixture({delay:true});
  assert.equal(f.document.querySelector('.homeSectionsContainer').getAttribute('data-fx-hero-anchor'),'true');
  assert.equal(f.document.querySelector('.homeSectionsContainer .card').getAttribute('data-fx-native-hidden'),'true');
  f.resolve();await f.settle();f.ctx.window.FazFortDiscovery.stop();
});
test('horizontal track repeats item cycles and normalizes scrollLeft seamlessly without resetting to zero',async()=>{
  const f=fixture();await f.settle();
  const shelf=f.document.querySelector('.fx-shelf'),track=shelf.querySelector('.fx-track');
  const clones=track.querySelectorAll('[data-loop-clone]');
  assert.ok(clones.length>0);
  [...track.children].forEach((child,idx)=>{Object.defineProperty(child,'offsetLeft',{configurable:true,value:idx*280});});
  const baseCount=track.children.length-clones.length;
  const cw=baseCount*280;
  Object.defineProperties(track,{clientWidth:{value:800},scrollWidth:{value:track.children.length*280}});
  track.scrollLeft=cw*2;
  track.dispatchEvent(new f.ctx.document.defaultView.Event('scroll'));
  assert.equal(track.scrollLeft,cw);
  let lastScrollBy=null;
  track.scrollBy=opts=>{lastScrollBy=opts;};
  track.scrollLeft=cw*2+40;
  shelf.querySelectorAll('.fx-row-head button')[1].click();
  assert.equal(track.scrollLeft,cw+40);
  assert.equal((track.scrollLeft + lastScrollBy.left) % 280, 0);
  f.ctx.window.FazFortDiscovery.stop();
});
test('React library pages without pageTabContent mount discovery, customize dropdown views, and support header live search and instant boot rows',async()=>{
  const f=fixture();await f.settle();
  const bootRaw=f.storage.get('fazfort-discovery:boot:v1:s:u:home::home');
  assert.ok(bootRaw);
  assert.ok(JSON.parse(bootRaw).rows.length>=3);

  const proxy=f.document.createElement('div');proxy.setAttribute('data-sleekfin-header-proxy','true');
  const searchBtn=f.document.createElement('button');searchBtn.setAttribute('data-sleekfin-header-proxy-item','jellyfin:search');
  proxy.append(searchBtn);f.document.body.prepend(proxy);

  const viewsMod={u:[{path:'/movies',views:[{index:0,label:'Movies',view:'Movies'}]},{path:'/tv',views:[{index:0,label:'Series',view:'Series'}]}]};
  const mapMod={A:{movies:{},tvshows:{}}};
  const fakeReq=id=>id===57826?viewsMod:id===95753?mapMod:null;
  fakeReq.m={57826:true,95753:true};
  f.ctx.window.webpackChunk={push:([_id,_mods,cb])=>cb?.(fakeReq)};

  const tvPage=f.document.getElementById('tvshowsPage');
  tvPage.replaceChildren();
  const reactNative=f.document.createElement('div');reactNative.className='nativeReactGrid';reactNative.textContent='React TV Grid';
  tvPage.append(reactNative);
  f.document.getElementById('indexPage').classList.add('hide');
  tvPage.classList.remove('hide');
  f.navigate('#/tv?tab=1');await f.settle();

  assert.equal(tvPage.getAttribute('data-fx-react-host'),'true');
  assert.equal(reactNative.getAttribute('data-fx-native-hidden'),'true');
  const options=[...tvPage.querySelectorAll('.fx-title-select option')].map(o=>o.textContent);
  assert.deepEqual(options,['TV Shows','Library','Favorites','Genres']);
  assert.deepEqual([...viewsMod.u.find(x=>x.path==='/movies').views.map(v=>v.label)],['Movies','Library','Favorites','Genres']);
  assert.deepEqual([...viewsMod.u.find(x=>x.path==='/tv').views.map(v=>v.label)],['TV Shows','Library','Favorites','Genres']);
  assert.equal(mapMod.A.tvshows[2].viewType,'favorites');
  assert.equal(mapMod.A.tvshows[2].collectionType,'tvshows');
  assert.deepEqual([...mapMod.A.tvshows[2].itemType],['Series']);
  assert.equal(mapMod.A.tvshows[2].isBtnPlayAllEnabled,false);
  assert.equal(mapMod.A.tvshows[2].isBtnShuffleEnabled,false);

  const dlBtn=f.document.createElement('button');dlBtn.className='btnDownload';dlBtn.setAttribute('data-id','movie-1');
  f.document.body.append(dlBtn);
  dlBtn.click();
  assert.ok(f.document.querySelector('.fx-download-menu.is-open'));

  searchBtn.click();
  const wrap=f.document.querySelector('.fx-header-search.is-open');
  assert.ok(wrap);
  assert.notEqual(searchBtn.style.display,'none');
  const input=wrap.querySelector('.fx-header-search-input');
  input.value='Movie 1';
  input.dispatchEvent(new f.ctx.document.defaultView.Event('input',{bubbles:true}));
  f.navigate('#/tv?tab=1');
  await f.settle();
  f.ctx.window.FazFortDiscovery.stop();
});
test('visual editor discovers possible categories from library metadata and toggles them on',async()=>{
  const f=fixture();await f.settle();
  [...f.document.querySelectorAll('.fx-toolbar button')].find(b=>b.textContent==='Customize').click();
  const dialog=f.document.querySelector('#fx-customize');
  const dirCard=[...dialog.querySelectorAll('.fx-candidate-card')].find(c=>c.textContent.includes('Directed by Director 0'));
  assert.ok(dirCard);
  const box=dirCard.querySelector('input[type="checkbox"]');
  box.checked=true;box.dispatchEvent(new f.ctx.document.defaultView.Event('change',{bubbles:true}));
  const draft=JSON.parse(dialog.querySelector('textarea').value);
  assert.ok(draft.pages.home.rules.some(r=>r.Title==='Directed by Director 0'&&r.Enabled!==false));
  f.ctx.window.FazFortDiscovery.stop();
});
