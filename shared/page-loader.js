(function () {
    const loader = document.querySelector(".page-loader");
    if (!loader) return;

    const spinner = loader.querySelector(".page-loader-spinner");
    if (spinner) {
        const svgNamespace = "http://www.w3.org/2000/svg";
        const map = document.createElementNS(svgNamespace, "svg");
        map.setAttribute("class", "page-loader-map");
        map.setAttribute("viewBox", "0 0 120 140");
        map.setAttribute("aria-hidden", "true");
        map.setAttribute("focusable", "false");

        // Jordan's exterior boundary, projected from Natural Earth's public-domain
        // 110m admin-0 GeoJSON with longitude scaled at the country's mean latitude.
        // Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson
        const outline = document.createElementNS(svgNamespace, "path");
        outline.setAttribute("class", "page-loader-map-outline");
        outline.setAttribute("fill", "none");
        outline.setAttribute("d", "M 25.36 40.38 L 29.35 31.93 L 54.85 42.55 L 99.68 14.00 L 108.90 46.62 L 104.54 50.66 L 58.70 64.10 L 81.51 90.88 L 73.94 95.43 L 70.18 104.40 L 52.71 108.11 L 47.23 117.76 L 37.34 126.00 L 11.86 121.74 L 11.10 117.86 L 22.50 75.04 L 21.97 64.62 L 25.35 56.76 Z");

        const drawing = outline.cloneNode();
        drawing.setAttribute("class", "page-loader-map-draw");
        drawing.setAttribute("pathLength", "1");
        map.appendChild(outline);
        map.appendChild(drawing);
        spinner.replaceChildren(map);
    }

    const startedAt = Date.now();
    let hidden = false;

    function hideLoader() {
        if (hidden) return;
        hidden = true;

        // Let the border finish one drawing before a fast page dismisses it.
        const minimumDisplayTime = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 450 : 1000;
        const wait = Math.max(0, minimumDisplayTime - (Date.now() - startedAt));

        window.setTimeout(function () {
            loader.classList.add("is-hidden");
        }, wait);
    }

    window.addEventListener("load", hideLoader, { once: true });

    if (document.readyState === "complete") {
        hideLoader();
    }
})();
