(() => {
  (() => {
    "use strict";
    var _a, _b;
    if (!Element.prototype.replaceChildren) Element.prototype.replaceChildren = function(...nodes) {
      while (this.firstChild) this.removeChild(this.firstChild);
      this.append(...nodes);
    };
    (_b = (_a = window.JellyfinRequestHub) == null ? void 0 : _a.stop) == null ? void 0 : _b.call(_a);
    let root = null, hidden = [], generation = 0, session = "", timer, observer;
    const el = (tag, text = "", cls = "") => {
      const n = document.createElement(tag);
      n.textContent = text;
      if (cls) n.className = cls;
      return n;
    };
    const button = (text, fn) => {
      const n = el("button", text);
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
    function cleanup() {
      generation++;
      root == null ? void 0 : root.remove();
      root = null;
      hidden.forEach((n) => n.removeAttribute("data-rh-hidden"));
      hidden = [];
    }
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
      if (item.status >= 2) frame.append(el("span", { 2: "Pending", 3: "Processing", 4: "Partly available", 5: "Available", 6: "Unavailable" }[item.status] || "Requested", "rh-status"));
      return frame;
    }
    async function details(item) {
      const current = generation;
      let data;
      try {
        data = await api("Details", { type: item.type, id: item.id });
      } catch {
        if (root) root.querySelector('[role="status"]').textContent = "Could not load this title. Check your Request Hub account mapping.";
        return;
      }
      if (current !== generation || !root) return;
      const overlay = el("div", "", "rh-overlay"), dialog = el("section", "", "rh-dialog");
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
      dialog.tabIndex = -1;
      const previous = document.activeElement, close = () => {
        var _a2;
        overlay.remove();
        (_a2 = previous == null ? void 0 : previous.focus) == null ? void 0 : _a2.call(previous);
      };
      dialog.append(button("Close", close), el("h2", data.item.title), poster(data.item), el("p", data.item.overview));
      const seasons = [];
      if (item.type === "tv") {
        const group = el("fieldset");
        group.append(el("legend", "Choose seasons to request"));
        data.seasons.forEach((number) => {
          const label = el("label", number === 0 ? "Specials" : `Season ${number}`), box = el("input");
          box.type = "checkbox";
          box.onchange = () => {
            const i = seasons.indexOf(number);
            if (box.checked && i < 0) seasons.push(number);
            else if (!box.checked && i >= 0) seasons.splice(i, 1);
          };
          label.prepend(box);
          group.append(label);
        });
        dialog.append(group);
      }
      const status = el("p");
      status.setAttribute("role", "status");
      const confirm = button("Confirm request", async () => {
        if (item.type === "tv" && !seasons.length) {
          status.textContent = "Select at least one season.";
          return;
        }
        confirm.disabled = true;
        try {
          const result = await api("Request", {}, { type: item.type, id: item.id, seasons });
          if (current !== generation || !overlay.isConnected) return;
          status.textContent = result.message;
        } catch (e) {
          if (overlay.isConnected) {
            status.textContent = (e == null ? void 0 : e.status) === 403 ? "Request denied. Check permissions or quota." : (e == null ? void 0 : e.status) === 409 ? "Already requested." : (e == null ? void 0 : e.status) === 429 ? "Please wait before submitting another request." : "Request failed. Check Jellyseerr availability and try again.";
            confirm.disabled = false;
          }
        }
      });
      confirm.disabled = !data.canRequest || data.item.status === 5;
      dialog.append(confirm, status);
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
      const n = button("", () => details(item));
      n.className = "rh-card";
      n.append(poster(item), el("strong", item.title));
      return n;
    }
    async function rail(host, title, kind, filter = null, query = null) {
      const token = generation, row = el("section", "", "rh-row"), head = el("div", "", "rh-row-head"), track = el("div", "", "rh-track"), status = el("p");
      status.setAttribute("role", "status");
      let page = 0, pages = 1, busy = false;
      const load = async () => {
        if (busy || page >= pages || track.children.length >= 200) return;
        busy = true;
        status.textContent = "Loading\u2026";
        try {
          const data = await api("Browse", { kind, page: page + 1, ...filter ? { filter } : {}, ...query ? { query } : {} });
          if (token !== generation || !row.isConnected) return;
          page++;
          pages = data.pages || 1;
          data.results.filter((i) => ["movie", "tv"].includes(i.type)).forEach((i) => track.append(card(i)));
          status.textContent = track.children.length ? "" : "No titles found.";
        } catch {
          if (row.isConnected) status.textContent = "Could not load titles. Check Request Hub configuration and your account mapping.";
        } finally {
          busy = false;
        }
      };
      head.append(el("h2", title), button("\u2039", () => track.scrollBy({ left: -track.clientWidth * 0.8, behavior: "smooth" })), button("\u203A", async () => {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 20 && page < pages) await load();
        track.scrollBy({ left: track.clientWidth * 0.8, behavior: "smooth" });
      }));
      track.addEventListener("scroll", () => {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 300 && track.children.length < 200) load();
      }, { passive: true });
      row.append(head, track, status, button("Load more", load));
      host.append(row);
      await load();
    }
    async function render() {
      const token = generation, main = el("div"), search = el("form", "", "rh-search"), input = el("input");
      input.type = "search";
      input.placeholder = "Search movies and TV";
      input.setAttribute("aria-label", "Search movies and TV");
      const submit = button("Search", () => {
      });
      submit.type = "submit";
      search.append(input, submit);
      search.onsubmit = (e) => {
        e.preventDefault();
        generation++;
        main.replaceChildren();
        if (input.value.trim()) rail(main, "Search results", "search", null, input.value.trim());
        else home(main);
      };
      root.append(el("h1", "Discover"), search, button("Browse all", () => {
        generation++;
        input.value = "";
        main.replaceChildren();
        home(main);
      }), main);
      await home(main);
      if (token !== generation) return;
      const q = new URLSearchParams(location.hash.split("?")[1] || ""), type = q.get("mediaType"), id = Number(q.get("mediaId"));
      if (["movie", "tv"].includes(type) && id > 0) details({ type, id });
    }
    async function home(main) {
      const token = generation;
      await rail(main, "Trending", "trending");
      if (token !== generation) return;
      await rail(main, "Popular Movies", "movies");
      if (token !== generation) return;
      const genres = el("section");
      genres.append(el("h2", "Movie Genres"));
      main.append(genres);
      try {
        const data = await api("Browse", { kind: "genres" });
        if (token !== generation) return;
        data.results.forEach((g) => genres.append(button(g.name, () => {
          generation++;
          main.replaceChildren();
          rail(main, g.name, "genre", g.id);
        })));
      } catch {
        genres.append(el("p", "Genres are unavailable."));
      }
      const studios = el("section");
      studios.append(el("h2", "Studios"));
      [[2, "Disney"], [3, "Pixar"], [420, "Marvel Studios"], [174, "Warner Bros."], [21, "MGM"], [521, "DreamWorks"]].forEach(([id, name]) => studios.append(button(name, () => {
        generation++;
        main.replaceChildren();
        rail(main, name, "studio", id);
      })));
      main.append(studios);
      await rail(main, "Popular Series", "tv");
    }
    function reconcile() {
      const own = scope();
      if (session && own !== session) cleanup();
      session = own;
      document.querySelectorAll("[data-rh-link]").forEach((n) => {
        if (!own) n.remove();
      });
      if (!own) {
        cleanup();
        return;
      }
      const nav = document.querySelector("[data-sleekfin-header-proxy]") || document.querySelector(".headerTabs") || document.querySelector(".userPreferencesPage");
      if (nav && !nav.querySelector("[data-rh-link]")) {
        const link = el("a", "Discover", "rh-nav");
        link.href = "#/home?requesthub=discover";
        link.dataset.rhLink = "true";
        nav.append(link);
      }
      const active = /[?&]requesthub=discover(?:&|$)/i.test(location.hash) && /^#\/home/.test(location.hash);
      document.querySelectorAll("[data-rh-link]").forEach((n) => {
        if (active) n.setAttribute("aria-current", "page");
        else n.removeAttribute("aria-current");
      });
      if (!active) {
        if (root) cleanup();
        return;
      }
      if (root == null ? void 0 : root.isConnected) return;
      const page = [...document.querySelectorAll("#indexPage,.homePage")].find((n) => !n.closest(".hide,.hidePage,[hidden]"));
      if (!page) return;
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
    css.textContent = `[data-rh-hidden=true]{display:none!important}.rh-root{padding:32px 4vw;color:inherit}.rh-root h2{border-left:3px solid #e50914;padding-left:12px;margin:24px 0 16px}.rh-root button{font:inherit;color:inherit;background:#242424;border:1px solid #555;border-radius:8px;min-height:44px;padding:10px;cursor:pointer}.rh-root button:focus-visible,.rh-nav:focus-visible{outline:3px solid white}.rh-nav{color:inherit;text-decoration:none;padding:12px;display:inline-block}.rh-nav[aria-current=page]{background:#383838;border-radius:18px;font-weight:700}.rh-search{display:flex;gap:10px}.rh-search input{flex:1;font:inherit;color:inherit;background:#222;border:1px solid #555;border-radius:24px;padding:14px;min-width:0}.rh-row-head{display:flex;align-items:center;gap:12px}.rh-row-head h2{margin-right:auto}.rh-track{display:flex;gap:14px;overflow:auto;scrollbar-width:none}.rh-track::-webkit-scrollbar{display:none}.rh-card{flex:0 0 170px;text-align:left;max-width:170px;border:0!important;padding:0!important;background:transparent!important}.rh-poster{position:relative;aspect-ratio:2/3;background:#222;border-radius:9px;overflow:hidden}.rh-poster img{height:100%;width:100%;object-fit:contain}.rh-type,.rh-status{position:absolute;left:8px;background:#174cb0;border-radius:10px;padding:3px 8px;font-size:12px}.rh-type{top:8px}.rh-status{bottom:8px;background:#16552a}.rh-card strong{display:block;margin:8px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rh-row{margin-bottom:24px}.rh-overlay{position:fixed;top:0;left:0;right:0;bottom:0;inset:0;background:#000b;z-index:100002;display:grid;place-items:center;padding:16px}.rh-dialog{background:#171717;color:#fff;max-width:650px;width:90vw;max-height:85vh;overflow:auto;padding:24px;border-radius:12px;box-sizing:border-box}.rh-dialog .rh-poster{width:180px}.rh-dialog label{display:inline-flex;padding:10px;gap:8px}@supports not (aspect-ratio:2/3){.rh-poster{height:0;padding-bottom:150%}.rh-poster img{position:absolute;top:0;left:0}}@media(max-width:600px){.rh-card{flex-basis:38vw;max-width:38vw}}`;
    document.head.append(css);
    observer = new MutationObserver((records) => {
      if (records.some((r) => {
        var _a2, _b2;
        return !((_b2 = (_a2 = r.target).closest) == null ? void 0 : _b2.call(_a2, ".rh-root,[data-rh-link]"));
      })) {
        clearTimeout(timer);
        timer = setTimeout(reconcile, 120);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("hashchange", reconcile);
    const heartbeat = setInterval(reconcile, 2e3);
    window.JellyfinRequestHub = { stop() {
      cleanup();
      observer.disconnect();
      clearTimeout(timer);
      clearInterval(heartbeat);
      window.removeEventListener("hashchange", reconcile);
      document.querySelectorAll("[data-rh-link]").forEach((n) => n.remove());
      css.remove();
    } };
    reconcile();
  })();
})();
