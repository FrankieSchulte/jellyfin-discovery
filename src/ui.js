export function bootDiscovery(DEFAULT_CONFIG, DISCOVERY_CSS) {
const VERSION = '0.6.4';
if (window.FazFortDiscovery?.version === VERSION) return;
window.FazFortDiscovery?.stop?.();
// The older helper can otherwise reorder native rows while this feed is mounted.
window.FazFortHomeFeed?.stop?.();
let state = null, generation = 0, observer, timer, heartbeat, stopped = false, popoverFrame = 0;
const snapshots = new Map();
const savedFeeds = new Map();
const heroMemoryCache = new Map();
const loadedImages = new Set();
const sessionShuffles = new Map();
const ratingsCache = new Map();
const ratingsInflight = new Map();
const ratingsCooldown = new Map();
let lastTriggerRect = null, detailMoreAnchor = null, headerMenuAnchor = null, ratingsSyncTimer = 0;
const osdMuteState = { muted: false, savedVolume: 100 };
let searchInvInflight = null, searchTrackInflight = null, savedWindowFetch = null;
const searchInvListeners = new Set();
const searchUiState = { query: '', remoteQuery: '', remoteItems: [], remoteTimer: 0, inputTimer: 0, token: 0, lastSignature: '', tracking: null, trackingScope: '', ranked: [], renderedCount: 0, batchIo: null };
let activeDialog = null, lastScope = '', selectHold = null, downloadMenu = null, downloadMenuTrigger = null;
const element = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const button = (text, action) => { const b = element('button', '', text); b.type = 'button'; b.addEventListener('click', action); return b; };
const scopeKey = api => `${api.serverId?.() || location.origin}:${api.getCurrentUserId()}`;
const configKey = api => `fazfort-discovery:config:v1:${scopeKey(api)}`;
const prefKey = (api, page) => `fazfort-discovery:view:${scopeKey(api)}:${page}`;
const bootRowsKey = (scope, route) => `fazfort-discovery:boot:v2:${scope}:${route.page}:${route.parentId || ''}:${route.view || 'home'}`;
const heroCacheKey = (scope, page) => `fazfort-discovery:hero:v1:${scope}:${page}`;
const trackingCacheKey = scope => `fazfort-discovery:tracking:v2:${scope}`;
const ratingsSessionKey = 'fazfort-discovery:ratings:v1';
function ensureAmbientBackground() {
  if (stopped || !document.documentElement) return;
  setRootAttr('data-fx-ambient-bg', true);
  document.querySelectorAll('.fx-ambient-bg, .fx-bg-tuner').forEach(n => n.remove());
}

// Rotten Tomatoes & Star Rating Crisp Inline SVG Icons
const RT_CERTIFIED_FRESH_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polygon points="12,1 14.8,3.6 18.5,3.2 19.6,6.8 22.8,8.8 21.7,12.4 22.8,16 19.6,18 18.5,21.6 14.8,21.2 12,23.5 9.2,21.2 5.5,21.6 4.4,18 1.2,16 2.3,12.4 1.2,8.8 4.4,6.8 5.5,3.2 9.2,3.6" fill="#F5B82E"/><circle cx="12" cy="13" r="6.4" fill="#FA320A"/><path d="M9.6 8.3c1-.8 2.4-.9 2.4-.9s1.4.1 2.4.9c-.8.4-1.5.5-2.4.2-.9.3-1.6.2-2.4-.2z" fill="#1F9D45"/><path d="M12 5.5c.3 1 .6 1.7 1.6 2.1-1 .2-1.6.1-1.6.1s-.6.1-1.6-.1c1-.4 1.3-1.1 1.6-2.1z" fill="#27B854"/><ellipse cx="9.8" cy="11.2" rx="1.6" ry="1" transform="rotate(-24 9.8 11.2)" fill="#FF8C73" opacity=".7"/></svg>';
const RT_FRESH_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 6.6c4.8 0 8.6 3.1 8.6 7.4 0 4.5-3.7 8-8.6 8s-8.6-3.5-8.6-8c0-4.3 3.8-7.4 8.6-7.4z" fill="#FA320A"/><path d="M12 2.4c.5 1.8 1.4 3 3.6 3.4-1.4.8-2.4 1-3.6.5-1.2.5-2.2.3-3.6-.5 2.2-.4 3.1-1.6 3.6-3.4z" fill="#22B14C"/><path d="M7.6 7.4c1.3-.9 2.9-1.1 4.4-.5 1.5-.6 3.1-.4 4.4.5-1.2.8-2.7 1.1-4.4.6-1.7.5-3.2.2-4.4-.6z" fill="#198F3C"/><ellipse cx="8.8" cy="12" rx="2.1" ry="1.2" transform="rotate(-25 8.8 12)" fill="#FF927A" opacity=".62"/></svg>';
const RT_ROTTEN_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12.3 3.2c1.2-.2 2 1.3 2.8 2.1.9.8 2.8-.5 3.6.5.8 1-.3 2.6.2 3.8.5 1.2 2.4 1.6 2.3 3-.1 1.4-2.1 1.6-2.7 2.8-.6 1.2.5 3-.6 3.9-1.1.9-2.5-.5-3.8-.3-1.3.2-2.1 2-3.4 1.8-1.3-.2-1.5-2.2-2.7-2.7-1.2-.5-2.9.6-3.8-.5-.9-1 .4-2.6 0-3.8-.4-1.2-2.3-1.8-2.1-3.1.2-1.3 2.1-1.4 2.8-2.5.7-1.1-.4-2.9.7-3.8 1.1-.9 2.5.5 3.8.2 1.3-.3 1.8-1.3 2.9-1.4z" fill="#1FA847"/><circle cx="9.6" cy="10.8" r="1.4" fill="#6EE787" opacity=".5"/><circle cx="15.2" cy="14.2" r="1.1" fill="#11692B" opacity=".45"/></svg>';
const RT_POPCORN_HOT_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="11" fill="none" stroke="#F5B82E" stroke-width="1.6" opacity=".92"/><path d="M7.2 10.6h9.6l-1.1 9.2H8.3z" fill="#E51C23"/><path d="M9.7 10.6h1.6l-.3 9.2H9.9zM12.8 10.6h1.6l-.4 9.2h-1.3z" fill="#FFF"/><circle cx="8.5" cy="9.2" r="2.2" fill="#FFE066"/><circle cx="12" cy="7.6" r="2.5" fill="#FFF0A8"/><circle cx="15.5" cy="9.2" r="2.2" fill="#FFD43B"/><circle cx="10.4" cy="9.7" r="1.9" fill="#FFF5C4"/><circle cx="13.8" cy="9.8" r="1.9" fill="#FFE066"/></svg>';
const RT_POPCORN_FRESH_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.4 10.2h11.2l-1.4 10.8H7.8z" fill="#E51C23"/><path d="M9.1 10.2h1.8l-.4 10.8H9.4zM13.1 10.2h1.8l-.5 10.8h-1.5z" fill="#FFF"/><circle cx="8" cy="8.7" r="2.4" fill="#FFE066"/><circle cx="12" cy="6.8" r="2.8" fill="#FFF1AD"/><circle cx="16" cy="8.7" r="2.4" fill="#FFD43B"/><circle cx="10.2" cy="9.3" r="2.1" fill="#FFF6C9"/><circle cx="14" cy="9.4" r="2.1" fill="#FFE066"/></svg>';
const RT_POPCORN_SPILLED_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g transform="rotate(62 12 12)"><path d="M7.2 8.4h9.6l-1.2 9.8H8.4z" fill="#46A856"/><path d="M9.7 8.4h1.6l-.3 9.8H9.9zM12.9 8.4h1.5l-.4 9.8h-1.2z" fill="#DCE5DF"/></g><circle cx="18.2" cy="15.8" r="1.8" fill="#D8CF90"/><circle cx="20.2" cy="18.4" r="1.5" fill="#C4B974"/><circle cx="15.6" cy="18.6" r="1.6" fill="#E2D99D"/></svg>';
const STAR_RATING_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.2l2.92 5.92 6.53.95-4.72 4.6 1.11 6.5L12 17.1l-5.84 3.07 1.11-6.5-4.72-4.6 6.53-.95z" fill="#F5C518"/></svg>';

function readSessionRatings() {
  try {
    const raw = window.sessionStorage?.getItem?.(ratingsSessionKey);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      for (const [k, v] of Object.entries(parsed)) {
        if (v && typeof v === 'object') ratingsCache.set(k, v);
      }
    }
  } catch {}
}
function writeSessionRatings() {
  try {
    const obj = {};
    let count = 0;
    for (const [k, v] of ratingsCache.entries()) {
      if (k.length === 32 && v && !v.pending) {
        obj[k] = v;
        if (++count >= 400) break;
      }
    }
    window.sessionStorage?.setItem?.(ratingsSessionKey, JSON.stringify(obj));
  } catch {}
}
function getActiveRatingsConfig(api = window.ApiClient) {
  if (state?.config) return resolveRatingsConfig(state.config);
  if (api?.getCurrentUserId?.()) {
    try { return resolveRatingsConfig(readConfig(api)); } catch {}
  }
  return resolveRatingsConfig(DEFAULT_CONFIG);
}
function lookupCachedRating(itemId, item = null) {
  const norm = normalizeGuid(itemId || item?.Id);
  const hit = (norm && ratingsCache.get(norm)) || (itemId && ratingsCache.get(itemId)) || null;
  if (hit && (hit.criticScore != null || hit.audienceScore != null)) return hit;
  if (item && Number.isFinite(Number(item.CriticRating)) && Number(item.CriticRating) > 0) {
    const score = Math.max(0, Math.min(100, Math.round(Number(item.CriticRating))));
    return { criticScore: score, criticState: score >= 60 ? 'fresh' : 'rotten', audienceScore: null, audienceState: null, source: 'jellyfin', pending: true };
  }
  return hit;
}
function fetchRatingsBatch(api, ids, sync = false) {
  if (!api?.getCurrentUserId?.() || !Array.isArray(ids) || !ids.length) return null;
  const now = Date.now();
  const needed = [];
  const seen = new Set();
  for (const id of ids) {
    const norm = normalizeGuid(id);
    if (!norm || norm.length !== 32 || seen.has(norm)) continue;
    seen.add(norm);
    if (ratingsInflight.has(norm)) continue;
    const cached = ratingsCache.get(norm);
    if (cached && !cached.pending) continue;
    const cool = ratingsCooldown.get(norm);
    if (cool && (now < cool.until || cool.attempts >= 3)) continue;
    needed.push(id);
  }
  if (!needed.length) return null;
  const client = new JellyfinClient(api, () => !stopped);
  for (const id of needed) {
    const norm = normalizeGuid(id);
    const prev = ratingsCooldown.get(norm);
    ratingsCooldown.set(norm, { until: now + 3500, attempts: (prev?.attempts || 0) + 1 });
    ratingsInflight.set(norm, true);
  }
  return client.ratings(needed, sync).then(map => {
    let anyPending = false;
    let updated = 0;
    const doneAt = Date.now();
    for (const id of needed) {
      const norm = normalizeGuid(id);
      ratingsInflight.delete(norm);
      const entry = map.get(id) || map.get(norm);
      if (entry) {
        ratingsCache.set(norm, entry);
        updated++;
        if (entry.pending) {
          const prev = ratingsCooldown.get(norm);
          const attempts = prev?.attempts || 1;
          ratingsCooldown.set(norm, { until: doneAt + 2500, attempts });
          if (attempts < 3) anyPending = true;
        } else {
          ratingsCooldown.delete(norm);
        }
      } else {
        const prev = ratingsCooldown.get(norm);
        ratingsCooldown.set(norm, { until: doneAt + 60000, attempts: Math.max(3, prev?.attempts || 1) });
      }
    }
    writeSessionRatings();
    if (anyPending && !stopped) {
      clearTimeout(ratingsSyncTimer);
      ratingsSyncTimer = setTimeout(() => {
        if (!stopped) syncHeroAndDetailRatings(window.ApiClient || api);
      }, 2600);
    }
    return updated > 0;
  }).catch(() => {
    const failAt = Date.now();
    for (const id of needed) {
      const norm = normalizeGuid(id);
      ratingsInflight.delete(norm);
      ratingsCooldown.set(norm, { until: failAt + 60000, attempts: 3 });
    }
    return false;
  });
}
function buildRatingsGroup(item, rtEntry, ratingsCfg, includePopcorn = false) {
  const cfg = ratingsCfg || DEFAULT_RATINGS;
  const chips = [];
  if (cfg.tomatometer) {
    const cScore = rtEntry?.criticScore ?? (Number.isFinite(Number(item?.CriticRating)) && Number(item?.CriticRating) > 0 ? Math.round(Number(item.CriticRating)) : null);
    if (cScore != null && Number.isFinite(cScore)) {
      const cState = rtEntry?.criticState || (cScore >= 60 ? 'fresh' : 'rotten');
      const svg = cState === 'certified' ? RT_CERTIFIED_FRESH_SVG : cState === 'rotten' ? RT_ROTTEN_SVG : RT_FRESH_SVG;
      const label = cState === 'certified' ? 'Certified Fresh' : cState === 'rotten' ? 'Rotten' : 'Fresh';
      const chip = element('span', `fx-rating-chip fx-rating-tomatometer is-${cState}`);
      chip.title = `Tomatometer (${label}): ${cScore}%`;
      chip.setAttribute('aria-label', `Tomatometer ${cScore}% ${label}`);
      const icon = element('span', 'fx-rating-icon');
      icon.innerHTML = svg;
      chip.append(icon, element('span', 'fx-rating-val', `${cScore}%`));
      chips.push(chip);
    }
  }
  if (includePopcorn && cfg.popcornmeter) {
    const aScore = rtEntry?.audienceScore ?? null;
    if (aScore != null && Number.isFinite(aScore)) {
      const aState = rtEntry?.audienceState || (aScore >= 60 ? 'fresh' : 'spilled');
      const svg = aState === 'hot' ? RT_POPCORN_HOT_SVG : aState === 'spilled' ? RT_POPCORN_SPILLED_SVG : RT_POPCORN_FRESH_SVG;
      const label = aState === 'hot' ? 'Verified Hot' : aState === 'spilled' ? 'Spilled' : 'Fresh';
      const chip = element('span', `fx-rating-chip fx-rating-popcornmeter is-${aState}`);
      chip.title = `Popcornmeter (${label}): ${aScore}%`;
      chip.setAttribute('aria-label', `Popcornmeter ${aScore}% ${label}`);
      const icon = element('span', 'fx-rating-icon');
      icon.innerHTML = svg;
      chip.append(icon, element('span', 'fx-rating-val', `${aScore}%`));
      chips.push(chip);
    }
  }
  if (cfg.stars) {
    const starVal = Number(item?.CommunityRating || 0);
    if (starVal > 0) {
      const formatted = starVal.toFixed(1);
      const chip = element('span', 'fx-rating-chip fx-rating-star');
      chip.title = `Community Rating: ${formatted}`;
      chip.setAttribute('aria-label', `Star rating ${formatted}`);
      const icon = element('span', 'fx-rating-icon');
      icon.innerHTML = STAR_RATING_SVG;
      chip.append(icon, element('span', 'fx-rating-val', formatted));
      chips.push(chip);
    }
  }
  if (!chips.length) return null;
  const group = element('span', 'fx-ratings-group');
  group.append(...chips);
  return group;
}
function extractItemIdFromNode(node) {
  if (!node) return '';
  const direct = node.getAttribute?.('data-item-id') || node.getAttribute?.('data-id');
  if (direct && /^[a-f0-9-]{32,36}$/i.test(direct)) return direct;
  const link = node.querySelector?.('a[href*="id="]');
  if (link) {
    const m = String(link.getAttribute('href') || '').match(/[?&]id=([a-f0-9-]{32,36})/i);
    if (m) return m[1];
  }
  const img = node.querySelector?.('img[src*="/Items/"]');
  if (img) {
    const m = String(img.getAttribute('src') || '').match(/\/Items\/([a-f0-9-]{32,36})\//i);
    if (m) return m[1];
  }
  return '';
}
function findInventoryItemById(itemId) {
  const norm = normalizeGuid(itemId);
  if (!norm) return null;
  if (state?.byId) {
    const exact = state.byId.get(itemId);
    if (exact) return exact;
    for (const it of state.byId.values()) {
      if (normalizeGuid(it.Id) === norm) return it;
    }
  }
  for (const snap of snapshots.values()) {
    const hit = snap?.value?.items?.find?.(i => normalizeGuid(i.Id) === norm);
    if (hit) return hit;
  }
  return null;
}
function getVisibleDetailPage() {
  const candidates = document.querySelectorAll('#itemDetailPage, .itemDetailPage');
  for (const el of candidates) {
    if (visible(el)) return el;
  }
  return null;
}
function findPlaybackManager() {
  try {
    if (window.playbackManager && typeof window.playbackManager.play === 'function') return window.playbackManager;
    const wreq = window._fxWebpackReq;
    if (wreq?.c) {
      for (const mid of Object.keys(wreq.c)) {
        const exp = wreq.c[mid]?.exports;
        if (!exp || typeof exp !== 'object') continue;
        const direct = exp.playbackManager || exp.default || exp.A || exp.Ay;
        if (direct && typeof direct.play === 'function' && (typeof direct.currentItem === 'function' || typeof direct.stop === 'function' || typeof direct.playNext === 'function')) {
          return direct;
        }
        for (const k of Object.keys(exp)) {
          const v = exp[k];
          if (v && typeof v === 'object' && typeof v.play === 'function' && (typeof v.currentItem === 'function' || typeof v.stop === 'function')) {
            return v;
          }
        }
      }
    }
  } catch {}
  return null;
}
function resolveDetailPageItemId(detailPage) {
  const hashQs = String(location.hash || '').split('?')[1] || '';
  const searchQs = String(location.search || '').replace(/^\?/, '');
  const fromUrl = new URLSearchParams(hashQs).get('id') || new URLSearchParams(searchQs).get('id') || '';
  if (fromUrl && /^[a-f0-9-]{32,36}$/i.test(fromUrl)) return fromUrl;
  const fromAttr = detailPage?.getAttribute?.('data-sleekfin-item-id') || detailPage?.getAttribute?.('data-id') || '';
  if (fromAttr && /^[a-f0-9-]{32,36}$/i.test(fromAttr)) return fromAttr;
  return '';
}
let detailItemCache = { id: '', item: null, pending: false };
function syncHeroAndDetailRatings(api = window.ApiClient) {
  if (stopped || !api?.getCurrentUserId?.()) return;
  const cfg = getActiveRatingsConfig(api);
  const wantHero = cfg.tomatometer || cfg.stars;
  const wantDetail = cfg.tomatometer || cfg.popcornmeter || cfg.stars;
  const batchIds = [];

  // A. Update Discovery Home / Movies / Shows Hero Banner rating slots
  document.querySelectorAll('.fx-page-hero-ratings[data-item-id]').forEach(slot => {
    const itemId = slot.dataset.itemId;
    if (!itemId) return;
    const item = findInventoryItemById(itemId) || { Id: itemId, CommunityRating: Number(slot.dataset.star || 0), CriticRating: Number(slot.dataset.critic || 0) || null };
    const rt = lookupCachedRating(itemId, item);
    if (cfg.tomatometer && (!rt || rt.pending)) batchIds.push(itemId);
    const group = wantHero ? buildRatingsGroup(item, rt, cfg, false) : null;
    const sig = group ? group.textContent + '|' + cfg.tomatometer + '|' + cfg.stars : 'none';
    if (slot.dataset.fxSig !== sig) {
      slot.dataset.fxSig = sig;
      slot.replaceChildren();
      if (group) slot.append(group);
      slot.hidden = !group;
      const sep = slot.nextElementSibling;
      if (sep?.classList?.contains('fx-page-hero-sep')) sep.hidden = !group;
    }
  });

  // B. Update SleekFin Home Hero Banner slides (legacy fallback)
  document.querySelectorAll('.sleekfin-hero .sleekfin-hero-slide').forEach(slide => {
    const itemId = extractItemIdFromNode(slide);
    if (!itemId) return;
    const item = findInventoryItemById(itemId) || {};
    const scoreEl = slide.querySelector('.sleekfin-hero-score');
    if (scoreEl && !scoreEl.dataset.fxOrigStar) {
      const m = (scoreEl.textContent || '').match(/\d+(?:\.\d+)?/);
      if (m) scoreEl.dataset.fxOrigStar = m[0];
    }
    const mergedItem = { ...item, Id: itemId, CommunityRating: item.CommunityRating ?? (Number(scoreEl?.dataset?.fxOrigStar || 0) || null) };
    const rt = lookupCachedRating(itemId, mergedItem);
    if (cfg.tomatometer && (!rt || rt.pending)) batchIds.push(itemId);
    const group = wantHero ? buildRatingsGroup(mergedItem, rt, cfg, false) : null;
    if (scoreEl) {
      if (!wantHero || !group) {
        scoreEl.setAttribute('data-fx-rating-hidden', 'true');
        const nextSep = scoreEl.nextElementSibling;
        if (nextSep?.classList?.contains('sleekfin-meta-separator')) nextSep.setAttribute('data-fx-rating-hidden', 'true');
      } else {
        scoreEl.removeAttribute('data-fx-rating-hidden');
        const nextSep = scoreEl.nextElementSibling;
        if (nextSep?.classList?.contains('sleekfin-meta-separator')) nextSep.removeAttribute('data-fx-rating-hidden');
        const sig = group.textContent + '|' + cfg.tomatometer + '|' + cfg.stars;
        if (scoreEl.dataset.fxSig !== sig || !scoreEl.querySelector('.fx-ratings-group')) {
          scoreEl.dataset.fxSig = sig;
          scoreEl.dataset.fxRatingsMounted = 'true';
          scoreEl.querySelector('.fx-ratings-group')?.remove();
          scoreEl.append(group);
        }
      }
    }
  });

  // C. Update Movie / TV Show Detail Page (#itemDetailPage — always find the VISIBLE instance!)
  const detailPage = getVisibleDetailPage();
  if (detailPage) {
    const hashId = resolveDetailPageItemId(detailPage);
    if (hashId) {
      const scoreHost = detailPage.querySelector('.sleekfin-details-score') || detailPage.querySelector('.starRatingContainer');
      if (scoreHost && !scoreHost.dataset.fxOrigStar) {
        const m = (scoreHost.textContent || '').match(/\d+(?:\.\d+)?/);
        if (m) scoreHost.dataset.fxOrigStar = m[0];
      }
      const normHash = normalizeGuid(hashId);
      let item = findInventoryItemById(hashId) || (normalizeGuid(detailItemCache.id) === normHash ? detailItemCache.item : null);
      if (!item && (normalizeGuid(detailItemCache.id) !== normHash || !detailItemCache.pending) && typeof api.getJSON === 'function' && typeof api.getUrl === 'function') {
        detailItemCache = { id: hashId, item: null, pending: true };
        api.getJSON(api.getUrl(`Users/${encodeURIComponent(api.getCurrentUserId())}/Items/${encodeURIComponent(hashId)}`)).then(fetched => {
          if (normalizeGuid(detailItemCache.id) !== normHash) return;
          detailItemCache = { id: hashId, item: fetched || null, pending: false };
          if (!stopped) syncHeroAndDetailRatings(api);
        }).catch(() => {
          if (normalizeGuid(detailItemCache.id) === normHash) detailItemCache = { id: hashId, item: null, pending: false };
        });
      }
      if (!item || item.Type === 'Movie' || item.Type === 'Series') {
        const mergedItem = {
          ...(item || {}),
          Id: hashId,
          CommunityRating: item?.CommunityRating ?? (Number(scoreHost?.dataset?.fxOrigStar || 0) || null)
        };
        const rt = lookupCachedRating(hashId, mergedItem);
        if ((cfg.tomatometer || cfg.popcornmeter) && (!rt || rt.pending)) {
          const req = fetchRatingsBatch(api, [hashId], true);
          if (req) {
            req.then(updated => {
              if (updated && !stopped) syncHeroAndDetailRatings(api);
            });
          }
        }
        const group = wantDetail ? buildRatingsGroup(mergedItem, rt, cfg, true) : null;
        detailPage.dataset.fxRatingsActive = 'true';
        if (scoreHost) {
          if (!wantDetail || !group) {
            scoreHost.setAttribute('data-fx-rating-hidden', 'true');
            const sep = scoreHost.nextElementSibling;
            if (sep?.classList?.contains('sleekfin-meta-separator')) sep.setAttribute('data-fx-rating-hidden', 'true');
          } else {
            scoreHost.removeAttribute('data-fx-rating-hidden');
            const sep = scoreHost.nextElementSibling;
            if (sep?.classList?.contains('sleekfin-meta-separator')) sep.removeAttribute('data-fx-rating-hidden');
            const sig = group.textContent + '|' + cfg.tomatometer + '|' + cfg.popcornmeter + '|' + cfg.stars;
            if (scoreHost.dataset.fxSig !== sig || !scoreHost.querySelector('.fx-ratings-group')) {
              scoreHost.dataset.fxSig = sig;
              scoreHost.dataset.fxRatingsMounted = 'true';
              scoreHost.querySelector('.fx-ratings-group')?.remove();
              scoreHost.append(group);
            }
          }
        } else if (group) {
          const facts = detailPage.querySelector('.sleekfin-details-facts, .itemMiscInfo-primary');
          if (facts) {
            let wrap = facts.querySelector('.fx-detail-injected-ratings');
            const sig = group.textContent + '|' + cfg.tomatometer + '|' + cfg.popcornmeter + '|' + cfg.stars;
            if (!wrap) {
              wrap = element('span', 'fx-detail-injected-ratings');
              facts.prepend(wrap);
            }
            if (wrap.dataset.fxSig !== sig || !wrap.querySelector('.fx-ratings-group')) {
              wrap.dataset.fxSig = sig;
              wrap.replaceChildren(group);
            }
          }
        }
      }
    }

    // D. Update "More Like This" cards (#similarCollapsible .card[data-id]) to honor the user's ratings preference
    detailPage.querySelectorAll('#similarCollapsible .card[data-id]').forEach(card => {
      const simId = card.dataset.id;
      if (!simId || !/^[a-f0-9-]{32,36}$/i.test(simId)) return;
      const meta = card.querySelector('.sleekfin-details-similar-meta');
      if (!meta) return;
      const simItem = findInventoryItemById(simId) || {};
      const starSlot = meta.querySelector('[data-sleekfin-accent="true"], .sleekfin-meta-accent, .sleekfin-meta-item:has(.sleekfin-icon), .sleekfin-meta-item:has(svg)')
        || [...meta.children].find(ch => !ch.classList.contains('sleekfin-meta-separator') && (ch.querySelector('svg, .sleekfin-icon, .material-icons') || /^\s*\d\.\d\s*$/.test(ch.textContent || '')));
      if (starSlot && !starSlot.dataset.fxOrigStar) {
        const m = (starSlot.textContent || '').match(/\d+(?:\.\d+)?/);
        if (m) starSlot.dataset.fxOrigStar = m[0];
      }
      const mergedSim = {
        ...simItem,
        Id: simId,
        CommunityRating: simItem.CommunityRating ?? (Number(starSlot?.dataset?.fxOrigStar || 0) || null)
      };
      const rt = lookupCachedRating(simId, mergedSim);
      if (cfg.tomatometer && (!rt || rt.pending)) batchIds.push(simId);
      const group = wantHero ? buildRatingsGroup(mergedSim, rt, cfg, false) : null;
      if (starSlot) {
        const nextSep = starSlot.nextElementSibling?.classList?.contains('sleekfin-meta-separator') ? starSlot.nextElementSibling : null;
        if (!wantHero || !group) {
          starSlot.setAttribute('data-fx-rating-hidden', 'true');
          if (nextSep) nextSep.setAttribute('data-fx-rating-hidden', 'true');
        } else {
          starSlot.removeAttribute('data-fx-rating-hidden');
          if (nextSep) nextSep.removeAttribute('data-fx-rating-hidden');
          const sig = group.textContent + '|' + cfg.tomatometer + '|' + cfg.stars;
          if (starSlot.dataset.fxSig !== sig || !starSlot.querySelector('.fx-ratings-group')) {
            starSlot.dataset.fxSig = sig;
            starSlot.dataset.fxRatingsMounted = 'true';
            starSlot.querySelector('.fx-ratings-group')?.remove();
            starSlot.append(group);
          }
        }
      } else if (group) {
        let wrap = meta.querySelector('.fx-similar-injected-ratings');
        const sig = group.textContent + '|' + cfg.tomatometer + '|' + cfg.stars;
        if (!wrap) {
          wrap = element('span', 'fx-similar-injected-ratings');
          const sep = element('span', 'sleekfin-meta-separator', '·');
          sep.dataset.fxSimilarSep = 'true';
          meta.prepend(wrap, sep);
        }
        if (wrap.dataset.fxSig !== sig || !wrap.querySelector('.fx-ratings-group')) {
          wrap.dataset.fxSig = sig;
          wrap.replaceChildren(group);
        }
      }
    });
  }

  if (batchIds.length) {
    const req = fetchRatingsBatch(api, batchIds, false);
    if (req) {
      req.then(updated => {
        if (updated && !stopped) syncHeroAndDetailRatings(api);
      });
    }
  }
}
function getSessionShuffle(scope, page, day, forceNew = false) {
  const k = `${scope}:${day}:${page}`;
  if (!forceNew && sessionShuffles.has(k)) return sessionShuffles.get(k);
  if (!forceNew) {
    try {
      const saved = Number(window.sessionStorage?.getItem?.(`fazfort-discovery:shuffle:${k}`));
      if (Number.isInteger(saved) && saved > 0) {
        sessionShuffles.set(k, saved);
        return saved;
      }
    } catch {}
  }
  const next = hash(`${Date.now()}:${Math.random()}:${k}`) || 1;
  sessionShuffles.set(k, next);
  try { window.sessionStorage?.setItem?.(`fazfort-discovery:shuffle:${k}`, String(next)); } catch {}
  return next;
}
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
  if (s.full || s.route.view === 'genres' || s.route.cat) return null;
  try {
    const raw = localStorage.getItem(bootRowsKey(s.scope, s.route));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== VERSION || parsed.config !== configStr || !Array.isArray(parsed.rows) || !parsed.rows.length) return null;
    const today = dayInZone(s.now, s.config?.timeZone || 'America/Los_Angeles');
    if (parsed.day !== today) return null;
    if (Date.now() - (parsed.at || 0) > 24 * 3600 * 1000) return null;
    return { rows: parsed.rows, shuffle: parsed.shuffle };
  } catch { return null; }
}
function writeBootRows(s) {
  if (s.full || s.route.view === 'genres' || filtersActive(s.filters) || s.filters.sort !== 'recommended' || !s.slots.length || !s.config) return;
  try {
    const rows = s.slots.filter(slot => !slot.boot).slice(0, 4).map(slot => {
      if (!slot.data) return null;
      const { allItems, ...compact } = slot.data;
      return compact;
    }).filter(Boolean);
    if (!rows.length) return;
    const today = dayInZone(s.now, s.config.timeZone);
    localStorage.setItem(bootRowsKey(s.scope, s.route), JSON.stringify({ version: VERSION, day: today, at: Date.now(), shuffle: s.shuffle, config: JSON.stringify(s.config), rows }));
  } catch {}
}
function clearBootRows(scope) {
  if (!scope) return;
  sessionShuffles.clear();
  heroMemoryCache.clear();
  try {
    for (const page of ['home', 'movies', 'shows']) {
      localStorage.removeItem?.(heroCacheKey(scope, page));
      for (const view of ['home', 'suggestions']) {
        localStorage.removeItem?.(bootRowsKey(scope, { page, parentId: '', view }));
      }
    }
    if (typeof localStorage.length === 'number' && typeof localStorage.key === 'function') {
      const toDelete = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith(`fazfort-discovery:boot:v2:${scope}:`) || k.startsWith(`fazfort-discovery:boot:v3:${scope}:`) || k.startsWith(`fazfort-discovery:hero:v1:${scope}:`))) {
          toDelete.push(k);
        }
      }
      toDelete.forEach(k => localStorage.removeItem?.(k));
    }
    if (window.sessionStorage && typeof window.sessionStorage.length === 'number') {
      const sDel = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const k = window.sessionStorage.key(i);
        if (k && k.startsWith(`fazfort-discovery:shuffle:${scope}:`)) sDel.push(k);
      }
      sDel.forEach(k => window.sessionStorage.removeItem?.(k));
    }
  } catch {}
}
function ensureSearchInventory(api = window.ApiClient) {
  if (!api?.getCurrentUserId?.()) return Promise.resolve(null);
  const sc = scopeKey(api);
  const snapKey = `${sc}:home:`;
  const existing = snapshots.get(snapKey);
  if (existing && Date.now() - existing.at < 5 * 60000) return Promise.resolve(existing.value);
  if (searchInvInflight) return searchInvInflight;
  const client = new JellyfinClient(api, () => !stopped);
  searchInvInflight = client.inventory({ page: 'home', parentId: '' }).then(inv => {
    searchInvInflight = null;
    if (inv && Array.isArray(inv.items)) {
      snapshots.set(snapKey, { at: Date.now(), value: inv });
      searchInvListeners.forEach(fn => { try { fn(inv); } catch {} });
    }
    return inv;
  }).catch(() => {
    searchInvInflight = null;
    return null;
  });
  return searchInvInflight;
}
function installFiltersFetchGuard() {
  const f = window.fetch;
  if (typeof f !== 'function' || f._fxFiltersGuarded) return;
  savedWindowFetch = f;
  const wrappedFetch = async function(input, init) {
    const resp = await f.call(this, input, init);
    try {
      const urlStr = typeof input === 'string' ? input : (input?.url || '');
      if (/\/Items\/Filters2(?:\?|$)/i.test(urlStr) && resp && typeof resp.clone === 'function') {
        const cloned = resp.clone();
        const data = await cloned.json();
        if (data && typeof data === 'object' && Array.isArray(data.Tags) && data.Tags.length > 0) {
          const stripped = JSON.stringify({ ...data, Tags: [] });
          if (typeof Response === 'function') {
            return new Response(stripped, {
              status: resp.status || 200,
              statusText: resp.statusText || 'OK',
              headers: resp.headers || { 'Content-Type': 'application/json' }
            });
          }
          return {
            ok: true,
            status: resp.status || 200,
            headers: resp.headers,
            json: async () => ({ ...data, Tags: [] }),
            text: async () => stripped,
            clone: function() { return this; }
          };
        }
      }
    } catch {}
    return resp;
  };
  wrappedFetch._fxFiltersGuarded = true;
  try { window.fetch = wrappedFetch; } catch {}
}
function restoreFiltersFetchGuard() {
  if (!savedWindowFetch) return;
  try { window.fetch = savedWindowFetch; } catch {}
  savedWindowFetch = null;
}
function findFilterPopoverProps(popover) {
  const candidates = [
    popover?.querySelector?.('.MuiPaper-root'),
    popover,
    popover?.querySelector?.('.MuiAccordion-root')
  ].filter(Boolean);
  for (const node of candidates) {
    for (const key of Object.keys(node)) {
      if (!key.startsWith('__reactFiber$') && !key.startsWith('__reactInternalInstance$')) continue;
      let cur = node[key];
      let depth = 0;
      while (cur && depth++ < 28) {
        const mp = cur.memoizedProps || cur.pendingProps;
        if (mp && typeof mp.setLibraryViewSettings === 'function') {
          return mp;
        }
        cur = cur.return;
      }
    }
  }
  return popover?._fxFilterProps || null;
}
function hasActiveLibraryFilters(filtersObj) {
  if (!filtersObj || typeof filtersObj !== 'object') return false;
  for (const val of Object.values(filtersObj)) {
    if (Array.isArray(val) ? val.length > 0 : Boolean(val)) return true;
  }
  return false;
}
const YEAR_ERA_PRESETS = [
  { label: '2020s', from: 2020, to: 2029 },
  { label: '2010s', from: 2010, to: 2019 },
  { label: '2000s', from: 2000, to: 2009 },
  { label: '1990s', from: 1990, to: 1999 },
  { label: '1980s', from: 1980, to: 1989 },
  { label: 'Classic', from: 1888, to: 1979 }
];
function enhanceFilterPopover(popover) {
  if (!popover) return;
  const props = popover._fxFilterProps || findFilterPopoverProps(popover);
  if (props) popover._fxFilterProps = props;
  const paper = popover.querySelector('.MuiPaper-root');
  if (!paper) return;
  const sleekPopup = popover.querySelector('.sleekfin-menu-popup');

  // 1. Remove Tags & Studios sections completely from both MUI and SleekFin's cloned popup
  for (const hdrSel of ['#filtersTags-header', '#filtersStudios-header']) {
    const hdr = paper.querySelector(hdrSel);
    const acc = hdr?.closest?.('.MuiAccordion-root');
    if (acc) {
      acc.style.display = 'none';
      acc.hidden = true;
    }
  }
  if (sleekPopup) {
    sleekPopup.querySelectorAll('button.sleekfin-menu-item').forEach(btn => {
      const lbl = (btn.textContent || '').trim().toLowerCase();
      if (lbl === 'tags' || lbl === 'studios' || lbl === 'reset filters') {
        const grp = btn.closest('.sleekfin-menu-group');
        if (grp && lbl !== 'reset filters') grp.style.display = 'none';
        btn.style.display = 'none';
      }
    });
  }

  // 2. Replace the individual Years checkbox list with a labeled From/To Year Range + Quick Era Chips
  // Never remove React-owned nodes (avoids React removeChild crashes); CSS hides checkboxes at Frame 0.
  const yearsContent = paper.querySelector('#filtersYears-content');
  const yearsHeader = paper.querySelector('#filtersYears-header');
  if (yearsContent) {
    yearsContent.dataset.fxYearsEnhanced = 'true';
    const nativeGroup = yearsContent.querySelector('.MuiFormGroup-root');
    if (nativeGroup) {
      nativeGroup.style.display = 'none';
      nativeGroup.hidden = true;
    }
    const activeYears = Array.isArray(popover._fxFilterProps?.libraryViewSettings?.Filters?.Years)
      ? popover._fxFilterProps.libraryViewSettings.Filters.Years.map(Number).filter(Number.isFinite)
      : [];
    let rangeBox = popover._fxYearPickerEl || null;
    if (!rangeBox) {
      rangeBox = element('div', 'fx-year-picker');
      const fieldsRow = element('div', 'fx-year-range');
      const fromWrap = element('div', 'fx-year-field');
      const fromLbl = element('span', 'fx-year-label', 'From');
      const fromInput = element('input', 'fx-year-input fx-year-from');
      fromInput.type = 'text';
      fromInput.inputMode = 'numeric';
      fromInput.maxLength = 4;
      fromInput.placeholder = '1990';
      fromInput.setAttribute('aria-label', 'Start year');
      fromWrap.append(fromLbl, fromInput);

      const sep = element('span', 'fx-year-range-sep', '–');
      sep.setAttribute('aria-hidden', 'true');

      const toWrap = element('div', 'fx-year-field');
      const toLbl = element('span', 'fx-year-label', 'To');
      const toInput = element('input', 'fx-year-input fx-year-to');
      toInput.type = 'text';
      toInput.inputMode = 'numeric';
      toInput.maxLength = 4;
      toInput.placeholder = String(new Date().getFullYear());
      toInput.setAttribute('aria-label', 'End year');
      toWrap.append(toLbl, toInput);

      fieldsRow.append(fromWrap, sep, toWrap);

      const presetsRow = element('div', 'fx-year-presets');
      presetsRow.setAttribute('role', 'group');
      presetsRow.setAttribute('aria-label', 'Quick era presets');
      for (const preset of YEAR_ERA_PRESETS) {
        const chip = element('button', 'fx-year-chip', preset.label);
        chip.type = 'button';
        chip.dataset.from = String(preset.from);
        chip.dataset.to = String(preset.to);
        chip.addEventListener('click', ev => {
          ev.preventDefault();
          ev.stopPropagation();
          const alreadyActive = chip.classList.contains('is-active');
          if (alreadyActive) {
            popover._fxYearDraft = { from: '', to: '', active: false };
            fromInput.value = '';
            toInput.value = '';
            rangeBox._toEdited = false;
            applyYearValues('', '');
          } else {
            const curMax = Math.min(preset.to, new Date().getFullYear());
            const fStr = String(preset.from);
            const tStr = String(curMax);
            popover._fxYearDraft = { from: fStr, to: tStr, active: true };
            fromInput.value = fStr;
            toInput.value = tStr;
            rangeBox._toEdited = true;
            applyYearValues(fStr, tStr);
          }
          syncPresetChips();
        });
        presetsRow.append(chip);
      }

      rangeBox.append(fieldsRow, presetsRow);
      popover._fxYearPickerEl = rangeBox;

      rangeBox._toEdited = activeYears.length > 1 && Math.min(...activeYears) !== Math.max(...activeYears);
      let yearTimer = 0;
      const syncPresetChips = () => {
        const rf = fromInput.value.trim();
        const rt = toInput.value.trim();
        const fNum = rf.length === 4 ? Number(rf) : NaN;
        const tNum = rt.length === 4 ? Number(rt) : NaN;
        const curYr = new Date().getFullYear();
        rangeBox.querySelectorAll('.fx-year-chip').forEach(ch => {
          const pf = Number(ch.dataset.from);
          const pt = Math.min(Number(ch.dataset.to), curYr);
          const hit = Number.isFinite(fNum) && Number.isFinite(tNum) && fNum === pf && (tNum === pt || tNum === Number(ch.dataset.to));
          ch.classList.toggle('is-active', hit);
          ch.setAttribute('aria-pressed', hit ? 'true' : 'false');
        });
      };
      const applyYearValues = (rawFrom, rawTo) => {
        clearTimeout(yearTimer);
        const curProps = findFilterPopoverProps(popover) || popover._fxFilterProps;
        if (!curProps || typeof curProps.setLibraryViewSettings !== 'function') return;
        if (!rawFrom && !rawTo) {
          rangeBox._toEdited = false;
          popover._fxYearDraft = { from: '', to: '', active: false };
          curProps.setLibraryViewSettings(prev => ({
            ...prev,
            StartIndex: 0,
            Filters: { ...(prev?.Filters || {}), Years: undefined }
          }));
          syncPresetChips();
          syncResetBtnState();
          return;
        }
        if (rawFrom.length !== 4 || (rawTo && rawTo.length !== 4)) return;
        const y1 = Number(rawFrom);
        const y2 = rawTo.length === 4 ? Number(rawTo) : y1;
        if (!Number.isInteger(y1) || !Number.isInteger(y2) || y1 < 1888 || y2 < 1888 || y1 > 2100 || y2 > 2100) return;
        const lo = Math.min(y1, y2);
        const hi = Math.max(y1, y2);
        const opts = Array.isArray(curProps.yearsOptions) ? curProps.yearsOptions : [];
        let nextYears = [];
        if (opts.length) {
          nextYears = opts
            .map(o => Number(o?.Value ?? o?.Name ?? o))
            .filter(y => Number.isInteger(y) && y >= lo && y <= hi);
        } else {
          for (let y = lo; y <= hi; y++) nextYears.push(y);
        }
        popover._fxYearDraft = { from: rawFrom, to: rawTo || rawFrom, active: true };
        curProps.setLibraryViewSettings(prev => ({
          ...prev,
          StartIndex: 0,
          Filters: { ...(prev?.Filters || {}), Years: nextYears }
        }));
        syncPresetChips();
        syncResetBtnState(true);
      };
      const applyYearFilter = () => applyYearValues(fromInput.value.trim(), toInput.value.trim());
      const scheduleYearApply = () => {
        clearTimeout(yearTimer);
        yearTimer = setTimeout(applyYearFilter, 150);
      };
      fromInput.addEventListener('input', ev => {
        ev.stopPropagation();
        const clean = fromInput.value.replace(/\D+/g, '').slice(0, 4);
        if (fromInput.value !== clean) fromInput.value = clean;
        if (!rangeBox._toEdited) {
          toInput.value = clean;
        }
        popover._fxYearDraft = { from: clean, to: toInput.value, active: Boolean(clean || toInput.value) };
        syncPresetChips();
        if (!clean && !toInput.value) {
          applyYearFilter();
        } else {
          scheduleYearApply();
        }
      });
      toInput.addEventListener('focus', () => {
        try { toInput.select?.(); } catch {}
      });
      toInput.addEventListener('input', ev => {
        ev.stopPropagation();
        const clean = toInput.value.replace(/\D+/g, '').slice(0, 4);
        if (toInput.value !== clean) toInput.value = clean;
        if (!clean && !fromInput.value) {
          rangeBox._toEdited = false;
          popover._fxYearDraft = { from: '', to: '', active: false };
          syncPresetChips();
          applyYearFilter();
          return;
        }
        rangeBox._toEdited = clean !== '' && clean !== fromInput.value;
        popover._fxYearDraft = { from: fromInput.value, to: clean, active: true };
        syncPresetChips();
        scheduleYearApply();
      });
      for (const inp of [fromInput, toInput]) {
        inp.addEventListener('click', ev => ev.stopPropagation());
        inp.addEventListener('keydown', ev => {
          ev.stopPropagation();
          if (ev.key === 'Enter') {
            ev.preventDefault();
            applyYearFilter();
          }
        });
      }
      rangeBox._syncPresetChips = syncPresetChips;
    }

    // Mount into SleekFin's live popup when active (so SleekFin never strips classes or clones inputs),
    // otherwise mount directly into MUI's #filtersYears-content.
    if (sleekPopup) {
      yearsContent.style.display = 'none';
      const yearsBtn = [...sleekPopup.querySelectorAll('button.sleekfin-menu-item[aria-expanded]')].find(
        b => (b.textContent || '').trim().toLowerCase() === 'years'
      );
      const isExpanded = yearsBtn
        ? yearsBtn.getAttribute('aria-expanded') === 'true'
        : yearsHeader?.getAttribute?.('aria-expanded') === 'true';
      if (yearsBtn && isExpanded) {
        if (rangeBox.previousElementSibling !== yearsBtn) {
          const prevFocus = document.activeElement;
          const keepFocus = rangeBox.contains(prevFocus) ? prevFocus : null;
          const selStart = keepFocus && typeof keepFocus.selectionStart === 'number' ? keepFocus.selectionStart : null;
          const selEnd = keepFocus && typeof keepFocus.selectionEnd === 'number' ? keepFocus.selectionEnd : null;
          yearsBtn.after(rangeBox);
          if (keepFocus) {
            try {
              keepFocus.focus({ preventScroll: true });
              if (selStart !== null && selEnd !== null) keepFocus.setSelectionRange?.(selStart, selEnd);
            } catch {}
          }
        }
        rangeBox.hidden = false;
      } else {
        rangeBox.hidden = true;
      }
    } else {
      yearsContent.style.display = '';
      const host = yearsContent.querySelector('.MuiAccordionDetails-root') || yearsContent;
      if (!host.contains(rangeBox)) host.prepend(rangeBox);
      rangeBox.hidden = false;
    }

    const fromInput = rangeBox.querySelector('.fx-year-from');
    const toInput = rangeBox.querySelector('.fx-year-to');
    const activeEl = document.activeElement;
    const isTypingYear = activeEl === fromInput || activeEl === toInput || Boolean(activeEl?.closest?.('#filter-popover') && activeEl?.tagName === 'INPUT');
    const hasDraft = Boolean(popover._fxYearDraft?.active);
    if (!isTypingYear && !hasDraft && fromInput && toInput) {
      if (activeYears.length > 0) {
        const minY = Math.min(...activeYears);
        const maxY = Math.max(...activeYears);
        fromInput.value = String(minY);
        toInput.value = String(maxY);
        rangeBox._toEdited = minY !== maxY;
        popover._fxYearDraft = { from: String(minY), to: String(maxY), active: true };
      } else {
        fromInput.value = '';
        toInput.value = '';
        rangeBox._toEdited = false;
      }
      rangeBox._syncPresetChips?.();
    }
  }

  // 3. Add Reset filters button at the bottom of the visible Filter dropdown.
  // When SleekFin is active, wait for .sleekfin-menu-popup before mounting so SleekFin never clones
  // a duplicate Reset filters row out of .MuiPaper-root on frame 0 (zero flicker).
  const sleekActive = Boolean(
    sleekPopup ||
    paper.classList.contains('sleekfin-menu-host') ||
    document.documentElement?.classList?.contains('sleekfin-main-ui')
  );
  const footerHost = sleekPopup || (sleekActive ? null : paper);
  if (footerHost) {
    let footer = popover._fxFilterFooterEl || footerHost.querySelector('.fx-filter-footer');
    if (!footer) {
      footer = element('div', 'fx-filter-footer');
      const resetBtn = element('button', 'fx-filter-reset-btn', 'Reset filters');
      resetBtn.type = 'button';
      resetBtn.addEventListener('click', ev => {
        ev.preventDefault();
        ev.stopPropagation();
        popover._fxYearDraft = { from: '', to: '', active: false };
        const rangeBox = popover._fxYearPickerEl || popover.querySelector('.fx-year-picker');
        if (rangeBox) {
          const fi = rangeBox.querySelector('.fx-year-from');
          const ti = rangeBox.querySelector('.fx-year-to');
          if (fi) fi.value = '';
          if (ti) ti.value = '';
          rangeBox._toEdited = false;
          rangeBox._syncPresetChips?.();
        }
        const curProps = findFilterPopoverProps(popover) || popover._fxFilterProps;
        if (curProps && typeof curProps.setLibraryViewSettings === 'function') {
          curProps.setLibraryViewSettings(prev => ({
            ...prev,
            StartIndex: 0,
            Filters: {}
          }));
        }
        resetBtn.classList.remove('is-active');
      });
      footer.append(resetBtn);
      popover._fxFilterFooterEl = footer;
    }
    if (footer.parentElement !== footerHost) {
      footerHost.append(footer);
    }
  }
  function syncResetBtnState(forceActive = null) {
    const btn = popover._fxFilterFooterEl?.querySelector?.('.fx-filter-reset-btn');
    if (!btn) return;
    const curProps = findFilterPopoverProps(popover) || popover._fxFilterProps;
    const active = forceActive !== null ? forceActive : hasActiveLibraryFilters(curProps?.libraryViewSettings?.Filters);
    btn.classList.toggle('is-active', Boolean(active));
  }
  syncResetBtnState();
}
function setRootAttr(name, active) {
  const el = document.documentElement;
  if (!el) return;
  if (active) {
    if (el.getAttribute(name) !== 'true') el.setAttribute(name, 'true');
  } else if (el.hasAttribute(name)) {
    el.removeAttribute(name);
  }
}
function isVideoOsdOpen() {
  const osd = document.getElementById('videoOsdPage');
  return Boolean(osd && !osd.classList.contains('hide') && !osd.classList.contains('hidePage') && !osd.hidden);
}
function syncDocumentStateAttrs() {
  const osdOpen = isVideoOsdOpen();
  setRootAttr('data-fx-video-osd', osdOpen);
  if (osdOpen) {
    const osd = document.getElementById('videoOsdPage');
    const gearBtn = osd?.querySelector?.('.btnVideoOsdSettings');
    if (gearBtn && !document.documentElement?.style?.getPropertyValue?.('--fx-osd-popup-bottom')) {
      updateOsdPopupAnchor(gearBtn);
    }
  } else {
    document.documentElement?.removeAttribute?.('data-fx-osd-anchor');
    osdMuteState.muted = false;
  }
  const liveTvPage = document.getElementById('liveTvSuggestedPage');
  const liveTvOpen = Boolean(liveTvPage && !liveTvPage.classList.contains('hide') && !liveTvPage.classList.contains('hidePage') && !liveTvPage.hidden);
  setRootAttr('data-fx-livetv', liveTvOpen);
  const searchPage = document.getElementById('searchPage');
  const searchOpen = Boolean(searchPage && !searchPage.classList.contains('hide') && !searchPage.classList.contains('hidePage') && !searchPage.hidden);
  setRootAttr('data-fx-search-page', searchOpen);
  const appBar = document.querySelector('header.MuiAppBar-root');
  const toolbars = appBar ? appBar.querySelectorAll(':scope > .MuiToolbar-root') : null;
  setRootAttr('data-fx-has-subheader', Boolean(toolbars && toolbars.length >= 2));
}
function hideSleekFinUserSettingsMenu() {
  document.querySelectorAll('[data-sleekfin-user-settings-link="true"]').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelectorAll('#app-user-menu .sleekfin-menu-popup .sleekfin-menu-item, #myPreferencesMenuPage a, #myPreferencesMenuPage button').forEach(btn => {
    const txt = (btn.textContent || '').trim().toLowerCase();
    if (txt === 'sleekfin') btn.style.display = 'none';
  });
}
function guardStuckClosingMenus() {
  document.querySelectorAll('.sleekfin-menu-host.sleekfin-menu-closing').forEach(host => {
    if (host.dataset.fxCloseGuard === 'true') return;
    host.dataset.fxCloseGuard = 'true';
    setTimeout(() => {
      if (!host.isConnected || !host.classList.contains('sleekfin-menu-closing')) return;
      try {
        const Ev = typeof AnimationEvent === 'function' ? AnimationEvent : document.defaultView?.AnimationEvent;
        if (Ev) host.dispatchEvent(new Ev('animationend', { animationName: 'sleekfin-menu-settle-close', bubbles: true }));
        else host.dispatchEvent(new Event('animationend', { bubbles: true }));
      } catch {}
    }, 280);
  });
}
function updateOsdPopupAnchor(anchorEl) {
  const osd = document.getElementById('videoOsdPage');
  const el = anchorEl || osd?.querySelector?.('.btnVideoOsdSettings') || osd?.querySelector?.('.btnSubtitles');
  if (!el || !document.documentElement) return;
  const r = el.getBoundingClientRect?.();
  if (!r || r.width <= 0 || r.height <= 0) return;
  const vw = window.innerWidth || document.documentElement.clientWidth || 1280;
  const vh = window.innerHeight || document.documentElement.clientHeight || 720;
  const bottomPx = Math.max(56, Math.min(vh - 120, Math.round(vh - r.top + 10)));
  const rightPx = Math.max(12, Math.min(vw - 200, Math.round(vw - r.right)));
  document.documentElement.style?.setProperty?.('--fx-osd-popup-bottom', `${bottomPx}px`);
  document.documentElement.style?.setProperty?.('--fx-osd-popup-right', `${rightPx}px`);
}
function updateHeaderPopupAnchor(anchorEl) {
  if (!anchorEl || !document.documentElement) return false;
  const r = anchorEl.getBoundingClientRect?.();
  if (!r || (r.width <= 0 && r.height <= 0)) return false;
  const vw = window.innerWidth || document.documentElement.clientWidth || 1280;
  const vh = window.innerHeight || document.documentElement.clientHeight || 720;
  const topPx = Math.max(40, Math.min(vh - 140, Math.round(r.bottom + 8)));
  const rightPx = Math.max(12, Math.min(vw - 200, Math.round(vw - r.right)));
  document.documentElement.style?.setProperty?.('--fx-header-popup-top', `${topPx}px`);
  document.documentElement.style?.setProperty?.('--fx-header-popup-right', `${rightPx}px`);
  return true;
}
function isSyncPlayOrCastTrigger(el) {
  if (!el) return false;
  if (el.matches?.('.headerSyncButton, .syncButton, .headerSyncPlayButton, .btnSyncPlay, .headerCastButton, .castButton, .btnCast, [aria-controls="app-sync-play-menu"], [aria-controls="app-remote-play-menu"], [aria-controls*="sync-play" i], [aria-controls*="remote-play" i], [aria-controls*="cast" i]')) return true;
  const label = `${el.getAttribute?.('title') || ''} ${el.getAttribute?.('aria-label') || ''} ${el.getAttribute?.('aria-controls') || ''} ${el.className || ''}`.toLowerCase();
  return /syncplay|sync[\s_-]*play|syncbutton|cast|play\s*on|remote[\s_-]*play/.test(label);
}
function onOsdAnchorPointer(event) {
  if (stopped) return;
  const clicked = event.target?.closest?.('button, a, [role="button"], .fx-card, .card');
  if (clicked && typeof clicked.getBoundingClientRect === 'function') {
    const cr = clicked.getBoundingClientRect();
    if (cr && (cr.width > 0 || cr.height > 0)) {
      lastTriggerRect = {
        left: cr.left, top: cr.top, right: cr.right, bottom: cr.bottom,
        width: cr.width, height: cr.height,
        cx: cr.left + cr.width / 2, cy: cr.top + cr.height / 2,
        at: Date.now()
      };
    }
  }
  // Detail page three-dots (...) button
  const detailMoreBtn = event.target?.closest?.('#itemDetailPage .btnMoreCommands, .itemDetailPage .btnMoreCommands, #itemDetailPage [data-sleekfin-action-id="more"], .itemDetailPage [data-sleekfin-action-id="more"], #itemDetailPage .sleekfin-details-action-overflow-trigger, .itemDetailPage .sleekfin-details-action-overflow-trigger, #itemDetailPage button[title="More" i], #itemDetailPage button[aria-label="More" i], #itemDetailPage button:has(.more_vert)');
  if (detailMoreBtn && typeof detailMoreBtn.getBoundingClientRect === 'function') {
    const r = detailMoreBtn.getBoundingClientRect();
    if (r && (r.width > 0 || r.height > 0)) {
      detailMoreAnchor = {
        el: detailMoreBtn,
        left: r.left, top: r.top, right: r.right, bottom: r.bottom,
        width: r.width, height: r.height,
        cx: r.left + r.width / 2, cy: r.top + r.height / 2,
        at: Date.now()
      };
    }
  }
  // SyncPlay & Cast to Device header triggers (both during playback in .osdHeader/.videoOsd-appBar AND on regular pages)
  const headerBtn = event.target?.closest?.('.headerSyncButton, .syncButton, .headerSyncPlayButton, .btnSyncPlay, .headerCastButton, .castButton, .btnCast, [aria-controls="app-sync-play-menu"], [aria-controls="app-remote-play-menu"], .videoOsd-appBar button, .osdHeader button, .skinHeader .headerRight button, .skinHeader .headerRight a, header.MuiAppBar-root button, [data-sleekfin-header] button');
  const isBackBtn = Boolean(headerBtn?.matches?.('.headerBackButton, [aria-label="Back" i], .videoOsd-appBar > button:first-child'));
  if (headerBtn && !isBackBtn && (isSyncPlayOrCastTrigger(headerBtn) || (isVideoOsdOpen() && headerBtn.closest('.osdHeader, .videoOsd-appBar, .skinHeader')))) {
    updateHeaderPopupAnchor(headerBtn);
    headerMenuAnchor = { el: headerBtn, at: Date.now() };
    if (isVideoOsdOpen()) document.documentElement?.setAttribute?.('data-fx-osd-anchor', 'top');
    return;
  }
  if (!isVideoOsdOpen()) return;
  // Clicking Playback data / Playback info inside OSD menu: wake up paused PlayerStats
  const statsTrigger = event.target?.closest?.('[data-id="stats"], .sleekfin-menu-item, .actionSheetMenuItem');
  if (statsTrigger) {
    const txt = (statsTrigger.textContent || '').trim().toLowerCase();
    if (statsTrigger.getAttribute('data-id') === 'stats' || /playback\s*(data|info)|stats\s*for\s*nerds/.test(txt)) {
      setTimeout(() => syncPlaybackStats(), 60);
      setTimeout(() => syncPlaybackStats(), 220);
    }
  }
  const trigger = event.target?.closest?.('#videoOsdPage .btnVideoOsdSettings, #videoOsdPage .btnSubtitles, #videoOsdPage .btnAudio');
  if (trigger) {
    // Anchor Subtitles & Settings popups cleanly above the bottom-right control row before frame 0 paints
    document.documentElement?.setAttribute?.('data-fx-osd-anchor', 'bottom');
    headerMenuAnchor = null;
    const osd = document.getElementById('videoOsdPage');
    const gearBtn = osd?.querySelector?.('.btnVideoOsdSettings');
    const anchor = trigger.classList.contains('btnAudio') && gearBtn ? gearBtn : trigger;
    updateOsdPopupAnchor(anchor);
  }
}
function animateModalFromOrigin(dialog, rectOverride = null) {
  if (!dialog || dialog.dataset.fxOriginAnimated === 'true') return;
  const r = rectOverride || (lastTriggerRect && (Date.now() - lastTriggerRect.at < 1000) ? lastTriggerRect : null);
  dialog.dataset.fxOriginAnimated = 'true';
  if (!r) return;
  const vw = window.innerWidth || document.documentElement?.clientWidth || 1280;
  const vh = window.innerHeight || document.documentElement?.clientHeight || 720;
  const targetRect = typeof dialog.getBoundingClientRect === 'function' ? dialog.getBoundingClientRect() : null;
  const targetCx = targetRect && targetRect.width > 0 ? (targetRect.left + targetRect.width / 2) : (vw / 2);
  const targetCy = targetRect && targetRect.height > 0 ? (targetRect.top + targetRect.height / 2) : (vh / 2);
  const dx = Math.round(r.cx - targetCx);
  const dy = Math.round(r.cy - targetCy);
  dialog.style?.setProperty?.('--fx-origin-x', `${dx}px`);
  dialog.style?.setProperty?.('--fx-origin-y', `${dy}px`);
  dialog.classList.add('fx-modal-origin-anim');
  // Keep fx-modal-origin-anim active while open (animation-fill-mode: both) so Jellyfin's underlying
  // entry animation never restarts from opacity:0 on animationend; release cleanly only on dialog close.
  dialog.addEventListener?.('closing', () => dialog.classList.remove('fx-modal-origin-anim'), { once: true });
}
function syncOriginModals() {
  document.querySelectorAll('.sleekfin-details-info-container .dialog, .dialog.sleekfin-details-track-dialog, .dialogContainer > .dialog:not(.actionSheet):not(.sleekfin-menu-host):not(.filterDialog):not(.hide)').forEach(dlg => {
    if (dlg.classList.contains('sleekfin-menu-closing') || dlg.classList.contains('hide')) return;
    animateModalFromOrigin(dlg);
  });
}
function resolveLiveDetailMoreAnchor(detailPage) {
  const fromStored = detailMoreAnchor && (Date.now() - detailMoreAnchor.at < 2500) ? detailMoreAnchor : null;
  if (fromStored?.el?.isConnected && typeof fromStored.el.getBoundingClientRect === 'function') {
    const r = fromStored.el.getBoundingClientRect();
    if (r && (r.width > 0 || r.height > 0)) {
      return {
        el: fromStored.el,
        left: r.left, top: r.top, right: r.right, bottom: r.bottom,
        width: r.width, height: r.height,
        cx: r.left + r.width / 2, cy: r.top + r.height / 2
      };
    }
  }
  if (fromStored && Number.isFinite(fromStored.left)) return fromStored;
  if (!detailPage) return null;
  const fallbackBtn = detailPage.querySelector('.btnMoreCommands:not(.hide), [data-sleekfin-action-id="more"] button, [data-sleekfin-action-id="more"], .sleekfin-details-action-overflow-trigger:not([hidden]), button[title="More" i]:not(.hide), button:has(.more_vert):not(.hide)');
  if (fallbackBtn && typeof fallbackBtn.getBoundingClientRect === 'function') {
    const r = fallbackBtn.getBoundingClientRect();
    if (r && (r.width > 0 || r.height > 0)) {
      return {
        el: fallbackBtn,
        left: r.left, top: r.top, right: r.right, bottom: r.bottom,
        width: r.width, height: r.height,
        cx: r.left + r.width / 2, cy: r.top + r.height / 2
      };
    }
  }
  return null;
}
function positionDetailMoreMenu(popup, anchor) {
  if (!popup || !anchor) return;
  const vw = window.innerWidth || document.documentElement?.clientWidth || 1280;
  const vh = window.innerHeight || document.documentElement?.clientHeight || 720;
  const margin = 12;
  const gap = 12;
  const rowCount = popup.querySelectorAll?.('.sleekfin-menu-item, .actionSheetMenuItem')?.length || 0;
  const measured = typeof popup.getBoundingClientRect === 'function' ? popup.getBoundingClientRect() : null;
  const rawPw = Math.round(popup.offsetWidth || measured?.width || 228);
  const pw = Math.max(188, Math.min(vw - margin * 2, rawPw > 60 ? rawPw : 228));
  const rawPh = Math.round(popup.scrollHeight || popup.offsetHeight || measured?.height || (rowCount ? rowCount * 38 + 16 : 280));
  const ph = Math.max(80, Math.min(vh - margin * 2, rawPh > 60 ? rawPh : 280));
  const spaceBelow = vh - anchor.bottom - gap - margin;
  const spaceAbove = anchor.top - gap - margin;
  const spaceRight = vw - anchor.right - gap - margin;
  const spaceLeft = anchor.left - gap - margin;

  let place = 'bottom';
  let leftPx = margin;
  let topPx = margin;
  let maxW = vw - margin * 2;
  let maxH = vh - margin * 2;

  if (spaceBelow >= ph) {
    place = 'bottom';
    topPx = Math.round(anchor.bottom + gap);
    maxH = Math.max(120, Math.floor(vh - topPx - margin));
    leftPx = Math.max(margin, Math.min(vw - pw - margin, Math.round(anchor.cx - pw / 2)));
  } else if (spaceAbove >= ph) {
    place = 'top';
    maxH = Math.max(120, Math.floor(anchor.top - gap - margin));
    const effH = Math.min(ph, maxH);
    topPx = Math.max(margin, Math.round(anchor.top - gap - effH));
    leftPx = Math.max(margin, Math.min(vw - pw - margin, Math.round(anchor.cx - pw / 2)));
  } else if (Math.max(spaceLeft, spaceRight) >= Math.min(pw, 180)) {
    place = spaceRight >= spaceLeft ? 'right' : 'left';
    maxH = Math.max(120, Math.floor(vh - margin * 2));
    const effH = Math.min(ph, maxH);
    topPx = Math.max(margin, Math.min(vh - effH - margin, Math.round(anchor.cy - effH / 2)));
    if (place === 'right') {
      leftPx = Math.round(anchor.right + gap);
      maxW = Math.max(168, Math.floor(vw - leftPx - margin));
    } else {
      maxW = Math.max(168, Math.floor(anchor.left - gap - margin));
      const effW = Math.min(pw, maxW);
      leftPx = Math.max(margin, Math.round(anchor.left - gap - effW));
    }
  } else if (spaceAbove >= spaceBelow) {
    place = 'top';
    maxH = Math.max(110, Math.floor(anchor.top - gap - margin));
    const effH = Math.min(ph, maxH);
    topPx = Math.max(margin, Math.round(anchor.top - gap - effH));
    leftPx = Math.max(margin, Math.min(vw - pw - margin, Math.round(anchor.cx - pw / 2)));
  } else {
    place = 'bottom';
    topPx = Math.round(anchor.bottom + gap);
    maxH = Math.max(110, Math.floor(vh - topPx - margin));
    leftPx = Math.max(margin, Math.min(vw - pw - margin, Math.round(anchor.cx - pw / 2)));
  }

  // Final viewport invariant: never negative, never clipped off-screen at any viewport width/height
  const effW = Math.min(pw, maxW);
  const effH = Math.min(ph, maxH);
  leftPx = Math.max(margin, Math.min(vw - effW - margin, leftPx));
  topPx = Math.max(margin, Math.min(vh - effH - margin, topPx));

  const originX = Math.max(0, Math.min(effW, Math.round(anchor.cx - leftPx)));
  const originY = Math.max(0, Math.min(effH, Math.round(anchor.cy - topPx)));
  const dx = Math.max(-44, Math.min(44, Math.round(anchor.cx - (leftPx + effW / 2))));
  const dy = Math.max(-44, Math.min(44, Math.round(anchor.cy - (topPx + effH / 2))));

  popup.dataset.fxDetailMore = 'true';
  popup.dataset.fxMorePlace = place;
  popup.dataset.fxDetailMoreRows = String(rowCount);
  popup.dataset.fxDetailMoreSize = `${vw}x${vh}:${rawPw}x${rawPh}`;
  popup.style.setProperty('position', 'fixed', 'important');
  popup.style.setProperty('left', `${leftPx}px`, 'important');
  popup.style.setProperty('top', `${topPx}px`, 'important');
  popup.style.setProperty('right', 'auto', 'important');
  popup.style.setProperty('bottom', 'auto', 'important');
  popup.style.setProperty('margin', '0', 'important');
  popup.style.setProperty('max-width', `${maxW}px`, 'important');
  popup.style.setProperty('max-height', `${maxH}px`, 'important');
  popup.style.setProperty('transform-origin', `${originX}px ${originY}px`, 'important');
  popup.style.setProperty('--fx-more-dx', `${dx}px`);
  popup.style.setProperty('--fx-more-dy', `${dy}px`);

  // Post-layout reflow check so once SleekFin finishes populating items/height, the menu stays strictly clear of the button and inside viewport
  if (!popup._fxMoreReflowDone) {
    popup._fxMoreReflowDone = true;
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => {
        if (stopped || !popup.isConnected || popup.closest?.('.sleekfin-menu-closing')) return;
        const freshAnchor = resolveLiveDetailMoreAnchor(getVisibleDetailPage()) || anchor;
        const nextRows = popup.querySelectorAll?.('.sleekfin-menu-item, .actionSheetMenuItem')?.length || 0;
        const nextH = Math.round(popup.scrollHeight || popup.offsetHeight || 0);
        if (nextRows !== rowCount || Math.abs(nextH - rawPh) > 12) {
          positionDetailMoreMenu(popup, freshAnchor);
        }
      });
    }
  }
}
function updateNativeScrollerEdges(scroller) {
  if (!scroller || !scroller.isConnected) return;
  const section = scroller.closest?.('.verticalSection, .detailVerticalSection, .emby-scroller-container') || scroller.parentElement;
  const leftBtn = section?.querySelector?.('.emby-scrollbuttons-button[data-direction="left"], .emby-scrollbuttons .emby-scrollbuttons-button:first-child');
  const rightBtn = section?.querySelector?.('.emby-scrollbuttons-button[data-direction="right"], .emby-scrollbuttons .emby-scrollbuttons-button:last-child');
  let atStart = true;
  let atEnd = true;
  const maxNative = Math.max(0, (scroller.scrollWidth || 0) - (scroller.clientWidth || 0));
  if (maxNative > 4) {
    atStart = (scroller.scrollLeft || 0) <= 2;
    atEnd = (scroller.scrollLeft || 0) >= maxNative - 2;
  } else {
    const slider = scroller.querySelector?.('.itemsContainer, .scrollSlider');
    const sr = typeof scroller.getBoundingClientRect === 'function' ? scroller.getBoundingClientRect() : null;
    const cr = slider && typeof slider.getBoundingClientRect === 'function' ? slider.getBoundingClientRect() : null;
    if (sr && cr && sr.width > 0 && cr.width > 0) {
      atStart = cr.left >= sr.left - 3;
      atEnd = cr.right <= sr.right + 3;
    }
    if (leftBtn && rightBtn && leftBtn !== rightBtn) {
      if (leftBtn.disabled) atStart = true;
      else if (leftBtn.disabled === false) atStart = false;
      if (rightBtn.disabled) atEnd = true;
      else if (rightBtn.disabled === false) atEnd = false;
    }
  }
  scroller.dataset.fxScrollStart = atStart ? 'true' : 'false';
  scroller.dataset.fxScrollEnd = atEnd ? 'true' : 'false';
}
function syncNativeScrollers() {
  if (stopped) return;
  document.querySelectorAll('.emby-scroller').forEach(scroller => {
    if (!scroller._fxScrollEdgesBound) {
      scroller._fxScrollEdgesBound = true;
      const refresh = () => updateNativeScrollerEdges(scroller);
      scroller.addEventListener('scroll', refresh, { passive: true });
      scroller.addEventListener('transitionend', refresh, { passive: true });
      const section = scroller.closest?.('.verticalSection, .detailVerticalSection, .emby-scroller-container') || scroller.parentElement;
      const btns = section?.querySelector?.('.emby-scrollbuttons');
      if (btns && !btns._fxScrollBtnsBound) {
        btns._fxScrollBtnsBound = true;
        btns.addEventListener('click', () => {
          setTimeout(refresh, 60);
          setTimeout(refresh, 260);
          setTimeout(refresh, 460);
        }, { passive: true });
      }
    }
    updateNativeScrollerEdges(scroller);
  });
}
function syncPlaybackStats() {
  if (stopped) return;
  document.querySelectorAll('.playerStats:not(.hide)').forEach(statsEl => {
    const body = statsEl.querySelector('.playerStats-stats');
    if (body && body.children.length > 0 && (body.textContent || '').trim().length > 0) return;
    const video = findActiveOsdVideo();
    if (!video) return;
    const poke = () => {
      if (stopped || !statsEl.isConnected || statsEl.classList.contains('hide')) return;
      const b = statsEl.querySelector('.playerStats-stats');
      if (b && b.children.length > 0 && (b.textContent || '').trim().length > 0) return;
      try {
        const Ev = typeof Event === 'function' ? Event : document.defaultView?.Event;
        if (Ev) video.dispatchEvent(new Ev('timeupdate', { bubbles: false }));
      } catch {}
    };
    poke();
    if (statsEl.dataset.fxStatsPoked !== 'true') {
      statsEl.dataset.fxStatsPoked = 'true';
      setTimeout(poke, 80);
      setTimeout(poke, 240);
      setTimeout(() => { delete statsEl.dataset.fxStatsPoked; }, 600);
    }
  });
}
function syncLoadingShimmers() {
  if (stopped) return;
  document.querySelectorAll('.cardScalable img, .cardImageContainer img').forEach(img => {
    if (img._fxShimmerBound) return;
    img._fxShimmerBound = true;
    const host = img.closest('.cardScalable') || img.parentElement;
    if (!host) return;
    if (img.complete && img.naturalWidth > 0) {
      host.removeAttribute('data-fx-img-loading');
      return;
    }
    host.setAttribute('data-fx-img-loading', 'true');
    const done = () => host.removeAttribute('data-fx-img-loading');
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });
}
function enhanceOsdSettingsMenu() {
  const osdOpen = isVideoOsdOpen();
  const osd = document.getElementById('videoOsdPage');
  if (osdOpen && osd) {
    const gearBtn = osd.querySelector('.btnVideoOsdSettings');
    if (gearBtn && !document.documentElement?.style?.getPropertyValue?.('--fx-osd-popup-bottom')) {
      updateOsdPopupAnchor(gearBtn);
    }
  }
  const audioBtn = osd?.querySelector?.('.btnAudio');
  const airPlayBtn = osd?.querySelector?.('.btnAirPlay');
  const favBtn = osd?.querySelector?.('.btnUserRating');
  const canAudio = Boolean(osdOpen && audioBtn && !audioBtn.classList.contains('hide') && !audioBtn.hidden && !audioBtn.disabled);
  const canAirPlay = Boolean(osdOpen && airPlayBtn && !airPlayBtn.classList.contains('hide') && !airPlayBtn.hidden && !airPlayBtn.disabled);
  const canFav = Boolean(osdOpen && favBtn && !favBtn.classList.contains('hide') && !favBtn.hidden && !favBtn.disabled);
  const portalPopups = [...document.querySelectorAll('.sleekfin-popup-layer .sleekfin-menu-popup')];
  const sheets = [...document.querySelectorAll('.dialog.actionSheet')];
  const freshHeaderAnchor = headerMenuAnchor && (Date.now() - headerMenuAnchor.at < 1500) ? headerMenuAnchor : null;
  const freshDetailMore = detailMoreAnchor && (Date.now() - detailMoreAnchor.at < 1500) ? detailMoreAnchor : null;

  const isHeaderMenuText = txt => /create\s+a\s+new\s+group|join\s+group|syncplay|play\s+on|my\s+device|cast\s+to/.test(txt);
  const resolveHeaderTrigger = (menuId, txt) => {
    if (freshHeaderAnchor?.el?.isConnected) return freshHeaderAnchor.el;
    if (menuId) {
      const byCtrl = document.querySelector(`button[aria-controls="${menuId}"]:not(.hide)`);
      if (byCtrl) return byCtrl;
    }
    if (menuId === 'app-sync-play-menu' || /create\s+a\s+new\s+group|join\s+group|syncplay/.test(txt)) {
      return document.querySelector('button[aria-controls="app-sync-play-menu"]:not(.hide), .headerSyncButton:not(.hide), .syncButton:not(.hide), .headerSyncPlayButton:not(.hide), .btnSyncPlay:not(.hide), button[title*="SyncPlay" i]:not(.hide), button[aria-label*="SyncPlay" i]:not(.hide)');
    }
    if (menuId === 'app-remote-play-menu' || /play\s+on|my\s+device|cast/.test(txt)) {
      return document.querySelector('button[aria-controls="app-remote-play-menu"]:not(.hide), .headerCastButton:not(.hide), .castButton:not(.hide), button[title*="Cast" i]:not(.hide), button[aria-label*="Cast" i]:not(.hide)');
    }
    return null;
  };

  // 0. Modern React MUI SyncPlay (#app-sync-play-menu) & Cast (#app-remote-play-menu) Popovers -> anchor right below their trigger button!
  let hasActiveHeaderPopover = false;
  document.querySelectorAll('#app-sync-play-menu, #app-remote-play-menu, .MuiPopover-root:not([aria-hidden="true"]):not(.MuiModal-hidden)').forEach(pop => {
    const isHidden = pop.getAttribute('aria-hidden') === 'true' || pop.classList.contains('MuiModal-hidden');
    if (isHidden) return;
    const isKnownHeaderMenu = pop.id === 'app-sync-play-menu' || pop.id === 'app-remote-play-menu';
    const txt = (pop.textContent || '').toLowerCase();
    if (!isKnownHeaderMenu && !isHeaderMenuText(txt)) return;
    hasActiveHeaderPopover = true;
    const trig = resolveHeaderTrigger(pop.id, txt);
    if (trig) updateHeaderPopupAnchor(trig);
    if (osdOpen) document.documentElement?.setAttribute?.('data-fx-osd-anchor', 'top');
    const paper = pop.querySelector('.MuiPopover-paper');
    const innerPopup = pop.querySelector('.sleekfin-menu-popup');
    if (paper && !paper.classList.contains('sleekfin-menu-host')) paper.dataset.fxHeaderAnchored = 'true';
    if (innerPopup) innerPopup.dataset.fxHeaderAnchored = 'true';
  });

  for (const sheet of sheets) {
    if (sheet.classList.contains('sleekfin-menu-closing')) continue;
    const scroller = sheet.querySelector('.actionSheetScroller');
    const sleekPopup = sheet.querySelector('.sleekfin-menu-popup') || portalPopups.find(p => {
      const txt = (p.textContent || '').toLowerCase();
      return /quality|playback\s*speed|aspect\s*ratio|playback\s*data|stats\s*for\s*nerds|subtitle\s*offset|create\s+a\s+new\s+group|play\s+on|add\s+to\s+collection/.test(txt);
    }) || null;
    const rawItems = scroller ? [...scroller.querySelectorAll('.actionSheetMenuItem, button[data-id]')] : [];
    const popupItems = sleekPopup ? [...sleekPopup.querySelectorAll('.sleekfin-menu-item')] : [];
    const inspectItems = rawItems.length ? rawItems : popupItems;
    const fullText = (sleekPopup?.textContent || sheet.textContent || '').toLowerCase();

    // 1. SyncPlay / Cast to Device popup -> anchor directly below its header button!
    if (freshHeaderAnchor || isHeaderMenuText(fullText)) {
      hasActiveHeaderPopover = true;
      const trig = resolveHeaderTrigger('', fullText);
      if (trig) updateHeaderPopupAnchor(trig);
      if (osdOpen) document.documentElement?.setAttribute?.('data-fx-osd-anchor', 'top');
      sheet.dataset.fxHeaderAnchored = 'true';
      if (sleekPopup) sleekPopup.dataset.fxHeaderAnchored = 'true';
      continue;
    }

    // 2. Detail page three-dots (...) menu -> smart strictly-clamped placement using the VISIBLE #itemDetailPage
    const detailPage = !osdOpen ? getVisibleDetailPage() : null;
    const looksLikeDetailMore = Boolean(freshDetailMore) || /edit\s+metadata|media\s+info|refresh\s+metadata|add\s+to\s+collection|add\s+to\s+playlist|copy\s+stream|delete\s+media|identify/.test(fullText);
    if (detailPage && looksLikeDetailMore) {
      const moreAnchor = resolveLiveDetailMoreAnchor(detailPage);
      const targetPopup = sleekPopup || (!sheet.classList.contains('sleekfin-menu-host') ? sheet : null);
      if (targetPopup && moreAnchor) {
        const curRowCount = targetPopup.querySelectorAll?.('.sleekfin-menu-item, .actionSheetMenuItem')?.length || 0;
        const curVw = window.innerWidth || document.documentElement?.clientWidth || 1280;
        const curVh = window.innerHeight || document.documentElement?.clientHeight || 720;
        const curSize = `${curVw}x${curVh}:${Math.round(targetPopup.offsetWidth || 0)}x${Math.round(targetPopup.scrollHeight || targetPopup.offsetHeight || 0)}`;
        if (targetPopup.dataset.fxDetailMore !== 'true' || Number(targetPopup.dataset.fxDetailMoreRows || -1) !== curRowCount || targetPopup.dataset.fxDetailMoreSize !== curSize) {
          positionDetailMoreMenu(targetPopup, moreAnchor);
        }
      }
      continue;
    }

    if (!osdOpen || !inspectItems.length) continue;
    const labels = inspectItems.map(i => (i.textContent || '').trim().toLowerCase());
    const ids = rawItems.map(i => (i.getAttribute('data-id') || '').toLowerCase());
    const looksLikeSettings =
      ids.some(id => ['quality', 'playbackrate', 'aspectratio', 'stats', 'subtitleoffset', 'repeatmode', 'videostretch'].includes(id)) ||
      labels.some(l => /quality|playback\s*speed|aspect\s*ratio|playback\s*data|stats\s*for\s*nerds|subtitle\s*offset/i.test(l));
    if (!hasActiveHeaderPopover) document.documentElement?.setAttribute?.('data-fx-osd-anchor', 'bottom');
    sheet.dataset.fxOsdPopup = 'true';
    if (sleekPopup) sleekPopup.dataset.fxOsdPopup = 'true';
    if (!looksLikeSettings) continue;
    sheet.dataset.fxOsdSettings = 'true';
    if (sleekPopup) sleekPopup.dataset.fxOsdSettings = 'true';
    const isFav = Boolean(favBtn && (favBtn.getAttribute('data-isfavorite') === 'true' || favBtn.classList.contains('ratingbutton-withrating')));
    const closeSheet = () => {
      const bd = sheet.closest('.dialogContainer')?.previousElementSibling;
      if (bd?.classList?.contains('dialogBackdrop')) {
        try { bd.click(); } catch {}
      } else {
        try {
          const Ev = typeof KeyboardEvent === 'function' ? KeyboardEvent : document.defaultView?.KeyboardEvent;
          if (Ev) document.dispatchEvent(new Ev('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
        } catch {}
      }
    };
    const triggerAudio = () => {
      closeSheet();
      setTimeout(() => { try { audioBtn?.click(); } catch {} }, 45);
    };
    const triggerAirPlay = () => {
      // Invoke AirPlay synchronously inside the click gesture so Safari/WebKit allows webkitShowPlaybackTargetPicker()
      closeSheet();
      try { airPlayBtn?.click(); } catch {}
    };
    const triggerFav = () => {
      closeSheet();
      setTimeout(() => {
        try { favBtn?.click(); } catch {}
        showToast(isFav ? 'Removed from Favorites' : 'Added to Favorites');
      }, 30);
    };
    if (scroller && sheet.dataset.fxOsdEnhanced !== 'true') {
      sheet.dataset.fxOsdEnhanced = 'true';
      const makeActionItem = (id, iconName, labelText, onClick) => {
        const btn = element('button', 'listItem listItem-button actionSheetMenuItem emby-button');
        btn.type = 'button';
        btn.setAttribute('data-id', id);
        btn.dataset.fxOsdMenuItem = id;
        const ic = element('span', `actionsheetMenuItemIcon listItemIcon listItemIcon-transparent material-icons ${iconName}`);
        ic.setAttribute('aria-hidden', 'true');
        const body = element('div', 'listItemBody actionsheetListItemBody');
        body.append(element('div', 'listItemBodyText actionSheetItemText', labelText));
        btn.append(ic, body);
        btn.addEventListener('click', ev => {
          ev.preventDefault();
          ev.stopImmediatePropagation?.();
          ev.stopPropagation();
          onClick();
        });
        return btn;
      };
      if (canAudio && !scroller.querySelector('[data-fx-osd-menu-item="fx-osd-audio"]')) {
        scroller.append(makeActionItem('fx-osd-audio', 'audiotrack', 'Audio', triggerAudio));
      }
      if (canAirPlay && !scroller.querySelector('[data-fx-osd-menu-item="fx-osd-airplay"]')) {
        scroller.append(makeActionItem('fx-osd-airplay', 'airplay', 'AirPlay', triggerAirPlay));
      }
      if (canFav && !scroller.querySelector('[data-fx-osd-menu-item="fx-osd-favorite"]')) {
        scroller.append(makeActionItem('fx-osd-favorite', isFav ? 'favorite' : 'favorite_border', isFav ? 'Remove from Favorites' : 'Add to Favorites', triggerFav));
      }
    }
    if (sleekPopup) {
      const popupLabels = new Set([...sleekPopup.querySelectorAll('.sleekfin-menu-item')].map(el => (el.textContent || '').trim().toLowerCase()));
      const makeSleekItem = (id, iconName, labelText, onClick) => {
        const btn = element('button', 'sleekfin-menu-item');
        btn.type = 'button';
        btn.setAttribute('role', 'menuitem');
        btn.dataset.fxOsdMenuItem = id;
        const icWrap = element('span', 'sleekfin-menu-icon');
        icWrap.setAttribute('aria-hidden', 'true');
        const ic = element('span', `material-icons ${iconName}`);
        icWrap.append(ic);
        const copy = element('div', 'sleekfin-menu-copy');
        copy.append(element('div', 'sleekfin-menu-primary', labelText));
        btn.append(icWrap, copy);
        btn.addEventListener('click', ev => {
          ev.preventDefault();
          ev.stopImmediatePropagation?.();
          ev.stopPropagation();
          onClick();
        });
        return btn;
      };
      if (canAudio && !popupLabels.has('audio') && !sleekPopup.querySelector('[data-fx-osd-menu-item="fx-osd-audio"]')) {
        sleekPopup.append(makeSleekItem('fx-osd-audio', 'audiotrack', 'Audio', triggerAudio));
      }
      if (canAirPlay && !popupLabels.has('airplay') && !sleekPopup.querySelector('[data-fx-osd-menu-item="fx-osd-airplay"]')) {
        sleekPopup.append(makeSleekItem('fx-osd-airplay', 'airplay', 'AirPlay', triggerAirPlay));
      }
      const favLabel = isFav ? 'Remove from Favorites' : 'Add to Favorites';
      if (canFav && !popupLabels.has('add to favorites') && !popupLabels.has('remove from favorites') && !sleekPopup.querySelector('[data-fx-osd-menu-item="fx-osd-favorite"]')) {
        sleekPopup.append(makeSleekItem('fx-osd-favorite', isFav ? 'favorite' : 'favorite_border', favLabel, triggerFav));
      }
    }
  }

  // Handle portal popups rendered directly inside .sleekfin-popup-layer (e.g. three-dots menu or SyncPlay/Cast cloned by SleekFin)
  for (const popup of portalPopups) {
    if (popup.closest('.sleekfin-menu-closing')) continue;
    const txt = (popup.textContent || '').toLowerCase();
    if (freshHeaderAnchor || isHeaderMenuText(txt)) {
      const trig = resolveHeaderTrigger('', txt);
      if (trig) updateHeaderPopupAnchor(trig);
      if (osdOpen) document.documentElement?.setAttribute?.('data-fx-osd-anchor', 'top');
      popup.dataset.fxHeaderAnchored = 'true';
    } else if (!osdOpen) {
      const detailPage = getVisibleDetailPage();
      const looksLikeDetailMore = Boolean(freshDetailMore) || /edit\s+metadata|media\s+info|refresh\s+metadata|add\s+to\s+collection|add\s+to\s+playlist|copy\s+stream|delete\s+media|identify/.test(txt);
      if (detailPage && looksLikeDetailMore) {
        const moreAnchor = resolveLiveDetailMoreAnchor(detailPage);
        if (moreAnchor) {
          const curRowCount = popup.querySelectorAll?.('.sleekfin-menu-item, .actionSheetMenuItem')?.length || 0;
          if (popup.dataset.fxDetailMore !== 'true' || Number(popup.dataset.fxDetailMoreRows || -1) !== curRowCount) {
            positionDetailMoreMenu(popup, moreAnchor);
          }
        }
      }
    }
  }
}
function anchorOpenPopovers() {
  hideSleekFinUserSettingsMenu();
  guardStuckClosingMenus();
  enhanceOsdSettingsMenu();
  syncOriginModals();
  syncPlaybackStats();
  syncLoadingShimmers();
  syncNativeScrollers();
  const scrollY = Math.round(window.scrollY ?? window.pageYOffset ?? document.documentElement?.scrollTop ?? 0);
  const scrollX = Math.round(window.scrollX ?? window.pageXOffset ?? document.documentElement?.scrollLeft ?? 0);
  let hasOpenPopover = false;
  document.querySelectorAll('.MuiPopover-root').forEach(pop => {
    const isHidden = pop.getAttribute('aria-hidden') === 'true' || pop.classList.contains('MuiModal-hidden');
    if (isHidden) {
      delete pop.dataset.fxAnchoredOpen;
      return;
    }
    hasOpenPopover = true;
    if (pop.dataset.fxAnchoredOpen !== 'true') {
      pop.dataset.fxAnchoredOpen = 'true';
      pop.style?.setProperty?.('--fx-popover-scroll-y', `${scrollY}px`);
      pop.style?.setProperty?.('--fx-popover-scroll-x', `${scrollX}px`);
    }
    if (pop.id === 'filter-popover' || pop.querySelector('#filtersYears-content, #filtersGenres-header')) {
      enhanceFilterPopover(pop);
    }
  });
  const hasOpenDialog = Boolean(document.querySelector('.MuiDialog-root:not([aria-hidden="true"])'));
  setRootAttr('data-fx-popover-open', hasOpenPopover && !hasOpenDialog);
  document.querySelectorAll('.sleekfin-popup-layer').forEach(layer => {
    if (layer.querySelector('[data-fx-detail-more="true"], [data-fx-header-anchored="true"]')) return;
    if (layer.dataset.fxAnchored !== 'true') {
      layer.dataset.fxAnchored = 'true';
      layer.style?.setProperty?.('--fx-popover-scroll-y', `${scrollY}px`);
      layer.style?.setProperty?.('--fx-popover-scroll-x', `${scrollX}px`);
    }
  });
  document.querySelectorAll('.sleekfin-details-dropdown-menu').forEach(dd => {
    if (dd.dataset.fxAnchored !== 'true' && !dd.closest('#itemDetailPage[style*="fixed"]')) {
      dd.dataset.fxAnchored = 'true';
      const rawTop = parseFloat(dd.style?.top || '');
      const rawLeft = parseFloat(dd.style?.left || '');
      if (Number.isFinite(rawTop)) dd.style.top = `${Math.round(rawTop + scrollY)}px`;
      if (Number.isFinite(rawLeft)) dd.style.left = `${Math.round(rawLeft + scrollX)}px`;
    }
  });
}
function schedulePopoverSync() {
  if (popoverFrame || stopped) return;
  const run = () => {
    popoverFrame = 0;
    if (stopped) return;
    anchorOpenPopovers();
    syncDocumentStateAttrs();
    syncHeroAndDetailRatings(window.ApiClient);
  };
  if (typeof requestAnimationFrame === 'function') popoverFrame = requestAnimationFrame(run);
  else popoverFrame = setTimeout(run, 16);
}
function ensureSearchTracking(api, invItems) {
  if (!api?.getCurrentUserId?.() || !Array.isArray(invItems) || !invItems.length) return Promise.resolve(new Map());
  const sc = scopeKey(api);
  if (searchUiState.tracking instanceof Map && searchUiState.trackingScope === sc && searchUiState.tracking.size > 0) {
    return Promise.resolve(searchUiState.tracking);
  }
  const cached = readTrackingCache(sc);
  if (cached.size > 0) {
    searchUiState.tracking = cached;
    searchUiState.trackingScope = sc;
    return Promise.resolve(cached);
  }
  if (searchTrackInflight) return searchTrackInflight;
  const client = new JellyfinClient(api, () => !stopped);
  searchTrackInflight = client.tracking(invItems).then(res => {
    searchTrackInflight = null;
    const map = res?.records instanceof Map ? res.records : new Map();
    if (res?.ready) writeTrackingCache(sc, map);
    searchUiState.tracking = map;
    searchUiState.trackingScope = sc;
    return map;
  }).catch(() => {
    searchTrackInflight = null;
    return new Map();
  });
  return searchTrackInflight;
}
function disconnectSearchBatchObserver() {
  if (searchUiState.batchIo) {
    try { searchUiState.batchIo.disconnect(); } catch {}
    searchUiState.batchIo = null;
  }
}
function renderSearchLibraryResults(searchPage, api, queryText, inv) {
  if (!searchPage?.isConnected) return;
  let host = searchPage.querySelector('.fx-search-library');
  if (!host) {
    host = element('section', 'fx-search-library');
    const fields = searchPage.querySelector('.searchFields');
    if (fields && fields.parentElement === searchPage) fields.after(host);
    else searchPage.append(host);
  }
  host.hidden = false;
  const cfg = (() => { try { return state?.config || readConfig(api) || DEFAULT_CONFIG; } catch { return DEFAULT_CONFIG; } })();
  const invItems = inv?.items || [];
  const extraItems = searchUiState.remoteQuery === queryText ? searchUiState.remoteItems : [];
  const ranked = searchAndRankInventory(invItems, queryText, cfg, extraItems);
  const sc = scopeKey(api);
  const trackingMap = state?.tracking instanceof Map && state.tracking.size
    ? state.tracking
    : (searchUiState.trackingScope === sc && searchUiState.tracking instanceof Map ? searchUiState.tracking : readTrackingCache(sc));
  const nowDate = new Date();
  const badgesMap = inv?.seasons ? seasonBadges(inv.seasons, nowDate) : new Map();
  const sig = `${sc}:${queryText}:${invItems.length}:${extraItems.length}:${trackingMap.size}:${ranked.length}:${ranked.slice(0, 24).map(i => i.Id).join(',')}`;
  if (searchUiState.lastSignature === sig && host.querySelector('.fx-search-library-head')) return;
  searchUiState.lastSignature = sig;
  disconnectSearchBatchObserver();

  const head = element('div', 'fx-search-library-head');
  const titleH1 = element('h1', 'fx-search-library-title', `Results for "${queryText}"`);
  head.append(titleH1);
  if (!inv && !extraItems.length) {
    const loadingP = element('p', 'fx-search-library-empty', 'Searching library…');
    host.replaceChildren(head, loadingP);
    return;
  }
  const countBadge = element('span', 'fx-subpage-count', String(ranked.length));
  head.append(countBadge);
  if (!ranked.length) {
    const emptyP = element('p', 'fx-search-library-empty', `No movies or shows matched "${queryText}".`);
    host.replaceChildren(head, emptyP);
    return;
  }
  const cardCtx = {
    api,
    now: nowDate,
    badges: badgesMap,
    tracking: trackingMap,
    inventory: inv || { items: ranked },
    slots: []
  };
  const grid = element('div', 'fx-search-library-grid');
  const BATCH_SIZE = 48;
  searchUiState.ranked = ranked;
  searchUiState.renderedCount = 0;
  const appendNextBatch = () => {
    const startIdx = searchUiState.renderedCount;
    if (startIdx >= ranked.length) return;
    const endIdx = Math.min(ranked.length, startIdx + BATCH_SIZE);
    const frag = document.createDocumentFragment();
    for (let i = startIdx; i < endIdx; i++) {
      frag.append(renderCard(ranked[i], cardCtx, false, 'portrait'));
    }
    grid.append(frag);
    searchUiState.renderedCount = endIdx;
    if (endIdx >= ranked.length) {
      disconnectSearchBatchObserver();
      sentinel?.remove();
    }
  };
  let sentinel = null;
  appendNextBatch();
  if (searchUiState.renderedCount < ranked.length) {
    sentinel = element('div', 'fx-search-sentinel');
    sentinel.setAttribute('aria-hidden', 'true');
    host.replaceChildren(head, grid, sentinel);
    if (typeof IntersectionObserver === 'function') {
      searchUiState.batchIo = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) appendNextBatch();
      }, { rootMargin: '600px 0px' });
      searchUiState.batchIo.observe(sentinel);
    } else {
      appendNextBatch();
    }
  } else {
    host.replaceChildren(head, grid);
  }
}
function syncSearchPage(api = window.ApiClient) {
  const searchPage = document.getElementById('searchPage');
  if (!searchPage || !visible(searchPage) || !api?.getCurrentUserId?.()) {
    clearTimeout(searchUiState.remoteTimer);
    clearTimeout(searchUiState.inputTimer);
    disconnectSearchBatchObserver();
    return;
  }
  const inp = searchPage.querySelector('#searchTextInput, input.searchfields-txtSearch, .searchFieldsInner input, input[type="search"], input[type="text"]');
  if (inp && !inp._fxSearchBound) {
    inp._fxSearchBound = true;
    const onInputDebounced = () => {
      clearTimeout(searchUiState.inputTimer);
      const val = String(inp.value || '').trim();
      if (!val) {
        syncSearchPage(window.ApiClient || api);
        return;
      }
      searchUiState.inputTimer = setTimeout(() => {
        syncSearchPage(window.ApiClient || api);
      }, 110);
    };
    const onInputImmediate = () => {
      clearTimeout(searchUiState.inputTimer);
      syncSearchPage(window.ApiClient || api);
    };
    inp.addEventListener('input', onInputDebounced);
    inp.addEventListener('search', onInputImmediate);
    inp.addEventListener('change', onInputImmediate);
  }
  const urlQuery = new URLSearchParams(String(location.hash || '').split('?')[1] || '').get('query') || '';
  const queryText = String(inp ? inp.value : urlQuery).trim();
  if (!queryText) {
    clearTimeout(searchUiState.remoteTimer);
    clearTimeout(searchUiState.inputTimer);
    disconnectSearchBatchObserver();
    searchUiState.query = '';
    searchUiState.lastSignature = '';
    searchPage.removeAttribute('data-fx-search-active');
    const host = searchPage.querySelector('.fx-search-library');
    if (host) host.hidden = true;
    return;
  }
  if (searchPage.getAttribute('data-fx-search-active') !== 'true') {
    searchPage.setAttribute('data-fx-search-active', 'true');
  }
  const sc = scopeKey(api);
  const cachedSnap = snapshots.get(`${sc}:home:`)?.value || null;
  if (searchUiState.query !== queryText) {
    searchUiState.query = queryText;
    searchUiState.lastSignature = '';
    clearTimeout(searchUiState.remoteTimer);
    const reqToken = ++searchUiState.token;
    if (typeof api.getItems === 'function') {
      searchUiState.remoteTimer = setTimeout(() => {
        const uid = api.getCurrentUserId?.();
        if (!uid || stopped || searchUiState.token !== reqToken) return;
        Promise.resolve(api.getItems(uid, {
          searchTerm: queryText,
          Recursive: true,
          IncludeItemTypes: 'Movie,Series',
          Limit: 100,
          Fields: 'Genres,Tags,People,Studios,DateCreated,ParentId,PrimaryImageAspectRatio,ProviderIds',
          EnableImages: true,
          EnableUserData: true,
          ImageTypeLimit: 1,
          EnableImageTypes: 'Primary,Backdrop,Thumb'
        })).then(res => {
          if (stopped || searchUiState.token !== reqToken || searchUiState.query !== queryText) return;
          searchUiState.remoteQuery = queryText;
          searchUiState.remoteItems = Array.isArray(res?.Items) ? res.Items.filter(it => ['Movie', 'Series'].includes(it?.Type) && !isLeavingSoonItem(it)) : [];
          renderSearchLibraryResults(searchPage, api, queryText, snapshots.get(`${sc}:home:`)?.value || null);
        }).catch(() => {});
      }, 220);
    }
  }
  renderSearchLibraryResults(searchPage, api, queryText, cachedSnap);
  if (!cachedSnap) {
    ensureSearchInventory(api).then(inv => {
      if (stopped || !inv || searchUiState.query !== queryText) return;
      renderSearchLibraryResults(searchPage, api, queryText, inv);
      ensureSearchTracking(api, inv.items).then(() => {
        if (!stopped && searchUiState.query === queryText) {
          renderSearchLibraryResults(searchPage, api, queryText, inv);
        }
      });
    });
  } else if (!(searchUiState.tracking instanceof Map && searchUiState.trackingScope === sc)) {
    ensureSearchTracking(api, cachedSnap.items).then(() => {
      if (!stopped && searchUiState.query === queryText) {
        renderSearchLibraryResults(searchPage, api, queryText, cachedSnap);
      }
    });
  }
}
function findWebpackExports(req, fastId, matcher) {
  if (fastId !== null && req.m?.[fastId]) {
    try {
      const mod = req(fastId);
      const hit = matcher(mod);
      if (hit) return hit;
    } catch {}
  }
  const cache = req.c;
  if (!cache || typeof cache !== 'object') return null;
  for (const id of Object.keys(cache)) {
    const exp = cache[id]?.exports;
    if (!exp || typeof exp !== 'object') continue;
    try {
      const hit = matcher(exp);
      if (hit) return hit;
    } catch {}
  }
  return null;
}
function applyWebpackViewPatch(req) {
  if (!req?.m && !req?.c) return;
  try {
    const list = findWebpackExports(req, 57826, exp => {
      for (const v of Object.values(exp)) {
        if (Array.isArray(v) && v.some(x => x?.path === '/movies' && Array.isArray(x?.views)) && v.some(x => x?.path === '/tv' && Array.isArray(x?.views))) {
          return v;
        }
      }
      return null;
    });
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
    const map = findWebpackExports(req, 95753, exp => {
      for (const v of Object.values(exp)) {
        if (v && typeof v === 'object' && ((v.movies && typeof v.movies === 'object') || (v.tvshows && typeof v.tvshows === 'object')) && (
          v.movies?.[0]?.collectionType === 'movies' ||
          v.movies?.[1]?.viewType === 'suggestions' ||
          v.tvshows?.[0]?.collectionType === 'tvshows' ||
          v.tvshows?.[1]?.viewType === 'suggestions' ||
          Boolean(v.movies && v.tvshows)
        )) {
          return v;
        }
      }
      return null;
    });
    if (map) {
      if (map?.movies) {
        const emptySuggestions = { suggestionSections: [], isMovieRecommendations: false };
        map.movies[1] = {
          viewType: 'suggestions',
          collectionType: 'movies',
          sectionsView: emptySuggestions,
          itemType: [],
          isPaginationEnabled: false,
          isBtnPlayAllEnabled: false,
          isBtnShuffleEnabled: false,
          isBtnFilterEnabled: false,
          isBtnGridListEnabled: false,
          isBtnSortEnabled: false,
          isAlphabetPickerEnabled: false,
          isAlphaPickerEnabled: false
        };
        map.movies[4] = {
          viewType: 'suggestions',
          collectionType: 'movies',
          sectionsView: emptySuggestions,
          itemType: [],
          isPaginationEnabled: false,
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
        const emptyTvSuggestions = { suggestionSections: [], isMovieRecommendations: false };
        map.tvshows[1] = {
          viewType: 'suggestions',
          collectionType: 'tvshows',
          sectionsView: emptyTvSuggestions,
          itemType: [],
          isPaginationEnabled: false,
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
          viewType: 'suggestions',
          collectionType: 'tvshows',
          sectionsView: emptyTvSuggestions,
          itemType: [],
          isPaginationEnabled: false,
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
          const react = (() => { try { return wreq(63696); } catch { return wreq(96540); } })();
          const router = (() => { try { return wreq(9055); } catch { return wreq(96303); } })();
          const useSearchParamsFn = router?.useSearchParams || router?.ok;
          if (react?.useState && typeof useSearchParamsFn === 'function') {
            const safeUseSearchParam = function(paramKey, defaultValue = '') {
              const [searchParams, setSearchParams] = useSearchParamsFn();
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
  } catch {}
}
function patchLibraryViews() {
  const chunks = window.webpackChunk;
  if (!chunks || typeof chunks.push !== 'function') {
    if (window._fxWebpackReq) applyWebpackViewPatch(window._fxWebpackReq);
    return;
  }
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
function patchApiClientLeavingSoon(api) {
  if (!api || typeof api !== 'object' || api._fxLeavingPatched) return;
  try { api._fxLeavingPatched = true; } catch { return; }
  const isDashboard = () => /^#!?\/?(?:dashboard|configurationpage)/i.test(String(location.hash || ''));
  const rememberViews = items => {
    if (!Array.isArray(items)) return;
    const uid = api.getCurrentUserId?.();
    for (const v of items) {
      const gid = normalizeGuid(v?.Id);
      if (/leaving\s+soon/i.test(String(v?.Name || '')) || (gid && leavingSoonState.viewIds.has(gid))) {
        if (gid) leavingSoonState.viewIds.add(gid);
        if (gid && uid && !leavingSoonState.loadedViews.has(gid) && typeof origGetItems === 'function') {
          leavingSoonState.loadedViews.add(gid);
          Promise.resolve(origGetItems(uid, { ParentId: v.Id, Recursive: true, IncludeItemTypes: 'Movie,Series', Limit: 500 }))
            .then(res => {
              for (const it of res?.Items || []) {
                const iid = normalizeGuid(it?.Id);
                if (iid) leavingSoonState.itemIds.add(iid);
              }
            })
            .catch(() => {});
        }
      }
    }
  };
  const origGetItems = typeof api.getItems === 'function' ? api.getItems.bind(api) : null;
  if (typeof api.getUserViews === 'function') {
    const origViews = api.getUserViews.bind(api);
    api.getUserViews = function(...args) {
      return Promise.resolve(origViews(...args)).then(res => {
        if (res && Array.isArray(res.Items)) {
          rememberViews(res.Items);
          if (!isDashboard()) {
            const filtered = res.Items.filter(v => !isLeavingSoonItem(v));
            if (filtered.length !== res.Items.length) {
              return { ...res, Items: filtered, TotalRecordCount: filtered.length };
            }
          }
        }
        return res;
      });
    };
  }
  if (origGetItems) {
    api.getItems = function(userId, options, ...rest) {
      return Promise.resolve(origGetItems(userId, options, ...rest)).then(res => {
        if (!res || !Array.isArray(res.Items) || isDashboard()) return res;
        const requestedParent = normalizeGuid(options?.ParentId);
        if (requestedParent && leavingSoonState.viewIds.has(requestedParent)) return res;
        if (!leavingSoonState.viewIds.size && !leavingSoonState.itemIds.size) return res;
        const filtered = res.Items.filter(it => !isLeavingSoonItem(it));
        if (filtered.length !== res.Items.length) {
          return { ...res, Items: filtered, TotalRecordCount: Math.max(0, (res.TotalRecordCount ?? res.Items.length) - (res.Items.length - filtered.length)) };
        }
        return res;
      });
    };
  }
}
function hideLeavingSoonNav() {
  if (window.ApiClient) patchApiClientLeavingSoon(window.ApiClient);
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
  document.querySelectorAll('#indexPage .card, #indexPage .verticalSection, #homeScreenPreferencesPage .viewItem, #homeScreenPreferencesPage .checkboxList > *, #homeScreenPreferencesPage .folderList > *, #homeScreenPreferencesPage .listItem, #homeScreenPreferencesPage label, #userProfilePage .folderAccessListContainer label, #userProfilePage .checkboxList > *').forEach(node => {
    if (node.classList?.contains('verticalSection')) {
      const heading = node.querySelector('h2, .sectionTitle')?.textContent || '';
      if (!/leaving\s+soon/i.test(heading)) return;
    } else {
      const idAttr = normalizeGuid(node.getAttribute('data-id') || node.getAttribute('data-itemid') || '');
      const text = (node.getAttribute('aria-label') || node.getAttribute('title') || node.textContent || '').trim();
      const matchedId = idAttr && (leavingSoonState.viewIds.has(idAttr) || leavingSoonState.itemIds.has(idAttr));
      if (!matchedId && !/leaving\s+soon/i.test(text)) return;
    }
    if (node.getAttribute('data-fx-leaving-hidden') !== 'true') {
      node.setAttribute('data-fx-leaving-hidden', 'true');
      node.style.display = 'none';
    }
  });
  if (changed && typeof Event === 'function') {
    const fire = () => { try { window.dispatchEvent?.(new Event('resize')); } catch {} };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(fire);
    else setTimeout(fire, 0);
  }
}
const SETTINGS_GEAR_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
const MOBILE_SEARCH_SVG = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7.5"></circle><line x1="20.5" y1="20.5" x2="16.35" y2="16.35"></line></svg>';
function syncMobileHeaderControls(api = window.ApiClient) {
  const proxy = document.querySelector('[data-sleekfin-header-proxy]');
  if (proxy) {
    if (!api?.getCurrentUserId?.()) {
      proxy.querySelectorAll('[data-fx-mobile-search]').forEach(n => n.remove());
    } else {
      const overflowToggle = proxy.querySelector('[data-sleekfin-header-overflow-toggle]');
      const nativeSearch = proxy.querySelector('button[data-sleekfin-header-proxy-item="jellyfin:search"]');
      const nativeSearchVisible = Boolean(
        nativeSearch &&
        nativeSearch.getAttribute('data-sleekfin-header-overflowed') !== 'true' &&
        nativeSearch.style.display !== 'none'
      );
      const overflowHidden = !overflowToggle || overflowToggle.getAttribute('data-sleekfin-header-overflow-hidden') === 'true';
      const isPhoneHeader = Boolean(window.matchMedia?.('(max-width: 599px), ((max-width: 899px) and (hover: none) and (pointer: coarse))')?.matches);
      const needMobileSearch = Boolean(overflowToggle && !nativeSearchVisible && (!overflowHidden || isPhoneHeader));
      let mobileSearchBtn = proxy.querySelector('[data-fx-mobile-search="true"]');
      if (!needMobileSearch) {
        if (mobileSearchBtn) mobileSearchBtn.remove();
      } else {
        let createdSearch = false;
        if (!mobileSearchBtn) {
          mobileSearchBtn = element('button', 'fx-mobile-search-btn');
          mobileSearchBtn.type = 'button';
          mobileSearchBtn.dataset.fxMobileSearch = 'true';
          mobileSearchBtn.title = 'Search';
          mobileSearchBtn.setAttribute('aria-label', 'Search');
          mobileSearchBtn.innerHTML = MOBILE_SEARCH_SVG;
          createdSearch = true;
        }
        if (mobileSearchBtn.nextElementSibling !== overflowToggle) {
          proxy.insertBefore(mobileSearchBtn, overflowToggle);
        }
        if (createdSearch && typeof Event === 'function') {
          const notifyResize = () => { try { window.dispatchEvent?.(new Event('resize')); } catch {} };
          if (typeof requestAnimationFrame === 'function') requestAnimationFrame(notifyResize);
          else setTimeout(notifyResize, 0);
        }
        const isSearchRoute = /^#!?\/?search(?:\.html)?(?:[?]|$)/i.test(String(location.hash || ''));
        if (isSearchRoute) {
          mobileSearchBtn.setAttribute('aria-current', 'page');
          mobileSearchBtn.dataset.sleekfinCurrent = 'true';
        } else {
          mobileSearchBtn.removeAttribute('aria-current');
          delete mobileSearchBtn.dataset.sleekfinCurrent;
        }
      }
    }
  }
  const detailActions = document.querySelector('#itemDetailPage:not(.hide) .mainDetailButtons.sleekfin-details-actions');
  if (detailActions && !detailActions.querySelector('.sleekfin-details-action-spacer')) {
    const sp = element('span', 'sleekfin-details-action-spacer');
    sp.setAttribute('aria-hidden', 'true');
    detailActions.append(sp);
  }
  const drawer = document.querySelector('[data-sleekfin-header-overflow-drawer]');
  if (!drawer) return;
  if (!api?.getCurrentUserId?.()) {
    drawer.querySelectorAll('[data-fx-overflow-settings]').forEach(n => n.remove());
    return;
  }
  const existingItems = [...drawer.querySelectorAll('button[data-sleekfin-header-overflow-item], a[data-sleekfin-header-overflow-item]')];
  if (!existingItems.length) return;
  const listHost = existingItems[0].parentElement;
  if (!listHost) return;
  const isSettingsActive = /^#!?\/?mypreferences/i.test(String(location.hash || ''));
  let settingsBtn = drawer.querySelector('[data-fx-overflow-settings="true"]');
  if (!settingsBtn) {
    const sample = existingItems.find(b => (b.getAttribute('data-sleekfin-header-overflow-item') || '') !== 'jellyfin:user-menu') || existingItems[0];
    settingsBtn = element('button', sample?.className || '');
    settingsBtn.type = 'button';
    settingsBtn.dataset.fxOverflowSettings = 'true';
    settingsBtn.setAttribute('data-sleekfin-header-overflow-item', 'fx:settings');
    settingsBtn.setAttribute('data-sleekfin-header-overflow-full', 'true');
    settingsBtn.title = 'Settings';
    settingsBtn.setAttribute('aria-label', 'Settings');
    const vis = element('span');
    vis.dataset.sleekfinHeaderOverflowVisual = 'true';
    const icon = element('span', 'fx-overflow-svg-icon');
    icon.dataset.sleekfinHeaderSourceIcon = 'true';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = SETTINGS_GEAR_SVG;
    const lbl = element('span', '', 'Settings');
    lbl.dataset.sleekfinHeaderSourceLabel = 'true';
    vis.append(icon);
    settingsBtn.append(vis, lbl);
    settingsBtn.addEventListener('click', ev => {
      ev.preventDefault();
      ev.stopPropagation();
      closeDrawers();
      scrollToTop();
      location.hash = '#/mypreferencesmenu';
      schedule();
    });
    const beforeAnchor = listHost.querySelector('[data-sleekfin-header-overflow-item="jellyfin:search"], [data-sleekfin-header-overflow-item="jellyfin:user-menu"]');
    if (beforeAnchor && beforeAnchor.parentElement === listHost) listHost.insertBefore(settingsBtn, beforeAnchor);
    else listHost.append(settingsBtn);
  }
  if (isSettingsActive) {
    settingsBtn.setAttribute('aria-current', 'page');
    settingsBtn.dataset.sleekfinCurrent = 'true';
  } else {
    settingsBtn.removeAttribute('aria-current');
    delete settingsBtn.dataset.sleekfinCurrent;
  }
}
function syncMobileOverflowDrawer(api = window.ApiClient) {
  syncMobileHeaderControls(api);
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
  const isCuratedTab = (isMovies && (movieOrTvTab === '1' || movieOrTvTab === '4'))
    || (isTv && (movieOrTvTab === '1' || movieOrTvTab === '3'));
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
    if (isCuratedTab) {
      if (document.documentElement.getAttribute('data-fx-curated-tab') !== 'true') {
        document.documentElement.setAttribute('data-fx-curated-tab', 'true');
      }
      document.querySelectorAll('.docspinner').forEach(sp => sp.classList?.remove?.('mdlSpinnerActive', 'is-active'));
    } else if (document.documentElement.hasAttribute('data-fx-curated-tab')) {
      document.documentElement.removeAttribute('data-fx-curated-tab');
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
const LEGACY_DUPLICATE_SHOW_KEYS = new Set(['tv-drama', 'tv-comedy', 'tv-anime', 'tv-scifi', 'tv-crime', 'tv-acclaimed']);
const LEGACY_DEFAULT_RULE_COUNTS = { home: 32, movies: 26, shows: 28 };
function upgradeLegacyConfig(cfg) {
  if (!cfg || typeof cfg !== 'object') return cfg;
  if (cfg.cardsPerShelf === 8) {
    cfg.cardsPerShelf = 20;
  }
  if (cfg.pages && DEFAULT_CONFIG?.pages) {
    for (const page of ['home', 'movies', 'shows']) {
      const prof = cfg.pages[page];
      const supplied = DEFAULT_CONFIG.pages[page]?.rules;
      if (!prof || !Array.isArray(prof.rules) || !Array.isArray(supplied)) continue;
      if (Array.isArray(prof.anchors)) {
        if (!prof.anchors.includes('ContinueWatchingNextUp') && !Array.isArray(prof.opening)) {
          prof.anchors.unshift('ContinueWatchingNextUp');
        } else if (prof.anchors.includes('ContinueWatchingNextUp') && prof.anchors[0] !== 'ContinueWatchingNextUp') {
          prof.anchors = ['ContinueWatchingNextUp', ...prof.anchors.filter(a => a !== 'ContinueWatchingNextUp')];
        }
      }
      if (page === 'shows') {
        const pinned = new Set(Array.isArray(prof.opening) ? prof.opening : []);
        const layouts = prof.layouts && typeof prof.layouts === 'object' ? prof.layouts : null;
        prof.rules = prof.rules.filter(r => {
          if (!LEGACY_DUPLICATE_SHOW_KEYS.has(r?.Key)) return true;
          const tok = `rule:${r.Key}`;
          return pinned.has(tok) || Boolean(layouts && tok in layouts);
        });
      }
      if (page === 'home' || page === 'movies') {
        const xmas = prof.rules.find(r => r?.Key === 'christmas');
        if (xmas) {
          if (Array.isArray(xmas.Months) && xmas.Months.length === 1 && xmas.Months[0] === 12) {
            xmas.Months = [11, 12];
          }
          if (Array.isArray(xmas.TagsAny) && xmas.TagsAny.length <= 1 && xmas.TagsAny[0] === 'christmas') {
            xmas.TagsAny = ['christmas', 'christmas eve', 'christmas party', 'christmas tree', 'santa claus', 'saving christmas'];
          }
        }
      }
      if (prof.rules.length <= LEGACY_DEFAULT_RULE_COUNTS[page]) {
        const existingKeys = new Set(prof.rules.map(r => r?.Key).filter(Boolean));
        for (const rule of supplied) {
          if (rule?.Key && !existingKeys.has(rule.Key)) {
            prof.rules.push(cloneJson(rule));
            existingKeys.add(rule.Key);
          } else if (page === 'shows' && ['comfort', 'dark-side-laughs', 'mind-benders'].includes(rule?.Key)) {
            const target = prof.rules.find(r => r?.Key === rule.Key);
            if (target && Array.isArray(target.TagsAny) && target.TagsAny.length <= 2) {
              target.TagsAny = [...rule.TagsAny];
            }
          }
        }
      }
    }
  }
  return cfg;
}
function isCompactTouchViewport() {
  try {
    return Boolean(
      window.matchMedia?.('(max-width: 768px)')?.matches ||
      (window.matchMedia?.('(pointer: coarse)')?.matches && (window.innerWidth || 1024) <= 900)
    );
  } catch { return false; }
}
function isTouchMobileDevice() {
  try {
    const nav = typeof navigator === 'object' ? navigator : window.navigator;
    const ua = String(nav?.userAgent || '');
    const touchMac = nav?.platform === 'MacIntel' && (nav?.maxTouchPoints || 0) > 1;
    return Boolean(
      window.NativeShell ||
      /iPhone|iPad|iPod|Android|Mobile/i.test(ua) ||
      touchMac ||
      window.matchMedia?.('(hover: none) and (pointer: coarse)')?.matches ||
      isCompactTouchViewport() ||
      (typeof window.innerWidth === 'number' && window.innerWidth > 0 && Math.min(window.innerWidth, window.innerHeight || 9999) <= 520)
    );
  } catch { return false; }
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
  animateModalFromOrigin(dialog);
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
  const compact = isCompactTouchViewport();
  const maxWidth = compact ? (layout === 'portrait' ? 300 : 440) : 700;
  const quality = compact ? 82 : 88;
  const add = (id, type, tag, poster = false) => {
    if (!id || !tag) return;
    const url = safeUrl(api.getImageUrl(id, { type, tag, maxWidth, quality, ...(type === 'Backdrop' ? { index: 0 } : {}) }));
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
function attachSimilarControls(entry, card, item, s) {
  entry.querySelector('.fx-card-more')?.remove();
  if (card.dataset.fxSimilarBound === 'true') return;
  if (['Movie', 'Series'].includes(item.Type) && s.inventory?.items?.some(i => i.Id === item.Id)) {
    card.dataset.fxSimilarBound = 'true';
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
function snapScrollDelta(track, direction, fallbackStep, clampEnd = false) {
  const maxScroll = Math.max(0, (track.scrollWidth || 0) - (track.clientWidth || 0));
  const current = track.scrollLeft || 0;
  if (clampEnd && maxScroll > 0) {
    if (direction > 0 && current >= maxScroll - 2) return 0;
    if (direction < 0 && current <= 2) return 0;
  }
  const children = [...track.children];
  if (children.length < 2) {
    const raw = direction * fallbackStep;
    return clampEnd && maxScroll > 0 ? Math.max(-current, Math.min(maxScroll - current, raw)) : raw;
  }
  const base = typeof children[0]?.offsetLeft === 'number' ? children[0].offsetLeft : 0;
  let snaps = children.map(c => (typeof c.offsetLeft === 'number' ? c.offsetLeft - base : 0));
  if (!snaps.some(x => x > 0)) {
    const raw = direction * fallbackStep;
    return clampEnd && maxScroll > 0 ? Math.max(-current, Math.min(maxScroll - current, raw)) : raw;
  }
  if (clampEnd && maxScroll > 0) {
    snaps = [...new Set(snaps.map(pos => Math.min(pos, maxScroll)))];
  }
  const desired = clampEnd && maxScroll > 0
    ? Math.max(0, Math.min(maxScroll, current + direction * fallbackStep))
    : current + direction * fallbackStep;
  const candidates = snaps.filter(pos => direction > 0 ? pos > current + 4 : pos < current - 4);
  if (!candidates.length) {
    if (clampEnd && maxScroll > 0) return direction > 0 ? Math.max(0, maxScroll - current) : -current;
    return direction * fallbackStep;
  }
  let best = candidates[0];
  for (const pos of candidates) {
    if (Math.abs(pos - desired) < Math.abs(best - desired)) best = pos;
  }
  return best - current;
}
function setCategoryHashParam(catKey) {
  const rawHash = String(location.hash || '#/home');
  const [pathPart, queryPart = ''] = rawHash.split('?');
  const q = new URLSearchParams(queryPart);
  if (catKey) q.set('fxCat', catKey);
  else q.delete('fxCat');
  const qs = q.toString();
  const nextHash = qs ? `${pathPart}?${qs}` : pathPart;
  if (location.hash !== nextHash) {
    location.hash = nextHash;
  }
}
function closeCategorySubpage(s = state, updateUrl = true) {
  if (!s) return;
  if (updateUrl && new URLSearchParams(String(location.hash || '').split('?')[1] || '').has('fxCat')) {
    setCategoryHashParam('');
  }
  s.subpageActive = false;
  s.subpageKey = '';
  if (s.route) delete s.route.cat;
  document.documentElement?.removeAttribute?.('data-fx-subpage');
  s.root.querySelector('.fx-subpage')?.remove();
  if (s.toolbar) s.toolbar.hidden = s.route?.page === 'home';
  s.list.hidden = !!s.full;
  s.footer.hidden = !!(s.full || (!s.slots.length && !s.finished));
  s.more.hidden = !s.pauseAutomatic;
  s.matchCount.hidden = !!s.full;
  syncPageHero(s);
  const savedScroll = s.savedSubpageScroll || 0;
  s.savedSubpageScroll = 0;
  requestAnimationFrame(() => {
    if (state !== s || !s.root.isConnected || s.subpageActive) return;
    const scroller = findScrollRoot(s.root);
    if (scroller) scroller.scrollTop = savedScroll;
    virtualize(s);
  });
}
const SUBPAGE_BACK_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>';
const HERO_NEXT_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
function resolveCategoryShelf(s, catKey, fallbackRow = null) {
  const plannerShelf = s.planner?.shelves?.find(sh => sh.key === catKey);
  const slotRow = s.slots.find(sl => sl.data?.key === catKey)?.data || fallbackRow;
  if (plannerShelf && (plannerShelf.items?.length || plannerShelf.title)) {
    return { title: plannerShelf.title, items: plannerShelf.allItems || plannerShelf.items || [] };
  }
  if (slotRow && (slotRow.allItems?.length || slotRow.items?.length)) {
    return { title: slotRow.title || catKey, items: slotRow.allItems || slotRow.items || [] };
  }
  const invItems = s.inventory?.items || [];
  if (invItems.length && s.config) {
    const pageProfile = s.profile || s.config.pages?.[s.route?.page] || s.config.pages?.home;
    if (pageProfile) {
      const rebuilt = buildShelves(invItems, pageProfile, s.config, s.route?.page || 'home', s.now);
      const hit = rebuilt.find(sh => sh.key === catKey);
      if (hit) return { title: hit.title, items: hit.items || [] };
    }
    if (catKey.startsWith('rule:')) {
      const ruleKey = catKey.slice(5);
      const pageOrder = [...new Set([s.route?.page, 'movies', 'shows', 'home'].filter(Boolean))];
      for (const pName of pageOrder) {
        const rule = (s.config.pages?.[pName]?.rules || []).find(r => r?.Key === ruleKey);
        if (rule) {
          const matched = invItems.filter(i => matches(rule, i, s.config.hideWatched));
          return { title: rule.Title || catKey, items: matched };
        }
      }
    }
  }
  return { title: slotRow?.title || catKey, items: slotRow?.allItems || slotRow?.items || [] };
}
function renderCategorySubpageDom(s, catKey, titleText, items) {
  let host = s.root.querySelector('.fx-subpage');
  if (!host) {
    host = element('section', 'fx-subpage');
    s.root.prepend(host);
  }
  host.dataset.subpageKey = catKey;
  const backBtn = button('', () => closeCategorySubpage(s, true));
  backBtn.className = 'fx-subpage-back fx-subpage-back-top';
  backBtn.title = 'Back';
  backBtn.setAttribute('aria-label', `Back from ${titleText}`);
  const arrow = element('span', 'fx-subpage-arrow');
  arrow.innerHTML = SUBPAGE_BACK_SVG;
  backBtn.append(arrow);

  const head = element('div', 'fx-subpage-head');
  const h1 = element('h1', 'fx-subpage-title', titleText);
  const cleanItems = (items || []).filter(i => i && i.Type !== 'SeeMore');
  const count = element('span', 'fx-subpage-count', `${cleanItems.length}`);
  head.append(h1, count);

  const grid = element('div', 'fx-subpage-grid');
  const useLandscape = cleanItems.length > 0 && cleanItems.every(i => i.Type === 'Episode' && !i.SeriesPrimaryImageTag && !i.ImageTags?.Primary);
  const cardLayout = useLandscape ? 'landscape' : 'portrait';
  const frag = document.createDocumentFragment();
  cleanItems.forEach(item => {
    frag.append(renderCard(item, s, true, cardLayout));
  });
  grid.append(frag);
  const nodes = [backBtn, head, grid];
  if (cleanItems.length > 0) {
    nodes.push(element('p', 'fx-subpage-end', "You've reached the bottom of the page! Congratulations!"));
  }
  host.replaceChildren(...nodes);
}
async function openCategorySubpage(s, catKey, fallbackRow = null, updateUrl = true) {
  if (!s || !catKey || catKey === 'MyMedia') return;
  if (catKey === 'DiscoverMovies' || catKey === 'DiscoverTV') {
    scrollToTop();
    location.hash = `#/home?requesthub=discover&rhView=${catKey === 'DiscoverTV' ? 'tv' : 'movies'}`;
    return;
  }
  if (!s.subpageActive) {
    const scroller = findScrollRoot(s.root);
    s.savedSubpageScroll = scroller?.scrollTop || 0;
    saveFeed(s);
  }
  if (updateUrl) setCategoryHashParam(catKey);
  s.subpageActive = true;
  s.subpageKey = catKey;
  if (s.route) s.route.cat = catKey;
  document.documentElement?.setAttribute?.('data-fx-subpage', 'true');
  if (s.toolbar) s.toolbar.hidden = true;
  s.panel.hidden = true;
  s.matchCount.hidden = true;
  s.list.hidden = true;
  s.footer.hidden = true;
  syncPageHero(s);
  scrollToTop();

  const resolved = resolveCategoryShelf(s, catKey, fallbackRow);
  let titleText = resolved.title;
  let items = resolved.items;

  if ((catKey === 'RecentlyAddedMovies' || catKey === 'RecentlyAddedShows') && s.inventory?.items?.length) {
    const fullAnchor = await s.client.anchor(catKey, s.route, s.inventory, { ...s.config, cardsPerShelf: 10000 }).catch(() => null);
    if (state !== s || s.subpageKey !== catKey) return;
    if (fullAnchor) {
      titleText = fullAnchor.title || titleText;
      items = fullAnchor.allItems || fullAnchor.items || items;
    }
  }
  renderCategorySubpageDom(s, catKey, titleText, items);

  if (catKey === 'ContinueWatchingNextUp' && s.inventory && typeof s.api?.getUrl === 'function') {
    s.client.fetchContinueWatching(s.route, s.inventory, 100).then(more => {
      if (state !== s || !s.subpageActive || s.subpageKey !== catKey || !Array.isArray(more) || !more.length) return;
      if (more.length > items.length) renderCategorySubpageDom(s, catKey, titleText, more);
    }).catch(() => {});
  } else if (!items.length && s.inventory && s.profile?.anchors?.includes(catKey)) {
    s.client.anchor(catKey, s.route, s.inventory, { ...s.config, cardsPerShelf: 200 }).then(anc => {
      if (state !== s || !s.subpageActive || s.subpageKey !== catKey || !anc) return;
      renderCategorySubpageDom(s, catKey, anc.title || titleText, anc.allItems || anc.items || []);
    }).catch(() => {});
  }
}
function syncCategorySubpage(s, wantedCat) {
  if (!s) return;
  const cat = String(wantedCat || '');
  if (!cat) {
    if (s.subpageActive) closeCategorySubpage(s, false);
    return;
  }
  if (s.subpageActive && s.subpageKey === cat && s.root.querySelector('.fx-subpage')) {
    s.list.hidden = true;
    s.footer.hidden = true;
    return;
  }
  const hasQuickMatch = Boolean(
    s.planner?.shelves?.some(sh => sh.key === cat) ||
    s.slots.some(sl => sl.data?.key === cat)
  );
  if (!s.inventory && !hasQuickMatch) {
    s.subpageActive = true;
    s.subpageKey = cat;
    document.documentElement?.setAttribute?.('data-fx-subpage', 'true');
    if (s.toolbar) s.toolbar.hidden = true;
    s.list.hidden = true;
    s.footer.hidden = true;
    return;
  }
  openCategorySubpage(s, cat, null, false);
}
function bindRowHeading(titleEl, slot, s) {
  if (!titleEl || slot.data?.key === 'MyMedia') return;
  titleEl.classList.add('fx-clickable-heading');
  titleEl.tabIndex = 0;
  titleEl.setAttribute('role', 'button');
  if (titleEl._fxSubpageBound) return;
  titleEl._fxSubpageBound = true;
  const activate = e => {
    const curRow = slot.data;
    if (!curRow || curRow.key === 'MyMedia') return;
    e.preventDefault();
    e.stopPropagation();
    openCategorySubpage(s, curRow.key, curRow, true);
  };
  titleEl.addEventListener('click', activate);
  titleEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') activate(e);
  });
}
function fillSlot(slot, s) {
  const row = slot.data;
  const head = element('div', 'fx-row-head'), title = element('h2', '', row.title), trackWrap = element('div', 'fx-track-wrap'), track = element('div', 'fx-track');
  trackWrap.dataset.fxScrollStart = 'true';
  trackWrap.dataset.fxScrollEnd = 'false';
  trackWrap.append(track);
  bindRowHeading(title, slot, s);
  const baseCount = row.items.length;
  const hasSeeMore = row.key === 'DiscoverMovies' || row.key === 'DiscoverTV' || row.items.some(i => i.Type === 'SeeMore');
  const noLoop = hasSeeMore || row.key === 'MyMedia' || baseCount < 2;
  if (noLoop) track.dataset.noLoop = 'true';
  const initialCopies = !noLoop
    ? (s.route.view === 'genres' ? Math.max(2, Math.ceil(10 / baseCount)) : Math.max(2, Math.ceil(12 / baseCount)))
    : 1;
  const MAX_LOOP_CYCLES = 24;
  let renderedCycles = initialCopies;
  const token = row.family === 'anchor' ? `anchor:${row.key}` : row.family === 'theme' ? row.key : `family:${row.family}`;
  const requested = s.profile?.layouts?.[token] || row.layout || 'auto';
  const portraitOnly = row.key !== 'MyMedia' && row.items.filter(i => !i.ImageTags?.Thumb && !i.BackdropImageTags?.length && !i.ParentBackdropImageTags?.length && (i.ImageTags?.Primary || i.ProviderIds?.JellyseerrPoster) && (!i.PrimaryImageAspectRatio || i.PrimaryImageAspectRatio < 1)).length > row.items.length / 2;
  const layout = s.route.view === 'genres' ? 'landscape' : requested === 'auto' ? (row.external || row.key === 'DiscoverMovies' || row.key === 'DiscoverTV' || portraitOnly ? 'portrait' : 'landscape') : requested;
  const back = button('‹', () => scroll(-1)), forward = button('›', () => scroll(1));
  back.setAttribute('aria-label', `Previous ${row.title}`); forward.setAttribute('aria-label', `More ${row.title}`);
  back.disabled = true;

  const cycleWidth = () => {
    if (noLoop || baseCount < 2) return 0;
    const first = track.children[0], secondCycle = track.children[baseCount];
    return first && secondCycle && typeof secondCycle.offsetLeft === 'number' && secondCycle.offsetLeft > first.offsetLeft ? secondCycle.offsetLeft - first.offsetLeft : 0;
  };
  const appendLoopCycle = () => {
    if (noLoop || baseCount < 2 || renderedCycles >= MAX_LOOP_CYCLES) return false;
    const cycleIdx = renderedCycles++;
    const frag = document.createDocumentFragment();
    row.items.forEach(item => {
      const cardNode = renderCard(item, s, true, layout);
      cardNode.dataset.loopClone = String(cycleIdx);
      frag.append(cardNode);
    });
    track.append(frag);
    return true;
  };
  const ensureRightCycles = (extraPx = 0) => {
    if (noLoop || baseCount < 2) return;
    const cw = cycleWidth();
    if (!cw) return;
    let safety = 0;
    while ((track.scrollLeft || 0) + (track.clientWidth || 0) + extraPx >= (track.scrollWidth || 0) - cw * 0.9 && safety++ < 4) {
      if (!appendLoopCycle()) {
        // Bound DOM depth if someone scrolls past 24 full cycles while keeping scrollLeft >= cw
        track.scrollLeft = Math.max(cw, (track.scrollLeft || 0) - cw);
        break;
      }
    }
  };
  const updateTrackEdges = () => {
    const cur = track.scrollLeft || 0;
    const maxScroll = Math.max(0, (track.scrollWidth || 0) - (track.clientWidth || 0));
    const atStart = cur <= 2;
    const atEnd = noLoop && maxScroll > 0 && cur >= maxScroll - 2;
    const noOverflow = noLoop && maxScroll <= 2 && (track.scrollWidth || 0) > 0 && (track.clientWidth || 0) > 0;
    trackWrap.dataset.fxScrollStart = atStart ? 'true' : 'false';
    trackWrap.dataset.fxScrollEnd = (atEnd || noOverflow) ? 'true' : 'false';
    back.disabled = atStart;
    forward.disabled = atEnd || noOverflow;
  };
  track._fxEnsureRight = ensureRightCycles;
  track._fxUpdateEdges = updateTrackEdges;

  const scroll = direction => {
    const step = Math.max(180, Math.round((track.clientWidth || 320) * 0.85));
    // One-way anchored endless scroll: never wrap backward past the first item (scrollLeft === 0)
    if (direction < 0) {
      if ((track.scrollLeft || 0) <= 2) {
        updateTrackEdges();
        return;
      }
      const delta = snapScrollDelta(track, -1, step, true);
      if (delta !== 0) track.scrollBy({ left: delta, behavior: 'smooth' });
      return;
    }
    if (!noLoop) {
      ensureRightCycles(step + 80);
      const cw = cycleWidth();
      if (cw > 0) {
        const delta = snapScrollDelta(track, 1, step, false);
        if (delta !== 0) track.scrollBy({ left: delta, behavior: 'smooth' });
        return;
      }
    }
    const delta = snapScrollDelta(track, 1, step, true);
    if (delta !== 0) track.scrollBy({ left: delta, behavior: 'smooth' });
    updateTrackEdges();
  };
  track.addEventListener('scroll', () => {
    if (!noLoop) ensureRightCycles(240);
    updateTrackEdges();
  }, { passive: true });
  track.addEventListener('scrollend', () => {
    if (!noLoop) ensureRightCycles(240);
    updateTrackEdges();
  }, { passive: true });
  track.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    if (!noLoop && e.deltaX > 0) {
      ensureRightCycles(320);
    }
  }, { passive: true });

  const existingTrack = slot.node.querySelector('.fx-track');
  if (existingTrack && slot.node.dataset.layout === layout) {
    const existingEntries = [...existingTrack.querySelectorAll('.fx-card-entry')];
    if (
      existingEntries.length >= baseCount &&
      (noLoop ? existingEntries.length === baseCount : existingEntries.length % baseCount === 0) &&
      row.items.every((item, idx) => (existingEntries[idx]?.querySelector('.fx-card')?.dataset?.itemId || '') === (item.Id || ''))
    ) {
      const existingHeading = slot.node.querySelector('.fx-row-head h2');
      if (existingHeading) {
        if (existingHeading.textContent !== row.title) existingHeading.textContent = row.title;
        bindRowHeading(existingHeading, slot, s);
      }
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
      existingTrack._fxUpdateEdges?.();
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
  for (let copy = 0; copy < initialCopies; copy++) {
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
  slot.node.replaceChildren(head, trackWrap); slot.node.className = 'fx-shelf'; slot.node.style.height = ''; slot.live = true;
  if (preservedScroll) {
    track.scrollLeft = preservedScroll;
    if (!noLoop) ensureRightCycles(240);
  }
  updateTrackEdges();
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
    const trackWrap = element('div', 'fx-track-wrap');
    trackWrap.dataset.fxScrollStart = 'true';
    const track = element('div', 'fx-track');
    for (let c = 0; c < 6; c++) {
      const entry = element('div', 'fx-card-entry');
      const vis = element('div', 'fx-card-visual is-loading fx-skeleton-box');
      const line = element('div', 'fx-skeleton-line');
      entry.append(vis, line);
      track.append(entry);
    }
    trackWrap.append(track);
    sec.append(head, trackWrap);
    s.list.append(sec);
  }
}
function shouldShowPageHero(s) {
  if (!s || s.full || s.failed || s.subpageActive || s.route?.cat) return false;
  if (s.route?.page === 'home') return true;
  return (s.route?.page === 'movies' || s.route?.page === 'shows') && s.route?.view === 'suggestions';
}
function formatHeroRuntime(item, seasonsList = []) {
  if (item.Type === 'Series') {
    const cachedCount = Number(item.SeasonCount || 0);
    const count = cachedCount > 0
      ? cachedCount
      : (seasonsList || []).filter(sn => (sn.SeriesId === item.Id || sn.ParentId === item.Id) && Number(sn.IndexNumber) > 0).length;
    return count > 0 ? `${count} ${count === 1 ? 'Season' : 'Seasons'}` : 'Series';
  }
  const mins = Math.round((Number(item.RunTimeTicks) || 0) / 600000000);
  if (mins <= 0) return '';
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}
function compactHeroItem(item, seasonsList = []) {
  const seasonCount = item.Type === 'Series'
    ? (Number(item.SeasonCount || 0) || (seasonsList || []).filter(sn => (sn.SeriesId === item.Id || sn.ParentId === item.Id) && Number(sn.IndexNumber) > 0).length)
    : 0;
  return {
    Id: item.Id,
    Name: item.Name,
    Type: item.Type,
    MediaType: item.MediaType || 'Video',
    ProductionYear: item.ProductionYear || null,
    RunTimeTicks: item.RunTimeTicks || null,
    SeasonCount: seasonCount || null,
    Genres: Array.isArray(item.Genres) ? item.Genres.slice(0, 3) : [],
    Overview: item.Overview || '',
    CommunityRating: item.CommunityRating || null,
    CriticRating: item.CriticRating || null,
    UserData: item.UserData ? { Played: !!item.UserData.Played, PlaybackPositionTicks: item.UserData.PlaybackPositionTicks || 0 } : {},
    BackdropImageTags: Array.isArray(item.BackdropImageTags) ? item.BackdropImageTags.slice(0, 1) : [],
    ImageTags: item.ImageTags ? {
      ...(item.ImageTags.Logo ? { Logo: item.ImageTags.Logo } : {}),
      ...(item.ImageTags.Thumb ? { Thumb: item.ImageTags.Thumb } : {}),
      ...(item.ImageTags.Primary ? { Primary: item.ImageTags.Primary } : {})
    } : {}
  };
}
function heroConfigSignature(s) {
  try {
    return JSON.stringify(resolveHeroConfig(s.profile || s.config?.pages?.[s.route?.page || 'home']));
  } catch { return 'default'; }
}
function readHeroCache(s) {
  const k = heroCacheKey(s.scope, s.route?.page || 'home');
  const today = dayInZone(s.now, s.config?.timeZone || DEFAULT_CONFIG?.timeZone || 'America/Los_Angeles');
  const cfgSig = heroConfigSignature(s);
  const mem = heroMemoryCache.get(k);
  if (mem && mem.day === today && (!mem.heroCfgSig || mem.heroCfgSig === cfgSig) && Array.isArray(mem.items) && mem.items.length) return mem.items;
  try {
    const raw = localStorage.getItem(k);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.day !== today || !Array.isArray(parsed.items) || !parsed.items.length) return null;
    if (parsed.heroCfgSig && parsed.heroCfgSig !== cfgSig) return null;
    if (Date.now() - (parsed.at || 0) > 24 * 3600 * 1000) return null;
    heroMemoryCache.set(k, parsed);
    return parsed.items;
  } catch { return null; }
}
function writeHeroCache(s, items) {
  if (!Array.isArray(items) || !items.length) return;
  const k = heroCacheKey(s.scope, s.route?.page || 'home');
  const today = dayInZone(s.now, s.config?.timeZone || DEFAULT_CONFIG?.timeZone || 'America/Los_Angeles');
  const compact = items.map(it => compactHeroItem(it, s.inventory?.seasons));
  const payload = { version: VERSION, day: today, at: Date.now(), heroCfgSig: heroConfigSignature(s), items: compact };
  heroMemoryCache.set(k, payload);
  try { localStorage.setItem(k, JSON.stringify(payload)); } catch {}
}
function pickPageHeroItems(s) {
  const heroCfg = resolveHeroConfig(s.profile || s.config?.pages?.[s.route.page]);
  const seed = `${s.scope}:${dayInZone(s.now, s.config?.timeZone || 'America/Los_Angeles')}:${s.route.page}:${s.shuffle}`;
  const getCriticScore = item => {
    const rt = lookupCachedRating(item.Id, item);
    if (rt?.criticScore != null && Number.isFinite(Number(rt.criticScore))) return Number(rt.criticScore);
    return item.CriticRating != null && Number.isFinite(Number(item.CriticRating)) && Number(item.CriticRating) > 0 ? Number(item.CriticRating) : null;
  };
  return selectHeroItems(s.inventory?.items || [], heroCfg, s.route.page, seed, {
    getCriticScore,
    excludeItem: isLeavingSoonItem
  });
}
function stopPageHeroTimer(s) {
  if (s?.heroTimer) {
    clearInterval(s.heroTimer);
    s.heroTimer = 0;
  }
}
function syncPageHero(s) {
  if (!s || !s.root) return;
  const wantHero = shouldShowPageHero(s);
  setRootAttr('data-fx-page-hero', wantHero);
  if (!wantHero) {
    stopPageHeroTimer(s);
    if (s.heroEl) {
      s.heroEl.remove();
      s.heroEl = null;
    }
    return;
  }
  if (!s.heroEl) {
    s.heroEl = element('section', 'fx-page-hero is-loading');
    s.heroEl.setAttribute('aria-label', s.route.page === 'home' ? 'Featured Titles' : s.route.page === 'movies' ? 'Featured Movies' : 'Featured TV Shows');
    s.root.prepend(s.heroEl);
  }
  const heroCfg = resolveHeroConfig(s.profile || s.config?.pages?.[s.route.page]);
  let featured = [];
  if (s.inventory?.items?.length) {
    featured = pickPageHeroItems(s);
    if (featured.length) writeHeroCache(s, featured);
    // If user requires a minimum Rotten Tomatoes % and some candidates lack Jellyfin CriticRating/cached RT, fetch a batch and re-evaluate
    if (heroCfg.minCriticScore != null && !s._fxHeroRtChecked && s.api?.getCurrentUserId?.()) {
      const wantTypes = s.route.page === 'home' ? ['Movie', 'Series'] : [s.route.page === 'movies' ? 'Movie' : 'Series'];
      const missingRt = s.inventory.items
        .filter(i => i && wantTypes.includes(i.Type) && !isLeavingSoonItem(i) && (!heroCfg.excludeWatched || !i.UserData?.Played) && !(Number(i.CriticRating) > 0) && !lookupCachedRating(i.Id, i))
        .sort((a, b) => Number(b.CommunityRating || 0) - Number(a.CommunityRating || 0))
        .slice(0, 30)
        .map(i => i.Id);
      if (missingRt.length) {
        s._fxHeroRtChecked = true;
        const req = fetchRatingsBatch(s.api, missingRt, false);
        if (req) req.then(updated => { if (updated && !stopped && state === s) syncPageHero(s); });
      }
    }
  } else {
    featured = readHeroCache(s) || [];
    if (!featured.length) return;
  }
  if (!featured.length) {
    s.heroEl.remove();
    s.heroEl = null;
    setRootAttr('data-fx-page-hero', false);
    return;
  }
  const sig = `${heroConfigSignature(s)}|${featured.map(i => i.Id).join(',')}`;
  if (s.heroEl.dataset.heroSig === sig) {
    syncHeroAndDetailRatings(s.api);
    return;
  }
  s.heroEl.dataset.heroSig = sig;
  s.heroEl.classList.remove('is-loading');
  stopPageHeroTimer(s);

  let slidesWrap;
  try {
    slidesWrap = document.createElement('div', { is: 'emby-itemscontainer' });
  } catch {
    slidesWrap = document.createElement('div');
  }
  slidesWrap.setAttribute('is', 'emby-itemscontainer');
  slidesWrap.className = 'fx-page-hero-slides itemsContainer';
  slidesWrap.setAttribute('data-contextmenu', 'false');
  slidesWrap.setAttribute('data-multiselect', 'false');
  const dotsWrap = element('div', 'fx-page-hero-dots');
  const ratingsCfg = getActiveRatingsConfig(s.api);
  const compact = isCompactTouchViewport();
  const serverId = s.api?.serverId?.() || '';
  const slides = [];
  const dots = [];
  let activeIdx = 0;
  let paused = false;

  const setActive = nextIdx => {
    activeIdx = ((nextIdx % slides.length) + slides.length) % slides.length;
    slides.forEach((sl, idx) => { sl.dataset.active = idx === activeIdx ? 'true' : 'false'; });
    dots.forEach((dt, idx) => { dt.setAttribute('aria-current', idx === activeIdx ? 'true' : 'false'); });
  };

  featured.forEach((item, idx) => {
    const slide = element('article', 'fx-page-hero-slide');
    slide.dataset.active = idx === 0 ? 'true' : 'false';
    slide.dataset.itemId = item.Id;

    const bgWrap = element('div', 'fx-page-hero-backdrop-wrap');
    const bgTag = item.BackdropImageTags?.[0] || item.ImageTags?.Thumb || item.ImageTags?.Primary;
    const bgType = item.BackdropImageTags?.[0] ? 'Backdrop' : item.ImageTags?.Thumb ? 'Thumb' : 'Primary';
    if (bgTag && typeof s.api?.getImageUrl === 'function') {
      const img = element('img', 'fx-page-hero-backdrop');
      img.alt = '';
      img.loading = idx <= 1 ? 'eager' : 'lazy';
      img.decoding = idx === 0 ? 'sync' : 'async';
      img.dataset.loaded = 'false';
      const url = safeUrl(s.api.getImageUrl(item.Id, { type: bgType, tag: bgTag, maxWidth: compact ? 960 : 1920, quality: 86, ...(bgType === 'Backdrop' ? { index: 0 } : {}) }));
      const isCachedImg = loadedImages.has(url);
      if (isCachedImg) img.dataset.loaded = 'true';
      img.addEventListener('load', () => { loadedImages.add(url); img.dataset.loaded = 'true'; });
      img.src = url;
      if (img.complete && img.naturalWidth > 0) { loadedImages.add(url); img.dataset.loaded = 'true'; }
      bgWrap.append(img);
    }
    const vignette = element('div', 'fx-page-hero-vignette');
    const content = element('div', 'fx-page-hero-content');
    const stack = element('div', 'fx-page-hero-stack');

    const titleNode = element('h1', 'fx-page-hero-title', item.Name || 'Untitled');
    if (item.ImageTags?.Logo && typeof s.api?.getImageUrl === 'function') {
      const logo = element('img', 'fx-page-hero-logo');
      logo.alt = item.Name || '';
      logo.loading = idx <= 1 ? 'eager' : 'lazy';
      const logoUrl = safeUrl(s.api.getImageUrl(item.Id, { type: 'Logo', tag: item.ImageTags.Logo, maxWidth: 520, quality: 90 }));
      logo.src = logoUrl;
      titleNode.hidden = true;
      logo.addEventListener('load', () => {
        if (logo.naturalWidth > 0 && (logo.naturalWidth < 160 || logo.naturalHeight < 28)) {
          logo.remove();
          titleNode.hidden = false;
        }
      });
      logo.addEventListener('error', () => { logo.remove(); titleNode.hidden = false; });
      stack.append(logo, titleNode);
    } else {
      stack.append(titleNode);
    }

    const meta = element('div', 'fx-page-hero-meta');
    const ratingSlot = element('span', 'fx-page-hero-ratings');
    ratingSlot.dataset.itemId = item.Id;
    if (item.CommunityRating) ratingSlot.dataset.star = String(item.CommunityRating);
    if (item.CriticRating) ratingSlot.dataset.critic = String(item.CriticRating);
    const rt = lookupCachedRating(item.Id, item);
    const group = (ratingsCfg.tomatometer || ratingsCfg.stars) ? buildRatingsGroup(item, rt, ratingsCfg, false) : null;
    if (group) {
      ratingSlot.append(group);
      ratingSlot.dataset.fxSig = group.textContent + '|' + ratingsCfg.tomatometer + '|' + ratingsCfg.stars;
    } else {
      ratingSlot.hidden = true;
    }
    const metaParts = [];
    if (item.ProductionYear) metaParts.push(element('span', '', String(item.ProductionYear)));
    const runtimeTxt = formatHeroRuntime(item, s.inventory?.seasons);
    if (runtimeTxt) metaParts.push(element('span', '', runtimeTxt));
    (item.Genres || []).slice(0, 2).forEach(g => metaParts.push(element('span', '', g)));

    meta.append(ratingSlot);
    const firstSep = element('span', 'fx-page-hero-sep', '·');
    firstSep.hidden = !group || !metaParts.length;
    meta.append(firstSep);
    metaParts.forEach((node, pIdx) => {
      if (pIdx > 0) meta.append(element('span', 'fx-page-hero-sep', '·'));
      meta.append(node);
    });
    stack.append(meta);

    if (item.Overview) {
      stack.append(element('p', 'fx-page-hero-desc', item.Overview));
    }

    const actions = element('div', 'fx-page-hero-actions');
    const detailsHref = itemHref(item, s.api) || '#';
    const playBtn = element('button', 'fx-page-hero-btn fx-page-hero-btn-primary itemAction');
    playBtn.type = 'button';
    playBtn.setAttribute('data-action', 'play');
    playBtn.setAttribute('data-id', item.Id);
    playBtn.setAttribute('data-type', item.Type || 'Movie');
    playBtn.setAttribute('data-mediatype', item.MediaType || 'Video');
    playBtn.setAttribute('data-isfolder', String(item.Type === 'Series'));
    if (serverId) playBtn.setAttribute('data-serverid', serverId);
    playBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><polygon points="6,4 20,12 6,20"></polygon></svg><span>Play</span>';
    playBtn.addEventListener('click', ev => {
      const pm = findPlaybackManager();
      if (pm) {
        ev.preventDefault();
        ev.stopPropagation();
        try {
          pm.play({ ids: [item.Id], serverId });
          return;
        } catch {}
      }
      // If Jellyfin upgraded slidesWrap as emby-itemscontainer, let the native data-action="play" click delegate handle direct playback
      if (slidesWrap._fxUpgradedItemsContainer) return;
      if (detailsHref && detailsHref !== '#') {
        ev.preventDefault();
        location.hash = detailsHref.replace(/^#?/, '#');
      }
    });
    const infoBtn = element('a', 'fx-page-hero-btn fx-page-hero-btn-secondary');
    infoBtn.href = detailsHref;
    infoBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg><span>More Info</span>';
    actions.append(playBtn, infoBtn);
    stack.append(actions);

    content.append(stack);
    slide.append(bgWrap, vignette, content);
    slidesWrap.append(slide);
    slides.push(slide);

    const dot = element('button', 'fx-page-hero-dot');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Featured slide ${idx + 1}: ${item.Name || ''}`);
    dot.setAttribute('aria-current', idx === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => setActive(idx));
    dotsWrap.append(dot);
    dots.push(dot);
  });

  const prevBtn = element('button', 'fx-page-hero-nav fx-page-hero-prev');
  prevBtn.type = 'button';
  prevBtn.setAttribute('aria-label', 'Previous featured title');
  prevBtn.innerHTML = SUBPAGE_BACK_SVG;
  prevBtn.addEventListener('click', () => setActive(activeIdx - 1));

  const nextBtn = element('button', 'fx-page-hero-nav fx-page-hero-next');
  nextBtn.type = 'button';
  nextBtn.setAttribute('aria-label', 'Next featured title');
  nextBtn.innerHTML = HERO_NEXT_SVG;
  nextBtn.addEventListener('click', () => setActive(activeIdx + 1));

  s.heroEl.replaceChildren(slidesWrap, prevBtn, nextBtn, dotsWrap);
  try {
    if (window.CustomElements && typeof window.CustomElements.upgradeSubtree === 'function') {
      window.CustomElements.upgradeSubtree(s.heroEl);
      slidesWrap._fxUpgradedItemsContainer = true;
    } else if (typeof slidesWrap.refreshItems === 'function') {
      slidesWrap._fxUpgradedItemsContainer = true;
    }
  } catch {}
  s.heroEl.addEventListener('mouseenter', () => { paused = true; });
  s.heroEl.addEventListener('mouseleave', () => { paused = false; });

  let swipeStartX = 0;
  s.heroEl.addEventListener('touchstart', e => { swipeStartX = e.touches?.[0]?.clientX || 0; }, { passive: true });
  s.heroEl.addEventListener('touchend', e => {
    const endX = e.changedTouches?.[0]?.clientX || 0;
    const dx = swipeStartX - endX;
    if (Math.abs(dx) > 48 && slides.length > 1) setActive(activeIdx + (dx > 0 ? 1 : -1));
  }, { passive: true });

  const reduceMotion = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
  if (slides.length > 1 && !reduceMotion) {
    s.heroTimer = setInterval(() => {
      if (stopped || state !== s || paused || document.hidden || !s.heroEl?.isConnected) return;
      setActive(activeIdx + 1);
    }, 9000);
  }
  if (ratingsCfg.tomatometer) {
    const req = fetchRatingsBatch(s.api, featured.map(i => i.Id), false);
    if (req) {
      req.then(updated => {
        if (updated && !stopped && state === s) syncHeroAndDetailRatings(s.api);
      });
    }
  }
}
function appendRow(row, s, isBoot = false, atIndex = -1) {
  s.list.querySelectorAll('[data-skeleton="true"]').forEach(n => n.remove());
  const slot = { node: element('section', 'fx-shelf'), data: row, live: false, boot: isBoot };
  if (isBoot) slot.node.dataset.bootRow = 'true';
  slot.node.dataset.shelfKey = row.key;
  if (atIndex >= 0 && atIndex < s.slots.length) {
    const refSlot = s.slots[atIndex];
    if (refSlot?.node?.parentElement === s.list) s.list.insertBefore(slot.node, refSlot.node);
    else s.list.append(slot.node);
    s.slots.splice(atIndex, 0, slot);
  } else {
    s.list.append(slot.node);
    s.slots.push(slot);
  }
  fillSlot(slot, s);
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
  const inSubpage = Boolean(s.subpageActive || s.route?.cat);
  s.list.hidden = s.full || inSubpage;
  s.footer.hidden = s.full || inSubpage;
  s.more.hidden = !s.pauseAutomatic;
  s.more.disabled = false;
  const hasActiveFilter = filtersActive(s.filters) || s.filters.sort !== 'recommended';
  s.matchCount.textContent=hasActiveFilter?`${filterItems(s.inventory.items,s.filters,s.tracking).length} matching titles`:'';
  s.note.textContent=s.finished?"You've reached the bottom of the page! Congratulations!":'';
  setMode(s,s.full,false);filterPanel(s);
  requestAnimationFrame(()=>{
    if(state!==s||!s.root.isConnected||s.subpageActive||s.route?.cat)return;
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
  const inSubpage = Boolean(s.subpageActive || s.route?.cat);
  s.full = full; s.root.classList.toggle('fx-mode-full', !!full);
  s.list.hidden = full || inSubpage;
  s.footer.hidden = full || inSubpage || (!s.slots.length && !s.finished);
  s.more.hidden = !s.pauseAutomatic;
  if (inSubpage && s.toolbar) s.toolbar.hidden = true;
  const hasHeaderViewMenu = !!document.querySelector('button[aria-controls="library-view-menu"]');
  const titlePicker = s.root.querySelector('.fx-title-picker');
  if (titlePicker && !inSubpage) titlePicker.hidden = hasHeaderViewMenu;
  s.root.hidden = !!(full && s.route.page !== 'home' && hasHeaderViewMenu && !s.failed);
  s.filterToggle.disabled=full||!s.inventory;s.matchCount.hidden=full||inSubpage;if(full||inSubpage)s.panel.hidden=true;
  s.toggle.textContent = full ? 'Discover shelves' : s.route.page === 'home' ? 'Normal home' : 'Full library';
  syncNative(s, !(full || s.failed));
  syncPageHero(s);
  if (remember) { try { localStorage.setItem(prefKey(s.api, s.route.page), full ? 'native' : 'discover'); } catch { s.status.textContent = 'View preference could not be saved in this browser.'; } }
  syncHomeModeAttr(s.api);
  if (!s.started) initialize(s);
  else if (!full && !inSubpage && s.planner && !s.slots.filter(slot => !slot.boot).length) loadMore(s);
  if (!full && !inSubpage) scheduleScroll();
}
async function nextRow(s) {
  if(s.filteredQueue)return s.filteredQueue.shift()||null;
  const opening=s.profile.opening || [];
  while((s.openingIndex||0)<opening.length){
    const token=opening[s.openingIndex||0];s.openingIndex=(s.openingIndex||0)+1;
    if(token.startsWith('anchor:')){
      const id=token.slice(7);
      try{const row=await s.client.anchor(id,s.route,s.inventory,s.config);if(row.items.length){s.anchorTurn=false;return row;}}
      catch{s.client.assertCurrent();}
    }else{
      const row=token.startsWith('rule:')?s.planner.take(token):s.planner.shelves.some(r=>r.family===token.slice(7))?s.planner.next(token.slice(7)):null;
      if(row){s.anchorTurn=true;return row;}
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
      const row = s.planner.next(s.anchorIndex <= s.profile.anchors.length && (s.anchorIndex > 0 || opening.some(t => t.startsWith('anchor:'))) && s.slots.filter(slot => !slot.boot).length < s.profile.anchors.length * 2 ? 'theme' : null);
      if (row) return row;
      if (s.anchorIndex >= s.profile.anchors.length) return null;
    }
  }
  return null;
}
async function loadMore(s, automatic = false) {
  if (state !== s || s.loading || s.full || s.finished || !s.planner || (automatic && (s.pauseAutomatic || s.subpageActive || s.route?.cat))) return;
  s.loading = true; s.more.disabled = true; s.more.textContent = 'Loading…';
  try {
    let placedIndex = s.slots.filter(slot => !slot.boot).length;
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
          const curIdx = s.slots.indexOf(existingBoot);
          if (curIdx !== -1 && curIdx !== placedIndex) {
            s.slots.splice(curIdx, 1);
            const clamped = Math.min(placedIndex, s.slots.length);
            const refSlot = s.slots[clamped];
            if (refSlot?.node?.parentElement === s.list) s.list.insertBefore(existingBoot.node, refSlot.node);
            else s.list.append(existingBoot.node);
            s.slots.splice(clamped, 0, existingBoot);
          }
          placedIndex++;
          fillSlot(existingBoot, s);
        } else {
          appendRow(hydratedRow, s, false, placedIndex++);
        }
        s.failed = false;
        s.footer.hidden = s.full || s.subpageActive || Boolean(s.route?.cat);
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
    const inSubpage = Boolean(s.subpageActive || s.route?.cat);
    if ((s.slots.length || s.filteredQueue) && !s.full) {
      s.failed = false;
      s.filterToggle.disabled = !s.inventory;
      s.list.hidden = inSubpage;
      s.footer.hidden = inSubpage;
      syncNative(s, true);
      writeBootRows(s);
    }
    if (!s.slots.length) {
      if (!s.filteredQueue) { s.failed = true; syncNative(s, false); }
      s.status.textContent = s.filteredQueue ? 'No matching titles. Clear a filter to broaden your search.' : 'No matching shelves. The normal Jellyfin view is still available. Try fewer filters in Customize.';
    }
    s.more.hidden = true;
    s.note.textContent = s.finished ? "You've reached the bottom of the page! Congratulations!" : '';
    if (!inSubpage) virtualize(s);
  } catch {
    if (state === s) {
      s.pauseAutomatic = true;
      s.footer.hidden = s.full || s.subpageActive || Boolean(s.route?.cat);
      s.more.hidden = false;
      s.status.textContent = 'Could not load the next shelves. Your existing rows are intact. Use Try again or the normal view.';
    }
  } finally {
    s.loading = false;
    s.initialHydrateSkip = false;
    if (state === s) { s.more.disabled = false; s.more.textContent = s.pauseAutomatic ? 'Try again' : 'Load more'; s.more.hidden = !s.pauseAutomatic; }
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
  if (s.route.cat) {
    s.subpageActive = true;
    s.subpageKey = s.route.cat;
    document.documentElement?.setAttribute?.('data-fx-subpage', 'true');
    if (s.toolbar) s.toolbar.hidden = true;
    s.list.hidden = true;
    s.footer.hidden = true;
  }
  try {
    let localError;
    try {
      s.config = readConfig(s.api);
    } catch (e) { localError = e; }
    let paintedBootConfigStr = '';
    let paintedBoot = false;
    if (s.config && !s.full && !s.route.cat) {
      s.profile = s.config.pages[s.route.page];
      const cfgStr = JSON.stringify(s.config);
      const earlySaved = savedFeeds.get(s.key);
      if (earlySaved && Date.now() - earlySaved.at < 30 * 60000 && earlySaved.config === cfgStr && earlySaved.rows?.length) {
        if (earlySaved.shuffle) s.shuffle = earlySaved.shuffle;
        earlySaved.rows.slice(0, 4).forEach(row => appendRow(row, s, true));
        paintedBoot = true;
        paintedBootConfigStr = cfgStr;
      } else {
        const bootData = readBootRows(s, cfgStr);
        if (bootData?.rows?.length) {
          if (bootData.shuffle) s.shuffle = bootData.shuffle;
          bootData.rows.forEach(row => appendRow(row, s, true));
          paintedBoot = true;
          paintedBootConfigStr = cfgStr;
        }
      }
      if (!paintedBoot) renderSkeletonRows(s, 3);
      syncNative(s, true);
    } else if (s.config && !s.full) {
      s.profile = s.config.pages[s.route.page];
      syncNative(s, true);
    }
    if (!s.full && s.route.view !== 'genres') {
      s.client.prefetchContinueWatching(s.route, Math.min(s.config?.cardsPerShelf || 20, 20));
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
    const finalCfgStr = JSON.stringify(s.config);
    if (paintedBoot && paintedBootConfigStr && paintedBootConfigStr !== finalCfgStr) {
      s.slots.filter(sl => sl.boot).forEach(sl => sl.node.remove());
      s.slots = s.slots.filter(sl => !sl.boot);
      paintedBoot = false;
    }
    if (!s.full && !paintedBoot && !s.route.cat) {
      const bootData = readBootRows(s, finalCfgStr);
      if (bootData?.rows?.length) {
        if (bootData.shuffle) s.shuffle = bootData.shuffle;
        bootData.rows.forEach(row => appendRow(row, s, true));
        paintedBoot = true;
        syncNative(s, true);
      } else if (s.route.view !== 'genres') {
        s.client.fastOpening(s.route, s.config).then(fastRows => {
          if (state !== s || s.full || s.failed || s.planner || s.slots.length || s.subpageActive || !fastRows?.length) return;
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
    syncPageHero(s);
    decorateNative(s);
    syncHeroAndDetailRatings(s.api);
    const trackingTask = s.client.tracking(s.inventory.items).then(async arrival => {
      if (state !== s) return;
      s.tracking = arrival.records instanceof Map ? arrival.records : new Map();
      s.trackingReady = arrival.ready;
      s.inventory.tracking = s.tracking;
      if (arrival.ready) writeTrackingCache(s.scope, s.tracking);
      decorateNative(s);
      refreshSlotBadges(s);
      let updatedRecent = false;
      for (const recentKey of ['RecentlyAddedMovies', 'RecentlyAddedShows']) {
        const slot = s.slots.find(sl => !sl.boot && sl.data?.key === recentKey);
        if (slot) {
          try {
            const freshRow = await s.client.anchor(recentKey, s.route, s.inventory, s.config);
            if (state !== s || !freshRow?.items?.length) continue;
            const prevIds = (slot.data.items || []).map(i => i.Id).join(',');
            const nextIds = freshRow.items.map(i => i.Id).join(',');
            slot.data = freshRow;
            if (prevIds !== nextIds) {
              if (slot.live) fillSlot(slot, s);
              updatedRecent = true;
            }
          } catch {}
        }
      }
      if (updatedRecent) writeBootRows(s);
      if (s.subpageActive && (s.subpageKey === 'RecentlyAddedMovies' || s.subpageKey === 'RecentlyAddedShows')) {
        openCategorySubpage(s, s.subpageKey, null, false);
      }
    }).catch(() => {
      if (state !== s) return;
      s.trackingReady = false;
      s.warnings.add('Arrival badges are unavailable until the Discovery Companion is installed and its baseline is ready.');
      if (!s.loading) s.status.textContent = [...s.warnings].join(' ');
    });
    const saved=savedFeeds.get(s.key);
    if(saved&&Date.now()-saved.at<30*60000&&saved.config===finalCfgStr){restoreFeed(s,saved);s.status.textContent=[...s.warnings].join(' ');}
    else{preparePlanner(s);filterPanel(s);s.status.textContent='';s.initialHydrateSkip=true;await loadMore(s);}
    if (s.route.cat) openCategorySubpage(s, s.route.cat, null, false);
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
function showToast(text) {
  let toast = document.querySelector('.fx-toast');
  if (!toast) {
    toast = element('div', 'fx-toast');
    toast.setAttribute('role', 'status');
    document.body.append(toast);
  }
  toast.textContent = text;
  toast.classList.add('is-visible');
  clearTimeout(toast._fxTimer);
  toast._fxTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2400);
}
function triggerUrlDownload(url, filename = '') {
  const a = element('a');
  a.href = url;
  a.setAttribute('download', filename || '');
  a.rel = 'noopener noreferrer';
  if (isCompactTouchViewport()) a.target = '_blank';
  document.body.append(a);
  a.click();
  a.remove();
}
function normalizeMp4DownloadItem(itemObj, itemId, finalBase, finalFilename, serverId) {
  const base = itemObj && typeof itemObj === 'object' ? { ...itemObj } : { Id: itemId, Name: finalBase, ServerId: serverId };
  base.Container = 'mp4';
  base.Path = finalFilename;
  if (Array.isArray(base.MediaSources)) {
    base.MediaSources = base.MediaSources.map(ms => ms && typeof ms === 'object' ? {
      ...ms,
      Container: 'mp4',
      Path: finalFilename,
      SupportsDirectStream: true,
      SupportsDirectPlay: true
    } : ms);
  }
  return base;
}
function isQuickTimeNativeMp4(itemObj) {
  if (!itemObj || typeof itemObj !== 'object') return false;
  const ms = Array.isArray(itemObj.MediaSources) ? itemObj.MediaSources[0] : null;
  const container = String(ms?.Container || itemObj.Container || '').toLowerCase();
  if (container !== 'mp4' && container !== 'm4v' && container !== 'mov') return false;
  const streams = Array.isArray(ms?.MediaStreams) ? ms.MediaStreams : [];
  if (!streams.length) return true;
  const video = streams.find(s => s?.Type === 'Video');
  const audio = streams.find(s => s?.Type === 'Audio');
  const vOk = !video || /^(h264|avc1|hevc|hvc1|hev1)$/i.test(String(video.Codec || ''));
  const aOk = !audio || /^(aac|mp3|ac3|eac3|alac)$/i.test(String(audio.Codec || ''));
  return vOk && aOk;
}
function buildMp4RemuxUrl(itemId, api) {
  const token = api?.accessToken?.() || '';
  const params = {
    Static: 'false',
    VideoCodec: 'h264',
    AudioCodec: 'aac',
    AllowVideoStreamCopy: 'true',
    AllowAudioStreamCopy: 'true',
    EnableAutoStreamCopy: 'true',
    VideoBitRate: '40000000',
    MaxStreamingBitrate: '60000000',
    AudioBitRate: '256000',
    MaxAudioChannels: '2',
    TranscodingProtocol: 'http',
    TranscodingContainer: 'mp4',
    PlaySessionId: 'fx-dl-full-' + Date.now(),
    ...(token ? { api_key: token } : {})
  };
  const path = `Videos/${encodeURIComponent(itemId)}/stream.mp4`;
  const raw = api?.getUrl?.(path, params);
  if (typeof raw === 'string') return safeUrl(raw, location.href) || raw;
  const qs = new URLSearchParams(params).toString();
  const rel = `/${path}${qs ? '?' + qs : ''}`;
  return safeUrl(rel, location.href) || rel;
}
async function startMediaDownload({ url, itemId, baseTitle, filename, cachedItem, api, mode = 'condensed' }) {
  let absUrl = safeUrl(url, location.href) || url;
  const nativeShell = window.NativeShell;
  const hasNativeDownloader = Boolean(nativeShell && (typeof nativeShell.downloadFiles === 'function' || typeof nativeShell.downloadFile === 'function'));
  const mobileClient = hasNativeDownloader || isTouchMobileDevice();
  let itemObj = cachedItem || state?.byId?.get(itemId) || state?.inventory?.items?.find(i => i.Id === itemId) || null;
  const uid = api?.getCurrentUserId?.();
  if (mobileClient && (!itemObj || (!itemObj.Container && !itemObj.MediaSources)) && uid && typeof api?.getJSON === 'function' && typeof api?.getUrl === 'function') {
    try {
      const fullInfo = await api.getJSON(api.getUrl(`Users/${encodeURIComponent(uid)}/Items/${encodeURIComponent(itemId)}`));
      if (fullInfo && typeof fullInfo === 'object') itemObj = fullInfo;
    } catch {}
  }
  if (mobileClient && mode === 'full' && !isQuickTimeNativeMp4(itemObj)) {
    absUrl = buildMp4RemuxUrl(itemId, api);
  }
  const finalBase = formatItemDownloadBase(itemObj) || baseTitle || 'video';
  const rawFilename = filename || `${finalBase}.mp4`;
  const finalFilename = rawFilename.replace(/\.[a-z0-9]{2,5}$/i, '') + '.mp4';
  if (hasNativeDownloader) {
    const serverId = itemObj?.ServerId || api?.serverId?.() || '';
    const mp4Item = normalizeMp4DownloadItem(itemObj, itemId, finalBase, finalFilename, serverId);
    const payload = {
      url: absUrl,
      item: mp4Item,
      itemId,
      serverId,
      container: 'mp4',
      title: itemObj?.Name || finalBase,
      filename: finalFilename
    };
    if (typeof nativeShell.downloadFiles === 'function') {
      await nativeShell.downloadFiles([payload]);
    } else {
      await nativeShell.downloadFile(payload);
    }
    showToast('Added to Jellyfin Downloads');
    return;
  }
  triggerUrlDownload(absUrl, mobileClient ? finalFilename : (filename || finalFilename));
}
function openDownloadMenu(btn, itemId, api) {
  if (downloadMenu && downloadMenuTrigger === btn) {
    closeDownloadMenu();
    return;
  }
  closeDownloadMenu();
  downloadMenuTrigger = btn;
  let baseTitle = inferDownloadTitle(itemId, btn);
  let resolvedItem = state?.byId?.get(itemId) || state?.inventory?.items?.find(i => i.Id === itemId) || null;
  const token = api.accessToken?.() || '';
  const resolveApiUrl = (path, params) => {
    const raw = api.getUrl?.(path, params);
    if (typeof raw === 'string') return safeUrl(raw, location.href) || raw;
    const qs = new URLSearchParams(params || {}).toString();
    const rel = `/${String(path).replace(/^\/+/, '')}${qs ? '?' + qs : ''}`;
    return safeUrl(rel, location.href) || rel;
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
  const makeOption = (title, url, mode) => {
    const opt = element('button', 'fx-download-option', title);
    opt.type = 'button';
    opt.dataset.downloadUrl = url;
    opt.setAttribute('download', fileFor());
    opt.setAttribute('role', 'menuitem');
    opt.addEventListener('click', ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const filename = fileFor();
      opt.setAttribute('download', filename);
      closeDownloadMenu();
      startMediaDownload({ url, itemId, baseTitle, filename, cachedItem: resolvedItem, api, mode });
    });
    return opt;
  };

  const fullOpt = makeOption('Full Quality', fullUrl, 'full');
  const condensedOpt = makeOption('Condensed', transcodeUrl, 'condensed');
  menu.append(fullOpt, condensedOpt);
  const uid = api.getCurrentUserId?.();
  if (uid && typeof api.getJSON === 'function' && typeof api.getUrl === 'function') {
    Promise.resolve(api.getJSON(api.getUrl(`Users/${encodeURIComponent(uid)}/Items/${encodeURIComponent(itemId)}`)))
      .then(info => {
        if (info && typeof info === 'object') {
          resolvedItem = info;
          const isMob = Boolean(window.NativeShell && (typeof window.NativeShell.downloadFiles === 'function' || typeof window.NativeShell.downloadFile === 'function')) || isTouchMobileDevice();
          if (isMob && !isQuickTimeNativeMp4(info)) {
            fullOpt.dataset.downloadUrl = buildMp4RemuxUrl(itemId, api);
          }
        }
        const refined = formatItemDownloadBase(info);
        if (refined) {
          baseTitle = refined;
          fullOpt.setAttribute('download', fileFor());
          condensedOpt.setAttribute('download', fileFor());
        }
      })
      .catch(() => {});
  }
  positionDropdownMenu(menu, btn, 8, 200);
}
function positionDropdownMenu(menu, triggerEl, offsetY = 8, estWidth = 200) {
  const detailHost = triggerEl?.closest?.('#itemDetailPage');
  const isFixedDetail = Boolean(detailHost && getComputedStyle(detailHost).position === 'fixed');
  const host = isFixedDetail ? detailHost : document.body;
  host.append(menu);
  downloadMenu = menu;
  const rect = typeof triggerEl?.getBoundingClientRect === 'function' ? triggerEl.getBoundingClientRect() : null;
  if (rect && (rect.width > 0 || rect.height > 0)) {
    if (isFixedDetail) {
      const hRect = typeof detailHost.getBoundingClientRect === 'function' ? detailHost.getBoundingClientRect() : { top: 0, left: 0 };
      const top = Math.max(12, Math.round(rect.bottom - (hRect.top || 0) + (detailHost.scrollTop || 0) + offsetY));
      const maxLeft = Math.max(12, (detailHost.clientWidth || window.innerWidth || 390) - estWidth - 12);
      const left = Math.min(maxLeft, Math.max(12, Math.round(rect.left - (hRect.left || 0) + (detailHost.scrollLeft || 0))));
      menu.style.top = `${top}px`;
      menu.style.left = `${left}px`;
    } else {
      const docY = window.scrollY ?? window.pageYOffset ?? document.documentElement?.scrollTop ?? 0;
      const docX = window.scrollX ?? window.pageXOffset ?? document.documentElement?.scrollLeft ?? 0;
      const top = Math.max(12, Math.round(rect.bottom + docY + offsetY));
      const maxLeft = Math.max(12, (window.innerWidth || 1280) + docX - estWidth - 12);
      const left = Math.min(maxLeft, Math.max(12, Math.round(rect.left + docX)));
      menu.style.top = `${top}px`;
      menu.style.left = `${left}px`;
    }
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
  positionDropdownMenu(menu, seasonWrap, 6, 215);
}
function download(name, obj) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' }));
  const a = element('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function buildSettingsContent(s, container, isDialog = true) {
  const title = element(isDialog ? 'h2' : 'h1', isDialog ? '' : 'sectionTitle', 'Customize Home');
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
  if(isDialog){
    actions.replaceChildren(apply,button('Cancel',closeDialog));
    container.append(title,help,device,visual,advanced,error,actions);
  }else{
    actions.replaceChildren(apply);
    const headCard=element('section','verticalSection fx-home-studio-head');
    headCard.append(title,help,device);
    const saveCard=element('section','verticalSection fx-home-studio-save');
    saveCard.append(error,actions);
    container.append(headCard,visual,advanced,saveCard);
  }
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
  try{const profile=await s.client.preferences();s.config=profile.config?validateConfig(upgradeLegacyConfig(profile.config)):s.config;s.profileVersion=profile.version;s.syncAvailable=true;}catch{s.client.assertCurrent();}
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
  if(settingsScope&&scope!==settingsScope){
    closeDialog();
    document.querySelectorAll('[data-fx-settings-link],[data-fx-home-studio]').forEach(n=>n.remove());
  }
  settingsScope=scope;
  document.querySelectorAll('[data-fx-settings-link]').forEach(n=>n.remove());
  if(!scope)return;
  if(/^#!?\/?mypreferenceshome(?:[?]|$)/i.test(location.hash)){
    const homePref=[...document.querySelectorAll('#homeScreenPreferencesPage,.homeScreenPreferencesPage')].find(visible);
    if(homePref&&!homePref.querySelector('[data-fx-home-studio]')){
      const container=homePref.querySelector('.readOnlyContent')||homePref.querySelector('.content-primary')||homePref;
      const nativeForm=container.querySelector('form,.homeScreenSettingsContainer');
      if(nativeForm&&!nativeForm.closest('.fx-legacy-home-settings')){
        const details=element('details','fx-legacy-home-settings');
        const summary=element('summary','','Legacy Jellyfin Home sections (used only when Normal Home is active)');
        nativeForm.before(details);
        details.append(summary,nativeForm);
      }
      const host=element('div');
      host.dataset.fxHomeStudio='true';
      container.prepend(host);
      mountInlineSettings(host,api);
    }
  }
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
function guardMicroLogos() {
  for (const img of document.querySelectorAll('.sleekfin-hero img[src*="/Images/Logo"], #itemDetailPage img[src*="/Images/Logo"]')) {
    if (img._fxLogoGuarded) continue;
    img._fxLogoGuarded = true;
    const check = () => {
      if (img.complete && img.naturalWidth > 0 && (img.naturalWidth < 180 || img.naturalHeight < 30)) {
        img.style.display = 'none';
        img.dispatchEvent(new Event('error'));
      }
    };
    if (img.complete) check();
    else img.addEventListener('load', check, { once: true });
  }
}
function cleanup(preserve=true) {
  generation++;
  if(selectHold){clearTimeout(selectHold.timer);selectHold=null;}
  closeDialog();
  document.documentElement?.removeAttribute?.('data-fx-subpage');
  document.documentElement?.removeAttribute?.('data-fx-page-hero');
  if (!state) return;
  stopPageHeroTimer(state);
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
const LIVETV_TABS = [
  { idx: '0', label: 'On Now' },
  { idx: '1', label: 'Guide' },
  { idx: '2', label: 'Channels' },
  { idx: '3', label: 'Recordings' },
  { idx: '4', label: 'Schedule' }
];
function syncLiveTvUi() {
  const page = document.getElementById('liveTvSuggestedPage');
  if (!page || !visible(page)) return;
  const host = page.querySelector('.liveTvContainer') || page;
  let bar = host.querySelector('.fx-livetv-bar');
  const q = new URLSearchParams(String(location.hash || '').split('?')[1] || '');
  const activeTab = q.get('tab') || '0';
  if (!bar) {
    bar = element('div', 'fx-livetv-bar');
    const title = element('h1', 'fx-livetv-title', 'Live TV');
    const pills = element('div', 'fx-livetv-tabs');
    pills.setAttribute('role', 'tablist');
    pills.setAttribute('aria-label', 'Live TV sections');
    for (const t of LIVETV_TABS) {
      const btn = element('button', 'fx-livetv-tab', t.label);
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.dataset.livetvTab = t.idx;
      btn.addEventListener('click', ev => {
        ev.preventDefault();
        ev.stopPropagation();
        const curQ = new URLSearchParams(String(location.hash || '').split('?')[1] || '');
        curQ.set('tab', t.idx);
        const basePath = (String(location.hash || '#/livetv').split('?')[0]) || '#/livetv';
        scrollToTop();
        location.hash = `${basePath}?${curQ}`;
        const nativeTabBtn = document.querySelector(`.emby-tabs-slider .emby-tab-button[data-index="${t.idx}"]`);
        if (nativeTabBtn) {
          try { nativeTabBtn.click(); } catch {}
        }
        syncLiveTvUi();
      });
      pills.append(btn);
    }
    bar.append(title, pills);
    host.prepend(bar);
  }
  bar.querySelectorAll('.fx-livetv-tab').forEach(btn => {
    const isSel = btn.dataset.livetvTab === activeTab;
    btn.classList.toggle('is-active', isSel);
    btn.setAttribute('aria-selected', isSel ? 'true' : 'false');
  });
}
function reconcile() {
  clearTimeout(timer); timer = 0;
  if (stopped) return;
  const api = window.ApiClient, route = routeInfo(location.hash);
  syncSettings(api);
  syncLibraryViewMenu();
  syncLiveTvUi();
  syncMobileOverflowDrawer(api);
  syncHomeModeAttr(api);
  syncDocumentStateAttrs();
  anchorOpenPopovers();
  syncSearchPage(api);
  guardMicroLogos();
  syncHeroAndDetailRatings(api);
  if (!api?.getCurrentUserId?.()) {cleanup(false);savedFeeds.clear();snapshots.clear();heroMemoryCache.clear();lastScope='';searchUiState.tracking=null;searchUiState.trackingScope='';return;}
  if(!route){if(state)cleanup();else if(!/^#\/mypreferencesmenu(?:[?]|$)/i.test(location.hash))closeDialog();return;}
  if(route.serverId && route.serverId.toLowerCase() !== (api.serverId?.() || '').toLowerCase()){cleanup();return;}
  const target = locate(route), scope = scopeKey(api);
  if(lastScope&&lastScope!==scope){cleanup(false);savedFeeds.clear();snapshots.clear();heroMemoryCache.clear();}
  lastScope=scope;
  if (!target) { if (state) cleanup(); return; }
  const key = `${scope}:${route.page}:${route.parentId}:${route.view||'home'}`;
  if (state?.key === key && state.root.isConnected && state.page === target.page) {
    if (state.native !== target.native) {
      state.native = target.native;
    }
    state.route = route;
    const hasHeaderViewMenu = !!document.querySelector('button[aria-controls="library-view-menu"]');
    const titlePicker = state.root.querySelector('.fx-title-picker');
    if (titlePicker && !state.subpageActive) titlePicker.hidden = hasHeaderViewMenu;
    state.root.hidden = !!(state.full && state.route.page !== 'home' && hasHeaderViewMenu && !state.failed);
    if(!state.full && !state.failed)syncNative(state,true);
    syncCategorySubpage(state, route.cat || '');
    syncPageHero(state);
    decorateNative(state);
    return;
  }
  cleanup();
  const token = generation;
  const nowDate = new Date();
  const initialDay = dayInZone(nowDate, DEFAULT_CONFIG?.timeZone || 'America/Los_Angeles');
  const root = element('div', 'fx-discovery'), toolbar = element('div', 'fx-toolbar'), list = element('div'), status = element('p', 'fx-status'), footer = element('div', 'fx-footer'), panel=element('div','fx-filters'),matchCount=element('p','fx-match-count');panel.hidden=true;
  status.setAttribute('role', 'status');
  const s = { ...target, api, scope, key, route, root, toolbar, list, status, footer, panel, matchCount,token, now: nowDate, slots: [], badges: new Map(), tracking:readTrackingCache(scope),filters:cloneJson(DEFAULT_FILTERS),warnings: new Set(), anchorIndex: 0, anchorTurn: true, started: false, loading: false, full: false, failed: false, subpageActive: false, subpageKey: '', savedSubpageScroll: 0, shuffle: getSessionShuffle(scope, route.page, initialDay) };
  s.client = new JellyfinClient(api, () => state === s && generation === token && root.isConnected);
  s.toggle = button(route.page === 'home' ? 'Normal home' : 'Full library', () => setMode(s, !s.full));
  s.more = button('Load more', () => { s.pauseAutomatic = false; loadMore(s); });
  s.more.hidden = true;
  s.note = element('p', '', '');
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
  document.querySelectorAll('.mainDrawer-backdrop,.backdrop-open,.MuiDrawer-root .MuiBackdrop-root,[data-sleekfin-header-overflow-backdrop]').forEach(b=>{
    try{if(getComputedStyle(b).display!=='none'&&getComputedStyle(b).visibility!=='hidden')b.click?.();}catch{}
  });
  document.querySelectorAll('[data-sleekfin-header-overflow-toggle][aria-expanded="true"]').forEach(t=>{
    try{t.click?.();}catch{}
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
  const searchTrigger = event.target.closest?.('[data-fx-mobile-search="true"], [data-sleekfin-header-proxy] button[data-sleekfin-header-proxy-item="jellyfin:search"], [data-sleekfin-header-overflow-drawer] [data-sleekfin-header-overflow-item="jellyfin:search"], .skinHeader .headerSearchButton');
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
  const target=event.target.closest?.('[data-sleekfin-header-proxy-item],[data-sleekfin-header-overflow-item],a[href]');if(!target)return;
  const proxy=target.getAttribute('data-sleekfin-header-proxy-item')||target.getAttribute('data-sleekfin-header-overflow-item')||'';
  if(proxy==='fx:settings')return;
  const targetLabel=(target.getAttribute('aria-label')||target.getAttribute('title')||target.textContent||'').trim().toLowerCase();
  let route=null;
  if(proxy==='jellyfin:movies')route='#/movies';
  else if(proxy==='jellyfin:shows')route='#/tv';
  else if(proxy==='jellyfin:home')route='#/home';
  else if(proxy==='source:v1:164f41b42f7a4221084a13ce51114045'||targetLabel==='live tv')route='#/livetv';
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
      else if(label==='live tv')route='#/livetv';
    }
  }else{
    route=target.getAttribute('href');
  }
  if(!proxy&&!target.closest('header,.headerTabs,[data-sleekfin-header-proxy],[data-sleekfin-header-overflow-drawer]'))return;
  if(!route)return;
  const normalized=route.startsWith('#')?route:'#'+route.replace(/^\/+/,'/');
  if(/^#!?\/?(movies|tv|tvshows)(?:\.html)?(?:[?]|$)/i.test(normalized)){
    const [path,raw='']=normalized.split('?'),q=new URLSearchParams(raw);
    q.set('tab','1');
    q.delete('fxCat');
    event.preventDefault();event.stopImmediatePropagation?.();event.stopPropagation();
    closeDrawers();
    scrollToTop();
    location.hash=path+'?'+q;
    reconcile();
    setTimeout(closeDrawers,40);
    return;
  }
  if(proxy.startsWith('jellyfin:view:')||proxy==='jellyfin:home'||/^#!?\/?livetv(?:\.html)?(?:[?]|$)/i.test(normalized)){
    event.preventDefault();event.stopImmediatePropagation?.();event.stopPropagation();
    closeDrawers();
    scrollToTop();
    location.hash=normalized;
    reconcile();
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
  if (s && s.subpageActive && (key === 'Escape' || event.keyCode === 10009)) {
    event.preventDefault();
    event.stopPropagation();
    closeCategorySubpage(s, true);
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
      if(key==='ArrowLeft'){
        next=cards[Math.max(0,index-1)];
      }else{
        if(track?.dataset?.noLoop!=='true'&&index>=cards.length-3){
          track?._fxEnsureRight?.(600);
        }
        const updatedCards=[...track.querySelectorAll('.fx-card')];
        next=updatedCards[Math.min(updatedCards.length-1,index+1)];
      }
    }
    else{
      const nextSlot=s.slots[slotIndex+(key==='ArrowUp'?-1:1)];
      if(nextSlot){if(!nextSlot.live)fillSlot(nextSlot,s);const options=[...nextSlot.node.querySelectorAll('.fx-card')];next=options[Math.min(index,options.length-1)];}
      else if(key==='ArrowUp')next=s.page.querySelector('.sleekfin-hero button,.sleekfin-hero a[href],.fx-page-hero a[href],.fx-page-hero button')||s.root.querySelector('.fx-toolbar select');
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
const osdGesture = {
  holdTimer: 0,
  pillTimer: 0,
  streakTimer: 0,
  suppressClickUntil: 0,
  touching: false,
  moved: false,
  holdActive: false,
  savedRate: 1,
  activeVideo: null,
  startX: 0,
  startY: 0,
  startAt: 0,
  lastTap: null,
  streakZone: '',
  streakSec: 0
};
let savedVideoFullscreenHooks = null;
function shouldBlockNativeVideoFullscreen(videoEl) {
  if (stopped || !isTouchMobileDevice()) return false;
  if (findActiveOsdVideo()) return true;
  return Boolean(videoEl?.classList?.contains?.('htmlvideoplayer') || videoEl?.closest?.('#videoOsdPage, .videoPlayerContainer'));
}
function installNativeFullscreenGuard() {
  const VideoCtor = window.HTMLVideoElement || document.defaultView?.HTMLVideoElement || globalThis.HTMLVideoElement;
  const proto = VideoCtor?.prototype;
  if (!proto || savedVideoFullscreenHooks) return;
  savedVideoFullscreenHooks = {
    proto,
    hasEnter: Object.prototype.hasOwnProperty.call(proto, 'webkitEnterFullscreen'),
    enter: proto.webkitEnterFullscreen,
    hasEnterCap: Object.prototype.hasOwnProperty.call(proto, 'webkitEnterFullScreen'),
    enterCap: proto.webkitEnterFullScreen,
    hasMode: Object.prototype.hasOwnProperty.call(proto, 'webkitSetPresentationMode'),
    mode: proto.webkitSetPresentationMode
  };
  try {
    proto.webkitEnterFullscreen = function (...args) {
      if (shouldBlockNativeVideoFullscreen(this)) return;
      return savedVideoFullscreenHooks?.enter?.apply(this, args);
    };
    proto.webkitEnterFullScreen = function (...args) {
      if (shouldBlockNativeVideoFullscreen(this)) return;
      return savedVideoFullscreenHooks?.enterCap?.apply(this, args);
    };
    if (typeof savedVideoFullscreenHooks.mode === 'function') {
      proto.webkitSetPresentationMode = function (mode, ...rest) {
        if (mode === 'fullscreen' && shouldBlockNativeVideoFullscreen(this)) return;
        return savedVideoFullscreenHooks?.mode?.call(this, mode, ...rest);
      };
    }
  } catch {}
}
function restoreNativeFullscreenGuard() {
  if (!savedVideoFullscreenHooks) return;
  const { proto, hasEnter, enter, hasEnterCap, enterCap, hasMode, mode } = savedVideoFullscreenHooks;
  savedVideoFullscreenHooks = null;
  try {
    if (hasEnter) proto.webkitEnterFullscreen = enter; else delete proto.webkitEnterFullscreen;
    if (hasEnterCap) proto.webkitEnterFullScreen = enterCap; else delete proto.webkitEnterFullScreen;
    if (hasMode) proto.webkitSetPresentationMode = mode;
  } catch {}
}
function ensureOsdVideoPrepared(video) {
  if (!video) return;
  try {
    video.playsInline = true;
    video.setAttribute?.('playsinline', '');
    video.setAttribute?.('webkit-playsinline', '');
  } catch {}
  if (video._fxOsdPrepared) return;
  video._fxOsdPrepared = true;
  if (typeof video.webkitEnterFullscreen === 'function' && Object.prototype.hasOwnProperty.call(video, 'webkitEnterFullscreen')) {
    const orig = video.webkitEnterFullscreen;
    video.webkitEnterFullscreen = function (...args) {
      if (shouldBlockNativeVideoFullscreen(this)) return;
      return orig.apply(this, args);
    };
  }
  video.addEventListener?.('webkitbeginfullscreen', () => {
    if (shouldBlockNativeVideoFullscreen(video)) {
      try { video.webkitExitFullscreen?.(); } catch {}
    }
  });
  video.addEventListener?.('pause', () => {
    if (osdGesture.holdActive && osdGesture.activeVideo === video && !video.ended) {
      try {
        const p = video.play?.();
        if (p?.catch) p.catch(() => {});
      } catch {}
    }
  });
}
function findActiveOsdVideo() {
  const osd = document.getElementById('videoOsdPage');
  if (!osd || osd.classList.contains('hide') || osd.classList.contains('hidePage') || osd.hidden) return null;
  const v = document.querySelector('video.htmlvideoplayer') || osd.querySelector('video') || document.querySelector('.videoPlayerContainer video');
  if (v) ensureOsdVideoPrepared(v);
  return v;
}
function showOsdGesturePill(label, position = 'center', persistent = false) {
  let pill = document.querySelector('.fx-osd-gesture-pill');
  if (!pill) {
    pill = element('div', 'fx-osd-gesture-pill');
    pill.setAttribute('aria-live', 'polite');
    document.body.append(pill);
  }
  clearTimeout(osdGesture.pillTimer);
  pill.textContent = label;
  pill.dataset.pos = position;
  pill.classList.add('is-visible');
  if (!persistent) {
    osdGesture.pillTimer = setTimeout(() => {
      pill.classList.remove('is-visible');
    }, 720);
  }
}
function hideOsdGesturePill() {
  clearTimeout(osdGesture.pillTimer);
  const pill = document.querySelector('.fx-osd-gesture-pill');
  pill?.classList.remove('is-visible');
}
function releaseOsdSpeedHold() {
  clearTimeout(osdGesture.holdTimer);
  osdGesture.holdTimer = 0;
  if (osdGesture.holdActive) {
    const v = osdGesture.activeVideo;
    osdGesture.holdActive = false;
    osdGesture.activeVideo = null;
    if (v) {
      try { v.playbackRate = osdGesture.savedRate || 1; } catch {}
      try {
        if (v.paused && !v.ended) {
          const p = v.play?.();
          if (p?.catch) p.catch(() => {});
        }
      } catch {}
    }
    hideOsdGesturePill();
  }
}
const osdKeySkip = {
  timer: 0,
  streakTimer: 0,
  streakDir: '',
  streakSec: 0
};
const SKIP_CHEVRON_RIGHT_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>';
const SKIP_CHEVRON_LEFT_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>';
function showOsdSkipOverlay(direction, totalSec) {
  let overlay = document.querySelector('.fx-osd-skip-overlay');
  if (!overlay) {
    overlay = element('div', 'fx-osd-skip-overlay');
    overlay.setAttribute('aria-live', 'polite');
    const chevrons = element('div', 'fx-osd-skip-chevrons');
    const label = element('span', 'fx-osd-skip-label');
    overlay.append(chevrons, label);
    document.body.append(overlay);
  }
  const chevrons = overlay.querySelector('.fx-osd-skip-chevrons');
  const label = overlay.querySelector('.fx-osd-skip-label');
  const svg = direction === 'right' ? SKIP_CHEVRON_RIGHT_SVG : SKIP_CHEVRON_LEFT_SVG;
  if (chevrons && overlay.dataset.dir !== direction) {
    chevrons.innerHTML = `<span class="fx-skip-ch fx-skip-ch-1">${svg}</span><span class="fx-skip-ch fx-skip-ch-2">${svg}</span><span class="fx-skip-ch fx-skip-ch-3">${svg}</span>`;
  }
  overlay.dataset.dir = direction;
  if (label) {
    const absSec = Math.abs(totalSec);
    label.textContent = direction === 'right' ? `+${absSec}s` : `-${absSec}s`;
  }
  clearTimeout(osdKeySkip.timer);
  overlay.classList.remove('is-pulse');
  void overlay.offsetWidth;
  overlay.classList.add('is-visible', 'is-pulse');
  osdKeySkip.timer = setTimeout(() => {
    overlay.classList.remove('is-visible', 'is-pulse');
  }, 760);
}
function syncMuteButtonIcon(btn, muted) {
  if (!btn) return;
  const ic = btn.querySelector('.material-icons');
  if (ic) {
    ic.classList.toggle('volume_off', muted);
    ic.classList.toggle('volume_up', !muted);
  }
  btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
}
const osdPercentToLinearVolume = pct => Math.pow(Math.max(0, Math.min(100, Number(pct) || 0)) / 100, 3);
const osdLinearVolumeToPercent = vol => Math.min(100, Math.max(0, Math.round(100 * Math.pow(Math.max(0, Math.min(1, Number(vol) || 0)), 1 / 3))));
function setOsdVolumeAndSync(slider, video, volPercent, muted) {
  const clamped = Math.max(0, Math.min(100, Math.round(Number(volPercent) || 0)));
  if (video) {
    try { video.muted = Boolean(muted); } catch {}
    try { video.volume = osdPercentToLinearVolume(clamped); } catch {}
  }
  if (slider) {
    slider._fxInternalVol = true;
    try {
      slider.value = String(clamped);
      const lower = slider.parentElement?.querySelector?.('.mdl-slider-background-lower');
      if (lower) lower.style.width = `${clamped}%`;
      const Ev = typeof Event === 'function' ? Event : document.defaultView?.Event;
      if (Ev) {
        slider.dispatchEvent(new Ev('input', { bubbles: true }));
        slider.dispatchEvent(new Ev('change', { bubbles: true }));
      }
    } finally {
      slider._fxInternalVol = false;
    }
  }
  const muteBtn = document.querySelector('#videoOsdPage .buttonMute');
  syncMuteButtonIcon(muteBtn, Boolean(muted) || clamped <= 0);
}
function toggleOsdMuteWithMemory() {
  const osd = document.getElementById('videoOsdPage');
  const slider = osd?.querySelector?.('.osdVolumeSlider') || null;
  const video = findActiveOsdVideo();
  const sliderVal = slider ? Number(slider.value) : NaN;
  const curVol = Number.isFinite(sliderVal) ? sliderVal : osdLinearVolumeToPercent(video?.volume ?? 1);
  const isMuted = osdMuteState.muted || Boolean(video?.muted) || curVol <= 0;
  if (!isMuted) {
    osdMuteState.savedVolume = curVol > 0 ? curVol : (osdMuteState.savedVolume > 0 ? osdMuteState.savedVolume : 100);
    osdMuteState.muted = true;
    setOsdVolumeAndSync(slider, video, 0, true);
  } else {
    const restore = osdMuteState.savedVolume > 0 ? osdMuteState.savedVolume : 100;
    osdMuteState.muted = false;
    setOsdVolumeAndSync(slider, video, restore, false);
  }
}
function onOsdMuteClick(event) {
  if (stopped || !isVideoOsdOpen()) return;
  const muteBtn = event.target?.closest?.('#videoOsdPage .buttonMute');
  if (!muteBtn) return;
  event.preventDefault();
  event.stopImmediatePropagation?.();
  event.stopPropagation();
  toggleOsdMuteWithMemory();
}
function onOsdVolumeSliderInput(event) {
  if (stopped || !isVideoOsdOpen()) return;
  const slider = event.target?.closest?.('#videoOsdPage .osdVolumeSlider');
  if (!slider || slider._fxInternalVol) return;
  const val = Number(slider.value);
  if (!Number.isFinite(val)) return;
  const clamped = Math.max(0, Math.min(100, Math.round(val)));
  const video = findActiveOsdVideo();
  const lower = slider.parentElement?.querySelector?.('.mdl-slider-background-lower');
  if (lower) lower.style.width = `${clamped}%`;
  const muteBtn = document.querySelector('#videoOsdPage .buttonMute');
  if (clamped > 0) {
    osdMuteState.muted = false;
    osdMuteState.savedVolume = clamped;
    if (video) {
      try { if (video.muted) video.muted = false; } catch {}
      try { video.volume = osdPercentToLinearVolume(clamped); } catch {}
    }
    syncMuteButtonIcon(muteBtn, false);
  } else {
    osdMuteState.muted = true;
    if (video) {
      try { video.muted = true; video.volume = 0; } catch {}
    }
    syncMuteButtonIcon(muteBtn, true);
  }
}
function onOsdWheel(event) {
  if (stopped || !isVideoOsdOpen()) return;
  if (isOsdScrollableMenuTarget(event.target)) {
    // Allow scrolling inside open OSD dropdowns / Playback Info without triggering Jellyfin's wheel volume handler
    event.stopPropagation();
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation?.();
  event.stopPropagation();
}
function onOsdKeyDown(event) {
  if (stopped) return;
  const key = event.key;
  if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
  if (document.documentElement?.classList?.contains('layout-tv') || document.body?.classList?.contains('layout-tv')) return;
  const video = findActiveOsdVideo();
  if (!video) return;
  const target = event.target;
  if (target?.closest?.('input, select, textarea, [contenteditable="true"], [role="slider"], .mdl-slider, .dialog, .actionSheet, .sleekfin-menu-popup, .MuiPopover-root')) return;
  if (document.querySelector('.dialog:not(.hide):not(.sleekfin-menu-closing), .actionSheet:not(.hide):not(.sleekfin-menu-closing), .MuiPopover-root:not([aria-hidden="true"]):not(.MuiModal-hidden)')) return;
  if (key === 'm' || key === 'M') {
    toggleOsdMuteWithMemory();
    event.preventDefault();
    event.stopImmediatePropagation?.();
    event.stopPropagation();
    return;
  }
  if (key !== 'ArrowRight' && key !== 'ArrowLeft') return;
  const direction = key === 'ArrowRight' ? 'right' : 'left';
  const delta = direction === 'right' ? 30 : -30;
  const dur = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : Infinity;
  const cur = Number(video.currentTime) || 0;
  const nextTime = Math.max(0, Math.min(dur, cur + delta));
  try { video.currentTime = nextTime; } catch {}
  if (osdKeySkip.streakDir === direction) {
    osdKeySkip.streakSec += delta;
  } else {
    osdKeySkip.streakDir = direction;
    osdKeySkip.streakSec = delta;
  }
  clearTimeout(osdKeySkip.streakTimer);
  osdKeySkip.streakTimer = setTimeout(() => {
    osdKeySkip.streakDir = '';
    osdKeySkip.streakSec = 0;
  }, 900);
  showOsdSkipOverlay(direction, osdKeySkip.streakSec);
  event.preventDefault();
  event.stopImmediatePropagation?.();
  event.stopPropagation();
}
function isOsdInteractiveTarget(target) {
  return Boolean(target?.closest?.('button, a, input, select, textarea, [role="slider"], [role="button"], [role="menuitem"], .mdl-slider, .mdl-slider-container, .paper-icon-button-light, .skinHeader, .headerBackButton, .headerLeft, .headerRight, .videoOsdBottom, .osdControls, .osdHeader, .upNextContainer, .playerStats, .playerStats-closeButton, .dialog, .dialogContainer, .dialogBackdrop, .actionSheet, .sleekfin-menu-popup, .sleekfin-popup-layer, .MuiPopover-root, .fx-download-menu'));
}
function isOsdScrollableMenuTarget(target) {
  return Boolean(target?.closest?.('.dialog, .dialogContainer, .actionSheet, .actionSheetScroller, .sleekfin-menu-popup, .playerStats, .smoothScrollY, .fx-download-menu'));
}
function isOsdSliderTarget(target) {
  return Boolean(target?.closest?.('[role="slider"], .mdl-slider, .mdl-slider-container, input[type="range"]'));
}
const osdTouchLock = {
  active: false,
  startX: 0,
  startY: 0,
  onInteractive: false,
  onScrollable: false,
  onSlider: false
};
function onOsdScrollGuard() {
  if (stopped || !isVideoOsdOpen()) return;
  if ((window.scrollY || 0) !== 0 || (document.documentElement?.scrollTop || 0) !== 0 || (document.body?.scrollTop || 0) !== 0) {
    try { window.scrollTo(0, 0); } catch {}
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }
}
function onOsdTouchStart(event) {
  if (!event.touches || event.touches.length !== 1) {
    releaseOsdSpeedHold();
    osdGesture.touching = false;
    osdTouchLock.active = false;
    return;
  }
  const osdOpen = isVideoOsdOpen();
  const t = event.touches[0];
  if (osdOpen) {
    osdTouchLock.active = true;
    osdTouchLock.startX = t.clientX;
    osdTouchLock.startY = t.clientY;
    osdTouchLock.onInteractive = isOsdInteractiveTarget(event.target);
    osdTouchLock.onScrollable = isOsdScrollableMenuTarget(event.target);
    osdTouchLock.onSlider = isOsdSliderTarget(event.target);
  } else {
    osdTouchLock.active = false;
  }
  const video = findActiveOsdVideo();
  if (!video || osdTouchLock.onInteractive) return;
  const vw = window.innerWidth || document.documentElement?.clientWidth || 0;
  if (!vw) return;
  osdGesture.touching = true;
  osdGesture.moved = false;
  osdGesture.startX = t.clientX;
  osdGesture.startY = t.clientY;
  osdGesture.startAt = Date.now();
  clearTimeout(osdGesture.holdTimer);
  if (t.clientX >= vw * 0.72 || t.clientX <= vw * 0.28) {
    osdGesture.holdTimer = setTimeout(() => {
      if (!osdGesture.touching || osdGesture.moved || osdGesture.holdActive) return;
      const v = findActiveOsdVideo();
      if (!v || v.ended) return;
      ensureOsdVideoPrepared(v);
      osdGesture.holdActive = true;
      osdGesture.activeVideo = v;
      osdGesture.savedRate = Number.isFinite(v.playbackRate) && v.playbackRate > 0 ? v.playbackRate : 1;
      try { v.playbackRate = 2; } catch {}
      try {
        if (v.paused && !v.ended) {
          const p = v.play?.();
          if (p?.catch) p.catch(() => {});
        }
      } catch {}
      showOsdGesturePill('2× Speed ▸▸', 'top', true);
    }, 320);
  }
}
function onOsdTouchMove(event) {
  if (event._fxOsdMoveHandled) return;
  event._fxOsdMoveHandled = true;
  if (isVideoOsdOpen()) {
    const t = event.touches?.[0];
    const dx = t ? t.clientX - osdTouchLock.startX : 0;
    const dy = t ? t.clientY - osdTouchLock.startY : 0;
    const dist = Math.hypot(dx, dy);
    if (osdGesture.holdActive) {
      if (event.cancelable) event.preventDefault();
    } else if (osdTouchLock.onScrollable || isOsdScrollableMenuTarget(event.target)) {
      // Allow vertical scrolling inside open OSD popups & playback info overlay
    } else if (osdTouchLock.onSlider || isOsdSliderTarget(event.target)) {
      // Allow horizontal scrubbing while still blocking vertical viewport swipes
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8 && event.cancelable) {
        event.preventDefault();
      }
    } else if (osdTouchLock.onInteractive || isOsdInteractiveTarget(event.target)) {
      // Allow <=14px tap jitter so Back & OSD buttons click reliably on iOS/mobile, but block swipes
      if (dist > 14 && event.cancelable) {
        event.preventDefault();
      }
    } else if (dist > 10 && event.cancelable) {
      // Allow <=10px tap jitter on video canvas so single-tap opens/closes OSD cleanly, while blocking vertical swipes
      event.preventDefault();
    }
  }
  if (!osdGesture.touching || !event.touches?.length) return;
  const t = event.touches[0];
  if (Math.hypot(t.clientX - osdGesture.startX, t.clientY - osdGesture.startY) > 16) {
    osdGesture.moved = true;
    if (!osdGesture.holdActive) {
      clearTimeout(osdGesture.holdTimer);
      osdGesture.holdTimer = 0;
    }
  }
}
function onOsdTouchEnd(event) {
  osdTouchLock.active = false;
  clearTimeout(osdGesture.holdTimer);
  osdGesture.holdTimer = 0;
  if (!osdGesture.touching) return;
  osdGesture.touching = false;
  if (osdGesture.holdActive) {
    releaseOsdSpeedHold();
    osdGesture.suppressClickUntil = Date.now() + 380;
    if (event.cancelable) event.preventDefault();
    event.stopImmediatePropagation?.();
    event.stopPropagation();
    return;
  }
  if (event.type === 'touchcancel' || osdGesture.moved || isOsdInteractiveTarget(event.target)) return;
  const video = findActiveOsdVideo();
  if (!video) return;
  const now = Date.now();
  if (now - osdGesture.startAt > 300) return;
  const t = event.changedTouches?.[0];
  const x = t ? t.clientX : osdGesture.startX;
  const y = t ? t.clientY : osdGesture.startY;
  const vw = window.innerWidth || document.documentElement?.clientWidth || 0;
  if (!vw) return;
  const zone = x >= vw * 0.60 ? 'right' : (x <= vw * 0.40 ? 'left' : 'center');
  const streakContinue = zone !== 'center' && osdGesture.streakZone === zone && osdGesture.lastTap && (now - osdGesture.lastTap.time) <= 650;
  const isDoubleTap = streakContinue || (
    osdGesture.lastTap &&
    osdGesture.lastTap.zone === zone &&
    (now - osdGesture.lastTap.time) <= 340 &&
    Math.hypot(x - osdGesture.lastTap.x, y - osdGesture.lastTap.y) <= 68
  );
  osdGesture.lastTap = { zone, x, y, time: now };
  if (!isDoubleTap) return;
  if (zone === 'center') {
    osdGesture.suppressClickUntil = now + 380;
    if (event.cancelable) event.preventDefault();
    event.stopImmediatePropagation?.();
    event.stopPropagation();
    return;
  }
  const delta = zone === 'right' ? 10 : -10;
  osdGesture.streakZone = zone;
  osdGesture.streakSec = streakContinue ? osdGesture.streakSec + delta : delta;
  clearTimeout(osdGesture.streakTimer);
  osdGesture.streakTimer = setTimeout(() => {
    osdGesture.streakZone = '';
    osdGesture.streakSec = 0;
  }, 680);
  const dur = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : Infinity;
  const nextTime = Math.max(0, Math.min(dur, (Number(video.currentTime) || 0) + delta));
  try { video.currentTime = nextTime; } catch {}
  const absSec = Math.abs(osdGesture.streakSec);
  showOsdGesturePill(zone === 'right' ? `+${absSec}s ▸▸` : `◂◂ -${absSec}s`, zone, false);
  osdGesture.suppressClickUntil = now + 380;
  if (event.cancelable) event.preventDefault();
  event.stopImmediatePropagation?.();
  event.stopPropagation();
}
function onOsdDblClick(event) {
  if (!isTouchMobileDevice()) return;
  if (findActiveOsdVideo() || event.target?.closest?.('#videoOsdPage, .videoPlayerContainer')) {
    event.preventDefault();
    event.stopImmediatePropagation?.();
    event.stopPropagation();
  }
}
function onOsdContextMenu(event) {
  if (!isTouchMobileDevice()) return;
  if ((findActiveOsdVideo() || event.target?.closest?.('#videoOsdPage, .videoPlayerContainer')) && !isOsdInteractiveTarget(event.target)) {
    event.preventDefault();
    event.stopImmediatePropagation?.();
    event.stopPropagation();
  }
}
function onOsdSuppressClick(event) {
  if (isTouchMobileDevice() && event.target?.closest?.('#videoOsdPage .btnFullscreen')) {
    event.preventDefault();
    event.stopImmediatePropagation?.();
    event.stopPropagation();
    return;
  }
  if (Date.now() <= osdGesture.suppressClickUntil && findActiveOsdVideo() && !isOsdInteractiveTarget(event.target)) {
    event.preventDefault();
    event.stopImmediatePropagation?.();
    event.stopPropagation();
  }
}
function onRouteEvent() {
  releaseOsdSpeedHold();
  syncLibraryViewMenu();
  syncMobileOverflowDrawer(window.ApiClient);
  reconcile();
}
function start() {
  const style = element('style'); style.id = 'fx-discovery-style'; style.textContent = DISCOVERY_CSS; document.head.append(style);
  readSessionRatings();
  ensureAmbientBackground();
  installNativeFullscreenGuard();
  installFiltersFetchGuard();
  if (window.ApiClient) patchApiClientLeavingSoon(window.ApiClient);
  patchLibraryViews();
  syncLibraryViewMenu();
  syncMobileOverflowDrawer(window.ApiClient);
  syncHomeModeAttr(window.ApiClient);
  syncDocumentStateAttrs();
  anchorOpenPopovers();
  syncSearchPage(window.ApiClient);
  syncHeroAndDetailRatings(window.ApiClient);
  if (!window.JellyfinRequestHub && document.querySelector('script[data-fazfort-discovery],[src*="FazFortDiscovery"]') && !document.querySelector('script[data-requesthub-asset]')) {
    const rh = element('script'); rh.defer = true; rh.src = '../RequestHub/Assets/web.js'; rh.dataset.requesthubAsset = 'browser'; document.head.append(rh);
  }
  observer = new MutationObserver(records => {
    let needsPopover = false;
    let needsFilterImmediate = false;
    let needsHeader = false;
    let needsSearch = false;
    let needsReconcile = false;
    let needsRatings = false;
    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      const t = r.target;
      if (!t || t.nodeType !== 1) continue;
      if (!needsFilterImmediate && (t.id === 'filter-popover' || t.closest?.('#filter-popover'))) {
        needsFilterImmediate = true;
      }
      if (!needsRatings && (t.id === 'itemDetailPage' || t.matches?.('.sleekfin-hero,.sleekfin-hero-slide,.sleekfin-details-score,.sleekfin-hero-score') || t.closest?.('.sleekfin-hero,#itemDetailPage'))) {
        const onlyOwnRatings = r.type === 'childList' && [...r.addedNodes, ...r.removedNodes].every(n => n.nodeType === 1 && n.matches?.('.fx-ratings-group,.fx-detail-injected-ratings'));
        if (!onlyOwnRatings && !t.closest?.('.fx-ratings-group,.fx-detail-injected-ratings')) needsRatings = true;
      }
      if (!needsPopover) {
        if (t === document.body || t.id === 'videoOsdPage' || t.id === 'app-user-menu' || t.matches?.('.MuiPopover-root,.sleekfin-popup-layer,.sleekfin-details-dropdown-menu,.sleekfin-details-info-container,.playerStats,.dialog,.dialogContainer,.actionSheet,.sleekfin-menu-host,[data-sleekfin-user-settings-link],header.MuiAppBar-root') || t.closest?.('.MuiPopover-root,.sleekfin-popup-layer,.sleekfin-details-dropdown-menu,.sleekfin-details-info-container,.playerStats,.dialog,.actionSheet,.sleekfin-menu-host')) {
          needsPopover = true;
        } else if (r.type === 'childList' && r.addedNodes.length) {
          for (let j = 0; j < r.addedNodes.length; j++) {
            const n = r.addedNodes[j];
            if (n.nodeType === 1) {
              if (n.id === 'filter-popover' || n.querySelector?.('#filter-popover')) needsFilterImmediate = true;
              if (n.matches?.('.MuiPopover-root,.sleekfin-popup-layer,.sleekfin-details-dropdown-menu,.sleekfin-details-info-container,.playerStats,.dialog,.dialogContainer,.actionSheet,.sleekfin-menu-host,[data-sleekfin-user-settings-link]')) {
                needsPopover = true;
                break;
              }
            }
          }
        }
      }
      if (!needsHeader && r.type === 'childList' && t.closest?.('[data-sleekfin-header-proxy],[data-sleekfin-header-overflow-drawer],header,.skinHeader,.MuiDrawer-root,#user-view-overflow-menu,#itemDetailPage,#myPreferencesMenuPage')) {
        needsHeader = true;
      }
      if (!needsSearch && t.id === 'searchPage') {
        needsSearch = true;
      } else if (!needsSearch && t.closest?.('#searchPage') && !t.closest?.('.fx-search-library,.searchResults,.searchSuggestions')) {
        needsSearch = true;
      }
      if (!needsReconcile && (r.type === 'childList' || r.attributeName === 'class') && !t.closest?.('.fx-discovery,.fx-dialog,.fx-inline-studio,.fx-download-menu,.fx-search-library,.fx-year-picker,.fx-year-range,.fx-filter-footer,.fx-livetv-bar,.fx-osd-gesture-pill,.fx-osd-skip-overlay,.fx-toast,.fx-ambient-bg,.fx-bg-tuner,.fx-ratings-group,.rh-root,[data-sleekfin-header-proxy],[data-sleekfin-header-overflow-drawer],.skinHeader,.MuiPopover-root,.sleekfin-popup-layer,.sleekfin-menu-popup,.sleekfin-details-dropdown-menu,#searchPage .searchResults,#searchPage .searchSuggestions')) {
        needsReconcile = true;
      }
    }
    if (needsFilterImmediate) {
      const fp = document.getElementById('filter-popover');
      if (fp && fp.getAttribute('aria-hidden') !== 'true' && !fp.classList.contains('MuiModal-hidden')) {
        enhanceFilterPopover(fp);
      }
    }
    if (needsPopover) {
      enhanceOsdSettingsMenu();
      syncOriginModals();
      syncPlaybackStats();
      schedulePopoverSync();
    }
    if (needsRatings) schedulePopoverSync();
    if (needsHeader) {
      hideLeavingSoonNav();
      hideSleekFinUserSettingsMenu();
      syncMobileOverflowDrawer(window.ApiClient);
    }
    if (needsSearch) syncSearchPage(window.ApiClient);
    if (needsReconcile) schedule();
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-hidden', 'aria-expanded'] });
  document.addEventListener('pointerdown', onOsdAnchorPointer, true);
  document.addEventListener('click', onOsdAnchorPointer, true);
  document.addEventListener('click', onOsdMuteClick, true);
  document.addEventListener('input', onOsdVolumeSliderInput, true);
  document.addEventListener('change', onOsdVolumeSliderInput, true);
  window.addEventListener('wheel', onOsdWheel, { passive: false, capture: true });
  document.addEventListener('wheel', onOsdWheel, { passive: false, capture: true });
  document.addEventListener('click', onOsdSuppressClick, true);
  document.addEventListener('dblclick', onOsdDblClick, true);
  document.addEventListener('contextmenu', onOsdContextMenu, true);
  document.addEventListener('keydown', onOsdKeyDown, true);
  document.addEventListener('click',navSuggestions,true);window.addEventListener('hashchange', onRouteEvent); window.addEventListener('popstate', onRouteEvent); document.addEventListener('viewshow', onRouteEvent);
  document.addEventListener('touchstart', onOsdTouchStart, { passive: true, capture: true });
  document.addEventListener('touchmove', onOsdTouchMove, { passive: false, capture: true });
  window.addEventListener('touchmove', onOsdTouchMove, { passive: false, capture: true });
  document.addEventListener('touchend', onOsdTouchEnd, { passive: false, capture: true });
  document.addEventListener('touchcancel', onOsdTouchEnd, { passive: true, capture: true });
  window.addEventListener('scroll', onOsdScrollGuard, { passive: true });
  window.addEventListener('blur', releaseOsdSpeedHold);
  window.addEventListener('sleekfin:header-catalog-changed', hideLeavingSoonNav);
  document.addEventListener('keydown',remoteKey,true);document.addEventListener('keyup',remoteKeyUp,true);document.addEventListener('focusin',rememberFocus);
  document.addEventListener('scroll', scheduleScroll, { passive: true, capture: true }); window.addEventListener('resize', scheduleScroll);
  // Sign-out / server switch can occur without a hash change.
  heartbeat = setInterval(schedule, 3000); reconcile();
}
window.FazFortDiscovery = {
  version: VERSION, restart, openSettings:()=>openUserSettings(window.ApiClient), mountSettings:(host)=>mountInlineSettings(host,window.ApiClient),
  diagnostics: () => ({ version: VERSION, page: state?.route.page || null, mounted: !!state, items: state?.inventory?.items.length || 0, shelves: state?.planner?.shelves.length || 0, loadedRows: state?.slots.length || 0, liveRows: state?.slots.filter(s => s.live).length || 0,trackingReady:!!state?.trackingReady,preferencesSync:!!state?.syncAvailable,controls:state?controlsMode(state).mode:null,warnings: [...(state?.warnings || [])], supportedPageFound: !!(routeInfo(location.hash) && locate(routeInfo(location.hash))) }),
  stop() {
    stopped = true; clearTimeout(timer); clearTimeout(ratingsSyncTimer); clearTimeout(searchUiState.remoteTimer); clearTimeout(searchUiState.inputTimer); clearTimeout(osdKeySkip.timer); clearTimeout(osdKeySkip.streakTimer); if (popoverFrame) { try { cancelAnimationFrame(popoverFrame); } catch {} try { clearTimeout(popoverFrame); } catch {} popoverFrame = 0; } disconnectSearchBatchObserver(); clearInterval(heartbeat); observer?.disconnect(); releaseOsdSpeedHold(); restoreNativeFullscreenGuard(); restoreFiltersFetchGuard(); clearTimeout(osdGesture.streakTimer); cleanup(false); closeDownloadMenu(); snapshots.clear();savedFeeds.clear();heroMemoryCache.clear();
    document.documentElement?.removeAttribute?.('data-fx-hide-count-chip');
    document.documentElement?.removeAttribute?.('data-fx-curated-tab');
    document.documentElement?.removeAttribute?.('data-fx-home-mode');
    document.documentElement?.removeAttribute?.('data-fx-subpage');
    document.documentElement?.removeAttribute?.('data-fx-page-hero');
    document.documentElement?.removeAttribute?.('data-fx-ambient-bg');
    document.documentElement?.removeAttribute?.('data-fx-popover-open');
    document.documentElement?.removeAttribute?.('data-fx-video-osd');
    document.documentElement?.removeAttribute?.('data-fx-osd-anchor');
    document.documentElement?.removeAttribute?.('data-fx-livetv');
    document.documentElement?.removeAttribute?.('data-fx-search-page');
    document.documentElement?.removeAttribute?.('data-fx-has-subheader');
    document.documentElement?.style?.removeProperty?.('--fx-osd-popup-bottom');
    document.documentElement?.style?.removeProperty?.('--fx-osd-popup-right');
    document.documentElement?.style?.removeProperty?.('--fx-header-popup-top');
    document.documentElement?.style?.removeProperty?.('--fx-header-popup-right');
    document.getElementById('searchPage')?.removeAttribute?.('data-fx-search-active');
    document.querySelectorAll('.fx-search-library,.fx-livetv-bar,.fx-osd-skip-overlay,.fx-ambient-bg,.fx-bg-tuner').forEach(n => n.remove());
    document.removeEventListener('pointerdown', onOsdAnchorPointer, true);
    document.removeEventListener('click', onOsdAnchorPointer, true);
    document.removeEventListener('click', onOsdMuteClick, true);
    document.removeEventListener('input', onOsdVolumeSliderInput, true);
    document.removeEventListener('change', onOsdVolumeSliderInput, true);
    window.removeEventListener('wheel', onOsdWheel, true);
    document.removeEventListener('wheel', onOsdWheel, true);
    document.removeEventListener('click', onOsdSuppressClick, true);
    document.removeEventListener('dblclick', onOsdDblClick, true);
    document.removeEventListener('contextmenu', onOsdContextMenu, true);
    document.removeEventListener('keydown', onOsdKeyDown, true);
    document.removeEventListener('click',navSuggestions,true);window.removeEventListener('hashchange', onRouteEvent); window.removeEventListener('popstate', onRouteEvent); document.removeEventListener('viewshow', onRouteEvent); document.removeEventListener('scroll', scheduleScroll, true); window.removeEventListener('resize', scheduleScroll);
    document.removeEventListener('touchstart', onOsdTouchStart, true);
    document.removeEventListener('touchmove', onOsdTouchMove, true);
    window.removeEventListener('touchmove', onOsdTouchMove, true);
    document.removeEventListener('touchend', onOsdTouchEnd, true);
    document.removeEventListener('touchcancel', onOsdTouchEnd, true);
    window.removeEventListener('scroll', onOsdScrollGuard);
    window.removeEventListener('blur', releaseOsdSpeedHold);
    window.removeEventListener('sleekfin:header-catalog-changed', hideLeavingSoonNav);
    document.removeEventListener('keydown',remoteKey,true);document.removeEventListener('keyup',remoteKeyUp,true);document.removeEventListener('focusin',rememberFocus);
    document.querySelectorAll('[data-fx-settings-link],[data-fx-home-studio],[data-fx-overflow-settings],[data-fx-mobile-search],.fx-osd-gesture-pill,.fx-osd-skip-overlay,.fx-toast').forEach(n=>n.remove());
    document.getElementById('fx-discovery-style')?.remove(); delete window.FazFortDiscovery;
  }
};
if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
}
