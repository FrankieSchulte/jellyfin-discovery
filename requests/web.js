/* Jellyfin Request Hub: independent, authenticated Jellyseerr browser. */
(()=>{'use strict';
if(!Element.prototype.replaceChildren)Element.prototype.replaceChildren=function(...nodes){while(this.firstChild)this.removeChild(this.firstChild);this.append(...nodes);};
window.JellyfinRequestHub?.stop?.();
let root=null,mainHost=null,pageTitleNode=null,searchInput=null,searchTimer=null,subviewActive=false,lastRouteView='',hidden=[],generation=0,session='',timer,observer,gridScrollHandler=null,permScope='',permAllowed=null,permPending=null;
const el=(tag,text='',cls='')=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
const button=(text,fn,cls='')=>{const n=el('button',text,cls);n.type='button';n.onclick=fn;return n;};
const scope=()=>{const api=window.ApiClient;return api?.getCurrentUserId?.()?`${api.serverId?.()}:${api.getCurrentUserId()}`:'';};
function removeNavigation(){
 document.querySelectorAll('[data-rh-link],[data-rh-source]').forEach(n=>n.remove());
}
function updatePermission(own,canReq){
 if(scope()!==own)return;
 permScope=own;
 permAllowed=Boolean(canReq);
 if(!permAllowed)removeNavigation();
 else ensureNavigation(isDiscoverHash());
}
function checkPermission(own){
 if(!own)return;
 if(permScope===own&&(permAllowed!==null||permPending))return;
 permScope=own;
 permPending=api('Status').then(res=>{
  permPending=null;
  updatePermission(own,res?.canRequest===true);
 }).catch(()=>{
  permPending=null;
  updatePermission(own,false);
 });
}
async function api(path,query={},body=null){
 const client=window.ApiClient,own=scope();if(!own)throw Error('Sign in to Jellyfin.');
 const result=body
  ?await client.ajax({url:client.getUrl('RequestHub/'+path),type:'POST',contentType:'application/json',dataType:'json',data:JSON.stringify(body)})
  :await client.getJSON(client.getUrl('RequestHub/'+path,query));
 if(scope()!==own)throw Error('Your account changed.');
 if(typeof result?.canRequest==='boolean')updatePermission(own,result.canRequest);
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
const GENRE_COLORS={
 28:'801c13,e3968f',12:'5c1480,c068eb',16:'005580,82c7eb',35:'997700,f2d15a',
 80:'002b80,7aa3f5',99:'00663d,73e6b8',18:'471078,b47ae8',10751:'6e8000,d6ed47',
 14:'0f3f7a,78b0f5',36:'804000,f0a860',27:'262626,ababab',10402:'002b80,7aa3f5',
 9648:'520066,d46eed',10749:'991f5c,f57ab8',878:'2f5266,8bc2e0',10770:'8c1919,eb7373',
 53:'005c66,6edee8',10752:'731d17,e67f78',37:'803c10,e89b68',0:'1f2937,9ca3af'
};
const GENRE_DEFAULT_BACKDROPS={
 28:'/wRxLAw4l17LqiFcPLkobriPTZAw.jpg',12:'/adkWjKeklbfVIw9y2KKPSCwZl9N.jpg',16:'/4fLZUr1e65hKPPVw0R3PmKFKxj1.jpg',
 35:'/cd8YDn7M0lfaHhZdU6MvCDxPalP.jpg',80:'/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg',99:'/nKyBbFSooRPTJVqjrDTeD1lF733.jpg',
 18:'/fb5f0f205f7d3a0c2a0400e89e2.jpg',10751:'/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',14:'/2u7zbn8EudG6kLlBzUYqP8RyFU4.jpg',
 36:'/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg',27:'/bvRnPaai6JLcaeKRZiспу0UX8O.jpg',10402:'/dKqa850uvbNSCaQCV4Im1XlzEtQ.jpg',
 9648:'/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',10749:'/6VmFqApQRyZZzmiGOQq2C92jyvH.jpg',878:'/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
 53:'/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',10752:'/ddIkmH3TpR6XSc47jj0BrGK5HQbz.jpg',37:'/2oZklIzUbvZXXzIFzv7Hi68d6xf.jpg'
};
const STUDIOS=[
 [2,'Disney','/wdrCwmRnLFJhEoH8GSfymY85KHT.png'],
 [127928,'20th Century Studios','/h0rjX5vjW5r8yEnUBStFarjcLT4.png'],
 [34,'Sony Pictures','/GagSvqWlyPdkFHMfQ3pNq6ix9P.png'],
 [174,'Warner Bros. Pictures','/ky0xOc5OrhzkZ1N6KyUxacfQsCk.png'],
 [33,'Universal','/8lvHyhjr8oUKOOy2dKXoALWKdp0.png'],
 [4,'Paramount','/fycMZt242LVjagMByZOLUGbCvv3.png'],
 [3,'Pixar','/1TjvGVDMYsj6JBxOAkUHpPEwLf7.png'],
 [521,'DreamWorks','/kP7t6RwGz2AvvTkvnI1uteEwHet.png'],
 [420,'Marvel Studios','/hUzeosd33nzE5MCNsZxCGEKTXaQ.png'],
 [9993,'DC','/2Tc1P3Ac8M479naPp1kYT3izLS5.png'],
 [41077,'A24','/1ZXsGaFPgrgS6ZZGS37AqD5uU12.png']
];
const NETWORKS=[
 [213,'Netflix','/wwemzKWzjKYJFfCeiB57q3r4Bcm.png'],
 [2739,'Disney+','/gJ8VX6JSu3ciXHuC2dDGAo2lvwM.png'],
 [1024,'Prime Video','/ifhbNuuVnlwYy5oXA5VIb2YR8AZ.png'],
 [2552,'Apple TV+','/4KAy34EHvRM25Ih8wb82AuGU7zJ.png'],
 [453,'Hulu','/pqUTCleNUiTLAVlelGxUgWn1ELh.png'],
 [49,'HBO','/tuomPhY2UtuPTqqFnKMVHvSb724.png'],
 [4353,'Discovery+','/1D1bS3Dyw4ScYnFWTlBOvJXC3nb.png'],
 [2,'ABC','/ndAvF4JLsliGreX87jAc9GdjmJY.png'],
 [19,'FOX','/1DSpHrWyOORkL9N2QHX7Adt31mQ.png'],
 [174,'AMC','/pmvRmATOCaDykE6JrVoeYxlFHw3.png'],
 [67,'Showtime','/Allse9kbjiP6ExaQrnSpIhkurEi.png'],
 [318,'Starz','/8GJjw3HHsAJYwIWKIPBPfqMxlEa.png'],
 [71,'The CW','/ge9hzeaU7nMtQ4PjkFlc68dGAJ9.png'],
 [6,'NBC','/o3OedEP0f9mfZr33jz2BfXOUK5.png'],
 [16,'CBS','/nm8d7P7MJNiBLdgIzUK0gkuEA4r.png'],
 [4330,'Paramount+','/fi83B1oztoS47xxcemFdPMhIzKMp.png'],
 [4,'BBC One','/mVn7xESaTNmjBUyUtGNvDQd3CT1.png'],
 [56,'Cartoon Network','/c5OC6oVCg6QP4eqzW6XIq17CQjI.png'],
 [80,'Adult Swim','/9AKyspxVzywuaMuZ1Bvilu8sXly.png'],
 [13,'Nickelodeon','/ikZXxg6GnwpzqiZbRPhJGaZapqB.png'],
 [3353,'Peacock','/gIAcGTjKKr0KOHL5s4O36roJ8p7.png']
];
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
const loadedImages=new Set();
function poster(item){
 const frame=el('div','','rh-poster');
 if(item.poster){
  try{
   const u=new URL(item.poster);
   if(u.protocol==='https:'&&u.hostname==='image.tmdb.org'){
    const img=el('img');
    img.src=u.href;img.alt='';img.loading='lazy';img.decoding='async';
    if(!loadedImages.has(u.href)&&!(img.complete&&img.naturalWidth>0)){
     frame.classList.add('is-loading');
    }
    img.onload=()=>{loadedImages.add(u.href);frame.classList.remove('is-loading');};
    img.onerror=()=>{frame.classList.remove('is-loading');img.remove();};
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
function skeletonCards(count=8,media=false){
 const frag=document.createDocumentFragment();
 for(let i=0;i<count;i++){
  if(media){
   const wrap=el('div','','rh-media-card rh-skeleton-card');
   wrap.dataset.rhSkeleton='true';
   wrap.append(el('div','','rh-media-frame rh-skeleton-box'));
   frag.append(wrap);
  }else{
   const wrap=el('div','','rh-card rh-skeleton-card');
   wrap.dataset.rhSkeleton='true';
   wrap.append(el('div','','rh-poster rh-skeleton-box'),el('div','','rh-skeleton-line'));
   frag.append(wrap);
  }
 }
 return frag;
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
function scrollToTop(){
 try{window.scrollTo(0,0);}catch{}
 if(document.scrollingElement)document.scrollingElement.scrollTop=0;
 if(document.documentElement)document.documentElement.scrollTop=0;
 if(document.body)document.body.scrollTop=0;
 document.querySelectorAll('.page:not(.hide),#indexPage,.homePage').forEach(p=>{if(p.scrollTop)p.scrollTop=0;});
}
function hideLeavingSoonNav(){
 document.querySelectorAll('[data-sleekfin-header-proxy] button,[data-sleekfin-header-proxy] a,header button,header a,.mainDrawer a,.mainDrawer button').forEach(n=>{
  const txt=(n.getAttribute('aria-label')||n.getAttribute('title')||n.textContent||'').trim();
  if(/leaving\s+soon/i.test(txt)&&n.style.display!=='none')n.style.display='none';
 });
}
function syncHeaderActive(){
 hideLeavingSoonNav();
 const active=isDiscoverHash();
 const highlight=active&&!subviewActive;
 if(active){
  if(document.documentElement?.getAttribute('data-rh-active')!=='true')document.documentElement?.setAttribute('data-rh-active','true');
  const wantSub=subviewActive?'true':'false';
  if(document.documentElement?.getAttribute('data-rh-subview')!==wantSub)document.documentElement?.setAttribute('data-rh-subview',wantSub);
 }else{
  if(document.documentElement?.hasAttribute('data-rh-active'))document.documentElement?.removeAttribute('data-rh-active');
  if(document.documentElement?.hasAttribute('data-rh-subview'))document.documentElement?.removeAttribute('data-rh-subview');
 }
 document.querySelectorAll('[data-rh-link],[data-rh-source]').forEach(n=>{
  if(highlight){
   if(n.getAttribute('aria-current')!=='page')n.setAttribute('aria-current','page');
   if(n.dataset.sleekfinCurrent!=='true')n.dataset.sleekfinCurrent='true';
  }else{
   if(n.hasAttribute('aria-current'))n.removeAttribute('aria-current');
   if(n.dataset.sleekfinCurrent!==undefined)delete n.dataset.sleekfinCurrent;
  }
 });
 const proxy=document.querySelector('[data-sleekfin-header-proxy]');
 if(proxy&&active){
  proxy.querySelectorAll('[data-sleekfin-header-proxy-item="jellyfin:home"]').forEach(n=>{
   if(n.dataset.sleekfinCurrent!==undefined)delete n.dataset.sleekfinCurrent;
   if(n.hasAttribute('aria-current'))n.removeAttribute('aria-current');
  });
 }
}
function returnToOverview(clearSearch=true){
 if(!root||!mainHost)return;
 clearTimeout(searchTimer);
 generation++;
 clearGridScroll();
 subviewActive=false;
 lastRouteView='overview';
 if(clearSearch&&searchInput)searchInput.value='';
 if(pageTitleNode)pageTitleNode.textContent='Discover';
 if(/[?&]rhView=/i.test(location.hash)){
  try{history.replaceState(null,'','#/home?requesthub=discover');}catch{}
 }
 scrollToTop();
 syncHeaderActive();
 setTimeout(syncHeaderActive,50);
 mainHost.replaceChildren();
 home(mainHost);
}
async function gridView(host,title,kind,filter=null,query=null){
 clearGridScroll();
 subviewActive=true;
 if(pageTitleNode)pageTitleNode.textContent=title;
 scrollToTop();
 if(typeof requestAnimationFrame==='function')requestAnimationFrame(scrollToTop);
 syncHeaderActive();
 setTimeout(syncHeaderActive,50);
 const token=generation;
 const sec=el('section','','rh-grid-section');
 const grid=el('div','','rh-grid');
 grid.append(skeletonCards(12,false));
 const status=el('p','','rh-row-status');
 status.setAttribute('role','status');
 const footer=el('div','','rh-grid-footer');
 footer.hidden=true;
 let page=0,pages=1,busy=false;
 const moreBtn=button('Load more',()=>loadBatch(),'rh-btn');
 footer.append(moreBtn);
 sec.append(grid,status,footer);
 host.append(sec);

 async function loadBatch(){
  const realCount=()=>grid.querySelectorAll('.rh-card:not(.rh-skeleton-card)').length;
  if(busy||page>=pages||realCount()>=300)return;
  busy=true;
  moreBtn.disabled=true;
  moreBtn.textContent='Loading…';
  try{
   let added=0;
   const frag=document.createDocumentFragment();
   while(page<pages&&added<20&&realCount()+added<300){
    const data=await api('Browse',{kind,page:page+1,...(filter?{filter}:{}),...(query?{query}:{})});
    if(token!==generation||!sec.isConnected)return;
    page++;
    pages=data.pages||1;
    const items=(data.results||[]).filter(isReleased);
    items.forEach(i=>{frag.append(card(i));added++;});
    if(!data.results?.length)break;
   }
   grid.querySelectorAll('[data-rh-skeleton="true"]').forEach(n=>n.remove());
   if(added>0)grid.append(frag);
   status.textContent=realCount()?'':'No released titles found.';
   footer.hidden=page>=pages||realCount()>=300;
  }catch{
   grid.querySelectorAll('[data-rh-skeleton="true"]').forEach(n=>n.remove());
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
function genreImageUrl(g){
 const pair=GENRE_COLORS[g.id]||GENRE_COLORS[0];
 const path=typeof g.backdrop==='string'&&/^\/[A-Za-z0-9_-]+\.(jpg|png|webp)$/i.test(g.backdrop)?g.backdrop:(GENRE_DEFAULT_BACKDROPS[g.id]||'');
 return path?`https://image.tmdb.org/t/p/w1280_filter(duotone,${pair})${path}`:'';
}
function genreCard(g,onOpen){
 const n=button('',onOpen,'rh-media-card rh-genre-card rh-chip');
 n.setAttribute('aria-label',g.name);
 const pair=(GENRE_COLORS[g.id]||GENRE_COLORS[0]).split(',');
 const frame=el('div','','rh-media-frame');
 frame.style.background=`linear-gradient(135deg, #${pair[0]} 0%, #${pair[1]||pair[0]} 100%)`;
 const url=genreImageUrl(g);
 if(url){
  const img=el('img');
  img.src=url;img.alt='';img.loading='lazy';img.decoding='async';
  img.onerror=()=>img.remove();
  frame.append(img);
 }
 const shade=el('div','','rh-genre-shade');
 const label=el('span',g.name,'rh-genre-label');
 frame.append(shade,label);
 n.append(frame);
 return n;
}
function logoCard(name,logoPath,onOpen){
 const n=button('',onOpen,'rh-media-card rh-logo-card rh-chip');
 n.setAttribute('aria-label',name);
 n.title=name;
 const frame=el('div','','rh-media-frame rh-logo-frame');
 const fallback=el('span',name,'rh-logo-fallback rh-sr-only');
 if(typeof logoPath==='string'&&/^\/[A-Za-z0-9_-]+\.(jpg|png|webp)$/i.test(logoPath)){
  const img=el('img');
  img.src=`https://image.tmdb.org/t/p/w780_filter(duotone,ffffff,bababa)${logoPath}`;
  img.alt='';img.loading='lazy';img.decoding='async';
  img.onerror=()=>{img.remove();fallback.classList.remove('rh-sr-only');};
  frame.append(img);
 }else{
  fallback.classList.remove('rh-sr-only');
 }
 frame.append(fallback);
 n.append(frame);
 return n;
}
function snapTrackScroll(track,direction){
 const step=Math.max(260,Math.round(track.clientWidth*0.82));
 const maxScroll=Math.max(0,track.scrollWidth-track.clientWidth);
 if(maxScroll<=0){track.scrollBy({left:direction*step,behavior:'smooth'});return;}
 if(direction>0&&track.scrollLeft>=maxScroll-4){track.scrollBy({left:-maxScroll,behavior:'smooth'});return;}
 if(direction<0&&track.scrollLeft<=4){track.scrollBy({left:maxScroll,behavior:'smooth'});return;}
 const children=[...track.children];
 const base=typeof children[0]?.offsetLeft==='number'?children[0].offsetLeft:0;
 const snaps=children.map(c=>typeof c.offsetLeft==='number'?c.offsetLeft-base:0);
 if(!snaps.some(x=>x>0)){track.scrollBy({left:direction*step,behavior:'smooth'});return;}
 const current=track.scrollLeft;
 if(direction>0&&current+step>=maxScroll-8){track.scrollBy({left:maxScroll-current,behavior:'smooth'});return;}
 if(direction<0&&current-step<=8){track.scrollBy({left:-current,behavior:'smooth'});return;}
 const desired=current+direction*step;
 const candidates=snaps.filter(pos=>direction>0?(pos>current+8&&pos<=maxScroll):pos<current-8);
 if(!candidates.length){track.scrollBy({left:direction*step,behavior:'smooth'});return;}
 let best=candidates[0];
 for(const pos of candidates){if(Math.abs(pos-desired)<Math.abs(best-desired))best=pos;}
 track.scrollBy({left:best-current,behavior:'smooth'});
}
function mediaRail(host,title,cardsPromiseOrArray){
 const token=generation,row=el('section','','rh-row rh-media-row'),head=el('div','','rh-row-head'),controls=el('div','','rh-row-controls'),track=el('div','','rh-track rh-media-track'),status=el('p','','rh-row-status');
 status.setAttribute('role','status');
 const prevBtn=button('‹',()=>snapTrackScroll(track,-1),'rh-row-arrow');
 prevBtn.setAttribute('aria-label',`Previous ${title}`);
 const nextBtn=button('›',()=>snapTrackScroll(track,1),'rh-row-arrow');
 nextBtn.setAttribute('aria-label',`More ${title}`);
 controls.append(prevBtn,nextBtn);
 const heading=el('h2',title);
 head.append(heading,controls);
 if(!Array.isArray(cardsPromiseOrArray))track.append(skeletonCards(6,true));
 row.append(head,track,status);
 host.append(row);
 Promise.resolve(cardsPromiseOrArray).then(nodes=>{
  if(token!==generation||!row.isConnected)return;
  track.querySelectorAll('[data-rh-skeleton="true"]').forEach(n=>n.remove());
  if(nodes&&nodes.length){
   const frag=document.createDocumentFragment();
   nodes.forEach(n=>frag.append(n));
   track.append(frag);
   status.textContent='';
  }else{
   status.textContent=`${title} are unavailable.`;
  }
 }).catch(()=>{
  track.querySelectorAll('[data-rh-skeleton="true"]').forEach(n=>n.remove());
  if(row.isConnected)status.textContent=`${title} are unavailable.`;
 });
}
async function rail(host,title,kind,filter=null,query=null){
 const token=generation,row=el('section','','rh-row'),head=el('div','','rh-row-head'),controls=el('div','','rh-row-controls'),track=el('div','','rh-track'),status=el('p','','rh-row-status');
 status.setAttribute('role','status');
 track.append(skeletonCards(8,false));
 let page=0,pages=1,busy=false;
 const openFullGrid=()=>{
  generation++;
  host.replaceChildren();
  gridView(host,title,kind,filter,query);
 };
 const tailCard=seeMoreCard(title,openFullGrid);
 const load=async()=>{
  if(busy||page>=pages||track.querySelectorAll('.rh-card:not(.rh-see-more):not(.rh-skeleton-card)').length>=20)return;
  busy=true;
  try{
   let added=0;
   const frag=document.createDocumentFragment();
   while(page<pages&&added<20&&page<4){
    const data=await api('Browse',{kind,page:page+1,...(filter?{filter}:{}),...(query?{query}:{})});
    if(token!==generation||!row.isConnected)return;
    page++;pages=data.pages||1;
    const valid=(data.results||[]).filter(isReleased);
    for(const i of valid){
     if(added>=20)break;
     frag.append(card(i));
     added++;
    }
    if(!data.results?.length)break;
   }
   track.querySelectorAll('[data-rh-skeleton="true"]').forEach(n=>n.remove());
   if(added>0){
    frag.append(tailCard);
    track.replaceChildren(frag);
   }
   const realCards=track.querySelectorAll('.rh-card:not(.rh-see-more):not(.rh-skeleton-card)').length;
   status.textContent=realCards?'':'No titles found.';
  }catch{
   track.querySelectorAll('[data-rh-skeleton="true"]').forEach(n=>n.remove());
   if(row.isConnected)status.textContent='Could not load titles. Check Request Hub configuration and your account mapping.';
  }finally{busy=false;}
 };
 const prevBtn=button('‹',()=>snapTrackScroll(track,-1),'rh-row-arrow');
 prevBtn.setAttribute('aria-label',`Previous ${title}`);
 const nextBtn=button('›',()=>snapTrackScroll(track,1),'rh-row-arrow');
 nextBtn.setAttribute('aria-label',`More ${title}`);
 controls.append(prevBtn,nextBtn);
 const heading=el('h2',title);
 heading.onclick=openFullGrid;
 heading.title=`View all ${title}`;
 head.append(heading,controls);
 row.append(head,track,status);
 host.append(row);
 return load();
}
async function render(){
 const token=generation,toolbar=el('div','','rh-toolbar'),main=el('div','','rh-main'),search=el('form','','rh-search'),searchIcon=el('span','','material-icons search rh-search-icon'),input=el('input');
 mainHost=main;
 searchInput=input;
 searchIcon.setAttribute('aria-hidden','true');
 input.type='search';input.placeholder='Search new content';input.setAttribute('aria-label','Search new content');input.autocomplete='off';
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
 const q=new URLSearchParams(location.hash.split('?')[1]||''),rhView=(q.get('rhView')||'').toLowerCase(),type=q.get('mediaType'),id=Number(q.get('mediaId'));
 if(rhView==='movies'){
  lastRouteView='movies';
  await gridView(main,'Popular Movies','movies');
 }else if(rhView==='tv'||rhView==='series'||rhView==='shows'){
  lastRouteView='tv';
  await gridView(main,'Popular Series','tv');
 }else{
  lastRouteView='overview';
  await home(main);
 }
 if(token!==generation)return;
 if(['movie','tv'].includes(type)&&id>0)details({type,id});
}
async function home(main){
 subviewActive=false;
 if(pageTitleNode)pageTitleNode.textContent='Discover';
 syncHeaderActive();
 clearGridScroll();
 const token=generation;
 const pTrending=rail(main,'Trending Now','trending');
 const pMovies=rail(main,'Popular Movies','movies');
 const pGenres=api('Browse',{kind:'genres'}).then(data=>{
  if(token!==generation)return [];
  return (data.results||[]).map(g=>genreCard(g,()=>{generation++;main.replaceChildren();gridView(main,g.name,'genre',g.id);}));
 }).catch(()=>[]);
 mediaRail(main,'Movie Genres',pGenres);
 mediaRail(main,'Studios',STUDIOS.map(([id,name,logo])=>logoCard(name,logo,()=>{generation++;main.replaceChildren();gridView(main,name,'studio',id);})));
 const pSeries=rail(main,'Popular Series','tv');
 mediaRail(main,'Networks',NETWORKS.map(([id,name,logo])=>logoCard(name,logo,()=>{generation++;main.replaceChildren();gridView(main,name,'network',id);})));
 await Promise.all([pTrending,pMovies,pGenres,pSeries]);
}
function openDiscoverRoute(e){
 e?.preventDefault?.();
 scrollToTop();
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
 if(permAllowed!==true){
  removeNavigation();
  return;
 }
 const sourceHost=document.querySelector('.skinHeader .headerLeft')||document.querySelector('header.MuiAppBar-root .MuiToolbar-root .MuiStack-root');
 let addedSource=false;
 if(sourceHost&&!sourceHost.querySelector('[data-rh-source]')){
  const src=el('button','','headerButton headerButtonLeft rh-source-btn');
  src.id='requesthub-discover-tab';
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
  sourceHost.append(src);
  addedSource=true;
 }
 if(addedSource&&window.SleekFinFeatures?.header?.refresh){
  try{window.SleekFinFeatures.header.refresh();}catch{}
 }
 const proxy=document.querySelector('[data-sleekfin-header-proxy]');
 if(proxy){
  document.querySelectorAll('[data-rh-link]').forEach(n=>{if(!proxy.contains(n))n.remove();});
  const nativeProxyBtn=[...proxy.querySelectorAll('button[data-sleekfin-header-proxy-item]')].find(b=>{
   const itemKey=b.getAttribute('data-sleekfin-header-proxy-item')||'';
   if(itemKey==='requesthub:discover')return false;
   if(itemKey==='dom:toolbar-discover')return true;
   const lbl=(b.getAttribute('aria-label')||b.textContent||'').trim().toLowerCase();
   return itemKey.startsWith('source:')&&lbl==='discover';
  });
  if(nativeProxyBtn){
   proxy.querySelectorAll('button[data-sleekfin-header-proxy-item="requesthub:discover"]').forEach(n=>n.remove());
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
  const rowCards=[...track.querySelectorAll('.rh-card,.rh-chip')];
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
 if(session&&own!==session){
  permScope='';
  permAllowed=null;
  permPending=null;
  cleanup();
 }
 session=own;
 if(!own){
  permScope='';
  permAllowed=null;
  permPending=null;
  removeNavigation();
  cleanup();
  return;
 }
 checkPermission(own);
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
  const q=new URLSearchParams(location.hash.split('?')[1]||''),rhView=(q.get('rhView')||'').toLowerCase();
  const wantView=rhView==='movies'?'movies':(rhView==='tv'||rhView==='series'||rhView==='shows')?'tv':'overview';
  if(mainHost&&wantView!==lastRouteView){
   lastRouteView=wantView;
   scrollToTop();
   if(wantView==='movies'){generation++;mainHost.replaceChildren();gridView(mainHost,'Popular Movies','movies');}
   else if(wantView==='tv'){generation++;mainHost.replaceChildren();gridView(mainHost,'Popular Series','tv');}
   else if(subviewActive){returnToOverview();}
  }
  return;
 }
 cleanup();
 scrollToTop();
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
[data-sleekfin-header-proxy] :is(button,a)[title*="Leaving Soon" i],
[data-sleekfin-header-proxy] :is(button,a)[aria-label*="Leaving Soon" i]{display:none!important}
.rh-source-btn[data-sleekfin-header-source-hidden="true"]{display:none!important}
.rh-source-btn:not([data-sleekfin-header-source-hidden="true"]){position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;border:0!important;opacity:0!important;pointer-events:none!important}
html[data-rh-active="true"] #indexPage,
html[data-rh-active="true"] #indexPage.homePage.libraryPage,
#indexPage:has(.rh-root),
#indexPage.homePage.libraryPage:has(.rh-root){
 padding-top:0!important;
 margin-top:0!important;
}
html[data-rh-active="true"] header.MuiAppBar-root + div[aria-hidden="true"],
html[data-rh-active="true"] .sleekfin-hero,
html[data-rh-active="true"] .sleekfin-hero-skeleton,
#indexPage:has(.rh-root) .sleekfin-hero,
#indexPage:has(.rh-root) .sleekfin-hero-skeleton{
 display:none!important;
 height:0!important;
 min-height:0!important;
 margin:0!important;
 padding:0!important;
}
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
 padding:var(--sleekfin-header-height, 72px) var(--sleekfin-page-gutter, clamp(16px, 4vw, 80px)) 48px;
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
 min-height:48px;
 margin:0 0 18px;
 box-sizing:border-box;
}
.rh-page-title{
 font-size:28px;
 line-height:34px;
 font-weight:700;
 margin:0 auto 0 0;
 border-left:3px solid var(--sleekfin-accent, #e50914);
 padding-left:10px;
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
.rh-row{margin:0 0 24px;min-width:0}
.rh-row-head{
 display:flex;
 align-items:center;
 gap:10px;
 margin-bottom:14px;
}
.rh-row-head h2,.rh-pill-section h2,.rh-grid-heading{
 border-left:3px solid var(--sleekfin-accent, #e50914);
 padding-left:10px;
 margin:0 auto 0 0;
 font-size:24px;
 line-height:32px;
 font-weight:600;
 color:#fff;
}
.rh-row-head h2{cursor:pointer}
.rh-row-head h2:hover{text-decoration:underline}
.rh-media-row .rh-row-head h2{cursor:default}
.rh-media-row .rh-row-head h2:hover{text-decoration:none}
.rh-row-controls{
 display:flex;
 align-items:center;
 gap:10px;
}
.rh-root button.rh-row-arrow{
 font:inherit;
 font-weight:400;
 color:#fff;
 padding:3px 11px;
 font-size:22px;
 line-height:1;
 border:0;
 background:transparent;
 border-radius:8px;
 min-height:44px;
}
.rh-root button.rh-row-arrow:hover:not(:disabled){
 background:#454545;
}
.rh-track{
 display:flex;
 gap:14px;
 overflow-x:auto;
 padding:4px 3px 12px;
 min-height:calc(clamp(135px, 14vw, 205px) * 1.5 + 43px);
 box-sizing:border-box;
 scrollbar-width:none;
 -ms-overflow-style:none;
}
.rh-track.rh-media-track{
 min-height:calc(clamp(210px, 18.5vw, 268px) * 0.5 + 16px);
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
.rh-root button.rh-media-card,.rh-media-card{
 position:relative;
 flex:0 0 clamp(210px, 18.5vw, 268px);
 width:clamp(210px, 18.5vw, 268px);
 max-width:clamp(210px, 18.5vw, 268px);
 border:0!important;
 padding:0!important;
 background:transparent!important;
 border-radius:12px!important;
 min-height:0!important;
 min-width:0;
}
.rh-media-frame{
 position:relative;
 width:100%;
 aspect-ratio:2/1;
 border-radius:12px;
 overflow:hidden;
 display:flex;
 align-items:center;
 justify-content:center;
 box-sizing:border-box;
 border:1px solid rgba(255,255,255,0.12);
 transition:transform .16s ease, border-color .16s ease, background .16s ease;
}
.rh-media-card:hover .rh-media-frame{
 transform:scale(1.025);
 border-color:rgba(255,255,255,0.34);
}
.rh-genre-card .rh-media-frame img{
 position:absolute;
 inset:0;
 width:100%;
 height:100%;
 object-fit:cover;
 display:block;
 z-index:0;
}
.rh-genre-shade{
 position:absolute;
 inset:0;
 background:linear-gradient(180deg, rgba(16,17,19,0.18) 0%, rgba(16,17,19,0.52) 100%);
 transition:background .16s ease;
 z-index:1;
}
.rh-genre-card:hover .rh-genre-shade{
 background:linear-gradient(180deg, rgba(16,17,19,0.08) 0%, rgba(16,17,19,0.36) 100%);
}
.rh-genre-label{
 position:relative;
 z-index:2;
 padding:0 14px;
 text-align:center;
 font-size:clamp(1.08rem, 1.35vw, 1.38rem);
 font-weight:800;
 color:#fff;
 text-shadow:0 2px 10px rgba(0,0,0,0.65);
 white-space:nowrap;
 overflow:hidden;
 text-overflow:ellipsis;
 max-width:100%;
}
.rh-logo-frame{
 background:linear-gradient(180deg, rgba(35,38,43,0.55) 0%, rgba(16,17,19,0.96) 100%);
 padding:18px 24px;
}
.rh-logo-card:hover .rh-logo-frame{
 background:linear-gradient(180deg, rgba(50,53,58,0.68) 0%, rgba(22,24,27,0.98) 100%);
}
.rh-logo-frame img{
 position:relative;
 z-index:1;
 max-width:78%;
 max-height:66%;
 width:auto;
 height:auto;
 object-fit:contain;
 display:block;
 filter:drop-shadow(0 2px 8px rgba(0,0,0,0.35));
}
.rh-logo-fallback{
 font-size:1.1rem;
 font-weight:800;
 color:#fff;
 text-align:center;
}
.rh-sr-only{
 position:absolute!important;
 width:1px!important;
 height:1px!important;
 padding:0!important;
 margin:-1px!important;
 overflow:hidden!important;
 clip:rect(0,0,0,0)!important;
 white-space:nowrap!important;
 border:0!important;
}
@keyframes rh-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
.rh-poster{
 position:relative;
 aspect-ratio:2/3;
 background:#101113;
 border-radius:9px;
 overflow:hidden;
}
.rh-poster.is-loading,.rh-skeleton-box,.rh-skeleton-line{
 background:linear-gradient(90deg,#16181b 25%,#23262b 50%,#16181b 75%)!important;
 background-size:200% 100%!important;
 animation:rh-shimmer 1.5s infinite linear;
}
.rh-poster img{
 height:100%;
 width:100%;
 object-fit:cover;
 display:block;
 transition:opacity .18s ease;
}
.rh-poster.is-loading img,.rh-poster.is-loading .rh-type,.rh-poster.is-loading .rh-status{
 opacity:0;
}
.rh-skeleton-card{
 pointer-events:none;
}
.rh-skeleton-line{
 width:70%;
 height:14px;
 border-radius:4px;
 margin:8px 2px 0;
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
 background:linear-gradient(155deg, rgba(229,9,20,0.22) 0%, rgba(22,24,27,0.95) 100%);
 border:1px solid rgba(255,255,255,0.14);
 transition:background .15s ease, border-color .15s ease;
}
.rh-see-more:hover .rh-see-more-poster{
 background:linear-gradient(155deg, rgba(229,9,20,0.36) 0%, rgba(30,33,38,0.98) 100%);
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
 background:rgba(22,22,24,0.84);
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
 background:rgba(22,22,24,0.82);
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
 background:rgba(8,8,10,0.82);
 backdrop-filter:blur(10px);
 z-index:100002;
 display:grid;
 place-items:center;
 padding:20px;
}
.rh-dialog{
 background:#16181b;
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
@media(max-width:768px){
 .rh-root{padding:calc(var(--sleekfin-header-height, 64px) + 8px) 16px 32px}
 .rh-page-title{font-size:24px;line-height:30px}
 .rh-row-head h2,.rh-pill-section h2,.rh-grid-heading{font-size:20px;line-height:28px}
 .rh-card{flex-basis:38vw;width:38vw;max-width:38vw}
 .rh-root button.rh-media-card,.rh-media-card{flex-basis:56vw;width:56vw;max-width:56vw}
 .rh-grid{grid-template-columns:repeat(auto-fill, minmax(38vw, 1fr))}
 .rh-search input{width:100%}
 .rh-dialog-body{grid-template-columns:1fr}
 .rh-dialog .rh-poster{max-width:160px}
}
`;
document.head.append(css);
observer=new MutationObserver(records=>{
 if(records.some(r=>!r.target?.closest?.('.rh-root,[data-rh-link],[data-rh-source],[data-sleekfin-header-proxy],.skinHeader,header.MuiAppBar-root,.fx-discovery,.fx-dialog,.fx-inline-studio,#searchPage'))){
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
