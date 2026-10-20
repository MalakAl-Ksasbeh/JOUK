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
    const savedStyle = document.createElement("link");
    const headerStyle = document.createElement("link");
    headerStyle.rel = "stylesheet";
    headerStyle.href = toProjectUrl("shared/header-navigation.css?v=2");
    document.head.appendChild(headerStyle);
    const headerScript = document.createElement("script");
    headerScript.src = toProjectUrl("shared/header-navigation.js?v=2");
    document.head.appendChild(headerScript);
    savedStyle.rel = "stylesheet";
    savedStyle.href = toProjectUrl("shared/saved-places.css?v=1");
    document.head.appendChild(savedStyle);
    const savedScript = document.createElement("script");
    savedScript.src = toProjectUrl("shared/saved-places.js?v=2");
    savedScript.async = true;
    document.head.appendChild(savedScript);
    const sidebarStyle = document.createElement("link");
    sidebarStyle.rel = "stylesheet";
    sidebarStyle.href = toProjectUrl("shared/sidebar-navigation.css?v=7");
    document.head.appendChild(sidebarStyle);
    const sidebarScript = document.createElement("script");
    sidebarScript.src = toProjectUrl("shared/sidebar-navigation.js?v=6");
    sidebarScript.async = true;
    document.head.appendChild(sidebarScript);
})();





// ==========================================
// UNIFIED PROFILE NAVIGATION
// ==========================================

(function () {

    const profileURL = window.JOUK.url(
        "other pages/profile/index.html"
    );

    const loginURL = window.JOUK.url(
        "sign up-log in/index.html"
    );

    const loginWithReturn =
        loginURL + "?returnTo=" +
        encodeURIComponent(profileURL);

    const authPromise = import(
        window.JOUK.url("shared/firebase.js")
    ).then(async ({ auth }) => {
        await auth.authStateReady();
        return auth;
    });

    // Handle profile icon clicks on every page
    document.addEventListener("click", async function (event) {

        const profileIcon = event.target.closest(
            "a.site-account"
        );

        if (!profileIcon) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        try {
            const auth = await authPromise;

            window.location.href = auth.currentUser
                ? profileURL
                : loginWithReturn;

        } catch (error) {
            console.error("Authentication error:", error);
            window.location.href = loginWithReturn;
        }

    }, true);

    // Update profile links and protect Profile page
    authPromise.then((auth) => {

        const isLoggedIn = !!auth.currentUser;

        document.querySelectorAll("a.site-account")
            .forEach((link) => {

                link.href = isLoggedIn
                    ? profileURL
                    : loginWithReturn;

                link.setAttribute(
                    "aria-label",
                    isLoggedIn
                        ? "My Profile"
                        : "Log in or sign up"
                );

            });

        const isProfilePage =
            window.location.pathname ===
            new URL(profileURL).pathname;

        if (isProfilePage && !isLoggedIn) {
            window.location.replace(loginWithReturn);
        }

    }).catch((error) => {

        console.error("Could not check login status:", error);

        if (
            window.location.pathname ===
            new URL(profileURL).pathname
        ) {
            window.location.replace(loginWithReturn);
        }

    });

})();

