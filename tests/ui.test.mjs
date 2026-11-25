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
  const {window,document}=parseHTML('<html><head></head><body><div id="indexPage" class="page"><div class="hero">Keep hero</div><div class="homeSectionsContainer"><div class="card" data-id="'+id(2)+'"><div class="cardScalable"></div></div></div></div><div id="moviesPage" class="page hide"><div class="pageTabContent" data-index="0"><p>Original movie list</p></div></div><div id="tvshowsPage" class="page hide"><div class="pageTabContent" data-index="0">Original shows</div></div></body></html>');
  let timeouts=[],nextTimerId=1,frames=[],mutation,intersect,requests=0,resolver,focused=document.body;
  const listeners=new Map();
  Object.defineProperty(document,'activeElement',{configurable:true,get:()=>focused});
  window.HTMLElement.prototype.focus=function(){focused=this;};
  window.HTMLElement.prototype.scrollIntoView=function(){};
  const storage=new Map();
  const api={ajax:async options=>{const body=JSON.parse(options.data);saves.push(body);config=body.Config;return {Version:saves.length};},getCurrentUserId:()=> 'u',serverId:()=> 's',getImageUrl:(i,o)=>`https://example.test/Items/${i}/Images/${o.type}`,getUrl:(p,q)=>({p,q}),getJSON:async ({p,q})=>{
    if(p==='FazFortDiscovery/Preferences')return {Version:saves.length,Config:config};
    if(p==='FazFortDiscovery/Tracking')return {Ready:true,Records:Object.fromEntries(fixtureItems.map(i=>[i.Id,{AddedAt:new Date().toISOString()}]))};
    if(p==='FazFortDiscovery/Ratings'){
      const ids=String(q?.Ids||'').split(',').filter(Boolean);
      return {Ratings:Object.fromEntries(ids.map((itemId)=>{const norm=itemId.replace(/-/g,'').toLowerCase();const even=parseInt(norm.slice(-4),16)%2===0;return [norm,{criticScore:even?94:42,criticState:even?'certified':'rotten',audienceScore:even?91:48,audienceState:even?'hot':'spilled',source:'rt',pending:false}];}))};
    }
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
test('one-way anchored endless scroll locks left start at Item 1 and expands rightward endlessly',async()=>{
  const f=fixture();await f.settle();const shelf=f.document.querySelector('.fx-shelf'),track=shelf.querySelector('.fx-track'),wrap=shelf.querySelector('.fx-track-wrap');
  const [backBtn,fwdBtn]=shelf.querySelectorAll('.fx-row-head button');
  assert.ok(wrap);
  assert.equal(wrap.dataset.fxScrollStart,'true');
  assert.equal(backBtn.disabled,true);
  // Clicking back at start must NOT wrap backward to the end of the list
  track.scrollLeft=0;
  backBtn.click();
  assert.equal(track.scrollLeft,0);
  // TV remote ArrowLeft at index 0 stays at index 0 (no backward wrap)
  f.storage.set('fazfort-discovery:controls:s:u','tv');const cards=track.querySelectorAll('.fx-card');
  cards[0].focus();f.key(cards[0],'ArrowLeft',37);assert.equal(f.document.activeElement,cards[0]);
  f.key(cards[0],'ArrowRight',39);assert.equal(f.document.activeElement,cards[1]);
  f.ctx.window.FazFortDiscovery.stop();
});
test('default native categories are hidden immediately on mount before async inventory resolves',async()=>{
  const f=fixture({delay:true});
  assert.equal(f.document.querySelector('.homeSectionsContainer').getAttribute('data-fx-hero-anchor'),'true');
  assert.equal(f.document.querySelector('.homeSectionsContainer .card').getAttribute('data-fx-native-hidden'),'true');
  f.resolve();await f.settle();f.ctx.window.FazFortDiscovery.stop();
});
test('horizontal track starts anchored at Item 1, dynamically appends rightward cycles on scroll, and walks left back to 0',async()=>{
  const f=fixture();await f.settle();
  const shelf=f.document.querySelector('.fx-shelf'),track=shelf.querySelector('.fx-track'),wrap=shelf.querySelector('.fx-track-wrap');
  const [backBtn,fwdBtn]=shelf.querySelectorAll('.fx-row-head button');
  const initialCount=track.children.length;
  const clones=track.querySelectorAll('[data-loop-clone]');
  assert.ok(clones.length>0);
  const baseCount=initialCount-clones.length;
  const layoutOffsets=()=>{
    [...track.children].forEach((child,idx)=>{Object.defineProperty(child,'offsetLeft',{configurable:true,value:idx*280});});
    Object.defineProperty(track,'scrollWidth',{configurable:true,value:track.children.length*280});
  };
  Object.defineProperty(track,'clientWidth',{configurable:true,value:800});
  layoutOffsets();
  // Scrolling near right edge dynamically appends another full loop cycle without teleporting scrollLeft
  const cw=baseCount*280;
  track.scrollLeft=track.scrollWidth-800;
  track.dispatchEvent(new f.ctx.document.defaultView.Event('scroll'));
  layoutOffsets();
  assert.ok(track.children.length>=initialCount+baseCount,'must append new cycle on rightward scroll');
  assert.equal(wrap.dataset.fxScrollStart,'false');
  assert.equal(backBtn.disabled,false);
  // Clicking forward snaps cleanly to card alignment; clicking back walks toward 0 without ever jumping past 0
  let lastScrollBy=null;
  track.scrollBy=opts=>{lastScrollBy=opts;track.scrollLeft=Math.max(0,track.scrollLeft+(opts.left||0));};
  fwdBtn.click();
  assert.ok(lastScrollBy && lastScrollBy.left>0);
  assert.equal(track.scrollLeft%280,0);
  track.scrollLeft=280;
  backBtn.click();
  assert.equal(track.scrollLeft,0);
  track.dispatchEvent(new f.ctx.document.defaultView.Event('scroll'));
  assert.equal(wrap.dataset.fxScrollStart,'true');
  assert.equal(backBtn.disabled,true);
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
  assert.ok(cssText.includes('html[data-fx-curated-tab="true"] :is(.docspinner,.mdl-spinner.docspinner'));
  assert.ok(cssText.includes('html:root .sleekfin-menu-host'));
  assert.ok(cssText.includes('#filter-popover .sleekfin-menu-popup'));
  assert.ok(cssText.includes('.fx-subpage-back-top'));
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

  // When native SleekFin search button is visible in the top bar (e.g. half-screen desktop), never duplicate search icon
  const nativeSearchBtn=f.document.createElement('button');
  nativeSearchBtn.setAttribute('data-sleekfin-header-proxy-item','jellyfin:search');
  proxy.insertBefore(nativeSearchBtn,overflowToggle);
  f.navigate('#/home');await f.settle();
  assert.equal(proxy.querySelector('[data-fx-mobile-search="true"]'),null);
  nativeSearchBtn.remove();

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

test('category subpages open all matching items on heading click, unified search grid ranks title then tags without episodes, filter popover supports year range & reset, and dropdowns stay stationary on scroll',async()=>{
  const f=fixture();await f.settle();

  // 1. Unified dropdown, half-width top spacing, thinner filter popover & stationary scroll CSS
  const styleText=f.document.getElementById('fx-discovery-style')?.textContent||'';
  assert.ok(styleText.includes('overflow-y:auto!important'));
  assert.ok(styleText.includes('--Paper-overlay:none!important'));
  assert.ok(styleText.includes('width:216px!important'));
  assert.ok(styleText.includes('.MuiPopover-root .MuiAccordionSummary-root'));
  assert.ok(styleText.includes('.MuiPopover-root .MuiAccordionDetails-root'));
  assert.ok(styleText.includes('--fx-popover-scroll-y'));
  assert.ok(styleText.includes('.fx-download-menu{\n  position:absolute;'));

  // 2. Late .pageTabContent[data-index="1"] insertion on #moviesPage does NOT tear down or swap mounted shelves, and clicking a category heading opens all uncapped matching items (>20)
  const moviesPage=f.document.getElementById('moviesPage');
  moviesPage.replaceChildren();
  f.document.getElementById('indexPage').classList.add('hide');
  moviesPage.classList.remove('hide');
  f.navigate('#/movies?tab=1');
  await f.settle();
  const mountedRoot=moviesPage.querySelector('.fx-discovery');
  const initialRowKeys=[...mountedRoot.querySelectorAll('.fx-shelf')].map(n=>n.dataset.shelfKey);
  assert.ok(initialRowKeys.length>=3);
  const lateTab=f.document.createElement('div');
  lateTab.className='pageTabContent is-active';
  lateTab.dataset.index='1';
  moviesPage.append(lateTab);
  f.notify();
  f.flushTimeouts(120);
  await f.settle();
  assert.equal(moviesPage.querySelector('.fx-discovery'),mountedRoot);
  assert.deepEqual([...mountedRoot.querySelectorAll('.fx-shelf')].map(n=>n.dataset.shelfKey),initialRowKeys);
  assert.equal(lateTab.getAttribute('data-fx-native-hidden'),'true');

  const themeShelf=[...mountedRoot.querySelectorAll('.fx-shelf')].find(n=>(n.dataset.shelfKey||'').startsWith('rule:'));
  assert.ok(themeShelf);
  const shelfKey=themeShelf.dataset.shelfKey;
  const heading=themeShelf.querySelector('.fx-row-head h2.fx-clickable-heading');
  assert.ok(heading);
  const expectedTitle=heading.textContent;
  heading.click();
  await f.settle();
  const subpage=mountedRoot.querySelector('.fx-subpage');
  assert.ok(subpage);
  assert.equal(f.document.documentElement.getAttribute('data-fx-subpage'),'true');
  assert.ok(f.location.hash.includes('fxCat='));
  assert.ok(subpage.querySelector('.fx-subpage-back-top'));
  assert.equal(subpage.querySelector('.fx-subpage-title')?.textContent,expectedTitle);
  assert.equal(subpage.querySelector('.fx-subpage-end')?.textContent,"You've reached the bottom of the page! Congratulations!");
  const subpageCards=subpage.querySelectorAll('.fx-subpage-grid .fx-card');
  assert.equal(subpageCards.length,30);

  // Navigating to a movie detail page and back to the category subpage keeps parent carousels hidden and resolves real title & items
  const subpageHash=f.location.hash;
  f.navigate('#/details?id=m0&serverId=s1');
  await f.settle();
  f.navigate(subpageHash);
  await f.settle();
  const returnedRoot=moviesPage.querySelector('.fx-discovery');
  const returnedSub=returnedRoot.querySelector('.fx-subpage');
  assert.ok(returnedSub);
  assert.equal(returnedSub.querySelector('.fx-subpage-title')?.textContent,expectedTitle);
  assert.equal(returnedSub.querySelectorAll('.fx-subpage-grid .fx-card').length,30);
  assert.equal(returnedRoot.querySelector('.fx-footer')?.hidden,true);
  assert.equal(returnedRoot.querySelector('.fx-subpage-back')?.classList.contains('fx-subpage-back-top'),true);
  assert.equal(returnedSub.dataset.subpageKey,shelfKey);

  returnedSub.querySelector('.fx-subpage-back').click();
  await f.settle();
  assert.equal(returnedRoot.querySelector('.fx-subpage'),null);
  assert.equal(f.document.documentElement.getAttribute('data-fx-subpage'),null);
  assert.equal(returnedRoot.querySelector('.fx-footer button')?.hidden,true);

  // 4. Unified #searchPage "Results for "xxx"" library grid ranks title hits first, then tag hits, and skips Episodes
  moviesPage.classList.add('hide');
  const searchPage=f.document.createElement('div');
  searchPage.id='searchPage';
  searchPage.className='page';
  const searchFields=f.document.createElement('div');
  searchFields.className='searchFields';
  const searchInp=f.document.createElement('input');
  searchInp.id='searchTextInput';
  searchInp.type='search';
  searchFields.append(searchInp);
  const searchSuggestions=f.document.createElement('div');
  searchSuggestions.className='searchSuggestions';
  searchPage.append(searchFields,searchSuggestions);
  f.document.body.append(searchPage);
  f.navigate('#/search');
  await f.settle();

  searchInp.value='space';
  searchInp.dispatchEvent(new f.ctx.document.defaultView.Event('input',{bubbles:true}));
  f.flushTimeouts(110);
  f.flushTimeouts(220);
  await f.settle();
  assert.equal(searchPage.getAttribute('data-fx-search-active'),'true');
  const searchLib=searchPage.querySelector('.fx-search-library');
  assert.ok(searchLib);
  assert.equal(searchLib.hidden,false);
  assert.equal(searchLib.querySelector('.fx-search-library-title')?.textContent,'Results for "space"');
  const gridCards=searchLib.querySelectorAll('.fx-search-library-grid .fx-card');
  assert.equal(gridCards.length,45); // all 45 Movie + Series fixture items carry the 'space' tag, uncapped!

  searchInp.value='';
  searchInp.dispatchEvent(new f.ctx.document.defaultView.Event('input',{bubbles:true}));
  assert.equal(searchPage.hasAttribute('data-fx-search-active'),false);
  assert.equal(searchLib.hidden,true);

  // 5. Filter popover strips Tags, auto-mirrors Year -> End Year, supports range override, Reset filters, and anchors scrollY
  f.ctx.window.scrollY=340;
  let filterState={StartIndex:0,Filters:{Genres:['Action']}};
  const filterPop=f.document.createElement('div');
  filterPop.id='filter-popover';
  filterPop.className='MuiPopover-root';
  const filterPaper=f.document.createElement('div');
  filterPaper.className='MuiPaper-root';
  const tagsAcc=f.document.createElement('div');
  tagsAcc.className='MuiAccordion-root';
  const tagsHdr=f.document.createElement('div');
  tagsHdr.id='filtersTags-header';
  tagsAcc.append(tagsHdr);
  const yearsContent=f.document.createElement('div');
  yearsContent.id='filtersYears-content';
  const yearsDetails=f.document.createElement('div');
  yearsDetails.className='MuiAccordionDetails-root';
  yearsContent.append(yearsDetails);
  filterPaper.append(tagsAcc,yearsContent);
  filterPop.append(filterPaper);
  filterPaper.__reactFiber$unit={
    return:{
      memoizedProps:{
        get libraryViewSettings(){return filterState;},
        yearsOptions:[2012,2014,2015,2016,2018,2020].map(y=>({Name:String(y),Value:y})),
        setLibraryViewSettings:updater=>{
          filterState=typeof updater==='function'?updater(filterState):updater;
        }
      }
    }
  };
  f.document.body.append(filterPop);
  f.notify();
  f.frames();
  assert.equal(filterPop.dataset.fxAnchoredOpen,'true');
  assert.equal(tagsAcc.style.display,'none');
  const fromYear=filterPaper.querySelector('.fx-year-from');
  const toYear=filterPaper.querySelector('.fx-year-to');
  const resetBtn=filterPaper.querySelector('.fx-filter-reset-btn');
  assert.ok(fromYear&&toYear&&resetBtn);
  assert.equal(resetBtn.classList.contains('is-active'),true);

  fromYear.value='2014';
  fromYear.dispatchEvent(new f.ctx.document.defaultView.Event('input',{bubbles:true}));
  assert.equal(toYear.value,'2014'); // Automatically mirrored!
  f.flushTimeouts(150);
  assert.deepEqual([...filterState.Filters.Years],[2014]);

  toYear.value='2018';
  toYear.dispatchEvent(new f.ctx.document.defaultView.Event('input',{bubbles:true}));
  f.flushTimeouts(150);
  assert.deepEqual([...filterState.Filters.Years],[2014,2015,2016,2018]);

  resetBtn.click();
  assert.deepEqual([...Object.keys(filterState.Filters)],[]);
  assert.equal(fromYear.value,'');
  assert.equal(toYear.value,'');

  f.ctx.window.FazFortDiscovery.stop();
});

test('v0.5.9 fixes actionSheet freeze, filter Studios/Years draft, SleekFin user menu, Live TV, OSD settings & keyboard skip', async () => {
  const f = fixture();
  await f.settle();
  const styleText = f.document.getElementById('fx-discovery-style')?.textContent || '';

  // 1. Freeze fix: .sleekfin-menu-host rule must NOT disable settle animation
  const hostRuleMatch = styleText.match(/html:root \.sleekfin-menu-host[\s\S]*?\{[\s\S]*?\}/);
  assert.ok(hostRuleMatch, 'expected .sleekfin-menu-host CSS rule');
  assert.equal(/animation\s*:\s*none/i.test(hostRuleMatch[0]), false, '.sleekfin-menu-host must preserve animationend');

  // 2. CSS hides Studios, unconditionally hides Years checkboxes, hides SleekFin user settings, sets pointer cursor, and hides OSD clutter
  assert.ok(styleText.includes('#filtersStudios-header'));
  assert.ok(styleText.includes('#filtersYears-content .MuiFormGroup-root'));
  assert.ok(styleText.includes('[data-sleekfin-user-settings-link="true"]'));
  assert.ok(styleText.includes('[data-sleekfin-header-proxy] :is(button,a,[role="button"])'));
  assert.ok(styleText.includes('.sliderMarkerContainer'));
  assert.ok(styleText.includes('.btnPreviousChapter'));
  assert.ok(styleText.includes('.btnRewind'));
  assert.ok(styleText.includes('.btnAudio'));
  assert.ok(styleText.includes('.btnUserRating'));

  // 3. Filter popover hides Tags + Studios, preserves partial year draft across re-sync, and supports era preset chips
  let filterState = { StartIndex: 0, Filters: {} };
  const filterPop = f.document.createElement('div');
  filterPop.id = 'filter-popover';
  filterPop.className = 'MuiPopover-root';
  const filterPaper = f.document.createElement('div');
  filterPaper.className = 'MuiPaper-root';
  const studiosAcc = f.document.createElement('div');
  studiosAcc.className = 'MuiAccordion-root';
  const studiosHdr = f.document.createElement('div');
  studiosHdr.id = 'filtersStudios-header';
  studiosAcc.append(studiosHdr);
  const yearsContent = f.document.createElement('div');
  yearsContent.id = 'filtersYears-content';
  const nativeGroup = f.document.createElement('div');
  nativeGroup.className = 'MuiFormGroup-root';
  const cb = f.document.createElement('input');
  cb.type = 'checkbox';
  nativeGroup.append(cb);
  const yearsDetails = f.document.createElement('div');
  yearsDetails.className = 'MuiAccordionDetails-root';
  yearsDetails.append(nativeGroup);
  yearsContent.append(yearsDetails);
  filterPaper.append(studiosAcc, yearsContent);
  filterPop.append(filterPaper);
  filterPaper.__reactFiber$unit = {
    return: {
      memoizedProps: {
        get libraryViewSettings() { return filterState; },
        yearsOptions: [1995, 2010, 2012, 2015, 2019, 2022].map(y => ({ Name: String(y), Value: y })),
        setLibraryViewSettings: updater => { filterState = typeof updater === 'function' ? updater(filterState) : updater; }
      }
    }
  };
  f.document.body.append(filterPop);
  f.notify();
  f.frames();
  assert.equal(studiosAcc.style.display, 'none');
  assert.equal(nativeGroup.style.display, 'none');
  const fromYear = filterPaper.querySelector('.fx-year-from');
  const toYear = filterPaper.querySelector('.fx-year-to');
  fromYear.value = '201';
  fromYear.dispatchEvent(new f.ctx.document.defaultView.Event('input', { bubbles: true }));
  // Trigger another popover sync while draft is incomplete — must NOT wipe the partial input!
  f.notify();
  f.frames();
  assert.equal(fromYear.value, '201');
  const chip2010s = [...filterPaper.querySelectorAll('.fx-year-chip')].find(b => b.textContent === '2010s');
  assert.ok(chip2010s);
  chip2010s.click();
  assert.deepEqual([...filterState.Filters.Years], [2010, 2012, 2015, 2019]);
  assert.equal(chip2010s.classList.contains('is-active'), true);
  filterPop.remove();

  // 4. SleekFin user settings link hidden in Profile menu
  const userMenu = f.document.createElement('div');
  userMenu.id = 'app-user-menu';
  const sfLink = f.document.createElement('a');
  sfLink.setAttribute('data-sleekfin-user-settings-link', 'true');
  sfLink.textContent = 'SleekFin';
  const sfPopup = f.document.createElement('div');
  sfPopup.className = 'sleekfin-menu-popup';
  const sfClone = f.document.createElement('button');
  sfClone.className = 'sleekfin-menu-item';
  sfClone.textContent = 'SleekFin';
  sfPopup.append(sfClone);
  userMenu.append(sfLink, sfPopup);
  f.document.body.append(userMenu);
  f.notify();
  f.frames();
  assert.equal(sfLink.style.display, 'none');
  assert.equal(sfClone.style.display, 'none');
  userMenu.remove();

  // 5. Live TV header click navigates directly without drawer & renders unified .fx-livetv-bar
  const proxy = f.document.createElement('div');
  proxy.setAttribute('data-sleekfin-header-proxy', 'true');
  const liveTvBtn = f.document.createElement('button');
  liveTvBtn.setAttribute('data-sleekfin-header-proxy-item', 'source:v1:164f41b42f7a4221084a13ce51114045');
  liveTvBtn.textContent = 'Live TV';
  proxy.append(liveTvBtn);
  const drawer = f.document.createElement('div');
  drawer.className = 'mainDrawer drawer-open';
  f.document.body.append(proxy, drawer);
  const liveTvPage = f.document.createElement('div');
  liveTvPage.id = 'liveTvSuggestedPage';
  liveTvPage.className = 'page';
  f.document.body.append(liveTvPage);
  const clickEv = new f.ctx.document.defaultView.Event('click', { bubbles: true, cancelable: true });
  liveTvBtn.dispatchEvent(clickEv);
  assert.equal(clickEv.defaultPrevented, true);
  assert.equal(drawer.classList.contains('drawer-open'), false);
  assert.equal(f.ctx.location.hash, '#/livetv');
  await f.settle();
  const liveBar = liveTvPage.querySelector('.fx-livetv-bar');
  assert.ok(liveBar);
  assert.equal(liveBar.querySelector('.fx-livetv-title')?.textContent, 'Live TV');
  const guideTabBtn = [...liveBar.querySelectorAll('.fx-livetv-tab')].find(b => b.textContent === 'Guide');
  assert.ok(guideTabBtn);
  guideTabBtn.click();
  assert.ok(f.ctx.location.hash.includes('tab=1'));
  liveTvPage.classList.add('hide');
  proxy.remove();
  drawer.remove();

  // 6. Video playback OSD: ArrowRight/ArrowLeft ±30s keyboard seek + YouTube-style overlay + Settings menu Audio/Favorites injection
  const osd = f.document.createElement('div');
  osd.id = 'videoOsdPage';
  osd.className = 'page';
  const video = f.document.createElement('video');
  video.className = 'htmlvideoplayer';
  video.currentTime = 100;
  Object.defineProperty(video, 'duration', { value: 600, configurable: true });
  let audioClicked = 0;
  let favClicked = 0;
  const audioBtn = f.document.createElement('button');
  audioBtn.className = 'btnAudio';
  audioBtn.addEventListener('click', () => { audioClicked++; });
  const favBtn = f.document.createElement('button');
  favBtn.className = 'btnUserRating';
  favBtn.addEventListener('click', () => { favClicked++; });
  osd.append(video, audioBtn, favBtn);
  f.document.body.append(osd);

  const KeyEv = f.ctx.document.defaultView.KeyboardEvent || f.ctx.document.defaultView.Event;
  const pressArrow = key => {
    const ev = new KeyEv('keydown', { key, bubbles: true, cancelable: true });
    if (!ev.key) Object.defineProperty(ev, 'key', { value: key });
    f.document.dispatchEvent(ev);
  };
  pressArrow('ArrowRight');
  assert.equal(video.currentTime, 130);
  const skipOverlay = f.document.querySelector('.fx-osd-skip-overlay');
  assert.ok(skipOverlay);
  assert.equal(skipOverlay.dataset.dir, 'right');
  assert.equal(skipOverlay.querySelector('.fx-osd-skip-label')?.textContent, '+30s');
  pressArrow('ArrowRight');
  assert.equal(video.currentTime, 160);
  assert.equal(skipOverlay.querySelector('.fx-osd-skip-label')?.textContent, '+60s');
  pressArrow('ArrowLeft');
  assert.equal(video.currentTime, 130);
  assert.equal(skipOverlay.dataset.dir, 'left');
  assert.equal(skipOverlay.querySelector('.fx-osd-skip-label')?.textContent, '-30s');

  // Inject Audio & Add to Favorites into Playback Settings actionSheet
  const sheet = f.document.createElement('div');
  sheet.className = 'dialog actionSheet sleekfin-menu-host';
  const scroller = f.document.createElement('div');
  scroller.className = 'actionSheetScroller';
  const qualityItem = f.document.createElement('button');
  qualityItem.className = 'actionSheetMenuItem';
  qualityItem.setAttribute('data-id', 'quality');
  qualityItem.textContent = 'Quality';
  scroller.append(qualityItem);
  const sheetPopup = f.document.createElement('div');
  sheetPopup.className = 'sleekfin-menu-popup';
  const qClone = f.document.createElement('button');
  qClone.className = 'sleekfin-menu-item';
  qClone.textContent = 'Quality';
  sheetPopup.append(qClone);
  sheet.append(scroller, sheetPopup);
  f.document.body.append(sheet);
  f.notify();
  f.frames();

  const injectedAudio = sheetPopup.querySelector('[data-fx-osd-menu-item="fx-osd-audio"]');
  const injectedFav = sheetPopup.querySelector('[data-fx-osd-menu-item="fx-osd-favorite"]');
  assert.ok(injectedAudio, 'Audio item injected into SleekFin OSD Settings popup');
  assert.ok(injectedFav, 'Favorites item injected into SleekFin OSD Settings popup');
  injectedAudio.click();
  f.flushTimeouts(45);
  assert.equal(audioClicked, 1);
  injectedFav.click();
  f.flushTimeouts(30);
  assert.equal(favClicked, 1);

  // 7. Request Hub modal fade-in keyframes present
  const rhSrc = await readFile(new URL('../requests/web.js', import.meta.url), 'utf8');
  assert.ok(rhSrc.includes('@keyframes rh-overlay-in'));
  assert.ok(rhSrc.includes('@keyframes rh-dialog-in'));

  f.ctx.window.FazFortDiscovery.stop();
});

test('v0.5.10 eliminates Filters duplicate reset flicker, auto-focus icon brightening, OSD settings placement/opacity, and Settings menu hover box', async () => {
  const f = fixture();
  await f.settle();
  const styleText = f.document.getElementById('fx-discovery-style')?.textContent || '';

  // 1. CSS checks: .sleekfin-menu-host opacity/transition guard, auto-focus icon suppression, higher OSD opacity, single-layer Settings buttons
  assert.ok(styleText.includes('opacity:1!important;\n  transform:none!important;\n  transition:none!important;'));
  assert.ok(styleText.includes('rgba(15,16,20,.97)'));
  assert.ok(styleText.includes('@keyframes fx-dropdown-enter-up'));
  assert.ok(styleText.includes('.sleekfin-menu-item:focus:not(:hover):not(:focus-visible):not([data-selected="true"]) .sleekfin-menu-icon'));
  assert.ok(styleText.includes(':is(#myPreferencesMenuPage,.userPreferencesPage) .listItem-border > .listItem:hover'));

  // 2. When sleekfin-main-ui is active, Reset filters waits for .sleekfin-menu-popup (never double-clones into .MuiPaper-root)
  f.document.documentElement.classList.add('sleekfin-main-ui');
  const filterPop = f.document.createElement('div');
  filterPop.id = 'filter-popover';
  filterPop.className = 'MuiPopover-root';
  const filterPaper = f.document.createElement('div');
  filterPaper.className = 'MuiPaper-root';
  filterPop.append(filterPaper);
  f.document.body.append(filterPop);
  f.notify();
  f.frames();
  assert.equal(filterPaper.querySelector('.fx-filter-footer'), null, 'must not mount footer before .sleekfin-menu-popup exists');

  const sleekPopup = f.document.createElement('div');
  sleekPopup.className = 'sleekfin-menu-popup';
  const strayReset = f.document.createElement('button');
  strayReset.className = 'sleekfin-menu-item';
  strayReset.textContent = 'Reset filters';
  sleekPopup.append(strayReset);
  filterPaper.append(sleekPopup);
  f.notify();
  f.frames();
  assert.equal(strayReset.style.display, 'none');
  assert.equal(sleekPopup.querySelectorAll('.fx-filter-footer').length, 1);
  filterPop.remove();
  f.document.documentElement.classList.remove('sleekfin-main-ui');

  // 3. Playback Settings popup positions above .btnVideoOsdSettings gear icon
  const osd = f.document.createElement('div');
  osd.id = 'videoOsdPage';
  osd.className = 'page';
  const gearBtn = f.document.createElement('button');
  gearBtn.className = 'btnVideoOsdSettings';
  gearBtn.getBoundingClientRect = () => ({ left: 1120, right: 1160, top: 660, bottom: 700, width: 40, height: 40 });
  osd.append(gearBtn);
  f.document.body.append(osd);

  const sheet = f.document.createElement('div');
  sheet.className = 'dialog actionSheet sleekfin-menu-host';
  const popup = f.document.createElement('div');
  popup.className = 'sleekfin-menu-popup';
  popup.getBoundingClientRect = () => ({ left: 0, right: 220, top: 0, bottom: 200, width: 220, height: 200 });
  const qItem = f.document.createElement('button');
  qItem.className = 'sleekfin-menu-item';
  qItem.textContent = 'Quality';
  popup.append(qItem);
  sheet.append(popup);
  f.document.body.append(sheet);
  f.notify();
  f.frames();

  assert.equal(sheet.dataset.fxOsdSettings, 'true');
  assert.equal(popup.dataset.fxOsdSettings, 'true');
  const bottomVar = f.document.documentElement.style.getPropertyValue('--fx-osd-popup-bottom');
  assert.ok(bottomVar && parseInt(bottomVar, 10) >= 56, `expected --fx-osd-popup-bottom set above gear (${bottomVar})`);

  f.ctx.window.FazFortDiscovery.stop();
});

test('v0.5.11 fixes playback Back tap vs swipe lock, Frame-0 Settings/Subtitles anchor, Playback info overlay, Search spacer & mobile portrait play button', async () => {
  const f = fixture();
  await f.settle();
  const styleText = f.document.getElementById('fx-discovery-style')?.textContent || '';

  // 1. CSS checks: Frame-0 bottom-anchored OSD popups, Playback info (.playerStats), Back button 48px target, Search AppBar spacer removal, mobile portrait play button hide
  assert.ok(styleText.includes('bottom:var(--fx-osd-popup-bottom,74px)!important'));
  assert.ok(styleText.includes('.playerStats:not(.hide)'));
  assert.ok(styleText.includes('z-index:100025!important'));
  assert.ok(styleText.includes('html[data-fx-video-osd="true"] .skinHeader .headerBackButton'));
  assert.ok(styleText.includes('html[data-fx-search-page="true"] header.MuiAppBar-root + div[aria-hidden="true"]'));
  assert.ok(styleText.includes('button.cardOverlayFab-primary'));

  // 2. #searchPage toggles data-fx-search-page attribute on documentElement
  const sp = f.document.createElement('div');
  sp.id = 'searchPage';
  sp.className = 'page';
  f.document.body.append(sp);
  f.notify();
  f.frames();
  assert.equal(f.document.documentElement.getAttribute('data-fx-search-page'), 'true');
  sp.classList.add('hide');
  f.notify();
  f.frames();
  assert.equal(f.document.documentElement.hasAttribute('data-fx-search-page'), false);
  sp.remove();

  // 3. Subtitles & Settings button pointerdown updates Frame-0 anchor CSS variables before popup opens
  const osd = f.document.createElement('div');
  osd.id = 'videoOsdPage';
  osd.className = 'page';
  const subBtn = f.document.createElement('button');
  subBtn.className = 'btnSubtitles';
  subBtn.getBoundingClientRect = () => ({ left: 1060, right: 1100, top: 650, bottom: 690, width: 40, height: 40 });
  const skinHdr = f.document.createElement('div');
  skinHdr.className = 'skinHeader';
  const backBtn = f.document.createElement('button');
  backBtn.className = 'headerBackButton';
  skinHdr.append(backBtn);
  osd.append(subBtn);
  f.document.body.append(skinHdr, osd);
  f.notify();
  f.frames();

  const Ev = f.ctx.document.defaultView.Event;
  subBtn.dispatchEvent(new Ev('pointerdown', { bubbles: true, cancelable: true }));
  assert.ok(parseInt(f.document.documentElement.style.getPropertyValue('--fx-osd-popup-bottom'), 10) >= 60);
  assert.ok(parseInt(f.document.documentElement.style.getPropertyValue('--fx-osd-popup-right'), 10) >= 12);

  // 4. Touch jitter (<=14px) on .headerBackButton is NOT prevented so Back taps register, while vertical swipe on video IS prevented
  const mkTouch = (type, target, x, y) => {
    const ev = new Ev(type, { bubbles: true, cancelable: true });
    Object.defineProperty(ev, 'touches', { value: [{ clientX: x, clientY: y }] });
    Object.defineProperty(ev, 'target', { value: target });
    return ev;
  };
  backBtn.dispatchEvent(mkTouch('touchstart', backBtn, 24, 24));
  const jitterMove = mkTouch('touchmove', backBtn, 27, 29);
  backBtn.dispatchEvent(jitterMove);
  assert.equal(jitterMove.defaultPrevented, false, 'small tap jitter on Back button must not cancel click');
  const bigSwipe = mkTouch('touchmove', backBtn, 24, 60);
  backBtn.dispatchEvent(bigSwipe);
  assert.equal(bigSwipe.defaultPrevented, true, 'vertical swipe > 14px must be blocked');

  osd.dispatchEvent(mkTouch('touchstart', osd, 200, 300));
  const videoTapJitter = mkTouch('touchmove', osd, 203, 304);
  osd.dispatchEvent(videoTapJitter);
  assert.equal(videoTapJitter.defaultPrevented, false, 'small tap jitter on video canvas must allow single-tap OSD toggle');
  const videoSwipe = mkTouch('touchmove', osd, 200, 260);
  osd.dispatchEvent(videoSwipe);
  assert.equal(videoSwipe.defaultPrevented, true, 'vertical swipe on video canvas must be blocked');

  // 5. v0.5.12 stacking order keeps .videoPlayerContainer beneath #videoOsdPage without trapping .mainAnimatedPages
  assert.equal(styleText.includes('html[data-fx-video-osd="true"] .mainAnimatedPages'), false);
  assert.ok(styleText.includes('html[data-fx-video-osd="true"] .videoPlayerContainer{\n  position:fixed!important;\n  inset:0!important;\n  z-index:0!important;'));
  assert.ok(styleText.includes('#videoOsdPage:not(.hide):not(.hidePage):not([hidden]){\n  position:fixed!important;\n  inset:0!important;\n  z-index:10!important;'));

  // 6. Structural webpack patch survives module ID renumbering (Jellyfin 10.12+ resilience)
  const renumberedViews = [
    { path: '/movies', views: [{ index: 0, label: 'Movies', view: 'movies' }] },
    { path: '/tv', views: [{ index: 0, label: 'Shows', view: 'series' }] }
  ];
  const renumberedMap = {
    movies: { 0: { collectionType: 'movies', isBtnPlayAllEnabled: true, isAlphabetPickerEnabled: true } },
    tvshows: { 0: { collectionType: 'tvshows', isBtnPlayAllEnabled: true, isAlphabetPickerEnabled: true } }
  };
  const fakeReq = Object.assign(() => ({}), {
    m: {},
    c: {
      99901: { exports: { viewsList: renumberedViews } },
      99902: { exports: { configMap: renumberedMap } }
    }
  });
  f.ctx.window._fxWebpackReq = fakeReq;
  f.navigate('#/movies?tab=1');
  await f.settle();
  assert.equal(renumberedViews[0].views[0].label, 'Movies');
  assert.equal(renumberedViews[0].views[1].label, 'Library');
  assert.equal(renumberedMap.movies[0].isBtnPlayAllEnabled, false);
  assert.equal(renumberedMap.movies[0].isAlphabetPickerEnabled, false);

  f.ctx.window.FazFortDiscovery.stop();
});

test('v0.6.0 adds Movies/Shows hero banner, noisy ambient BG + tuner, RT Tomatometer/Popcornmeter ratings, origin modals, smart three-dots, SyncPlay/Cast anchoring, paused Playback Info fix, and volume wheel/mute memory', async () => {
  const f = fixture();
  await f.settle();
  const Ev = f.ctx.document.defaultView.Event;
  const styleText = f.document.getElementById('fx-discovery-style')?.textContent || '';

  // 1. Baked permanent static scrollable ambient textured background (no temporary BG tuner, no animations)
  assert.equal(f.document.documentElement.getAttribute('data-fx-ambient-bg'), 'true');
  assert.equal(f.document.querySelector('.fx-bg-tuner'), null, 'temporary background tuner removed in v0.6.2');
  assert.equal(f.document.querySelector('.fx-ambient-bg'), null, 'static canvas CSS background needs no fixed overlay node');
  assert.ok(styleText.includes('--fx-bg-base:#0a0b0f;'), 'baked base color #0a0b0f');
  assert.ok(styleText.includes('rgba(50,56,70,.67)'), 'baked glow1 #323846 at 67%');
  assert.ok(styleText.includes('rgba(34,38,48,.67)'), 'baked glow2 #222630 at 67%');
  assert.ok(styleText.includes("opacity='0.12'"), 'baked noise opacity 12%');
  assert.ok(styleText.includes('290px 290px'), 'baked noise size 290px');
  assert.ok(styleText.includes('background-attachment:scroll!important;'), 'background scrolls statically with page');
  assert.equal(styleText.includes('fx-ambient-drift'), false, 'no background drift animation');

  // 2. Movies & Shows Hero Banner appears ONLY on curated Movies & Shows tabs, NEVER on Library, Genres, or category subpages
  f.document.getElementById('indexPage').classList.add('hide');
  const moviesPage = f.document.getElementById('moviesPage');
  moviesPage.classList.remove('hide');
  for (const idx of [1, 4]) {
    const tab = f.document.createElement('div');
    tab.className = 'pageTabContent';
    tab.dataset.index = String(idx);
    moviesPage.append(tab);
  }
  f.navigate('#/movies?tab=1');
  await f.settle();
  assert.equal(f.document.documentElement.getAttribute('data-fx-page-hero'), 'true');
  const hero = moviesPage.querySelector('.fx-page-hero');
  assert.ok(hero && hero.querySelectorAll('.fx-page-hero-slide').length >= 1, 'Movies hero banner rendered');
  // Tomatometer shows on hero, Popcornmeter NEVER shows on hero
  assert.ok(hero.querySelector('.fx-rating-tomatometer'), 'Tomatometer badge on Movies hero');
  assert.equal(hero.querySelector('.fx-rating-popcornmeter'), null, 'Popcornmeter must NOT appear on hero banner');
  // Hidden on Library (tab=0) and Genres (tab=4)
  f.navigate('#/movies?tab=0');
  await f.settle();
  assert.equal(f.document.documentElement.hasAttribute('data-fx-page-hero'), false);
  f.navigate('#/movies?tab=4');
  await f.settle();
  assert.equal(f.document.documentElement.hasAttribute('data-fx-page-hero'), false);
  assert.equal(moviesPage.querySelector('.fx-page-hero'), null);

  // 3. Detail Page (#itemDetailPage) shows BOTH Tomatometer & Popcornmeter (Certified Fresh + Verified Hot), and respects plugin ratings settings
  const detailPage = f.document.createElement('div');
  detailPage.id = 'itemDetailPage';
  detailPage.className = 'page';
  const detailScore = f.document.createElement('span');
  detailScore.className = 'sleekfin-details-score';
  detailScore.textContent = '8.4';
  const infoBtn = f.document.createElement('button');
  infoBtn.className = 'sleekfin-details-track-settings';
  infoBtn.getBoundingClientRect = () => ({ left: 420, right: 464, top: 380, bottom: 424, width: 44, height: 44 });
  const moreBtn = f.document.createElement('button');
  moreBtn.className = 'btnMoreCommands';
  moreBtn.getBoundingClientRect = () => ({ left: 500, right: 544, top: 680, bottom: 724, width: 44, height: 44 });
  detailPage.append(detailScore, infoBtn, moreBtn);
  f.document.body.append(detailPage);
  f.navigate(`#/details?id=${id(2)}`);
  await f.settle();
  f.notify();
  f.frames();
  await f.settle();
  assert.ok(detailScore.querySelector('.fx-rating-tomatometer.is-certified'), 'Certified Fresh Tomatometer on detail page');
  assert.ok(detailScore.querySelector('.fx-rating-popcornmeter.is-hot'), 'Verified Hot Popcornmeter on detail page');
  assert.equal(detailScore.querySelector('.fx-rating-star'), null, 'Star rating hidden by default when RT mode is active');

  // 4. Ratings toggle in visual editor saves custom combination (e.g. Star Rating only / None)
  moviesPage.classList.add('hide');
  detailPage.classList.add('hide');
  f.document.getElementById('indexPage').classList.remove('hide');
  f.navigate('#/home');
  await f.settle();
  [...f.document.querySelectorAll('.fx-toolbar button')].find(b => b.textContent === 'Customize').click();
  const dlg = f.document.querySelector('#fx-customize');
  assert.ok(dlg.classList.contains('fx-modal-origin-anim') || dlg.dataset.fxOriginAnimated === 'true', 'Customize dialog tracks origin animation');
  [...dlg.querySelectorAll('button')].find(b => b.textContent === 'Star Rating').click();
  const draftCfg = JSON.parse(dlg.querySelector('textarea').value);
  assert.deepEqual(draftCfg.ratings, { tomatometer: false, popcornmeter: false, stars: true });
  [...dlg.querySelectorAll('button')].find(b => b.textContent === 'Cancel').click();

  // 5. Origin-morphing Info modal on detail page
  detailPage.classList.remove('hide');
  infoBtn.dispatchEvent(new Ev('pointerdown', { bubbles: true }));
  const infoWrap = f.document.createElement('div');
  infoWrap.className = 'sleekfin-details-info-container';
  const infoDlg = f.document.createElement('div');
  infoDlg.className = 'dialog sleekfin-details-track-dialog';
  infoWrap.append(infoDlg);
  f.document.body.append(infoWrap);
  f.notify();
  f.frames();
  assert.equal(infoDlg.dataset.fxOriginAnimated, 'true');
  assert.ok(infoDlg.style.getPropertyValue('--fx-origin-x') !== '');
  infoWrap.remove();

  // 6. Smart-positioned Detail Three-Dots (...) menu: places ABOVE when button is near bottom of viewport, or SIDE when cramped
  moreBtn.dispatchEvent(new Ev('pointerdown', { bubbles: true }));
  const moreSheet = f.document.createElement('div');
  moreSheet.className = 'dialog actionSheet';
  const morePopup = f.document.createElement('div');
  morePopup.className = 'sleekfin-menu-popup';
  morePopup.textContent = 'Add to collection Refresh metadata';
  Object.defineProperties(morePopup, { offsetWidth: { value: 220 }, scrollHeight: { value: 260 }, offsetHeight: { value: 260 } });
  moreSheet.append(morePopup);
  f.document.body.append(moreSheet);
  f.notify();
  f.frames();
  assert.equal(morePopup.dataset.fxDetailMore, 'true');
  assert.equal(morePopup.dataset.fxMorePlace, 'top', 'places above three dots when bottom space is insufficient');
  moreSheet.remove();

  // 7. Playback OSD: SyncPlay & Cast anchor directly below their top-header buttons, Playback Info triggers timeupdate while paused, wheel volume is blocked, and Mute sets slider to 0 & restores saved volume
  detailPage.classList.add('hide');
  const skinHeader = f.document.createElement('div');
  skinHeader.className = 'skinHeader';
  const hdrRight = f.document.createElement('div');
  hdrRight.className = 'headerRight';
  const syncBtn = f.document.createElement('button');
  syncBtn.className = 'headerSyncPlayButton';
  syncBtn.getBoundingClientRect = () => ({ left: 1120, right: 1160, top: 12, bottom: 52, width: 40, height: 40 });
  hdrRight.append(syncBtn);
  skinHeader.append(hdrRight);

  const osd = f.document.createElement('div');
  osd.id = 'videoOsdPage';
  osd.className = 'page';
  const video = f.document.createElement('video');
  video.className = 'htmlvideoplayer';
  video.volume = 0.75;
  video.muted = false;
  let timeupdateCount = 0;
  video.addEventListener('timeupdate', () => { timeupdateCount++; });
  const muteBtn = f.document.createElement('button');
  muteBtn.className = 'buttonMute';
  muteBtn.innerHTML = '<span class="material-icons volume_up"></span>';
  const volSlider = f.document.createElement('input');
  volSlider.className = 'osdVolumeSlider';
  volSlider.type = 'range';
  volSlider.value = '75';
  osd.append(video, muteBtn, volSlider);
  f.document.body.append(skinHeader, osd);
  f.notify();
  f.frames();

  // SyncPlay button anchors popup at top below SyncPlay button (NOT bottom!)
  syncBtn.dispatchEvent(new Ev('pointerdown', { bubbles: true }));
  assert.equal(f.document.documentElement.getAttribute('data-fx-osd-anchor'), 'top');
  assert.equal(f.document.documentElement.style.getPropertyValue('--fx-header-popup-top'), '60px');
  const spSheet = f.document.createElement('div');
  spSheet.className = 'dialog actionSheet';
  spSheet.textContent = 'Create a new group';
  f.document.body.append(spSheet);
  f.notify();
  f.frames();
  assert.equal(spSheet.dataset.fxHeaderAnchored, 'true');
  spSheet.remove();

  // Paused Playback Info (.playerStats) receives synthetic timeupdate so stats populate immediately
  const stats = f.document.createElement('div');
  stats.className = 'playerStats';
  const statsBody = f.document.createElement('div');
  statsBody.className = 'playerStats-stats';
  stats.append(statsBody);
  f.document.body.append(stats);
  f.notify();
  f.frames();
  assert.ok(timeupdateCount >= 1, 'synthetic timeupdate dispatched to wake paused Playback Info');
  stats.remove();

  // Scroll wheel over volume bar is blocked during playback
  const wheelEv = new Ev('wheel', { bubbles: true, cancelable: true });
  volSlider.dispatchEvent(wheelEv);
  assert.equal(wheelEv.defaultPrevented, true, 'wheel event blocked over volume slider during playback');

  // Mute sets slider to 0 & mutes; Unmute restores saved volume (75) using Jellyfin's cubic volume curve; Dragging slider > 0 unmutes
  muteBtn.click();
  assert.equal(volSlider.value, '0');
  assert.equal(video.muted, true);
  assert.equal(video.volume, 0);
  muteBtn.click();
  assert.equal(volSlider.value, '75');
  assert.equal(video.muted, false);
  assert.ok(Math.abs(video.volume - Math.pow(0.75, 3)) < 1e-6, 'restored volume matches Jellyfin cubic curve');
  muteBtn.click();
  assert.equal(volSlider.value, '0');
  volSlider.value = '40';
  volSlider.dispatchEvent(new Ev('input', { bubbles: true }));
  assert.equal(video.muted, false, 'dragging volume scrubber > 0 automatically unmutes');
  assert.ok(Math.abs(video.volume - Math.pow(0.4, 3)) < 1e-6, 'slider drag matches Jellyfin cubic curve (no rightward jump)');

  // Top volume bar toast CSS hidden + diagonal shimmer wave present
  assert.ok(styleText.includes('.volumeOsd'));
  assert.ok(styleText.includes('@keyframes fx-shimmer-wave'));

  f.ctx.window.FazFortDiscovery.stop();
  assert.equal(f.document.querySelector('.fx-ambient-bg'), null);
  assert.equal(f.document.querySelector('.fx-bg-tuner'), null);
});

test('v0.6.1 prevents microtask freeze when Ratings API is in-flight, pending, or returns errors', async () => {
  const f = fixture();
  let ratingsCalls = 0;
  let resolvePending = null;
  const origGetJSON = f.api.getJSON;
  f.api.getJSON = async req => {
    if (req.p === 'FazFortDiscovery/Ratings') {
      ratingsCalls++;
      return await new Promise(r => { resolvePending = r; });
    }
    return origGetJSON(req);
  };
  await f.settle();
  // Isolate from Home hero's initial ratings batch
  ratingsCalls = 0;
  resolvePending = null;
  const testSlideId = id(99);

  // Mount a SleekFin hero slide whose rating fetch stays in-flight
  const hero = f.document.createElement('div');
  hero.className = 'sleekfin-hero';
  const slide = f.document.createElement('section');
  slide.className = 'sleekfin-hero-slide';
  const link = f.document.createElement('a');
  link.setAttribute('href', `#/details?id=${testSlideId}`);
  const score = f.document.createElement('span');
  score.className = 'sleekfin-hero-score';
  score.textContent = '8.1';
  slide.append(link, score);
  hero.append(slide);
  f.document.getElementById('indexPage').prepend(hero);

  // Repeated observer/rAF ticks while Ratings request is in-flight must NOT spin microtasks or fire duplicate requests
  f.notify();
  f.frames();
  f.notify();
  f.frames();
  await f.settle();
  assert.equal(ratingsCalls, 1, 'only 1 Ratings call fired while in-flight');

  // Even when the response returns pending:true, cooldown prevents immediate microtask loop
  resolvePending({ Ratings: { [testSlideId]: { criticScore: 88, criticState: 'fresh', audienceScore: null, source: 'jellyfin', pending: true } } });
  await f.settle();
  f.notify();
  f.frames();
  await f.settle();
  assert.equal(ratingsCalls, 1, 'pending:true respects cooldown instead of looping synchronously');
  assert.ok(score.querySelector('.fx-rating-tomatometer'), 'fallback Tomatometer rendered immediately');

  f.ctx.window.FazFortDiscovery.stop();
});

test('v0.6.2 fixes transparent hero transitions, borderless hero title, unified arrows, non-flashing info modal, MUI SyncPlay/Cast top anchoring, symmetric OSD bar, and cubic volume accuracy', async () => {
  const f = fixture();
  await f.settle();
  const Ev = f.ctx.document.defaultView.Event;
  const styleText = f.document.getElementById('fx-discovery-style')?.textContent || '';

  // 1. Transparent hero bottom fades (Home SleekFin hero + Movies/Shows hero + Detail hero) & all-widths background visibility
  assert.ok(styleText.includes('html[data-fx-ambient-bg="true"] .sleekfin-hero-seam{\n  display:none!important;'));
  assert.ok(styleText.includes('html[data-fx-ambient-bg="true"].sleekfin-media-mounted body :is(#indexPage,#moviesPage,#tvshowsPage'));
  assert.ok(styleText.includes('overflow-x:clip;'));
  // Borderless hero title dropdown (no translucent box)
  assert.ok(styleText.includes('html[data-fx-page-hero="true"] header.MuiAppBar-root > .MuiToolbar-root + .MuiToolbar-root button[aria-controls="library-view-menu"]{\n  text-shadow:0 2px 14px rgba(0,0,0,.78)!important;\n  background:transparent!important;'));

  // 2. Hero side arrows match backpage arrow SVG & circular dark-glass styling
  f.document.getElementById('indexPage').classList.add('hide');
  const moviesPage = f.document.getElementById('moviesPage');
  moviesPage.classList.remove('hide');
  const tab1 = f.document.createElement('div');
  tab1.className = 'pageTabContent';
  tab1.dataset.index = '1';
  moviesPage.append(tab1);
  f.navigate('#/movies?tab=1');
  await f.settle();
  const prevArrow = moviesPage.querySelector('.fx-page-hero-prev svg');
  const nextArrow = moviesPage.querySelector('.fx-page-hero-next svg');
  assert.ok(prevArrow && prevArrow.innerHTML.includes('x1="19" y1="12" x2="5" y2="12"'), 'hero prev arrow matches backpage thin arrow');
  assert.ok(nextArrow && nextArrow.innerHTML.includes('x1="5" y1="12" x2="19" y2="12"'), 'hero next arrow matches mirrored backpage thin arrow');

  // 3. Playback top-left Back button CSS matches backpage arrow style & top-left position + bottom bar symmetric centering
  assert.ok(styleText.includes('.osdHeader .videoOsd-appBar > button:first-child'));
  assert.ok(styleText.includes('padding-bottom:calc(18px + env(safe-area-inset-bottom,0px))!important;'));
  assert.ok(styleText.includes('margin:0 0 8px 0!important;'));
  assert.ok(styleText.includes('#videoOsdPage .btnPause .material-icons{'));

  // 4. Info modal keeps .fx-modal-origin-anim after animationend (zero flash/reappear) and releases only on closing
  const infoBtn = f.document.createElement('button');
  infoBtn.getBoundingClientRect = () => ({ left: 400, right: 444, top: 360, bottom: 404, width: 44, height: 44 });
  f.document.body.append(infoBtn);
  infoBtn.dispatchEvent(new Ev('pointerdown', { bubbles: true }));
  const infoWrap = f.document.createElement('div');
  infoWrap.className = 'sleekfin-details-info-container';
  const infoDlg = f.document.createElement('div');
  infoDlg.className = 'dialog sleekfin-details-track-dialog';
  infoWrap.append(infoDlg);
  f.document.body.append(infoWrap);
  f.notify();
  f.frames();
  assert.equal(infoDlg.classList.contains('fx-modal-origin-anim'), true);
  infoDlg.dispatchEvent(new Ev('animationend', { bubbles: true }));
  f.flushTimeouts(400);
  assert.equal(infoDlg.classList.contains('fx-modal-origin-anim'), true, 'keeps origin class while open so Jellyfin open animation never replays');
  infoDlg.dispatchEvent(new Ev('closing', { bubbles: true }));
  assert.equal(infoDlg.classList.contains('fx-modal-origin-anim'), false, 'releases origin class cleanly on closing');
  infoWrap.remove();
  infoBtn.remove();

  // 5. Jellyfin 10.11 React .osdHeader / .videoOsd-appBar SyncPlay (#app-sync-play-menu) & Cast (#app-remote-play-menu) anchor below clicked button
  moviesPage.classList.add('hide');
  const osdHeader = f.document.createElement('div');
  osdHeader.className = 'skinHeader osdHeader';
  const appBar = f.document.createElement('div');
  appBar.className = 'MuiToolbar-root videoOsd-appBar';
  const backBtn = f.document.createElement('button');
  backBtn.setAttribute('aria-label', 'Back');
  const syncBtn = f.document.createElement('button');
  syncBtn.setAttribute('aria-controls', 'app-sync-play-menu');
  syncBtn.setAttribute('aria-label', 'SyncPlay');
  syncBtn.getBoundingClientRect = () => ({ left: 1120, right: 1160, top: 20, bottom: 60, width: 40, height: 40 });
  const castBtn = f.document.createElement('button');
  castBtn.setAttribute('aria-controls', 'app-remote-play-menu');
  castBtn.setAttribute('aria-label', 'Cast to device');
  castBtn.getBoundingClientRect = () => ({ left: 1170, right: 1210, top: 20, bottom: 60, width: 40, height: 40 });
  appBar.append(backBtn, syncBtn, castBtn);
  osdHeader.append(appBar);

  const osd = f.document.createElement('div');
  osd.id = 'videoOsdPage';
  osd.className = 'page';
  f.document.body.append(osdHeader, osd);
  f.notify();
  f.frames();

  // Clicking SyncPlay button in .videoOsd-appBar anchors #app-sync-play-menu below it
  syncBtn.dispatchEvent(new Ev('pointerdown', { bubbles: true }));
  assert.equal(f.document.documentElement.getAttribute('data-fx-osd-anchor'), 'top');
  assert.equal(f.document.documentElement.style.getPropertyValue('--fx-header-popup-top'), '68px');
  const syncMenu = f.document.createElement('div');
  syncMenu.id = 'app-sync-play-menu';
  syncMenu.className = 'MuiPopover-root MuiMenu-root';
  const syncPopup = f.document.createElement('div');
  syncPopup.className = 'sleekfin-menu-popup';
  syncPopup.textContent = 'Create a new group';
  syncMenu.append(syncPopup);
  f.document.body.append(syncMenu);
  f.notify();
  f.frames();
  assert.equal(syncPopup.dataset.fxHeaderAnchored, 'true');
  syncMenu.remove();

  // Clicking Cast button in .videoOsd-appBar anchors #app-remote-play-menu below it
  castBtn.dispatchEvent(new Ev('pointerdown', { bubbles: true }));
  assert.equal(f.document.documentElement.getAttribute('data-fx-osd-anchor'), 'top');
  const castMenu = f.document.createElement('div');
  castMenu.id = 'app-remote-play-menu';
  castMenu.className = 'MuiPopover-root MuiMenu-root';
  const castPopup = f.document.createElement('div');
  castPopup.className = 'sleekfin-menu-popup';
  castPopup.textContent = 'Play On My Device';
  castMenu.append(castPopup);
  f.document.body.append(castMenu);
  f.notify();
  f.frames();
  assert.equal(castPopup.dataset.fxHeaderAnchored, 'true');
  castMenu.remove();

  // Clicking Back button does NOT falsely set header anchor
  f.document.documentElement.setAttribute('data-fx-osd-anchor', 'bottom');
  backBtn.dispatchEvent(new Ev('pointerdown', { bubbles: true }));
  assert.equal(f.document.documentElement.getAttribute('data-fx-osd-anchor'), 'bottom');

  f.ctx.window.FazFortDiscovery.stop();
});

test('v0.6.3 unifies cached Home hero without Rated pill, moves AirPlay+Audio under Settings, fixes OSD buttons/header/focus ring, fixes three-dots overlap/visibility, removes hover underlines, hides native backdropContainer, and strips raw star text next to RT', async () => {
  const f = fixture();
  await f.settle();
  const Ev = f.ctx.document.defaultView.Event;
  const styleText = f.document.getElementById('fx-discovery-style')?.textContent || '';

  // 1. Unified cached Hero Banner mounts on Home page with Play/More Info pills, side arrows, dots nav, NO Rated pill, and caches to localStorage
  assert.equal(f.document.documentElement.getAttribute('data-fx-page-hero'), 'true');
  const homeHero = f.document.querySelector('#indexPage .fx-page-hero');
  assert.ok(homeHero, 'Home page mounts unified .fx-page-hero');
  assert.ok(homeHero.querySelector('.fx-page-hero-btn-primary'), 'Home hero has unified Play button');
  assert.ok(homeHero.querySelector('.fx-page-hero-btn-secondary'), 'Home hero has unified More Info button');
  assert.ok(homeHero.querySelector('.fx-page-hero-prev') && homeHero.querySelector('.fx-page-hero-next'), 'Home hero has side navigation arrows');
  assert.ok(homeHero.querySelectorAll('.fx-page-hero-dot').length >= 2, 'Home hero has dot navigation bar');
  assert.equal(homeHero.querySelector('.fx-page-hero-cert'), null, 'Rated pill removed from hero banner');
  const heroCacheRaw = f.storage.get('fazfort-discovery:hero:v1:s:u:home');
  assert.ok(heroCacheRaw && JSON.parse(heroCacheRaw).items.length >= 1, 'Home hero slides cached in localStorage');

  // Instant Frame-0 Home hero render from cache even before slow inventory returns
  const f2 = fixture();
  f2.storage.set('fazfort-discovery:hero:v1:s:u:home', heroCacheRaw);
  f2.api.getItems = () => new Promise(() => {});
  f2.ctx.window.FazFortDiscovery.restart();
  f2.flushTimeouts(120);
  const cachedHero = f2.document.querySelector('#indexPage .fx-page-hero');
  assert.ok(cachedHero && cachedHero.querySelectorAll('.fx-page-hero-slide').length >= 1, 'cached Home hero renders instantaneously before inventory finishes');
  f2.ctx.window.FazFortDiscovery.stop();

  // 2. CSS checks: no hover underlines, hidden native .backdropContainer, zero raw star text font-size, hidden .btnRecord/.btnAirPlay, no white focus circle, top bar aligned at 40px, and .dialogContainer contain:none
  assert.equal(styleText.includes('text-decoration:underline'), false, 'hover text underline completely removed');
  assert.ok(styleText.includes(':is(.backdropContainer,.backdropImage){\n  display:none!important;'), 'native backdropContainer hidden behind detail pages');
  assert.ok(styleText.includes('.sleekfin-details-score[data-fx-ratings-mounted="true"]{\n  font-size:0!important;'), 'raw star text node hidden cleanly next to RT score');
  assert.ok(styleText.includes('#videoOsdPage .videoOsdBottom :is(.hide,[hidden],.btnRecord,.btnPreviousTrack,.btnNextTrack,.btnPreviousChapter,.btnNextChapter,.btnRewind,.btnFastForward,.btnUserRating,.btnAudio,.btnAirPlay){\n  display:none!important;'));
  assert.ok(styleText.includes('#videoOsdPage .btnPause:focus-visible'));
  assert.ok(styleText.includes('html:root .dialogContainer:has(.sleekfin-menu-host)'));

  // 3. Playback Settings injects AirPlay alongside Audio & Favorites when available
  const osd = f.document.createElement('div');
  osd.id = 'videoOsdPage';
  osd.className = 'page';
  const audioBtn = f.document.createElement('button');
  audioBtn.className = 'btnAudio';
  let airPlayClicked = false;
  const airPlayBtn = f.document.createElement('button');
  airPlayBtn.className = 'btnAirPlay';
  airPlayBtn.addEventListener('click', () => { airPlayClicked = true; });
  const favBtn = f.document.createElement('button');
  favBtn.className = 'btnUserRating';
  const gearBtn = f.document.createElement('button');
  gearBtn.className = 'btnVideoOsdSettings';
  osd.append(audioBtn, airPlayBtn, favBtn, gearBtn);
  f.document.body.append(osd);

  const settingsSheet = f.document.createElement('div');
  settingsSheet.className = 'dialog actionSheet';
  const scroller = f.document.createElement('div');
  scroller.className = 'actionSheetScroller';
  const qItem = f.document.createElement('button');
  qItem.className = 'actionSheetMenuItem';
  qItem.setAttribute('data-id', 'quality');
  qItem.textContent = 'Quality';
  scroller.append(qItem);
  settingsSheet.append(scroller);
  f.document.body.append(settingsSheet);
  f.notify();
  f.frames();
  const injectedAirPlay = scroller.querySelector('[data-fx-osd-menu-item="fx-osd-airplay"]');
  assert.ok(injectedAirPlay, 'AirPlay moved into Playback Settings menu');
  assert.ok(scroller.querySelector('[data-fx-osd-menu-item="fx-osd-audio"]'), 'Audio present in Playback Settings menu');
  injectedAirPlay.click();
  assert.equal(airPlayClicked, true, 'clicking Settings -> AirPlay triggers native AirPlay button synchronously for Safari user gesture');
  settingsSheet.remove();
  osd.remove();

  // 4. Three-dots menu edge-anchors strictly BEYOND the button (never overlapping when placed above or left!)
  const detailPage = f.document.createElement('div');
  detailPage.id = 'itemDetailPage';
  detailPage.className = 'page';
  const moreBtn = f.document.createElement('button');
  moreBtn.className = 'btnMoreCommands';
  moreBtn.getBoundingClientRect = () => ({ left: 1180, right: 1224, top: 640, bottom: 684, width: 44, height: 44 });
  detailPage.append(moreBtn);
  f.document.body.append(detailPage);
  f.notify();
  f.frames();
  moreBtn.dispatchEvent(new Ev('pointerdown', { bubbles: true }));
  const moreSheet = f.document.createElement('div');
  moreSheet.className = 'dialog actionSheet sleekfin-menu-host';
  const morePopup = f.document.createElement('div');
  morePopup.className = 'sleekfin-menu-popup';
  for (let k = 0; k < 6; k++) {
    const it = f.document.createElement('button');
    it.className = 'sleekfin-menu-item';
    it.textContent = `Action ${k}`;
    morePopup.append(it);
  }
  Object.defineProperties(morePopup, { offsetWidth: { value: 220 }, scrollHeight: { value: 260 }, offsetHeight: { value: 260 } });
  moreSheet.append(morePopup);
  f.document.body.append(moreSheet);
  f.notify();
  f.frames();
  assert.equal(morePopup.dataset.fxDetailMore, 'true');
  assert.equal(morePopup.dataset.fxMorePlace, 'top');
  assert.equal(morePopup.style.getPropertyValue('bottom'), 'auto', 'top-placed three-dots menu uses clamped viewport top coordinates so it never clips off-screen');
  const topVal = parseInt(morePopup.style.getPropertyValue('top'), 10);
  assert.ok(topVal >= 12 && topVal + 260 <= 640 - 12, 'strictly inside viewport and >=12px above button top');
  moreSheet.remove();
  detailPage.remove();
  f.ctx.window.FazFortDiscovery.stop();
});

test('v0.6.4 fixes OSD hide specificity & spacing, three-dots with cached hidden detailPage, header/back alignment, Genres end-fade, hero controls & direct playback, typography, and detail + More Like This RT ratings', async () => {
  const f = fixture();
  await f.settle();
  const Ev = f.ctx.document.defaultView.Event;
  const styleText = f.document.getElementById('fx-discovery-style')?.textContent || '';

  // 1. Playback OSD hide specificity (Favorite/Rewind/FastForward) & balanced 18px bottom spacing
  assert.ok(styleText.includes(':not(.btnRewind):not(.btnFastForward):not(.btnUserRating):not(.btnAudio):not(.btnAirPlay)'), 'base OSD button flex rule excludes hidden buttons');
  assert.ok(styleText.includes('#videoOsdPage .videoOsdBottom [is="emby-ratingbutton"]'), 'emby-ratingbutton favorite hidden on playback bar');
  assert.ok(styleText.includes('padding-bottom:calc(18px + env(safe-area-inset-bottom,0px))!important;'), 'balanced 18px bottom OSD padding');
  assert.ok(styleText.includes('html.sleekfin-header-mounted [data-sleekfin-header-toolbar],\nhtml.sleekfin-header-mounted [data-sleekfin-legacy-top]'), 'header bar vertical alignment locked across widths');
  assert.ok(styleText.includes('/* 16. Standardized Global Typography System Across Equivalent Elements'), 'standardized typography system present');

  // 2. Hero Play button uses emby-itemscontainer data-action="play" and launches direct playback via playbackManager
  const heroSlides = f.document.querySelector('#indexPage .fx-page-hero-slides');
  assert.equal(heroSlides.getAttribute('is'), 'emby-itemscontainer');
  const playBtn = f.document.querySelector('#indexPage .fx-page-hero-btn-primary');
  assert.equal(playBtn.getAttribute('data-action'), 'play');
  let playedPayload = null;
  f.ctx.window.playbackManager = { play: opts => { playedPayload = opts; }, currentItem: () => null };
  playBtn.click();
  assert.ok(playedPayload && Array.isArray(playedPayload.ids) && playedPayload.ids.length === 1, 'clicking Hero Play launches direct playback');
  delete f.ctx.window.playbackManager;

  // 3. Cached hidden #itemDetailPage does NOT block visible #itemDetailPage ratings, More Like This RT ratings, or three-dots placement
  const hiddenDetail = f.document.createElement('div');
  hiddenDetail.id = 'itemDetailPage';
  hiddenDetail.className = 'page hide';
  const visibleDetail = f.document.createElement('div');
  visibleDetail.id = 'itemDetailPage';
  visibleDetail.className = 'page';
  const score = f.document.createElement('span');
  score.className = 'sleekfin-details-score';
  score.textContent = '7.4';
  const moreBtn = f.document.createElement('button');
  moreBtn.className = 'btnMoreCommands';
  moreBtn.getBoundingClientRect = () => ({ left: 48, right: 92, top: 640, bottom: 684, width: 44, height: 44 });
  const simSection = f.document.createElement('div');
  simSection.id = 'similarCollapsible';
  const simCard = f.document.createElement('div');
  simCard.className = 'card';
  simCard.setAttribute('data-id', id(3));
  const simMeta = f.document.createElement('div');
  simMeta.className = 'sleekfin-details-similar-meta sleekfin-meta';
  const simStar = f.document.createElement('span');
  simStar.className = 'sleekfin-meta-item';
  simStar.setAttribute('data-sleekfin-accent', 'true');
  simStar.textContent = '7.9';
  simMeta.append(simStar);
  simCard.append(simMeta);
  simSection.append(simCard);
  visibleDetail.append(score, moreBtn, simSection);
  f.document.body.append(hiddenDetail, visibleDetail);

  f.location.hash = `#/details?id=${id(2)}`;
  f.notify();
  f.frames();
  await f.settle();
  assert.equal(score.dataset.fxRatingsMounted, 'true', 'visible detailPage mounts RT ratings even when a hidden cached #itemDetailPage precedes it');
  assert.ok(score.querySelector('.fx-rating-tomatometer'), 'detail page renders Tomatometer');
  assert.equal(simStar.dataset.fxRatingsMounted, 'true', 'More Like This card replaces star rating with configured RT rating');
  assert.ok(simStar.querySelector('.fx-rating-tomatometer'), 'More Like This card displays Tomatometer');

  // Half-window tall three-dots menu near left edge stays strictly >=12px inside viewport (never clipped at top!)
  moreBtn.dispatchEvent(new Ev('pointerdown', { bubbles: true }));
  const moreSheet = f.document.createElement('div');
  moreSheet.className = 'dialog actionSheet sleekfin-menu-host';
  const morePopup = f.document.createElement('div');
  morePopup.className = 'sleekfin-menu-popup';
  for (let k = 0; k < 14; k++) {
    const it = f.document.createElement('button');
    it.className = 'sleekfin-menu-item';
    it.textContent = k === 0 ? 'Edit metadata' : `Menu Item ${k}`;
    morePopup.append(it);
  }
  Object.defineProperties(morePopup, { offsetWidth: { value: 230 }, scrollHeight: { value: 560 }, offsetHeight: { value: 560 } });
  moreSheet.append(morePopup);
  f.document.body.append(moreSheet);
  f.notify();
  f.frames();
  assert.equal(morePopup.dataset.fxDetailMore, 'true');
  const clampedTop = parseInt(morePopup.style.getPropertyValue('top'), 10);
  const clampedLeft = parseInt(morePopup.style.getPropertyValue('left'), 10);
  assert.ok(clampedTop >= 12, 'half-window three-dots menu top never goes negative/clipped');
  assert.ok(clampedLeft >= 12, 'half-window three-dots menu left stays cleanly inside viewport');
  moreSheet.remove();
  hiddenDetail.remove();
  visibleDetail.remove();

  // 4. Native .emby-scroller dynamically sets data-fx-scroll-end="true" at the end of a category (removing right-edge gradient)
  const scroller = f.document.createElement('div');
  scroller.className = 'emby-scroller';
  Object.defineProperties(scroller, { scrollWidth: { value: 1000 }, clientWidth: { value: 500 }, scrollLeft: { value: 500, writable: true } });
  f.document.body.append(scroller);
  f.notify();
  f.frames();
  assert.equal(scroller.dataset.fxScrollStart, 'false');
  assert.equal(scroller.dataset.fxScrollEnd, 'true', 'right-edge gradient disabled when scrolled to end of finite category');
  scroller.remove();

  // 5. Hero banner controls work in Visual Editor & filter Home hero (excludeWatched + minCriticScore + pinnedIds)
  const customCfg = JSON.parse(f.storage.get('fazfort-discovery:config:v1:s:u') || 'null') || null;
  const fHero = fixture({
    config: {
      ...(customCfg || {}),
      schemaVersion: 1,
      timeZone: 'America/Los_Angeles',
      cardsPerShelf: 12,
      batchSize: 4,
      minimumItems: 2,
      maxLiveRows: 24,
      endless: true,
      hideWatched: false,
      pages: {
        home: { anchors: ['ContinueWatchingNextUp'], families: ['theme'], rules: [], hero: { mode: 'pinned-only', maxSlides: 3, excludeWatched: true, pinnedIds: [id(5), id(6)] } },
        movies: { anchors: ['RecentlyAddedMovies'], families: ['theme'], rules: [] },
        shows: { anchors: ['RecentlyAddedShows'], families: ['theme'], rules: [] }
      }
    }
  });
  await fHero.settle();
  const pinnedSlides = [...fHero.document.querySelectorAll('#indexPage .fx-page-hero-slide')].map(s => s.dataset.itemId);
  assert.deepEqual(pinnedSlides, [id(5), id(6)], 'Hero banner honors pinned-only selection in exact configured order');
  fHero.ctx.window.FazFortDiscovery.stop();

  f.ctx.window.FazFortDiscovery.stop();
});

test('v0.6.5 polish: hero shadow z-layers, manual hero timer reset, stutter-free header popups, full-window three-dots CSS vars, horizontal row vertical-scroll lock, and in-place Discover card requests', async () => {
  const f = fixture({
    hash: '#/home',
    config: {
      schemaVersion: 1,
      timeZone: 'America/Los_Angeles',
      cardsPerShelf: 12,
      batchSize: 4,
      minimumItems: 2,
      maxLiveRows: 24,
      endless: true,
      hideWatched: false,
      pages: {
        home: { anchors: ['DiscoverMovies'], families: ['theme'], rules: [] },
        movies: { anchors: ['RecentlyAddedMovies'], families: ['theme'], rules: [] },
        shows: { anchors: ['RecentlyAddedShows'], families: ['theme'], rules: [] }
      }
    }
  });
  const origGetJson = f.api.getJSON;
  f.api.getJSON = async arg => {
    if (arg?.p === 'RequestHub/Browse' && arg?.q?.kind === 'movies') {
      return { results: [{ id: 550, type: 'movie', title: 'Fight Club', year: 1999, poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', status: 0, releaseDate: '1999-10-15' }], pages: 1, canRequest: true };
    }
    return origGetJson(arg);
  };
  f.ctx.window.FazFortDiscovery.restart();
  await f.settle();
  const cssText = f.document.getElementById('fx-discovery-style')?.textContent || '';
  const Ev = f.document.defaultView.Event;

  // 1. Hero banner logo shadow sits strictly behind metadata/description/actions via explicit z-index layers
  assert.ok(cssText.includes('.fx-page-hero-logo{\n  position:relative;\n  z-index:1;') && cssText.includes('filter:drop-shadow(0 2px 8px rgba(0,0,0,.62))'), 'hero logo uses tightened shadow at z-index 1');
  assert.ok(cssText.includes('.fx-page-hero-meta{\n  position:relative;\n  z-index:2;'), 'hero metadata paints above hero logo shadow');
  assert.ok(cssText.includes('.fx-page-hero-desc{\n  position:relative;\n  z-index:3;'), 'hero description paints above metadata');
  assert.ok(cssText.includes('.fx-page-hero-actions{\n  position:relative;\n  z-index:4;'), 'hero actions paint on top layer');

  // 2. Horizontal categories cannot scroll vertically
  assert.ok(cssText.includes('.fx-track{display:flex;gap:14px;overflow-x:auto;overflow-y:hidden!important;') && cssText.includes('overscroll-behavior-y:auto'), '.fx-track locks vertical overflow');
  assert.ok(cssText.includes('.emby-scroller:not(.scrollY):not(.smoothScrollY){\n  overflow-y:hidden!important;'), 'native horizontal .emby-scroller locks vertical overflow');

  // 3. Hero banner manual slide switch resets the 9-second auto-advance interval
  const nextBtn = f.document.querySelector('#indexPage .fx-page-hero-next');
  const dots = [...f.document.querySelectorAll('#indexPage .fx-page-hero-dot')];
  assert.ok(nextBtn && dots.length > 1, 'Home hero has multiple slides and next control');
  const origSetInterval = f.ctx.setInterval;
  const origClearInterval = f.ctx.clearInterval;
  let intervalSets = 0;
  let intervalClears = 0;
  let nextTimerId = 9000;
  f.ctx.setInterval = (fn, ms) => { if (ms === 9000) intervalSets++; return ++nextTimerId; };
  f.ctx.clearInterval = () => { intervalClears++; };
  nextBtn.click();
  assert.equal(dots[1].getAttribute('aria-current'), 'true', 'clicking next advances slide');
  assert.equal(intervalSets, 1, 'manual next click starts a fresh 9s auto-advance timer');
  assert.ok(intervalClears >= 1, 'manual next click clears prior auto-advance timer');
  dots[0].click();
  assert.equal(dots[0].getAttribute('aria-current'), 'true', 'clicking dot selects slide 0');
  assert.equal(intervalSets, 2, 'manual dot click resets 9s auto-advance timer again');
  f.ctx.setInterval = origSetInterval;
  f.ctx.clearInterval = origClearInterval;

  // 4. SyncPlay / Cast header popup Frame-0 anchoring without scroll-offset jitter
  assert.ok(cssText.includes('#app-sync-play-menu:not([aria-hidden="true"]):not(.MuiModal-hidden),\n#app-remote-play-menu:not([aria-hidden="true"]):not(.MuiModal-hidden){\n  position:fixed!important;'), 'SyncPlay and Cast MUI roots remain fixed viewport containers');
  assert.ok(cssText.includes('html[data-fx-header-menu-opening="true"]'), 'CSS includes Frame-0 header menu opening anchor rule');
  const castBtn = f.document.createElement('button');
  castBtn.className = 'headerCastButton';
  castBtn.setAttribute('aria-controls', 'app-remote-play-menu');
  castBtn.getBoundingClientRect = () => ({ left: 1180, right: 1220, top: 16, bottom: 56, width: 40, height: 40 });
  const headerBar = f.document.createElement('div');
  headerBar.className = 'skinHeader';
  const hdrRight = f.document.createElement('div');
  hdrRight.className = 'headerRight';
  hdrRight.append(castBtn);
  headerBar.append(hdrRight);
  f.document.body.append(headerBar);
  castBtn.dispatchEvent(new Ev('pointerdown', { bubbles: true }));
  assert.equal(f.document.documentElement.getAttribute('data-fx-header-menu-opening'), 'true', 'pointerdown on Cast sets Frame-0 opening attribute');
  assert.equal(f.document.documentElement.style.getPropertyValue('--fx-header-popup-top'), '64px', 'pointerdown computes exact header popup top before Frame 0');
  const remoteMenu = f.document.createElement('div');
  remoteMenu.id = 'app-remote-play-menu';
  remoteMenu.className = 'MuiPopover-root';
  const remotePaper = f.document.createElement('div');
  remotePaper.className = 'MuiPopover-paper';
  remoteMenu.append(remotePaper);
  f.document.body.append(remoteMenu);
  f.notify();
  f.frames();
  assert.equal(remoteMenu.dataset.fxAnchoredOpen, undefined, 'SyncPlay/Cast popovers are not shifted into scroll-offset absolute mode');
  remoteMenu.remove();
  headerBar.remove();

  // 5. Full-window three-dots (...) menu uses CSS custom properties immune to SleekFin S(e) inline left overwrites
  assert.ok(cssText.includes('left:var(--fx-more-left,12px)!important;') && cssText.includes('top:var(--fx-more-top,12px)!important;'), 'three-dots coordinates are locked via stylesheet !important CSS variables');
  const detailPage = f.document.createElement('div');
  detailPage.id = 'itemDetailPage';
  detailPage.className = 'page';
  const moreBtn = f.document.createElement('button');
  moreBtn.className = 'btnMoreCommands';
  // Simulate full-sized window (1280px wide in fixture) with button at far right edge
  moreBtn.getBoundingClientRect = () => ({ left: 1200, right: 1244, top: 560, bottom: 604, width: 44, height: 44 });
  detailPage.append(moreBtn);
  f.document.body.append(detailPage);
  moreBtn.dispatchEvent(new Ev('pointerdown', { bubbles: true }));
  assert.equal(f.document.documentElement.getAttribute('data-fx-header-menu-opening'), null, 'clicking three-dots clears any pending header-menu-opening flag');
  const sheet = f.document.createElement('div');
  sheet.className = 'dialog actionSheet';
  sheet.dataset.fxDetailMore = 'true'; // simulate Frame-0 tag on host before SleekFin wraps it
  const popup = f.document.createElement('div');
  popup.className = 'sleekfin-menu-popup';
  const editItem = f.document.createElement('button');
  editItem.className = 'sleekfin-menu-item';
  editItem.textContent = 'Edit metadata';
  popup.append(editItem);
  Object.defineProperties(popup, { offsetWidth: { value: 224 }, scrollHeight: { value: 360 }, offsetHeight: { value: 360 } });
  sheet.classList.add('sleekfin-menu-host');
  sheet.append(popup);
  f.document.body.append(sheet);
  f.notify();
  f.frames();
  assert.equal(sheet.dataset.fxDetailMore, undefined, 'stale Frame-0 data-fx-detail-more on host sheet is cleaned once .sleekfin-menu-popup mounts');
  assert.equal(popup.dataset.fxDetailMore, 'true');
  const varLeft = parseInt(popup.style.getPropertyValue('--fx-more-left'), 10);
  const varTop = parseInt(popup.style.getPropertyValue('--fx-more-top'), 10);
  assert.ok(varLeft >= 12 && varLeft <= 1280 - 224 - 12, 'full-window three-dots --fx-more-left stays cleanly on screen at right side');
  assert.ok(varTop >= 12, 'full-window three-dots --fx-more-top stays cleanly inside viewport');
  // Simulate SleekFin S(e) overwriting inline style.left with negative relative offset
  popup.style.left = '-240px';
  assert.equal(popup.style.getPropertyValue('--fx-more-left'), `${varLeft}px`, 'SleekFin S(e) inline left overwrite cannot touch --fx-more-left');
  sheet.remove();
  detailPage.remove();

  // 6. Clicking a Discover Movies card on Home opens Request Hub dialog in place without navigating away
  let openedInPlace = null;
  f.ctx.window.JellyfinRequestHub = {
    openDetails(item, trigger) {
      openedInPlace = { item, trigger };
      return true;
    }
  };
  const discoverCard = [...f.document.querySelectorAll('.fx-card')].find(a => a.dataset.itemId === 'rh:movies:550');
  assert.ok(discoverCard, 'Discover Movies card rendered on Home');
  const clickEv = new Ev('click', { bubbles: true, cancelable: true });
  discoverCard.dispatchEvent(clickEv);
  assert.equal(clickEv.defaultPrevented, true, 'Discover card click prevents hash navigation when Request Hub openDetails is available');
  assert.equal(f.location.hash, '#/home', 'clicking Discover card keeps user on Home page');
  assert.deepEqual(openedInPlace?.item?.id, 550);
  assert.equal(openedInPlace?.item?.type, 'movie');
  assert.equal(openedInPlace?.trigger, discoverCard);
  delete f.ctx.window.JellyfinRequestHub;

  f.ctx.window.FazFortDiscovery.stop();
});
