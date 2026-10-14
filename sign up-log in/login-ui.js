(function () {
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const guest = document.getElementById('guestBtn');
    const page = document.querySelector('.login-page');
    const tabs = document.getElementById('tabs');
    const subtitle = document.getElementById('loginStorySubtitle');
    const signupStory = document.getElementById('signupStoryCopy');
    function selectSignup(signup) {
        loginForm.style.display = signup ? 'none' : 'block';
        signupForm.style.display = signup ? 'block' : 'none';
        if (guest) guest.style.display = signup ? 'none' : 'block';
        loginTab.classList.toggle('active', !signup);
        signupTab.classList.toggle('active', signup);
        loginTab.setAttribute('aria-pressed', String(!signup));
        signupTab.setAttribute('aria-pressed', String(signup));
        tabs.classList.toggle('signup-active', signup);
        page.classList.toggle('signup-mode', signup);
        if (subtitle) subtitle.hidden = signup;
        if (signupStory) signupStory.hidden = !signup;
    }
    signupTab.addEventListener('click', function () { selectSignup(true); });
    loginTab.addEventListener('click', function () { selectSignup(false); });
    document.querySelectorAll('.eye-btn').forEach(function (button) {
        button.addEventListener('click', function () {
            const input = document.getElementById(button.dataset.target);
            if (!input) return;
            input.type = input.type === 'password' ? 'text' : 'password';
            button.setAttribute('aria-label', input.type === 'password' ? 'Show password' : 'Hide password');
        });
    });
    if (guest) guest.addEventListener('click', function () { location.assign(window.JOUK.url('home page/index.html')); });
    [loginForm, signupForm].forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (window.JOUK_AUTH_READY) return;
            event.preventDefault();
            let notice = document.getElementById('auth-load-status');
            if (!notice) {
                notice = document.createElement('p');
                notice.id = 'auth-load-status';
                notice.setAttribute('role', 'status');
            }
            form.appendChild(notice);
            notice.textContent = location.protocol === 'file:'
                ? 'Open this website through its local server to log in or create an account.'
                : 'Sign-in is still connecting. Check your connection and try again.';
        }, true);
    });
    selectSignup(new URLSearchParams(location.search).get('tab') === 'signup');
})();
