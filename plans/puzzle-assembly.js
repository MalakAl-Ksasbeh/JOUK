(function () {
    "use strict";

    function initPuzzleAssembly() {
        const modeButton = document.getElementById("puzzleModeBtn");
        const builder = document.getElementById("puzzleBuilder");
        const board = document.getElementById("puzzleAssemblyBoard");
        const resetButton = document.getElementById("puzzleResetBtn");
        const status = document.getElementById("puzzleStatus");
        const results = document.getElementById("puzzleResults");
        const resultsTitle = document.getElementById("puzzleResultsTitle");
        const resultsGrid = document.getElementById("puzzleResultsGrid");
        const connections = document.getElementById("puzzleConnections");
        const decoration = document.getElementById("puzzleDecoration");
        const layout = document.querySelector(".plans-layout");
        if (!modeButton || !builder || !board || !resetButton || !status ||
            !results || !resultsTitle || !resultsGrid) return;

        const categories = [
            { key: "relax", label: "Relax", path: "/plans/relax/index.html" },
            { key: "culture", label: "Culture", path: "/plans/culture/index.html" },
            { key: "adventure", label: "Adventure", path: "/plans/adventures/index.html" },
            { key: "activities", label: "Something to do", path: "/plans/something%20to%20do/index.html" }
        ];
        const selected = new Set();
        const categoryPages = new Map();
        const slots = new Map();
        const sources = new Map();
        let enabled = false;
        let draggedCategory = "";
        let renderVersion = 0;
        let placesPromise;
        let connectionFrame = 0;

        function projectUrl(path) {
            return window.JOUK && typeof window.JOUK.url === "function"
                ? window.JOUK.url(path)
                : new URL(path.replace(/^\/+/, ""), new URL("../", window.location.href)).href;
        }

        function assetUrl(path) {
            return window.JOUK && typeof window.JOUK.asset === "function"
                ? window.JOUK.asset(path)
                : projectUrl(path);
        }

        function textOf(element) {
            return element ? element.textContent.replace(/\s+/g, " ").trim() : "";
        }

        function safeUrl(value, base) {
            try {
                const url = new URL(value, base);
                return /^https?:$/.test(url.protocol) ? url : null;
            } catch (_) {
                return null;
            }
        }

        async function readResource(path, format) {
            const controller = new AbortController();
            const timeout = window.setTimeout(function () { controller.abort(); }, 10000);
            try {
                const response = await fetch(projectUrl(path), { signal: controller.signal });
                if (!response.ok) throw new Error("Content could not be loaded.");
                return await response[format]();
            } finally {
                window.clearTimeout(timeout);
            }
        }

        function getPlaces() {
            if (!placesPromise) {
                placesPromise = readResource("/data/places.json", "json")
                    .then(function (data) {
                        if (!data || typeof data !== "object" || Array.isArray(data)) {
                            throw new Error("Places data is unavailable.");
                        }
                        return data;
                    })
                    .catch(function (error) {
                        placesPromise = undefined;
                        throw error;
                    });
            }
            return placesPromise;
        }

        function getCategoryPage(category) {
            if (!categoryPages.has(category.key)) {
                const request = readResource(category.path, "text")
                    .then(function (html) {
                        return new DOMParser().parseFromString(html, "text/html");
                    })
                    .catch(function (error) {
                        categoryPages.delete(category.key);
                        throw error;
                    });
                categoryPages.set(category.key, request);
            }
            return categoryPages.get(category.key);
        }

        function categoryItems(category, page, places) {
            const pageUrl = projectUrl(category.path);
            const items = [];
            page.querySelectorAll(".cards > .card, .places > .place-card").forEach(function (card) {
                const link = card.querySelector("a[href*='place='], a.place-arrow[href]");
                const url = safeUrl(link ? link.getAttribute("href") : pageUrl, pageUrl);
                if (!url) return;
                const placeId = url.searchParams.get("place");
                const place = placeId && Object.prototype.hasOwnProperty.call(places, placeId)
                    ? places[placeId] : null;
                const details = place && typeof place === "object" ? place : {};
                const image = card.querySelector("img");
                const sourceImage = image && safeUrl(image.getAttribute("src"), pageUrl);
                const name = details.name || textOf(card.querySelector("h2, .place-title"));
                if (!name) return;
                items.push({
                    id: placeId || (link ? url.href : category.key + ":" + name),
                    name: String(name),
                    href: placeId
                        ? projectUrl("/other%20pages/place/index.html") + "?place=" + encodeURIComponent(placeId)
                        : url.href,
                    external: !placeId && url.origin !== window.location.origin,
                    image: typeof details.image === "string"
                        ? assetUrl(details.image) : sourceImage && sourceImage.href,
                    alt: image && image.getAttribute("alt") || String(name),
                    meta: details.location
                        ? [details.location, details.rating].filter(Boolean).join(" · ")
                        : textOf(card.querySelector(".card-info p, .place-intro")),
                    category: category.key,
                    label: category.label
                });
            });
            if (category.key === "activities" && page.querySelector("#events")) {
                const image = page.querySelector("#event-photo");
                const sourceImage = image && safeUrl(image.getAttribute("src"), pageUrl);
                items.push({
                    id: "activities-events",
                    name: "Events by month",
                    href: pageUrl + "#events",
                    external: false,
                    image: sourceImage && sourceImage.href,
                    alt: "Events and local experiences in Jordan",
                    meta: "Explore the full event calendar",
                    category: category.key,
                    label: category.label
                });
            }
            if (!items.length) throw new Error("No category content is available.");
            return items;
        }

        function makeResultCard(item) {
            const card = document.createElement("a");
            card.className = "puzzle-place-card";
            card.dataset.category = item.category;
            card.href = item.href;
            if (item.external) {
                card.target = "_blank";
                card.rel = "noopener noreferrer";
            }
            const imageWrap = document.createElement("div");
            imageWrap.className = "puzzle-place-image";
            if (item.image) {
                const image = document.createElement("img");
                image.src = item.image;
                image.alt = item.alt;
                image.loading = "lazy";
                image.decoding = "async";
                image.addEventListener("error", function () {
                    image.hidden = true;
                    imageWrap.classList.add("image-unavailable");
                }, { once: true });
                imageWrap.append(image);
            }
            const copy = document.createElement("div");
            copy.className = "puzzle-place-copy";
            const label = document.createElement("span");
            label.className = "puzzle-place-category";
            label.textContent = item.label;
            const title = document.createElement("h3");
            title.textContent = item.name;
            const meta = document.createElement("p");
            meta.className = "puzzle-place-meta";
            meta.textContent = item.meta || "Explore this experience";
            copy.append(label, title, meta);
            card.append(imageWrap, copy);
            return card;
        }

        function resultMessage(message, retry) {
            const wrapper = document.createElement("div");
            wrapper.className = "puzzle-results-message";
            const text = document.createElement("p");
            text.textContent = message;
            wrapper.append(text);
            if (retry) {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "puzzle-retry-btn";
                button.textContent = "Try again";
                button.addEventListener("click", renderSelection);
                wrapper.append(button);
            }
            return wrapper;
        }

        async function renderResults(activeCategories, version) {
            results.hidden = activeCategories.length < 2 || !enabled;
            resultsGrid.replaceChildren();
            results.removeAttribute("aria-busy");
            if (results.hidden) return;
            resultsTitle.textContent = activeCategories.map(function (category) {
                return category.label;
            }).join(" + ");
            results.setAttribute("aria-busy", "true");
            resultsGrid.append(resultMessage("Loading your combined places…"));

            // JSON enriches the cards; category pages also work when JSON is unavailable.
            const requests = await Promise.allSettled([
                getPlaces(),
                ...activeCategories.map(getCategoryPage)
            ]);
            if (version !== renderVersion || !enabled) return;
            const places = requests[0].status === "fulfilled" ? requests[0].value : {};
            const fragment = document.createDocumentFragment();
            const seen = new Set();
            const unavailable = [];
            activeCategories.forEach(function (category, index) {
                const request = requests[index + 1];
                try {
                    if (request.status !== "fulfilled") throw new Error("Unavailable");
                    categoryItems(category, request.value, places).forEach(function (item) {
                        if (seen.has(item.id)) return;
                        seen.add(item.id);
                        fragment.append(makeResultCard(item));
                    });
                } catch (_) {
                    unavailable.push(category.label);
                }
            });
            if (unavailable.length) {
                fragment.append(resultMessage(
                    "We couldn’t load " + unavailable.join(" and ") + ". Try again to see all your selected contents.",
                    true
                ));
            }
            resultsGrid.replaceChildren(fragment);
            results.removeAttribute("aria-busy");
        }

        function cleanClone(element) {
            const clone = element.cloneNode(true);
            clone.removeAttribute("id");
            clone.querySelectorAll("[id]").forEach(function (node) { node.removeAttribute("id"); });
            clone.querySelectorAll(".arrow, .category-icon").forEach(function (node) { node.remove(); });
            clone.querySelectorAll("a, button, input, select, textarea").forEach(function (node) {
                const text = document.createElement("span");
                text.textContent = textOf(node);
                node.replaceWith(text);
            });
            clone.querySelectorAll("[tabindex]").forEach(function (node) { node.removeAttribute("tabindex"); });
            return clone;
        }

        function renderDecoration() {
            if (!decoration) return;
            decoration.replaceChildren();
            decoration.toggleAttribute("hidden", enabled || !layout);
            if (enabled || !layout) return;
            const layoutRect = layout.getBoundingClientRect();
            const width = layoutRect.width;
            const height = layoutRect.height;
            if (!width || !height) return;
            decoration.setAttribute("viewBox", "0 0 " + width + " " + height);
            function relativeRect(element) {
                const rect = element.getBoundingClientRect();
                const left = rect.left - layoutRect.left;
                const right = rect.right - layoutRect.left;
                const top = rect.top - layoutRect.top;
                const bottom = rect.bottom - layoutRect.top;
                return { x: (left + right) / 2, y: (top + bottom) / 2,
                    left: left, right: right, top: top, bottom: bottom,
                    width: right - left, height: bottom - top };
            }
            function point(x, y) {
                return { x: Math.max(-35, Math.min(width + 35, x)),
                    y: Math.max(-35, Math.min(height + 40, y)) };
            }
            function curve(firstControl, secondControl, end) {
                return " C " + firstControl.x + " " + firstControl.y + " " +
                    secondControl.x + " " + secondControl.y + " " + end.x + " " + end.y;
            }
            function addPath(start, segments) {
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("class", "route-line");
                path.setAttribute("d", "M " + start.x + " " + start.y + segments.map(function (segment) {
                    return curve(segment[0], segment[1], segment[2]);
                }).join(""));
                decoration.append(path);
            }
            const cards = {};
            categories.forEach(function (category) {
                const source = sources.get(category.key);
                if (source) cards[category.key] = relativeRect(source.element);
            });
            if (!cards.relax || !cards.culture || !cards.adventure || !cards.activities) return;
            const twoColumns = Math.abs(cards.relax.x - cards.culture.x) >
                Math.min(cards.relax.width, cards.culture.width) * 0.35;
            if (!twoColumns) {
                function phoneTrail(startCard, endCard, leftSide) {
                    const direction = leftSide ? 1 : -1;
                    const edge = leftSide ? Math.min(startCard.left, endCard.left)
                        : Math.max(startCard.right, endCard.right);
                    const start = point(leftSide ? startCard.left + startCard.width * 0.22
                        : startCard.right - startCard.width * 0.22, startCard.bottom - startCard.height * 0.3);
                    const end = point(leftSide ? endCard.left + endCard.width * 0.2
                        : endCard.right - endCard.width * 0.2, endCard.top + endCard.height * 0.3);
                    const distance = end.y - start.y;
                    addPath(start, [[
                        point(edge - direction * 30, start.y + distance * 0.25),
                        point(edge + direction * endCard.width * 0.29, end.y - distance * 0.15),
                        end
                    ]]);
                }
                phoneTrail(cards.relax, cards.culture, true);
                phoneTrail(cards.adventure, cards.activities, false);
                return;
            }

            const introElement = layout.querySelector(".plans-intro");
            const gridElement = layout.querySelector(".plans-grid");
            if (!gridElement) return;
            const grid = relativeRect(gridElement);
            const intro = introElement ? relativeRect(introElement) : null;
            const relax = cards.relax;
            function gridPoint(x, y) {
                return point(grid.left + grid.width * x, grid.top + grid.height * y);
            }
            const end = point(relax.left + relax.width * 0.035, relax.top + relax.height * 0.4);
            const sideBySide = intro && intro.right < grid.left;
            if (sideBySide) {
                const postal = layout.querySelector(".plans-postal-art");
                const postalBounds = postal ? relativeRect(postal) : intro;
                const stampElement = layout.querySelector(".plans-petra-stamp");
                const postmarkElement = layout.querySelector(".plans-postmark");
                const stamp = stampElement ? relativeRect(stampElement) : postalBounds;
                const postmark = postmarkElement ? relativeRect(postmarkElement) : postalBounds;
                const button = relativeRect(modeButton);
                const start = point(-35, height + 40);
                const entry = point(stamp.left + stamp.width * 0.22, stamp.bottom - stamp.height * 0.08);
                const stampExit = point(stamp.left + stamp.width * 0.68, stamp.top - 8);
                const emerge = point(postmark.right + 12, Math.min(stamp.top, postmark.top) - 14);
                const loopX = Math.min(grid.left - 32, Math.max(button.right + 28, postmark.right + 24));
                const loopY = Math.min(emerge.y - 22, button.bottom + 34);
                const approach = point(loopX - 14, loopY + 20);
                addPath(start, [
                    [point(start.x + 25, start.y - 48), point(entry.x - 30, entry.y + 30), entry],
                    [point(entry.x + 18, stamp.y), point(stampExit.x - 12, stamp.top + 18), stampExit],
                    [point(stamp.right + 14, stampExit.y - 8), point(emerge.x - 35, emerge.y), emerge],
                    [point(emerge.x + 20, emerge.y - 18), point(approach.x - 28, approach.y + 16), approach],
                    [point(loopX + 31, loopY + 3), point(loopX + 17, loopY - 29), point(loopX - 5, loopY - 19)],
                    [point(loopX - 30, loopY - 11), point(loopX - 21, loopY + 22), point(loopX + 14, loopY + 20)],
                    [point(loopX + 72, loopY + 24), point(end.x - 75, end.y + 18), end]
                ]);
            } else {
                const start = point(grid.left - 25, grid.bottom + 20);
                const junction = point(grid.left - 18, grid.top + grid.height * 0.56);
                addPath(start, [
                    [point(grid.left - 18, start.y - 65), point(grid.left - 28, junction.y + 65), junction],
                    [point(grid.left - 26, grid.top + grid.height * 0.32), point(end.x - 40, end.y + 18), end]
                ]);
            }

            // Follow the narrow diagonal gutters, with the photos concealing each join.
            const bridgeStart = gridPoint(0.64, 0.13);
            const bridgeEnd = gridPoint(0.75, 0.12);
            const outerEntry = gridPoint(0.995, 0.35);
            const outsideBend = Math.max(26, Math.min(58, (width - grid.right) * 0.6 + 26));
            const outerTurn = gridPoint(0.98, 0.675);
            addPath(bridgeStart, [
                [gridPoint(0.68, 0.035), gridPoint(0.72, 0.035), bridgeEnd],
                [gridPoint(0.81, 0.22), gridPoint(0.96, 0.25), outerEntry],
                [point(grid.right + outsideBend, grid.top + grid.height * 0.43),
                    point(grid.right + outsideBend, grid.top + grid.height * 0.64), outerTurn],
                [gridPoint(0.85, 0.65), gridPoint(0.65, 0.59), gridPoint(0.55, 0.565)],
                [gridPoint(0.51, 0.56), gridPoint(0.50, 0.585), gridPoint(0.475, 0.60)]
            ]);

            const bottomStart = gridPoint(0.035, 0.65);
            const bottomJoin = gridPoint(0.63, 0.975);
            const rightExit = gridPoint(0.995, 0.965);
            addPath(bottomStart, [
                [point(grid.left - 30, grid.top + grid.height * 0.73),
                    point(grid.left - 30, grid.top + grid.height * 0.92), gridPoint(0.12, 1.015)],
                [gridPoint(0.30, 1.10), gridPoint(0.53, 1.10), bottomJoin],
                [gridPoint(0.70, 0.89), gridPoint(0.90, 0.94), rightExit],
                [point(grid.right + 25, rightExit.y - 5),
                    point(width - 15, height + 10), point(width + 35, height + 28)]
            ]);
        }
        function renderConnections() {
            renderDecoration();
            if (!connections) return;
            connections.replaceChildren();
            const route = Array.from(selected).filter(function (key) { return sources.has(key); });
            const visible = enabled && route.length >= 1 && layout;
            connections.toggleAttribute("hidden", !visible);
            if (!visible) return;
            const layoutRect = layout.getBoundingClientRect();
            if (!layoutRect.width || !layoutRect.height) {
                connections.setAttribute("hidden", "");
                return;
            }
            function normalizedRect(element) {
                const rect = element.getBoundingClientRect();
                const left = (rect.left - layoutRect.left) / layoutRect.width * 1000;
                const right = (rect.right - layoutRect.left) / layoutRect.width * 1000;
                const top = (rect.top - layoutRect.top) / layoutRect.height * 1000;
                const bottom = (rect.bottom - layoutRect.top) / layoutRect.height * 1000;
                return {
                    x: (left + right) / 2,
                    y: (top + bottom) / 2,
                    left: left,
                    right: right,
                    top: top,
                    bottom: bottom,
                    width: right - left,
                    height: bottom - top
                };
            }
            function clamp(value) { return Math.max(-20, Math.min(1020, value)); }
            function appendPath(start, end, firstControl, secondControl) {
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("class", "puzzle-connection-line");
                path.setAttribute("d", "M " + start.x + " " + start.y + " C " +
                    clamp(firstControl.x) + " " + clamp(firstControl.y) + " " +
                    clamp(secondControl.x) + " " + clamp(secondControl.y) + " " + end.x + " " + end.y);
                path.setAttribute("vector-effect", "non-scaling-stroke");
                connections.append(path);
            }
            const centers = {};
            route.forEach(function (key) { centers[key] = normalizedRect(sources.get(key).element); });
            const origin = normalizedRect(builder);
            const first = centers[route[0]];
            const sourceGrid = layout.querySelector(".plans-grid");
            const gridBounds = sourceGrid ? normalizedRect(sourceGrid) : first;
            if (origin.top >= gridBounds.bottom) {
                const start = { x: origin.x, y: origin.top };
                const bend = Math.max(50, Math.abs(start.y - first.y) * 0.45);
                appendPath(start, first,
                    { x: start.x, y: start.y - bend },
                    { x: first.x, y: first.y + bend });
            } else if (origin.bottom <= gridBounds.top) {
                const start = { x: origin.x, y: origin.bottom };
                const bend = Math.max(50, Math.abs(start.y - first.y) * 0.45);
                appendPath(start, first,
                    { x: start.x, y: start.y + bend },
                    { x: first.x, y: first.y - bend });
            } else {
                const direction = first.x >= origin.x ? 1 : -1;
                const start = { x: direction === 1 ? origin.right : origin.left, y: origin.y };
                const bend = Math.max(50, Math.min(220, Math.abs(first.x - start.x) * 0.45));
                appendPath(start, first,
                    { x: start.x + bend * direction, y: start.y },
                    { x: first.x - bend * direction, y: first.y });
            }
            const positions = {
                relax: { row: 0, column: 0 },
                culture: { row: 0, column: 1 },
                adventure: { row: 1, column: 0 },
                activities: { row: 1, column: 1 }
            };
            for (let index = 1; index < route.length; index += 1) {
                const start = centers[route[index - 1]];
                const end = centers[route[index]];
                const startPosition = positions[route[index - 1]];
                const endPosition = positions[route[index]];
                if (startPosition.row === endPosition.row) {
                    const margin = Math.max(start.height, end.height) * 0.13;
                    const bend = startPosition.row === 0
                        ? Math.min(start.top, end.top) - margin
                        : Math.max(start.bottom, end.bottom) + margin;
                    appendPath(start, end, { x: start.x, y: bend }, { x: end.x, y: bend });
                } else if (startPosition.column === endPosition.column) {
                    const margin = Math.max(start.width, end.width) * 0.13;
                    const bend = startPosition.column === 0
                        ? Math.min(start.left, end.left) - margin
                        : Math.max(start.right, end.right) + margin;
                    appendPath(start, end, { x: bend, y: start.y }, { x: bend, y: end.y });
                } else {
                    const dx = end.x - start.x;
                    const dy = end.y - start.y;
                    appendPath(start, end,
                        { x: start.x + dx * 1.06, y: start.y - dy * 0.16 },
                        { x: end.x - dx * 1.06, y: end.y + dy * 0.16 });
                }
            }
        }

        function scheduleConnections() {
            if (connectionFrame) return;
            connectionFrame = window.requestAnimationFrame(function () {
                connectionFrame = 0;
                renderConnections();
            });
        }

        function renderSelection() {
            const activeCategories = categories.filter(function (category) { return selected.has(category.key); });
            categories.forEach(function (category) {
                const source = sources.get(category.key);
                const slot = slots.get(category.key);
                const assembled = selected.has(category.key);
                if (source) {
                    source.element.classList.toggle("is-assembled", enabled && assembled);
                    if (enabled) {
                        source.element.setAttribute("aria-pressed", String(assembled));
                        source.element.setAttribute("aria-label", (assembled ? "Remove " : "Add ") + category.label + " puzzle piece");
                    }
                }
                if (!slot) return;
                slot.element.classList.toggle("is-assembled", assembled);
                slot.element.setAttribute("aria-pressed", String(assembled));
                slot.element.setAttribute("aria-label", (assembled ? "Remove " : "Add ") + category.label + " puzzle piece");
                if (slot.assembled === assembled) return;
                slot.assembled = assembled;
                if (assembled && source) {
                    const content = source.element.querySelector(".puzzle-surface");
                    const border = source.element.querySelector(".puzzle-border");
                    const pieces = [];
                    if (content) pieces.push(cleanClone(content));
                    if (border) pieces.push(cleanClone(border));
                    slot.element.replaceChildren(...pieces);
                } else {
                    slot.element.replaceChildren(...slot.placeholder.map(function (node) { return node.cloneNode(true); }));
                }
            });
            const count = activeCategories.length;
            resetButton.disabled = count === 0;
            board.dataset.count = String(count);
            status.textContent = count === 0
                ? "Drag or tap any two pieces to start your mix."
                : count === 1
                    ? "1 of 4 pieces assembled. Add one more to see both categories together."
                    : count + " of 4 pieces assembled. " + (count === 4
                        ? "Your full Jordan mix is ready."
                        : "Your combined contents are below. Add another piece to expand your mix.");
            renderConnections();
            renderVersion += 1;
            renderResults(activeCategories, renderVersion);
        }

        function toggleCategory(key) {
            if (!enabled) return;
            if (selected.has(key)) selected.delete(key);
            else selected.add(key);
            renderSelection();
        }

        function clearDragState() {
            draggedCategory = "";
            board.classList.remove("is-drag-over");
            board.querySelectorAll(".is-drag-over").forEach(function (slot) { slot.classList.remove("is-drag-over"); });
            sources.forEach(function (source) { source.element.classList.remove("is-dragging"); });
        }

        categories.forEach(function (category) {
            const element = document.querySelector(".plans-grid .plan-card." + category.key);
            if (element) {
                const original = {};
                ["role", "aria-label", "aria-pressed", "draggable"].forEach(function (attribute) {
                    original[attribute] = element.getAttribute(attribute);
                });
                sources.set(category.key, { element: element, original: original });
                element.addEventListener("click", function (event) {
                    if (!enabled) return;
                    event.preventDefault();
                    toggleCategory(category.key);
                });
                element.addEventListener("keydown", function (event) {
                    if (enabled && event.key === " ") {
                        event.preventDefault();
                        toggleCategory(category.key);
                    }
                });
                element.addEventListener("dragstart", function (event) {
                    if (!enabled || !event.dataTransfer) return;
                    draggedCategory = category.key;
                    event.dataTransfer.effectAllowed = "copy";
                    event.dataTransfer.setData("application/x-jouk-puzzle", category.key);
                    event.dataTransfer.setData("text/plain", category.key);
                    element.classList.add("is-dragging");
                });
                element.addEventListener("dragend", clearDragState);
            }
            const slot = board.querySelector(".puzzle-slot[data-category='" + category.key + "']");
            if (slot) {
                slot.classList.add(category.key);
                slots.set(category.key, {
                    element: slot,
                    assembled: false,
                    placeholder: Array.from(slot.childNodes).map(function (node) { return node.cloneNode(true); })
                });
                slot.addEventListener("click", function () { toggleCategory(category.key); });
            }
        });

        board.addEventListener("dragover", function (event) {
            if (!enabled || !draggedCategory || !event.dataTransfer) return;
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
            board.classList.add("is-drag-over");
        });
        board.addEventListener("dragleave", function (event) {
            if (!event.relatedTarget || !board.contains(event.relatedTarget)) {
                board.classList.remove("is-drag-over");
            }
        });
        board.addEventListener("drop", function (event) {
            if (!enabled || !event.dataTransfer) return;
            const category = event.dataTransfer.getData("application/x-jouk-puzzle") || draggedCategory;
            if (!categories.some(function (item) { return item.key === category; })) return;
            event.preventDefault();
            selected.add(category);
            clearDragState();
            renderSelection();
        });

        modeButton.addEventListener("click", function () {
            enabled = !enabled;
            document.body.classList.toggle("puzzle-mode", enabled);
            modeButton.setAttribute("aria-expanded", String(enabled));
            builder.hidden = !enabled;
            sources.forEach(function (source) {
                if (enabled) {
                    source.element.setAttribute("role", "button");
                    source.element.setAttribute("draggable", "true");
                } else {
                    Object.keys(source.original).forEach(function (attribute) {
                        const original = source.original[attribute];
                        if (original === null) source.element.removeAttribute(attribute);
                        else source.element.setAttribute(attribute, original);
                    });
                }
            });
            clearDragState();
            renderSelection();
            if (enabled && slots.size) slots.values().next().value.element.focus({ preventScroll: true });
        });
        resetButton.addEventListener("click", function () {
            selected.clear();
            clearDragState();
            renderSelection();
        });
        window.addEventListener("resize", scheduleConnections, { passive: true });
        if (layout && typeof ResizeObserver === "function") {
            const resizeObserver = new ResizeObserver(scheduleConnections);
            resizeObserver.observe(layout);
            resizeObserver.observe(builder);
            const grid = layout.querySelector(".plans-grid");
            if (grid) resizeObserver.observe(grid);
        }
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(scheduleConnections);
        }
        renderSelection();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPuzzleAssembly, { once: true });
    } else {
        initPuzzleAssembly();
    }
})();
