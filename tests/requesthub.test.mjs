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
 const availableItem={id:77,type:'movie',title:'Already Downloaded Movie',overview:'Owned',poster:'https://image.tmdb.org/t/p/w500/owned.jpg',status:5,releaseDate:'2024-01-15'};
 const futureItem={id:99,type:'movie',title:'Unreleased Future Movie',overview:'Future',poster:'https://image.tmdb.org/t/p/w500/future.jpg',status:0,releaseDate:'2099-12-31'};
 const api={getCurrentUserId:()=>user,serverId:()=> 'server',getUrl:(path,query)=>({path,query}),getJSON:async ({path,query})=>{
  reads.push({path,query});if(deny)throw {status:403};if(path.endsWith('Details'))return {item,seasons:[1,2],canRequest:true};
  if(query.kind==='genres')return {results:[{id:1,name:'Action'}],pages:1};return {results:[item,availableItem,futureItem],pages:2,canRequest:true};
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
 assert.equal([...f.document.querySelectorAll('.rh-card strong')].some(n=>n.textContent.includes('Already Downloaded Movie')),false);
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

test('mobile viewport keeps Discover out of bottom header proxy, wires Discover before Collections & Live TV in overflow drawer, and uses crisp SVG icon',async()=>{
 const f=fixture({hash:'#/home',mobile:true});
 const cssText=f.document.querySelector('head style')?.textContent||'';
 assert.ok(cssText.includes('html:not(.layout-tv) .rh-root :is(button,.rh-card,.rh-media-card,.rh-chip,.rh-row-arrow):is(:focus,:focus-visible,:active)'));
 assert.ok(cssText.includes('border:2px solid rgba(255,255,255,0.24)'));
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
 assert.equal(overflowDiscover.nextElementSibling,collectionsItem);
 assert.ok(overflowDiscover.querySelector('.rh-compass-icon svg'));
 assert.equal(overflowDiscover.dataset.sleekfinCurrent,'true');
 f.stop();
});

test('in-place openDetails works from Home without navigating, shows quality profile + movie RT ratings + extra details, and omits RT scores on TV shows',async()=>{
 const {document,window}=parseHTML('<html><head></head><body><header><div class="headerTabs"></div></header><div id="indexPage"><div id="native">Native Home</div></div></body></html>');
 window.HTMLElement.prototype.focus=function(){};window.HTMLElement.prototype.scrollBy=function(){};
 const writes=[],reads=[];
 const location={hash:'#/home'};
 const movieProfiles=[
  {id:12,name:'1080p Efficient',serverId:0,is4k:false,isDefault:false},
  {id:15,name:'1080p Quality',serverId:0,is4k:false,isDefault:true},
  {id:14,name:'2160p Remux',serverId:0,is4k:true,isDefault:false}
 ];
 const tvProfiles=[
  {id:12,name:'1080p Efficient',serverId:0,is4k:false,isDefault:true},
  {id:13,name:'1080p Quality',serverId:0,is4k:false,isDefault:false}
 ];
 const api={
  getCurrentUserId:()=>'user-one',
  serverId:()=>'server',
  getUrl:(path,query)=>({path,query}),
  getJSON:async({path,query})=>{
   reads.push({path,query});
   if(path.endsWith('Status'))return {enabled:true,canRequest:true};
   if(path.endsWith('Details')&&query.type==='movie'){
    return {
     item:{id:550,type:'movie',title:'Fight Club',tagline:'Mischief. Mayhem. Soap.',overview:'An insomniac office worker...',poster:'https://image.tmdb.org/t/p/w500/fc.jpg',releaseDate:'1999-10-15',status:0,runtime:139,genres:['Drama','Thriller'],voteAverage:8.4,certification:'R',director:'David Fincher',cast:['Brad Pitt','Edward Norton']},
     seasons:[],
     profiles:movieProfiles,
     defaultProfileId:15,
     ratings:{criticsScore:86,criticsRating:'Certified Fresh',audienceScore:96,audienceRating:'Upright'},
     canRequest:true
    };
   }
   if(path.endsWith('Details')&&query.type==='tv'){
    return {
     item:{id:42,type:'tv',title:'Severance',overview:'Mark leads a team...',poster:'https://image.tmdb.org/t/p/w500/sev.jpg',releaseDate:'2022-02-18',status:0,genres:['Drama','Sci-Fi'],voteAverage:8.7,certification:'TV-MA',networks:['Apple TV+'],statusText:'Returning Series',numberOfSeasons:2,cast:['Adam Scott','Britt Lower']},
     seasons:[1,2],
     profiles:tvProfiles,
     defaultProfileId:12,
     ratings:{criticsScore:97,criticsRating:'Certified Fresh',audienceScore:90},
     canRequest:true
    };
   }
   return {results:[],pages:1,canRequest:true};
  },
  ajax:async options=>{writes.push(JSON.parse(options.data));return {message:'Submitted for approval'};}
 };
 const win={ApiClient:api,innerWidth:1280,innerHeight:800,matchMedia:()=>({matches:false}),addEventListener(){},removeEventListener(){}};
 const ctx=vm.createContext({window:win,document,location,URL,URLSearchParams,Date,Element:window.Element,console,setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},MutationObserver:class{observe(){}disconnect(){}}});
 vm.runInContext(source,ctx);
 const settle=async()=>{for(let n=0;n<100;n++)await Promise.resolve();};
 await settle();

 // Horizontal Discover track locks vertical overflow
 const cssText=document.querySelector('head style')?.textContent||'';
 assert.ok(cssText.includes('overflow-y:hidden!important')&&cssText.includes('overscroll-behavior-y:auto'),'.rh-track locks vertical scroll');

 // Open Movie request dialog directly on #/home without navigating to Discover
 assert.equal(document.querySelector('.rh-root'),null);
 const openedMovie=win.JellyfinRequestHub.openDetails({id:550,type:'movie',title:'Fight Club'});
 assert.equal(openedMovie,true);
 await settle();
 assert.equal(location.hash,'#/home','hash stays on Home');
 assert.equal(document.querySelector('.rh-root'),null,'Discover page is NOT mounted');
 let dialog=document.querySelector('.rh-dialog');
 assert.ok(dialog,'Movie request dialog mounts directly on body');
 assert.ok(dialog.querySelector('[data-rh-ratings="true"]'),'Movie dialog renders Rotten Tomatoes ratings row');
 assert.ok(dialog.textContent.includes('86%')&&dialog.textContent.includes('96%'),'Movie dialog shows Tomatometer and Popcornmeter');
 assert.ok(dialog.textContent.includes('2h 19m')&&dialog.textContent.includes('David Fincher')&&dialog.textContent.includes('Mischief. Mayhem. Soap.')&&dialog.textContent.includes('Drama'),'Movie dialog shows extra details');
 let select=dialog.querySelector('select.rh-select');
 assert.ok(select,'Movie dialog renders quality profile selector');
 const selectOption=(sel,val)=>{for(const opt of sel.querySelectorAll('option')){opt.selected=opt.value===val;opt.toggleAttribute('selected',opt.value===val);}sel.dispatchEvent(new window.Event('change',{bubbles:true}));};
 assert.equal(select.value,'1','Movie quality profile defaults to active Radarr profile index');
 assert.equal(select.querySelectorAll('option')[Number(select.value)].textContent,'1080p Quality','Movie quality profile defaults to active Radarr profile');
 // Switch to 2160p Remux (index 2) and submit
 selectOption(select,'2');
 [...dialog.querySelectorAll('button')].find(b=>b.textContent==='Confirm request').click();
 await settle();
 assert.deepEqual(writes,[{type:'movie',id:550,seasons:[],profileId:14,serverId:0,is4k:true}]);

 // Open TV Show request dialog directly on #/home -> has Quality Profile, NO Rotten Tomatoes score!
 win.JellyfinRequestHub.openDetails({id:42,type:'tv',title:'Severance'});
 await settle();
 dialog=document.querySelector('.rh-dialog');
 assert.ok(dialog,'TV request dialog opens in place');
 assert.equal(dialog.querySelector('[data-rh-ratings="true"]'),null,'TV dialog strictly omits Rotten Tomatoes ratings');
 assert.equal(dialog.textContent.includes('Tomatometer'),false,'TV dialog does not mention Tomatometer');
 assert.ok(dialog.textContent.includes('Apple TV+')&&dialog.textContent.includes('2 Seasons')&&dialog.textContent.includes('Returning Series'),'TV dialog shows show details');
 select=dialog.querySelector('select.rh-select');
 assert.ok(select,'TV dialog renders Sonarr quality profile selector');
 assert.equal(select.value,'0','TV quality profile defaults to active Sonarr profile index');
 assert.equal(select.querySelectorAll('option')[Number(select.value)].textContent,'1080p Efficient','TV quality profile defaults to active Sonarr profile');
 selectOption(select,'1');
 const seasonBox=dialog.querySelector('input[type="checkbox"]');
 seasonBox.checked=true;
 seasonBox.dispatchEvent(new window.Event('change',{bubbles:true}));
 [...dialog.querySelectorAll('button')].find(b=>b.textContent==='Confirm request').click();
 await settle();
 assert.deepEqual(writes[1],{type:'tv',id:42,seasons:[1],profileId:13,serverId:0,is4k:false});

 win.JellyfinRequestHub.stop();
 assert.equal(document.querySelector('.rh-overlay'),null,'stop() cleans up standalone overlays');
});

test('request cancellation, grayed-out Confirm request on requested movies, and already-downloaded items visible in Discover Search only',async()=>{
 const {document,window}=parseHTML('<html><head></head><body><header><div class="headerTabs"></div></header><div id="indexPage"><div id="native">Native Home</div></div></body></html>');
 window.HTMLElement.prototype.focus=function(){};window.HTMLElement.prototype.scrollBy=function(){};
 const calls=[];
 const location={hash:'#/home?requesthub=discover'};
 const profiles=[
  {id:12,name:'1080p Efficient',serverId:0,is4k:false,isDefault:false},
  {id:15,name:'1080p Quality',serverId:0,is4k:false,isDefault:true}
 ];
 const downloadedMovie={id:777,type:'movie',title:'Inception',overview:'Dream heist',poster:'https://image.tmdb.org/t/p/w500/inc.jpg',status:5,releaseDate:'2010-07-16'};
 const newMovie={id:550,type:'movie',title:'Fight Club',overview:'Soap',poster:'https://image.tmdb.org/t/p/w500/fc.jpg',status:0,releaseDate:'1999-10-15'};
 const alreadyRequestedMovie={id:864,type:'movie',title:'Cool Runnings',overview:'Bobsled',poster:'https://image.tmdb.org/t/p/w500/cr.jpg',status:3,releaseDate:'1993-10-01'};
 const api={
  getCurrentUserId:()=>'user-one',
  serverId:()=>'server',
  getUrl:(path,query)=>({path,query}),
  getJSON:async({path,query})=>{
   if(path.endsWith('Status'))return {enabled:true,canRequest:true};
   if(path.endsWith('Details')&&Number(query.id)===550){
    return {item:newMovie,seasons:[],profiles,defaultProfileId:15,requests:[],canRequest:true};
   }
   if(path.endsWith('Details')&&Number(query.id)===864){
    return {item:alreadyRequestedMovie,seasons:[],profiles,defaultProfileId:15,requests:[{id:256,status:2,is4k:false,profileId:15,seasons:[],canCancel:true}],canRequest:true};
   }
   if(query?.kind==='search')return {results:[downloadedMovie,newMovie],pages:1,canRequest:true};
   if(query?.kind==='genres')return {results:[],pages:1};
   return {results:[downloadedMovie,newMovie],pages:1,canRequest:true};
  },
  ajax:async options=>{
   const body=JSON.parse(options.data);
   calls.push({path:options.url.path,body});
   if(options.url.path.endsWith('Request')){
    return {message:'Submitted for approval',request:{id:901,status:1,is4k:false,profileId:body.profileId,seasons:body.seasons||[],canCancel:true}};
   }
   if(options.url.path.endsWith('Cancel')){
    return {message:'Request cancelled.'};
   }
   return {};
  }
 };
 const win={ApiClient:api,innerWidth:1280,innerHeight:800,matchMedia:()=>({matches:false}),addEventListener(){},removeEventListener(){}};
 const ctx=vm.createContext({window:win,document,location,URL,URLSearchParams,Date,Element:window.Element,console,setTimeout:fn=>{fn();return 1;},clearTimeout(){},setInterval:()=>1,clearInterval(){},MutationObserver:class{observe(){}disconnect(){}}});
 vm.runInContext(source,ctx);
 const settle=async()=>{for(let n=0;n<100;n++)await Promise.resolve();};
 await settle();

 // 1. Scrollable Discover categories hide already-downloaded movies (status=5)
 assert.equal([...document.querySelectorAll('.rh-row .rh-card strong')].some(n=>n.textContent==='Inception'),false,'scrollable categories exclude downloaded titles');

 // 2. Discover Search DOES show already-downloaded movies with Available pill
 const searchInput=document.querySelector('.rh-search input');
 searchInput.value='Inception';
 searchInput.dispatchEvent(new window.Event('input',{bubbles:true}));
 await settle();
 const searchCards=[...document.querySelectorAll('.rh-grid .rh-card')];
 const incCard=searchCards.find(c=>c.textContent.includes('Inception'));
 assert.ok(incCard,'Discover search displays already-downloaded movies');
 assert.ok(incCard.querySelector('.rh-status')?.textContent==='Available','downloaded search result shows Available badge');

 // 3. Requesting a movie grays out Confirm request & reveals Cancel request; cancelling re-enables Confirm & quality profile!
 win.JellyfinRequestHub.openDetails(newMovie);
 await settle();
 let dialog=document.querySelector('.rh-dialog');
 let confirmBtn=[...dialog.querySelectorAll('button')].find(b=>b.classList.contains('rh-btn-primary'));
 let select=dialog.querySelector('select.rh-select');
 assert.equal(confirmBtn.disabled,false);
 assert.equal(dialog.querySelector('[data-rh-cancel-request]'),null,'no cancel button before requesting');
 confirmBtn.click();
 await settle();
 assert.equal(confirmBtn.disabled,true,'Confirm request grays out immediately after requesting');
 assert.equal(confirmBtn.textContent,'Already requested');
 assert.equal(select.disabled,true,'Quality profile locks while movie is requested');
 const cancelBtn=dialog.querySelector('[data-rh-cancel-request="901"]');
 assert.ok(cancelBtn,'Cancel request button appears immediately after requesting');
 cancelBtn.click();
 await settle();
 assert.deepEqual(calls.find(c=>c.path.endsWith('Cancel'))?.body,{requestId:901});
 assert.equal(dialog.querySelector('[data-rh-cancel-request]'),null,'Cancel button disappears after cancellation');
 assert.equal(confirmBtn.disabled,false,'Confirm request re-enables once cancelled');
 assert.equal(confirmBtn.textContent,'Confirm request');
 assert.equal(select.disabled,false,'Quality profile unlocks so user can pick a different quality and re-request');

 // 4. Opening an already-requested movie starts with Confirm request grayed out until cancelled
 win.JellyfinRequestHub.openDetails(alreadyRequestedMovie);
 await settle();
 dialog=document.querySelector('.rh-dialog');
 confirmBtn=[...dialog.querySelectorAll('button')].find(b=>b.classList.contains('rh-btn-primary'));
 assert.equal(confirmBtn.disabled,true,'already-requested movie opens with Confirm request grayed out');
 assert.equal(confirmBtn.textContent,'Already requested');
 const existingCancel=dialog.querySelector('[data-rh-cancel-request="256"]');
 assert.ok(existingCancel,'already-requested movie displays Cancel request button');
 existingCancel.click();
 await settle();
 assert.equal(confirmBtn.disabled,false,'cancelling existing request unlocks Confirm request');

 win.JellyfinRequestHub.stop();
});
