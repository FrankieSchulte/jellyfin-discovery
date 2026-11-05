export function bootDiscovery(DEFAULT_CONFIG, DISCOVERY_CSS) {
const VERSION = '0.4.0';
if (window.FazFortDiscovery?.version === VERSION) return;
window.FazFortDiscovery?.stop?.();
// The older helper can otherwise reorder native rows while this feed is mounted.
window.FazFortHomeFeed?.stop?.();
let state = null, generation = 0, observer, timer, heartbeat, stopped = false;
const snapshots = new Map();
const savedFeeds = new Map();
let activeDialog = null, lastScope = '', selectHold = null;
const element = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const button = (text, action) => { const b = element('button', '', text); b.type = 'button'; b.addEventListener('click', action); return b; };
const scopeKey = api => `${api.serverId?.() || location.origin}:${api.getCurrentUserId()}`;
const configKey = api => `fazfort-discovery:config:v1:${scopeKey(api)}`;
const prefKey = (api, page) => `fazfort-discovery:view:${scopeKey(api)}:${page}`;
function readConfig(api) {
  try { const raw = localStorage.getItem(configKey(api)); return validateConfig(raw ? JSON.parse(raw) : cloneJson(DEFAULT_CONFIG)); }
  catch { throw Error('Saved discovery rules are invalid. Open Customize to repair them, or reset to the supplied rules.'); }
}
function closeDialog() {
  if (!activeDialog) return;
  const { dialog, overlay, previous } = activeDialog;
  activeDialog = null;
  if (typeof dialog.close === 'function') { try { dialog.close(); } catch {} }
  overlay.remove();
  if (previous?.isConnected) previous.focus?.({ preventScroll: true });
}
function openDialog(dialog) {
  closeDialog();
  const previous = document.activeElement;
  const overlay = element('div', 'fx-dialog-overlay'); overlay.append(dialog); document.body.append(overlay);
  activeDialog = { dialog, overlay, previous };
  dialog.setAttribute('aria-modal', 'true'); dialog.setAttribute('role', 'dialog');
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
  try { if (typeof dialog.showModal !== 'function') throw Error(); dialog.showModal(); }
  catch { dialog.setAttribute('open', ''); dialog.classList.add('fx-dialog-fallback'); }
  (dialog.querySelector('button,input,select,textarea,a[href]') || dialog).focus?.();
}
function controlsMode(s) {
  let mode = 'auto'; try { mode = localStorage.getItem(`fazfort-discovery:controls:${s.scope}`) || 'auto'; } catch {}
  const automatic = document.documentElement.classList.contains('layout-tv') || document.body.classList.contains('layout-tv') || /Tizen|SmartTV|TV Bro|Android TV|GoogleTV/i.test(typeof navigator === 'object' ? navigator.userAgent || '' : '');
  return { mode, tv: mode === 'tv' || (mode === 'auto' && automatic) };
}
function controlToggle(s, b) {
  const current = controlsMode(s).mode, modes = ['auto', 'tv', 'touch'];
  const next = modes[(modes.indexOf(current) + 1) % modes.length];
  try { localStorage.setItem(`fazfort-discovery:controls:${s.scope}`, next); } catch {}
  b.textContent = `Controls: ${next}`; s.root.classList.toggle('fx-tv', controlsMode(s).tv);
}
function focusNode(node) {
  if (!node) return;
  node.focus?.({ preventScroll: true });
  node.scrollIntoView?.({ block: 'nearest', inline: 'nearest', behavior: 'auto' });
}
function moreLikeThis(item, s) {
  const source = s.inventory.items.find(i => i.Id === item.Id) || item;
  const base=s.config.hideWatched&&s.filters.watched==='all'?s.inventory.items.filter(i=>!i.UserData?.Played):s.inventory.items;
  const pool = filterItems(base, s.filters, s.tracking);
  const recommendations = similarItems(source, pool, 24);
  const dialog = element('dialog', 'fx-dialog fx-similar');
  dialog.setAttribute('aria-label', `More like ${source.Name}`);
  dialog.append(element('h2', '', `More like ${source.Name}`), button('Close', closeDialog));
  const info = element('p', '', 'Matches use shared tags, genres, directors and cast in your accessible library. Active filters also apply.');
  dialog.append(info);
  if (!recommendations.length) dialog.append(element('p', '', 'No matching titles with these filters. Clear a filter or add more library metadata.'));
  const grid = element('div', 'fx-similar-grid');
  recommendations.forEach(r => {
    const entry = element('div', 'fx-similar-entry'); entry.append(renderCard(r.item, s, false), element('p', 'fx-match-reason', r.reason)); grid.append(entry);
  });
  dialog.append(grid); openDialog(dialog);
}
function safeUrl(value, base = location.href) {
  try { const url = new URL(value, base); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; } catch { return ''; }
}
function imageChoices(item, api, layout = 'landscape') {
  const results = [];
  const add = (id, type, tag, poster = false) => {
    if (!id || !tag) return;
    const url = safeUrl(api.getImageUrl(id, { type, tag, maxWidth: 700, quality: 88, ...(type === 'Backdrop' ? { index: 0 } : {}) }));
    if (url) results.push({ url, poster });
  };
  add(item.Id, 'Thumb', item.ImageTags?.Thumb);
  add(item.Id, 'Backdrop', item.BackdropImageTags?.[0]);
  add(item.ParentBackdropItemId || item.SeriesId, 'Backdrop', item.ParentBackdropImageTags?.[0]);
  add(item.Id, 'Primary', item.ImageTags?.Primary, true);
  add(item.SeriesId, 'Primary', item.SeriesPrimaryImageTag, true);
  if (item.ProviderIds?.JellyseerrPoster) {
    const raw = item.ProviderIds.JellyseerrPoster;
    const url = safeUrl(/^https?:/i.test(raw) ? raw : api.getUrl(raw));
    if (url) results.push({ url, poster: true });
  }
  return layout === 'portrait' ? results.filter(c => c.poster) : results;
}
function itemHref(item, api) {
  if (item.ProviderIds?.JellyseerrRoot && item.ProviderIds?.Jellyseerr && ['movie', 'tv'].includes(item.SourceType)) {
    if(window.JellyfinRequestHub)return `#/home?requesthub=discover&mediaType=${item.SourceType}&mediaId=${encodeURIComponent(item.ProviderIds.Jellyseerr)}`;
    return safeUrl(`${item.ProviderIds.JellyseerrRoot.replace(/\/$/, '')}/${item.SourceType}/${encodeURIComponent(item.ProviderIds.Jellyseerr)}`);
  }
  const q = new URLSearchParams({ id: item.ResumeItemId || item.Id || '', serverId: api.serverId?.() || '' });
  if (item.CollectionType) {
    const page = item.CollectionType === 'movies' ? 'movies' : item.CollectionType === 'tvshows' ? 'tv' : 'list';
    return `#/${page}?${new URLSearchParams({ topParentId: item.Id, collectionType: item.CollectionType, serverId: api.serverId?.() || '' })}`;
  }
  return item.Id ? `#/details?${q}` : '';
}
function renderCard(item, s, withSimilar = true, layout = 'landscape') {
  const card = element('a', 'fx-card'); card.href = itemHref(item, s.api) || '#';
  card.dataset.itemId = item.Id || '';
  card.addEventListener('click', () => { s.lastFocus = { row: s.slots.findIndex(slot => slot.node.contains(card)), id: item.Id }; saveFeed(s); if (activeDialog) closeDialog(); });
  // Same-context navigation works in mobile web wrappers and TV browser shells.
  if (/^https?:/i.test(card.getAttribute('href'))) card.rel = 'noopener noreferrer';
  const name = item.Type === 'Episode' ? `${item.SeriesName || item.Name} · ${item.Name}` : item.Name || 'Untitled';
  const visual = element('div', 'fx-card-visual');
  const placeholder = element('span', 'fx-placeholder', name); visual.append(placeholder);
  const choices = imageChoices(item, s.api, layout);
  if (choices.length) {
    const img = element('img'); img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
    let index = 0;
    const use = () => { const choice = choices[index++]; img.className = choice.poster ? 'fx-poster' : ''; img.src = choice.url; };
    img.addEventListener('load', () => { placeholder.hidden = true; });
    img.addEventListener('error', () => { if (index < choices.length) use(); else { img.remove(); placeholder.hidden = false; } });
    use(); visual.append(img);
  }
  const percent = Math.max(0, Math.min(100, Number(item.UserData?.PlayedPercentage || (item.RunTimeTicks ? 100 * (item.UserData?.PlaybackPositionTicks || 0) / item.RunTimeTicks : 0))));
  if (percent > 0 && percent < 100) { const progress = element('div', 'fx-progress'); const fill = element('span'); fill.style.width = percent + '%'; progress.append(fill); visual.append(progress); }
  const badge = badgeFor(item, s.badges, s.now, s.tracking);
  if (badge) visual.append(element('span', 'fx-badge', badge));
  card.append(visual, element('span', 'fx-name', name)); card.title = name;
  const entry = element('div', `fx-card-entry fx-card-${layout}`); entry.append(card);
  if (withSimilar && ['Movie', 'Series'].includes(item.Type) && s.inventory.items.some(i => i.Id === item.Id)) {
    const more = button('⋯', () => moreLikeThis(item, s)); more.className = 'fx-card-more'; more.title='More like this';more.setAttribute('aria-label', `More like ${name}`); entry.append(more);
    card.addEventListener('contextmenu', event => { event.preventDefault(); moreLikeThis(item, s); });
  }
  return entry;
}
function fillSlot(slot, s) {
  const row = slot.data;
  slot.node.replaceChildren(); slot.node.className = 'fx-shelf'; slot.node.style.height = '';
  const head = element('div', 'fx-row-head'), title = element('h2', '', row.title), track = element('div', 'fx-track');
  const scroll = direction => {const end=Math.max(0,track.scrollWidth-track.clientWidth);if(direction>0&&track.scrollLeft>=end-2)track.scrollLeft=0;else if(direction<0&&track.scrollLeft<=2)track.scrollLeft=end;else track.scrollBy({left:direction*Math.max(250,track.clientWidth*.85),behavior:'smooth'});};
  track.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)<=Math.abs(e.deltaY))return;const end=track.scrollWidth-track.clientWidth;if(end>0&&(e.deltaX>0&&track.scrollLeft>=end-2||e.deltaX<0&&track.scrollLeft<=2)){e.preventDefault();scroll(e.deltaX>0?1:-1);}},{passive:false});
  let touchX;track.addEventListener('touchstart',e=>touchX=e.touches[0]?.clientX,{passive:true});track.addEventListener('touchend',e=>{const delta=touchX-e.changedTouches[0]?.clientX;if(Math.abs(delta)>40){const end=track.scrollWidth-track.clientWidth;if(end>0&&(delta>0&&track.scrollLeft>=end-2||delta<0&&track.scrollLeft<=2))scroll(delta>0?1:-1);}},{passive:true});
  const back = button('‹', () => scroll(-1)), forward = button('›', () => scroll(1));
  back.setAttribute('aria-label', `Previous ${row.title}`); forward.setAttribute('aria-label', `More ${row.title}`);
  const token = row.family === 'anchor' ? `anchor:${row.key}` : row.family === 'theme' ? row.key : `family:${row.family}`;
  const requested = s.profile.layouts?.[token] || row.layout || 'auto';
  const portraitOnly=row.key!=='MyMedia'&&row.items.filter(i=>!i.ImageTags?.Thumb&&!i.BackdropImageTags?.length&&!i.ParentBackdropImageTags?.length&&(i.ImageTags?.Primary||i.ProviderIds?.JellyseerrPoster)&&(!i.PrimaryImageAspectRatio||i.PrimaryImageAspectRatio<1)).length>row.items.length/2;
  const layout = requested === 'auto' ? (row.external || row.key === 'DiscoverMovies' || row.key === 'DiscoverTV' || portraitOnly ? 'portrait' : 'landscape') : requested;
  slot.node.dataset.layout = layout;
  head.append(title, back, forward); row.items.forEach(item => track.append(renderCard(item, s, true, layout)));
  slot.node.append(head, track); slot.live = true;
}
function virtualize(s) {
  if (state !== s || !s.root.isConnected || s.full) return;
  const center = innerHeight / 2;
  const ranked = s.slots.map(slot => ({ slot, distance: Math.abs((slot.node.getBoundingClientRect().top + slot.node.getBoundingClientRect().bottom) / 2 - center) })).sort((a, b) => a.distance - b.distance);
  const keep = new Set(ranked.slice(0, s.config.maxLiveRows).map(x => x.slot));
  for (const slot of s.slots) {
    if (keep.has(slot) && !slot.live) fillSlot(slot, s);
    else if (!keep.has(slot) && slot.live && !slot.node.contains(document.activeElement)) {
      const height = slot.node.getBoundingClientRect().height;
      if (height <= 0) continue;
      slot.node.style.height = `${height}px`; slot.node.replaceChildren(); slot.node.className = 'fx-shelf fx-placeholder-row'; slot.live = false;
    }
  }
}
function appendRow(row, s) {
  const slot = { node: element('section', 'fx-shelf'), data: row, live: false };
  slot.node.dataset.shelfKey = row.key; s.list.append(slot.node); s.slots.push(slot); fillSlot(slot, s);
}
function filterPanel(s) {
  s.panel.replaceChildren();
  const field = (label, name, values) => {
    const wrap = element('label', 'fx-filter-field', label), input = element('select'); input.setAttribute('aria-label', label);
    values.forEach(([value, title]) => { const option = element('option', '', title); option.value = value; option.selected=value===s.filters[name]; input.append(option); });
    input.addEventListener('change', () => { s.filters[name] = input.value; applyFilters(s); }); wrap.append(input); s.panel.append(wrap);
  };
  const queryWrap = element('label', 'fx-filter-field', 'Title or person'), query = element('input'); query.type = 'search'; query.placeholder = 'Search this library'; query.value = s.filters.query;
  query.addEventListener('input', () => { clearTimeout(s.filterTimer); s.filterTimer = setTimeout(() => { if (state === s) { s.filters.query = query.value; applyFilters(s); } }, 200); }); queryWrap.append(query); s.panel.append(queryWrap);
  const values = key => [...new Set(s.inventory.items.flatMap(i => i[key] || []))].sort((a,b)=>a.localeCompare(b)).map(v=>[v,v]);
  field('Genre', 'genre', [['','Any genre'], ...values('Genres')]);
  field('Theme / tag', 'tag', [['','Any tag'], ...values('Tags')]);
  field('Watch status', 'watched', [['all','All titles'],['unwatched','Unwatched'],['watched','Watched']]);
  if(s.route.page!=='shows')field('Movie runtime', 'maxMinutes', [['','Any runtime'],['90','Under 90 minutes'],['120','Under two hours'],['180','Under three hours']]);
  field('Rating', 'minRating', [['','Any rating'],['7','7+'],['8','8+'],['9','9+']]);
  const decades = [...new Set(s.inventory.items.filter(i=>i.ProductionYear).map(i=>Math.floor(i.ProductionYear/10)*10))].sort((a,b)=>b-a);
  field('Decade','decade',[['','Any decade'],...decades.map(d=>[String(d),`${d}s`])]);
  if(s.route.page==='home')field('Type','type',[['','Movies & shows'],['Movie','Movies'],['Series','Shows']]);
  field('Sort','sort',[['recommended','Curated shelves'],['title','Title'],['rating','Highest rated'],['year','Newest release year'],['added','Tracked additions']]);
  s.panel.append(button('Clear filters', () => { s.filters = cloneJson(DEFAULT_FILTERS); filterPanel(s); applyFilters(s); }));
}
function preparePlanner(s) {
  const items = filterItems(s.inventory.items, s.filters, s.tracking);
  s.planner = new FeedPlanner(buildShelves(items, s.profile, s.config, s.route.page, s.now), s.config, `${s.scope}:${dayInZone(s.now,s.config.timeZone)}:${s.route.page}:${s.shuffle}`);
  s.filteredQueue = s.route.view==='genres'?s.planner.shelves.filter(r=>r.family==='genre'&&r.key!=='genre:explore').sort((a,b)=>a.title.localeCompare(b.title)):null;
  if (filtersActive(s.filters) || s.filters.sort !== 'recommended') {
    s.filteredQueue = [];
    for (let n=0;n<items.length;n+=s.config.cardsPerShelf) s.filteredQueue.push({key:`filtered:${n}`,title:`Matches ${n+1}–${Math.min(n+s.config.cardsPerShelf,items.length)} of ${items.length}`,family:'filtered',items:items.slice(n,n+s.config.cardsPerShelf)});
  }
  s.matchCount.textContent = s.filteredQueue && s.route.view!=='genres' ? `${items.length} matching titles` : '';
}
function applyFilters(s) {
  if (state!==s || s.loading) { s.filterPending=true; return; }
  s.filterPending=false; s.finished=false; s.pending=null; s.pauseAutomatic=false; s.anchorIndex=0; s.openingIndex=0; s.anchorTurn=true; s.slots=[]; s.list.replaceChildren(); s.more.hidden=false;
  preparePlanner(s); loadMore(s);
}
function findScrollRoot(node) {
  for(let current=node?.parentElement;current&&current!==document.body;current=current.parentElement){
    const style=getComputedStyle(current);
    if(/auto|scroll/.test(style.overflowY||'')&&current.scrollHeight>current.clientHeight)return current;
  }
  return document.scrollingElement || document.documentElement;
}
function saveFeed(s) {
  if (!s.inventory || !s.config || !s.planner) return;
  const root=findScrollRoot(s.root);
  savedFeeds.set(s.key,{config:JSON.stringify(s.config),inventory:s.inventory,tracking:s.tracking,filters:cloneJson(s.filters),planner:s.planner,pending:s.pending,filteredQueue:s.filteredQueue?.slice()||null,rows:s.slots.map(slot=>slot.data),openingIndex:s.openingIndex||0,anchorIndex:s.anchorIndex,anchorTurn:s.anchorTurn,finished:s.finished,shuffle:s.shuffle,focus:s.lastFocus,scrollTop:root.scrollTop||0,tracks:s.slots.map(slot=>slot.node.querySelector('.fx-track')?.scrollLeft||0),at:Date.now()});
  if(savedFeeds.size>6)savedFeeds.delete(savedFeeds.keys().next().value);
}
function restoreFeed(s, saved) {
  s.filters=cloneJson(saved.filters);s.planner=saved.planner;s.pending=saved.pending;s.filteredQueue=saved.filteredQueue?.slice()||null;s.openingIndex=saved.openingIndex||0;s.anchorIndex=saved.anchorIndex;s.anchorTurn=saved.anchorTurn;s.finished=saved.finished;s.shuffle=saved.shuffle;s.lastFocus=saved.focus;
  saved.rows.forEach(row=>appendRow(row,s));
  s.more.hidden=s.finished; s.more.disabled=false;
  s.matchCount.textContent=s.filteredQueue?`${filterItems(s.inventory.items,s.filters,s.tracking).length} matching titles`:'';
  s.note.textContent=s.finished?'You’ve reached the available matches.':'More shelves load as you scroll.';
  setMode(s,s.full,false);filterPanel(s);
  requestAnimationFrame(()=>{
    if(state!==s||!s.root.isConnected)return;
    const root=findScrollRoot(s.root); root.scrollTop=saved.scrollTop;
    s.slots.forEach((slot,n)=>{const track=slot.node.querySelector('.fx-track');if(track)track.scrollLeft=saved.tracks[n]||0;});
    const slot=s.slots[saved.focus?.row];
    if(slot){const card=[...slot.node.querySelectorAll('.fx-card')].find(c=>c.dataset.itemId===saved.focus.id);card?.focus?.({preventScroll:true});}
    virtualize(s);
  });
}
function syncNative(s, hide) {
  s.native.removeAttribute('data-fx-native-hidden');
  s.native.querySelectorAll('[data-fx-native-hidden]').forEach(n => n.removeAttribute('data-fx-native-hidden'));
  s.native.removeAttribute('data-fx-hero-anchor');
  if (!hide) return;
  if (s.route.page !== 'home') { s.native.setAttribute('data-fx-native-hidden','true'); return; }
  s.native.dataset.fxHeroAnchor = 'true';
  const protect = '.sleekfin-hero,.hero,#slides-container';
  const walk = parent => [...parent.children].forEach(node => {
    if (node.matches(protect) || node.closest('.fx-discovery')) return;
    if (node.matches('.sections') || node.querySelector(`${protect},.sections`)) walk(node);
    else node.setAttribute('data-fx-native-hidden','true');
  });
  walk(s.native);
}
function setMode(s, full, remember = true) {
  s.full = full; s.list.hidden = full; s.footer.hidden = full;
  s.filterToggle.disabled=full||!s.inventory;s.matchCount.hidden=full;if(full)s.panel.hidden=true;
  s.toggle.textContent = full ? 'Discover shelves' : s.route.page === 'home' ? 'Normal home' : 'Full library';
  syncNative(s, !(full || (!s.slots.length && !s.filteredQueue)));
  if (remember) { try { localStorage.setItem(prefKey(s.api, s.route.page), full ? 'native' : 'discover'); } catch { s.status.textContent = 'View preference could not be saved in this browser.'; } }
  if (!s.started) initialize(s);
  else if (!full && s.planner && !s.slots.length) loadMore(s);
  if (!full) scheduleScroll();
}
async function nextRow(s) {
  if(s.filteredQueue)return s.filteredQueue.shift()||null;
  const opening=s.profile.opening || [];
  while((s.openingIndex||0)<opening.length){
    const token=opening[s.openingIndex||0];s.openingIndex=(s.openingIndex||0)+1;
    if(token.startsWith('anchor:')){
      const id=token.slice(7);
      try{const row=await s.client.anchor(id,s.route,s.inventory,s.config);if(row.items.length)return row;}
      catch{s.client.assertCurrent();s.warnings.add(`Couldn't load ${id}.`);}
    }else{
      const row=token.startsWith('rule:')?s.planner.take(token):s.planner.shelves.some(r=>r.family===token.slice(7))?s.planner.next(token.slice(7)):null;
      if(row)return row;
    }
  }
  while (s.anchorIndex < s.profile.anchors.length || s.planner.shelves.length) {
    if (s.anchorTurn && s.anchorIndex < s.profile.anchors.length) {
      const id = s.profile.anchors[s.anchorIndex++];
      if(opening.includes(`anchor:${id}`))continue;
      s.anchorTurn = false;
      try {
        const row = await s.client.anchor(id, s.route, s.inventory, s.config);
        if (row.items.length) return row;
      } catch { s.client.assertCurrent(); s.warnings.add(`Couldn't load ${id}. Check HSS/Jellyseerr, then restart this feed.`); }
    } else {
      s.anchorTurn = true;
      const row = s.planner.next(s.anchorIndex <= s.profile.anchors.length && s.anchorIndex > 0 && s.slots.length < s.profile.anchors.length * 2 ? 'theme' : null);
      if (row) return row;
      if (s.anchorIndex >= s.profile.anchors.length) return null;
    }
  }
  return null;
}
async function loadMore(s, automatic = false) {
  if (state !== s || s.loading || s.full || s.finished || !s.planner || (automatic && s.pauseAutomatic)) return;
  s.loading = true; s.more.disabled = true; s.more.textContent = 'Loading…';
  try {
    for (let n = 0; n < s.config.batchSize; n++) {
      const row = s.pending || await nextRow(s);
      if (!row) { s.finished = true; break; }
      s.pending = row;
      const items = row.key === 'MyMedia' || row.external || row.key==='ContinueWatchingNextUp' ? row.items : await s.client.hydrate(row.items);
      s.client.assertCurrent();
      if (state !== s) return;
      if (items.length) appendRow({ ...row, items }, s);
      s.pending = null;
    }
    s.status.textContent = [...s.warnings].join(' ');
    s.pauseAutomatic = false;
    if ((s.slots.length || s.filteredQueue) && !s.full) setMode(s, false, false);
    if (!s.slots.length) s.status.textContent = s.filteredQueue ? 'No matching titles. Clear a filter to broaden your search.' : 'No matching shelves. The normal Jellyfin view is still available. Try fewer filters in Customize.';
    s.more.hidden = s.finished;
    s.note.textContent = s.finished ? 'You’ve reached the available matches. Clear filters or use Restart feed to explore again.' : s.filteredQueue ? 'Filtered results load as you scroll.' : 'Keeps browsing your library; titles can return in different shelves further down.';
    virtualize(s);
  } catch {
    if (state === s) { s.pauseAutomatic = true; s.status.textContent = 'Could not load the next shelves. Your existing rows are intact. Use Try again or the normal view.'; }
  } finally {
    s.loading = false;
    if (state === s) { s.more.disabled = false; s.more.textContent = s.pauseAutomatic ? 'Try again' : 'Load more'; }
    if(state===s&&s.filterPending)applyFilters(s);
  }
}
async function initialize(s) {
  if (s.started) return;
  s.started = true; s.status.textContent = 'Reading library metadata…';
  try {
    let localError;
    try{s.config=readConfig(s.api);}catch(e){localError=e;}
    try {
      const profile=await s.client.preferences();s.profileVersion=profile.version;s.syncAvailable=true;
      if(profile.config)s.config=validateConfig(profile.config);
    } catch { s.client.assertCurrent();s.syncAvailable=false; }
    if(!s.config)throw localError||Error('No valid discovery configuration.');
    s.profile=s.config.pages[s.route.page];
    const cacheKey = `${s.scope}:${s.route.page}:${s.route.parentId}`;
    const cached = snapshots.get(cacheKey);
    s.inventory = cached && Date.now() - cached.at < 5 * 60000 ? cached.value : await s.client.inventory(s.route, (count, seasons) => {
      if (state === s) s.status.textContent = `Reading metadata: ${count} movies/shows, ${seasons} seasons…`;
    });
    s.client.assertCurrent();
    snapshots.set(cacheKey, { at: Date.now(), value: s.inventory });
    if (snapshots.size > 6) snapshots.delete(snapshots.keys().next().value);
    s.badges = seasonBadges(s.inventory.seasons, s.now);
    s.tracking=new Map();
    try { const arrival=await s.client.tracking(s.inventory.items);s.tracking=arrival.records;s.trackingReady=arrival.ready; }
    catch { s.client.assertCurrent();s.trackingReady=false;s.warnings.add('Arrival badges are unavailable until the Discovery Companion is installed and its baseline is ready.'); }
    s.inventory.tracking=s.tracking;
    s.byId = new Map(s.inventory.items.map(i => [i.Id, i]));
    s.filterToggle.disabled=s.full;
    const saved=savedFeeds.get(s.key);
    if(saved&&Date.now()-saved.at<30*60000&&saved.config===JSON.stringify(s.config)){restoreFeed(s,saved);s.status.textContent=[...s.warnings].join(' ');}
    else{preparePlanner(s);filterPanel(s);s.status.textContent='';await loadMore(s);}
    decorateNative(s);
  } catch {
    if (state !== s) return;
    s.status.textContent = 'Discovery could not start. The normal view is restored. Check Customize for invalid rules or use Restart feed to try again.';
    setMode(s, true, false);
  }
}
function decorateNative(s) {
  if (!s.byId || state !== s) return;
  for (const card of s.page.querySelectorAll('.card[data-id]')) {
    const item = s.byId.get(card.dataset.id), host = card.querySelector('.cardScalable');
    if (!host || !item) continue;
    const text = badgeFor(item, s.badges, new Date(), s.tracking);
    let badge = host.querySelector('[data-fx-native-badge]');
    if (!text) { badge?.remove(); continue; }
    if (!badge) { badge = element('span', 'fx-badge'); badge.dataset.fxNativeBadge = ''; host.dataset.fxBadgeHost = ''; host.append(badge); }
    if (badge.textContent !== text) badge.textContent = text;
  }
}
function download(name, obj) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' }));
  const a = element('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function customize(s) {
  closeDialog();
  const dialog = element('dialog', 'fx-dialog'); dialog.id = 'fx-customize';
  const title = element('h2', '', 'Customize discovery');
  const help = element('p', '', s.syncAvailable ? 'Home, Movies and Shows have separate rules. Apply saves these preferences to your Jellyfin user for other compatible devices.' : 'The server companion is unavailable. Apply saves to this browser; export/import can transfer your rules.');
  const input = element('textarea'); input.spellcheck = false; input.setAttribute('aria-label', 'Discovery configuration JSON');
  try { input.value = JSON.stringify(s.config || readConfig(s.api), null, 2); } catch { input.value = localStorage.getItem(configKey(s.api)) || JSON.stringify(DEFAULT_CONFIG, null, 2); }
  const error = element('p'); error.setAttribute('role', 'alert');
  const visual=element('div','fx-visual-editor');
  let initial;try{initial=validateConfig(JSON.parse(input.value));}catch{initial=DEFAULT_CONFIG;}
  const editor=createVisualEditor(visual,initial,s.route.page,s.inventory,c=>{input.value=JSON.stringify(c,null,2);},{element,button,supplied:DEFAULT_CONFIG});
  const advanced=element('details','fx-advanced');advanced.append(element('summary','','Advanced: JSON import / export'));
  input.addEventListener('change',()=>{try{editor.setConfig(validateConfig(JSON.parse(input.value)));error.textContent='';}catch(e){error.textContent=e.message;}});
  const actions = element('div', 'fx-dialog-actions');
  const apply = button('Apply', async () => {
    apply.disabled=true;
    try { const config = validateConfig(JSON.parse(input.value)); if(s.syncAvailable)await s.client.savePreferences(config,s.profileVersion);localStorage.setItem(configKey(s.api), JSON.stringify(config));closeDialog();restart(true); }
    catch (e) { error.textContent = e?.status===409 ? 'Preferences changed on another device. Close and reopen Customize before saving.' : e?.message || 'Could not save preferences. Check the connection and try again.'; }
    finally{apply.disabled=false;}
  });
  const reset = button('Load supplied rules', () => { input.value = JSON.stringify(DEFAULT_CONFIG, null, 2);editor.setConfig(DEFAULT_CONFIG); error.textContent = 'Review the rules, then Apply to save.'; });
  const exportButton = button('Export JSON', () => { try { download('fazfort-discovery-config.json', validateConfig(JSON.parse(input.value))); } catch (e) { error.textContent = e.message; } });
  const device=element('div','fx-dialog-actions'),control=button(`Controls: ${controlsMode(s).mode}`,()=>controlToggle(s,control));
  device.append(control,button('Use normal Home',()=>{localStorage.setItem(prefKey(s.api,'home'),'native');error.textContent='Normal Home selected for this device.';}),button('Use Discovery Home',()=>{localStorage.setItem(prefKey(s.api,'home'),'discover');error.textContent='Discovery Home selected for this device.';}),button('Reshuffle feed',()=>{closeDialog();restart(true);}));
  const file = element('input'); file.type = 'file'; file.accept = '.json,application/json'; file.setAttribute('aria-label', 'Import discovery configuration or old shelf rules');
  file.addEventListener('change', async () => {
    try {
      const selected = file.files?.[0]; if (!selected) return;
      if (selected.size > 1000000) throw Error('Use a JSON file smaller than 1 MB.');
      const imported = JSON.parse(await selected.text());
      if (Array.isArray(imported)) {
        const c = validateConfig(JSON.parse(input.value));
        c.pages.home.rules = imported;
        c.pages.movies.rules = imported.filter(r => r.Types?.includes('Movie')).map(r => ({ ...r, Types: ['Movie'] }));
        c.pages.shows.rules = imported.filter(r => r.Types?.includes('Series')).map(r => ({ ...r, Types: ['Series'] }));
        input.value = JSON.stringify(validateConfig(c), null, 2);
      } else input.value = JSON.stringify(validateConfig(imported), null, 2);
      editor.setConfig(validateConfig(JSON.parse(input.value)));error.textContent = 'Imported for review. Apply to save.';
    } catch (e) { error.textContent = e.message; }
  });
  actions.append(apply, exportButton, reset, button('Cancel', closeDialog));
  advanced.replaceChildren(element('summary','','Advanced: JSON import / export'),file,input,exportButton,reset);
  actions.replaceChildren(apply,button('Cancel',closeDialog));
  dialog.append(title,help,device,visual,advanced,error,actions);openDialog(dialog);
}
let settingsScope='';
async function openUserSettings(api){
  if(!api?.getCurrentUserId?.())return;
  const scope=scopeKey(api);const s={api,scope,root:element('div'),route:{page:'home'},config:null};try{s.config=readConfig(api);}catch{}
  s.client=new JellyfinClient(api,()=>scopeKey(api)===scope);
  try{const profile=await s.client.preferences();s.config=profile.config?validateConfig(profile.config):s.config;s.profileVersion=profile.version;s.syncAvailable=true;}catch{s.client.assertCurrent();}
  customize(s);
}
function syncSettings(api){
  const scope=api?.getCurrentUserId?.()?scopeKey(api):'';
  if(settingsScope&&scope!==settingsScope){closeDialog();document.querySelectorAll('[data-fx-settings-link]').forEach(n=>n.remove());}settingsScope=scope;
  if(!scope||!/^#\/mypreferencesmenu(?:[?]|$)/i.test(location.hash))return;
  const page=[...document.querySelectorAll('.userPreferencesPage')].find(visible);
  if(!page||page.querySelector('[data-fx-settings-link]'))return;
  const link=button('Discovery settings',()=>openUserSettings(api));link.dataset.fxSettingsLink='true';link.className='fx-profile-settings';page.prepend(link);
}
function visible(node) {
  if (!node?.isConnected || node.closest('.hide,[hidden],.hidePage')) return false;
  return getComputedStyle(node).display !== 'none';
}
function locate(route) {
  const selector = route.page === 'home' ? '#indexPage, .homePage' : route.page === 'movies' ? '#moviesPage' : '#tvshowsPage, #tvRecommendedPage';
  for (const page of document.querySelectorAll(selector)) {
    if (!visible(page)) continue;
    const native = route.page === 'home' ? page.querySelector('.homeSectionsContainer') : page.querySelector(`.pageTabContent[data-index="${route.view==='genres'?(route.page==='movies'?4:3):route.view==='library'?0:(new URLSearchParams(location.hash.split('?')[1]||'').get('tab')||0)}"]`);
    if (native && !native.closest('.fx-discovery')) return { page, native };
  }
  return null;
}
function cleanup(preserve=true) {
  generation++;
  if(selectHold){clearTimeout(selectHold.timer);selectHold=null;}
  closeDialog();
  if (!state) return;
  if(preserve)saveFeed(state);
  clearTimeout(state.filterTimer);
  state.io?.disconnect(); syncNative(state,false); state.root.remove(); state = null;
  document.getElementById('fx-customize')?.remove();
  document.querySelectorAll('[data-fx-native-badge]').forEach(n => n.remove());
  document.querySelectorAll('[data-fx-badge-host]').forEach(n => n.removeAttribute('data-fx-badge-host'));
}
function restart(clearCache = false) {
  const key=state?.key;
  if (clearCache) snapshots.clear();
  cleanup(false);if(key)savedFeeds.delete(key);reconcile();
}
function reconcile() {
  clearTimeout(timer); timer = 0;
  if (stopped) return;
  const api = window.ApiClient, route = routeInfo(location.hash);
  syncSettings(api);
  if (!api?.getCurrentUserId?.()) {cleanup(false);savedFeeds.clear();snapshots.clear();lastScope='';return;}
  if(!route){if(state)cleanup();else if(!/^#\/mypreferencesmenu(?:[?]|$)/i.test(location.hash))closeDialog();return;}
  if(route.serverId && route.serverId.toLowerCase() !== (api.serverId?.() || '').toLowerCase()){cleanup();return;}
  const target = locate(route), scope = scopeKey(api);
  if(lastScope&&lastScope!==scope){cleanup(false);savedFeeds.clear();snapshots.clear();}
  lastScope=scope;
  if (!target) { if (state) cleanup(); return; }
  const key = `${scope}:${route.page}:${route.parentId}:${route.view||'home'}`;
  if (state?.key === key && state.root.isConnected && state.page === target.page && state.native === target.native) { if(!state.full && state.slots.length)syncNative(state,true); decorateNative(state); return; }
  cleanup();
  const token = generation;
  const root = element('div', 'fx-discovery'), toolbar = element('div', 'fx-toolbar'), list = element('div'), status = element('p', 'fx-status'), footer = element('div', 'fx-footer'), panel=element('div','fx-filters'),matchCount=element('p','fx-match-count');panel.hidden=true;
  status.setAttribute('role', 'status');
  const s = { ...target, api, scope, key, route, root, list, status, footer, panel, matchCount,token, now: new Date(), slots: [], badges: new Map(), tracking:new Map(),filters:cloneJson(DEFAULT_FILTERS),warnings: new Set(), anchorIndex: 0, anchorTurn: true, started: false, loading: false, full: false, shuffle: hash(String(Date.now())) };
  s.client = new JellyfinClient(api, () => state === s && generation === token && root.isConnected);
  s.toggle = button(route.page === 'home' ? 'Normal home' : 'Full library', () => setMode(s, !s.full));
  s.more = button('Load more', () => { s.pauseAutomatic = false; loadMore(s); });
  s.note = element('p', '', 'Loading shelves on demand.');
  s.filterToggle=button('Filters',()=>{s.root.querySelector('.fx-feed-menu')?.removeAttribute('open');panel.hidden=!panel.hidden;if(!panel.hidden)focusNode(panel.querySelector('input,select'));});s.filterToggle.disabled=true;
  const controlButton=button(`Controls: ${controlsMode(s).mode}`,()=>controlToggle(s,controlButton));root.classList.toggle('fx-tv',controlsMode(s).tv);
  const menu=element('details','fx-feed-menu'), summary=element('summary','','Browse options'), actions=element('div','fx-feed-menu-actions');
  actions.append(s.toggle,s.filterToggle,button('Customize',()=>customize(s)),controlButton,button('Restart feed',()=>restart(true)));
  menu.append(summary,actions);toolbar.append(menu);
  if(route.page==='home')toolbar.hidden=true;
  else {
    menu.hidden=true;const heading=element('h1','',route.page==='movies'?'Movies':'TV Shows'), switcher=element('select');switcher.setAttribute('aria-label','Browse mode');
    for(const [value,label] of [['suggestions','Suggestions'],['library','Library'],['genres','Genres']]){const option=element('option','',label);option.value=value;option.selected=route.view===value;switcher.append(option);}
    switcher.addEventListener('change',()=>{const q=new URLSearchParams(location.hash.split('?')[1]||'');q.set('tab',switcher.value==='library'?'0':switcher.value==='genres'?(route.page==='movies'?'4':'3'):'1');location.hash=location.hash.split('?')[0]+'?'+q;});toolbar.prepend(heading,switcher);if(route.view!=='library')toolbar.append(s.filterToggle);
  }
  footer.append(s.more, s.note); root.append(toolbar,panel,matchCount,status,list,footer);
  if(route.page==='home') target.native.after(root); else target.native.before(root); state = s;
  let full = route.view==='library'; try { if(route.page==='home')full = localStorage.getItem(prefKey(api, route.page)) === 'native'; } catch { /* A private browser can still use the unsaved view. */ }
  if (typeof IntersectionObserver === 'function') {
    s.io = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) loadMore(s, true); }, { rootMargin: '600px 0px' }); s.io.observe(footer);
  }
  setMode(s, full, false);
}
let scrollQueued = false;
function scheduleScroll() {
  if (scrollQueued || stopped) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    scrollQueued = false;
    const s = state; if (!s || s.full || !s.root.isConnected) return;
    if (s.config) virtualize(s);
    const rect = s.footer.getBoundingClientRect();
    if (rect.top < innerHeight + 600 && rect.bottom >= 0) loadMore(s, true);
  });
}
function schedule() { if (!timer && !stopped) timer = setTimeout(reconcile, 120); }
function navSuggestions(event){
  const target=event.target.closest?.('[data-sleekfin-header-proxy-item],a[href]');if(!target)return;
  const proxy=target.getAttribute('data-sleekfin-header-proxy-item');
  const page=proxy==='jellyfin:movies'?'movies':proxy==='jellyfin:shows'?'tv':null;
  let route=page?`#/${page}`:target.getAttribute('href');
  if(!page&&!target.closest('header,.headerTabs'))return;
  if(!/^#\/(movies|tv|tvshows)(?:[?]|$)/.test(route||''))return;
  const [path,raw='']=route.split('?'),q=new URLSearchParams(raw);q.set('tab','1');
  event.preventDefault();event.stopImmediatePropagation?.();event.stopPropagation();location.hash=path+'?'+q;
}
function rememberFocus(event) {
  const s=state,card=event.target.closest?.('.fx-card');
  if(s&&card&&s.root.contains(card))s.lastFocus={row:s.slots.findIndex(slot=>slot.node.contains(card)),id:card.dataset.itemId};
}
function remoteKey(event) {
  const s=state;
  const key=({37:'ArrowLeft',38:'ArrowUp',39:'ArrowRight',40:'ArrowDown',13:'Enter',27:'Escape',10009:'Escape',461:'Escape',457:'ContextMenu'}[event.keyCode])||event.key;
  const target=event.target||document.activeElement;
  if(activeDialog){
    if(key==='Escape'||event.keyCode===10009){event.preventDefault();event.stopPropagation();closeDialog();return;}
    if(key==='Tab'){
      const controls=[...activeDialog.dialog.querySelectorAll('button,a[href],input,select,textarea')].filter(n=>!n.disabled&&!n.hidden);
      const n=controls.indexOf(document.activeElement);
      if(controls.length&&(event.shiftKey&&n<=0||!event.shiftKey&&n===controls.length-1)){event.preventDefault();focusNode(controls[event.shiftKey?controls.length-1:0]);}
    }
    if(!s||!controlsMode(s).tv||target?.matches?.('input,select,textarea'))return;
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(key)){
      const controls=[...activeDialog.dialog.querySelectorAll('button,a[href]')].filter(n=>!n.disabled),index=controls.indexOf(document.activeElement);
      const rect=(document.activeElement||controls[0])?.getBoundingClientRect();
      if(controls.length&&rect){
        const x=(rect.left+rect.right)/2,y=(rect.top+rect.bottom)/2;
        const ranked=controls.filter(n=>n!==document.activeElement).map(node=>{const r=node.getBoundingClientRect(),dx=(r.left+r.right)/2-x,dy=(r.top+r.bottom)/2-y;const primary=key==='ArrowLeft'?-dx:key==='ArrowRight'?dx:key==='ArrowUp'?-dy:dy;return{node,primary,score:primary+3*Math.abs(key==='ArrowLeft'||key==='ArrowRight'?dy:dx)};}).filter(n=>n.primary>2).sort((a,b)=>a.score-b.score);
        event.preventDefault();event.stopPropagation();if(ranked.length)focusNode(ranked[0].node);
      }
    }
    return;
  }
  if(!s||s.full||!controlsMode(s).tv||!s.root.isConnected||document.fullscreenElement||target?.matches?.('input,select,textarea,[contenteditable="true"]'))return;
  if(!s.root.contains(target)&&target!==document.body)return;
  const card=target.closest?.('.fx-card');
  if((key==='ContextMenu'||event.keyCode===457)&&card){
    const item=s.inventory?.items.find(i=>i.Id===card.dataset.itemId);if(item){event.preventDefault();event.stopPropagation();moreLikeThis(item,s);}return;
  }
  if(key==='Enter'&&card){
    event.preventDefault();event.stopPropagation();
    if(event.repeat||selectHold)return;
    selectHold={node:card,fired:false,timer:setTimeout(()=>{if(selectHold?.node===card&&state===s){selectHold.fired=true;const item=s.inventory.items.find(i=>i.Id===card.dataset.itemId);if(item)moreLikeThis(item,s);}},650)};return;
  }
  if(key==='Escape'&&s.root.querySelector('.fx-feed-menu[open]')){event.preventDefault();event.stopPropagation();s.root.querySelector('.fx-feed-menu').removeAttribute('open');focusNode(s.root.querySelector('.fx-feed-menu>summary'));return;}
  if(key==='Escape'&&!s.panel.hidden){event.preventDefault();event.stopPropagation();s.panel.hidden=true;focusNode(s.filterToggle);return;}
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(key))return;
  let next;
  if(card){
    const slotIndex=s.slots.findIndex(slot=>slot.node.contains(card)),track=card.closest('.fx-track'),cards=[...track.querySelectorAll('.fx-card')],index=cards.indexOf(card);
    if(key==='ArrowLeft'||key==='ArrowRight')next=cards[(index+(key==='ArrowLeft'?-1:1)+cards.length)%cards.length];
    else{
      const nextSlot=s.slots[slotIndex+(key==='ArrowUp'?-1:1)];
      if(nextSlot){if(!nextSlot.live)fillSlot(nextSlot,s);const options=[...nextSlot.node.querySelectorAll('.fx-card')];next=options[Math.min(index,options.length-1)];}
      else if(key==='ArrowUp')next=s.route.page==='home'?s.page.querySelector('.sleekfin-hero button,.sleekfin-hero a[href]'):s.root.querySelector('.fx-toolbar select');
      else {next=s.more;if(!s.finished)loadMore(s);}
    }
  }else{
    const bar=[...s.root.querySelectorAll('.fx-toolbar summary,.fx-toolbar details[open] button')].filter(b=>!b.disabled),n=bar.indexOf(target);
    if(key==='ArrowDown')next=s.list.querySelector('.fx-card')||s.more;
    else next=bar[Math.max(0,Math.min(bar.length-1,n+(key==='ArrowLeft'?-1:1)))];
  }
  if(next){event.preventDefault();event.stopPropagation();focusNode(next);}
}
function remoteKeyUp(event){
  if(!selectHold||!(event.key==='Enter'||event.keyCode===13))return;
  event.preventDefault();event.stopPropagation();const held=selectHold;selectHold=null;clearTimeout(held.timer);
  if(!held.fired&&held.node.isConnected)held.node.click();
}
function start() {
  const style = element('style'); style.id = 'fx-discovery-style'; style.textContent = DISCOVERY_CSS; document.head.append(style);
  observer = new MutationObserver(records => {
    if (records.some(r => !r.target.closest?.('.fx-discovery,.fx-dialog') && (r.type === 'childList' || r.attributeName === 'class'))) schedule();
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  document.addEventListener('click',navSuggestions,true);window.addEventListener('hashchange', schedule); document.addEventListener('viewshow', schedule);
  document.addEventListener('keydown',remoteKey,true);document.addEventListener('keyup',remoteKeyUp,true);document.addEventListener('focusin',rememberFocus);
  document.addEventListener('scroll', scheduleScroll, { passive: true, capture: true }); window.addEventListener('resize', scheduleScroll);
  // Sign-out / server switch can occur without a hash change.
  heartbeat = setInterval(schedule, 2000); reconcile();
}
window.FazFortDiscovery = {
  version: VERSION, restart, openSettings:()=>openUserSettings(window.ApiClient),
  diagnostics: () => ({ version: VERSION, page: state?.route.page || null, mounted: !!state, items: state?.inventory?.items.length || 0, shelves: state?.planner?.shelves.length || 0, loadedRows: state?.slots.length || 0, liveRows: state?.slots.filter(s => s.live).length || 0,trackingReady:!!state?.trackingReady,preferencesSync:!!state?.syncAvailable,controls:state?controlsMode(state).mode:null,warnings: [...(state?.warnings || [])], supportedPageFound: !!(routeInfo(location.hash) && locate(routeInfo(location.hash))) }),
  stop() {
    stopped = true; clearTimeout(timer); clearInterval(heartbeat); observer?.disconnect(); cleanup(false); snapshots.clear();savedFeeds.clear();
    document.removeEventListener('click',navSuggestions,true);window.removeEventListener('hashchange', schedule); document.removeEventListener('viewshow', schedule); document.removeEventListener('scroll', scheduleScroll, true); window.removeEventListener('resize', scheduleScroll);
    document.removeEventListener('keydown',remoteKey,true);document.removeEventListener('keyup',remoteKeyUp,true);document.removeEventListener('focusin',rememberFocus);
    document.querySelectorAll('[data-fx-settings-link]').forEach(n=>n.remove());document.getElementById('fx-discovery-style')?.remove(); delete window.FazFortDiscovery;
  }
};
if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
}
