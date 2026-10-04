(function () {
    const projectSegment = "/JOUK";
    const pathname = window.location.pathname.toLowerCase();
    const isProjectPages = pathname === projectSegment.toLowerCase() || pathname.startsWith(projectSegment.toLowerCase() + "/");
    const basePath = isProjectPages ? projectSegment + "/" : "/";

    function toProjectUrl(path) {
        const relativePath = String(path || "").replace(/^\/+/, "");
        return new URL(relativePath, window.location.origin + basePath).href;
    }

    function toAssetUrl(path) {
        const value = String(path || "").trim();
        if (!value || /^(?:https?:|data:|blob:|\/\/|#)/i.test(value)) return value;
        return toProjectUrl(value.replace(/^(?:\.\.\/)+/, ""));
    }

    window.JOUK = Object.assign(window.JOUK || {}, {
        basePath,
        url: toProjectUrl,
        asset: toAssetUrl
    });
})();