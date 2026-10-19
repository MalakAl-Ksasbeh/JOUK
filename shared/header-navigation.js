(function () {
    function init() {
        document.querySelectorAll('.nav-links, .site-nav').forEach(function (nav) {
            const links = Array.from(nav.querySelectorAll('a'));
            const path = decodeURIComponent(location.pathname);
            const section = /\/plans\/|\/place\//.test(path) ? 'plans' : /\/community\//.test(path) ? 'community' : /\/home page\//.test(path) ? 'home' : '';
            const active = links.find(function (link) { return section && link.textContent.trim().toLowerCase() === section; }) || links.find(function (link) { return link.classList.contains('active'); });
            links.forEach(function (link) { link.classList.toggle('active', link === active); if (link === active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
            const indicator = document.createElement('span');
            indicator.className = 'jouk-nav-indicator';
            indicator.setAttribute('aria-hidden', 'true');
            document.body.appendChild(indicator);
            let target = active;
            function point(link) {
                target = link;
                if (!link) { indicator.style.opacity = '0'; return; }
                const rect = link.getBoundingClientRect();
                indicator.style.width = rect.width + 'px';
                indicator.style.transform = 'translate(' + rect.left + 'px,' + (rect.bottom + 5) + 'px)';
                indicator.style.opacity = '1';
            }
            links.forEach(function (link) { link.addEventListener('mouseenter', function () { point(link); }); link.addEventListener('focus', function () { point(link); }); });
            nav.addEventListener('mouseleave', function () { point(active); });
            nav.addEventListener('focusout', function (event) { if (!nav.contains(event.relatedTarget)) point(active); });
            point(active);
            window.addEventListener('resize', function () { point(target); });
            window.addEventListener('scroll', function () { point(target); }, {passive:true});
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
