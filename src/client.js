export class JellyfinClient {
  constructor(api, current = () => true) {
    this.api = api; this.userId = api.getCurrentUserId(); this.current = current;
    this.serverId = api.serverId?.() || '';
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
    this.views = (views.Items || []).filter(v => ['movies', 'tvshows', '', null, undefined].includes(v.CollectionType));
    const folders = route.parentId ? [{ Id: route.parentId }] : this.views.filter(v => route.page === 'home' || !v.CollectionType || v.CollectionType === (route.page === 'movies' ? 'movies' : 'tvshows'));
    const type = route.page === 'movies' ? 'Movie' : route.page === 'shows' ? 'Series' : 'Movie,Series';
    const all = new Map(), seasons = new Map();
    for (const folder of folders) {
      for (const types of [type, ...(route.page === 'movies' ? [] : ['Season'])]) {
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
      }
    }
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
    for(const item of items){
      const key=item.Type==='Episode'&&item.SeriesId?item.SeriesId:item.Id;
      const old=grouped.get(key);
      const priority=i=>i.UserData?.PlaybackPositionTicks>0?2:1;
      if(old&&(priority(old)>priority(item)||priority(old)===priority(item)&&(Date.parse(old.UserData?.LastPlayedDate)||0)>=(Date.parse(item.UserData?.LastPlayedDate)||0)))continue;
      grouped.set(key,item);
    }
    return [...grouped.values()].map(item=>{
      if(item.Type!=='Episode'||!item.SeriesId)return item;
      const show=inventory.items.find(i=>i.Id===item.SeriesId);
      return {...item,Name:item.SeriesName||show?.Name||item.Name,Type:'Series',ResumeItemId:item.Id,
        Id:item.SeriesId,ImageTags:show?.ImageTags||{},BackdropImageTags:show?.BackdropImageTags||item.ParentBackdropImageTags||[],
        SeriesName:undefined,PrimaryImageAspectRatio:show?.PrimaryImageAspectRatio};
    });
  }
  async anchor(id, route, inventory, config) {
    const typed = list => route.page === 'home' ? list : list.filter(i => route.page === 'movies' ? i.Type === 'Movie' || i.SourceType === 'movie' : ['Series', 'Episode'].includes(i.Type) || i.SourceType === 'tv');
    const arrival = item => { const r=inventory.tracking?.get(item.Id);return Date.parse(kindDate(item,r))||0; };
    const kindDate = (item,r) => item.Type==='Series' ? r?.NewSeasonAt||r?.AddedAt : r?.AddedAt;
    const recentItems = kind => inventory.items.filter(i => i.Type === kind).sort((a, b) => Number(!!arrival(b))-Number(!!arrival(a)) || arrival(b)-arrival(a) || (Date.parse(b.DateCreated) || 0) - (Date.parse(a.DateCreated) || 0)).slice(0, config.cardsPerShelf);
    const title = { ContinueWatchingNextUp: 'Continue Watching / Next Up', RecentlyAddedMovies: 'Recently Added in Movies', RecentlyAddedShows: 'Recently Added in Shows', DiscoverMovies: 'Discover Movies', DiscoverTV: 'Discover TV Shows', MyJellyseerrRequests: 'My Requests', MyMedia: 'My Media' }[id];
    if (id === 'RecentlyAddedMovies' || id === 'RecentlyAddedShows') return { key: id, title, family: 'anchor', items: recentItems(id === 'RecentlyAddedMovies' ? 'Movie' : 'Series') };
    if (id === 'MyMedia') return { key: id, title, family: 'anchor', items: inventory.views };
    try {
      const response = await this.json(`HomeScreen/Section/${id}`, { UserId: this.userId });
      let list = typed(response.Items || []);
      if (route.parentId && !id.startsWith('Discover')) {
        const allowed = new Set(inventory.items.map(i => i.Id));
        list = list.filter(i => allowed.has(i.Id) || allowed.has(i.SeriesId));
      }
      if(id==='ContinueWatchingNextUp')list=this.groupResume(list,inventory);
      return { key: id, title, family: 'anchor', items: list.slice(0, config.cardsPerShelf), external: id.startsWith('Discover') };
    } catch (error) {
      this.assertCurrent();
      if (id !== 'ContinueWatchingNextUp') throw error;
      const resume = await this.json('Items/Resume', { UserId: this.userId, Limit: config.cardsPerShelf, ...(route.parentId ? { ParentId: route.parentId } : {}), Fields: 'DateCreated,PrimaryImageAspectRatio', EnableImages: true });
      return { key: id, title: 'Continue Watching', family: 'anchor', items: this.groupResume(typed(resume.Items || []),inventory).slice(0, config.cardsPerShelf) };
    }
  }
}
