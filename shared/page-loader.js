(function () {
    const loader = document.querySelector(".page-loader");
    if (!loader) return;

    const startedAt = Date.now();
    let hidden = false;

    function hideLoader() {
        if (hidden) return;
        hidden = true;

        const minimumDisplayTime = 450;
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
