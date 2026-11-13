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
  let timeouts=[],nextTimerId=1,frames=[],mutation,intersect,requests=0,resolver,focused=document.body;
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
    setTimeout:(fn,ms)=>{const tid=nextTimerId++;timeouts.push({id:tid,fn,ms});return tid;},clearTimeout(tid){timeouts=timeouts.filter(t=>t.id!==tid);},setInterval:()=>1,clearInterval(){},
    requestAnimationFrame:fn=>frames.push(fn),
    MutationObserver:class{constructor(cb){mutation=cb}observe(){}disconnect(){}},IntersectionObserver:class{constructor(cb){intersect=cb}observe(){}disconnect(){}}};
  window.HTMLElement.prototype.getBoundingClientRect=function(){const n=this.parentNode?.children?Array.from(this.parentNode.children).indexOf(this):0;return {top:1000+n*250,bottom:1250+n*250,height:250};};
  window.HTMLElement.prototype.scrollBy=function(){};
  const ctx=vm.createContext(context);
  vm.runInContext(source,ctx);
  const settle=async()=>{for(let n=0;n<80;n++)await Promise.resolve();};
  return {ctx,document,api,location,storage,settle,saves,flushTimeouts:msFilter=>{const due=timeouts.filter(t=>msFilter===undefined||t.ms===msFilter);timeouts=timeouts.filter(t=>!due.includes(t));due.forEach(t=>t.fn());},runAgain:()=>vm.runInContext(source,ctx),intersection:()=>intersect([{isIntersecting:true}]),resolve:()=>resolver?.(),requests:()=>requests,frames:()=>{const f=frames;frames=[];f.forEach(fn=>fn());},notify:()=>mutation([{target:document.body,type:'childList'}]),navigate:hash=>{location.hash=hash;listeners.get('hashchange')?.();const queued=timeouts.filter(t=>t.ms===120);timeouts=timeouts.filter(t=>t.ms!==120);queued.forEach(t=>t.fn());},key:(node,key,keyCode)=>{const event=new window.Event('keydown',{bubbles:true,cancelable:true});Object.defineProperties(event,{key:{value:key},keyCode:{value:keyCode}});node.dispatchEvent(event);return event;},select:(label,value)=>{const select=document.querySelector(`select[aria-label="${label}"]`);for(const option of select.querySelectorAll('option'))option.toggleAttribute('selected',option.value===value);select.dispatchEvent(new window.Event('change',{bubbles:true}));}};
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
test('More like this omits hover three-dots button, opens via contextmenu, and TV Back closes it',async()=>{
  const f=fixture();await f.settle();
  assert.equal(f.document.querySelector('.fx-card-more'),null);
  const card=f.document.querySelector('.fx-card');
  const ctxEv=new f.ctx.document.defaultView.Event('contextmenu',{bubbles:true,cancelable:true});
  card.dispatchEvent(ctxEv);
  assert.ok(ctxEv.defaultPrevented);
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
  const seeMoreCard=rows[3].querySelector('.fx-see-more-card');
  assert.ok(seeMoreCard);
  assert.equal(seeMoreCard.querySelector('.fx-see-more-label').textContent,'See More');
  assert.equal(seeMoreCard.querySelector('.fx-see-more-sub').textContent,'Popular Movies');
  assert.equal(seeMoreCard.querySelector('.fx-name').textContent,'All Popular Movies');
  const discoverTrack=rows[3].querySelector('.fx-track');
  assert.equal(discoverTrack.dataset.noLoop,'true');
  assert.equal(discoverTrack.querySelectorAll('[data-loop-clone]').length,0);
  Object.defineProperties(discoverTrack,{clientWidth:{value:500},scrollWidth:{value:1500}});
  discoverTrack.scrollLeft=1000;
  rows[3].querySelectorAll('.fx-row-head button')[1].click();
  assert.equal(discoverTrack.scrollLeft,1000);
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
test('Settings menu omits separate Discovery row while Customize dialog stays open through reconciliation',async()=>{
  const f=fixture();await f.settle();assert.equal(f.document.querySelector('.fx-toolbar').hidden,true);
  const profile=f.document.createElement('div');profile.id='myPreferencesMenuPage';profile.className='userPreferencesPage';
  const staleLink=f.document.createElement('button');staleLink.setAttribute('data-fx-settings-link','true');profile.append(staleLink);
  f.document.body.append(profile);f.document.getElementById('indexPage').classList.add('hide');
  f.navigate('#/mypreferencesmenu');await f.settle();
  assert.equal(profile.querySelector('[data-fx-settings-link]'),null);
  await f.ctx.window.FazFortDiscovery.openSettings();
  await f.settle();assert.ok(f.document.querySelector('#fx-customize'));
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
  track.dispatchEvent(new f.ctx.document.defaultView.Event('scrollend'));
  assert.equal(track.scrollLeft,cw);
  let lastScrollBy=null;
  track.scrollBy=opts=>{lastScrollBy=opts;};
  track.scrollLeft=cw*2+40;
  shelf.querySelectorAll('.fx-row-head button')[1].click();
  assert.equal(track.scrollLeft,cw+40);
  assert.equal((track.scrollLeft + lastScrollBy.left) % 280, 0);
  f.ctx.window.FazFortDiscovery.stop();
});
test('React library pages without pageTabContent mount discovery, customize dropdown views, and support dedicated search page and instant boot rows',async()=>{
  const f=fixture();await f.settle();
  const bootRaw=f.storage.get('fazfort-discovery:boot:v2:s:u:home::home');
  assert.ok(bootRaw);
  const bootParsed=JSON.parse(bootRaw);
  assert.ok(bootParsed.rows.length>=3);
  assert.ok(bootParsed.shuffle);

  const proxy=f.document.createElement('div');proxy.setAttribute('data-sleekfin-header-proxy','true');
  const searchBtn=f.document.createElement('button');searchBtn.setAttribute('data-sleekfin-header-proxy-item','jellyfin:search');
  const leavingSoonBtn=f.document.createElement('button');leavingSoonBtn.setAttribute('data-sleekfin-header-proxy-item','jellyfin:view:leaving');leavingSoonBtn.textContent='Movies (Leaving Soon)';
  proxy.append(searchBtn,leavingSoonBtn);f.document.body.prepend(proxy);

  const viewsMod={u:[{path:'/movies',views:[{index:0,label:'Movies',view:'Movies'}]},{path:'/tv',views:[{index:0,label:'Series',view:'Series'}]}]};
  const mapMod={A:{movies:{0:{}},tvshows:{0:{}},boxsets:{0:{}}}};
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
  assert.equal(mapMod.A.movies[0].isAlphabetPickerEnabled,false);
  assert.equal(mapMod.A.movies[1].viewType,'suggestions');
  assert.deepEqual([...mapMod.A.movies[1].sectionsView.suggestionSections],[]);
  assert.equal(mapMod.A.movies[1].sectionsView.isMovieRecommendations,false);
  assert.equal(mapMod.A.movies[1].isPaginationEnabled,false);
  assert.equal(mapMod.A.movies[4].viewType,'suggestions');
  assert.deepEqual([...mapMod.A.movies[4].sectionsView.suggestionSections],[]);
  assert.equal(mapMod.A.movies[4].isPaginationEnabled,false);
  assert.equal(mapMod.A.tvshows[0].isAlphabetPickerEnabled,false);
  assert.equal(mapMod.A.tvshows[1].viewType,'suggestions');
  assert.deepEqual([...mapMod.A.tvshows[1].sectionsView.suggestionSections],[]);
  assert.equal(mapMod.A.tvshows[1].isPaginationEnabled,false);
  assert.equal(mapMod.A.tvshows[3].viewType,'suggestions');
  assert.deepEqual([...mapMod.A.tvshows[3].sectionsView.suggestionSections],[]);
  assert.equal(mapMod.A.tvshows[3].isPaginationEnabled,false);
  assert.equal(leavingSoonBtn.getAttribute('data-fx-leaving-hidden'),'true');
  assert.equal(leavingSoonBtn.style.display,'none');
  assert.equal(mapMod.A.tvshows[2].viewType,'favorites');
  assert.equal(mapMod.A.tvshows[2].collectionType,'tvshows');
  assert.deepEqual([...mapMod.A.tvshows[2].itemType],['Series']);
  assert.equal(mapMod.A.tvshows[2].isBtnPlayAllEnabled,false);
  assert.equal(mapMod.A.tvshows[2].isBtnShuffleEnabled,false);
  assert.equal(mapMod.A.tvshows[2].isAlphabetPickerEnabled,false);
  assert.equal(mapMod.A.tvshows[2].isAlphaPickerEnabled,false);

  const detailPage=f.document.createElement('div');detailPage.id='itemDetailPage';
  const detailTitle=f.document.createElement('h1');detailTitle.className='itemName';detailTitle.textContent='Weapons';
  detailPage.append(detailTitle);f.document.body.append(detailPage);
  const dlBtn=f.document.createElement('button');dlBtn.className='btnDownload';dlBtn.setAttribute('data-id','movie-weapons');
  f.document.body.append(dlBtn);
  dlBtn.click();
  const dlMenu=f.document.querySelector('.fx-download-menu.is-open');
  assert.ok(dlMenu);
  const dlLinks=[...dlMenu.querySelectorAll('button.fx-download-option')];
  assert.equal(dlLinks[0].textContent,'Full Quality');
  assert.equal(dlLinks[0].getAttribute('download'),'Weapons.mp4');
  assert.ok(dlLinks[0].dataset.downloadUrl.includes('/Videos/movie-weapons/stream.mp4'));
  assert.ok(dlLinks[0].dataset.downloadUrl.includes('Static=true'));
  assert.equal(dlLinks[1].textContent,'Condensed');
  assert.equal(dlLinks[1].getAttribute('download'),'Weapons.mp4');
  assert.ok(dlLinks[1].dataset.downloadUrl.includes('Static=false'));
  assert.ok(dlLinks[1].dataset.downloadUrl.includes('MaxHeight=720'));
  assert.ok(dlLinks[1].dataset.downloadUrl.includes('VideoBitRate=1600000'));
  const nativeDownloaded=[];
  f.ctx.window.NativeShell={downloadFiles:items=>{nativeDownloaded.push(...items);}};
  dlLinks[1].click();
  await f.settle();
  assert.equal(nativeDownloaded.length,1);
  assert.equal(nativeDownloaded[0].filename,'Weapons.mp4');
  assert.equal(nativeDownloaded[0].item?.Container,'mp4');
  assert.equal(nativeDownloaded[0].item?.Path,'Weapons.mp4');
  assert.ok(nativeDownloaded[0].url.includes('VideoBitRate=1600000'));
  assert.equal(f.document.querySelector('.fx-toast.is-visible')?.textContent,'Added to Jellyfin Downloads');

  const prevGetJson=f.api.getJSON;
  const prevGetUrl=f.api.getUrl;
  f.api.getUrl=(p,q)=>q?`/${p}?${new URLSearchParams(q).toString()}`:`/${p}`;
  f.api.getJSON=async reqUrl=>{
    if(String(reqUrl).includes('Items/movie-weapons'))return {Id:'movie-weapons',Name:'Weapons',Container:'mkv',MediaSources:[{Id:'ms1',Container:'mkv',MediaStreams:[{Type:'Video',Codec:'h264'},{Type:'Audio',Codec:'eac3'}]}]};
    return prevGetJson({p:String(reqUrl).replace(/^\//,'')});
  };
  dlBtn.click();
  await f.settle();
  const mobileDlMenu=f.document.querySelector('.fx-download-menu.is-open');
  assert.ok(mobileDlMenu);
  const mobileDlLinks=[...mobileDlMenu.querySelectorAll('button.fx-download-option')];
  assert.ok(mobileDlLinks[0].dataset.downloadUrl.includes('Static=false'));
  assert.ok(mobileDlLinks[0].dataset.downloadUrl.includes('AllowVideoStreamCopy=true'));
  mobileDlLinks[0].click();
  await f.settle();
  assert.equal(nativeDownloaded.length,2);
  assert.ok(nativeDownloaded[1].url.includes('AllowVideoStreamCopy=true'));
  assert.equal(nativeDownloaded[1].item?.Container,'mp4');
  assert.equal(nativeDownloaded[1].item?.MediaSources?.[0]?.Container,'mp4');
  f.api.getJSON=prevGetJson;
  f.api.getUrl=prevGetUrl;
  delete f.ctx.window.NativeShell;

  const seasonWrap=f.document.createElement('div');seasonWrap.className='sleekfin-details-season-select';
  const seasonSel=f.document.createElement('select');
  const opt1=f.document.createElement('option');opt1.value='s1';opt1.textContent='Season 1';
  const opt2=f.document.createElement('option');opt2.value='s2';opt2.textContent='Season 2';
  seasonSel.append(opt1,opt2);seasonWrap.append(seasonSel);f.document.body.append(seasonWrap);
  seasonWrap.click();
  const seasonMenu=f.document.querySelector('.fx-season-menu.is-open');
  assert.ok(seasonMenu);
  const seasonBtns=[...seasonMenu.querySelectorAll('.fx-season-option')];
  assert.equal(seasonBtns.length,2);
  seasonBtns[1].click();
  assert.equal(seasonSel.value,'s2');

  searchBtn.click();
  assert.equal(f.location.hash,'#/search');
  assert.notEqual(searchBtn.style.display,'none');
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
test('count chip and curated-tab attributes toggle on curated routes, clear active docspinner, and CSS configures responsive even loginPage rows',async()=>{
  const f=fixture();await f.settle();
  const cssText=f.document.getElementById('fx-discovery-style')?.textContent||'';
  assert.ok(cssText.includes('#loginPage:is(.hide,.hidePage,[hidden])'));
  assert.ok(cssText.includes('#loginPage:not(.hide):not(.hidePage):not([hidden])'));
  assert.ok(cssText.includes(':has(#divUsers > .card:nth-child(6):last-child)'));
  assert.ok(cssText.includes(':has(#divUsers > .card:nth-child(7):last-child)'));
  assert.ok(cssText.includes(':has(#divUsers > .card:nth-child(8):last-child)'));
  assert.ok(cssText.includes(':has(#divUsers > .card:nth-child(9):last-child)'));
  assert.ok(cssText.includes('--fx-login-cols:5'));
  assert.ok(cssText.includes('#searchPage#searchPage .searchResults .verticalSection > :is(h2,.sectionTitle,.sectionTitle-cards)'));
  assert.ok(cssText.includes('padding-block:0!important'));
  assert.ok(cssText.includes('[data-fx-leaving-hidden="true"]'));
  assert.ok(cssText.includes('html[data-fx-hide-count-chip="true"]'));
  assert.ok(cssText.includes('html[data-fx-curated-tab="true"] :is(.docspinner,.mdl-spinner.docspinner)'));
  assert.ok(cssText.includes('html[data-fx-curated-tab="true"] header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root > :not(button[aria-controls="library-view-menu"]):not(#library-view-menu)'));

  const spinner=f.document.createElement('div');
  spinner.className='docspinner mdl-spinner mdlSpinnerActive is-active';
  f.document.body.append(spinner);

  assert.equal(f.document.documentElement.getAttribute('data-fx-hide-count-chip'),'true');
  assert.equal(f.document.documentElement.hasAttribute('data-fx-curated-tab'),false);

  f.navigate('#/movies?tab=1');
  assert.equal(f.document.documentElement.getAttribute('data-fx-hide-count-chip'),'true');
  assert.equal(f.document.documentElement.getAttribute('data-fx-curated-tab'),'true');
  assert.equal(spinner.classList.contains('mdlSpinnerActive'),false);
  assert.equal(spinner.classList.contains('is-active'),false);

  spinner.classList.add('mdlSpinnerActive');
  f.navigate('#/tv?tab=3');
  assert.equal(f.document.documentElement.getAttribute('data-fx-hide-count-chip'),'true');
  assert.equal(f.document.documentElement.getAttribute('data-fx-curated-tab'),'true');
  assert.equal(spinner.classList.contains('mdlSpinnerActive'),false);

  f.navigate('#/movies?tab=4');
  assert.equal(f.document.documentElement.getAttribute('data-fx-hide-count-chip'),'true');
  assert.equal(f.document.documentElement.getAttribute('data-fx-curated-tab'),'true');

  f.navigate('#/movies?tab=0');
  assert.equal(f.document.documentElement.hasAttribute('data-fx-hide-count-chip'),false);
  assert.equal(f.document.documentElement.hasAttribute('data-fx-curated-tab'),false);

  f.navigate('#/movies?tab=2');
  assert.equal(f.document.documentElement.hasAttribute('data-fx-hide-count-chip'),false);
  assert.equal(f.document.documentElement.hasAttribute('data-fx-curated-tab'),false);

  f.navigate('#/boxsets');
  assert.equal(f.document.documentElement.hasAttribute('data-fx-hide-count-chip'),false);
  assert.equal(f.document.documentElement.hasAttribute('data-fx-curated-tab'),false);

  f.navigate('#/tv?tab=1');
  assert.equal(f.document.documentElement.getAttribute('data-fx-curated-tab'),'true');

  f.ctx.window.FazFortDiscovery.stop();
  assert.equal(f.document.documentElement.hasAttribute('data-fx-hide-count-chip'),false);
  assert.equal(f.document.documentElement.hasAttribute('data-fx-curated-tab'),false);
  assert.equal(f.document.documentElement.hasAttribute('data-fx-home-mode'),false);
});

test('Settings consolidates Customize Home inside Settings -> Home, styles Display settings, adds mobile bottom Search & SVG Settings, and locks OSD playback without pause or iOS fullscreen',async()=>{
  const f=fixture();await f.settle();
  const cssText=f.document.getElementById('fx-discovery-style')?.textContent||'';
  assert.ok(cssText.includes('header.MuiAppBar-root:has(> .MuiToolbar-root + .MuiToolbar-root)'));
  assert.ok(cssText.includes('.card:not(.sleekfin-details-episode) :is(button.cardOverlayButton[data-action="menu"]'));
  assert.ok(cssText.includes('#itemDetailPage .mainDetailButtons.sleekfin-details-actions'));
  assert.ok(cssText.includes('#displayPreferencesPage button[type="submit"]'));
  assert.ok(cssText.includes('#homeScreenPreferencesPage .fx-inline-studio'));
  assert.ok(cssText.includes('#videoOsdPage:not(.hide):not(.hidePage):not([hidden])'));
  assert.ok(cssText.includes('#itemDetailPage:not(.hide):not(.hidePage):not([hidden])'));
  assert.ok(cssText.includes('.fx-osd-gesture-pill[data-pos="top"].is-visible'));
  assert.ok(cssText.includes('.fx-osd-gesture-pill[data-pos="right"].is-visible'));

  const firstShelf=f.document.querySelector('.fx-shelf');
  assert.equal(firstShelf?.dataset?.shelfKey,'ContinueWatchingNextUp');

  f.document.getElementById('indexPage').classList.add('hide');

  const menuPage=f.document.createElement('div');menuPage.id='myPreferencesMenuPage';menuPage.className='page userPreferencesPage';
  const section=f.document.createElement('div');section.className='verticalSection';
  const profileRow=f.document.createElement('a');profileRow.className='listItem-border';profileRow.setAttribute('href','#/mypreferencesprofile');profileRow.textContent='Profile';
  const homeRow=f.document.createElement('a');homeRow.className='listItem-border';homeRow.setAttribute('href','#/mypreferenceshome');homeRow.textContent='Home';
  const playbackRow=f.document.createElement('a');playbackRow.className='listItem-border';playbackRow.setAttribute('href','#/mypreferencesplayback');playbackRow.textContent='Playback';
  section.append(profileRow,homeRow,playbackRow);menuPage.append(section);f.document.body.append(menuPage);

  f.navigate('#/mypreferencesmenu');await f.settle();
  assert.equal(section.querySelector('[data-fx-settings-link]'),null);

  menuPage.classList.add('hide');
  const homePref=f.document.createElement('div');homePref.id='homeScreenPreferencesPage';homePref.className='page homeScreenPreferencesPage';
  const readOnly=f.document.createElement('div');readOnly.className='readOnlyContent';
  const form=f.document.createElement('form');
  const leavingViewItem=f.document.createElement('div');leavingViewItem.className='viewItem';leavingViewItem.textContent='Movies (Leaving Soon)';
  const normalViewItem=f.document.createElement('div');normalViewItem.className='viewItem';normalViewItem.textContent='Movies';
  form.append(leavingViewItem,normalViewItem);readOnly.append(form);homePref.append(readOnly);f.document.body.append(homePref);

  f.navigate('#/mypreferenceshome');await f.settle();
  const inlineStudio=readOnly.querySelector('[data-fx-home-studio="true"]');
  assert.ok(inlineStudio);
  assert.ok(inlineStudio.classList.contains('fx-inline-studio'));
  assert.equal(inlineStudio.querySelector('.fx-home-studio-head.verticalSection h1')?.textContent,'Customize Home');
  assert.ok(inlineStudio.querySelector('.fx-home-studio-save.verticalSection'));
  assert.ok(inlineStudio.querySelector('.fx-visual-editor'));
  assert.ok(form.closest('details.fx-legacy-home-settings'));
  assert.equal(leavingViewItem.getAttribute('data-fx-leaving-hidden'),'true');
  assert.equal(leavingViewItem.style.display,'none');
  assert.equal(normalViewItem.getAttribute('data-fx-leaving-hidden'),null);

  const proxy=f.document.createElement('div');proxy.setAttribute('data-sleekfin-header-proxy','true');
  const homeTab=f.document.createElement('button');homeTab.setAttribute('data-sleekfin-header-proxy-item','jellyfin:home');
  const overflowToggle=f.document.createElement('button');overflowToggle.setAttribute('data-sleekfin-header-overflow-toggle','true');
  proxy.append(homeTab,overflowToggle);f.document.body.append(proxy);

  const drawer=f.document.createElement('div');drawer.setAttribute('data-sleekfin-header-overflow-drawer','true');
  const drawerList=f.document.createElement('div');
  const colBtn=f.document.createElement('button');colBtn.setAttribute('data-sleekfin-header-overflow-item','jellyfin:view:collections');colBtn.textContent='Collections';
  const searchBtn=f.document.createElement('button');searchBtn.setAttribute('data-sleekfin-header-overflow-item','jellyfin:search');searchBtn.textContent='Search';
  drawerList.append(colBtn,searchBtn);drawer.append(drawerList);f.document.body.append(drawer);

  f.navigate('#/home');await f.settle();
  const mobileSearchBtn=proxy.querySelector('[data-fx-mobile-search="true"]');
  assert.ok(mobileSearchBtn);
  assert.equal(mobileSearchBtn.nextElementSibling,overflowToggle);
  assert.ok(mobileSearchBtn.querySelector('svg'));
  mobileSearchBtn.click();
  assert.equal(f.location.hash,'#/search');

  const overflowSettings=drawer.querySelector('[data-fx-overflow-settings="true"]');
  assert.ok(overflowSettings);
  assert.equal(overflowSettings.getAttribute('data-sleekfin-header-overflow-full'),'true');
  assert.ok(overflowSettings.querySelector('.fx-overflow-svg-icon svg'));
  assert.equal(overflowSettings.nextElementSibling,searchBtn);
  menuPage.classList.remove('hide');
  overflowSettings.click();
  assert.equal(f.location.hash,'#/mypreferencesmenu');

  f.ctx.window.NativeShell={};
  const osd=f.document.createElement('div');osd.id='videoOsdPage';osd.className='page';
  const video=f.document.createElement('video');video.className='htmlvideoplayer';
  video.currentTime=20;video.duration=120;video.playbackRate=1;
  let videoPaused=false;
  let playCalls=0;
  let enteredNativeFs=false;
  video.play=()=>{videoPaused=false;playCalls++;return Promise.resolve();};
  video.webkitEnterFullscreen=()=>{enteredNativeFs=true;};
  Object.defineProperty(video,'paused',{configurable:true,get:()=>videoPaused});
  osd.append(video);f.document.body.append(osd);
  f.ctx.window.innerWidth=400;

  const fireTouch=(type,x,y)=>{
    const ev=new f.ctx.document.defaultView.Event(type,{bubbles:true,cancelable:true});
    const pt={clientX:x,clientY:y};
    Object.defineProperties(ev,{
      touches:{value:type==='touchend'?[]:[pt]},
      changedTouches:{value:[pt]}
    });
    video.dispatchEvent(ev);
    return ev;
  };

  fireTouch('touchstart',320,180);
  const dragEv=fireTouch('touchmove',320,240);
  assert.equal(dragEv.defaultPrevented,true);
  fireTouch('touchend',320,180);

  fireTouch('touchstart',320,180);
  fireTouch('touchend',320,180);
  fireTouch('touchstart',322,182);
  fireTouch('touchend',322,182);
  assert.equal(video.currentTime,30);
  assert.equal(f.document.querySelector('.fx-osd-gesture-pill.is-visible')?.textContent,'+10s ▸▸');
  assert.equal(video.playsInline,true);
  video.webkitEnterFullscreen();
  assert.equal(enteredNativeFs,false);

  const dblEv=new f.ctx.document.defaultView.Event('dblclick',{bubbles:true,cancelable:true});
  video.dispatchEvent(dblEv);
  assert.equal(dblEv.defaultPrevented,true);

  fireTouch('touchstart',324,180);
  fireTouch('touchend',324,180);
  assert.equal(video.currentTime,40);
  assert.equal(f.document.querySelector('.fx-osd-gesture-pill.is-visible')?.textContent,'+20s ▸▸');

  fireTouch('touchstart',60,180);
  fireTouch('touchend',60,180);
  fireTouch('touchstart',62,182);
  fireTouch('touchend',62,182);
  assert.equal(video.currentTime,30);
  assert.equal(f.document.querySelector('.fx-osd-gesture-pill.is-visible')?.textContent,'◂◂ -10s');

  fireTouch('touchstart',360,180);
  f.flushTimeouts(320);
  assert.equal(video.playbackRate,2);
  assert.equal(f.document.querySelector('.fx-osd-gesture-pill.is-visible')?.textContent,'2× Speed ▸▸');
  videoPaused=true;
  const playCallsBefore=playCalls;
  video.dispatchEvent(new f.ctx.document.defaultView.Event('pause'));
  assert.ok(playCalls>playCallsBefore);
  assert.equal(videoPaused,false);
  const holdDrag=fireTouch('touchmove',360,260);
  assert.equal(holdDrag.defaultPrevented,true);
  assert.equal(video.playbackRate,2);
  fireTouch('touchend',360,180);
  assert.equal(video.playbackRate,1);

  fireTouch('touchstart',40,180);
  f.flushTimeouts(320);
  assert.equal(video.playbackRate,2);
  fireTouch('touchend',40,180);
  assert.equal(video.playbackRate,1);

  delete f.ctx.window.NativeShell;
  f.ctx.window.FazFortDiscovery.stop();
});

test('patchApiClientLeavingSoon filters Leaving Soon libraries and child items from getUserViews and getItems',async()=>{
  const f=fixture();await f.settle();
  const leavingViewId='5ebc3f61ab8138bcfac3c68317a6be0b';
  const leavingMovieId='deadbeefdeadbeefdeadbeefdeadbeef';
  delete f.api._fxLeavingPatched;
  const origGetItems=f.api.getItems;
  f.api.getItems=async(uid,opts)=>{
    if(opts?.ParentId===leavingViewId)return {Items:[{Id:leavingMovieId,Name:'Expiring Film',Type:'Movie'}],TotalRecordCount:1};
    return {Items:[{Id:leavingMovieId,Name:'Expiring Film',Type:'Movie'},{Id:id(1),Name:'Kept Film',Type:'Movie'}],TotalRecordCount:2};
  };
  f.api.getUserViews=async()=>({
    Items:[
      {Id:'m',Name:'Movies',CollectionType:'movies'},
      {Id:leavingViewId,Name:'Movies (Leaving Soon)',CollectionType:'movies'}
    ],
    TotalRecordCount:2
  });
  f.ctx.window.FazFortDiscovery.restart();await f.settle();
  const views=await f.api.getUserViews('u');
  assert.deepEqual(views.Items.map(v=>v.Id),['m']);
  await f.settle();
  const listed=await f.api.getItems('u',{IncludeItemTypes:'Movie'});
  assert.deepEqual(listed.Items.map(i=>i.Id),[id(1)]);
  f.api.getItems=origGetItems;
  f.ctx.window.FazFortDiscovery.stop();
});
