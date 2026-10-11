(function () {
    const categories = ["relax", "culture", "adventures", "something to do"];
    const segments = decodeURIComponent(window.location.pathname).split("/");
    const index = categories.indexOf(segments[segments.length - 2]);
    if (index < 0) return;
    document.addEventListener("keydown", function (event) {
        if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        if (event.target.closest('input, textarea, select, button, [contenteditable]:not([contenteditable="false"]), [role="tablist"], [role="menu"], [role="slider"], [role="dialog"], video, audio, .event-card, .place-card')) return;
        if (document.querySelector('dialog[open], [role="dialog"][aria-modal="true"]:not([hidden])')) return;
        const next = (index + (event.key === "ArrowRight" ? 1 : -1) + categories.length) % categories.length;
        event.preventDefault();
        window.location.assign(window.JOUK.url("plans/" + categories[next] + "/index.html"));
    });
})();
