const normalizeGuid = id => String(id || '').replace(/-/g, '').toLowerCase();
export const leavingSoonState = {
  viewIds: new Set(['5ebc3f61ab8138bcfac3c68317a6be0b', '98081fc4b7413c896b48aaf1e35e8457']),
  itemIds: new Set(),
  loadedViews: new Set()
};
export function isLeavingSoonItem(item) {
  if (!item || typeof item !== 'object') return false;
  const id = normalizeGuid(item.Id);
  const parentId = normalizeGuid(item.ParentId);
  const seriesId = normalizeGuid(item.SeriesId);
  if (id && (leavingSoonState.viewIds.has(id) || leavingSoonState.itemIds.has(id))) return true;
  if (parentId && leavingSoonState.viewIds.has(parentId)) return true;
  if (seriesId && (leavingSoonState.viewIds.has(seriesId) || leavingSoonState.itemIds.has(seriesId))) return true;
  if (/leaving\s+soon/i.test(String(item.Name || '')) || /leaving\s+soon/i.test(String(item.SeriesName || ''))) return true;
  return false;
}

export class JellyfinClient {
  constructor(api, current = () => true) {
    this.api = api; this.userId = api.getCurrentUserId(); this.current = current;
    this.serverId = api.serverId?.() || '';
    this.prefetchedSections = new Map();
    if (!this.userId) throw Error('Sign in to Jellyfin first.');
  }
  assertCurrent() {
    if (!this.current() || this.api.getCurrentUserId() !== this.userId || (this.api.serverId?.() || '') !== this.serverId) throw Error('This view has changed.');
  }
  async request(promise) {
    this.assertCurrent();
    let timer;
    try {
      const result = await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(Error('Jellyfin request timed out.')), 20000); })]);
      this.assertCurrent(); return result;
    } finally { clearTimeout(timer); }
  }
  json(path, params = {}) { return this.request(this.api.getJSON(this.api.getUrl(path, params))); }
  items(params) { return this.request(this.api.getItems(this.userId, params)); }
  async preferences() {
    const value = await this.json('FazFortDiscovery/Preferences');
    if (!Number.isInteger(value.Version ?? value.version)) throw Error('Companion preferences are unavailable.');
    return { version: value.Version ?? value.version, config: value.Config ?? value.config ?? null };
  }
  async savePreferences(config, version) {
    this.assertCurrent();
    return this.request(this.api.ajax({ url: this.api.getUrl('FazFortDiscovery/Preferences'), type: 'POST', contentType: 'application/json', dataType: 'json', data: JSON.stringify({ ExpectedVersion: version, Config: config }) }));
  }
  async tracking(items) {
    const records = new Map();
    let ready = false;
    for (let offset = 0; offset < items.length || offset === 0; offset += 200) {
      const ids = items.slice(offset, offset + 200).map(i => i.Id);
      const result = await this.json('FazFortDiscovery/Tracking', { Ids: ids.join(',') });
      if ((result.Ready ?? result.ready) !== true) throw Error('Arrival tracking is not ready.');
      ready = true;
      const map = result.Records ?? result.records ?? {};
      for (const item of items.slice(offset, offset + 200)) {
        const r = map[item.Id] || map[item.Id.replace(/-/g, '').toLowerCase()];
        if (r) records.set(item.Id, { AddedAt: r.AddedAt ?? r.addedAt, NewSeasonAt: r.NewSeasonAt ?? r.newSeasonAt });
      }
      if (!items.length) break;
    }
    return { ready, records };
  }
  async inventory(route, progress) {
    // Explicit library IDs stay scoped; Home uses only libraries visible to this user.
    const views = await this.json(`Users/${encodeURIComponent(this.userId)}/Views`);
    const rawViews = views.Items || [];
    const leavingViews = rawViews.filter(v => /leaving\s+soon/i.test(v?.Name || '') || leavingSoonState.viewIds.has(normalizeGuid(v?.Id)));
    for (const lv of leavingViews) {
      const gid = normalizeGuid(lv?.Id);
      if (gid) leavingSoonState.viewIds.add(gid);
      if (gid && !leavingSoonState.loadedViews.has(gid) && typeof this.api?.getItems === 'function') {
        leavingSoonState.loadedViews.add(gid);
        Promise.resolve(this.api.getItems(this.userId, { ParentId: lv.Id, Recursive: true, IncludeItemTypes: 'Movie,Series', Limit: 500 }))
          .then(res => {
            for (const it of res?.Items || []) {
              const iid = normalizeGuid(it?.Id);
              if (iid) leavingSoonState.itemIds.add(iid);
            }
          })
          .catch(() => {});
      }
    }
    this.views = rawViews.filter(v => ['movies', 'tvshows', '', null, undefined].includes(v.CollectionType) && !isLeavingSoonItem(v));
    const safeParentId = route.parentId && !leavingSoonState.viewIds.has(normalizeGuid(route.parentId)) ? route.parentId : '';
    const folders = safeParentId ? [{ Id: safeParentId }] : this.views.filter(v => route.page === 'home' || !v.CollectionType || v.CollectionType === (route.page === 'movies' ? 'movies' : 'tvshows'));
    const type = route.page === 'movies' ? 'Movie' : route.page === 'shows' ? 'Series' : 'Movie,Series';
    const all = new Map(), seasons = new Map();
    const tasks = [];
    for (const folder of folders) {
      const folderTypes = [type, ...(route.page === 'movies' || folder.CollectionType === 'movies' ? [] : ['Season'])];
      for (const types of folderTypes) {
        tasks.push((async () => {
          let offset = 0;
          for (;;) {
            this.assertCurrent();
            const response = await this.items({ ParentId: folder.Id, Recursive: true, IncludeItemTypes: types,
              Fields: 'Genres,Tags,People,Studios,DateCreated,ParentId,PrimaryImageAspectRatio',
              EnableUserData: true, EnableImages: true, ImageTypeLimit: 1,
              EnableImageTypes: 'Primary,Backdrop,Thumb', SortBy: 'SortName', SortOrder: 'Ascending', StartIndex: offset, Limit: 200 });
            const list = response.Items || [], target = types === 'Season' ? seasons : all;
            let added = 0;
            for (const item of list) if (item.Id && !target.has(item.Id)) { target.set(item.Id, item); added++; }
            offset += list.length;
            progress?.(all.size, seasons.size);
            if (list.length === 0 || added === 0 || list.length < 200 || (Number.isFinite(response.TotalRecordCount) && offset >= response.TotalRecordCount)) break;
            if (offset >= 100000) throw Error('Library exceeds the 100,000-item safety limit. Use a smaller library.');
          }
        })());
      }
    }
    await Promise.all(tasks);
    return { items: [...all.values()], seasons: [...seasons.values()], views: this.views };
  }
  async hydrate(items) {
    const ids = items.filter(i => /^[a-f0-9-]{32,36}$/i.test(i.Id || '')).map(i => i.Id);
    if (!ids.length) return items;
    const response = await this.items({ Ids: ids.join(','), Fields: 'DateCreated,PrimaryImageAspectRatio', EnableImages: true, EnableUserData: true, ImageTypeLimit: 1, EnableImageTypes: 'Primary,Backdrop,Thumb' });
    const byId = new Map((response.Items || []).map(i => [i.Id, i]));
    // A missing item may have been removed or lost permission since the inventory read.
    return items.filter(i => !ids.includes(i.Id) || byId.has(i.Id)).map(i => byId.has(i.Id) ? { ...i, ...byId.get(i.Id) } : i);
  }
  groupResume(items, inventory) {
    const grouped=new Map();
    const invItems=inventory?.items||[];
    for(const item of items){
      const key=item.Type==='Episode'&&item.SeriesId?item.SeriesId:item.Id;
      const old=grouped.get(key);
      const priority=i=>i.UserData?.PlaybackPositionTicks>0?2:1;
      if(old&&(priority(old)>priority(item)||priority(old)===priority(item)&&(Date.parse(old.UserData?.LastPlayedDate)||0)>=(Date.parse(item.UserData?.LastPlayedDate)||0)))continue;
      grouped.set(key,item);
    }
    return [...grouped.values()].map(item=>{
      if(item.Type!=='Episode'||!item.SeriesId)return item;
      const show=invItems.find(i=>i.Id===item.SeriesId);
      return {...item,Name:item.SeriesName||show?.Name||item.Name,Type:'Series',ResumeItemId:item.Id,
        Id:item.SeriesId,ImageTags:show?.ImageTags||(item.SeriesPrimaryImageTag?{Primary:item.SeriesPrimaryImageTag}:item.ImageTags||{}),BackdropImageTags:show?.BackdropImageTags||item.ParentBackdropImageTags||[],
        SeriesName:undefined,PrimaryImageAspectRatio:show?.PrimaryImageAspectRatio};
    });
  }
  async fetchContinueWatching(route, inventory, limit = 16) {
    const parentFilter = route.parentId ? { ParentId: route.parentId } : {};
    const fields = 'DateCreated,PrimaryImageAspectRatio,ParentId';
    const mediaTypes = route.page === 'movies' ? 'Movie' : route.page === 'shows' ? 'Episode' : 'Movie,Episode';
    const tasks = [
      this.json('Items/Resume', { UserId: this.userId, Limit: limit, IncludeItemTypes: mediaTypes, ...parentFilter, Fields: fields, EnableImages: true, EnableUserData: true, ImageTypeLimit: 1, EnableImageTypes: 'Primary,Backdrop,Thumb' }).catch(() => ({ Items: [] }))
    ];
    if (route.page !== 'movies') {
      tasks.push(
        this.json('Shows/NextUp', { UserId: this.userId, Limit: limit, ...parentFilter, Fields: fields, EnableImages: true, EnableUserData: true, ImageTypeLimit: 1, EnableImageTypes: 'Primary,Backdrop,Thumb' }).catch(() => ({ Items: [] }))
      );
    }
    const results = await Promise.all(tasks);
    this.assertCurrent();
    const combined = [...(results[0]?.Items || []), ...(results[1]?.Items || [])].filter(i => !isLeavingSoonItem(i));
    if (!combined.length && this.prefetchedSections.has('ContinueWatchingNextUp')) {
      try {
        const pref = await this.prefetchedSections.get('ContinueWatchingNextUp');
        this.prefetchedSections.delete('ContinueWatchingNextUp');
        if (pref?.Items?.length) return this.groupResume(pref.Items.filter(i => !isLeavingSoonItem(i)), inventory).slice(0, limit);
      } catch {}
    }
    return this.groupResume(combined, inventory).slice(0, limit);
  }
  async fastOpening(route, config) {
    if (route.view === 'genres' || route.view === 'library' || route.view === 'favorites') return [];
    const profile = config?.pages?.[route.page];
    const opening = Array.isArray(profile?.opening) ? profile.opening : [];
    const firstToken = opening.length
      ? opening[0]
      : (Array.isArray(profile?.anchors) && profile.anchors.length ? `anchor:${profile.anchors[0]}` : 'anchor:ContinueWatchingNextUp');
    if (firstToken !== 'anchor:ContinueWatchingNextUp') return [];
    const limit = Math.min(config?.cardsPerShelf || 20, 20);
    const items = await this.fetchContinueWatching(route, { items: [] }, limit).catch(() => []);
    this.assertCurrent();
    return items.length ? [{ key: 'ContinueWatchingNextUp', title: 'Continue Watching / Next Up', family: 'anchor', items }] : [];
  }
  async anchor(id, route, inventory, config) {
    const typed = list => route.page === 'home' ? list : list.filter(i => route.page === 'movies' ? i.Type === 'Movie' || i.SourceType === 'movie' : ['Series', 'Episode'].includes(i.Type) || i.SourceType === 'tv');
    const arrival = item => { const r=inventory.tracking?.get(item.Id);return Date.parse(kindDate(item,r))||0; };
    const kindDate = (item,r) => item.Type==='Series' ? r?.NewSeasonAt||r?.AddedAt : r?.AddedAt;
    const recentItems = kind => inventory.items.filter(i => i.Type === kind).sort((a, b) => Number(!!arrival(b))-Number(!!arrival(a)) || arrival(b)-arrival(a) || (Date.parse(b.DateCreated) || 0) - (Date.parse(a.DateCreated) || 0)).slice(0, config.cardsPerShelf);
    const title = { ContinueWatchingNextUp: 'Continue Watching / Next Up', RecentlyAddedMovies: 'Recently Added in Movies', RecentlyAddedShows: 'Recently Added in Shows', DiscoverMovies: 'Discover Movies', DiscoverTV: 'Discover TV Shows', MyJellyseerrRequests: 'My Requests', MyMedia: 'My Media' }[id];
    const seeMoreItem = id === 'DiscoverMovies'
      ? { Id: 'fx-see-more:movies', Name: 'All Popular Movies', Type: 'SeeMore', SeeMoreKind: 'movies', SeeMoreLabel: 'See More', SeeMoreSub: 'Popular Movies' }
      : id === 'DiscoverTV'
        ? { Id: 'fx-see-more:tv', Name: 'All Popular Series', Type: 'SeeMore', SeeMoreKind: 'tv', SeeMoreLabel: 'See More', SeeMoreSub: 'Popular Series' }
        : null;
    if (id === 'RecentlyAddedMovies' || id === 'RecentlyAddedShows') return { key: id, title, family: 'anchor', items: recentItems(id === 'RecentlyAddedMovies' ? 'Movie' : 'Series') };
    if (id === 'MyMedia') return { key: id, title, family: 'anchor', items: inventory.views };
    if (id === 'ContinueWatchingNextUp' && !this.prefetchedSections.has(id) && typeof this.api?.getUrl === 'function') {
      try {
        const items = await this.fetchContinueWatching(route, inventory, config.cardsPerShelf);
        if (items.length) {
          let list = typed(items).filter(i => !isLeavingSoonItem(i));
          if ((route.parentId || leavingSoonState.itemIds.size > 0) && inventory.items?.length) {
            const allowed = new Set(inventory.items.map(i => i.Id));
            list = list.filter(i => allowed.has(i.Id) || allowed.has(i.SeriesId));
          }
          return { key: id, title, family: 'anchor', items: list.slice(0, config.cardsPerShelf), external: false };
        }
      } catch {
        this.assertCurrent();
      }
    }
    if ((id === 'DiscoverMovies' || id === 'DiscoverTV') && !this.prefetchedSections.has(id)) {
      try {
        const kind = id === 'DiscoverMovies' ? 'movies' : 'tv';
        const targetCount = Math.max(config.cardsPerShelf || 20, 20);
        const today = new Date().toISOString().slice(0, 10);
        const isReleased = r => !r?.releaseDate || String(r.releaseDate).slice(0, 10) <= today;
        const rh = await this.json('RequestHub/Browse', { kind, page: 1 });
        let rawList = Array.isArray(rh?.results) ? rh.results.filter(isReleased) : [];
        if (rawList.length > 0 && rawList.length < targetCount && (rh?.totalPages || 1) >= 2) {
          try {
            const rh2 = await this.json('RequestHub/Browse', { kind, page: 2 });
            if (Array.isArray(rh2?.results)) {
              const seenIds = new Set(rawList.map(r => r.id));
              for (const r of rh2.results.filter(isReleased)) {
                if (!seenIds.has(r.id)) {
                  seenIds.add(r.id);
                  rawList.push(r);
                }
              }
            }
          } catch {}
        }
        if (rawList.length) {
          const mapped = rawList.slice(0, targetCount).map(r => ({
            Id: `rh:${kind}:${r.id}`,
            Name: r.title || 'Untitled',
            Type: kind === 'movies' ? 'Movie' : 'Series',
            SourceType: r.type || (kind === 'movies' ? 'movie' : 'tv'),
            ProductionYear: r.year,
            ProviderIds: {
              Jellyseerr: String(r.id),
              JellyseerrRoot: 'https://jellyseerr.local',
              ...(r.poster ? { JellyseerrPoster: r.poster } : {})
            }
          }));
          if (seeMoreItem) mapped.push(seeMoreItem);
          return { key: id, title, family: 'anchor', items: mapped, external: true };
        }
      } catch {
        this.assertCurrent();
      }
    }
    try {
      const prefetched = this.prefetchedSections.get(id);
      if (prefetched) this.prefetchedSections.delete(id);
      const response = prefetched ? await prefetched : await this.json(`HomeScreen/Section/${id}`, { UserId: this.userId });
      let list = typed(response.Items || []).filter(i => id.startsWith('Discover') || !isLeavingSoonItem(i));
      if ((route.parentId || leavingSoonState.itemIds.size > 0) && !id.startsWith('Discover') && inventory.items?.length) {
        const allowed = new Set(inventory.items.map(i => i.Id));
        list = list.filter(i => allowed.has(i.Id) || allowed.has(i.SeriesId));
      }
      if(id==='ContinueWatchingNextUp')list=this.groupResume(list,inventory);
      const maxItems = id.startsWith('Discover') ? Math.max(config.cardsPerShelf || 20, 20) : config.cardsPerShelf;
      const sliced = list.slice(0, maxItems);
      if (seeMoreItem && sliced.length) sliced.push(seeMoreItem);
      return { key: id, title, family: 'anchor', items: sliced, external: id.startsWith('Discover') };
    } catch (error) {
      this.assertCurrent();
      if (id !== 'ContinueWatchingNextUp') throw error;
      const resume = await this.json('Items/Resume', { UserId: this.userId, Limit: config.cardsPerShelf, ...(route.parentId ? { ParentId: route.parentId } : {}), Fields: 'DateCreated,PrimaryImageAspectRatio', EnableImages: true });
      return { key: id, title: 'Continue Watching', family: 'anchor', items: this.groupResume(typed(resume.Items || []).filter(i => !isLeavingSoonItem(i)),inventory).slice(0, config.cardsPerShelf) };
    }
  }
}
