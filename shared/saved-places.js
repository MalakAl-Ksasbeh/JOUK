(function () {
    "use strict";
    if (!window.JOUK || window.JOUK.savedPlaces) return;
    const bookmark = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1Z"/></svg>';
    let currentUser = null;
    let authPromise;
    let placesPromise;
    let noticeTimer;
    const savedUrl = function () { return window.JOUK.url("other pages/saved-places/index.html"); };
    const escape = function (text) {
        return String(text || "").replace(/[&<>"']/g, function (char) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
        });
    };
    function savedIds() {
        if (!currentUser) return [];
        try {
            const value = JSON.parse(localStorage.getItem("joukSavedPlaces:" + currentUser.uid) || "[]");
            return Array.isArray(value) ? value.filter(function (id) { return typeof id === "string"; }) : [];
        } catch (_) { return []; }
    }
    function login(returnTo) {
        const url = new URL(window.JOUK.url("sign up-log in/index.html"));
        url.searchParams.set("returnTo", returnTo || window.location.href);
        notify("Please log in to save places. Taking you to login…");
        window.setTimeout(function () { window.location.assign(url.href); }, 1800);
    }
    function authUser() {
        if (currentUser) return Promise.resolve(currentUser);
        if (!authPromise) {
            const resolvedState = Promise.all([
                import(window.JOUK.url("shared/firebase.js")),
                import("https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js")
            ]).then(function (modules) {
                return new Promise(function (resolve) {
                    modules[1].onAuthStateChanged(modules[0].auth, function (user) {
                        currentUser = user;
                        refreshButtons();
                        resolve(user);
                        if (document.querySelector("[data-saved-places]") && user) renderSaved();
                    }, function () { resolve(null); });
                });
            }).catch(function () { return null; });
            authPromise = Promise.race([resolvedState, new Promise(function (resolve) {
                window.setTimeout(function () { resolve(null); }, 8000);
            })]);
        }
        return authPromise.then(function () { return currentUser; });
    }
    function refreshButtons() {
        const ids = savedIds();
        document.querySelectorAll("[data-save-place]").forEach(function (button) {
            const saved = ids.includes(button.dataset.savePlace);
            const name = button.dataset.placeName || "this place";
            button.setAttribute("aria-pressed", String(saved));
            button.setAttribute("aria-label", saved ? "Remove " + name + " from saved places" : "Save " + name);
            button.title = saved ? "Remove from saved places" : "Save place";
            button.classList.toggle("is-saved", saved);
        });
        document.querySelectorAll(".site-saved").forEach(function (link) {
            link.classList.toggle("has-saved-places", ids.length > 0);
            link.setAttribute("aria-label", ids.length ? "Saved places (" + ids.length + ")" : "Saved places");
        });
    }
    function notify(message) {
        let notice = document.getElementById("jouk-save-notice");
        if (!notice) {
            notice = document.createElement("div");
            notice.id = "jouk-save-notice";
            notice.className = "jouk-save-notice";
            notice.setAttribute("role", "status");
            document.body.appendChild(notice);
        }
        notice.textContent = message;
        notice.classList.add("is-visible");
        clearTimeout(noticeTimer);
        noticeTimer = setTimeout(function () { notice.classList.remove("is-visible"); }, 2800);
    }
    async function togglePlace(button) {
        button.disabled = true;
        try {
            const user = await authUser();
            if (!user) { login(); return; }
            const id = button.dataset.savePlace;
            const ids = savedIds();
            const wasSaved = ids.includes(id);
            const next = wasSaved ? ids.filter(function (key) { return key !== id; }) : ids.concat(id);
            localStorage.setItem("joukSavedPlaces:" + user.uid, JSON.stringify(next));
            refreshButtons();
            notify(wasSaved ? "Place removed from your saved places." : "Place saved. Find it beside your profile.");
            if (document.querySelector("[data-saved-places]")) renderSaved();
        } catch (_) {
            notify("This browser could not save the place. Please try again.");
        } finally { button.disabled = false; }
    }
    async function renderSaved() {
        const container = document.querySelector("[data-saved-places]");
        if (!container || !currentUser) return;
        const count = document.getElementById("saved-places-count");
        if (!placesPromise) placesPromise = fetch(window.JOUK.url("data/places.json")).then(function (response) {
            if (!response.ok) throw new Error("Could not load places");
            return response.json();
        });
        try {
            const places = await placesPromise;
            const ids = savedIds().filter(function (id) { return places[id]; });
            if (count) count.textContent = ids.length + (ids.length === 1 ? " place saved" : " places saved");
            if (!ids.length) {
                container.innerHTML = '<div class="saved-empty">' + bookmark + '<h2>Your next journey starts here</h2><p>Save places you love using the bookmark on any destination.</p><a class="saved-explore" href="' + escape(window.JOUK.url("plans/index.html")) + '">Explore places <span aria-hidden="true">→</span></a></div>';
                return;
            }
            container.innerHTML = ids.map(function (id) {
                const place = places[id];
                const href = window.JOUK.url("other pages/place/index.html?place=" + encodeURIComponent(id));
                return '<article class="saved-place-card"><a href="' + escape(href) + '"><img src="' + escape(window.JOUK.asset(place.image)) + '" alt="' + escape(place.name) + '" loading="lazy"><div class="saved-place-copy"><p>' + escape(place.info?.bestFor || "Explore Jordan") + '</p><h2>' + escape(place.name) + '</h2><span>View place →</span></div></a><button type="button" class="saved-card-bookmark is-saved" data-save-place="' + escape(id) + '" data-place-name="' + escape(place.name) + '" aria-pressed="true" aria-label="Remove ' + escape(place.name) + ' from saved places">' + bookmark + '</button></article>';
            }).join("");
        } catch (_) {
            container.innerHTML = '<p class="saved-empty">The places could not be loaded. Please refresh the page.</p>';
        }
    }
    function init() {
        document.querySelectorAll(".site-header").forEach(function (header) {
            if (header.querySelector(".site-saved")) return;
            const link = document.createElement("a");
            link.className = "site-saved";
            link.href = savedUrl();
            link.setAttribute("aria-label", "Saved places");
            link.title = "Saved places";
            link.innerHTML = bookmark;
            header.appendChild(link);
        });
        document.addEventListener("click", async function (event) {
            const save = event.target.closest("[data-save-place]");
            if (save) { event.preventDefault(); togglePlace(save); return; }
            const link = event.target.closest(".site-saved");
            if (!link) return;
            event.preventDefault();
            if (await authUser()) window.location.assign(savedUrl());
            else login(savedUrl());
        });
        document.addEventListener("jouk:place-ready", refreshButtons);
        window.addEventListener("storage", function (event) {
            if (event.key?.startsWith("joukSavedPlaces:")) { refreshButtons(); renderSaved(); }
        });
        if (document.querySelector(".site-header, [data-save-place], [data-saved-places]")) {
            authUser().then(function (user) {
                if (!document.querySelector("[data-saved-places]")) return;
                if (!user) login(savedUrl());
                else renderSaved();
            });
        }
    }
    window.JOUK.savedPlaces = { refresh: refreshButtons };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
})();
