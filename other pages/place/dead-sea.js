(function () {
    "use strict";

    const selectedPlace = new URLSearchParams(window.location.search).get("place") || "deadsea";

    const hero = document.querySelector(".hero");
    const details = document.querySelector(".details-section");
    if (!hero || !details || !window.JOUK) return;

    document.body.classList.add("destination-page");
    document.title = "Explore Jordan | JOUK";
    const asset = function (path) { return window.JOUK.asset(path); };
    const page = function (path) { return window.JOUK.url(path); };
    const drawings = {
        pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
        sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
        ticket: '<path d="m3 8 16-4 3 12-16 4-1-4a3 3 0 0 0-1.5-5.8L3 8Z"/><path d="m14 7 1 3m1 3 1 3M7 9l4-1"/>',
        water: '<path d="M12 2C10 6 5 10 5 15a7 7 0 0 0 14 0c0-5-5-9-7-13Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',
        car: '<path d="m5 8 1.7-4.3A1.2 1.2 0 0 1 7.8 3h8.4a1.2 1.2 0 0 1 1.1.7L19 8M4 8h16a1 1 0 0 1 1 1v9H3V9a1 1 0 0 1 1-1Z"/><path d="M3 15h18M5 18v3m14-3v3M1 8h2m18 0h2M9 12h6"/><path d="M6 11h1v1H6zm11 0h1v1h-1z"/>',
        book: '<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M5 17h15M9 7h7M9 11h5M3 6v13"/>',
        mountain: '<path d="m2 20 7-13 7 13H2Zm12 0 4-9 5 9h-9ZM7 11l2 3 2-3M17 4l1-2 2 3"/>',
        camera: '<path d="M4 6h4l2-3h4l2 3h4v15H4V6Z"/><circle cx="12" cy="13" r="4"/>',
        bag: '<rect x="5" y="7" width="14" height="15" rx="3"/><path d="M9 7V5a3 3 0 0 1 6 0v2M8 13h8v5H8Z"/>',
        heart: '<path d="M20.5 4.5a5.3 5.3 0 0 0-7.5 0L12 5.6l-1.1-1.1a5.3 5.3 0 0 0-7.5 7.5L12 21l8.5-9a5.3 5.3 0 0 0 0-7.5Z"/>',
        bookmark: '<path d="M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>',
        arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
        towel: '<path d="M5 3h14v18H5V3Zm0 4h14M5 17h14M8 21v2m4-2v2m4-2v2"/>'
    };
    function icon(name) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + drawings[name] + '</svg>';
    }
    function fact(name, label, value) {
        return '<div class="ds-fact">' + icon(name) + '<div><span>' + label + '</span><small>' + value + '</small></div></div>';
    }

    hero.classList.add("ds-hero");
    hero.innerHTML = '<img id="place-image" alt="">' +
        '<div class="ds-hero-copy"><h1 id="place-name"></h1><p id="place-location" hidden></p>' +
        '<p class="ds-tagline">Float · Relax · Unwind</p>' +
        '</div>' +
        '<button class="ds-favorite" id="place-save" data-save-place="' + selectedPlace.replace(/[^a-zA-Z0-9_-]/g, '') + '" type="button" aria-pressed="false" aria-label="Save this place">' + icon("bookmark") + '</button>' +
        '<div class="ds-hero-bottom"><div class="ds-facts" aria-label="Visit information">' +
        fact("sun", "Best time to visit", "Mar–May · Sep–Nov") +
        fact("ticket", "Access", "Public Beach · Day Pass · Resort") +
        fact("water", "Water", "~10× saltier than seawater") +
        fact("car", "From Amman", "≈1 hour (55 km)") +
        '</div><button class="path-btn" id="add-to-path-btn" type="button">Add to My Path +</button></div>' +
        '<span class="ds-status" id="place-save-status" role="status" aria-live="polite"></span>';
    const oldCard = document.querySelector(".place-card");
    if (oldCard) oldCard.remove();

    details.classList.add("ds-details");
    const sidebar = details.querySelector(".details-tabs");
    sidebar.classList.add("ds-sidebar");
    sidebar.setAttribute("role", "tablist");
    sidebar.setAttribute("aria-label", "Explore the Dead Sea");
    sidebar.setAttribute("aria-orientation", "vertical");
    const sections = [
        ["overview", "book", "Overview"],
        ["things", "mountain", "Things to Do"],
        ["experiences", "camera", "Traveler Experiences"],
        ["bring", "bag", "What to Bring"],
        ["nearby-places", "pin", "Nearby"]
    ];
    sidebar.innerHTML = sections.map(function (item, index) {
        return '<button type="button" class="details-tab' + (index === 0 ? ' active' : '') + '" data-target="' + item[0] + '" role="tab" id="ds-tab-' + item[0] + '" aria-controls="' + item[0] + '" aria-selected="' + (index === 0) + '">' + icon(item[1]) + '<span>' + item[2] + '</span></button>';
    }).join("");
    sidebar.insertAdjacentHTML("beforeend", '<svg class="ds-botanical" viewBox="0 0 170 180" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.1"><path d="M27 180C34 121 55 67 113 16M37 150C53 111 90 107 148 110M29 170C43 145 79 141 116 150M49 113C43 88 36 66 22 43M67 75C67 48 78 30 94 9"/><path d="M49 113C20 104 10 84 7 65C32 71 45 89 49 113ZM67 75C43 62 39 44 45 27C64 38 72 53 67 75ZM78 58C90 31 112 20 139 20C125 45 104 57 78 58ZM37 150C65 131 90 132 117 142C89 159 63 161 37 150ZM53 123C82 98 112 91 148 110C120 127 88 131 53 123ZM29 170C12 145 11 124 20 105C36 126 42 147 29 170Z"/></g></svg>');
    const oldHighlights = details.querySelector(".highlights");
    if (oldHighlights) oldHighlights.remove();

    const activities = [
        { key: "float", number: "01", title: "Float in<br>the Dead Sea", plain: "Float in the Dead Sea", image: "/images/relaxx.png", description: "Take your time in the calm, salt-rich water and enjoy the shoreline views." },
        { key: "mud", number: "02", title: "Try the<br>Natural Mud", plain: "Try the natural mud", image: "/images/deadsea3.jpeg", description: "Discover the Dead Sea’s natural mineral mud as part of a relaxed beach visit." },
        { key: "sunset", number: "03", title: "Stay for<br>Sunset", plain: "Stay for sunset", image: "/images/relaxx.png", description: "Find a quiet spot by the water and watch the evening light settle over the mountains." }
    ];
    function highlight(item) {
        return '<button type="button" class="ds-highlight" data-ds-tab="things" data-ds-activity="' + item.key + '"><img src="' + asset(item.image) + '" alt="' + item.plain + '" loading="lazy"><span class="ds-highlight-copy"><span class="ds-number">' + item.number + '</span><h3>' + item.title + '</h3><span class="ds-highlight-arrow">' + icon("arrow") + '</span></span></button>';
    }
    const overview = document.getElementById("overview");
    document.getElementById("about-title").textContent = "About";
    document.getElementById("about-text").textContent = "Discover Jordan’s remarkable salt lake: quiet water, a mineral-rich shoreline, and wide mountain views. Slow down, float, and make time for the sunset.";
    const about = overview.querySelector(".about-text");
    about.insertAdjacentHTML("beforeend", '<button type="button" class="ds-about-toggle" aria-expanded="false" aria-controls="deadsea-about-more">Learn more <span aria-hidden="true">→</span></button><p class="ds-about-more" id="deadsea-about-more" hidden>Make it a relaxed half-day by choosing a public beach or a resort day pass. Bring your essentials, explore the shore, and leave room in your plan for nearby Ma’in Hot Springs or Wadi Mujib.</p>');
    overview.insertAdjacentHTML("beforeend", '<section class="ds-highlights" aria-labelledby="ds-highlights-title"><div class="ds-section-heading"><h2 id="ds-highlights-title">Highlights</h2><button type="button" class="ds-text-link" data-ds-tab="things">See all <span aria-hidden="true">→</span></button></div><div class="ds-highlight-grid">' + activities.map(highlight).join("") + '</div></section>');

    const things = document.getElementById("things");
    things.classList.add("ds-panel");
    things.innerHTML = '<h2>Things to Do</h2><p class="ds-panel-intro">A slower pace, a little discovery, and a sunset worth staying for.</p><div class="ds-things-grid">' + activities.map(function (item) {
        return '<article id="ds-activity-' + item.key + '"><img src="' + asset(item.image) + '" alt="' + item.plain + '" loading="lazy"><div><span class="ds-number">' + item.number + '</span><h3>' + item.plain + '</h3><p>' + item.description + '</p></div></article>';
    }).join("") + '</div><button class="ds-text-link" type="button" data-ds-tab="photos">Explore the photo gallery <span aria-hidden="true">→</span></button>';

    const essentials = [
        ["water", "Drinking water", "Keep a bottle of fresh water with you."],
        ["sun", "Sun protection", "Pack sunscreen, a hat, and sunglasses."],
        ["towel", "Swimwear & towel", "Bring what you need for a comfortable beach day."],
        ["bag", "Beach essentials", "Water-friendly footwear and a change of clothes."]
    ];
    details.insertAdjacentHTML("beforeend", '<section class="tab-content ds-panel" id="bring"><h2>What to Bring</h2><p class="ds-panel-intro">A few essentials for your day by the water.</p><div class="ds-bring-grid">' + essentials.map(function (item) {
        return '<article>' + icon(item[0]) + '<h3>' + item[1] + '</h3><p>' + item[2] + '</p></article>';
    }).join("") + '</div></section><section class="tab-content ds-panel" id="nearby-places"><h2>Explore Nearby</h2><p class="ds-panel-intro">Add another piece to your journey along the Dead Sea.</p><div class="ds-nearby-grid"><a href="' + page("other pages/place/index.html?place=main") + '">' + icon("water") + '<h3>Ma’in Hot Springs</h3><p>A warm-water escape among rocky hills.</p><span>Discover more →</span></a><a href="' + page("other pages/place/index.html?place=wadiMujib") + '">' + icon("mountain") + '<h3>Wadi Mujib</h3><p>A canyon adventure near the Dead Sea.</p><span>Discover more →</span></a></div></section>');

    details.querySelectorAll(".tab-content").forEach(function (panel) {
        panel.setAttribute("role", "tabpanel");
        if (document.getElementById("ds-tab-" + panel.id)) panel.setAttribute("aria-labelledby", "ds-tab-" + panel.id);
    });
    document.getElementById("photos").setAttribute("aria-label", "Dead Sea photo gallery");
    function selectPanel(id) {
        const destination = document.getElementById(id);
        if (!destination || !destination.classList.contains("tab-content")) return;
        sidebar.querySelectorAll(".details-tab").forEach(function (button) {
            const selected = button.dataset.target === id;
            button.classList.toggle("active", selected);
            button.setAttribute("aria-selected", String(selected));
        });
        details.querySelectorAll(".tab-content").forEach(function (panel) { panel.classList.toggle("active", panel === destination); });
    }
    details.addEventListener("click", function (event) {
        const control = event.target.closest("[data-ds-tab], .details-tab");
        if (!control || !details.contains(control)) return;
        const id = control.dataset.dsTab || control.dataset.target;
        selectPanel(id);
        if (control.dataset.dsTab) {
            const target = control.dataset.dsActivity ? document.getElementById("ds-activity-" + control.dataset.dsActivity) : details;
            target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
        }
    });
    sidebar.addEventListener("keydown", function (event) {
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        const buttons = Array.from(sidebar.querySelectorAll(".details-tab"));
        let next = buttons.indexOf(document.activeElement);
        if (next < 0) return;
        event.preventDefault();
        next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (next + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
        buttons[next].focus();
        buttons[next].click();
    });
    const learnMore = document.querySelector(".ds-about-toggle");
    learnMore.addEventListener("click", function () {
        const expanded = learnMore.getAttribute("aria-expanded") !== "true";
        learnMore.setAttribute("aria-expanded", String(expanded));
        document.getElementById("deadsea-about-more").hidden = !expanded;
        learnMore.innerHTML = (expanded ? "Show less" : "Learn more") + ' <span aria-hidden="true">→</span>';
    });

    const taglines = {
        deadsea: "Float · Relax · Unwind", petra: "Wander · Discover · Remember",
        wadiRum: "Explore · Camp · Dream", ajlounCastle: "Explore · Discover · Look beyond",
        ajlounRelax: "Breathe · Wander · Unwind", aqabaAdventures: "Dive · Explore · Discover",
        aqaba: "Swim · Relax · Unwind", wadiMujib: "Hike · Splash · Explore",
        main: "Soak · Relax · Unwind", jerash: "Walk · Discover · Remember",
        ummQais: "Wander · Discover · Reflect", danaReserve: "Hike · Explore · Breathe",
        karakCastle: "Explore · Discover · Remember", dibeenForest: "Wander · Breathe · Unwind",
        romanTheater: "Explore · Discover · Connect", shobak: "Hike · Discover · Explore",
        afra: "Soak · Breathe · Unwind"
    };
    const neighbors = {
        deadsea: ["main", "wadiMujib"], petra: ["shobak", "wadiRum"],
        wadiRum: ["aqabaAdventures", "petra"], ajlounCastle: ["ajlounRelax", "jerash"],
        ajlounRelax: ["ajlounCastle", "dibeenForest"], aqabaAdventures: ["aqaba", "wadiRum"],
        aqaba: ["aqabaAdventures", "wadiRum"], wadiMujib: ["deadsea", "main"],
        main: ["deadsea", "wadiMujib"], jerash: ["ajlounCastle", "dibeenForest"],
        ummQais: ["ajlounCastle", "jerash"], danaReserve: ["afra", "shobak"],
        karakCastle: ["deadsea", "danaReserve"], dibeenForest: ["jerash", "ajlounRelax"],
        romanTheater: ["jerash", "deadsea"], shobak: ["petra", "danaReserve"],
        afra: ["danaReserve", "shobak"]
    };
    function escapeText(value) {
        return String(value || "").replace(/[&<>"']/g, function (character) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
        });
    }
    window.JOUK.renderDestination = function (place, allPlaces, id) {
        id = id || selectedPlace;
        const info = place.info || {};
        const quick = place.quickInfo || {};
        const safeName = escapeText(place.name);
        const heroImage = window.JOUK.destinationImages?.[id] || (id === "deadsea" ? "/images/relaxx.png" : place.image);
        window.JOUK.destinationHero = heroImage;
        document.title = place.name + " | JOUK";
        hero.classList.toggle("ds-long-name", place.name.length > 19);
        document.querySelector(".ds-tagline").textContent = taglines[id] || "Explore · Discover · Enjoy";
        const saveButton = document.getElementById("place-save");
        saveButton.dataset.savePlace = id;
        saveButton.dataset.placeName = place.name;
        saveButton.setAttribute("aria-label", "Save " + place.name);
        sidebar.setAttribute("aria-label", "Explore " + place.name);
        document.getElementById("photos").setAttribute("aria-label", place.name + " photo gallery");
        document.querySelector(".ds-facts").innerHTML = (id === "deadsea" ? [
            fact("sun", "Best time to visit", "Mar–May · Sep–Nov"),
            fact("ticket", "Access", "Public Beach · Day Pass · Resort"),
            fact("water", "Water", "~10× saltier than seawater"),
            fact("car", "From Amman", "≈1 hour (55 km)")
        ] : [
            fact("sun", "Best time to visit", escapeText(info.bestTime || "Year-round")),
            fact("ticket", "Visit duration", escapeText(info.visitTime || "Plan your visit")),
            fact("mountain", "Best for", escapeText(info.bestFor || quick.bestFor || "Exploring")),
            fact("car", "From Amman", escapeText((quick.distance || "Plan your route").replace(/\s+from Amman/i, "")))
        ]).join("");
        const sources = (place.highlights || []).slice(0, 3);
        const photos = [place.image].concat(place.photos || []).filter(Boolean);
        while (sources.length < 3) {
            const index = sources.length;
            sources.push({ title: place.thingsToDo?.[index] || "Explore " + place.name, image: photos[index % photos.length] });
        }
        const featured = sources.map(function (item, index) {
            return { key: String(index), number: String(index + 1).padStart(2, "0"),
                title: escapeText(item.title), plain: escapeText(item.title), image: item.image || photos[index % photos.length] };
        });
        if (id === "deadsea") {
            featured[0] = { key: "0", number: "01", title: "Float in<br>the Dead Sea", plain: "Float in the Dead Sea", image: "/images/relaxx.png" };
            featured[1].title = "Try the<br>Natural Mud";
            featured[2] = { key: "2", number: "03", title: "Stay for<br>Sunset", plain: "Stay for Sunset", image: "/images/deadsea2.jpeg" };
        }
        document.querySelector(".ds-highlight-grid").innerHTML = featured.map(highlight).join("");
        const activityNames = id === "deadsea" ? ["Floating experience", "Try natural mud", "Enjoy sunset views"] : (place.thingsToDo || sources.map(function (item) { return item.title; }));
        document.querySelector(".ds-things-grid").innerHTML = activityNames.map(function (title, index) {
            const item = featured[index % featured.length];
            return '<article id="ds-activity-' + index + '"><img src="' + escapeText(asset(item.image)) + '" alt="' + escapeText(title) + '" loading="lazy"><div><span class="ds-number">' + String(index + 1).padStart(2, "0") + '</span><h3>' + escapeText(title) + '</h3><p>' + safeName + ' · ' + escapeText(info.bestFor || quick.bestFor) + '</p></div></article>';
        }).join("");
        things.querySelector(".ds-panel-intro").textContent = "Make time for these experiences in " + place.name + ".";
        document.getElementById("deadsea-about-more").textContent = "Allow " + (info.visitTime || "time") + " for your visit. Access: " + (quick.access || "plan ahead") + ". Nearby: " + (info.nearby || "explore the surrounding area") + ".";
        const isWater = ["deadsea", "aqaba", "aqabaAdventures", "wadiMujib", "main", "afra"].includes(id);
        const packing = [
            ["water", "Drinking water", "Keep fresh drinking water with you."],
            ["sun", "Sun protection", "Bring a hat, sunscreen, and sunglasses."],
            isWater ? ["towel", "Swimwear & towel", "Pack swimwear, a towel, and a change of clothes."] : ["mountain", "Comfortable footwear", "Bring comfortable shoes for the paths and outdoor areas."],
            ["bag", "Day essentials", "Carry your phone, personal essentials, and a small day bag."]
        ];
        document.querySelector("#bring .ds-panel-intro").textContent = "A few essentials for your visit to " + place.name + ".";
        document.querySelector(".ds-bring-grid").innerHTML = packing.map(function (item) {
            return '<article>' + icon(item[0]) + '<h3>' + item[1] + '</h3><p>' + item[2] + '</p></article>';
        }).join("");
        document.querySelector("#nearby-places .ds-panel-intro").textContent = "Nearby: " + (info.nearby || "discover another part of Jordan") + ".";
        document.querySelector(".ds-nearby-grid").innerHTML = (neighbors[id] || []).filter(function (key) { return allPlaces[key]; }).map(function (key) {
            const nearby = allPlaces[key];
            return '<a href="' + escapeText(page("other pages/place/index.html?place=" + encodeURIComponent(key))) + '"><img class="ds-nearby-image" src="' + escapeText(asset(nearby.image)) + '" alt="' + escapeText(nearby.name) + '" loading="lazy"><h3>' + escapeText(nearby.name) + '</h3><p>' + escapeText(nearby.info?.bestFor || nearby.quickInfo?.bestFor) + '</p><span>Discover more →</span></a>';
        }).join("");
        document.dispatchEvent(new CustomEvent("jouk:place-ready"));
    };
})();
