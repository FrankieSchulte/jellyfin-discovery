/* Jellyfin Request Hub: independent, authenticated Jellyseerr browser. */
(()=>{'use strict';
if(!Element.prototype.replaceChildren)Element.prototype.replaceChildren=function(...nodes){while(this.firstChild)this.removeChild(this.firstChild);this.append(...nodes);};
window.JellyfinRequestHub?.stop?.();
let root=null,mainHost=null,pageTitleNode=null,searchInput=null,searchTimer=null,subviewActive=false,hidden=[],generation=0,session='',timer,observer,gridScrollHandler=null;
const el=(tag,text='',cls='')=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
const button=(text,fn,cls='')=>{const n=el('button',text,cls);n.type='button';n.onclick=fn;return n;};
const scope=()=>{const api=window.ApiClient;return api?.getCurrentUserId?.()?`${api.serverId?.()}:${api.getCurrentUserId()}`:'';};
async function api(path,query={},body=null){
 const client=window.ApiClient,own=scope();if(!own)throw Error('Sign in to Jellyfin.');
 const result=body
  ?await client.ajax({url:client.getUrl('RequestHub/'+path),type:'POST',contentType:'application/json',dataType:'json',data:JSON.stringify(body)})
  :await client.getJSON(client.getUrl('RequestHub/'+path,query));
 if(scope()!==own)throw Error('Your account changed.');
 return result;
}
function clearGridScroll(){
 if(gridScrollHandler){
  window.removeEventListener('scroll',gridScrollHandler,true);
  gridScrollHandler=null;
 }
}
function restoreHidden(){
 hidden.forEach(n=>n.removeAttribute('data-rh-hidden'));
 hidden=[];
 document.querySelectorAll('[data-rh-hidden]').forEach(n=>n.removeAttribute('data-rh-hidden'));
}
function cleanup(){
 generation++;
 clearTimeout(searchTimer);
 clearGridScroll();
 root?.remove();
 root=null;
 mainHost=null;
 pageTitleNode=null;
 searchInput=null;
 subviewActive=false;
 document.documentElement?.removeAttribute('data-rh-active');
 document.documentElement?.removeAttribute('data-rh-subview');
 restoreHidden();
}
const STATUS_LABELS={2:'Pending',3:'Processing',4:'Partly available',5:'Available',6:'Unavailable'};
const STATUS_CLASSES={2:'rh-status-pending',3:'rh-status-processing',4:'rh-status-partial',5:'rh-status-available',6:'rh-status-unavailable'};
function isReleased(item){
 if(!['movie','tv'].includes(item?.type))return false;
 if(item.status>=4)return true;
 if(item.voteCount!==undefined&&Number(item.voteCount)<=0)return false;
 if(item.releaseDate!==undefined){
  const d=String(item.releaseDate||'').slice(0,10);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return false;
  const today=new Date().toISOString().slice(0,10);
  if(d>today)return false;
 }
 return true;
}
function poster(item){
 const frame=el('div','','rh-poster');
 if(item.poster){
  try{
   const u=new URL(item.poster);
   if(u.protocol==='https:'&&u.hostname==='image.tmdb.org'){
    const img=el('img');
    img.src=u.href;img.alt='';img.loading='lazy';
    img.onerror=()=>img.remove();
    frame.append(img);
   }
  }catch{}
 }
 frame.append(el('span',item.type==='tv'?'Series':'Movie','rh-type'));
 if(item.status>=2){
  frame.append(el('span',STATUS_LABELS[item.status]||'Requested',`rh-status ${STATUS_CLASSES[item.status]||''}`.trim()));
 }
 return frame;
}
async function details(item){
 const current=generation;
 let data;
 try{data=await api('Details',{type:item.type,id:item.id});}
 catch{
  if(root){
   const st=root.querySelector('[role="status"]');
   if(st)st.textContent='Could not load this title. Check your Request Hub account mapping.';
  }
  return;
 }
 if(current!==generation||!root)return;
 root.querySelectorAll('.rh-overlay').forEach(n=>n.remove());
 const overlay=el('div','','rh-overlay'),dialog=el('section','','rh-dialog');
 dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.tabIndex=-1;
 const previous=document.activeElement,close=()=>{overlay.remove();previous?.focus?.();};
 overlay.onclick=e=>{if(e.target===overlay)close();};
 const topBar=el('div','','rh-dialog-top');
 const closeBtn=button('Close',close,'rh-btn rh-btn-ghost rh-dialog-close');
 topBar.append(el('span',data.item.type==='tv'?'Series Request':'Movie Request','rh-dialog-kicker'),closeBtn);
 const body=el('div','','rh-dialog-body');
 const mediaCol=el('div','','rh-dialog-media');
 mediaCol.append(poster(data.item));
 const infoCol=el('div','','rh-dialog-info');
 infoCol.append(el('h2',data.item.title,'rh-dialog-title'));
 if(data.item.releaseDate||data.item.year){
  infoCol.append(el('div',String(data.item.releaseDate||data.item.year).slice(0,4),'rh-dialog-meta'));
 }
 infoCol.append(el('p',data.item.overview||'No synopsis available.','rh-dialog-overview'));
 const seasons=[];
 if(item.type==='tv'){
  const group=el('fieldset','','rh-seasons');
  const legend=el('legend','Choose seasons to request');
  const quickRow=el('div','','rh-season-actions');
  const grid=el('div','','rh-season-grid');
  const syncBoxes=()=>{
   seasons.length=0;
   grid.querySelectorAll('input[type="checkbox"]').forEach(b=>{
    const num=Number(b.dataset.seasonNumber);
    if(b.checked&&!seasons.includes(num))seasons.push(num);
    b.closest('label')?.classList?.toggle('is-checked',Boolean(b.checked));
   });
  };
  const selectAll=button('Select all',()=>{
   grid.querySelectorAll('input[type="checkbox"]').forEach(b=>{b.checked=true;});
   syncBoxes();
  },'rh-btn rh-btn-xs');
  const clearAll=button('Clear',()=>{
   grid.querySelectorAll('input[type="checkbox"]').forEach(b=>{b.checked=false;});
   syncBoxes();
  },'rh-btn rh-btn-xs');
  quickRow.append(selectAll,clearAll);
  group.append(legend,quickRow,grid);
  (data.seasons||[]).forEach(number=>{
   const label=el('label',number===0?'Specials':`Season ${number}`,'rh-season-chip');
   const box=el('input');
   box.type='checkbox';
   box.dataset.seasonNumber=String(number);
   box.onchange=()=>{
    const i=seasons.indexOf(number);
    if(box.checked&&i<0)seasons.push(number);
    else if(!box.checked&&i>=0)seasons.splice(i,1);
    label.classList?.toggle('is-checked',Boolean(box.checked));
   };
   label.prepend(box);
   grid.append(label);
  });
  infoCol.append(group);
 }
 const status=el('p','','rh-dialog-status');
 status.setAttribute('role','status');
 const actions=el('div','','rh-dialog-actions');
 const confirm=button('Confirm request',async()=>{
  if(item.type==='tv'&&!seasons.length){status.textContent='Select at least one season.';return;}
  confirm.disabled=true;
  status.textContent='Submitting request…';
  try{
   const result=await api('Request',{},{type:item.type,id:item.id,seasons});
   if(current!==generation||!overlay.isConnected)return;
   status.textContent=result.message||'Submitted for approval';
  }catch(e){
   if(overlay.isConnected){
    status.textContent=e?.status===403?'Request denied. Check permissions or quota.':e?.status===409?'Already requested.':e?.status===429?'Please wait before submitting another request.':'Request failed. Check Jellyseerr availability and try again.';
    confirm.disabled=false;
   }
  }
 },'rh-btn rh-btn-primary');
 confirm.disabled=!data.canRequest||data.item.status===5;
 if(data.item.status===5)status.textContent='Already available in Jellyfin.';
 actions.append(confirm);
 infoCol.append(actions,status);
 body.append(mediaCol,infoCol);
 dialog.append(topBar,body);
 overlay.append(dialog);
 root.append(overlay);
 dialog.focus();
 overlay.onkeydown=e=>{
  if(e.key==='Escape'||[10009,461].includes(e.keyCode)){e.preventDefault();e.stopPropagation();close();}
  if(e.key==='Tab'){
   const controls=[...dialog.querySelectorAll('button,input')].filter(n=>!n.disabled),i=controls.indexOf(document.activeElement);
   if(e.shiftKey&&i<=0||!e.shiftKey&&i===controls.length-1){e.preventDefault();controls[e.shiftKey?controls.length-1:0]?.focus();}
  }
 };
}
function card(item){
 const n=button('',()=>details(item),'rh-card');
 const meta=el('div','','rh-card-body');
 meta.append(el('strong',item.title));
 n.append(poster(item),meta);
 return n;
}
function seeMoreCard(title,onOpen){
 const n=button('',onOpen,'rh-card rh-see-more');
 n.dataset.rhSeeMore='true';
 n.setAttribute('aria-label',`See more ${title}`);
 const frame=el('div','','rh-poster rh-see-more-poster');
 const icon=el('span','→','rh-see-more-arrow');
 const label=el('span','See More','rh-see-more-title');
 const sub=el('span',title,'rh-see-more-sub');
 frame.append(icon,label,sub);
 const meta=el('div','','rh-card-body');
 meta.append(el('strong',`All ${title}`));
 n.append(frame,meta);
 return n;
}
function syncHeaderActive(){
 const active=isDiscoverHash();
 const highlight=active&&!subviewActive;
 if(active){
  document.documentElement?.setAttribute('data-rh-active','true');
  document.documentElement?.setAttribute('data-rh-subview',subviewActive?'true':'false');
 }else{
  document.documentElement?.removeAttribute('data-rh-active');
  document.documentElement?.removeAttribute('data-rh-subview');
 }
 document.querySelectorAll('[data-rh-link],[data-rh-source]').forEach(n=>{
  if(highlight){
   n.setAttribute('aria-current','page');
   n.dataset.sleekfinCurrent='true';
  }else{
   n.removeAttribute('aria-current');
   delete n.dataset.sleekfinCurrent;
  }
 });
 const proxy=document.querySelector('[data-sleekfin-header-proxy]');
 if(proxy&&active){
  proxy.querySelectorAll('[data-sleekfin-header-proxy-item="jellyfin:home"]').forEach(n=>{
   delete n.dataset.sleekfinCurrent;
   n.removeAttribute('aria-current');
  });
 }
}
function returnToOverview(clearSearch=true){
 if(!root||!mainHost)return;
 clearTimeout(searchTimer);
 generation++;
 clearGridScroll();
 subviewActive=false;
 if(clearSearch&&searchInput)searchInput.value='';
 if(pageTitleNode)pageTitleNode.textContent='Discover';
 syncHeaderActive();
 setTimeout(syncHeaderActive,50);
 mainHost.replaceChildren();
 home(mainHost);
}
async function gridView(host,title,kind,filter=null,query=null){
 clearGridScroll();
 subviewActive=true;
 if(pageTitleNode)pageTitleNode.textContent=title;
 syncHeaderActive();
 setTimeout(syncHeaderActive,50);
 const token=generation;
 const sec=el('section','','rh-grid-section');
 const grid=el('div','','rh-grid');
 const status=el('p','','rh-row-status');
 status.setAttribute('role','status');
 const footer=el('div','','rh-grid-footer');
 let page=0,pages=1,busy=false;
 const moreBtn=button('Load more',()=>loadBatch(),'rh-btn');
 footer.append(moreBtn);
 sec.append(grid,status,footer);
 host.append(sec);

 async function loadBatch(){
  if(busy||page>=pages||grid.children.length>=300)return;
  busy=true;
  moreBtn.disabled=true;
  moreBtn.textContent='Loading…';
  try{
   let added=0;
   const frag=document.createDocumentFragment();
   while(page<pages&&added<20&&grid.children.length+added<300){
    const data=await api('Browse',{kind,page:page+1,...(filter?{filter}:{}),...(query?{query}:{})});
    if(token!==generation||!sec.isConnected)return;
    page++;
    pages=data.pages||1;
    const items=(data.results||[]).filter(isReleased);
    items.forEach(i=>{frag.append(card(i));added++;});
    if(!data.results?.length)break;
   }
   if(added>0)grid.append(frag);
   status.textContent=grid.children.length?'':'No released titles found.';
   footer.hidden=page>=pages||grid.children.length>=300;
  }catch{
   if(sec.isConnected)status.textContent='Could not load titles. Check Request Hub configuration and your account mapping.';
  }finally{
   busy=false;
   if(sec.isConnected){
    moreBtn.disabled=false;
    moreBtn.textContent='Load more';
   }
  }
 }
 gridScrollHandler=()=>{
  if(!sec.isConnected||token!==generation){clearGridScroll();return;}
  const rect=footer.getBoundingClientRect();
  if(rect.top<window.innerHeight+900)loadBatch();
 };
 window.addEventListener('scroll',gridScrollHandler,{passive:true,capture:true});
 await loadBatch();
}
async function rail(host,title,kind,filter=null,query=null){
 const token=generation,row=el('section','','rh-row'),head=el('div','','rh-row-head'),controls=el('div','','rh-row-controls'),track=el('div','','rh-track'),status=el('p','','rh-row-status');
 status.setAttribute('role','status');
 let page=0,pages=1,busy=false;
 const openFullGrid=()=>{
  generation++;
  host.replaceChildren();
  gridView(host,title,kind,filter,query);
 };
 const tailCard=seeMoreCard(title,openFullGrid);
 const load=async()=>{
  if(busy||page>=pages||track.querySelectorAll('.rh-card:not(.rh-see-more)').length>=160)return;
  busy=true;
  try{
   let added=0;
   const frag=document.createDocumentFragment();
   while(page<pages&&added<12){
    const data=await api('Browse',{kind,page:page+1,...(filter?{filter}:{}),...(query?{query}:{})});
    if(token!==generation||!row.isConnected)return;
    page++;pages=data.pages||1;
    const valid=(data.results||[]).filter(isReleased);
    valid.forEach(i=>{
     frag.append(card(i));
     added++;
    });
    if(!data.results?.length)break;
   }
   const savedLeft=track.scrollLeft;
   if(added>0){
    if(tailCard.parentNode===track)track.insertBefore(frag,tailCard);
    else track.append(frag);
   }
   const realCards=track.querySelectorAll('.rh-card:not(.rh-see-more)').length;
   if(realCards>0&&tailCard.parentNode!==track)track.append(tailCard);
   if(track.scrollLeft!==savedLeft)track.scrollLeft=savedLeft;
   status.textContent=realCards?'':'No titles found.';
  }catch{
   if(row.isConnected)status.textContent='Could not load titles. Check Request Hub configuration and your account mapping.';
  }finally{busy=false;}
 };
 const prevBtn=button('‹',()=>track.scrollBy({left:-Math.max(260,track.clientWidth*.82),behavior:'smooth'}),'rh-row-arrow');
 prevBtn.setAttribute('aria-label',`Previous ${title}`);
 const nextBtn=button('›',async()=>{
  if(track.scrollLeft+track.clientWidth>=track.scrollWidth-320&&page<pages)await load();
  track.scrollBy({left:Math.max(260,track.clientWidth*.82),behavior:'smooth'});
 },'rh-row-arrow');
 nextBtn.setAttribute('aria-label',`More ${title}`);
 controls.append(prevBtn,nextBtn);
 const heading=el('h2',title);
 heading.onclick=openFullGrid;
 heading.title=`View all ${title}`;
 head.append(heading,controls);
 track.addEventListener('scroll',()=>{if(track.scrollLeft+track.clientWidth>=track.scrollWidth-520&&track.querySelectorAll('.rh-card:not(.rh-see-more)').length<160)load();},{passive:true});
 row.append(head,track,status);
 host.append(row);
 await load();
}
async function render(){
 const token=generation,toolbar=el('div','','rh-toolbar'),main=el('div','','rh-main'),search=el('form','','rh-search'),searchIcon=el('span','','material-icons search rh-search-icon'),input=el('input');
 mainHost=main;
 searchInput=input;
 searchIcon.setAttribute('aria-hidden','true');
 input.type='search';input.placeholder='Search new movies and TV';input.setAttribute('aria-label','Search new movies and TV');input.autocomplete='off';
 search.append(searchIcon,input);
 const runSearch=()=>{
  clearTimeout(searchTimer);
  if(!root?.isConnected||!mainHost)return;
  const q=input.value.trim();
  if(!q){
   if(subviewActive)returnToOverview(false);
   return;
  }
  generation++;
  clearGridScroll();
  main.replaceChildren();
  gridView(main,`Search: "${q}"`,'search',null,q);
 };
 input.addEventListener('input',()=>{
  clearTimeout(searchTimer);
  if(!input.value.trim()){
   runSearch();
   return;
  }
  searchTimer=setTimeout(runSearch,240);
 });
 search.onsubmit=e=>{
  e.preventDefault();
  runSearch();
 };
 const titleH1=el('h1','Discover','rh-page-title');
 pageTitleNode=titleH1;
 titleH1.onclick=()=>{if(subviewActive)returnToOverview();};
 titleH1.title='Return to Discover overview';
 const actionsWrap=el('div','','rh-toolbar-right');
 actionsWrap.append(search);
 toolbar.append(titleH1,actionsWrap);
 root.append(toolbar,main);
 await home(main);
 if(token!==generation)return;
 const q=new URLSearchParams(location.hash.split('?')[1]||''),type=q.get('mediaType'),id=Number(q.get('mediaId'));
 if(['movie','tv'].includes(type)&&id>0)details({type,id});
}
async function home(main){
 subviewActive=false;
 if(pageTitleNode)pageTitleNode.textContent='Discover';
 syncHeaderActive();
 clearGridScroll();
 const token=generation;
 await rail(main,'Trending Now','trending');
 if(token!==generation)return;
 await rail(main,'Popular Movies','movies');
 if(token!==generation)return;
 const pillGrid=el('div','','rh-filter-sections');
 const genres=el('section','','rh-pill-section');
 genres.append(el('h2','Movie Genres'));
 const genreList=el('div','','rh-pills');
 genres.append(genreList);
 pillGrid.append(genres);
 const studios=el('section','','rh-pill-section');
 studios.append(el('h2','Studios'));
 const studioList=el('div','','rh-pills');
 [[2,'Disney'],[3,'Pixar'],[420,'Marvel Studios'],[174,'Warner Bros.'],[21,'MGM'],[521,'DreamWorks'],[33,'Universal'],[4,'Paramount'],[34,'Sony Pictures'],[41077,'A24']].forEach(([id,name])=>{
  studioList.append(button(name,()=>{generation++;main.replaceChildren();gridView(main,name,'studio',id);},'rh-chip'));
 });
 studios.append(studioList);
 pillGrid.append(studios);
 const networks=el('section','','rh-pill-section');
 networks.append(el('h2','Networks'));
 const networkList=el('div','','rh-pills');
 [[213,'Netflix'],[2739,'Disney+'],[1024,'Prime Video'],[2552,'Apple TV+'],[49,'HBO'],[453,'Hulu'],[4330,'Paramount+'],[3353,'Peacock'],[88,'FX'],[174,'AMC'],[67,'Showtime'],[80,'Adult Swim']].forEach(([id,name])=>{
  networkList.append(button(name,()=>{generation++;main.replaceChildren();gridView(main,name,'network',id);},'rh-chip'));
 });
 networks.append(networkList);
 pillGrid.append(networks);
 try{
  const data=await api('Browse',{kind:'genres'});
  if(token!==generation)return;
  (data.results||[]).forEach(g=>genreList.append(button(g.name,()=>{generation++;main.replaceChildren();gridView(main,g.name,'genre',g.id);},'rh-chip')));
 }catch{
  genreList.append(el('p','Genres are unavailable.','rh-muted'));
 }
 if(token!==generation)return;
 main.append(pillGrid);
 await rail(main,'Popular Series','tv');
}
function openDiscoverRoute(e){
 e?.preventDefault?.();
 if(isDiscoverHash()&&root?.isConnected&&subviewActive){
  returnToOverview();
  return;
 }
 if(location.hash!=='#/home?requesthub=discover'){
  location.hash='#/home?requesthub=discover';
 }
 reconcile();
 setTimeout(reconcile,40);
 setTimeout(reconcile,150);
}
function ensureNavigation(active){
 const headerLeft=document.querySelector('.skinHeader .headerLeft');
 if(headerLeft&&!headerLeft.querySelector('[data-rh-source]')){
  const src=el('button','','headerButton headerButtonLeft rh-source-btn');
  src.type='button';
  src.dataset.rhSource='true';
  src.dataset.headerLabel='Discover';
  src.title='Discover';
  src.setAttribute('aria-label','Discover');
  const icon=el('span','','material-icons explore');
  icon.setAttribute('aria-hidden','true');
  const label=el('span','Discover','emby-button-foreground');
  src.append(icon,label);
  src.onclick=openDiscoverRoute;
  headerLeft.append(src);
 }
 const proxy=document.querySelector('[data-sleekfin-header-proxy]');
 if(proxy){
  document.querySelectorAll('[data-rh-link]').forEach(n=>{if(!proxy.contains(n))n.remove();});
  const nativeProxyBtn=proxy.querySelector('[data-sleekfin-header-proxy-item="dom:toolbar-discover"]');
  if(nativeProxyBtn){
   nativeProxyBtn.dataset.rhLink='true';
   nativeProxyBtn.onclick=openDiscoverRoute;
  }else if(!proxy.querySelector('[data-rh-link]')){
   const sampleTab=proxy.querySelector('[data-sleekfin-header-proxy-item="jellyfin:home"],[data-sleekfin-header-proxy-item="jellyfin:movies"]');
   const btn=button('',openDiscoverRoute,'rh-nav');
   btn.dataset.rhLink='true';
   btn.dataset.sleekfinHeaderProxyItem='requesthub:discover';
   btn.dataset.sleekfinHeaderZone='tabs';
   btn.dataset.sleekfinHeaderDisplay=sampleTab?.dataset?.sleekfinHeaderDisplay||'both';
   btn.title='Discover';
   btn.setAttribute('aria-label','Discover');
   const vis=el('span','');
   vis.dataset.sleekfinHeaderSourceVisual='true';
   const icon=el('span','','material-icons explore');
   icon.dataset.sleekfinHeaderSourceIcon='true';
   icon.setAttribute('aria-hidden','true');
   const label=el('span','Discover');
   label.dataset.sleekfinHeaderSourceLabel='true';
   vis.append(icon,label);
   btn.append(vis);
   const anchor=proxy.querySelector('[data-sleekfin-header-separator],[data-sleekfin-header-proxy-item="jellyfin:search"],[data-sleekfin-header-proxy-item="jellyfin:user-menu"],[data-sleekfin-header-overflow-toggle]');
   if(anchor&&anchor.parentNode===proxy)proxy.insertBefore(btn,anchor);
   else proxy.append(btn);
  }
 }else{
  const nav=document.querySelector('.headerTabs')||document.querySelector('.userPreferencesPage')||document.querySelector('.skinHeader');
  if(nav&&!nav.querySelector('[data-rh-link]')){
   const link=el('a','Discover','rh-nav');
   link.href='#/home?requesthub=discover';
   link.dataset.rhLink='true';
   link.onclick=openDiscoverRoute;
   nav.append(link);
  }
 }
 syncHeaderActive();
}
function isDiscoverHash(){
 const h=String(location.hash||'');
 return /[?&]requesthub=discover(?:&|$)/i.test(h)&&(/^#!?(?:\/)?home(?:\.html)?(?:[?#]|$)/i.test(h)||h.startsWith('?requesthub=discover'));
}
function handleRemoteKey(e){
 if(!root?.isConnected)return;
 const key=({37:'ArrowLeft',38:'ArrowUp',39:'ArrowRight',40:'ArrowDown',13:'Enter',27:'Escape',10009:'Escape',461:'Escape'}[e.keyCode])||e.key;
 const overlay=root.querySelector('.rh-overlay');
 if(overlay)return;
 const target=e.target||document.activeElement;
 if(key==='Escape'){
  if(subviewActive){
   e.preventDefault();
   e.stopPropagation();
   returnToOverview();
  }
  return;
 }
 if(target?.matches?.('input,textarea,select')&&!['ArrowDown','ArrowUp'].includes(key))return;
 if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(key))return;
 if(!root.contains(target)&&target!==document.body)return;
 const focusables=[...root.querySelectorAll('.rh-toolbar input,.rh-toolbar button,.rh-back-btn,.rh-card,.rh-chip,.rh-grid-footer button')].filter(n=>!n.disabled&&!n.closest('[hidden]'));
 if(!focusables.length)return;
 const current=focusables.includes(target)?target:null;
 if(!current){
  if(key==='ArrowDown'){
   e.preventDefault();
   const first=root.querySelector('.rh-card,.rh-chip')||focusables[0];
   first?.focus?.({preventScroll:true});
   first?.scrollIntoView?.({block:'nearest',inline:'nearest'});
  }
  return;
 }
 const track=current.closest?.('.rh-track');
 if(track&&(key==='ArrowLeft'||key==='ArrowRight')){
  const rowCards=[...track.querySelectorAll('.rh-card')];
  const idx=rowCards.indexOf(current);
  if(idx>=0){
   e.preventDefault();
   const next=rowCards[Math.max(0,Math.min(rowCards.length-1,idx+(key==='ArrowLeft'?-1:1)))];
   next?.focus?.({preventScroll:true});
   next?.scrollIntoView?.({block:'nearest',inline:'nearest',behavior:'smooth'});
   return;
  }
 }
 if(typeof current.getBoundingClientRect==='function'){
  const rect=current.getBoundingClientRect();
  if(rect.width>0||rect.height>0){
   const cx=(rect.left+rect.right)/2,cy=(rect.top+rect.bottom)/2;
   const ranked=focusables.filter(n=>n!==current).map(node=>{
    const r=node.getBoundingClientRect();
    const nx=(r.left+r.right)/2-cx,ny=(r.top+r.bottom)/2-cy;
    const primary=key==='ArrowLeft'?-nx:key==='ArrowRight'?nx:key==='ArrowUp'?-ny:ny;
    const cross=Math.abs(key==='ArrowLeft'||key==='ArrowRight'?ny:nx);
    return{node,primary,score:primary+cross*2.6};
   }).filter(x=>x.primary>4).sort((a,b)=>a.score-b.score);
   if(ranked.length){
    e.preventDefault();
    ranked[0].node.focus?.({preventScroll:true});
    ranked[0].node.scrollIntoView?.({block:'nearest',inline:'nearest',behavior:'smooth'});
   }
  }
 }
}
function reconcile(){
 const own=scope();
 if(session&&own!==session)cleanup();
 session=own;
 if(!own){
  document.querySelectorAll('[data-rh-link],[data-rh-source]').forEach(n=>n.remove());
  cleanup();
  return;
 }
 const active=isDiscoverHash();
 ensureNavigation(active);
 if(!active){
  if(root)cleanup();
  return;
 }
 document.documentElement?.classList?.remove('sleekfin-hero-boot-loading','sleekfin-hero-loading');
 const candidates=[...document.querySelectorAll('#indexPage,.homePage')];
 const page=candidates.find(n=>!n.closest('.hide,.hidePage,[hidden]'))||candidates[0];
 if(!page)return;
 if(root?.isConnected&&root.parentNode===page){
  [...page.children].forEach(n=>{
   if(n!==root&&n.dataset.rhHidden!=='true'){
    n.dataset.rhHidden='true';
    hidden.push(n);
   }
  });
  return;
 }
 cleanup();
 root=el('div','','rh-root');
 [...page.children].forEach(n=>{
  n.dataset.rhHidden='true';
  hidden.push(n);
 });
 page.append(root);
 render();
}
const css=el('style');
css.textContent=`
[data-rh-hidden=true]{display:none!important}
.rh-source-btn{display:none!important}
html[data-rh-active="true"] [data-sleekfin-header-proxy] > button[data-sleekfin-header-proxy-item="jellyfin:home"],
html[data-rh-active="true"][data-rh-subview="true"] [data-sleekfin-header-proxy] > button[data-rh-link="true"]{
 background:transparent!important;
 color:var(--sleekfin-header-item-text, rgba(255,255,255,0.7))!important;
 box-shadow:none!important;
}
[data-sleekfin-header-proxy] button[data-rh-link="true"] [data-sleekfin-header-source-visual="true"]{
 display:inline-flex!important;
 align-items:center!important;
 justify-content:center!important;
 gap:0.42rem!important;
 line-height:1!important;
 vertical-align:middle!important;
}
[data-sleekfin-header-proxy] button[data-rh-link="true"] [data-sleekfin-header-source-icon="true"]{
 display:inline-flex!important;
 align-items:center!important;
 justify-content:center!important;
 font-size:1.15rem!important;
 width:1.15rem!important;
 height:1.15rem!important;
 line-height:1!important;
 flex-shrink:0!important;
}
[data-sleekfin-header-proxy] button[data-rh-link="true"] [data-sleekfin-header-source-label="true"]{
 display:inline-block!important;
 line-height:1!important;
}
.rh-root,.rh-main,.rh-row,.rh-track,.rh-see-more,.rh-row-status,.rh-grid-section,.rh-grid,.rh-grid-footer{
 overflow-anchor:none;
}
.rh-root{
 padding:calc(var(--sleekfin-header-height, 72px) + 12px) clamp(16px, 4vw, 80px) 48px;
 color:inherit;
 width:100%;
 clear:both;
 box-sizing:border-box;
 font-family:inherit;
}
.rh-toolbar{
 display:flex;
 flex-wrap:wrap;
 align-items:center;
 justify-content:space-between;
 gap:14px;
 margin:4px 0 22px;
}
.rh-page-title{
 font-size:28px;
 font-weight:700;
 margin:0 auto 0 0;
 border-left:3px solid #e50914;
 padding-left:12px;
 color:#fff;
 cursor:pointer;
 user-select:none;
}
.rh-toolbar-right{
 display:flex;
 flex-wrap:wrap;
 align-items:center;
 gap:10px;
}
.rh-search{
 position:relative;
 display:flex;
 align-items:center;
}
.rh-search-icon{
 position:absolute;
 left:14px;
 font-size:1.2rem;
 line-height:1;
 color:rgba(255,255,255,0.45);
 pointer-events:none;
 user-select:none;
}
.rh-search input{
 width:clamp(240px, 26vw, 360px);
 font:inherit;
 font-size:0.92rem;
 color:#fff;
 background:#222;
 border:1px solid #555;
 border-radius:22px;
 padding:10px 16px 10px 40px;
 min-width:0;
}
.rh-search input::placeholder{
 color:rgba(255,255,255,0.48);
}
.rh-search input:focus{
 outline:none;
 border-color:#e50914;
}
.rh-root button{
 font:inherit;
 color:#fff;
 background:#292929;
 border:1px solid #555;
 border-radius:22px;
 min-height:42px;
 padding:9px 16px;
 font-weight:600;
 font-size:0.9rem;
 cursor:pointer;
 touch-action:manipulation;
}
.rh-root button:hover:not(:disabled){
 background:#454545;
}
.rh-root button:disabled{
 opacity:0.45;
 cursor:default;
}
.rh-root button.rh-btn-primary{
 background:#e50914;
 border-color:#ff2a35;
 color:#fff;
}
.rh-root button.rh-btn-primary:hover:not(:disabled){
 background:#f6121d;
}
.rh-root button.rh-btn-xs{
 min-height:32px;
 padding:4px 12px;
 font-size:0.8rem;
}
.rh-root button:focus-visible,.rh-root .rh-card:focus,.rh-nav:focus-visible{
 outline:3px solid #fff;
 outline-offset:3px;
 box-shadow:0 0 0 5px rgba(229,9,20,0.5);
}
a.rh-nav{
 color:inherit;
 text-decoration:none;
 padding:8px 14px;
 border-radius:999px;
 display:inline-flex;
 align-items:center;
 gap:6px;
 font-weight:600;
}
a.rh-nav[aria-current=page]{
 background:rgba(255,255,255,0.16);
 color:#fff;
 font-weight:700;
}
.rh-row{margin:0 0 22px;min-width:0}
.rh-row-head{
 display:flex;
 align-items:center;
 gap:10px;
 margin-bottom:14px;
}
.rh-row-head h2,.rh-pill-section h2,.rh-grid-heading{
 border-left:3px solid #e50914;
 padding-left:10px;
 margin:0 auto 0 0;
 font-size:clamp(19px, 1.7vw, 28px);
 font-weight:600;
 color:#fff;
}
.rh-row-head h2{cursor:pointer}
.rh-row-head h2:hover{text-decoration:underline}
.rh-row-controls{
 display:flex;
 align-items:center;
 gap:4px;
}
.rh-root button.rh-row-arrow{
 padding:3px 11px;
 font-size:22px;
 border:0;
 background:transparent;
 border-radius:8px;
 min-height:40px;
}
.rh-root button.rh-row-arrow:hover{
 background:rgba(255,255,255,0.1);
}
.rh-track{
 display:flex;
 gap:14px;
 overflow-x:auto;
 padding:4px 3px 12px;
 scrollbar-width:none;
 -ms-overflow-style:none;
}
.rh-track::-webkit-scrollbar{display:none;width:0;height:0}
.rh-card{
 position:relative;
 flex:0 0 clamp(135px, 14vw, 205px);
 width:clamp(135px, 14vw, 205px);
 max-width:clamp(135px, 14vw, 205px);
 text-align:left;
 border:0!important;
 padding:0!important;
 background:transparent!important;
 border-radius:9px!important;
 min-width:0;
}
.rh-poster{
 position:relative;
 aspect-ratio:2/3;
 background:#20252a;
 border-radius:9px;
 overflow:hidden;
}
.rh-poster img{
 height:100%;
 width:100%;
 object-fit:cover;
 display:block;
}
.rh-see-more-poster{
 display:flex;
 flex-direction:column;
 align-items:center;
 justify-content:center;
 gap:10px;
 padding:16px;
 box-sizing:border-box;
 text-align:center;
 background:linear-gradient(155deg, rgba(229,9,20,0.22) 0%, rgba(28,30,38,0.95) 100%);
 border:1px solid rgba(255,255,255,0.14);
 transition:background .15s ease, border-color .15s ease;
}
.rh-see-more:hover .rh-see-more-poster{
 background:linear-gradient(155deg, rgba(229,9,20,0.36) 0%, rgba(36,38,48,0.98) 100%);
 border-color:#e50914;
}
.rh-see-more-arrow{
 width:48px;
 height:48px;
 border-radius:50%;
 display:grid;
 place-items:center;
 font-size:24px;
 font-weight:700;
 background:rgba(229,9,20,0.85);
 color:#fff;
}
.rh-see-more-title{
 font-size:1rem;
 font-weight:800;
 color:#fff;
}
.rh-see-more-sub{
 font-size:0.8rem;
 color:rgba(255,255,255,0.68);
}
.rh-type,.rh-status{
 position:absolute;
 left:8px;
 border-radius:999px;
 padding:3px 9px;
 font-size:11px;
 font-weight:700;
 letter-spacing:0.03em;
 backdrop-filter:blur(8px);
 box-shadow:0 4px 10px rgba(0,0,0,0.45);
}
.rh-type{
 top:8px;
 background:rgba(18,22,34,0.84);
 border:1px solid rgba(255,255,255,0.16);
 color:#e5e7eb;
}
.rh-status{
 bottom:8px;
 background:rgba(22,101,52,0.92);
 border:1px solid rgba(74,222,128,0.35);
 color:#ecfdf5;
}
.rh-status-pending,.rh-status-processing{
 background:rgba(161,98,7,0.92);
 border-color:rgba(250,204,21,0.4);
 color:#fef9c3;
}
.rh-status-unavailable{
 background:rgba(153,27,27,0.92);
 border-color:rgba(248,113,113,0.4);
 color:#fee2e2;
}
.rh-card-body{padding:8px 2px 0}
.rh-card strong{
 display:block;
 font-size:14px;
 font-weight:700;
 color:inherit;
 white-space:nowrap;
 overflow:hidden;
 text-overflow:ellipsis;
}
.rh-card:hover strong{
 color:#fff;
 text-decoration:underline;
}
.rh-row-status{
 margin:6px 0 0;
 font-size:0.88rem;
 color:#ccc;
}
.rh-row-status:empty{display:none}
.rh-grid-section{margin-bottom:36px}
.rh-grid-head{
 display:flex;
 flex-wrap:wrap;
 align-items:center;
 gap:14px;
 margin-bottom:20px;
}
.rh-grid{
 display:grid;
 grid-template-columns:repeat(auto-fill, minmax(clamp(135px, 13vw, 195px), 1fr));
 gap:22px 16px;
}
.rh-grid .rh-card{
 width:100%;
 max-width:none;
 flex:none;
}
.rh-grid-footer{
 text-align:center;
 padding:28px 0 12px;
}
.rh-filter-sections{
 display:grid;
 grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
 gap:20px;
 margin:12px 0 26px;
}
.rh-pill-section{
 background:rgba(24,24,28,0.72);
 border:1px solid rgba(255,255,255,0.09);
 border-radius:12px;
 padding:18px 20px;
}
.rh-pills{
 display:flex;
 flex-wrap:wrap;
 gap:8px;
 margin-top:14px;
}
.rh-root button.rh-chip{
 min-height:38px;
 padding:7px 15px;
 font-size:0.86rem;
 background:#242429;
 border:1px solid #4a4a52;
}
.rh-root button.rh-chip:hover{
 background:rgba(229,9,20,0.22);
 border-color:#e50914;
 color:#fff;
}
.rh-overlay{
 position:fixed;
 inset:0;
 background:rgba(5,5,9,0.82);
 backdrop-filter:blur(10px);
 z-index:100002;
 display:grid;
 place-items:center;
 padding:20px;
}
.rh-dialog{
 background:#16171d;
 color:#f5f5f7;
 max-width:740px;
 width:min(92vw,740px);
 max-height:88vh;
 overflow:auto;
 padding:24px 28px 28px;
 border-radius:20px;
 border:1px solid rgba(255,255,255,0.12);
 box-shadow:0 28px 72px rgba(0,0,0,0.68);
 box-sizing:border-box;
}
.rh-dialog-top{
 display:flex;
 align-items:center;
 justify-content:space-between;
 gap:12px;
 margin-bottom:18px;
}
.rh-dialog-kicker{
 font-size:0.75rem;
 font-weight:700;
 text-transform:uppercase;
 letter-spacing:0.1em;
 color:#ff5a64;
}
.rh-dialog-body{
 display:grid;
 grid-template-columns:190px minmax(0,1fr);
 gap:24px;
 align-items:start;
}
.rh-dialog .rh-poster{width:100%}
.rh-dialog-title{
 margin:0 0 6px;
 font-size:1.55rem;
 font-weight:800;
 color:#fff;
}
.rh-dialog-meta{
 font-size:0.88rem;
 color:rgba(255,255,255,0.6);
 margin-bottom:12px;
}
.rh-dialog-overview{
 margin:0 0 18px;
 line-height:1.55;
 color:rgba(255,255,255,0.82);
 font-size:0.95rem;
}
.rh-seasons{
 border:1px solid rgba(255,255,255,0.12);
 border-radius:14px;
 padding:14px 16px;
 margin:0 0 18px;
 background:rgba(0,0,0,0.24);
}
.rh-seasons legend{
 padding:0 8px;
 font-weight:700;
 font-size:0.9rem;
 color:#fff;
}
.rh-season-actions{
 display:flex;
 gap:8px;
 margin-bottom:10px;
}
.rh-season-grid{
 display:flex;
 flex-wrap:wrap;
 gap:8px;
}
.rh-season-chip{
 display:inline-flex;
 align-items:center;
 gap:8px;
 padding:7px 12px;
 border-radius:999px;
 background:rgba(255,255,255,0.06);
 border:1px solid rgba(255,255,255,0.14);
 font-size:0.86rem;
 font-weight:600;
 cursor:pointer;
 user-select:none;
}
.rh-season-chip.is-checked{
 background:rgba(229,9,20,0.2);
 border-color:#e50914;
 color:#fff;
}
.rh-dialog-actions{
 display:flex;
 align-items:center;
 gap:12px;
}
.rh-dialog-status{
 margin:12px 0 0;
 font-size:0.92rem;
 font-weight:600;
 color:#fde047;
}
.rh-dialog-status:empty{display:none}
@supports not (aspect-ratio:2/3){
 .rh-poster{height:0;padding-bottom:150%}
 .rh-poster img{position:absolute;top:0;left:0}
}
@media(max-width:640px){
 .rh-root{padding:calc(var(--sleekfin-header-height, 64px) + 10px) 16px 32px}
 .rh-card{flex-basis:38vw;width:38vw;max-width:38vw}
 .rh-grid{grid-template-columns:repeat(auto-fill, minmax(38vw, 1fr))}
 .rh-search input{width:100%}
 .rh-dialog-body{grid-template-columns:1fr}
 .rh-dialog .rh-poster{max-width:160px}
}
`;
document.head.append(css);
observer=new MutationObserver(records=>{
 if(records.some(r=>!r.target?.closest?.('.rh-root,[data-rh-link],[data-rh-source],.fx-discovery,.fx-dialog,.fx-inline-studio'))){
  clearTimeout(timer);
  timer=setTimeout(reconcile,80);
 }
});
observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});
window.addEventListener('hashchange',reconcile);
window.addEventListener('popstate',reconcile);
document.addEventListener?.('viewshow',reconcile);
document.addEventListener?.('pageshow',reconcile);
document.addEventListener?.('keydown',handleRemoteKey,true);
const heartbeat=setInterval(reconcile,1500);
window.JellyfinRequestHub={
 stop(){
  cleanup();
  observer.disconnect();
  clearTimeout(timer);
  clearInterval(heartbeat);
  window.removeEventListener('hashchange',reconcile);
  window.removeEventListener('popstate',reconcile);
  document.removeEventListener?.('viewshow',reconcile);
  document.removeEventListener?.('pageshow',reconcile);
  document.removeEventListener?.('keydown',handleRemoteKey,true);
  document.querySelectorAll('[data-rh-link],[data-rh-source]').forEach(n=>n.remove());
  css.remove();
 }
};
reconcile();
})();
