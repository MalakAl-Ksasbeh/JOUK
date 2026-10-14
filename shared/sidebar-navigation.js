(function () {
    function mount() {
        if (!window.JOUK || document.querySelector('.jouk-menu-toggle')) return;
        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'jouk-menu-toggle';
        trigger.setAttribute('aria-label', 'Open navigation menu');
        trigger.setAttribute('aria-haspopup', 'dialog');
        trigger.setAttribute('aria-controls', 'jouk-sidebar');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
        const drawer = document.createElement('dialog');
        drawer.id = 'jouk-sidebar';
        drawer.className = 'jouk-sidebar';
        drawer.setAttribute('aria-label', 'Site navigation');
        const links = [['My Path','other pages/create-plan/index.html'],['Community','reviews/community/index.html'],['Saved Places','other pages/saved-places/index.html'],['About','about/index.html']];
        const categories = [['Relax','plans/relax/index.html'],['Adventure','plans/adventures/index.html'],['Culture','plans/culture/index.html'],['Something to Do','plans/something to do/index.html']];
        function link(item) {
            const href = window.JOUK.url(item[1]);
            const active = new URL(href).pathname === location.pathname;
            return '<a href="' + href + '"' + (active ? ' aria-current="page"' : '') + '>' + item[0] + '</a>';
        }
        drawer.innerHTML = '<div class="jouk-sidebar-heading"><span class="jouk-sidebar-logo">JOUK</span><button type="button" aria-label="Close navigation menu">×</button></div><div class="jouk-sidebar-body"><nav aria-label="Main menu">' + link(['Home','home page/index.html']) + '<details class="jouk-sidebar-plans"><summary>Plans<svg class="jouk-plans-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></summary><div class="jouk-sidebar-submenu"><a class="jouk-explore-link" href="' + window.JOUK.url('plans/index.html') + '">Explore Jordan </a><nav class="jouk-sidebar-categories" aria-label="Plan categories">' + categories.map(link).join('') + '</nav></div></details>' + links.map(link).join('') + '</nav></div><div class="jouk-sidebar-profile"><a href="' + window.JOUK.url('other pages/profile/index.html') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/></svg><span>Profile</span></a></div>';
        document.body.append(trigger, drawer);
        const accountLink = drawer.querySelector('.jouk-sidebar-profile a');
        function updateAccount(user) {
            accountLink.href = window.JOUK.url(user ? 'other pages/profile/index.html' : 'sign up-log in/index.html');
            accountLink.querySelector('span').textContent = user ? 'Profile' : 'Sign Up / Log In';
            accountLink.setAttribute('aria-label', user ? 'Open your profile' : 'Sign up or log in');
        }
        updateAccount(null);
        accountLink.addEventListener('click', function (event) {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            const destination = accountLink.href;
            drawer.close();
            window.location.assign(destination);
        });
        Promise.all([
            import(window.JOUK.url('shared/firebase.js')),
            import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js')
        ]).then(function (modules) {
            modules[1].onAuthStateChanged(modules[0].auth, updateAccount, function () { updateAccount(null); });
        }).catch(function () { updateAccount(null); });
        let previousOverflow = '';
        trigger.addEventListener('click', function () {
            previousOverflow = document.body.style.overflow;
            drawer.showModal();
            trigger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        });
        drawer.querySelector('button').addEventListener('click', function () { drawer.close(); });
        drawer.addEventListener('click', function (event) { if (event.target === drawer && event.clientX > drawer.getBoundingClientRect().right) drawer.close(); });
        drawer.addEventListener('close', function () {
            document.body.style.overflow = previousOverflow;
            trigger.setAttribute('aria-expanded', 'false');
            trigger.focus();
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();
})();



