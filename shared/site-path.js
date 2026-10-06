(function () {
    const script = document.currentScript;
    const projectRoot = script && script.src
        ? new URL("../", script.src)
        : new URL("/", window.location.href);
    const basePath = projectRoot.pathname;

    function toProjectUrl(path) {
        const relativePath = String(path || "").replace(/^\/+/, "");
        return new URL(relativePath, projectRoot).href;
    }

    function toAssetUrl(path) {
        const value = String(path || "").trim();
        if (!value || /^(?:https?:|data:|blob:|file:|\/\/|#)/i.test(value)) return value;
        return toProjectUrl(value.replace(/^(?:\.\.\/)+/, ""));
    }

    window.JOUK = Object.assign(window.JOUK || {}, {
        basePath,
        url: toProjectUrl,
        asset: toAssetUrl
    });
})();
