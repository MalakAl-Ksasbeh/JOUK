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
        snorkel: '<path d="M3 9h16v5a4 4 0 0 1-4 4h-2l-2-3-2 3H7a4 4 0 0 1-4-4V9Zm8 0v6M19 12h2V3h2M3 11H1"/>',
        firstAid: '<rect x="3" y="6" width="18" height="15" rx="2"/><path d="M8 6V3h8v3M12 10v7m-3.5-3.5h7"/>',
        powerBank: '<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4V2h6v2M13 8l-4 6h4l-2 5 5-7h-4l1-4Z"/>',
        shoe: '<path d="M3 8h5l2 5 6 2 4 1a2 2 0 0 1 1 2v2H3V8Zm0 9h18M11 12l-2 2m5-1-2 2"/>',
        sunscreen: '<path d="M7 3h10l-1 15H8L7 3Zm1 15h8v4H8ZM7 6h10"/><circle cx="12" cy="12" r="1.8"/><path d="M12 8.5v1m0 5v1M8.5 12h1m5 0h1M9.5 9.5l.7.7m3.6 3.6.7.7m-5 0 .7-.7m3.6-3.6.7-.7"/>',
        moisturizer: '<path d="M7 2h10l-1 16H8L7 2Zm1 16h8v4H8ZM7 5h10"/><path d="M12 8c-1 2-2.5 3-2.5 4.5a2.5 2.5 0 0 0 5 0C14.5 11 13 10 12 8Z"/>',
        phonePouch: '<path d="M9 9C3-1 21-1 15 9"/><rect x="6" y="9" width="12" height="14" rx="2"/><path d="M6 12h12"/><rect x="9" y="14" width="6" height="7" rx="1"/><path d="M11 19h2"/>',
        bottle: '<rect x="9" y="2" width="6" height="3" rx="1"/><path d="M10 5v3l-3 3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9l-3-3V5M7 13h10M7 18h10"/>',
        clothes: '<path d="m8 3-6 4 3 5 3-2v12h8V10l3 2 3-5-6-4a4 4 0 0 1-8 0Z"/>',
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
        return '<button type="button" class="ds-highlight" data-zoom-src="' + asset(item.image) + '" data-zoom-caption="' + item.plain + '" aria-label="Enlarge image: ' + item.plain + '"><img src="' + asset(item.image) + '" alt="' + item.plain + '" loading="lazy"><span class="ds-highlight-copy"><span class="ds-number">' + item.number + '</span><h3>' + item.title + '</h3><span class="ds-highlight-arrow">' + icon("arrow") + '</span></span></button>';
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
        deadsea: ["main", "wadiMujib", "mukawir"], petra: ["shobak", "wadiRum"],
        wadiRum: ["aqabaAdventures", "petra"], ajlounCastle: ["ajlounRelax", "jerash"],
        ajlounRelax: ["ajlounCastle", "dibeenForest"], aqabaAdventures: ["aqaba", "wadiRum"],
        aqaba: ["aqabaFort", "aqabaAdventures", "wadiRum"], aqabaFort: ["aqaba"], wadiMujib: ["deadsea", "main"],
        main: ["deadsea", "wadiZarqaMain", "mukawir"], madabaPark: ["main"], mukawir: ["main", "deadsea"], wadiZarqaMain: ["main", "mukawir"], jerash: ["ajlounCastle", "dibeenForest"],
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
        hero.dataset.place = id;
        const info = place.info || {};
        const quick = place.quickInfo || {};
        const safeName = escapeText(place.name);
        const heroImage = place.heroImage || window.JOUK.destinationImages?.[id] || (id === "deadsea" ? "/images/relaxx.png" : place.image);
        window.JOUK.destinationHero = heroImage;
        document.getElementById("place-image").style.objectPosition = id === "wadiZarqaMain" ? "center bottom" : "center";
        document.title = place.name + " | JOUK";
        hero.classList.toggle("ds-long-name", place.name.length > 19);
        document.querySelector(".ds-tagline").textContent = place.tagline || taglines[id] || "Explore · Discover · Enjoy";
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
        if (place.facts) document.querySelector(".ds-facts").innerHTML = place.facts.map(function (item) {
            return fact(item.icon, escapeText(item.label), escapeText(item.value));
        }).join("");
        const sources = (place.highlights || []).slice();
        const photos = [place.image].concat(place.photos || []).filter(Boolean);
        while (!place.detailsPending && sources.length < 3) {
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
            featured[2] = { key: "2", number: "03", title: "Discover the<br>Colored Pools", plain: "Discover the Colored Pools", image: "/images/deadsea-highlight-03-pools.jpg" };
        }
        document.querySelector(".ds-highlight-grid").innerHTML = featured.map(highlight).join("");
        document.querySelector(".ds-highlights").hidden = !!place.detailsPending;
        document.querySelector(".ds-about-toggle").hidden = !!place.detailsPending;
        const activityNames = id === "deadsea" ? ["Floating experience", "Try natural mud", "Discover the colored pools"] : (place.thingsToDo || sources.map(function (item) { return item.title; }));
        document.querySelector(".ds-things-grid").innerHTML = activityNames.map(function (title, index) {
            const item = featured[index % featured.length];
            return '<article id="ds-activity-' + index + '"><img src="' + escapeText(asset(item.image)) + '" alt="' + escapeText(title) + '" loading="lazy"><div><span class="ds-number">' + String(index + 1).padStart(2, "0") + '</span><h3>' + escapeText(title) + '</h3><p>' + escapeText(sources[index]?.description || (place.name + ' · ' + (info.bestFor || quick.bestFor))) + '</p></div></article>';
        }).join("");
        things.querySelector(".ds-panel-intro").textContent = "Make time for these experiences in " + place.name + ".";
        document.getElementById("deadsea-about-more").textContent = [place.visitNote, "Allow " + (info.visitTime || "time") + " for your visit."].filter(Boolean).join(" ");
        const isWater = ["deadsea", "aqaba", "aqabaAdventures", "wadiMujib", "main", "afra"].includes(id);
        const packing = [
            ...(id === "deadsea" ? [
                ["shoe", "Waterproof footwear", "Protect your feet from sharp salt crystals and rocky areas."],
                ["moisturizer", "Moisturizer", "Keep your skin hydrated after swimming."],
                ["phonePouch", "Waterproof phone pouch", "Keep your phone protected around salty water."],
                ["clothes", "Extra clothes", "Bring a change of clothes, as salt residue can be difficult to wash out."]
            ] : []),
            ["bottle", "Drinking water", "Keep fresh drinking water with you."],
            ["sunscreen", "Sun protection", "Bring a hat, sunscreen, and sunglasses."],
            isWater ? ["towel", "Swimwear & towel", "Pack swimwear, a towel, and a change of clothes."] : ["mountain", "Comfortable footwear", "Bring comfortable shoes for the paths and outdoor areas."],
            ["bag", "Day essentials", "Carry your phone, personal essentials, and a small day bag."]
        ];
        document.querySelector("#bring .ds-panel-intro").textContent = "A few essentials for your visit to " + place.name + ".";
        document.querySelector("#bring h2").textContent = place.packingTitle || "What to Bring";
        document.querySelector(".ds-bring-grid").innerHTML = (place.packing || packing).map(function (item) {
            return '<article>' + icon(item[0]) + '<h3>' + item[1] + '</h3><p>' + item[2] + '</p></article>';
        }).join("");
        const oldTip = document.querySelector(".ds-safety-tip");
        if (oldTip) oldTip.remove();
        if (place.safetyTip) document.querySelector(".ds-bring-grid").insertAdjacentHTML("afterend", '<p class="ds-safety-tip"><strong>Safety Tip:</strong> ' + escapeText(place.safetyTip) + '</p>');
        else if (place.visitTip) document.querySelector(".ds-bring-grid").insertAdjacentHTML("afterend", '<p class="ds-safety-tip"><strong>Tip:</strong> ' + escapeText(place.visitTip) + '</p>');
        if (place.detailsPending) {
            things.querySelector(".ds-panel-intro").textContent = "Activities will be added soon.";
            document.querySelector("#bring .ds-panel-intro").textContent = "Visit essentials will be added soon.";
        }
        document.querySelector("#nearby-places .ds-panel-intro").textContent = "Explore around " + place.name + ". Distances are approximate and depend on your starting point and route.";
        const distances = {"deadsea:main":"About 28 km from the Dead Sea hotel area", "deadsea:mukawir":"About 60 km from the Dead Sea hotel area", "main:deadsea":"About 28 km", "main:mukawir":"About 33 km", "mukawir:main":"About 33 km", "mukawir:deadsea":"About 60 km to the Dead Sea hotel area", "madabaPark:main":"About 30 km"};
        function distanceMarkup(name, key, known) {
            const route = "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(place.name + ", Jordan") + "&destination=" + encodeURIComponent(name + ", Jordan") + "&travelmode=driving";
            return '<p class="ds-nearby-distance">' + escapeText(known || distances[id + ":" + key] || "Distance varies by route") + '</p><a class="ds-route-link" href="' + escapeText(route) + '" target="_blank" rel="noopener">View route & driving distance ↗</a>';
        }
        document.querySelector(".ds-nearby-grid").innerHTML = (neighbors[id] || []).filter(function (key) { return allPlaces[key]; }).map(function (key) {
            const nearby = allPlaces[key];
            return '<article class="ds-nearby-static"><a class="ds-nearby-place-link" href="' + escapeText(page("other pages/place/index.html?place=" + encodeURIComponent(key))) + '"><img class="ds-nearby-image" src="' + escapeText(asset(nearby.image)) + '" alt="' + escapeText(nearby.name) + '" loading="lazy"><h3>' + escapeText(nearby.name) + '</h3></a><p>' + escapeText(nearby.location) + '</p><p>' + escapeText((nearby.about || nearby.info?.bestFor || "").split(/(?<=\.)\s/)[0]) + '</p>' + distanceMarkup(nearby.name, key) + '</article>';
        }).join("");
        function staticNearby(name, image, description, distance) {
            return '<article class="ds-nearby-static"><button type="button" class="ds-nearby-zoom" data-zoom-src="' + escapeText(asset(image)) + '" data-zoom-caption="' + escapeText(name) + '" aria-label="Enlarge ' + escapeText(name) + ' photo"><img class="ds-nearby-image" src="' + escapeText(asset(image)) + '" alt="' + escapeText(name) + '" loading="lazy"></button><h3>' + escapeText(name) + '</h3><p>' + escapeText(description) + '</p>' + distanceMarkup(name, "", distance) + '</article>';
        }
        if (id === "deadsea") {
            document.querySelector(".ds-nearby-grid").insertAdjacentHTML("beforeend",
                staticNearby("Prophet Lot’s Cave", "/images/lots-cave-nearby-v1.jpg", "Near Ghor Al Safi, southeast of the Dead Sea. A cave traditionally associated with Prophet Lot, beside the remains of a Byzantine church and monastery.") +
                staticNearby("Al-Maghtas (Baptism Site)", "/images/baptism-site-nearby.jpg", "On the east bank of the Jordan River, north of the Dead Sea. A historic pilgrimage site associated with the baptism of Jesus.", "About 20 km from the Dead Sea hotel area"));
        }
        if (["deadsea", "madabaPark", "wadiZarqaMain"].includes(id)) {
            document.querySelector(".ds-nearby-grid").insertAdjacentHTML("beforeend", staticNearby("Mount Nebo", "/images/mount-nebo-nearby.avif", "Near Madaba. Visit the Moses memorial and Byzantine mosaics, with sweeping views across the Jordan Valley.", id === "madabaPark" ? "About 8 km from central Madaba" : id === "deadsea" ? "About 30 km from the northern Dead Sea shore" : null));
        }
        document.dispatchEvent(new CustomEvent("jouk:place-ready"));
    };
    const viewer = document.createElement("dialog");
    viewer.className = "ds-image-viewer";
    viewer.setAttribute("aria-label", "Enlarged destination photo");
    viewer.innerHTML = '<button type="button" aria-label="Close image">×</button><img alt=""><p></p>';
    document.body.appendChild(viewer);
    viewer.querySelector("button").addEventListener("click", function () { viewer.close(); });
    viewer.addEventListener("click", function (event) { if (event.target === viewer) viewer.close(); });
    document.addEventListener("click", function (event) {
        const trigger = event.target.closest("[data-zoom-src]");
        if (!trigger) return;
        event.preventDefault();
        viewer.querySelector("img").src = trigger.dataset.zoomSrc;
        viewer.querySelector("img").alt = trigger.dataset.zoomCaption || "Destination photo";
        viewer.querySelector("p").textContent = trigger.dataset.zoomCaption || "";
        viewer.showModal();
    });
})();
