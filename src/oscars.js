// Oscars Season hub: header nav tab, Dark Champagne/Obsidian Gold & White subpage,
// pure logo hero banner, gold statuette category shelves, Request Hub integration & Admin Studio.

const OSCAR_STATUETTE_SVG =
  '<svg viewBox="0 0 24 36" width="22" height="30" fill="none" aria-hidden="true" focusable="false">' +
  '<ellipse cx="12" cy="5.4" rx="2.35" ry="2.8" fill="#e6c155"/>' +
  '<path d="M10.9 3.4c-.7.5-1.1 1.4-1 2.4.1.9.6 1.6 1.2 1.9-.3-.7-.4-1.6-.2-2.6.1-.7.3-1.3.7-1.7h-.7Z" fill="#fff2ba" opacity=".85"/>' +
  '<path d="M10.7 8.4h2.6l3 1.45c.78.38 1.22 1.15 1.1 2l-.55 4.3c-.1.7-.54 1.28-1.18 1.54l-.92.37-.48 9.94h1.35v1.8h-7.24v-1.8h1.35l-.48-9.94-.92-.37c-.64-.26-1.08-.84-1.18-1.54l-.55-4.3c-.12-.85.32-1.62 1.1-2l3-1.45Z" fill="#dfb645"/>' +
  '<path d="M10.7 8.4h1.35v19.6h-1.8l-.48-9.94-.92-.37c-.64-.26-1.08-.84-1.18-1.54l-.55-4.3c-.12-.85.32-1.62 1.1-2l2.48-1.45Z" fill="#f7e297" opacity=".55"/>' +
  '<path d="M9.6 12.6l2.4 1.35 2.4-1.35" stroke="#8f6816" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>' +
  '<rect x="6.6" y="30" width="10.8" height="2" rx=".65" fill="#c49526"/>' +
  '<rect x="5" y="32.4" width="14" height="2.6" rx=".8" fill="#9a7219"/>' +
  '<rect x="5.4" y="32.4" width="13.2" height=".9" rx=".4" fill="#f3dc8f" opacity=".65"/>' +
  '</svg>';

const OSCAR_NAV_ICON_SVG =
  '<svg viewBox="6.5 1.8 11 21.2" width="11" height="17" fill="none" aria-hidden="true" focusable="false">' +
  '<ellipse cx="12" cy="4.2" rx="1.65" ry="1.95" fill="currentColor"/>' +
  '<path d="M11.1 6.3h1.8l2.1 1c.52.26.82.78.74 1.36l-.38 2.95c-.07.48-.38.88-.82 1.05l-.62.25-.34 6.59h.96v1.25H9.46V19.5h.96l-.34-6.59-.62-.25c-.44-.17-.75-.57-.82-1.05l-.38-2.95c-.08-.58.22-1.1.74-1.36l2.1-1Z" fill="currentColor"/>' +
  '<rect x="7.8" y="20.9" width="8.4" height="1.8" rx=".6" fill="currentColor" opacity=".88"/>' +
  '</svg>';

const OSCAR_HERO_LOGO_SVG =
  '<svg class="fx-oscars-hero-logo-svg" viewBox="0 0 540 176" width="540" height="176" fill="none" role="img" aria-label="The Oscars">' +
  '<g transform="translate(251, 8) scale(1.62)">' +
  '<ellipse cx="12" cy="5.4" rx="2.35" ry="2.8" fill="#e8c45a"/>' +
  '<path d="M10.9 3.4c-.7.5-1.1 1.4-1 2.4.1.9.6 1.6 1.2 1.9-.3-.7-.4-1.6-.2-2.6.1-.7.3-1.3.7-1.7h-.7Z" fill="#fff5cc" opacity=".9"/>' +
  '<path d="M10.7 8.4h2.6l3 1.45c.78.38 1.22 1.15 1.1 2l-.55 4.3c-.1.7-.54 1.28-1.18 1.54l-.92.37-.48 9.94h1.35v1.8h-7.24v-1.8h1.35l-.48-9.94-.92-.37c-.64-.26-1.08-.84-1.18-1.54l-.55-4.3c-.12-.85.32-1.62 1.1-2l3-1.45Z" fill="#dfb645"/>' +
  '<path d="M10.7 8.4h1.35v19.6h-1.8l-.48-9.94-.92-.37c-.64-.26-1.08-.84-1.18-1.54l-.55-4.3c-.12-.85.32-1.62 1.1-2l2.48-1.45Z" fill="#fae79e" opacity=".6"/>' +
  '<rect x="6.6" y="30" width="10.8" height="2" rx=".65" fill="#c79928"/>' +
  '<rect x="5" y="32.4" width="14" height="2.6" rx=".8" fill="#9a7219"/>' +
  '</g>' +
  '<line x1="74" y1="86" x2="214" y2="86" stroke="#d4af37" stroke-width="1" opacity=".62"/>' +
  '<line x1="326" y1="86" x2="466" y2="86" stroke="#d4af37" stroke-width="1" opacity=".62"/>' +
  '<text x="270" y="92" text-anchor="middle" fill="#f3dc8f" font-family="Georgia, Times New Roman, serif" font-size="14" font-weight="600" letter-spacing="7">THE</text>' +
  '<text x="270" y="150" text-anchor="middle" fill="#faf8f4" font-family="Georgia, Times New Roman, serif" font-size="60" font-weight="400" letter-spacing="14">OSCARS</text>' +
  '<line x1="170" y1="166" x2="370" y2="166" stroke="#d4af37" stroke-width="1.2" opacity=".55"/>' +
  '</svg>';

const OSCAR_CHECK_SVG =
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

const OSCAR_BACK_SVG =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>';

export function createOscarsRuntime({
  version,
  isStopped,
  hasActiveState,
  cleanup,
  element,
  scopeKey,
  scrollToTop,
  showToast,
  findCachedInventory
}) {
const button = (text, action, cls = '') => {
  const b = element('button', cls, text);
  b.type = 'button';
  b.addEventListener('click', action);
  return b;
};

function oscarsAssetUrl(api, path, params) {
  if (typeof api?.getUrl === 'function') {
    const out = api.getUrl(path, params);
    if (typeof out === 'string' && out) return out;
  }
  const qs = params ? new URLSearchParams(Object.entries(params).filter(([, v]) => v != null && v !== '')).toString() : '';
  return `../${path}${qs ? `?${qs}` : ''}`;
}

const oscarsState = {
  scope: '',
  data: null,
  fetchedAt: 0,
  pending: null,
  root: null,
  hidden: [],
  subCategoryKey: '',
  renderGen: 0,
  tmdbCache: new Map(),
  tmdbInflight: new Map()
};

function resetOscarsSession() {
  unmountOscarsPage();
  removeOscarsNav();
  oscarsState.scope = '';
  oscarsState.data = null;
  oscarsState.fetchedAt = 0;
  oscarsState.pending = null;
  oscarsState.subCategoryKey = '';
  oscarsState.tmdbCache.clear();
  oscarsState.tmdbInflight.clear();
}

function removeOscarsNav() {
  document.querySelectorAll('[data-fx-oscars-link]').forEach(n => n.remove());
}

function fetchOscarsConfig(api = window.ApiClient, force = false) {
  if (!api?.getCurrentUserId?.() || typeof api.getJSON !== 'function' || typeof api.getUrl !== 'function') {
    return Promise.resolve(null);
  }
  const own = scopeKey(api);
  if (oscarsState.scope && oscarsState.scope !== own) {
    resetOscarsSession();
  }
  oscarsState.scope = own;
  if (!force && oscarsState.data && (Date.now() - oscarsState.fetchedAt) < 60000) {
    return Promise.resolve(oscarsState.data);
  }
  if (!force && oscarsState.pending) return oscarsState.pending;
  const req = Promise.resolve(api.getJSON(api.getUrl('FazFortDiscovery/Oscars')))
    .then(res => {
      if (oscarsState.scope !== own) return null;
      oscarsState.pending = null;
      oscarsState.data = res && typeof res === 'object' ? res : { active: false, enabled: false, categories: [] };
      oscarsState.fetchedAt = Date.now();
      ensureOscarsNav(api);
      if (isOscarsHash(location.hash)) syncOscarsPage(api);
      return oscarsState.data;
    })
    .catch(() => {
      if (oscarsState.scope === own) {
        oscarsState.pending = null;
        if (!oscarsState.data) {
          oscarsState.data = { active: false, enabled: false, categories: [] };
          oscarsState.fetchedAt = Date.now();
        }
      }
      return oscarsState.data;
    });
  oscarsState.pending = req;
  return req;
}

function closeSleekfinDrawerIfOpen() {
  const drawer = document.querySelector('[data-sleekfin-header-overflow-drawer]');
  if (drawer && !drawer.hidden) {
    const toggle = document.querySelector('[data-sleekfin-header-overflow-toggle]');
    toggle?.click?.();
  }
}

function openOscarsRoute(ev) {
  ev?.preventDefault?.();
  ev?.stopPropagation?.();
  closeSleekfinDrawerIfOpen();
  oscarsState.subCategoryKey = '';
  scrollToTop();
  if (isOscarsHash(location.hash)) {
    syncOscarsPage(window.ApiClient);
  } else {
    location.hash = '#/home?fxOscars=1';
  }
  setTimeout(() => { if (!isStopped() && isOscarsHash(location.hash)) syncOscarsPage(window.ApiClient); }, 50);
  setTimeout(() => { if (!isStopped() && isOscarsHash(location.hash)) syncOscarsPage(window.ApiClient); }, 180);
}

function createOscarNavIconSpan() {
  const icon = element('span', 'fx-oscar-nav-icon');
  icon.setAttribute('aria-hidden', 'true');
  icon.dataset.sleekfinHeaderSourceIcon = 'true';
  icon.innerHTML = OSCAR_NAV_ICON_SVG;
  return icon;
}

function syncOscarsHeaderCurrent(active) {
  document.querySelectorAll('[data-fx-oscars-link="true"]').forEach(link => {
    if (active) {
      link.setAttribute('aria-current', 'page');
      link.dataset.sleekfinCurrent = 'true';
    } else {
      link.removeAttribute('aria-current');
      delete link.dataset.sleekfinCurrent;
    }
  });
  if (active) {
    document.querySelectorAll('[data-sleekfin-header-proxy] [data-sleekfin-current="true"], [data-sleekfin-header-overflow-drawer] [data-sleekfin-current="true"]').forEach(btn => {
      if (btn.dataset.fxOscarsLink !== 'true') {
        delete btn.dataset.sleekfinCurrent;
        btn.removeAttribute('aria-current');
      }
    });
  }
}

function ensureOscarsNav(api = window.ApiClient) {
  if (isStopped() || !api?.getCurrentUserId?.()) {
    removeOscarsNav();
    return;
  }
  const data = oscarsState.data;
  if (!data?.active) {
    removeOscarsNav();
    return;
  }
  const labelText = (data.navTitle || 'Oscars').trim() || 'Oscars';
  const activeRoute = isOscarsHash(location.hash);
  const proxy = document.querySelector('[data-sleekfin-header-proxy]');

  const findInsertAnchor = (host, selector) => {
    const siblings = [...host.querySelectorAll(selector)];
    return siblings.find(b => {
      if (b.dataset.fxOscarsLink === 'true') return false;
      const k = (b.getAttribute('data-sleekfin-header-proxy-item') || b.getAttribute('data-sleekfin-header-overflow-item') || '').toLowerCase();
      const txt = (b.getAttribute('aria-label') || b.textContent || '').trim().toLowerCase();
      return b.dataset.rhLink === 'true' || k === 'requesthub:discover' || k === 'dom:toolbar-discover' || txt === 'discover' || k.includes('9d7ad6afe9afa2dab1a2f6e00ad28fa6') || k.includes('164f41b42f7a4221084a13ce51114045') || txt === 'collections' || txt === 'live tv';
    }) || host.querySelector('[data-sleekfin-header-separator],[data-sleekfin-header-proxy-item="jellyfin:search"],[data-sleekfin-header-proxy-item="jellyfin:user-menu"],[data-sleekfin-header-overflow-toggle]');
  };

  if (proxy) {
    document.querySelectorAll('[data-fx-oscars-link]').forEach(n => {
      if (!proxy.contains(n)) n.remove();
    });
    let btn = proxy.querySelector('[data-fx-oscars-link="true"]');
    if (!btn) {
      const sampleTab = proxy.querySelector('[data-sleekfin-header-proxy-item="jellyfin:home"],[data-sleekfin-header-proxy-item="jellyfin:movies"]');
      btn = element('button', 'fx-oscars-nav');
      btn.type = 'button';
      btn.dataset.fxOscarsLink = 'true';
      btn.dataset.sleekfinHeaderProxyItem = 'fazfort:oscars';
      btn.dataset.sleekfinHeaderZone = 'tabs';
      btn.dataset.sleekfinHeaderDisplay = sampleTab?.dataset?.sleekfinHeaderDisplay || 'both';
      btn.onclick = openOscarsRoute;
      const vis = element('span');
      vis.dataset.sleekfinHeaderSourceVisual = 'true';
      const lbl = element('span', '', labelText);
      lbl.dataset.sleekfinHeaderSourceLabel = 'true';
      vis.append(createOscarNavIconSpan(), lbl);
      btn.append(vis);
      const anchor = findInsertAnchor(proxy, 'button[data-sleekfin-header-proxy-item]');
      if (anchor && anchor.parentNode === proxy) proxy.insertBefore(btn, anchor);
      else proxy.append(btn);
    }
    btn.title = labelText;
    btn.setAttribute('aria-label', labelText);
    const lbl = btn.querySelector('[data-sleekfin-header-source-label="true"]');
    if (lbl && lbl.textContent !== labelText) lbl.textContent = labelText;
  } else {
    const nav = document.querySelector('.headerTabs') || document.querySelector('.skinHeader');
    if (nav) {
      let link = nav.querySelector('[data-fx-oscars-link="true"]');
      if (!link) {
        link = element('a', 'fx-oscars-nav');
        link.href = '#/home?fxOscars=1';
        link.dataset.fxOscarsLink = 'true';
        link.onclick = openOscarsRoute;
        link.append(createOscarNavIconSpan(), element('span', '', labelText));
        nav.append(link);
      }
    }
  }
  syncOscarsHeaderCurrent(activeRoute);
}

function unmountOscarsPage() {
  oscarsState.renderGen++;
  oscarsState.root?.remove();
  oscarsState.root = null;
  oscarsState.hidden.forEach(n => n.removeAttribute('data-fx-oscars-hidden'));
  oscarsState.hidden = [];
  document.querySelectorAll('[data-fx-oscars-hidden]').forEach(n => n.removeAttribute('data-fx-oscars-hidden'));
  document.documentElement?.removeAttribute?.('data-fx-oscars');
  syncOscarsHeaderCurrent(false);
}

function oscarsTmdbCacheKey(nominee) {
  return `${normalizeOscarTitle(nominee?.title)}:${Number(nominee?.year || 0)}`;
}

async function resolveOscarTmdb(api, nominee) {
  if (!nominee?.title) return null;
  const key = oscarsTmdbCacheKey(nominee);
  if (oscarsState.tmdbCache.has(key)) return oscarsState.tmdbCache.get(key);
  if (oscarsState.tmdbInflight.has(key)) return oscarsState.tmdbInflight.get(key);
  if (typeof api?.getJSON !== 'function' || typeof api?.getUrl !== 'function') return null;

  const task = Promise.resolve(api.getJSON(api.getUrl('RequestHub/Browse', { kind: 'search', page: 1, query: nominee.title })))
    .then(res => {
      const results = (res?.results || []).filter(r => r && r.type === 'movie');
      const want = normalizeOscarTitle(nominee.title);
      const wantYear = Number(nominee.year || 0);
      let best = results.find(r => Number(r.id) === Number(nominee.tmdbId || 0));
      if (!best) {
        const titleMatches = results.filter(r => normalizeOscarTitle(r.title) === want);
        if (wantYear > 0) {
          best = titleMatches.find(r => Math.abs(Number(String(r.releaseDate || '').slice(0, 4)) - wantYear) <= 1) || titleMatches[0];
        } else {
          best = titleMatches[0];
        }
      }
      if (!best && wantYear > 0) {
        best = results.find(r => Math.abs(Number(String(r.releaseDate || '').slice(0, 4)) - wantYear) <= 1);
      }
      if (!best) best = results[0] || null;
      const resolved = best
        ? { id: Number(best.id) || 0, poster: best.poster || '', status: Number(best.status || 0), releaseDate: best.releaseDate || '' }
        : null;
      oscarsState.tmdbCache.set(key, resolved);
      oscarsState.tmdbInflight.delete(key);
      return resolved;
    })
    .catch(() => {
      oscarsState.tmdbInflight.delete(key);
      return null;
    });
  oscarsState.tmdbInflight.set(key, task);
  return task;
}

function updateOscarTrackFade(wrap, track) {
  if (!wrap || !track) return;
  const max = Math.max(0, (track.scrollWidth || 0) - (track.clientWidth || 0));
  wrap.dataset.fxScrollStart = track.scrollLeft <= 6 ? 'true' : 'false';
  wrap.dataset.fxScrollEnd = max <= 6 || track.scrollLeft >= max - 6 ? 'true' : 'false';
}

function buildOscarNomineeCard(api, nominee, ownedMovie, serverId, missingLookups) {
  const card = element('button', `fx-oscar-card ${ownedMovie ? 'is-owned' : 'is-missing'}`);
  card.type = 'button';
  card.dataset.oscarTitle = nominee.title || '';
  if (ownedMovie?.Id) card.dataset.itemId = ownedMovie.Id;
  if (nominee.tmdbId) card.dataset.tmdbId = String(nominee.tmdbId);

  const posterBox = element('div', 'fx-oscar-poster');
  const setPosterImage = src => {
    if (!src) return;
    posterBox.querySelector('.fx-oscar-fallback')?.remove();
    let img = posterBox.querySelector('img');
    if (!img) {
      img = element('img');
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => { img.remove(); ensureFallback(); };
      posterBox.prepend(img);
    }
    img.src = src;
  };
  const ensureFallback = () => {
    if (posterBox.querySelector('img') || posterBox.querySelector('.fx-oscar-fallback')) return;
    const fb = element('div', 'fx-oscar-fallback');
    const ic = element('span', 'fx-oscar-fallback-icon');
    ic.innerHTML = OSCAR_STATUETTE_SVG;
    fb.append(ic, element('span', 'fx-oscar-fallback-title', nominee.title || ''));
    posterBox.prepend(fb);
  };

  if (ownedMovie) {
    const tag = ownedMovie.ImageTags?.Primary;
    const imgSrc = tag
      ? (typeof api?.getImageUrl === 'function'
          ? api.getImageUrl(ownedMovie.Id, { type: 'Primary', tag, maxWidth: 400, quality: 90 })
          : oscarsAssetUrl(api, `Items/${encodeURIComponent(ownedMovie.Id)}/Images/Primary`, { fillWidth: 400, quality: 90, tag }))
      : '';
    if (imgSrc) setPosterImage(imgSrc);
    else ensureFallback();
    if (ownedMovie.UserData?.Played) {
      const watched = element('span', 'fx-oscar-watched');
      watched.title = 'Watched';
      watched.setAttribute('aria-label', 'Watched');
      watched.innerHTML = OSCAR_CHECK_SVG;
      posterBox.append(watched);
    }
    card.addEventListener('click', () => {
      const sid = serverId || api?.serverId?.() || '';
      location.hash = `#/details?id=${encodeURIComponent(ownedMovie.Id)}${sid ? `&serverId=${encodeURIComponent(sid)}` : ''}`;
    });
  } else {
    const cached = oscarsState.tmdbCache.get(oscarsTmdbCacheKey(nominee));
    let resolvedId = Number(nominee.tmdbId || cached?.id || 0);
    let resolvedPoster = nominee.poster || cached?.poster || '';
    let resolvedStatus = Number(cached?.status || 0);
    let resolvedDate = cached?.releaseDate || (nominee.year ? `${nominee.year}-01-01` : '');

    if (resolvedPoster) setPosterImage(resolvedPoster);
    else ensureFallback();

    const badge = element('span', `fx-oscar-badge ${resolvedStatus === 2 || resolvedStatus === 3 ? 'fx-oscar-badge-requested' : 'fx-oscar-badge-request'}`, resolvedStatus === 2 || resolvedStatus === 3 ? 'Requested' : 'Request');
    posterBox.append(badge);

    if ((!resolvedPoster || !resolvedId) && Array.isArray(missingLookups)) {
      missingLookups.push({
        nominee,
        apply(info) {
          if (!info || !card.isConnected) return;
          if (info.id > 0) {
            resolvedId = info.id;
            card.dataset.tmdbId = String(info.id);
          }
          if (info.poster) {
            resolvedPoster = info.poster;
            setPosterImage(info.poster);
          }
          if (info.releaseDate) resolvedDate = info.releaseDate;
          if (info.status === 2 || info.status === 3) {
            resolvedStatus = info.status;
            badge.className = 'fx-oscar-badge fx-oscar-badge-requested';
            badge.textContent = 'Requested';
          }
        }
      });
    }

    card.addEventListener('click', async () => {
      if (!resolvedId) {
        const info = await resolveOscarTmdb(api, nominee);
        if (info?.id) {
          resolvedId = info.id;
          resolvedPoster = resolvedPoster || info.poster || '';
          resolvedDate = resolvedDate || info.releaseDate || '';
        }
      }
      if (resolvedId > 0 && typeof window.JellyfinRequestHub?.openDetails === 'function') {
        window.JellyfinRequestHub.openDetails({
          id: resolvedId,
          type: 'movie',
          title: nominee.title,
          poster: resolvedPoster,
          releaseDate: resolvedDate,
          status: resolvedStatus
        }, card);
      } else {
        showToast(`“${nominee.title}” is not in your library yet.`);
      }
    });
  }

  const meta = element('div', 'fx-oscar-meta');
  meta.append(element('span', 'fx-oscar-title', nominee.title || ''));
  if (nominee.note) {
    meta.append(element('span', 'fx-oscar-note', nominee.note));
  }
  card.append(posterBox, meta);
  return card;
}

async function fetchOscarsMoviesInventory(api) {
  const own = scopeKey(api);
  const cached = findCachedInventory(own, { page: 'movies', parentId: '' });
  if (cached?.items?.length) return cached.items.filter(i => i?.Type === 'Movie');
  const uid = api?.getCurrentUserId?.();
  if (!uid || typeof api?.getItems !== 'function') return [];
  try {
    const res = await api.getItems(uid, {
      Recursive: true,
      IncludeItemTypes: 'Movie',
      Fields: 'ProviderIds,OriginalTitle,ProductionYear,ImageTags,UserData',
      Limit: 5000
    });
    return (res?.Items || []).filter(i => i?.Type === 'Movie');
  } catch {
    return [];
  }
}

async function renderOscarsView(api, root) {
  const gen = ++oscarsState.renderGen;
  const data = oscarsState.data || await fetchOscarsConfig(api);
  if (gen !== oscarsState.renderGen || !root?.isConnected) return;

  const movies = await fetchOscarsMoviesInventory(api);
  if (gen !== oscarsState.renderGen || !root?.isConnected) return;

  const serverId = api?.serverId?.() || '';
  const activeCategories = (data?.categories || []).filter(c => c && c.enabled !== false && Array.isArray(c.nominees) && c.nominees.length > 0);
  const missingLookups = [];

  root.replaceChildren();

  // 1. Pure Hero Banner (Oscars background image + Oscars logo ONLY — no synopsis, ratings, or buttons)
  const hero = element('section', 'fx-oscars-hero');
  hero.setAttribute('aria-label', data?.navTitle || 'Oscars');
  const heroMedia = element('div', 'fx-oscars-hero-media');
  const heroImg = element('img', 'fx-oscars-hero-bg');
  heroImg.alt = '';
  heroImg.decoding = 'async';
  heroImg.src = oscarsAssetUrl(api, 'FazFortDiscovery/Assets/oscars-hero', { v: data?.assetVersion || version });
  heroMedia.append(heroImg);

  const logoWrap = element('div', 'fx-oscars-hero-logo-wrap');
  if (data?.hasCustomLogo) {
    const logoImg = element('img', 'fx-oscars-hero-logo-img');
    logoImg.alt = data?.navTitle || 'Oscars';
    logoImg.src = oscarsAssetUrl(api, 'FazFortDiscovery/Assets/oscars-logo', { v: data?.assetVersion || version });
    logoImg.onerror = () => {
      logoWrap.innerHTML = OSCAR_HERO_LOGO_SVG;
    };
    logoWrap.append(logoImg);
  } else {
    logoWrap.innerHTML = OSCAR_HERO_LOGO_SVG;
  }
  hero.append(heroMedia, logoWrap);
  root.append(hero);

  // 2. Nominated Category Shelves (Oscar statuette icon beside every category title — no red bar)
  const shelvesWrap = element('div', 'fx-oscars-shelves');
  if (!activeCategories.length) {
    const empty = element('div', 'fx-oscars-empty');
    const ic = element('span', 'fx-oscar-award-icon');
    ic.innerHTML = OSCAR_STATUETTE_SVG;
    empty.append(
      ic,
      element('h3', '', 'No Oscars nominees configured yet'),
      element('p', '', 'Add this season’s nominated movies in Dashboard → Plugins → Jellyfin Discovery under Oscars Season.')
    );
    shelvesWrap.append(empty);
  } else {
    for (const cat of activeCategories) {
      const shelf = element('section', 'fx-oscars-shelf');
      shelf.dataset.oscarCategory = cat.key;
      const head = element('div', 'fx-oscars-row-head');
      const heading = element('div', 'fx-oscars-heading');
      const awardIcon = element('span', 'fx-oscar-award-icon');
      awardIcon.innerHTML = OSCAR_STATUETTE_SVG;
      const h2 = element('h2', '', cat.title);
      heading.append(awardIcon, h2);

      const controls = element('div', 'fx-oscars-row-controls');
      const prevBtn = element('button', 'fx-oscars-arrow', '‹');
      prevBtn.type = 'button';
      prevBtn.setAttribute('aria-label', `Previous ${cat.title}`);
      const nextBtn = element('button', 'fx-oscars-arrow', '›');
      nextBtn.type = 'button';
      nextBtn.setAttribute('aria-label', `More ${cat.title}`);
      controls.append(prevBtn, nextBtn);
      head.append(heading, controls);

      const trackWrap = element('div', 'fx-oscars-track-wrap');
      const track = element('div', 'fx-oscars-track');
      for (const nom of cat.nominees) {
        track.append(buildOscarNomineeCard(api, nom, matchOscarNominee(nom, movies), serverId, missingLookups));
      }
      const scrollShelf = dir => {
        const step = Math.max(260, Math.round((track.clientWidth || 800) * 0.82));
        track.scrollBy?.({ left: dir * step, behavior: 'smooth' });
      };
      prevBtn.onclick = () => scrollShelf(-1);
      nextBtn.onclick = () => scrollShelf(1);
      track.addEventListener('scroll', () => updateOscarTrackFade(trackWrap, track), { passive: true });
      trackWrap.append(track);
      shelf.append(head, trackWrap);
      shelvesWrap.append(shelf);
      requestAnimationFrame(() => updateOscarTrackFade(trackWrap, track));
    }
  }
  root.append(shelvesWrap);
  runOscarMissingEnrichment(api, gen, missingLookups);
}

async function runOscarMissingEnrichment(api, gen, missingLookups) {
  if (!missingLookups.length) return;
  const byKey = new Map();
  for (const entry of missingLookups) {
    const k = oscarsTmdbCacheKey(entry.nominee);
    if (!byKey.has(k)) byKey.set(k, { nominee: entry.nominee, callbacks: [] });
    byKey.get(k).callbacks.push(entry.apply);
  }
  const queue = [...byKey.values()];
  const worker = async () => {
    while (queue.length && gen === oscarsState.renderGen && !isStopped()) {
      const item = queue.shift();
      if (!item) break;
      const info = await resolveOscarTmdb(api, item.nominee);
      if (gen !== oscarsState.renderGen || isStopped()) return;
      if (info) item.callbacks.forEach(fn => fn(info));
    }
  };
  await Promise.all([worker(), worker(), worker()]);
}

function syncOscarsPage(api = window.ApiClient, forceRender = false) {
  if (isStopped() || !api?.getCurrentUserId?.()) {
    unmountOscarsPage();
    removeOscarsNav();
    return;
  }
  fetchOscarsConfig(api);
  ensureOscarsNav(api);
  if (!isOscarsHash(location.hash)) {
    if (oscarsState.root || document.documentElement?.getAttribute?.('data-fx-oscars') === 'true') {
      unmountOscarsPage();
    }
    return;
  }
  if (hasActiveState()) cleanup(true);
  document.documentElement?.setAttribute?.('data-fx-oscars', 'true');
  document.documentElement?.classList?.remove?.('sleekfin-hero-boot-loading', 'sleekfin-hero-loading');
  syncOscarsHeaderCurrent(true);

  const candidates = [...document.querySelectorAll('#indexPage, .homePage')];
  const page = candidates.find(n => !n.closest('.hide,.hidePage,[hidden]')) || candidates[0];
  if (!page) return;
  if (oscarsState.root?.isConnected && oscarsState.root.parentNode === page) {
    [...page.children].forEach(n => {
      if (n !== oscarsState.root && n.getAttribute('data-fx-oscars-hidden') !== 'true') {
        n.setAttribute('data-fx-oscars-hidden', 'true');
        oscarsState.hidden.push(n);
      }
    });
    if (forceRender) renderOscarsView(api, oscarsState.root);
    return;
  }
  oscarsState.root?.remove();
  const root = element('div', 'fx-oscars-page');
  [...page.children].forEach(n => {
    n.setAttribute('data-fx-oscars-hidden', 'true');
    oscarsState.hidden.push(n);
  });
  page.prepend(root);
  oscarsState.root = root;
  renderOscarsView(api, root);
}

// Admin Plugin Settings UI: mounted inside Dashboard -> Plugins -> Jellyfin Discovery
async function mountOscarsSettings(host, api = window.ApiClient) {
  if (!host || !api?.getCurrentUserId?.()) return;
  host.replaceChildren(element('p', 'fx-oscar-admin-status', 'Loading Oscars Season settings…'));
  let draft;
  try {
    draft = await api.getJSON(api.getUrl('FazFortDiscovery/Oscars'));
  } catch {
    host.replaceChildren(element('p', 'fx-oscar-admin-status', 'Could not load Oscars Season settings. Verify Jellyfin Discovery 0.7.0+ is installed.'));
    return;
  }
  draft = cloneJson(draft || { enabled: false, active: false, startDate: '', endDate: '', navTitle: 'Oscars', ceremonyTitle: '98th Academy Awards', categories: [] });
  if (!Array.isArray(draft.categories)) draft.categories = [];
  let savedSnapshot = cloneJson(draft);
  let dirty = false;
  let saving = false;
  const expanded = new Set(draft.categories[0]?.key ? [draft.categories[0].key] : []);
  let statusText = '';

  const readErrorMessage = async (err, fallback) => {
    try {
      if (err?.responseJSON?.error) return String(err.responseJSON.error);
      if (typeof err?.json === 'function') {
        const j = await err.json().catch(() => null);
        if (j?.error) return String(j.error);
        if (j?.title) return String(j.title);
      }
      if (typeof err?.status === 'number' && err.status > 0) return `${fallback} (HTTP ${err.status})`;
      if (err?.message) return String(err.message);
    } catch {}
    return fallback;
  };

  const computeLivePill = () => {
    if (saving) return { live: false, dirty: true, text: 'Saving…' };
    if (dirty) return { live: false, dirty: true, text: 'Unsaved changes — click Save' };
    const src = savedSnapshot;
    if (!src.enabled) return { live: false, dirty: false, text: 'Disabled — hidden from header' };
    const today = new Date().toISOString().slice(0, 10);
    const s = (src.startDate || '').trim();
    const e = (src.endDate || '').trim();
    if (s && today < s) return { live: false, dirty: false, text: `Scheduled — starts ${s}` };
    if (e && today > e) return { live: false, dirty: false, text: `Ended ${e} — hidden from header` };
    if (s || e) return { live: true, dirty: false, text: `Active now (${s || 'now'} → ${e || 'manual stop'})` };
    return { live: true, dirty: false, text: 'Active now — visible in header' };
  };

  const broadcastUpdate = saved => {
    oscarsState.data = saved;
    oscarsState.fetchedAt = Date.now();
    ensureOscarsNav(api);
    if (isOscarsHash(location.hash)) syncOscarsPage(api, true);
    try { window.dispatchEvent(new CustomEvent('fazfort:oscars-updated', { detail: saved })); } catch {}
  };

  const uploadAssetFile = (kind, file) => {
    if (!file) return;
    if (file.size > 5_000_000) {
      statusText = 'Image must be 5 MB or smaller.';
      draw();
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      statusText = `Uploading custom ${kind}…`;
      draw();
      try {
        const res = await api.ajax({
          url: api.getUrl(`FazFortDiscovery/Oscars/Asset/${kind}`),
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify({ dataUrl: String(reader.result || '') })
        });
        draft.assetVersion = res.assetVersion || Date.now();
        draft.hasCustomHero = Boolean(res.hasCustomHero);
        draft.hasCustomLogo = Boolean(res.hasCustomLogo);
        savedSnapshot.assetVersion = draft.assetVersion;
        savedSnapshot.hasCustomHero = draft.hasCustomHero;
        savedSnapshot.hasCustomLogo = draft.hasCustomLogo;
        statusText = `Uploaded custom ${kind}.`;
        broadcastUpdate({ ...savedSnapshot });
      } catch (err) {
        statusText = await readErrorMessage(err, `Could not upload custom ${kind}.`);
      }
      draw();
    };
    reader.readAsDataURL(file);
  };

  const resetAsset = async kind => {
    statusText = `Resetting ${kind} to built-in default…`;
    draw();
    try {
      const res = await api.ajax({
        url: api.getUrl(`FazFortDiscovery/Oscars/Asset/${kind}/Delete`),
        type: 'POST',
        dataType: 'json'
      });
      draft.assetVersion = res.assetVersion || Date.now();
      draft.hasCustomHero = Boolean(res.hasCustomHero);
      draft.hasCustomLogo = Boolean(res.hasCustomLogo);
      savedSnapshot.assetVersion = draft.assetVersion;
      savedSnapshot.hasCustomHero = draft.hasCustomHero;
      savedSnapshot.hasCustomLogo = draft.hasCustomLogo;
      statusText = `Reverted ${kind} to built-in default.`;
      broadcastUpdate({ ...savedSnapshot });
    } catch (err) {
      statusText = await readErrorMessage(err, `Could not reset custom ${kind}.`);
    }
    draw();
  };

  const saveDraft = async (revertEnabledOnFail = null) => {
    saving = true;
    statusText = 'Saving Oscars Season settings…';
    draw();
    try {
      const saved = await api.ajax({
        url: api.getUrl('FazFortDiscovery/Oscars'),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
          enabled: Boolean(draft.enabled),
          startDate: (draft.startDate || '').trim(),
          endDate: (draft.endDate || '').trim(),
          navTitle: (draft.navTitle || 'Oscars').trim() || 'Oscars',
          ceremonyTitle: (draft.ceremonyTitle || 'Academy Awards').trim() || 'Academy Awards',
          categories: draft.categories
        })
      });
      draft = cloneJson(saved);
      savedSnapshot = cloneJson(saved);
      dirty = false;
      statusText = saved.active
        ? 'Saved! The Oscars tab is now live in the top header bar.'
        : (saved.enabled ? 'Saved! Oscars will appear automatically during your scheduled dates.' : 'Saved! Oscars page disabled and hidden from header.');
      broadcastUpdate(saved);
    } catch (err) {
      if (typeof revertEnabledOnFail === 'boolean') draft.enabled = revertEnabledOnFail;
      statusText = await readErrorMessage(err, 'Could not save Oscars settings. Check dates and category entries.');
    } finally {
      saving = false;
    }
    draw();
  };

  const draw = () => {
    host.replaceChildren();
    const card = element('section', 'fx-oscar-admin');

    const head = element('div', 'fx-oscar-admin-head');
    const title = element('h3', 'fx-oscar-admin-title');
    const titleIcon = element('span', 'fx-oscar-award-icon');
    titleIcon.innerHTML = OSCAR_STATUETTE_SVG;
    title.append(titleIcon, element('span', '', 'Oscars Season Subpage'));
    const pillInfo = computeLivePill();
    const pill = element('span', `fx-oscar-admin-pill ${pillInfo.live ? 'is-live' : ''} ${pillInfo.dirty ? 'is-dirty' : ''}`.trim(), pillInfo.text);
    head.append(title, pill);
    card.append(head);

    card.append(element('p', 'ff-cfg-sub', 'Toggle the white-and-gold Oscars tab in the top navigation bar during awards season. Movies already in your library open directly to play; missing nominees appear with a Request badge powered by Request Hub.'));

    // Toggle (auto-saves immediately!) + date window + nav label
    const toggleRow = element('div', 'ff-cfg-toggle-row');
    const toggleLbl = element('label', 'ff-cfg-toggle');
    const toggleChk = element('input');
    toggleChk.type = 'checkbox';
    toggleChk.checked = Boolean(draft.enabled);
    toggleChk.disabled = saving;
    toggleChk.setAttribute('aria-label', 'Enable Oscars Page');
    toggleChk.onchange = () => {
      const prev = Boolean(draft.enabled);
      draft.enabled = toggleChk.checked;
      saveDraft(prev);
    };
    toggleLbl.append(toggleChk, element('span', '', 'Enable Oscars Page'));
    toggleRow.append(toggleLbl);
    card.append(toggleRow);

    const grid = element('div', 'fx-oscar-admin-grid');
    const addInput = (label, type, val, onChange, placeholder = '') => {
      const f = element('label', 'fx-oscar-admin-field', label);
      const inp = element('input');
      inp.type = type;
      inp.value = val || '';
      if (placeholder) inp.placeholder = placeholder;
      inp.setAttribute('aria-label', label);
      inp.onchange = () => { dirty = true; onChange(inp.value); };
      f.append(inp);
      grid.append(f);
    };
    addInput('Start Date (optional)', 'date', draft.startDate, v => { draft.startDate = v; draw(); });
    addInput('End Date (optional)', 'date', draft.endDate, v => { draft.endDate = v; draw(); });
    addInput('Header Tab Title', 'text', draft.navTitle || 'Oscars', v => { draft.navTitle = v; draw(); }, 'Oscars');
    card.append(grid);

    // Hero Banner & Logo custom asset uploaders
    const assetsGrid = element('div', 'fx-oscar-admin-assets');

    const heroBox = element('div', 'fx-oscar-asset-box');
    heroBox.append(element('strong', '', 'Hero Banner Backdrop'));
    const heroPrev = element('div', 'fx-oscar-asset-preview');
    const heroImg = element('img');
    heroImg.alt = 'Oscars hero backdrop preview';
    heroImg.src = oscarsAssetUrl(api, 'FazFortDiscovery/Assets/oscars-hero', { v: draft.assetVersion || version });
    heroPrev.append(heroImg);
    const heroActions = element('div', 'fx-oscar-admin-actions');
    const heroFile = element('input');
    heroFile.type = 'file';
    heroFile.accept = 'image/png,image/jpeg,image/webp';
    heroFile.hidden = true;
    heroFile.onchange = () => uploadAssetFile('hero', heroFile.files?.[0]);
    heroActions.append(
      button('Upload Custom Hero', () => heroFile.click(), 'fx-oscar-btn fx-oscar-btn-xs'),
      ...(draft.hasCustomHero ? [button('Reset Default', () => resetAsset('hero'), 'fx-oscar-btn fx-oscar-btn-xs')] : []),
      heroFile
    );
    heroBox.append(heroPrev, heroActions);

    const logoBox = element('div', 'fx-oscar-asset-box');
    logoBox.append(element('strong', '', 'Oscars Hero Logo'));
    const logoPrev = element('div', 'fx-oscar-asset-preview is-logo');
    if (draft.hasCustomLogo) {
      const lImg = element('img');
      lImg.alt = 'Oscars logo preview';
      lImg.src = oscarsAssetUrl(api, 'FazFortDiscovery/Assets/oscars-logo', { v: draft.assetVersion || version });
      logoPrev.append(lImg);
    } else {
      logoPrev.innerHTML = OSCAR_HERO_LOGO_SVG;
    }
    const logoActions = element('div', 'fx-oscar-admin-actions');
    const logoFile = element('input');
    logoFile.type = 'file';
    logoFile.accept = 'image/png,image/jpeg,image/webp,image/svg+xml';
    logoFile.hidden = true;
    logoFile.onchange = () => uploadAssetFile('logo', logoFile.files?.[0]);
    logoActions.append(
      button('Upload Custom Logo', () => logoFile.click(), 'fx-oscar-btn fx-oscar-btn-xs'),
      ...(draft.hasCustomLogo ? [button('Reset Default', () => resetAsset('logo'), 'fx-oscar-btn fx-oscar-btn-xs')] : []),
      logoFile
    );
    logoBox.append(logoPrev, logoActions);

    assetsGrid.append(heroBox, logoBox);
    card.append(assetsGrid);

    // Top action bar
    const topBar = element('div', 'fx-oscar-admin-actions');
    const saveBtn = button('Save Oscars Settings', () => saveDraft(), 'fx-oscar-btn fx-oscar-btn-gold');
    const exportBtn = button('Export Nominees JSON', () => {
      try {
        const blob = new Blob([JSON.stringify({ ceremonyTitle: draft.ceremonyTitle, categories: draft.categories }, null, 2)], { type: 'application/json' });
        const a = element('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'oscars-nominees.json';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1500);
      } catch {}
    }, 'fx-oscar-btn');
    const importInput = element('input');
    importInput.type = 'file';
    importInput.accept = 'application/json,.json';
    importInput.hidden = true;
    importInput.onchange = async () => {
      try {
        const f = importInput.files?.[0];
        if (!f) return;
        const parsed = JSON.parse(await f.text());
        const cats = Array.isArray(parsed) ? parsed : parsed?.categories;
        if (!Array.isArray(cats)) throw Error('JSON must contain a categories array.');
        draft.categories = cats;
        if (parsed?.ceremonyTitle) draft.ceremonyTitle = String(parsed.ceremonyTitle);
        dirty = true;
        statusText = `Imported ${cats.length} categories. Click Save Oscars Settings to apply.`;
      } catch (e) {
        statusText = `Import failed: ${e.message}`;
      }
      draw();
    };
    const importBtn = button('Import JSON', () => importInput.click(), 'fx-oscar-btn');
    const clearNomsBtn = button('Clear All Nominees', () => {
      draft.categories.forEach(c => { c.nominees = []; });
      dirty = true;
      statusText = 'Cleared nominees across all categories (categories preserved). Click Save to apply.';
      draw();
    }, 'fx-oscar-btn');
    const addCatBtn = button('+ Add Category', () => {
      const idx = draft.categories.length + 1;
      const key = `custom-category-${Date.now().toString(36)}-${idx}`;
      draft.categories.push({ key, title: `Custom Category ${idx}`, enabled: true, nominees: [] });
      expanded.add(key);
      dirty = true;
      draw();
    }, 'fx-oscar-btn');
    topBar.append(saveBtn, importBtn, exportBtn, clearNomsBtn, addCatBtn, importInput);
    card.append(topBar);

    const statusNode = element('p', 'fx-oscar-admin-status', statusText);
    statusNode.setAttribute('role', 'status');
    card.append(statusNode);

    // Categories accordion list
    const list = element('div', 'fx-oscar-cat-list');
    draft.categories.forEach((cat, cIdx) => {
      const box = element('div', 'fx-oscar-cat-item');
      const isOpen = expanded.has(cat.key);
      const sum = element('div', 'fx-oscar-cat-summary');
      const en = element('input');
      en.type = 'checkbox';
      en.checked = cat.enabled !== false;
      en.onclick = ev => ev.stopPropagation();
      en.onchange = () => { cat.enabled = en.checked; dirty = true; draw(); };
      const nameSpan = element('span', 'fx-oscar-cat-name', cat.title || cat.key);
      const countPill = element('span', 'fx-oscar-cat-count', `${(cat.nominees || []).length} nominees`);
      const upBtn = button('↑', ev => {
        ev.stopPropagation();
        if (cIdx > 0) {
          [draft.categories[cIdx - 1], draft.categories[cIdx]] = [draft.categories[cIdx], draft.categories[cIdx - 1]];
          dirty = true;
          draw();
        }
      }, 'fx-oscar-btn fx-oscar-btn-xs');
      upBtn.disabled = cIdx === 0;
      const downBtn = button('↓', ev => {
        ev.stopPropagation();
        if (cIdx < draft.categories.length - 1) {
          [draft.categories[cIdx + 1], draft.categories[cIdx]] = [draft.categories[cIdx], draft.categories[cIdx + 1]];
          dirty = true;
          draw();
        }
      }, 'fx-oscar-btn fx-oscar-btn-xs');
      downBtn.disabled = cIdx === draft.categories.length - 1;
      sum.append(en, nameSpan, countPill, upBtn, downBtn);
      sum.onclick = () => {
        if (expanded.has(cat.key)) expanded.delete(cat.key);
        else expanded.add(cat.key);
        draw();
      };
      box.append(sum);

      if (isOpen) {
        const body = element('div', 'fx-oscar-cat-body');
        const titleRow = element('div', 'fx-oscar-nom-row');
        const catTitleInput = element('input', 'fx-oscar-nom-note');
        catTitleInput.value = cat.title || '';
        catTitleInput.placeholder = 'Category title';
        catTitleInput.onchange = () => { cat.title = catTitleInput.value.trim() || cat.title; nameSpan.textContent = cat.title; dirty = true; draw(); };
        const delCatBtn = button('Delete Category', () => {
          draft.categories.splice(cIdx, 1);
          expanded.delete(cat.key);
          dirty = true;
          draw();
        }, 'fx-oscar-btn fx-oscar-btn-xs');
        titleRow.append(catTitleInput, delCatBtn);
        body.append(titleRow);

        // Existing nominees
        (cat.nominees || []).forEach((nom, nIdx) => {
          const nRow = element('div', 'fx-oscar-nom-row');
          const lbl = element('span', 'fx-oscar-nom-title', `${nom.title}${nom.year ? ` (${nom.year})` : ''}`);
          const noteInput = element('input', 'fx-oscar-nom-note');
          noteInput.value = nom.note || '';
          noteInput.placeholder = 'Optional subtitle (actor, director, song…)';
          noteInput.onchange = () => { nom.note = noteInput.value.trim() || null; dirty = true; draw(); };
          const remNom = button('Remove', () => {
            cat.nominees.splice(nIdx, 1);
            dirty = true;
            draw();
          }, 'fx-oscar-btn fx-oscar-btn-xs');
          nRow.append(lbl, noteInput, remNom);
          body.append(nRow);
        });

        // Unified Library + TMDb/Request Hub movie search picker
        const pickerWrap = element('div');
        const searchInput = element('input', 'fx-oscar-nom-note');
        searchInput.style.width = '100%';
        searchInput.style.boxSizing = 'border-box';
        searchInput.placeholder = 'Search Jellyfin library or TMDb to add a nominated movie…';
        const resultsWrap = element('div', 'fx-oscar-search-results');
        let searchTimer = 0;
        searchInput.oninput = () => {
          clearTimeout(searchTimer);
          const q = searchInput.value.trim();
          if (q.length < 2) { resultsWrap.replaceChildren(); return; }
          searchTimer = setTimeout(async () => {
            const hits = [];
            const seen = new Set();
            try {
              const uid = api.getCurrentUserId();
              if (uid && typeof api.getItems === 'function') {
                const lib = await api.getItems(uid, { Recursive: true, IncludeItemTypes: 'Movie', SearchTerm: q, Fields: 'ProviderIds,ProductionYear', Limit: 6 });
                for (const m of (lib?.Items || [])) {
                  const tmdb = Number(m.ProviderIds?.Tmdb || m.ProviderIds?.tmdb || 0) || null;
                  const k = tmdb ? `tmdb:${tmdb}` : `t:${normalizeOscarTitle(m.Name)}:${m.ProductionYear || 0}`;
                  if (seen.has(k)) continue;
                  seen.add(k);
                  hits.push({ title: m.Name, year: m.ProductionYear || null, tmdbId: tmdb, poster: null, source: 'Library' });
                }
              }
            } catch {}
            try {
              const rh = await api.getJSON(api.getUrl('RequestHub/Browse', { kind: 'search', page: 1, query: q }));
              for (const r of (rh?.results || []).filter(x => x?.type === 'movie').slice(0, 6)) {
                const yr = Number(String(r.releaseDate || '').slice(0, 4)) || null;
                const tmdb = Number(r.id) || null;
                const k = tmdb ? `tmdb:${tmdb}` : `t:${normalizeOscarTitle(r.title)}:${yr || 0}`;
                if (seen.has(k)) continue;
                seen.add(k);
                hits.push({ title: r.title, year: yr, tmdbId: tmdb, poster: r.poster || null, source: 'TMDb' });
              }
            } catch {}
            resultsWrap.replaceChildren();
            hits.slice(0, 8).forEach(hit => {
              const b = button(`+ ${hit.title}${hit.year ? ` (${hit.year})` : ''} · ${hit.source}`, () => {
                cat.nominees = cat.nominees || [];
                cat.nominees.push({ title: hit.title, year: hit.year, tmdbId: hit.tmdbId, poster: hit.poster, note: null, winner: false });
                dirty = true;
                draw();
              }, 'fx-oscar-search-hit');
              resultsWrap.append(b);
            });
          }, 220);
        };
        pickerWrap.append(searchInput, resultsWrap);
        body.append(pickerWrap);

        // Quick manual entry fallback
        const manRow = element('div', 'fx-oscar-nom-row');
        const mTitle = element('input', 'fx-oscar-nom-note');
        mTitle.placeholder = 'Or type movie title manually';
        const mYear = element('input', 'fx-oscar-nom-note');
        mYear.style.flex = '0 0 84px';
        mYear.placeholder = 'Year';
        const mAdd = button('+ Add', () => {
          const t = mTitle.value.trim();
          if (!t) return;
          const y = Number(mYear.value.trim());
          cat.nominees = cat.nominees || [];
          cat.nominees.push({ title: t, year: y >= 1888 && y <= 2100 ? y : null, tmdbId: null, poster: null, note: null, winner: false });
          dirty = true;
          draw();
        }, 'fx-oscar-btn fx-oscar-btn-xs');
        manRow.append(mTitle, mYear, mAdd);
        body.append(manRow);

        box.append(body);
      }
      list.append(box);
    });
    card.append(list);

    host.append(card);
  };

  draw();
}

return {
  fetchOscarsConfig,
  ensureOscarsNav,
  syncOscarsPage,
  unmountOscarsPage,
  resetOscarsSession,
  mountOscarsSettings
};
}
