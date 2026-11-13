import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';
const source=await readFile(new URL('../requests/dist/web.js',import.meta.url),'utf8');
function fixture({deny=false,hash='#/home?requesthub=discover',mobile=false}={}){
 const {document,window}=parseHTML('<html><head></head><body><header><div class="headerTabs"></div></header><div id="indexPage"><div id="native">Native Home</div></div></body></html>');
 window.HTMLElement.prototype.focus=function(){};window.HTMLElement.prototype.scrollBy=function(){};
 let user='user-one';const listeners=new Map(),writes=[],reads=[];
 const location={hash};
 const item={id:42,type:'tv',title:'Series <script>untrusted</script>',overview:'Description',poster:'https://image.tmdb.org/t/p/w500/cover.jpg',status:0,releaseDate:'2024-01-15'};
 const futureItem={id:99,type:'movie',title:'Unreleased Future Movie',overview:'Future',poster:'https://image.tmdb.org/t/p/w500/future.jpg',status:0,releaseDate:'2099-12-31'};
 const api={getCurrentUserId:()=>user,serverId:()=> 'server',getUrl:(path,query)=>({path,query}),getJSON:async ({path,query})=>{
  reads.push({path,query});if(deny)throw {status:403};if(path.endsWith('Details'))return {item,seasons:[1,2],canRequest:true};
  if(query.kind==='genres')return {results:[{id:1,name:'Action'}],pages:1};return {results:[item,futureItem],pages:2,canRequest:true};
 },ajax:async options=>{writes.push(JSON.parse(options.data));return {message:'Submitted for approval'};}};
 const win={ApiClient:api,innerWidth:mobile?390:1280,matchMedia:q=>({matches:mobile&&q.includes('max-width: 899px')}),addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
 const ctx=vm.createContext({window:win,document,location,URL,URLSearchParams,Date,Element:window.Element,console,setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},MutationObserver:class{observe(){}disconnect(){}}});
 vm.runInContext(source,ctx);const settle=async()=>{for(let n=0;n<100;n++)await Promise.resolve();};
 return {document,window,writes,reads,settle,stop:()=>win.JellyfinRequestHub.stop(),navigate(hash){location.hash=hash;listeners.get('hashchange')?.();},logout(){user=null;listeners.get('hashchange')?.();}};
}
test('Request Hub mounts independently, escapes titles and restores native UI',async()=>{
 const f=fixture();await f.settle();assert.ok(f.document.querySelector('.rh-root'));assert.equal(f.document.querySelector('#native').dataset.rhHidden,'true');
 assert.ok(f.document.querySelector('.rh-card strong').textContent.includes('<script>'));assert.equal(f.document.querySelector('.rh-root script'),null);
 assert.ok(f.document.querySelector('[data-rh-link]'));f.navigate('#/home');assert.equal(f.document.querySelector('.rh-root'),null);assert.equal(f.document.querySelector('#native').hasAttribute('data-rh-hidden'),false);f.stop();
});
test('series requests require explicit seasons and a confirmation click',async()=>{
 const f=fixture();await f.settle();f.document.querySelector('.rh-card').click();await f.settle();const dialog=f.document.querySelector('.rh-dialog');assert.ok(dialog);
 const confirm=[...dialog.querySelectorAll('button')].find(b=>b.textContent==='Confirm request');confirm.click();await f.settle();assert.equal(f.writes.length,0);
 const season=dialog.querySelector('input');season.checked=true;season.dispatchEvent(new f.window.Event('change',{bubbles:true}));confirm.click();await f.settle();
 assert.deepEqual(f.writes,[{type:'tv',id:42,seasons:[1]}]);assert.ok(dialog.textContent.includes('Submitted for approval'));f.stop();
});
test('unmapped account errors do not show request controls, credentials, or header Discover tab',async()=>{
 const f=fixture({deny:true});await f.settle();assert.equal(f.document.querySelector('.rh-card'),null);assert.equal(f.document.querySelector('[data-rh-link]'),null);assert.ok(f.document.querySelector('.rh-root').textContent.includes('account mapping'));assert.equal(f.writes.length,0);f.stop();
});
test('sign-out removes Request Hub and all navigation links',async()=>{
 const f=fixture();await f.settle();f.logout();assert.equal(f.document.querySelector('.rh-root'),null);assert.equal(f.document.querySelector('[data-rh-link]'),null);assert.equal(f.document.querySelector('[data-rh-hidden]'),null);f.stop();
});

test('direct media links open an in-app title dialog without a request side effect',async()=>{
 const f=fixture({hash:'#/home?requesthub=discover&mediaType=tv&mediaId=42'});await f.settle();assert.ok(f.document.querySelector('.rh-dialog'));assert.equal(f.writes.length,0);f.stop();
});

test('SleekFin header proxy receives Discover button before separator and registers toolbar source',async()=>{
 const f=fixture({hash:'#/home?requesthub=discover'});
 const header=f.document.querySelector('header');
 header.className='skinHeader';
 const left=f.document.createElement('div');left.className='headerLeft';header.prepend(left);
 const proxy=f.document.createElement('div');proxy.setAttribute('data-sleekfin-header-proxy','true');
 const homeBtn=f.document.createElement('button');homeBtn.setAttribute('data-sleekfin-header-proxy-item','jellyfin:home');homeBtn.setAttribute('data-sleekfin-current','true');
 const showsLeavingBtn=f.document.createElement('button');showsLeavingBtn.setAttribute('data-sleekfin-header-proxy-item','jellyfin:view:shows-leaving');showsLeavingBtn.textContent='Shows (Leaving Soon)';
 const sep=f.document.createElement('span');sep.setAttribute('data-sleekfin-header-separator','true');
 proxy.append(showsLeavingBtn,homeBtn,sep);header.append(proxy);
 f.navigate('#/home?requesthub=discover');await f.settle();
 assert.equal(showsLeavingBtn.getAttribute('data-fx-leaving-hidden'),'true');
 assert.equal(showsLeavingBtn.style.display,'none');
 assert.ok(left.querySelector('#requesthub-discover-tab[data-rh-source="true"]'));
 const link=proxy.querySelector('[data-rh-link="true"]');
 assert.ok(link);
 assert.equal(link.nextElementSibling,sep);
 assert.equal(link.dataset.sleekfinCurrent,'true');
 assert.equal(homeBtn.dataset.sleekfinCurrent,undefined);
 const firstTrack=f.document.querySelector('.rh-row:not(.rh-media-row) .rh-track');
 assert.ok(firstTrack);
 assert.ok(firstTrack.querySelectorAll('.rh-card:not(.rh-see-more)').length<=20);
 assert.equal(firstTrack.lastElementChild?.classList.contains('rh-see-more'),true);
 f.navigate('#/home?requesthub=discover&rhView=movies');await f.settle();
 assert.equal(f.document.querySelector('.rh-page-title').textContent,'Popular Movies');
 assert.ok(f.document.querySelector('.rh-grid'));
 f.stop();
});

test('Discover hides unreleased titles, replaces top-left title and deselects header tab on subpages, renders scrollable Genre/Studio/Network cards and live search',async()=>{
 const f=fixture({hash:'#/home?requesthub=discover'});await f.settle();
 assert.equal([...f.document.querySelectorAll('.rh-card strong')].some(n=>n.textContent.includes('Unreleased Future Movie')),false);
 assert.equal([...f.document.querySelectorAll('.rh-row-head button')].some(b=>b.textContent==='Load more'),false);
 assert.equal([...f.document.querySelectorAll('.rh-toolbar button')].length,0);
 const searchInput=f.document.querySelector('.rh-search input');
 assert.ok(searchInput);
 assert.equal(searchInput.placeholder,'Search new content');
 assert.ok(f.document.querySelector('.rh-search-icon'));
 assert.ok(f.document.querySelector('.rh-card.rh-see-more'));
 assert.equal(f.document.querySelectorAll('.rh-media-row').length,3);
 const networkChip=[...f.document.querySelectorAll('.rh-chip')].find(b=>b.textContent==='Netflix');
 assert.ok(networkChip);
 assert.ok(networkChip.classList.contains('rh-logo-card'));
 assert.ok(networkChip.querySelector('img')?.src.includes('w780_filter(duotone,ffffff,bababa)'));
 const studioChip=[...f.document.querySelectorAll('.rh-chip')].find(b=>b.textContent==='Disney');
 assert.ok(studioChip);
 assert.ok(studioChip.classList.contains('rh-logo-card'));
 const genreChip=[...f.document.querySelectorAll('.rh-chip')].find(b=>b.textContent==='Action');
 assert.ok(genreChip);
 assert.ok(genreChip.classList.contains('rh-genre-card'));
 const navLink=f.document.querySelector('[data-rh-link="true"]');
 assert.equal(navLink.getAttribute('aria-current'),'page');
 genreChip.click();await f.settle();
 assert.ok(f.document.querySelector('.rh-grid'));
 assert.equal(f.document.querySelector('[data-rh-back="true"]'),null);
 assert.equal(f.document.querySelector('.rh-page-title').textContent,'Action');
 assert.equal(navLink.getAttribute('aria-current'),null);
 assert.equal(navLink.dataset.sleekfinCurrent,undefined);
 navLink.click();await f.settle();
 assert.equal(f.document.querySelector('.rh-grid'),null);
 assert.equal(f.document.querySelector('.rh-page-title').textContent,'Discover');
 assert.equal(navLink.getAttribute('aria-current'),'page');
 assert.equal(navLink.dataset.sleekfinCurrent,'true');
 assert.ok(f.document.querySelector('.rh-row'));
 const firstTrack=f.document.querySelector('.rh-row:not(.rh-media-row) .rh-track');
 assert.ok(firstTrack);
 assert.ok(firstTrack.querySelectorAll('.rh-card:not(.rh-see-more)').length<=20);
 assert.equal(firstTrack.lastElementChild?.classList.contains('rh-see-more'),true);
 f.stop();
});

test('mobile viewport keeps Discover out of bottom header proxy and wires Discover after Collections in overflow drawer',async()=>{
 const f=fixture({hash:'#/home',mobile:true});
 const header=f.document.querySelector('header');
 header.className='skinHeader';
 const proxy=f.document.createElement('div');proxy.setAttribute('data-sleekfin-header-proxy','true');
 const homeBtn=f.document.createElement('button');homeBtn.setAttribute('data-sleekfin-header-proxy-item','jellyfin:home');
 const moviesBtn=f.document.createElement('button');moviesBtn.setAttribute('data-sleekfin-header-proxy-item','jellyfin:view:movies');
 const showsBtn=f.document.createElement('button');showsBtn.setAttribute('data-sleekfin-header-proxy-item','jellyfin:view:shows');
 const sep=f.document.createElement('span');sep.setAttribute('data-sleekfin-header-separator','true');
 proxy.append(homeBtn,moviesBtn,showsBtn,sep);header.append(proxy);

 const drawer=f.document.createElement('div');drawer.setAttribute('data-sleekfin-header-overflow-drawer','true');
 const list=f.document.createElement('div');
 const collectionsItem=f.document.createElement('button');collectionsItem.setAttribute('data-sleekfin-header-overflow-item','jellyfin:view:9d7ad6afe9afa2dab1a2f6e00ad28fa6');collectionsItem.textContent='Collections';
 const liveTvItem=f.document.createElement('button');liveTvItem.setAttribute('data-sleekfin-header-overflow-item','source:v1:164f41b42f7a4221084a13ce51114045');liveTvItem.textContent='Live TV';
 const searchItem=f.document.createElement('button');searchItem.setAttribute('data-sleekfin-header-overflow-item','jellyfin:search');searchItem.textContent='Search';
 list.append(collectionsItem,liveTvItem,searchItem);drawer.append(list);f.document.body.append(drawer);

 f.navigate('#/home?requesthub=discover');await f.settle();
 assert.equal(proxy.querySelector('[data-rh-link="true"]'),null);
 assert.equal(proxy.querySelector('[data-sleekfin-header-proxy-item="requesthub:discover"]'),null);
 const overflowDiscover=drawer.querySelector('[data-sleekfin-header-overflow-item="requesthub:discover"]');
 assert.ok(overflowDiscover);
 assert.equal(collectionsItem.nextElementSibling,overflowDiscover);
 assert.equal(overflowDiscover.dataset.sleekfinCurrent,'true');
 f.stop();
});
