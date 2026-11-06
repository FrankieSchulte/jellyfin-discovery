(() => {
  (() => {
    "use strict";
    var _a, _b, _c, _d;
    if (!Element.prototype.replaceChildren) Element.prototype.replaceChildren = function(...nodes) {
      while (this.firstChild) this.removeChild(this.firstChild);
      this.append(...nodes);
    };
    (_b = (_a = window.JellyfinRequestHub) == null ? void 0 : _a.stop) == null ? void 0 : _b.call(_a);
    let root = null, hidden = [], generation = 0, session = "", timer, observer;
    const el = (tag, text = "", cls = "") => {
      const n = document.createElement(tag);
      if (text) n.textContent = text;
      if (cls) n.className = cls;
      return n;
    };
    const button = (text, fn, cls = "") => {
      const n = el("button", text, cls);
      n.type = "button";
      n.onclick = fn;
      return n;
    };
    const scope = () => {
      var _a2, _b2;
      const api2 = window.ApiClient;
      return ((_a2 = api2 == null ? void 0 : api2.getCurrentUserId) == null ? void 0 : _a2.call(api2)) ? `${(_b2 = api2.serverId) == null ? void 0 : _b2.call(api2)}:${api2.getCurrentUserId()}` : "";
    };
    async function api(path, query = {}, body = null) {
      const client = window.ApiClient, own = scope();
      if (!own) throw Error("Sign in to Jellyfin.");
      const result = body ? await client.ajax({ url: client.getUrl("RequestHub/" + path), type: "POST", contentType: "application/json", dataType: "json", data: JSON.stringify(body) }) : await client.getJSON(client.getUrl("RequestHub/" + path, query));
      if (scope() !== own) throw Error("Your account changed.");
      return result;
    }
    function restoreHidden() {
      hidden.forEach((n) => n.removeAttribute("data-rh-hidden"));
      hidden = [];
      document.querySelectorAll("[data-rh-hidden]").forEach((n) => n.removeAttribute("data-rh-hidden"));
    }
    function cleanup() {
      generation++;
      root == null ? void 0 : root.remove();
      root = null;
      restoreHidden();
    }
    const STATUS_LABELS = { 2: "Pending", 3: "Processing", 4: "Partly available", 5: "Available", 6: "Unavailable" };
    const STATUS_CLASSES = { 2: "rh-status-pending", 3: "rh-status-processing", 4: "rh-status-partial", 5: "rh-status-available", 6: "rh-status-unavailable" };
    function poster(item) {
      const frame = el("div", "", "rh-poster");
      if (item.poster) {
        try {
          const u = new URL(item.poster);
          if (u.protocol === "https:" && u.hostname === "image.tmdb.org") {
            const img = el("img");
            img.src = u.href;
            img.alt = "";
            img.loading = "lazy";
            img.onerror = () => img.remove();
            frame.append(img);
          }
        } catch {
        }
      }
      frame.append(el("span", item.type === "tv" ? "Series" : "Movie", "rh-type"));
      if (item.status >= 2) {
        frame.append(el("span", STATUS_LABELS[item.status] || "Requested", `rh-status ${STATUS_CLASSES[item.status] || ""}`.trim()));
      }
      return frame;
    }
    async function details(item) {
      const current = generation;
      let data;
      try {
        data = await api("Details", { type: item.type, id: item.id });
      } catch {
        if (root) {
          const st = root.querySelector('[role="status"]');
          if (st) st.textContent = "Could not load this title. Check your Request Hub account mapping.";
        }
        return;
      }
      if (current !== generation || !root) return;
      root.querySelectorAll(".rh-overlay").forEach((n) => n.remove());
      const overlay = el("div", "", "rh-overlay"), dialog = el("section", "", "rh-dialog");
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
      dialog.tabIndex = -1;
      const previous = document.activeElement, close = () => {
        var _a2;
        overlay.remove();
        (_a2 = previous == null ? void 0 : previous.focus) == null ? void 0 : _a2.call(previous);
      };
      overlay.onclick = (e) => {
        if (e.target === overlay) close();
      };
      const topBar = el("div", "", "rh-dialog-top");
      const closeBtn = button("Close", close, "rh-btn rh-btn-ghost rh-dialog-close");
      topBar.append(el("span", data.item.type === "tv" ? "Series Request" : "Movie Request", "rh-dialog-kicker"), closeBtn);
      const body = el("div", "", "rh-dialog-body");
      const mediaCol = el("div", "", "rh-dialog-media");
      mediaCol.append(poster(data.item));
      const infoCol = el("div", "", "rh-dialog-info");
      infoCol.append(el("h2", data.item.title, "rh-dialog-title"));
      if (data.item.releaseDate || data.item.year) {
        infoCol.append(el("div", String(data.item.releaseDate || data.item.year).slice(0, 4), "rh-dialog-meta"));
      }
      infoCol.append(el("p", data.item.overview || "No synopsis available.", "rh-dialog-overview"));
      const seasons = [];
      if (item.type === "tv") {
        const group = el("fieldset", "", "rh-seasons");
        const legend = el("legend", "Choose seasons to request");
        const quickRow = el("div", "", "rh-season-actions");
        const grid = el("div", "", "rh-season-grid");
        const syncBoxes = () => {
          seasons.length = 0;
          grid.querySelectorAll('input[type="checkbox"]').forEach((b) => {
            var _a2, _b2;
            const num = Number(b.dataset.seasonNumber);
            if (b.checked && !seasons.includes(num)) seasons.push(num);
            (_b2 = (_a2 = b.closest("label")) == null ? void 0 : _a2.classList) == null ? void 0 : _b2.toggle("is-checked", Boolean(b.checked));
          });
        };
        const selectAll = button("Select all", () => {
          grid.querySelectorAll('input[type="checkbox"]').forEach((b) => {
            b.checked = true;
          });
          syncBoxes();
        }, "rh-btn rh-btn-xs");
        const clearAll = button("Clear", () => {
          grid.querySelectorAll('input[type="checkbox"]').forEach((b) => {
            b.checked = false;
          });
          syncBoxes();
        }, "rh-btn rh-btn-xs");
        quickRow.append(selectAll, clearAll);
        group.append(legend, quickRow, grid);
        (data.seasons || []).forEach((number) => {
          const label = el("label", number === 0 ? "Specials" : `Season ${number}`, "rh-season-chip");
          const box = el("input");
          box.type = "checkbox";
          box.dataset.seasonNumber = String(number);
          box.onchange = () => {
            var _a2;
            const i = seasons.indexOf(number);
            if (box.checked && i < 0) seasons.push(number);
            else if (!box.checked && i >= 0) seasons.splice(i, 1);
            (_a2 = label.classList) == null ? void 0 : _a2.toggle("is-checked", Boolean(box.checked));
          };
          label.prepend(box);
          grid.append(label);
        });
        infoCol.append(group);
      }
      const status = el("p", "", "rh-dialog-status");
      status.setAttribute("role", "status");
      const actions = el("div", "", "rh-dialog-actions");
      const confirm = button("Confirm request", async () => {
        if (item.type === "tv" && !seasons.length) {
          status.textContent = "Select at least one season.";
          return;
        }
        confirm.disabled = true;
        status.textContent = "Submitting request\u2026";
        try {
          const result = await api("Request", {}, { type: item.type, id: item.id, seasons });
          if (current !== generation || !overlay.isConnected) return;
          status.textContent = result.message || "Submitted for approval";
        } catch (e) {
          if (overlay.isConnected) {
            status.textContent = (e == null ? void 0 : e.status) === 403 ? "Request denied. Check permissions or quota." : (e == null ? void 0 : e.status) === 409 ? "Already requested." : (e == null ? void 0 : e.status) === 429 ? "Please wait before submitting another request." : "Request failed. Check Jellyseerr availability and try again.";
            confirm.disabled = false;
          }
        }
      }, "rh-btn rh-btn-primary");
      confirm.disabled = !data.canRequest || data.item.status === 5;
      if (data.item.status === 5) status.textContent = "Already available in Jellyfin.";
      actions.append(confirm);
      infoCol.append(actions, status);
      body.append(mediaCol, infoCol);
      dialog.append(topBar, body);
      overlay.append(dialog);
      root.append(overlay);
      dialog.focus();
      overlay.onkeydown = (e) => {
        var _a2;
        if (e.key === "Escape" || [10009, 461].includes(e.keyCode)) {
          e.preventDefault();
          close();
        }
        if (e.key === "Tab") {
          const controls = [...dialog.querySelectorAll("button,input")].filter((n) => !n.disabled), i = controls.indexOf(document.activeElement);
          if (e.shiftKey && i <= 0 || !e.shiftKey && i === controls.length - 1) {
            e.preventDefault();
            (_a2 = controls[e.shiftKey ? controls.length - 1 : 0]) == null ? void 0 : _a2.focus();
          }
        }
      };
    }
    function card(item) {
      const n = button("", () => details(item), "rh-card");
      const meta = el("div", "", "rh-card-body");
      meta.append(el("strong", item.title));
      n.append(poster(item), meta);
      return n;
    }
    async function rail(host, title, kind, filter = null, query = null) {
      const token = generation, row = el("section", "", "rh-row"), head = el("div", "", "rh-row-head"), controls = el("div", "", "rh-row-controls"), track = el("div", "", "rh-track"), status = el("p", "", "rh-row-status");
      status.setAttribute("role", "status");
      let page = 0, pages = 1, busy = false;
      const moreBtn = button("Load more", () => load(), "rh-btn rh-btn-subtle rh-load-more");
      const load = async () => {
        if (busy || page >= pages || track.children.length >= 200) return;
        busy = true;
        status.textContent = "Loading\u2026";
        try {
          const data = await api("Browse", { kind, page: page + 1, ...filter ? { filter } : {}, ...query ? { query } : {} });
          if (token !== generation || !row.isConnected) return;
          page++;
          pages = data.pages || 1;
          (data.results || []).filter((i) => ["movie", "tv"].includes(i.type)).forEach((i) => track.append(card(i)));
          status.textContent = track.children.length ? "" : "No titles found.";
          if (page >= pages) moreBtn.style.display = "none";
        } catch {
          if (row.isConnected) status.textContent = "Could not load titles. Check Request Hub configuration and your account mapping.";
        } finally {
          busy = false;
        }
      };
      const prevBtn = button("\u2039", () => track.scrollBy({ left: -track.clientWidth * 0.8, behavior: "smooth" }), "rh-btn rh-btn-icon");
      const nextBtn = button("\u203A", async () => {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 20 && page < pages) await load();
        track.scrollBy({ left: track.clientWidth * 0.8, behavior: "smooth" });
      }, "rh-btn rh-btn-icon");
      controls.append(moreBtn, prevBtn, nextBtn);
      head.append(el("h2", title), controls);
      track.addEventListener("scroll", () => {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 300 && track.children.length < 200) load();
      }, { passive: true });
      row.append(head, track, status);
      host.append(row);
      await load();
    }
    async function render() {
      const token = generation, hero = el("header", "", "rh-hero"), heroText = el("div", "", "rh-hero-copy"), bar = el("div", "", "rh-toolbar"), main = el("div", "", "rh-main"), search = el("form", "", "rh-search"), input = el("input");
      input.type = "search";
      input.placeholder = "Search movies and TV shows to request\u2026";
      input.setAttribute("aria-label", "Search movies and TV");
      const submit = button("Search", () => {
      }, "rh-btn rh-btn-primary");
      submit.type = "submit";
      const browseAll = button("Browse all", () => {
        generation++;
        input.value = "";
        main.replaceChildren();
        home(main);
      }, "rh-btn rh-btn-ghost");
      search.append(input, submit);
      search.onsubmit = (e) => {
        e.preventDefault();
        generation++;
        main.replaceChildren();
        if (input.value.trim()) rail(main, `Search: "${input.value.trim()}"`, "search", null, input.value.trim());
        else home(main);
      };
      heroText.append(el("span", "Jellyseerr Integration", "rh-kicker"), el("h1", "Discover"), el("p", "Browse trending movies and series, explore studios and genres, and request titles directly into Jellyfin.", "rh-subtitle"));
      bar.append(search, browseAll);
      hero.append(heroText, bar);
      root.append(hero, main);
      await home(main);
      if (token !== generation) return;
      const q = new URLSearchParams(location.hash.split("?")[1] || ""), type = q.get("mediaType"), id = Number(q.get("mediaId"));
      if (["movie", "tv"].includes(type) && id > 0) details({ type, id });
    }
    async function home(main) {
      const token = generation;
      await rail(main, "Trending Now", "trending");
      if (token !== generation) return;
      await rail(main, "Popular Movies", "movies");
      if (token !== generation) return;
      const pillGrid = el("div", "", "rh-filter-sections");
      const genres = el("section", "", "rh-pill-section");
      genres.append(el("h2", "Movie Genres"));
      const genreList = el("div", "", "rh-pills");
      genres.append(genreList);
      pillGrid.append(genres);
      const studios = el("section", "", "rh-pill-section");
      studios.append(el("h2", "Studios"));
      const studioList = el("div", "", "rh-pills");
      [[2, "Disney"], [3, "Pixar"], [420, "Marvel Studios"], [174, "Warner Bros."], [21, "MGM"], [521, "DreamWorks"], [33, "Universal"], [4, "Paramount"], [34, "Sony Pictures"], [41077, "A24"]].forEach(([id, name]) => {
        studioList.append(button(name, () => {
          generation++;
          main.replaceChildren();
          rail(main, name, "studio", id);
        }, "rh-chip"));
      });
      studios.append(studioList);
      pillGrid.append(studios);
      main.append(pillGrid);
      try {
        const data = await api("Browse", { kind: "genres" });
        if (token !== generation) return;
        (data.results || []).forEach((g) => genreList.append(button(g.name, () => {
          generation++;
          main.replaceChildren();
          rail(main, g.name, "genre", g.id);
        }, "rh-chip")));
      } catch {
        genreList.append(el("p", "Genres are unavailable.", "rh-muted"));
      }
      if (token !== generation) return;
      await rail(main, "Popular Series", "tv");
    }
    function openDiscoverRoute(e) {
      var _a2;
      (_a2 = e == null ? void 0 : e.preventDefault) == null ? void 0 : _a2.call(e);
      if (location.hash !== "#/home?requesthub=discover") {
        location.hash = "#/home?requesthub=discover";
      }
      reconcile();
      setTimeout(reconcile, 40);
      setTimeout(reconcile, 150);
    }
    function ensureNavigation(active) {
      const headerLeft = document.querySelector(".skinHeader .headerLeft");
      if (headerLeft && !headerLeft.querySelector("[data-rh-source]")) {
        const src = el("a", "", "headerButton headerButtonLeft rh-source-btn");
        src.href = "#/home?requesthub=discover";
        src.dataset.rhSource = "true";
        src.dataset.headerLabel = "Discover";
        src.title = "Discover";
        src.setAttribute("aria-label", "Discover");
        const icon = el("span", "", "material-icons explore");
        icon.setAttribute("aria-hidden", "true");
        const label = el("span", "Discover", "emby-button-foreground");
        src.append(icon, label);
        src.onclick = openDiscoverRoute;
        headerLeft.append(src);
      }
      const proxy = document.querySelector("[data-sleekfin-header-proxy]");
      if (proxy) {
        document.querySelectorAll("[data-rh-link]").forEach((n) => {
          if (!proxy.contains(n)) n.remove();
        });
        const nativeProxyBtn = proxy.querySelector('[data-sleekfin-header-proxy-item="dom:toolbar-discover"]');
        if (nativeProxyBtn) {
          nativeProxyBtn.dataset.rhLink = "true";
          nativeProxyBtn.onclick = openDiscoverRoute;
        } else if (!proxy.querySelector("[data-rh-link]")) {
          const btn = button("", openDiscoverRoute, "rh-nav");
          btn.dataset.rhLink = "true";
          btn.dataset.sleekfinHeaderProxyItem = "requesthub:discover";
          btn.dataset.sleekfinHeaderZone = "tabs";
          btn.title = "Discover";
          btn.setAttribute("aria-label", "Discover");
          const vis = el("span", "");
          vis.dataset.sleekfinHeaderSourceVisual = "icon-text";
          const icon = el("span", "", "material-icons explore");
          icon.dataset.sleekfinHeaderSourceIcon = "true";
          icon.setAttribute("aria-hidden", "true");
          const label = el("span", "Discover");
          label.dataset.sleekfinHeaderSourceLabel = "true";
          vis.append(icon, label);
          btn.append(vis);
          const anchor = proxy.querySelector('[data-sleekfin-header-separator],[data-sleekfin-header-proxy-item="jellyfin:search"],[data-sleekfin-header-proxy-item="jellyfin:user-menu"],[data-sleekfin-header-overflow-toggle]');
          if (anchor && anchor.parentNode === proxy) proxy.insertBefore(btn, anchor);
          else proxy.append(btn);
        }
      } else {
        const nav = document.querySelector(".headerTabs") || document.querySelector(".userPreferencesPage") || document.querySelector(".skinHeader");
        if (nav && !nav.querySelector("[data-rh-link]")) {
          const link = el("a", "Discover", "rh-nav");
          link.href = "#/home?requesthub=discover";
          link.dataset.rhLink = "true";
          link.onclick = openDiscoverRoute;
          nav.append(link);
        }
      }
      document.querySelectorAll("[data-rh-link]").forEach((n) => {
        if (active) {
          n.setAttribute("aria-current", "page");
          n.dataset.sleekfinCurrent = "true";
        } else {
          n.removeAttribute("aria-current");
          delete n.dataset.sleekfinCurrent;
        }
      });
      if (proxy && active) {
        proxy.querySelectorAll('[data-sleekfin-header-proxy-item="jellyfin:home"]').forEach((n) => {
          delete n.dataset.sleekfinCurrent;
          n.removeAttribute("aria-current");
        });
      }
    }
    function isDiscoverHash() {
      const h = String(location.hash || "");
      return /[?&]requesthub=discover(?:&|$)/i.test(h) && (/^#!?(?:\/)?home(?:\.html)?(?:[?#]|$)/i.test(h) || h.startsWith("?requesthub=discover"));
    }
    function reconcile() {
      var _a2, _b2;
      const own = scope();
      if (session && own !== session) cleanup();
      session = own;
      if (!own) {
        document.querySelectorAll("[data-rh-link],[data-rh-source]").forEach((n) => n.remove());
        cleanup();
        return;
      }
      const active = isDiscoverHash();
      ensureNavigation(active);
      if (!active) {
        if (root) cleanup();
        return;
      }
      (_b2 = (_a2 = document.documentElement) == null ? void 0 : _a2.classList) == null ? void 0 : _b2.remove("sleekfin-hero-boot-loading", "sleekfin-hero-loading");
      const candidates = [...document.querySelectorAll("#indexPage,.homePage")];
      const page = candidates.find((n) => !n.closest(".hide,.hidePage,[hidden]")) || candidates[0];
      if (!page) return;
      if ((root == null ? void 0 : root.isConnected) && root.parentNode === page) {
        [...page.children].forEach((n) => {
          if (n !== root && n.dataset.rhHidden !== "true") {
            n.dataset.rhHidden = "true";
            hidden.push(n);
          }
        });
        return;
      }
      cleanup();
      root = el("div", "", "rh-root");
      [...page.children].forEach((n) => {
        n.dataset.rhHidden = "true";
        hidden.push(n);
      });
      page.append(root);
      render();
    }
    const css = el("style");
    css.textContent = `
[data-rh-hidden=true]{display:none!important}
.rh-source-btn{display:none!important}
.rh-root{
 padding:calc(var(--sleekfin-header-height, 72px) + 24px) clamp(20px, 4vw, 56px) 64px;
 color:#f4f4f6;
 max-width:1680px;
 margin:0 auto;
 box-sizing:border-box;
 font-family:inherit;
}
.rh-hero{
 display:flex;
 flex-wrap:wrap;
 align-items:flex-end;
 justify-content:space-between;
 gap:20px;
 padding:26px 28px;
 margin-bottom:28px;
 border-radius:18px;
 background:linear-gradient(135deg, rgba(229,9,20,0.16) 0%, rgba(22,22,28,0.92) 52%, rgba(15,15,20,0.96) 100%);
 border:1px solid rgba(255,255,255,0.09);
 box-shadow:0 18px 42px rgba(0,0,0,0.38);
}
.rh-hero-copy{max-width:640px}
.rh-kicker{
 display:inline-block;
 font-size:11px;
 font-weight:700;
 letter-spacing:0.12em;
 text-transform:uppercase;
 color:#ff5a64;
 background:rgba(229,9,20,0.16);
 border:1px solid rgba(229,9,20,0.35);
 padding:4px 10px;
 border-radius:999px;
 margin-bottom:8px;
}
.rh-hero h1{
 font-size:clamp(1.75rem, 2.6vw, 2.35rem);
 font-weight:800;
 margin:0 0 6px;
 letter-spacing:-0.02em;
 color:#fff;
}
.rh-subtitle{
 margin:0;
 font-size:0.95rem;
 color:rgba(255,255,255,0.72);
 line-height:1.45;
}
.rh-toolbar{
 display:flex;
 flex-wrap:wrap;
 align-items:center;
 gap:10px;
 flex:1 1 420px;
 justify-content:flex-end;
}
.rh-search{
 display:flex;
 align-items:center;
 gap:8px;
 flex:1 1 300px;
 max-width:480px;
}
.rh-search input{
 flex:1;
 font:inherit;
 font-size:0.95rem;
 color:#fff;
 background:rgba(10,10,14,0.78);
 border:1px solid rgba(255,255,255,0.16);
 border-radius:999px;
 padding:11px 18px;
 min-width:0;
 transition:border-color .16s ease, box-shadow .16s ease;
}
.rh-search input:focus{
 outline:none;
 border-color:#e50914;
 box-shadow:0 0 0 3px rgba(229,9,20,0.22);
}
.rh-root button{
 font:inherit;
 color:#f3f4f6;
 background:rgba(255,255,255,0.07);
 border:1px solid rgba(255,255,255,0.14);
 border-radius:999px;
 min-height:40px;
 padding:8px 16px;
 font-weight:600;
 font-size:0.9rem;
 cursor:pointer;
 transition:background .15s ease, border-color .15s ease, transform .15s ease;
}
.rh-root button:hover:not(:disabled){
 background:rgba(255,255,255,0.14);
 border-color:rgba(255,255,255,0.28);
}
.rh-root button:disabled{
 opacity:0.48;
 cursor:not-allowed;
}
.rh-root button.rh-btn-primary{
 background:#e50914;
 border-color:#ff2a35;
 color:#fff;
}
.rh-root button.rh-btn-primary:hover:not(:disabled){
 background:#f6121d;
}
.rh-root button.rh-btn-icon{
 width:38px;
 height:38px;
 min-height:38px;
 padding:0;
 display:inline-grid;
 place-items:center;
 font-size:1.15rem;
}
.rh-root button.rh-btn-xs{
 min-height:30px;
 padding:4px 12px;
 font-size:0.8rem;
}
.rh-root button:focus-visible,.rh-nav:focus-visible{
 outline:2px solid #fff;
 outline-offset:2px;
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
.rh-row{margin-bottom:32px}
.rh-row-head{
 display:flex;
 align-items:center;
 justify-content:space-between;
 gap:12px;
 margin:22px 0 14px;
}
.rh-row-head h2,.rh-pill-section h2{
 border-left:3px solid #e50914;
 padding-left:12px;
 margin:0;
 font-size:1.22rem;
 font-weight:700;
 letter-spacing:-0.01em;
 color:#fff;
}
.rh-row-controls{
 display:flex;
 align-items:center;
 gap:8px;
}
.rh-track{
 display:flex;
 gap:16px;
 overflow-x:auto;
 padding:4px 2px 10px;
 scrollbar-width:none;
 scroll-behavior:smooth;
}
.rh-track::-webkit-scrollbar{display:none}
.rh-card{
 flex:0 0 172px;
 max-width:172px;
 text-align:left;
 border:0!important;
 padding:0!important;
 background:transparent!important;
 border-radius:12px!important;
 transition:transform .18s ease;
}
.rh-card:hover{transform:translateY(-4px)}
.rh-poster{
 position:relative;
 aspect-ratio:2/3;
 background:linear-gradient(160deg,#1f2029,#121318);
 border-radius:12px;
 overflow:hidden;
 border:1px solid rgba(255,255,255,0.08);
 box-shadow:0 10px 24px rgba(0,0,0,0.4);
}
.rh-poster img{
 height:100%;
 width:100%;
 object-fit:cover;
 display:block;
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
 background:rgba(18,22,34,0.82);
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
 font-size:0.92rem;
 font-weight:700;
 color:#f3f4f6;
 white-space:nowrap;
 overflow:hidden;
 text-overflow:ellipsis;
}
.rh-row-status{
 margin:6px 0 0;
 font-size:0.88rem;
 color:rgba(255,255,255,0.64);
}
.rh-row-status:empty{display:none}
.rh-filter-sections{
 display:grid;
 grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
 gap:20px;
 margin:28px 0 34px;
}
.rh-pill-section{
 background:rgba(22,22,28,0.75);
 border:1px solid rgba(255,255,255,0.08);
 border-radius:16px;
 padding:20px;
}
.rh-pills{
 display:flex;
 flex-wrap:wrap;
 gap:8px;
 margin-top:14px;
}
.rh-root button.rh-chip{
 min-height:36px;
 padding:6px 14px;
 font-size:0.86rem;
 background:rgba(255,255,255,0.06);
 border:1px solid rgba(255,255,255,0.12);
}
.rh-root button.rh-chip:hover{
 background:rgba(229,9,20,0.18);
 border-color:rgba(229,9,20,0.5);
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
 .rh-card{flex-basis:40vw;max-width:40vw}
 .rh-dialog-body{grid-template-columns:1fr}
 .rh-dialog .rh-poster{max-width:160px}
}
`;
    document.head.append(css);
    observer = new MutationObserver((records) => {
      if (records.some((r) => {
        var _a2, _b2;
        return !((_b2 = (_a2 = r.target) == null ? void 0 : _a2.closest) == null ? void 0 : _b2.call(_a2, ".rh-root,[data-rh-link],[data-rh-source]"));
      })) {
        clearTimeout(timer);
        timer = setTimeout(reconcile, 80);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden"] });
    window.addEventListener("hashchange", reconcile);
    window.addEventListener("popstate", reconcile);
    (_c = document.addEventListener) == null ? void 0 : _c.call(document, "viewshow", reconcile);
    (_d = document.addEventListener) == null ? void 0 : _d.call(document, "pageshow", reconcile);
    const heartbeat = setInterval(reconcile, 1500);
    window.JellyfinRequestHub = {
      stop() {
        var _a2, _b2;
        cleanup();
        observer.disconnect();
        clearTimeout(timer);
        clearInterval(heartbeat);
        window.removeEventListener("hashchange", reconcile);
        window.removeEventListener("popstate", reconcile);
        (_a2 = document.removeEventListener) == null ? void 0 : _a2.call(document, "viewshow", reconcile);
        (_b2 = document.removeEventListener) == null ? void 0 : _b2.call(document, "pageshow", reconcile);
        document.querySelectorAll("[data-rh-link],[data-rh-source]").forEach((n) => n.remove());
        css.remove();
      }
    };
    reconcile();
  })();
})();
