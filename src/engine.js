// Pure planning functions are shared by the browser bundle and Node tests.
export const normalize = value => String(value ?? '').trim().toLocaleLowerCase('en-US');
export const intersects = (wanted, actual) => !wanted?.length || wanted.some(x => (actual || []).some(y => normalize(x) === normalize(y)));
export function hash(value) {
  let result = 2166136261;
  for (const c of String(value)) result = Math.imul(result ^ c.charCodeAt(0), 16777619);
  return result >>> 0;
}
export function dayInZone(now, zone) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const part = key => parts.find(p => p.type === key).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
export function monthAgo(now) {
  const cutoff = new Date(now);
  const day = cutoff.getUTCDate();
  cutoff.setUTCDate(1);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - 1);
  const lastDay = new Date(Date.UTC(cutoff.getUTCFullYear(), cutoff.getUTCMonth() + 1, 0)).getUTCDate();
  cutoff.setUTCDate(Math.min(day, lastDay));
  return cutoff;
}
export function recent(date, now) {
  const time = Date.parse(date);
  return Number.isFinite(time) && time >= monthAgo(now).getTime() && time <= now.getTime();
}
export function seasonBadges(seasons, now) {
  const map = new Map();
  for (const season of seasons) {
    // Episode additions and specials cannot mark an existing season as new.
    if (season.Type !== 'Season' || !(season.IndexNumber >= 2) || !recent(season.DateCreated, now)) continue;
    const series = season.SeriesId || season.ParentId;
    if (series) map.set(series, 'New Season');
  }
  return map;
}
export function badgeFor(item, seasons, now, tracking = null) {
  if (tracking) {
    const record = tracking.get(item.Id);
    if (item.Type === 'Series' && recent(record?.NewSeasonAt, now)) return 'New Season';
    return recent(record?.AddedAt, now) ? 'Recently Added' : '';
  }
  if (item.Type === 'Series' && seasons.has(item.Id)) return 'New Season';
  return ['Movie', 'Series'].includes(item.Type) && recent(item.DateCreated, now) ? 'Recently Added' : '';
}
export const DEFAULT_FILTERS = { query: '', genre: '', tag: '', watched: 'all', maxMinutes: '', minRating: '', decade: '', type: '', sort: 'recommended' };
export function filtersActive(filters) {
  return Object.keys(DEFAULT_FILTERS).some(k => k !== 'sort' && String(filters[k] ?? '') !== String(DEFAULT_FILTERS[k]));
}
export function filterItems(items, filters, tracking = new Map()) {
  let result = items.filter(i => {
    const query = normalize(filters.query);
    const haystack = normalize([i.Name, ...(i.People || []).map(p => p.Name)].join(' '));
    return (!query || haystack.includes(query)) &&
      (!filters.genre || intersects([filters.genre], i.Genres)) &&
      (!filters.tag || intersects([filters.tag], i.Tags)) &&
      (!filters.type || i.Type === filters.type) &&
      (filters.watched === 'all' || !!i.UserData?.Played === (filters.watched === 'watched')) &&
      (!filters.maxMinutes || (i.Type === 'Movie' && i.RunTimeTicks > 0 && i.RunTimeTicks < Number(filters.maxMinutes) * 600000000)) &&
      (!filters.minRating || (i.CommunityRating != null && i.CommunityRating >= Number(filters.minRating))) &&
      (!filters.decade || (i.ProductionYear >= Number(filters.decade) && i.ProductionYear < Number(filters.decade) + 10));
  });
  if (filters.sort !== 'recommended') result = result.slice().sort((a, b) => {
    if (filters.sort === 'rating') return (b.CommunityRating ?? -1) - (a.CommunityRating ?? -1) || String(a.Name).localeCompare(String(b.Name));
    if (filters.sort === 'year') return (b.ProductionYear || 0) - (a.ProductionYear || 0) || String(a.Name).localeCompare(String(b.Name));
    if (filters.sort === 'added') return (Date.parse(tracking.get(b.Id)?.AddedAt) || 0) - (Date.parse(tracking.get(a.Id)?.AddedAt) || 0) || String(a.Name).localeCompare(String(b.Name));
    return String(a.Name || '').localeCompare(String(b.Name || ''));
  });
  return result;
}
export function similarItems(seed, items, limit = 24) {
  const tokens = (item, field) => new Set((item[field] || []).map(normalize).filter(Boolean));
  const shared = (a, b) => [...a].filter(x => b.has(x));
  const seedTags = tokens(seed, 'Tags'), seedGenres = tokens(seed, 'Genres');
  const credits = (item, type) => new Set((item.People || []).filter(p => p.Type === type).map(p => normalize(p.Name)));
  const directors = credits(seed, 'Director'), actors = credits(seed, 'Actor');
  const frequencies = new Map();
  items.forEach(item => tokens(item, 'Tags').forEach(tag => frequencies.set(tag, (frequencies.get(tag) || 0) + 1)));
  return items.filter(i => i.Id !== seed.Id && ['Movie', 'Series'].includes(i.Type)).map(item => {
    const tags = shared(seedTags, tokens(item, 'Tags')), genres = shared(seedGenres, tokens(item, 'Genres'));
    const ds = shared(directors, credits(item, 'Director')), cast = shared(actors, credits(item, 'Actor'));
    const score = tags.reduce((sum, t) => sum + 3 * Math.log(2 + items.length / (frequencies.get(t) || 1)), 0) + genres.length * 1.5 + ds.length * 4 + Math.min(3, cast.length);
    const names = tags.length ? tags.slice(0, 2) : ds.length ? ['same director'] : genres.length ? genres.slice(0, 2) : cast.length ? ['shared cast'] : [];
    return { item, score, reason: names.join(' · ') };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score || String(a.item.Name).localeCompare(String(b.item.Name))).slice(0, limit);
}
export function cloneJson(value) { return JSON.parse(JSON.stringify(value)); }
export function matches(rule, item, hideWatched = false) {
  const people = item.People || [];
  return (rule.Types || ['Movie']).includes(item.Type) &&
    (!hideWatched || !item.UserData?.Played) &&
    intersects(rule.GenresAny, item.Genres) && intersects(rule.TagsAny, item.Tags) &&
    intersects(rule.DirectorsAny, people.filter(p => p.Type === 'Director').map(p => p.Name)) &&
    intersects(rule.ActorsAny, people.filter(p => p.Type === 'Actor').map(p => p.Name)) &&
    intersects(rule.StudiosAny, (item.Studios || []).map(s => s.Name)) &&
    (rule.MinRating == null || (item.CommunityRating != null && item.CommunityRating >= rule.MinRating)) &&
    (rule.MaxMinutes == null || (item.RunTimeTicks > 0 && item.RunTimeTicks < rule.MaxMinutes * 600000000)) &&
    (!rule.Years?.length || (item.ProductionYear >= rule.Years[0] && item.ProductionYear <= rule.Years[1]));
}
const familiesAllowed = new Set(['theme', 'genre', 'director', 'actor', 'decade', 'studio', 'rating', 'rewatch', 'runtime']);
const anchorsAllowed = new Set(['ContinueWatchingNextUp', 'RecentlyAddedMovies', 'RecentlyAddedShows', 'DiscoverMovies', 'DiscoverTV', 'MyJellyseerrRequests', 'MyMedia']);
export function validateConfig(config) {
  if (config?.schemaVersion !== 1) throw Error('schemaVersion must be 1.');
  dayInZone(new Date(), config.timeZone);
  for (const [key, min, max] of [['cardsPerShelf', 3, 24], ['batchSize', 1, 8], ['minimumItems', 1, 12], ['maxLiveRows', 12, 60]]) {
    if (!Number.isInteger(config[key]) || config[key] < min || config[key] > max) throw Error(`${key} must be ${min}–${max}.`);
  }
  if (config.minimumItems > config.cardsPerShelf) throw Error('minimumItems cannot exceed cardsPerShelf.');
  if (typeof config.endless !== 'boolean' || typeof config.hideWatched !== 'boolean') throw Error('endless and hideWatched must be true or false.');
  for (const page of ['home', 'movies', 'shows']) {
    const profile = config.pages?.[page];
    if (!profile || !Array.isArray(profile.rules) || profile.rules.length > 100) throw Error(`${page}: use up to 100 rules.`);
    if (!Array.isArray(profile.anchors) || profile.anchors.some(a => !anchorsAllowed.has(a)) || new Set(profile.anchors).size !== profile.anchors.length) throw Error(`${page}: invalid or duplicate anchors.`);
    if (!Array.isArray(profile.families) || profile.families.some(f => !familiesAllowed.has(f))) throw Error(`${page}: invalid families.`);
    const keys = new Set();
    for (const r of profile.rules) {
      if (!r || !/^[a-zA-Z0-9-]{1,60}$/.test(r.Key) || keys.has(r.Key)) throw Error(`${page}: rule keys must be unique letters, digits or hyphens.`);
      keys.add(r.Key);
      if (typeof r.Title !== 'string' || !r.Title.trim() || r.Title.length > 120) throw Error(`${r.Key}: title needs 1–120 characters.`);
      if (r.Enabled != null && typeof r.Enabled !== 'boolean') throw Error(`${r.Key}: Enabled must be true or false.`);
      if (!Array.isArray(r.Types) || !r.Types.length || r.Types.some(t => !['Movie', 'Series'].includes(t))) throw Error(`${r.Key}: Types must contain Movie and/or Series.`);
      for (const field of ['GenresAny', 'TagsAny', 'DirectorsAny', 'ActorsAny', 'StudiosAny']) {
        if (r[field] != null && (!Array.isArray(r[field]) || r[field].some(v => typeof v !== 'string' || !v.trim()))) throw Error(`${r.Key}: ${field} must be a string array.`);
      }
      if (r.Months != null && (!Array.isArray(r.Months) || r.Months.some(m => !Number.isInteger(m) || m < 1 || m > 12))) throw Error(`${r.Key}: Months must contain 1–12.`);
      if (r.Years != null && (!Array.isArray(r.Years) || r.Years.length !== 2 || r.Years.some(y => !Number.isInteger(y)) || r.Years[0] > r.Years[1])) throw Error(`${r.Key}: Years must be [first, last].`);
      if (r.MinRating != null && (!Number.isFinite(r.MinRating) || r.MinRating < 0 || r.MinRating > 10)) throw Error(`${r.Key}: MinRating must be 0–10.`);
      if (r.MaxMinutes != null && (!Number.isInteger(r.MaxMinutes) || r.MaxMinutes <= 0)) throw Error(`${r.Key}: MaxMinutes must be a positive whole number.`);
    }
  }
  return config;
}
export function buildShelves(items, profile, config, page, now) {
  const eligible = items.filter(i => (page === 'home' ? ['Movie', 'Series'].includes(i.Type) : i.Type === (page === 'movies' ? 'Movie' : 'Series')) && (!config.hideWatched || !i.UserData?.Played));
  const month = Number(dayInZone(now, config.timeZone).split('-')[1]);
  const shelves = [];
  const add = (key, title, family, list) => {
    const unique = Array.from(new Map(list.map(i => [i.Id, i])).values());
    if (unique.length >= config.minimumItems) shelves.push({ key, title, family, items: unique });
  };
  for (const rule of profile.rules) {
    if (rule.Enabled === false || (rule.Months?.length && !rule.Months.includes(month))) continue;
    add(`rule:${rule.Key}`, rule.Title, 'theme', eligible.filter(i => matches(rule, i)));
  }
  const grouping = (family, values, title, filter = () => true) => {
    if (!profile.families.includes(family)) return;
    const groups = new Map();
    for (const item of eligible.filter(filter)) {
      for (const value of new Set(values(item).filter(Boolean))) {
        const key = normalize(value);
        if (!groups.has(key)) groups.set(key, { name: value, items: [] });
        groups.get(key).items.push(item);
      }
    }
    Array.from(groups.entries()).sort((a, b) => b[1].items.length - a[1].items.length || a[0].localeCompare(b[0])).slice(0, 60).forEach(([key, g]) => add(`${family}:${key}`, title(g.name), family, g.items));
  };
  const label = page === 'movies' ? 'Movies' : page === 'shows' ? 'Shows' : 'Movies & Shows';
  grouping('genre', i => i.Genres || [], g => `${g} ${label}`);
  grouping('director', i => (i.People || []).filter(p => p.Type === 'Director').map(p => p.Name), p => `Directed by ${p}`);
  grouping('actor', i => (i.People || []).filter(p => p.Type === 'Actor').slice(0, 8).map(p => p.Name), p => `Starring ${p}`);
  grouping('studio', i => (i.Studios || []).map(s => s.Name), s => `From ${s}`);
  grouping('decade', i => i.ProductionYear ? [String(Math.floor(i.ProductionYear / 10) * 10)] : [], d => `Highly Rated from the ${d}s`, i => i.CommunityRating >= 7);
  if (profile.families.includes('rating')) add('rating:8', `Highly Rated ${label}`, 'rating', eligible.filter(i => i.CommunityRating >= 8));
  if (profile.families.includes('rewatch')) add('rewatch:played', 'Worth Another Watch', 'rewatch', items.filter(i => i.UserData?.Played && (page === 'home' || i.Type === (page === 'movies' ? 'Movie' : 'Series'))));
  if (profile.families.includes('runtime')) add('runtime:short', 'Movie Night Under Two Hours', 'runtime', eligible.filter(i => i.Type === 'Movie' && i.RunTimeTicks > 0 && i.RunTimeTicks < 72000000000));
  // A broad pool keeps smaller libraries browseable even when tags are sparse.
  add('genre:explore', `Explore More ${label}`, 'genre', eligible);
  return shelves;
}
export class FeedPlanner {
  constructor(shelves, config, seed) {
    this.shelves = shelves; this.config = config; this.seed = seed;
    this.counts = new Map(); this.lastFamilies = []; this.lastKeys = []; this.lastItems = []; this.index = 0;
  }
  next(preferredFamily = null) {
    if (!this.shelves.length) return null;
    let pool = this.shelves.filter(s => this.config.endless || !this.counts.has(s.key));
    if (!pool.length) return null;
    const fresh = pool.filter(s => !this.lastKeys.includes(s.key));
    if (fresh.length) pool = fresh;
    const preferred = pool.filter(s => s.family === preferredFamily);
    if (preferred.length) pool = preferred;
    const familyDiverse = pool.filter(s => !this.lastFamilies.includes(s.family));
    if (familyDiverse.length) pool = familyDiverse;
    pool.sort((a, b) => (this.counts.get(a.key) || 0) - (this.counts.get(b.key) || 0) || hash(`${this.seed}:${this.index}:${a.key}`) - hash(`${this.seed}:${this.index}:${b.key}`));
    const shelf = pool[0], recentIds = new Set(this.lastItems);
    const selected = shelf.items.slice().sort((a, b) => Number(recentIds.has(a.Id)) - Number(recentIds.has(b.Id)) || hash(`${this.seed}:${this.index}:${a.Id}`) - hash(`${this.seed}:${this.index}:${b.Id}`)).slice(0, this.config.cardsPerShelf);
    this.counts.set(shelf.key, (this.counts.get(shelf.key) || 0) + 1);
    this.lastKeys.push(shelf.key);
    const cooldown = Math.min(12, Math.max(0, this.shelves.length - 1));
    this.lastKeys = cooldown ? this.lastKeys.slice(-cooldown) : [];
    this.lastFamilies.push(shelf.family); this.lastFamilies = this.lastFamilies.slice(-2);
    this.lastItems.push(...selected.map(i => i.Id)); this.lastItems = this.lastItems.slice(-this.config.cardsPerShelf * 5);
    this.index++;
    return { ...shelf, items: selected, ordinal: this.index };
  }
}
export function routeInfo(hashValue) {
  const value = String(hashValue || '').replace(/^#!?\/?/, '').replace(/^\//, '');
  const [path, query = ''] = value.split('?');
  const p = new URLSearchParams(query), name = path.replace(/\.html$/, '').toLowerCase();
  if (p.has('seerrfintab') || (p.has('tab') && p.get('tab') !== '0')) return null;
  const collection = p.get('collectionType')?.toLowerCase();
  const page = ['home', ''].includes(name) ? 'home' : name === 'movies' ? 'movies' : ['tv', 'tvshows'].includes(name) ? 'shows' : name === 'list' && ['movies', 'tvshows'].includes(collection) ? (collection === 'movies' ? 'movies' : 'shows') : null;
  return page ? { page, parentId: p.get('topParentId') || p.get('parentId') || '', serverId: p.get('serverId') || '' } : null;
}
