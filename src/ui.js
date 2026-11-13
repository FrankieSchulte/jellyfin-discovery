export function bootDiscovery(DEFAULT_CONFIG, DISCOVERY_CSS) {
const VERSION = '0.5.1';
if (window.FazFortDiscovery?.version === VERSION) return;
window.FazFortDiscovery?.stop?.();
// The older helper can otherwise reorder native rows while this feed is mounted.
window.FazFortHomeFeed?.stop?.();
let state = null, generation = 0, observer, timer, heartbeat, stopped = false;
const snapshots = new Map();
const savedFeeds = new Map();
const loadedImages = new Set();
let activeDialog = null, lastScope = '', selectHold = null, downloadMenu = null, downloadMenuTrigger = null;
const element = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const button = (text, action) => { const b = element('button', '', text); b.type = 'button'; b.addEventListener('click', action); return b; };
const scopeKey = api => `${api.serverId?.() || location.origin}:${api.getCurrentUserId()}`;
const configKey = api => `fazfort-discovery:config:v1:${scopeKey(api)}`;
const prefKey = (api, page) => `fazfort-discovery:view:${scopeKey(api)}:${page}`;
const bootRowsKey = (scope, route) => `fazfort-discovery:boot:v2:${scope}:${route.page}:${route.parentId || ''}:${route.view || 'home'}`;
const trackingCacheKey = scope => `fazfort-discovery:tracking:v1:${scope}`;
function readTrackingCache(scope) {
  if (!scope) return new Map();
  try {
    const raw = localStorage.getItem(trackingCacheKey(scope));
    if (!raw) return new Map();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.entries)) return new Map();
    return new Map(parsed.entries);
  } catch { return new Map(); }
}
function writeTrackingCache(scope, map) {
  if (!scope || !(map instanceof Map)) return;
  try {
    localStorage.setItem(trackingCacheKey(scope), JSON.stringify({ at: Date.now(), entries: [...map.entries()] }));
  } catch {}
}
function readBootRows(s, configStr) {
  if (s.full || s.route.view === 'genres') return null;
  try {
    const raw = localStorage.getItem(bootRowsKey(s.scope, s.route));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.config !== configStr || !Array.isArray(parsed.rows) || !parsed.rows.length) return null;
    if (Date.now() - (parsed.at || 0) > 7 * 24 * 3600 * 1000) return null;
    return { rows: parsed.rows, shuffle: parsed.shuffle };
  } catch { return null; }
}
function writeBootRows(s) {
  if (s.full || s.route.view === 'genres' || filtersActive(s.filters) || s.filters.sort !== 'recommended' || !s.slots.length || !s.config) return;
  try {
    const rows = s.slots.filter(slot => !slot.boot).slice(0, 4).map(slot => slot.data);
    if (!rows.length) return;
    localStorage.setItem(bootRowsKey(s.scope, s.route), JSON.stringify({ at: Date.now(), shuffle: s.shuffle, config: JSON.stringify(s.config), rows }));
  } catch {}
}
function clearBootRows(scope) {
  if (!scope) return;
  try {
    for (const page of ['home', 'movies', 'shows']) {
      for (const view of ['home', 'suggestions']) {
        localStorage.removeItem(bootRowsKey(scope, { page, parentId: '', view }));
      }
    }
  } catch {}
}
function applyWebpackViewPatch(req) {
  if (!req?.m) return;
  try {
    if (req.m[57826]) {
      const modViews = req(57826);
      const list = modViews?.u;
      if (Array.isArray(list)) {
        const moviesEntry = list.find(x => x?.path === '/movies');
        if (moviesEntry) {
          moviesEntry.views = [
            { index: 1, label: 'Movies', view: 'suggestions', isDefault: true },
            { index: 0, label: 'Library', view: 'movies' },
            { index: 2, label: 'Favorites', view: 'favorites' },
            { index: 4, label: 'Genres', view: 'genres' }
          ];
        }
        const tvEntry = list.find(x => x?.path === '/tv');
        if (tvEntry) {
          tvEntry.views = [
            { index: 1, label: 'TV Shows', view: 'suggestions', isDefault: true },
            { index: 0, label: 'Library', view: 'series' },
            { index: 2, label: 'Favorites', view: 'favorites' },
            { index: 3, label: 'Genres', view: 'genres' }
          ];
        }
      }
    }
    if (req.m[95753]) {
      const modMap = req(95753);
      const map = modMap?.A;
      if (map?.movies) {
        map.movies[1] = {
          viewType: 'fx-suggestions',
          collectionType: 'movies',
          itemType: [],
          isBtnPlayAllEnabled: false,
          isBtnShuffleEnabled: false,
          isBtnFilterEnabled: false,
          isBtnGridListEnabled: false,
          isBtnSortEnabled: false,
          isAlphabetPickerEnabled: false,
          isAlphaPickerEnabled: false
        };
        map.movies[4] = {
          viewType: 'fx-genres',
          collectionType: 'movies',
          itemType: [],
          isBtnPlayAllEnabled: false,
          isBtnShuffleEnabled: false,
          isBtnFilterEnabled: false,
          isBtnGridListEnabled: false,
          isBtnSortEnabled: false,
          isAlphabetPickerEnabled: false,
          isAlphaPickerEnabled: false
        };
        for (const k of [0, 1, 2, 3, 4]) {
          if (map.movies[k] && typeof map.movies[k] === 'object') {
            map.movies[k].isAlphabetPickerEnabled = false;
            map.movies[k].isAlphaPickerEnabled = false;
          }
        }
        Object.values(map.movies).forEach(v => {
          if (v && typeof v === 'object') {
            v.isBtnPlayAllEnabled = false;
            v.isBtnShuffleEnabled = false;
            v.isAlphabetPickerEnabled = false;
            v.isAlphaPickerEnabled = false;
          }
        });
      }
      if (map?.tvshows) {
        map.tvshows[1] = {
          viewType: 'fx-suggestions',
          collectionType: 'tvshows',
          itemType: [],
          isBtnPlayAllEnabled: false,
          isBtnShuffleEnabled: false,
          isBtnFilterEnabled: false,
          isBtnGridListEnabled: false,
          isBtnSortEnabled: false,
          isAlphabetPickerEnabled: false,
          isAlphaPickerEnabled: false
        };
        map.tvshows[2] = {
          viewType: 'favorites',
          collectionType: 'tvshows',
          itemType: ['Series'],
          isBtnPlayAllEnabled: false,
          isBtnShuffleEnabled: false,
          isBtnFilterEnabled: true,
          isBtnGridListEnabled: true,
          isBtnSortEnabled: true,
          isAlphabetPickerEnabled: false,
          isAlphaPickerEnabled: false
        };
        map.tvshows[3] = {
          viewType: 'fx-genres',
          collectionType: 'tvshows',
          itemType: [],
          isBtnPlayAllEnabled: false,
          isBtnShuffleEnabled: false,
          isBtnFilterEnabled: false,
          isBtnGridListEnabled: false,
          isBtnSortEnabled: false,
          isAlphabetPickerEnabled: false,
          isAlphaPickerEnabled: false
        };
        for (const k of [0, 1, 2, 3, 4]) {
          if (map.tvshows[k] && typeof map.tvshows[k] === 'object') {
            map.tvshows[k].isAlphabetPickerEnabled = false;
            map.tvshows[k].isAlphaPickerEnabled = false;
          }
        }
        Object.values(map.tvshows).forEach(v => {
          if (v && typeof v === 'object') {
            v.isBtnPlayAllEnabled = false;
            v.isBtnShuffleEnabled = false;
            v.isAlphabetPickerEnabled = false;
            v.isAlphaPickerEnabled = false;
          }
        });
      }
      if (map?.boxsets) {
        for (const k of [0, 1, 2, 3, 4]) {
          if (map.boxsets[k] && typeof map.boxsets[k] === 'object') {
            map.boxsets[k].isAlphabetPickerEnabled = false;
            map.boxsets[k].isAlphaPickerEnabled = false;
          }
        }
        Object.values(map.boxsets).forEach(v => {
          if (v && typeof v === 'object') {
            v.isBtnPlayAllEnabled = false;
            v.isBtnShuffleEnabled = false;
            v.isAlphabetPickerEnabled = false;
            v.isAlphaPickerEnabled = false;
          }
        });
      }
    }
    if (req.m[95988] && !req.m[95988]._fxPatched) {
      const orig95988 = req.m[95988];
      const wrapped95988 = function(module, exports, wreq) {
        orig95988(module, exports, wreq);
        try {
          const react = wreq(96540);
          const router = wreq(96303);
          if (react?.useState && router?.useSearchParams) {
            const safeUseSearchParam = function(paramKey, defaultValue = '') {
              const [searchParams, setSearchParams] = router.useSearchParams();
              const urlVal = searchParams.get(paramKey) || defaultValue;
              const [val, setVal] = react.useState(urlVal);
              const typingRef = react.useRef(false);
              const timerRef = react.useRef(0);
              react.useEffect(() => {
                if (!typingRef.current && urlVal !== val) {
                  setVal(urlVal);
                }
              }, [urlVal]);
              react.useEffect(() => () => clearTimeout(timerRef.current), []);
              const updateVal = react.useCallback(nextVal => {
                const str = String(nextVal ?? '');
                typingRef.current = true;
                setVal(str);
                clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                  typingRef.current = false;
                  const currentUrlVal = searchParams.get(paramKey) || defaultValue;
                  if (currentUrlVal !== str) {
                    const nextParams = new URLSearchParams(searchParams);
                    if (str.trim()) nextParams.set(paramKey, str);
                    else nextParams.delete(paramKey);
                    setSearchParams(nextParams, { replace: true });
                  }
                }, 450);
              }, [paramKey, defaultValue, searchParams, setSearchParams]);
              return [val, updateVal];
            };
            try {
              Object.defineProperty(exports, 'A', { configurable: true, enumerable: true, get: () => safeUseSearchParam });
            } catch {
              exports.A = safeUseSearchParam;
            }
          }
        } catch {}
      };
      wrapped95988._fxPatched = true;
      req.m[95988] = wrapped95988;
      if (req.c?.[95988]) {
        delete req.c[95988];
        try { req(95988); } catch {}
      }
    }
    if (req.m[42111] && !req.m[42111]._fxPatched) {
      const orig42111 = req.m[42111];
      const wrapped42111 = function(module, exports, wreq) {
        orig42111(module, exports, wreq);
        try {
          const origHook = exports.u;
          if (typeof origHook === 'function') {
            const cappedHook = function(parentId, collectionType, query) {
              const trimmed = typeof query === 'string' ? query.trim() : '';
              const res = origHook(parentId, collectionType, trimmed);
              if (res && Array.isArray(res.data)) {
                return {
                  ...res,
                  data: res.data.map(sec => sec && Array.isArray(sec.items) && sec.items.length > 24 ? { ...sec, items: sec.items.slice(0, 24) } : sec)
                };
              }
              return res;
            };
            try {
              Object.defineProperty(exports, 'u', { configurable: true, enumerable: true, get: () => cappedHook });
            } catch {
              exports.u = cappedHook;
            }
          }
        } catch {}
      };
      wrapped42111._fxPatched = true;
      req.m[42111] = wrapped42111;
      if (req.c?.[42111]) {
        delete req.c[42111];
        try { req(42111); } catch {}
      }
    }
  } catch {}
}
function patchLibraryViews() {
  const chunks = window.webpackChunk;
  if (!chunks || typeof chunks.push !== 'function') return;
  try {
    if (!chunks._fxHooked) {
      chunks.push([['fx-discovery-views-' + Date.now()], {}, req => {
        window._fxWebpackReq = req;
        applyWebpackViewPatch(req);
      }]);
      const origPush = chunks.push.bind(chunks);
      chunks.push = function(...args) {
        const res = origPush(...args);
        if (window._fxWebpackReq) applyWebpackViewPatch(window._fxWebpackReq);
        return res;
      };
      chunks._fxHooked = true;
    } else if (window._fxWebpackReq) {
      applyWebpackViewPatch(window._fxWebpackReq);
    }
  } catch {}
}
function hideLeavingSoonNav() {
  try {
    const raw = window.sessionStorage?.getItem?.('sleekfin:header-sources:v2');
    if (raw && /leaving\s+soon/i.test(raw)) {
      const parsed = JSON.parse(raw);
      const keep = entry => !/leaving\s+soon/i.test(String(entry?.caption || entry?.label || entry?.title || entry?.name || ''));
      if (Array.isArray(parsed)) {
        window.sessionStorage.setItem('sleekfin:header-sources:v2', JSON.stringify(parsed.filter(keep)));
      } else if (parsed && typeof parsed === 'object') {
        for (const k of Object.keys(parsed)) {
          if (Array.isArray(parsed[k])) parsed[k] = parsed[k].filter(keep);
        }
        window.sessionStorage.setItem('sleekfin:header-sources:v2', JSON.stringify(parsed));
      }
    }
  } catch {}
  let changed = false;
  document.querySelectorAll('[data-sleekfin-header-proxy] button, [data-sleekfin-header-proxy] a, [data-sleekfin-header-overflow-drawer] button, [data-sleekfin-header-overflow-drawer] a, header button, header a, .mainDrawer a, .mainDrawer button, .MuiDrawer-root a, .MuiDrawer-root button, #user-view-overflow-menu a, #user-view-overflow-menu li, #user-view-overflow-menu [role="menuitem"]').forEach(node => {
    const text = (node.getAttribute('aria-label') || node.getAttribute('title') || node.textContent || '').trim();
    if (!/leaving\s+soon/i.test(text)) return;
    if (node.getAttribute('data-fx-leaving-hidden') !== 'true') {
      node.setAttribute('data-fx-leaving-hidden', 'true');
      changed = true;
    }
    if (node.style.display !== 'none') node.style.display = 'none';
    if (!node.closest?.('[data-sleekfin-header-proxy],[data-sleekfin-header-overflow-drawer]')) {
      if (!node.hidden) node.hidden = true;
      if (!node.classList?.contains('hide')) node.classList?.add?.('hide');
      const listItem = node.closest?.('.MuiDrawer-root .MuiListItem-root');
      if (listItem && listItem.getAttribute('data-fx-leaving-hidden') !== 'true') {
        listItem.setAttribute('data-fx-leaving-hidden', 'true');
        listItem.hidden = true;
        listItem.classList?.add?.('hide');
      }
    }
  });
  if (changed && typeof Event === 'function') {
    const fire = () => { try { window.dispatchEvent?.(new Event('resize')); } catch {} };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(fire);
    else setTimeout(fire, 0);
  }
}
function syncHomeModeAttr(api = window.ApiClient) {
  const rootEl = document.documentElement;
  if (!rootEl) return;
  let isNative = false;
  if (state?.route?.page === 'home') {
    isNative = !!(state.full || state.failed);
  } else if (api?.getCurrentUserId?.()) {
    try { isNative = localStorage.getItem(prefKey(api, 'home')) === 'native'; } catch {}
  }
  if (isNative) {
    if (rootEl.getAttribute('data-fx-home-mode') !== 'native') rootEl.setAttribute('data-fx-home-mode', 'native');
  } else if (rootEl.hasAttribute('data-fx-home-mode')) {
    rootEl.removeAttribute('data-fx-home-mode');
  }
}
function scrollToTop() {
  try { window.scrollTo(0, 0); } catch {}
  if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
  document.querySelectorAll('.page:not(.hide), #indexPage, #moviesPage, #tvshowsPage, #tvRecommendedPage, #boxsetsPage, #searchPage').forEach(p => {
    if (p.scrollTop) p.scrollTop = 0;
  });
}
function syncLibraryViewMenu() {
  patchLibraryViews();
  hideLeavingSoonNav();
  const h = String(location.hash || '').replace(/^#!?\/?/, '').replace(/^\//, '');
  const [path, query = ''] = h.split('?');
  const name = path.replace(/\.html$/, '').toLowerCase();
  const p = new URLSearchParams(query);
  const col = p.get('collectionType')?.toLowerCase();
  const rawTab = p.get('tab');
  const isMovies = name === 'movies' || (name === 'list' && col === 'movies');
  const isTv = name === 'tv' || name === 'tvshows' || (name === 'list' && col === 'tvshows');
  const isBoxsets = name === 'boxsets' || (name === 'list' && col === 'boxsets');
  const isLiveTv = name.startsWith('livetv') || col === 'livetv';
  const isHomeOrSearch = name === '' || name === 'home' || name === 'index' || name === 'search';
  const movieOrTvTab = rawTab || '1';
  const hideChip = (isMovies && movieOrTvTab !== '0' && movieOrTvTab !== '2')
    || (isTv && movieOrTvTab !== '0' && movieOrTvTab !== '2')
    || (isBoxsets && Boolean(rawTab && rawTab !== '0' && rawTab !== '1'))
    || isLiveTv
    || isHomeOrSearch;
  if (document.documentElement) {
    if (hideChip) {
      if (document.documentElement.getAttribute('data-fx-hide-count-chip') !== 'true') {
        document.documentElement.setAttribute('data-fx-hide-count-chip', 'true');
      }
    } else if (document.documentElement.hasAttribute('data-fx-hide-count-chip')) {
      document.documentElement.removeAttribute('data-fx-hide-count-chip');
    }
  }
  if (!isMovies && !isTv) return;
  const tab = movieOrTvTab;
  const expectedLabel = isMovies
    ? (tab === '0' ? 'Library' : tab === '2' ? 'Favorites' : tab === '4' ? 'Genres' : 'Movies')
    : (tab === '0' ? 'Library' : tab === '2' ? 'Favorites' : tab === '3' ? 'Genres' : 'TV Shows');
  const btn = document.querySelector('button[aria-controls="library-view-menu"]');
  if (btn) {
    const typo = btn.querySelector('.MuiTypography-root');
    if (typo) {
      if (typo.textContent !== expectedLabel) typo.textContent = expectedLabel;
    } else {
      const textNode = [...btn.childNodes].find(n => n.nodeType === 3);
      if (textNode && textNode.nodeValue !== expectedLabel) textNode.nodeValue = expectedLabel;
    }
  }
  const menuList = document.querySelector('#library-view-menu .MuiList-root');
  if (menuList) {
    const items = [...menuList.querySelectorAll('.MuiMenuItem-root')];
    const removeLabels = new Set(['studios', 'playlists', 'collections', 'tv networks', 'networks', 'upcoming', 'episodes']);
    items.forEach((item, idx) => {
      const txt = (item.textContent || '').trim();
      const lower = txt.toLowerCase();
      if (removeLabels.has(lower)) {
        item.style.display = 'none';
        return;
      }
      if (lower === 'suggestions') {
        const tn = [...item.childNodes].find(n => n.nodeType === 3);
        if (tn) tn.nodeValue = isMovies ? 'Movies' : 'TV Shows';
        else item.textContent = isMovies ? 'Movies' : 'TV Shows';
      } else if ((isMovies && lower === 'movies' && idx > 0) || (isTv && (lower === 'shows' || lower === 'series'))) {
        const tn = [...item.childNodes].find(n => n.nodeType === 3);
        if (tn) tn.nodeValue = 'Library';
        else item.textContent = 'Library';
      }
    });
  }
}
function upgradeLegacyConfig(cfg) {
  if (cfg && typeof cfg === 'object' && cfg.cardsPerShelf === 8) {
    cfg.cardsPerShelf = 20;
  }
  return cfg;
}
function readConfig(api) {
  try {
    const raw = localStorage.getItem(configKey(api));
    const parsed = raw ? upgradeLegacyConfig(JSON.parse(raw)) : cloneJson(DEFAULT_CONFIG);
    return validateConfig(parsed);
  }
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
  if (item.Type === 'SeeMore') {
    const kind = item.SeeMoreKind || 'movies';
    return `#/home?requesthub=discover&rhView=${encodeURIComponent(kind)}`;
  }
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
function attachSimilarControls(entry, card, item, s, name) {
  if (entry.querySelector('.fx-card-more')) return;
  if (['Movie', 'Series'].includes(item.Type) && s.inventory?.items?.some(i => i.Id === item.Id)) {
    const more = button('⋯', () => moreLikeThis(item, s));
    more.className = 'fx-card-more';
    more.title = 'More like this';
    more.setAttribute('aria-label', `More like ${name}`);
    entry.append(more);
    card.addEventListener('contextmenu', event => { event.preventDefault(); moreLikeThis(item, s); });
  }
}
function syncEntryBadge(entry, item, s) {
  const visual = entry.querySelector('.fx-card-visual');
  if (!visual) return;
  const text = badgeFor(item, s.badges, s.now, s.tracking);
  let badge = visual.querySelector('.fx-badge');
  if (!text) { badge?.remove(); return; }
  if (!badge) { badge = element('span', 'fx-badge'); visual.append(badge); }
  if (badge.textContent !== text) badge.textContent = text;
}
function renderCard(item, s, withSimilar = true, layout = 'landscape') {
  const card = element('a', 'fx-card'); card.href = itemHref(item, s.api) || '#';
  card.dataset.itemId = item.Id || '';
  card.addEventListener('click', () => {
    if (s.slots?.length) {
      s.lastFocus = { row: s.slots.findIndex(slot => slot.node.contains(card)), id: item.Id };
      saveFeed(s);
    }
    if (item.Type === 'SeeMore') {
      scrollToTop();
      setTimeout(scrollToTop, 40);
    }
    if (activeDialog) closeDialog();
  });
  // Same-context navigation works in mobile web wrappers and TV browser shells.
  if (/^https?:/i.test(card.getAttribute('href'))) card.rel = 'noopener noreferrer';
  const name = item.Type === 'Episode' ? `${item.SeriesName || item.Name} · ${item.Name}` : item.Name || 'Untitled';
  if (item.Type === 'SeeMore') {
    const isTv = item.SeeMoreKind === 'tv' || /tv|series|show/i.test(item.Id || '') || /tv|series|show/i.test(item.Name || '');
    const boxLabel = item.SeeMoreLabel || 'See More';
    const boxSub = item.SeeMoreSub && !/^Browse /i.test(item.SeeMoreSub)
      ? item.SeeMoreSub
      : (isTv ? 'Popular Series' : 'Popular Movies');
    const caption = /^See More/i.test(name)
      ? (isTv ? 'All Popular Series' : 'All Popular Movies')
      : name;
    card.classList.add('fx-see-more-link');
    const visual = element('div', 'fx-card-visual fx-see-more-poster');
    visual.append(
      element('span', 'fx-see-more-arrow', '→'),
      element('span', 'fx-see-more-label', boxLabel),
      element('span', 'fx-see-more-sub', boxSub)
    );
    card.append(visual, element('span', 'fx-name', caption));
    card.title = caption;
    const entry = element('div', `fx-card-entry fx-card-${layout} fx-see-more-card`);
    entry.append(card);
    return entry;
  }
  const visual = element('div', 'fx-card-visual');
  const placeholder = element('span', 'fx-placeholder', name);
  const choices = imageChoices(item, s.api, layout);
  if (choices.length) {
    placeholder.hidden = true;
    const firstCached = loadedImages.has(choices[0].url);
    if (!firstCached) visual.classList.add('is-loading');
    const img = element('img'); img.alt = ''; img.loading = firstCached ? 'eager' : 'lazy'; img.decoding = firstCached ? 'sync' : 'async';
    let index = 0;
    const use = () => {
      const choice = choices[index++];
      const cached = loadedImages.has(choice.url);
      img.className = (choice.poster ? 'fx-poster' : '') + (cached ? ' is-loaded is-instant' : '');
      if (cached) visual.classList.remove('is-loading');
      img.src = choice.url;
      if (img.complete && img.naturalWidth > 0) {
        loadedImages.add(choice.url);
        placeholder.hidden = true;
        visual.classList.remove('is-loading');
        img.classList.add('is-loaded', 'is-instant');
      }
    };
    img.addEventListener('load', () => {
      const activeUrl = choices[Math.max(0, index - 1)]?.url;
      if (activeUrl) loadedImages.add(activeUrl);
      if (img.currentSrc) loadedImages.add(img.currentSrc);
      placeholder.hidden = true;
      visual.classList.remove('is-loading');
      img.classList.add('is-loaded');
    });
    img.addEventListener('error', () => { if (index < choices.length) use(); else { img.remove(); visual.classList.remove('is-loading'); placeholder.hidden = false; } });
    use(); visual.append(placeholder, img);
  } else {
    visual.append(placeholder);
  }
  const percent = Math.max(0, Math.min(100, Number(item.UserData?.PlayedPercentage || (item.RunTimeTicks ? 100 * (item.UserData?.PlaybackPositionTicks || 0) / item.RunTimeTicks : 0))));
  if (percent > 0 && percent < 100) { const progress = element('div', 'fx-progress'); const fill = element('span'); fill.style.width = percent + '%'; progress.append(fill); visual.append(progress); }
  const badge = badgeFor(item, s.badges, s.now, s.tracking);
  if (badge) visual.append(element('span', 'fx-badge', badge));
  card.append(visual, element('span', 'fx-name', name)); card.title = name;
  const entry = element('div', `fx-card-entry fx-card-${layout}`); entry.append(card);
  if (withSimilar) attachSimilarControls(entry, card, item, s, name);
  return entry;
}
function snapScrollDelta(track, direction, fallbackStep) {
  const children = [...track.children];
  if (children.length < 2) return direction * fallbackStep;
  const base = typeof children[0]?.offsetLeft === 'number' ? children[0].offsetLeft : 0;
  const snaps = children.map(c => (typeof c.offsetLeft === 'number' ? c.offsetLeft - base : 0));
  if (!snaps.some(x => x > 0)) return direction * fallbackStep;
  const current = track.scrollLeft;
  const desired = current + direction * fallbackStep;
  const candidates = snaps.filter(pos => direction > 0 ? pos > current + 8 : pos < current - 8);
  if (!candidates.length) return direction * fallbackStep;
  let best = candidates[0];
  for (const pos of candidates) {
    if (Math.abs(pos - desired) < Math.abs(best - desired)) best = pos;
  }
  return best - current;
}
function fillSlot(slot, s) {
  const row = slot.data;
  const head = element('div', 'fx-row-head'), title = element('h2', '', row.title), track = element('div', 'fx-track');
  const baseCount = row.items.length;
  const hasSeeMore = row.key === 'DiscoverMovies' || row.key === 'DiscoverTV' || row.items.some(i => i.Type === 'SeeMore');
  if (hasSeeMore) track.dataset.noLoop = 'true';
  const copies = row.key !== 'MyMedia' && !hasSeeMore && baseCount >= 2
    ? (s.route.view === 'genres' ? Math.max(2, Math.ceil(12 / baseCount)) : Math.max(6, Math.ceil(32 / baseCount)))
    : 1;
  const cycleWidth = () => {
    if (copies <= 1) return 0;
    const first = track.children[0], secondCycle = track.children[baseCount];
    return first && secondCycle && typeof secondCycle.offsetLeft === 'number' && secondCycle.offsetLeft > first.offsetLeft ? secondCycle.offsetLeft - first.offsetLeft : 0;
  };
  const normalizeLoop = () => {
    if (track._fxProgrammatic) return;
    const cw = cycleWidth();
    if (!cw) return;
    while (track.scrollLeft >= cw * 2) track.scrollLeft -= cw;
    if (track.scrollLeft <= 2 && track._fxMoved) track.scrollLeft += cw;
  };
  const scroll = direction => {
    const cw = cycleWidth(), step = Math.max(250, Math.round(track.clientWidth * 0.85));
    if (cw > 0) {
      clearTimeout(track._fxScrollTimer);
      track._fxProgrammatic = true;
      const prevBehavior = track.style.scrollBehavior;
      track.style.scrollBehavior = 'auto';
      if (direction > 0) {
        while (track.scrollLeft >= cw * 2 || track.scrollLeft + step >= cw * (copies - 1.2)) track.scrollLeft -= cw;
      } else {
        while (track.scrollLeft < step + 16) track.scrollLeft += cw;
      }
      track.style.scrollBehavior = prevBehavior;
      track._fxMoved = true;
      const delta = snapScrollDelta(track, direction, step);
      track.scrollBy({ left: delta, behavior: 'smooth' });
      track._fxScrollTimer = setTimeout(() => {
        track._fxProgrammatic = false;
        normalizeLoop();
      }, 520);
      return;
    }
    if (hasSeeMore) {
      const delta = snapScrollDelta(track, direction, step);
      track.scrollBy({ left: delta, behavior: 'smooth' });
      return;
    }
    const end = Math.max(0, track.scrollWidth - track.clientWidth);
    if (direction > 0 && track.scrollLeft >= end - 2) track.scrollLeft = 0;
    else if (direction < 0 && track.scrollLeft <= 2) track.scrollLeft = end;
    else {
      const delta = snapScrollDelta(track, direction, step);
      track.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };
  track.addEventListener('scroll', () => {
    if (track.scrollLeft > 12) track._fxMoved = true;
    normalizeLoop();
  }, { passive: true });
  track.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    const cw = cycleWidth();
    if (cw > 0) {
      if (e.deltaX < 0 && track.scrollLeft <= 12) { track.scrollLeft += cw; track._fxMoved = true; }
      else if (e.deltaX > 0 && track.scrollLeft >= cw * (copies - 1.5)) { track.scrollLeft -= cw; track._fxMoved = true; }
      return;
    }
    if (hasSeeMore) return;
    const end = track.scrollWidth - track.clientWidth;
    if (end > 0 && (e.deltaX > 0 && track.scrollLeft >= end - 2 || e.deltaX < 0 && track.scrollLeft <= 2)) { e.preventDefault(); scroll(e.deltaX > 0 ? 1 : -1); }
  }, { passive: false });
  let touchX;
  track.addEventListener('touchstart', e => {
    touchX = e.touches[0]?.clientX;
    const cw = cycleWidth();
    if (cw > 0 && track.scrollLeft <= 12) { track.scrollLeft += cw; track._fxMoved = true; }
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const delta = touchX - e.changedTouches[0]?.clientX;
    if (Math.abs(delta) > 40) {
      const cw = cycleWidth();
      if (cw > 0) { normalizeLoop(); return; }
      if (hasSeeMore) return;
      const end = track.scrollWidth - track.clientWidth;
      if (end > 0 && (delta > 0 && track.scrollLeft >= end - 2 || delta < 0 && track.scrollLeft <= 2)) scroll(delta > 0 ? 1 : -1);
    }
  }, { passive: true });
  const back = button('‹', () => scroll(-1)), forward = button('›', () => scroll(1));
  back.setAttribute('aria-label', `Previous ${row.title}`); forward.setAttribute('aria-label', `More ${row.title}`);
  const token = row.family === 'anchor' ? `anchor:${row.key}` : row.family === 'theme' ? row.key : `family:${row.family}`;
  const requested = s.profile?.layouts?.[token] || row.layout || 'auto';
  const portraitOnly = row.key !== 'MyMedia' && row.items.filter(i => !i.ImageTags?.Thumb && !i.BackdropImageTags?.length && !i.ParentBackdropImageTags?.length && (i.ImageTags?.Primary || i.ProviderIds?.JellyseerrPoster) && (!i.PrimaryImageAspectRatio || i.PrimaryImageAspectRatio < 1)).length > row.items.length / 2;
  const layout = s.route.view === 'genres' ? 'landscape' : requested === 'auto' ? (row.external || row.key === 'DiscoverMovies' || row.key === 'DiscoverTV' || portraitOnly ? 'portrait' : 'landscape') : requested;
  const existingTrack = slot.node.querySelector('.fx-track');
  if (existingTrack && slot.node.dataset.layout === layout) {
    const existingEntries = [...existingTrack.querySelectorAll('.fx-card-entry')];
    const expectedIds = [];
    for (let copy = 0; copy < copies; copy++) {
      row.items.forEach(item => expectedIds.push(item.Id || ''));
    }
    if (existingEntries.length === expectedIds.length && existingEntries.every((el, idx) => (el.querySelector('.fx-card')?.dataset?.itemId || '') === expectedIds[idx])) {
      const existingHeading = slot.node.querySelector('.fx-row-head h2');
      if (existingHeading && existingHeading.textContent !== row.title) existingHeading.textContent = row.title;
      existingEntries.forEach((entry, idx) => {
        const item = row.items[idx % baseCount];
        const card = entry.querySelector('.fx-card');
        if (item && card) {
          const name = item.Type === 'Episode' ? `${item.SeriesName || item.Name} · ${item.Name}` : item.Name || 'Untitled';
          attachSimilarControls(entry, card, item, s, name);
          syncEntryBadge(entry, item, s);
        }
      });
      slot.node.className = 'fx-shelf';
      slot.node.style.height = '';
      slot.live = true;
      return;
    }
  }
  const reusablePool = new Map();
  if (existingTrack && slot.node.dataset.layout === layout) {
    for (const entry of existingTrack.querySelectorAll('.fx-card-entry')) {
      const itemId = entry.querySelector('.fx-card')?.dataset?.itemId || '';
      if (!itemId) continue;
      if (!reusablePool.has(itemId)) reusablePool.set(itemId, []);
      reusablePool.get(itemId).push(entry);
    }
  }
  const preservedScroll = existingTrack ? existingTrack.scrollLeft : (slot.scrollLeft || 0);
  slot.node.dataset.layout = layout;
  head.append(title, back, forward);
  for (let copy = 0; copy < copies; copy++) {
    row.items.forEach(item => {
      const pool = item.Id ? reusablePool.get(item.Id) : null;
      let cardNode = pool?.length ? pool.shift() : null;
      if (cardNode) {
        const card = cardNode.querySelector('.fx-card');
        const name = item.Type === 'Episode' ? `${item.SeriesName || item.Name} · ${item.Name}` : item.Name || 'Untitled';
        if (card) attachSimilarControls(cardNode, card, item, s, name);
        syncEntryBadge(cardNode, item, s);
      } else {
        cardNode = renderCard(item, s, true, layout);
      }
      if (copy > 0) cardNode.dataset.loopClone = String(copy);
      else delete cardNode.dataset.loopClone;
      track.append(cardNode);
    });
  }
  slot.node.replaceChildren(head, track); slot.node.className = 'fx-shelf'; slot.node.style.height = ''; slot.live = true;
  if (preservedScroll) track.scrollLeft = preservedScroll;
}
function virtualize(s) {
  if (state !== s || !s.root.isConnected || s.full) return;
  const center = innerHeight / 2;
  const measured = s.slots.map(slot => {
    const r = slot.node.getBoundingClientRect();
    return { slot, distance: Math.abs((r.top + r.bottom) / 2 - center), height: r.height };
  });
  const keep = new Set(measured.slice().sort((a, b) => a.distance - b.distance).slice(0, s.config.maxLiveRows).map(x => x.slot));
  for (const { slot, height } of measured) {
    if (keep.has(slot) && !slot.live) fillSlot(slot, s);
    else if (!keep.has(slot) && slot.live && !slot.node.contains(document.activeElement)) {
      if (height <= 0) continue;
      slot.scrollLeft = slot.node.querySelector('.fx-track')?.scrollLeft || 0;
      slot.node.style.height = `${height}px`; slot.node.replaceChildren(); slot.node.className = 'fx-shelf fx-placeholder-row'; slot.live = false;
    }
  }
}
function renderSkeletonRows(s, count = 3) {
  if (s.full || s.slots.length) return;
  s.list.replaceChildren();
  for (let r = 0; r < count; r++) {
    const sec = element('section', 'fx-shelf fx-skeleton-row');
    sec.dataset.skeleton = 'true';
    const head = element('div', 'fx-row-head');
    head.append(element('div', 'fx-skeleton-title'));
    const track = element('div', 'fx-track');
    for (let c = 0; c < 6; c++) {
      const entry = element('div', 'fx-card-entry');
      const vis = element('div', 'fx-card-visual is-loading fx-skeleton-box');
      const line = element('div', 'fx-skeleton-line');
      entry.append(vis, line);
      track.append(entry);
    }
    sec.append(head, track);
    s.list.append(sec);
  }
}
function appendRow(row, s, isBoot = false) {
  s.list.querySelectorAll('[data-skeleton="true"]').forEach(n => n.remove());
  const slot = { node: element('section', 'fx-shelf'), data: row, live: false, boot: isBoot };
  if (isBoot) slot.node.dataset.bootRow = 'true';
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
  const hasActiveFilter = filtersActive(s.filters) || s.filters.sort !== 'recommended';
  if (hasActiveFilter) {
    s.filteredQueue = [];
    for (let n=0;n<items.length;n+=s.config.cardsPerShelf) s.filteredQueue.push({key:`filtered:${n}`,title:`Matches ${n+1}–${Math.min(n+s.config.cardsPerShelf,items.length)} of ${items.length}`,family:'filtered',items:items.slice(n,n+s.config.cardsPerShelf)});
  }
  s.matchCount.textContent = hasActiveFilter ? `${items.length} matching titles` : '';
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
  savedFeeds.set(s.key,{config:JSON.stringify(s.config),inventory:s.inventory,tracking:s.tracking,filters:cloneJson(s.filters),planner:s.planner,pending:s.pending,filteredQueue:s.filteredQueue?.slice()||null,rows:s.slots.filter(slot=>!slot.boot).map(slot=>slot.data),openingIndex:s.openingIndex||0,anchorIndex:s.anchorIndex,anchorTurn:s.anchorTurn,finished:s.finished,shuffle:s.shuffle,focus:s.lastFocus,scrollTop:root.scrollTop||0,tracks:s.slots.filter(slot=>!slot.boot).map(slot=>slot.node.querySelector('.fx-track')?.scrollLeft||0),at:Date.now()});
  if(savedFeeds.size>6)savedFeeds.delete(savedFeeds.keys().next().value);
}
function restoreFeed(s, saved) {
  s.slots=[];s.list.replaceChildren();
  s.filters=cloneJson(saved.filters);s.planner=saved.planner;s.pending=saved.pending;s.filteredQueue=saved.filteredQueue?.slice()||null;s.openingIndex=saved.openingIndex||0;s.anchorIndex=saved.anchorIndex;s.anchorTurn=saved.anchorTurn;s.finished=saved.finished;s.shuffle=saved.shuffle;s.lastFocus=saved.focus;
  saved.rows.forEach(row=>appendRow(row,s));
  s.footer.hidden=s.full; s.more.hidden=s.finished; s.more.disabled=false;
  const hasActiveFilter = filtersActive(s.filters) || s.filters.sort !== 'recommended';
  s.matchCount.textContent=hasActiveFilter?`${filterItems(s.inventory.items,s.filters,s.tracking).length} matching titles`:'';
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
  if (!hide) {
    s.native.removeAttribute('data-fx-native-hidden');
    s.native.removeAttribute('data-fx-react-host');
    s.page?.removeAttribute?.('data-fx-react-host');
    s.native.querySelectorAll('[data-fx-native-hidden]').forEach(n => n.removeAttribute('data-fx-native-hidden'));
    s.page?.querySelectorAll?.('[data-fx-native-hidden]').forEach(n => n.removeAttribute('data-fx-native-hidden'));
    s.native.removeAttribute('data-fx-hero-anchor');
    if (s.route.page !== 'home' && s.page) {
      const tabs = [...s.page.querySelectorAll('.pageTabContent')];
      if (tabs.length > 1) {
        tabs.forEach(t => t.classList.toggle('is-active', t.dataset.index === '0'));
      }
    }
    return;
  }
  if (s.route.page !== 'home') {
    if (s.native === s.page) {
      if (s.page.getAttribute('data-fx-react-host') !== 'true') s.page.setAttribute('data-fx-react-host', 'true');
      [...s.page.children].forEach(child => {
        if (!child.classList.contains('fx-discovery') && child.getAttribute('data-fx-native-hidden') !== 'true') {
          child.setAttribute('data-fx-native-hidden', 'true');
        }
      });
      return;
    }
    if (s.native.getAttribute('data-fx-native-hidden') !== 'true') s.native.setAttribute('data-fx-native-hidden', 'true');
    s.page?.querySelectorAll?.('.pageTabContent').forEach(tab => {
      if (tab.getAttribute('data-fx-native-hidden') !== 'true') tab.setAttribute('data-fx-native-hidden', 'true');
    });
    return;
  }
  if (s.native.dataset.fxHeroAnchor !== 'true') s.native.dataset.fxHeroAnchor = 'true';
  if (s.native.hasAttribute('data-fx-native-hidden')) s.native.removeAttribute('data-fx-native-hidden');
  const protect = '.sleekfin-hero,.hero,#slides-container';
  const walk = parent => [...parent.children].forEach(node => {
    if (node.matches(protect) || node.closest('.fx-discovery')) return;
    if (node.matches('.sections') || node.querySelector(`${protect},.sections`)) {
      if (node.hasAttribute('data-fx-native-hidden')) node.removeAttribute('data-fx-native-hidden');
      walk(node);
    } else if (node.getAttribute('data-fx-native-hidden') !== 'true') {
      node.setAttribute('data-fx-native-hidden', 'true');
    }
  });
  walk(s.native);
}
function setMode(s, full, remember = true) {
  s.full = full; s.root.classList.toggle('fx-mode-full', !!full); s.list.hidden = full; s.footer.hidden = full || (!s.slots.length && !s.finished);
  const hasHeaderViewMenu = !!document.querySelector('button[aria-controls="library-view-menu"]');
  const titlePicker = s.root.querySelector('.fx-title-picker');
  if (titlePicker) titlePicker.hidden = hasHeaderViewMenu;
  s.root.hidden = !!(full && s.route.page !== 'home' && hasHeaderViewMenu && !s.failed);
  s.filterToggle.disabled=full||!s.inventory;s.matchCount.hidden=full;if(full)s.panel.hidden=true;
  s.toggle.textContent = full ? 'Discover shelves' : s.route.page === 'home' ? 'Normal home' : 'Full library';
  syncNative(s, !(full || s.failed));
  if (remember) { try { localStorage.setItem(prefKey(s.api, s.route.page), full ? 'native' : 'discover'); } catch { s.status.textContent = 'View preference could not be saved in this browser.'; } }
  syncHomeModeAttr(s.api);
  if (!s.started) initialize(s);
  else if (!full && s.planner && !s.slots.filter(slot => !slot.boot).length) loadMore(s);
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
      catch{s.client.assertCurrent();}
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
      } catch { s.client.assertCurrent(); }
    } else {
      s.anchorTurn = true;
      const row = s.planner.next(s.anchorIndex <= s.profile.anchors.length && s.anchorIndex > 0 && s.slots.filter(slot => !slot.boot).length < s.profile.anchors.length * 2 ? 'theme' : null);
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
      const items = row.key === 'MyMedia' || row.external || row.key==='ContinueWatchingNextUp' || s.route.view === 'genres' || s.initialHydrateSkip ? row.items : await s.client.hydrate(row.items);
      s.client.assertCurrent();
      if (state !== s) return;
      if (items.length && !s.full) {
        let hydratedRow = { ...row, items };
        const existingBoot = s.slots.find(slot => slot.boot && slot.data?.key === hydratedRow.key);
        if (existingBoot) {
          if (hydratedRow.family !== 'anchor' && Array.isArray(existingBoot.data?.items) && existingBoot.data.items.length) {
            const byIdMap = new Map(items.map(i => [i.Id, i]));
            const ordered = existingBoot.data.items.map(oldItem => byIdMap.get(oldItem.Id) || oldItem).filter(Boolean);
            const seen = new Set(ordered.map(i => i.Id));
            for (const item of items) {
              if (!seen.has(item.Id)) {
                seen.add(item.Id);
                ordered.push(item);
              }
            }
            hydratedRow = { ...hydratedRow, items: ordered.slice(0, s.config.cardsPerShelf) };
          }
          s.list.querySelectorAll('[data-skeleton="true"]').forEach(node => node.remove());
          existingBoot.boot = false;
          delete existingBoot.node.dataset.bootRow;
          existingBoot.node.dataset.shelfKey = hydratedRow.key;
          existingBoot.data = hydratedRow;
          fillSlot(existingBoot, s);
        } else {
          appendRow(hydratedRow, s);
        }
        s.failed = false;
        s.footer.hidden = s.full;
        syncNative(s, true);
      }
      s.pending = null;
    }
    for (const staleBoot of s.slots.filter(slot => slot.boot)) {
      staleBoot.node.remove();
    }
    s.slots = s.slots.filter(slot => !slot.boot);
    s.list.querySelectorAll('[data-skeleton="true"]').forEach(n => n.remove());
    s.status.textContent = [...s.warnings].join(' ');
    s.pauseAutomatic = false;
    if ((s.slots.length || s.filteredQueue) && !s.full) {
      s.failed = false;
      s.filterToggle.disabled = !s.inventory;
      s.footer.hidden = s.full;
      syncNative(s, true);
      writeBootRows(s);
    }
    if (!s.slots.length) {
      if (!s.filteredQueue) { s.failed = true; syncNative(s, false); }
      s.status.textContent = s.filteredQueue ? 'No matching titles. Clear a filter to broaden your search.' : 'No matching shelves. The normal Jellyfin view is still available. Try fewer filters in Customize.';
    }
    s.more.hidden = s.finished;
    s.note.textContent = s.finished ? 'You’ve reached the available matches. Clear filters or use Restart feed to explore again.' : s.filteredQueue ? 'Filtered results load as you scroll.' : 'Keeps browsing your library; titles can return in different shelves further down.';
    virtualize(s);
  } catch {
    if (state === s) { s.pauseAutomatic = true; s.footer.hidden = s.full; s.status.textContent = 'Could not load the next shelves. Your existing rows are intact. Use Try again or the normal view.'; }
  } finally {
    s.loading = false;
    s.initialHydrateSkip = false;
    if (state === s) { s.more.disabled = false; s.more.textContent = s.pauseAutomatic ? 'Try again' : 'Load more'; }
    if(state===s&&s.filterPending)applyFilters(s);
  }
}
function findCachedInventory(scope, route) {
  const exactKey = `${scope}:${route.page}:${route.parentId}`;
  const exact = snapshots.get(exactKey);
  if (exact && Date.now() - exact.at < 5 * 60000) return exact.value;
  if (route.page === 'movies' || route.page === 'shows') {
    const homeSnap = snapshots.get(`${scope}:home:`);
    if (homeSnap && Date.now() - homeSnap.at < 5 * 60000) {
      const wantCol = route.page === 'movies' ? 'movies' : 'tvshows';
      const matchingViews = (homeSnap.value.views || []).filter(v => v.CollectionType === wantCol);
      if (!route.parentId || (matchingViews.length === 1 && matchingViews[0].Id === route.parentId)) {
        const wantType = route.page === 'movies' ? 'Movie' : 'Series';
        return {
          items: homeSnap.value.items.filter(i => i.Type === wantType),
          seasons: route.page === 'shows' ? homeSnap.value.seasons : [],
          views: homeSnap.value.views || []
        };
      }
    }
  }
  return null;
}
function refreshSlotBadges(s) {
  if (!s.byId || state !== s) return;
  for (const slot of s.slots) {
    if (!slot.live) continue;
    for (const card of slot.node.querySelectorAll('.fx-card[data-item-id]')) {
      const item = s.byId.get(card.dataset.itemId);
      const visual = card.querySelector('.fx-card-visual');
      if (!item || !visual) continue;
      const text = badgeFor(item, s.badges, s.now, s.tracking);
      let badge = visual.querySelector('.fx-badge');
      if (!text) { badge?.remove(); continue; }
      if (!badge) { badge = element('span', 'fx-badge'); visual.append(badge); }
      if (badge.textContent !== text) badge.textContent = text;
    }
  }
}
async function initialize(s) {
  if (s.started) return;
  s.started = true; s.status.textContent = ''; s.footer.hidden = true;
  try {
    let localError, hasLocalConfig = false;
    try {
      hasLocalConfig = !!localStorage.getItem(configKey(s.api));
      s.config = readConfig(s.api);
    } catch (e) { localError = e; }
    let paintedBoot = false;
    if (s.config && !s.full) {
      s.profile = s.config.pages[s.route.page];
      const earlySaved = savedFeeds.get(s.key);
      if (earlySaved && Date.now() - earlySaved.at < 30 * 60000 && earlySaved.config === JSON.stringify(s.config) && earlySaved.rows?.length) {
        if (earlySaved.shuffle) s.shuffle = earlySaved.shuffle;
        earlySaved.rows.slice(0, 4).forEach(row => appendRow(row, s, true));
        paintedBoot = true;
      } else if (hasLocalConfig) {
        const bootData = readBootRows(s, JSON.stringify(s.config));
        if (bootData?.rows?.length) {
          if (bootData.shuffle) s.shuffle = bootData.shuffle;
          bootData.rows.forEach(row => appendRow(row, s, true));
          paintedBoot = true;
        }
      }
      if (!paintedBoot) renderSkeletonRows(s, 3);
      syncNative(s, true);
    }
    if (!s.full && s.route.view !== 'genres') {
      const p = s.client.json('HomeScreen/Section/ContinueWatchingNextUp', { UserId: s.client.userId });
      p.catch(() => {});
      s.client.prefetchedSections.set('ContinueWatchingNextUp', p);
    }
    const cacheKey = `${s.scope}:${s.route.page}:${s.route.parentId}`;
    const cachedInv = findCachedInventory(s.scope, s.route);
    const prefPromise = s.client.preferences().then(profile => ({ ok: true, profile })).catch(() => ({ ok: false }));
    const invPromise = cachedInv
      ? Promise.resolve(cachedInv)
      : s.client.inventory(s.route);
    invPromise.catch(() => {});
    const prefRes = await prefPromise;
    s.client.assertCurrent();
    if (prefRes.ok) {
      s.profileVersion = prefRes.profile.version;
      s.syncAvailable = true;
      if (prefRes.profile.config) {
        s.config = validateConfig(upgradeLegacyConfig(prefRes.profile.config));
        try { localStorage.setItem(configKey(s.api), JSON.stringify(s.config)); } catch {}
      }
    } else {
      s.syncAvailable = false;
    }
    if(!s.config)throw localError||Error('No valid discovery configuration.');
    s.profile=s.config.pages[s.route.page];
    if (!s.full && !paintedBoot) {
      const bootData = readBootRows(s, JSON.stringify(s.config));
      if (bootData?.rows?.length) {
        if (bootData.shuffle) s.shuffle = bootData.shuffle;
        bootData.rows.forEach(row => appendRow(row, s, true));
        paintedBoot = true;
        syncNative(s, true);
      } else if (s.route.view !== 'genres') {
        s.client.fastOpening(s.route, s.config).then(fastRows => {
          if (state !== s || s.full || s.planner || s.slots.length || !fastRows?.length) return;
          fastRows.forEach(row => appendRow(row, s, true));
          syncNative(s, true);
        }).catch(() => {});
      }
    }
    const inv = await invPromise;
    s.client.assertCurrent();
    s.inventory = inv;
    snapshots.set(cacheKey, { at: Date.now(), value: s.inventory });
    if (snapshots.size > 6) snapshots.delete(snapshots.keys().next().value);
    s.badges = seasonBadges(s.inventory.seasons, s.now);
    if (!(s.tracking instanceof Map)) s.tracking = readTrackingCache(s.scope);
    s.inventory.tracking = s.tracking;
    s.byId = new Map(s.inventory.items.map(i => [i.Id, i]));
    s.filterToggle.disabled=s.full;
    decorateNative(s);
    const trackingTask = s.client.tracking(s.inventory.items).then(arrival => {
      if (state !== s) return;
      s.tracking = arrival.records instanceof Map ? arrival.records : new Map();
      s.trackingReady = arrival.ready;
      s.inventory.tracking = s.tracking;
      if (arrival.ready) writeTrackingCache(s.scope, s.tracking);
      decorateNative(s);
      refreshSlotBadges(s);
    }).catch(() => {
      if (state !== s) return;
      s.trackingReady = false;
      s.warnings.add('Arrival badges are unavailable until the Discovery Companion is installed and its baseline is ready.');
      if (!s.loading) s.status.textContent = [...s.warnings].join(' ');
    });
    const saved=savedFeeds.get(s.key);
    if(saved&&Date.now()-saved.at<30*60000&&saved.config===JSON.stringify(s.config)){restoreFeed(s,saved);s.status.textContent=[...s.warnings].join(' ');}
    else{preparePlanner(s);filterPanel(s);s.status.textContent='';s.initialHydrateSkip=true;await loadMore(s);}
    await trackingTask;
  } catch {
    if (state !== s) return;
    s.slots = [];
    s.list.replaceChildren();
    s.failed = true;
    s.status.textContent = 'Discovery could not start. The normal view is restored. Check Customize for invalid rules or use Restart feed to try again.';
    setMode(s, true, false);
  }
}
function decorateNative(s) {
  if (!s.byId || state !== s) return;
  if (!s.full && !s.failed && s.route.page !== 'home') return;
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
function closeDownloadMenu() {
  if (downloadMenu) {
    downloadMenu.remove();
    downloadMenu = null;
  }
  downloadMenuTrigger = null;
}
function sanitizeFilename(raw, fallback = 'video') {
  const cleaned = String(raw || '')
    .replace(/[<>:"/\\|?*\x00-\x1f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[. ]+$/g, '');
  return cleaned || fallback;
}
function formatItemDownloadBase(item) {
  if (!item?.Name) return '';
  if (item.Type === 'Episode' && item.SeriesName) {
    const sNum = Number.isFinite(item.ParentIndexNumber) ? `S${String(item.ParentIndexNumber).padStart(2, '0')}` : '';
    const eNum = Number.isFinite(item.IndexNumber) ? `E${String(item.IndexNumber).padStart(2, '0')}` : '';
    const code = sNum || eNum ? ` - ${sNum}${eNum}` : '';
    return sanitizeFilename(`${item.SeriesName}${code} - ${item.Name}`);
  }
  return sanitizeFilename(item.Name);
}
function inferDownloadTitle(itemId, btn) {
  const cached = state?.byId?.get(itemId) || state?.inventory?.items?.find(i => i.Id === itemId);
  if (cached?.Name) return formatItemDownloadBase(cached);
  const epCard = btn?.closest?.('.sleekfin-details-episode-card,[data-sleekfin-episode-id]');
  if (epCard) {
    const epTitle = epCard.querySelector('.sleekfin-details-episode-title,.cardText-first')?.textContent?.trim();
    const seriesTitle = document.querySelector('#itemDetailPage .sleekfin-details-title,#itemDetailPage .itemName,#itemDetailPage h1')?.textContent?.trim();
    if (seriesTitle && epTitle) return sanitizeFilename(`${seriesTitle} - ${epTitle}`);
    if (epTitle) return sanitizeFilename(epTitle);
  }
  const detailTitle = document.querySelector('#itemDetailPage .sleekfin-details-title,#itemDetailPage .itemName,#itemDetailPage h1')?.textContent?.trim();
  if (detailTitle) return sanitizeFilename(detailTitle);
  return '';
}
function triggerUrlDownload(url, filename = '') {
  const a = element('a');
  a.href = url;
  a.setAttribute('download', filename || '');
  a.rel = 'noopener noreferrer';
  document.body.append(a);
  a.click();
  a.remove();
}
function openDownloadMenu(btn, itemId, api) {
  if (downloadMenu && downloadMenuTrigger === btn) {
    closeDownloadMenu();
    return;
  }
  closeDownloadMenu();
  downloadMenuTrigger = btn;
  let baseTitle = inferDownloadTitle(itemId, btn);
  const token = api.accessToken?.() || '';
  const resolveApiUrl = (path, params) => {
    const raw = api.getUrl?.(path, params);
    if (typeof raw === 'string') return raw;
    const qs = new URLSearchParams(params || {}).toString();
    return `/${String(path).replace(/^\/+/, '')}${qs ? '?' + qs : ''}`;
  };
  const fullUrl = resolveApiUrl(`Videos/${encodeURIComponent(itemId)}/stream.mp4`, {
    Static: 'true',
    ...(token ? { api_key: token } : {})
  });
  const transcodeUrl = resolveApiUrl(`Videos/${encodeURIComponent(itemId)}/stream.mp4`, {
    Static: 'false',
    VideoCodec: 'h264',
    AudioCodec: 'aac',
    Profile: 'high',
    Level: '41',
    MaxWidth: '1280',
    MaxHeight: '720',
    VideoBitRate: '1600000',
    AudioBitRate: '128000',
    MaxAudioChannels: '2',
    TranscodingProtocol: 'http',
    TranscodingContainer: 'mp4',
    PlaySessionId: 'fx-dl-' + Date.now(),
    ...(token ? { api_key: token } : {})
  });
  const menu = element('div', 'fx-download-menu is-open');
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', 'Download quality options');

  const fileFor = () => `${baseTitle || sanitizeFilename(inferDownloadTitle(itemId, btn), 'video')}.mp4`;
  const makeOption = (title, url) => {
    const opt = element('a', 'fx-download-option', title);
    opt.href = url;
    opt.setAttribute('download', fileFor());
    opt.rel = 'noopener noreferrer';
    opt.setAttribute('role', 'menuitem');
    opt.addEventListener('click', () => {
      opt.setAttribute('download', fileFor());
      setTimeout(closeDownloadMenu, 60);
    });
    return opt;
  };

  const fullOpt = makeOption('Full Quality', fullUrl);
  const condensedOpt = makeOption('Condensed', transcodeUrl);
  menu.append(fullOpt, condensedOpt);
  const uid = api.getCurrentUserId?.();
  if (uid && typeof api.getJSON === 'function' && typeof api.getUrl === 'function') {
    Promise.resolve(api.getJSON(api.getUrl(`Users/${encodeURIComponent(uid)}/Items/${encodeURIComponent(itemId)}`)))
      .then(info => {
        const refined = formatItemDownloadBase(info);
        if (refined) {
          baseTitle = refined;
          fullOpt.setAttribute('download', fileFor());
          condensedOpt.setAttribute('download', fileFor());
        }
      })
      .catch(() => {});
  }
  document.body.append(menu);
  downloadMenu = menu;
  const rect = typeof btn.getBoundingClientRect === 'function' ? btn.getBoundingClientRect() : null;
  if (rect && (rect.width > 0 || rect.height > 0)) {
    const top = Math.min((window.innerHeight || 800) - 150, Math.max(12, Math.round(rect.bottom + 8)));
    const left = Math.min((window.innerWidth || 1280) - 290, Math.max(12, Math.round(rect.left)));
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
  } else {
    menu.style.top = '120px';
    menu.style.left = '80px';
  }
}
function openSeasonMenu(seasonWrap, select) {
  if (downloadMenu && downloadMenuTrigger === seasonWrap) {
    closeDownloadMenu();
    return;
  }
  closeDownloadMenu();
  downloadMenuTrigger = seasonWrap;
  const menu = element('div', 'fx-download-menu fx-season-menu is-open');
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', 'Select season');
  [...select.options].forEach(opt => {
    const label = (opt.textContent || opt.label || '').trim();
    const item = button(label, () => {
      closeDownloadMenu();
      if (select.value !== opt.value) {
        for (const o of select.querySelectorAll('option')) {
          const isMatch = o.value === opt.value;
          o.selected = isMatch;
          o.toggleAttribute?.('selected', isMatch);
        }
        try { select.value = opt.value; } catch {}
        const Ev = typeof Event === 'function' ? Event : document.defaultView?.Event;
        if (Ev) select.dispatchEvent(new Ev('change', { bubbles: true }));
      }
    });
    item.className = 'fx-download-option fx-season-option' + (opt.value === select.value ? ' is-selected' : '');
    item.setAttribute('role', 'menuitemradio');
    item.setAttribute('aria-checked', opt.value === select.value ? 'true' : 'false');
    menu.append(item);
  });
  document.body.append(menu);
  downloadMenu = menu;
  const rect = typeof seasonWrap.getBoundingClientRect === 'function' ? seasonWrap.getBoundingClientRect() : null;
  if (rect && (rect.width > 0 || rect.height > 0)) {
    const top = Math.min((window.innerHeight || 800) - 240, Math.max(12, Math.round(rect.bottom + 6)));
    const left = Math.min((window.innerWidth || 1280) - 220, Math.max(12, Math.round(rect.left)));
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
  } else {
    menu.style.top = '160px';
    menu.style.left = '80px';
  }
}
function download(name, obj) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' }));
  const a = element('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function buildSettingsContent(s, container, isDialog = true) {
  const title = element('h2', '', 'Customize discovery');
  const help = element('p', 'fx-dialog-lead', s.syncAvailable ? 'Home, Movies and Shows have separate rules. Apply saves these preferences to your Jellyfin user for other compatible devices.' : 'The server companion is unavailable. Apply saves to this browser; export/import can transfer your rules.');
  const input = element('textarea'); input.spellcheck = false; input.setAttribute('aria-label', 'Discovery configuration JSON');
  try { input.value = JSON.stringify(s.config || readConfig(s.api), null, 2); } catch { input.value = localStorage.getItem(configKey(s.api)) || JSON.stringify(DEFAULT_CONFIG, null, 2); }
  const error = element('p', 'fx-editor-alert'); error.setAttribute('role', 'alert');
  const visual=element('div','fx-visual-editor');
  let initial;try{initial=validateConfig(JSON.parse(input.value));}catch{initial=DEFAULT_CONFIG;}
  const editor=createVisualEditor(visual,initial,s.route.page,s.inventory,c=>{input.value=JSON.stringify(c,null,2);},{element,button,supplied:DEFAULT_CONFIG});
  if(!s.inventory?.items?.length&&s.client){
    s.client.inventory({page:'home',parentId:''}).then(inv=>{
      s.inventory=inv;
      snapshots.set(`${s.scope}:home:`,{at:Date.now(),value:inv});
      editor.setInventory?.(inv);
    }).catch(()=>{});
  }
  const advanced=element('details','fx-advanced');advanced.append(element('summary','','Advanced: JSON import / export'));
  input.addEventListener('change',()=>{try{editor.setConfig(validateConfig(JSON.parse(input.value)));error.textContent='';}catch(e){error.textContent=e.message;}});
  const actions = element('div', 'fx-dialog-actions');
  const apply = button('Apply', async () => {
    apply.disabled=true;
    try {
      const config = validateConfig(JSON.parse(input.value));
      if(s.syncAvailable){
        const saved = await s.client.savePreferences(config,s.profileVersion);
        if(saved?.version!==undefined)s.profileVersion=saved.version;
      }
      localStorage.setItem(configKey(s.api), JSON.stringify(config));
      if(isDialog){closeDialog();restart(true);}
      else{error.textContent='Saved to your Jellyfin profile! Reload Home, Movies, or Shows to see your updated shelves.';restart(true);}
    }
    catch (e) { error.textContent = e?.status===409 ? 'Preferences changed on another device. Close and reopen Customize before saving.' : e?.message || 'Could not save preferences. Check the connection and try again.'; }
    finally{apply.disabled=false;}
  });
  apply.className='fx-btn-primary';
  const reset = button('Load supplied rules', () => { input.value = JSON.stringify(DEFAULT_CONFIG, null, 2);editor.setConfig(DEFAULT_CONFIG); error.textContent = 'Review the rules, then Apply to save.'; });
  const exportButton = button('Export JSON', () => { try { download('fazfort-discovery-config.json', validateConfig(JSON.parse(input.value))); } catch (e) { error.textContent = e.message; } });
  const device=element('div','fx-dialog-actions fx-device-bar'),control=button(`Controls: ${controlsMode(s).mode}`,()=>controlToggle(s,control));
  device.append(control,button('Use normal Home',()=>{localStorage.setItem(prefKey(s.api,'home'),'native');error.textContent='Normal Home selected for this device.';}),button('Use Discovery Home',()=>{localStorage.setItem(prefKey(s.api,'home'),'discover');error.textContent='Discovery Home selected for this device.';}),button('Reshuffle feed',()=>{if(isDialog)closeDialog();restart(true);}));
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
  advanced.replaceChildren(element('summary','','Advanced: JSON import / export'),file,input,exportButton,reset);
  if(isDialog)actions.replaceChildren(apply,button('Cancel',closeDialog));
  else actions.replaceChildren(apply);
  container.append(title,help,device,visual,advanced,error,actions);
}
function customize(s) {
  closeDialog();
  const dialog = element('dialog', 'fx-dialog'); dialog.id = 'fx-customize';
  buildSettingsContent(s, dialog, true);
  openDialog(dialog);
}
let settingsScope='';
async function buildStandaloneSettingsState(api){
  const scope=scopeKey(api);
  const inv=state?.inventory||findCachedInventory(scope,{page:'home',parentId:''});
  const s={api,scope,root:element('div'),route:{page:state?.route?.page||'home'},config:null,inventory:inv};
  try{s.config=readConfig(api);}catch{}
  s.client=new JellyfinClient(api,()=>scopeKey(api)===scope);
  try{const profile=await s.client.preferences();s.config=profile.config?validateConfig(profile.config):s.config;s.profileVersion=profile.version;s.syncAvailable=true;}catch{s.client.assertCurrent();}
  return s;
}
async function openUserSettings(api){
  if(!api?.getCurrentUserId?.())return;
  const s=await buildStandaloneSettingsState(api);
  customize(s);
}
async function mountInlineSettings(host, api = window.ApiClient){
  if(!host||!api?.getCurrentUserId?.())return;
  host.replaceChildren(element('p','fx-status','Loading your Discovery profile and library categories…'));
  const s=await buildStandaloneSettingsState(api);
  host.replaceChildren();
  host.classList.add('fx-inline-studio');
  buildSettingsContent(s, host, false);
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
    const wantIndex = route.view === 'genres' ? (route.page === 'movies' ? 4 : 3) : route.view === 'library' ? 0 : (new URLSearchParams(location.hash.split('?')[1] || '').get('tab') || 1);
    const native = route.page === 'home'
      ? page.querySelector('.homeSectionsContainer')
      : (page.querySelector(`.pageTabContent[data-index="${wantIndex}"]`) || page.querySelector('.pageTabContent.is-active, .pageTabContent') || page);
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
  const scope=state?.scope || (window.ApiClient?.getCurrentUserId?.() ? scopeKey(window.ApiClient) : '');
  if (clearCache) {
    snapshots.clear();
    clearBootRows(scope);
  }
  cleanup(false);if(key)savedFeeds.delete(key);reconcile();
}
function reconcile() {
  clearTimeout(timer); timer = 0;
  if (stopped) return;
  const api = window.ApiClient, route = routeInfo(location.hash);
  syncSettings(api);
  syncLibraryViewMenu();
  syncHomeModeAttr(api);
  if (!api?.getCurrentUserId?.()) {cleanup(false);savedFeeds.clear();snapshots.clear();lastScope='';return;}
  if(!route){if(state)cleanup();else if(!/^#\/mypreferencesmenu(?:[?]|$)/i.test(location.hash))closeDialog();return;}
  if(route.serverId && route.serverId.toLowerCase() !== (api.serverId?.() || '').toLowerCase()){cleanup();return;}
  const target = locate(route), scope = scopeKey(api);
  if(lastScope&&lastScope!==scope){cleanup(false);savedFeeds.clear();snapshots.clear();}
  lastScope=scope;
  if (!target) { if (state) cleanup(); return; }
  const key = `${scope}:${route.page}:${route.parentId}:${route.view||'home'}`;
  if (state?.key === key && state.root.isConnected && state.page === target.page && state.native === target.native) {
    const hasHeaderViewMenu = !!document.querySelector('button[aria-controls="library-view-menu"]');
    const titlePicker = state.root.querySelector('.fx-title-picker');
    if (titlePicker) titlePicker.hidden = hasHeaderViewMenu;
    state.root.hidden = !!(state.full && state.route.page !== 'home' && hasHeaderViewMenu && !state.failed);
    if(!state.full && !state.failed)syncNative(state,true);
    decorateNative(state);
    return;
  }
  cleanup();
  const token = generation;
  const root = element('div', 'fx-discovery'), toolbar = element('div', 'fx-toolbar'), list = element('div'), status = element('p', 'fx-status'), footer = element('div', 'fx-footer'), panel=element('div','fx-filters'),matchCount=element('p','fx-match-count');panel.hidden=true;
  status.setAttribute('role', 'status');
  const s = { ...target, api, scope, key, route, root, list, status, footer, panel, matchCount,token, now: new Date(), slots: [], badges: new Map(), tracking:readTrackingCache(scope),filters:cloneJson(DEFAULT_FILTERS),warnings: new Set(), anchorIndex: 0, anchorTurn: true, started: false, loading: false, full: false, failed: false, shuffle: hash(String(Date.now())) };
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
    menu.hidden=true;
    const defaultLabel = route.page==='movies'?'Movies':'TV Shows';
    const currentLabel = route.view==='library'?'Library':route.view==='genres'?'Genres':defaultLabel;
    const titlePicker=element('div','fx-title-picker');
    const heading=element('h1','',defaultLabel);
    const modeLabel=element('span','fx-title-mode',`${currentLabel} ▾`);
    const switcher=element('select','fx-title-select');switcher.setAttribute('aria-label','Browse mode');
    const viewOptions = [
      ['suggestions', defaultLabel],
      ['library', 'Library'],
      ['favorites', 'Favorites'],
      ['genres', 'Genres']
    ];
    for(const [value,label] of viewOptions){const option=element('option','',label);option.value=value;option.selected=route.view===value;switcher.append(option);}
    const applySwitch = val => {
      const chosen = viewOptions.find(([v]) => v === val)?.[1] || defaultLabel;
      modeLabel.textContent = `${chosen} ▾`;
      const q = new URLSearchParams(location.hash.split('?')[1] || '');
      q.set('tab', val === 'library' ? '0' : val === 'favorites' ? '2' : val === 'genres' ? (route.page === 'movies' ? '4' : '3') : '1');
      scrollToTop();
      location.hash = location.hash.split('?')[0] + '?' + q;
      schedule();
    };
    switcher.addEventListener('change',()=>applySwitch(switcher.value));
    titlePicker.append(heading,modeLabel,switcher);
    titlePicker.hidden = !!document.querySelector('button[aria-controls="library-view-menu"]');
    toolbar.prepend(titlePicker);
  }
  footer.append(s.more, s.note); root.append(toolbar,panel,matchCount,status,list,footer);
  if(route.page==='home') target.native.after(root);
  else if(target.native===target.page) target.page.prepend(root);
  else target.native.before(root);
  state = s;
  let full = route.view==='library'; try { if(route.page==='home')full = localStorage.getItem(prefKey(api, route.page)) === 'native'; } catch { /* A private browser can still use the unsaved view. */ }
  if (typeof IntersectionObserver === 'function') {
    s.io = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) loadMore(s, true); }, { rootMargin: '600px 0px' }); s.io.observe(footer);
  }
  if (!savedFeeds.has(key)) scrollToTop();
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
function closeDrawers(){
  document.querySelectorAll('.mainDrawer.drawer-open,.touch-menu-la.drawer-open').forEach(d=>d.classList.remove('drawer-open'));
  document.body?.classList?.remove('menu-open','withSectionTabs');
  document.querySelectorAll('.mainDrawer-backdrop,.backdrop-open,.MuiDrawer-root .MuiBackdrop-root').forEach(b=>{
    try{if(getComputedStyle(b).display!=='none'&&getComputedStyle(b).visibility!=='hidden')b.click?.();}catch{}
  });
}
function navSuggestions(event){
  const seasonWrap = event.target.closest?.('.sleekfin-details-season-select');
  if (seasonWrap && !event.target.closest?.('.fx-download-menu')) {
    const select = seasonWrap.querySelector('select.sleekfin-details-season-native, select');
    if (select && select.options?.length) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
      event.stopPropagation();
      openSeasonMenu(seasonWrap, select);
      return;
    }
  }
  const dlBtn = event.target.closest?.('button.btnDownload, button.sleekfin-details-episode-download, button[data-sleekfin-details-action="download"], button[data-id="download"], button[title="Download" i], button[aria-label="Download" i]');
  if (dlBtn && !dlBtn.closest('.fx-download-menu') && window.ApiClient?.getCurrentUserId?.()) {
    const rawSelfId = dlBtn.getAttribute('data-item-id') || dlBtn.dataset?.itemId || dlBtn.getAttribute('data-id') || dlBtn.dataset?.id;
    const parentIdNode = dlBtn.parentElement?.closest?.('[data-item-id],[data-itemid],[data-id]');
    const parentId = parentIdNode?.getAttribute('data-item-id') || parentIdNode?.getAttribute('data-itemid') || parentIdNode?.getAttribute('data-id');
    const hashId = new URLSearchParams(location.hash.split('?')[1] || '').get('id');
    const itemId = (rawSelfId && rawSelfId.toLowerCase() !== 'download' ? rawSelfId : '') || parentId || hashId;
    if (itemId) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
      event.stopPropagation();
      openDownloadMenu(dlBtn, itemId, window.ApiClient);
      return;
    }
  }
  if (downloadMenu && !event.target.closest?.('.fx-download-menu')) {
    closeDownloadMenu();
  }
  if (event.target.closest?.('#library-view-menu .MuiMenuItem-root')) {
    scrollToTop();
    setTimeout(scrollToTop, 40);
  }
  const searchTrigger = event.target.closest?.('[data-sleekfin-header-proxy] button[data-sleekfin-header-proxy-item="jellyfin:search"], .skinHeader .headerSearchButton');
  if (searchTrigger && window.ApiClient?.getCurrentUserId?.()) {
    event.preventDefault();
    event.stopImmediatePropagation?.();
    event.stopPropagation();
    closeDrawers();
    scrollToTop();
    if (!/^#!?\/?search(?:\.html)?(?:[?]|$)/i.test(location.hash)) {
      location.hash = '#/search';
    }
    schedule();
    setTimeout(() => {
      scrollToTop();
      const inp = document.querySelector('#searchPage #searchTextInput, #searchPage input.searchfields-txtSearch, #searchPage input[type="search"], #searchPage input[type="text"]');
      inp?.focus?.();
    }, 80);
    return;
  }
  const target=event.target.closest?.('[data-sleekfin-header-proxy-item],a[href]');if(!target)return;
  const proxy=target.getAttribute('data-sleekfin-header-proxy-item')||'';
  let route=null;
  if(proxy==='jellyfin:movies')route='#/movies';
  else if(proxy==='jellyfin:shows')route='#/tv';
  else if(proxy==='jellyfin:home')route='#/home';
  else if(proxy.startsWith('jellyfin:view:')){
    const viewId=proxy.slice('jellyfin:view:'.length);
    const sourceLink=document.querySelector(`a[data-itemid="${viewId}"],a[data-id="${viewId}"],a[href*="topParentId=${viewId}"],a[href*="parentId=${viewId}"]`);
    if(sourceLink?.getAttribute('href')){
      route=sourceLink.getAttribute('href');
    }else{
      const label=(target.textContent||'').trim().toLowerCase();
      if(label==='movies')route=`#/movies.html?topParentId=${encodeURIComponent(viewId)}`;
      else if(label==='shows'||label==='tv shows')route=`#/tv.html?topParentId=${encodeURIComponent(viewId)}`;
      else if(label==='collections')route=`#/list.html?topParentId=${encodeURIComponent(viewId)}&collectionType=boxsets`;
    }
  }else{
    route=target.getAttribute('href');
  }
  if(!proxy&&!target.closest('header,.headerTabs,[data-sleekfin-header-proxy]'))return;
  if(!route)return;
  const normalized=route.startsWith('#')?route:'#'+route.replace(/^\/+/,'/');
  if(/^#!?\/?(movies|tv|tvshows)(?:\.html)?(?:[?]|$)/i.test(normalized)){
    const [path,raw='']=normalized.split('?'),q=new URLSearchParams(raw);
    q.set('tab','1');
    event.preventDefault();event.stopImmediatePropagation?.();event.stopPropagation();
    closeDrawers();
    scrollToTop();
    location.hash=path+'?'+q;
    schedule();
    setTimeout(closeDrawers,40);
    return;
  }
  if(proxy.startsWith('jellyfin:view:')||proxy==='jellyfin:home'){
    event.preventDefault();event.stopImmediatePropagation?.();event.stopPropagation();
    closeDrawers();
    scrollToTop();
    location.hash=normalized;
    schedule();
    setTimeout(closeDrawers,40);
  }
}
function rememberFocus(event) {
  const s=state,card=event.target.closest?.('.fx-card');
  if(s&&card&&s.root.contains(card))s.lastFocus={row:s.slots.findIndex(slot=>slot.node.contains(card)),id:card.dataset.itemId};
}
function remoteKey(event) {
  const s=state;
  const key=({37:'ArrowLeft',38:'ArrowUp',39:'ArrowRight',40:'ArrowDown',13:'Enter',27:'Escape',10009:'Escape',461:'Escape',457:'ContextMenu'}[event.keyCode])||event.key;
  const target=event.target||document.activeElement;
  if (downloadMenu && (key === 'Escape' || event.keyCode === 10009)) {
    event.preventDefault();
    event.stopPropagation();
    closeDownloadMenu();
    return;
  }
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
    if(key==='ArrowLeft'||key==='ArrowRight'){
      const delta=key==='ArrowLeft'?-1:1;
      next=track?.dataset?.noLoop==='true'?cards[Math.max(0,Math.min(cards.length-1,index+delta))]:cards[(index+delta+cards.length)%cards.length];
    }
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
function onRouteEvent() {
  syncLibraryViewMenu();
  schedule();
}
function start() {
  const style = element('style'); style.id = 'fx-discovery-style'; style.textContent = DISCOVERY_CSS; document.head.append(style);
  patchLibraryViews();
  syncLibraryViewMenu();
  syncHomeModeAttr(window.ApiClient);
  if (!window.JellyfinRequestHub && document.querySelector('script[data-fazfort-discovery],[src*="FazFortDiscovery"]') && !document.querySelector('script[data-requesthub-asset]')) {
    const rh = element('script'); rh.defer = true; rh.src = '../RequestHub/Assets/web.js'; rh.dataset.requesthubAsset = 'browser'; document.head.append(rh);
  }
  observer = new MutationObserver(records => {
    if (records.some(r => r.type === 'childList' && r.target?.closest?.('[data-sleekfin-header-proxy],[data-sleekfin-header-overflow-drawer],header,.skinHeader,.MuiDrawer-root,#user-view-overflow-menu'))) {
      hideLeavingSoonNav();
    }
    if (records.some(r => !r.target.closest?.('.fx-discovery,.fx-dialog,.fx-inline-studio,.fx-download-menu,.rh-root,[data-sleekfin-header-proxy],.skinHeader') && (r.type === 'childList' || r.attributeName === 'class'))) schedule();
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  document.addEventListener('click',navSuggestions,true);window.addEventListener('hashchange', onRouteEvent); window.addEventListener('popstate', onRouteEvent); document.addEventListener('viewshow', onRouteEvent);
  window.addEventListener('sleekfin:header-catalog-changed', hideLeavingSoonNav);
  document.addEventListener('keydown',remoteKey,true);document.addEventListener('keyup',remoteKeyUp,true);document.addEventListener('focusin',rememberFocus);
  document.addEventListener('scroll', scheduleScroll, { passive: true, capture: true }); window.addEventListener('resize', scheduleScroll);
  // Sign-out / server switch can occur without a hash change.
  heartbeat = setInterval(schedule, 2000); reconcile();
}
window.FazFortDiscovery = {
  version: VERSION, restart, openSettings:()=>openUserSettings(window.ApiClient), mountSettings:(host)=>mountInlineSettings(host,window.ApiClient),
  diagnostics: () => ({ version: VERSION, page: state?.route.page || null, mounted: !!state, items: state?.inventory?.items.length || 0, shelves: state?.planner?.shelves.length || 0, loadedRows: state?.slots.length || 0, liveRows: state?.slots.filter(s => s.live).length || 0,trackingReady:!!state?.trackingReady,preferencesSync:!!state?.syncAvailable,controls:state?controlsMode(state).mode:null,warnings: [...(state?.warnings || [])], supportedPageFound: !!(routeInfo(location.hash) && locate(routeInfo(location.hash))) }),
  stop() {
    stopped = true; clearTimeout(timer); clearInterval(heartbeat); observer?.disconnect(); cleanup(false); closeDownloadMenu(); snapshots.clear();savedFeeds.clear();
    document.documentElement?.removeAttribute?.('data-fx-hide-count-chip');
    document.documentElement?.removeAttribute?.('data-fx-home-mode');
    document.removeEventListener('click',navSuggestions,true);window.removeEventListener('hashchange', onRouteEvent); window.removeEventListener('popstate', onRouteEvent); document.removeEventListener('viewshow', onRouteEvent); document.removeEventListener('scroll', scheduleScroll, true); window.removeEventListener('resize', scheduleScroll);
    window.removeEventListener('sleekfin:header-catalog-changed', hideLeavingSoonNav);
    document.removeEventListener('keydown',remoteKey,true);document.removeEventListener('keyup',remoteKeyUp,true);document.removeEventListener('focusin',rememberFocus);
    document.querySelectorAll('[data-fx-settings-link]').forEach(n=>n.remove());document.getElementById('fx-discovery-style')?.remove(); delete window.FazFortDiscovery;
  }
};
if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
}
