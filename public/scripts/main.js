/* Mobile menu burger toggle */
(function () {
    const navigation = document.querySelector('.gh-navigation');
    const burger = navigation.querySelector('.gh-burger');
    if (!burger) return;

    const mobile = window.matchMedia('(max-width: 767px)');
    const root = document.documentElement;
    let scrollPosition = 0;

    function closeMenu() {
        if (!navigation.classList.contains('is-open')) return;

        navigation.classList.remove('is-open');
        root.classList.remove('gh-navigation-open');
        root.style.removeProperty('--gh-navigation-scroll-top');
        window.scrollTo({top: scrollPosition, behavior: 'instant'});
    }

    burger.addEventListener('click', function () {
        if (!navigation.classList.contains('is-open')) {
            if (!mobile.matches) return;

            scrollPosition = window.scrollY;
            root.style.setProperty('--gh-navigation-scroll-top', `${-scrollPosition}px`);
            root.classList.add('gh-navigation-open');
            navigation.classList.add('is-open');
        } else {
            closeMenu();
        }
    });

    mobile.addEventListener('change', function () {
        if (!mobile.matches) closeMenu();
    });
})();

/* Dark/light toggle: flips html[data-theme] and remembers the choice (the head script applies it on load) */
(function () {
    const root = document.documentElement;
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
        button.setAttribute('aria-pressed', root.dataset.theme === 'light');
        button.addEventListener('click', function () {
            const light = root.dataset.theme !== 'light';
            if (light) root.dataset.theme = 'light';
            else delete root.dataset.theme;
            try {
                localStorage.setItem('fsociety-theme', light ? 'light' : 'dark');
            } catch (e) {}
            document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
                b.setAttribute('aria-pressed', light);
            });
        });
    });
})();

/* Add lightbox to gallery and feature images */
(function () {
    lightbox(
        '.kg-image-card > .kg-image[width][height], .kg-gallery-image > img, .gh-feature-image'
    );
})();

/* Responsive video in post content */
(function () {
    const sources = [
        '.gh-content iframe[src*="youtube.com"]',
        '.gh-content iframe[src*="youtube-nocookie.com"]',
        '.gh-content iframe[src*="player.vimeo.com"]',
        '.gh-content iframe[src*="kickstarter.com"][src*="video.html"]',
        '.gh-content object',
        '.gh-content embed',
    ];
    reframe(document.querySelectorAll(sources.join(',')));
})();

/* Turn the main nav into dropdown menu when there are more than 5 menu items */
(function () {
    dropdown();
})();

/* Responsive HTML table */
(function () {
    const tables = document.querySelectorAll('.gh-content > table:not(.gist table)');
    
    tables.forEach(function (table) {
        const wrapper = document.createElement('div');
        wrapper.className = 'gh-table';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
})();

/* Home greeting typed letter by letter, like a line in a terminal. The full text stays in the
HTML (and in aria-label), so it works without JS and for screen readers. */
(function () {
    const title = document.querySelector('[data-typing]');
    if (!title || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const text = title.textContent.trim();
    if (!text) return;

    title.setAttribute('aria-label', text);
    const typed = document.createElement('span');
    typed.setAttribute('aria-hidden', 'true');
    title.replaceChildren(typed);
    title.classList.add('is-typing');

    let i = 0;
    (function type() {
        typed.textContent = text.slice(0, ++i);
        if (i < text.length) {
            const pause = /[,.!?]/.test(text[i - 1]) ? 380 : 55 + Math.random() * 70;
            setTimeout(type, pause);
        } else {
            title.classList.remove('is-typing');
            title.classList.add('is-typed');
        }
    })();
})();

/* Prompt search: typing after "$" filters the posts by title.
Reads the search index the site builds at /search.json (every post, not just the page's);
if it can't be loaded, falls back to filtering the cards already on the page. */
(function () {
    const box = document.querySelector('.gh-prompt-search');
    if (!box) return;

    const input = box.querySelector('.gh-prompt-input');
    const query = box.querySelector('.gh-prompt-query');
    const feed = document.querySelector('.gh-feed');
    const pagination = document.querySelector('.gh-pagination');
    if (!feed) return;

    const results = document.createElement('div');
    results.className = 'gh-feed gh-search-results';
    results.hidden = true;
    const status = document.createElement('p');
    status.className = 'gh-search-status';
    status.setAttribute('aria-live', 'polite');
    status.hidden = true;
    feed.before(status, results);

    const normalize = (text) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    let posts = null;
    let loading = null;

    function postsFromPage() {
        return Array.from(feed.querySelectorAll('.gh-card')).map(function (card) {
            return {
                title: card.querySelector('.gh-card-title').textContent.trim(),
                url: card.querySelector('.gh-card-link').href,
                tag: (card.querySelector('.gh-card-tag') || {}).textContent || '',
                authors: ''
            };
        });
    }

    function matchesFilter(post) {
        const [type, slug] = (box.dataset.filter || '').split(':');
        if (type === 'tag') return post.tags.includes(slug);
        if (type === 'author') return post.authorSlugs.includes(slug);
        return true;
    }

    function loadPosts() {
        if (loading) return loading;
        loading = fetch(box.dataset.index)
            .then(function (res) {
                if (!res.ok) throw new Error(res.status);
                return res.json();
            })
            .then(function (data) {
                posts = data.filter(matchesFilter);
            })
            .catch(function () {
                posts = postsFromPage();
            });
        return loading;
    }

    function card(post) {
        const article = document.createElement('article');
        article.className = 'gh-card';
        article.innerHTML = '<a class="gh-card-link"><span class="gh-card-number" aria-hidden="true"></span>' +
            '<div class="gh-card-wrapper"><h3 class="gh-card-title is-title"></h3><footer class="gh-card-meta"></footer></div></a>';
        article.querySelector('a').href = post.url;
        article.querySelector('h3').textContent = post.title;
        const meta = article.querySelector('footer');
        if (post.tag) {
            const tag = document.createElement('span');
            tag.className = 'gh-card-tag';
            tag.textContent = post.tag;
            meta.append(tag);
        }
        if (post.authors && box.hasAttribute('data-show-author')) {
            const author = document.createElement('span');
            author.className = 'gh-card-author';
            author.textContent = box.dataset.by.replace('%', post.authors);
            meta.append(author);
        }
        return article;
    }

    function render() {
        const value = input.value;
        query.textContent = value;
        box.classList.toggle('has-query', value.length > 0);

        const terms = normalize(value).split(/\s+/).filter(Boolean);
        const searching = terms.length > 0;
        feed.hidden = searching;
        if (pagination) pagination.hidden = searching;
        results.hidden = !searching;
        status.hidden = !searching;
        if (!searching || !posts) return;

        const found = posts.filter(function (post) {
            const title = normalize(post.title);
            return terms.every(function (term) { return title.includes(term); });
        });
        results.replaceChildren.apply(results, found.map(card));
        status.textContent = found.length === 0 ? box.dataset.none :
            found.length === 1 ? box.dataset.one : box.dataset.many.replace('%', found.length);
    }

    function syncUrl() {
        const url = new URL(window.location.href);
        if (input.value) url.searchParams.set('q', input.value);
        else url.searchParams.delete('q');
        history.replaceState(null, '', url);
    }

    input.addEventListener('focus', loadPosts);
    input.addEventListener('input', function () {
        render();
        loadPosts().then(render);
        syncUrl();
    });
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            input.value = '';
            render();
            syncUrl();
            input.blur();
        } else if (event.key === 'Enter') {
            const first = results.querySelector('.gh-card-link');
            if (first && !results.hidden) window.location.href = first.href;
        }
    });

    // "/" focuses the prompt, like in a terminal pager
    document.addEventListener('keydown', function (event) {
        if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
        if (event.target.closest('input, textarea, select, [contenteditable]')) return;
        event.preventDefault();
        input.focus();
    });

    const initial = new URLSearchParams(window.location.search).get('q');
    if (initial) {
        input.value = initial;
        render();
        loadPosts().then(render);
    }

    // The search button in the header lands here as /#search
    if (window.location.hash === '#search') input.focus();
})();

/* Search button in the header: focuses the prompt search, or opens the home page's when this page has none */
(function () {
    document.querySelectorAll('[data-search-toggle]').forEach(function (button) {
        button.addEventListener('click', function () {
            const input = document.querySelector('.gh-prompt-input');
            if (input) {
                input.scrollIntoView({block: 'center'});
                input.focus();
            } else {
                window.location.href = button.dataset.searchToggle;
            }
        });
    });
})();

/* Gallery cards in post content (imported from Ghost): each image takes room in proportion to its shape */
(function () {
    document.querySelectorAll('.kg-gallery-image img').forEach(function (image) {
        const width = image.getAttribute('width');
        const height = image.getAttribute('height');
        if (width && height) image.closest('.kg-gallery-image').style.flex = width / height + ' 1 0%';
    });
})();

/* Toggle cards in post content (imported from Ghost): open and close on click */
(function () {
    document.querySelectorAll('.kg-toggle-card').forEach(function (card) {
        card.querySelector('.kg-toggle-heading').addEventListener('click', function () {
            card.dataset.kgToggleState = card.dataset.kgToggleState === 'open' ? 'close' : 'open';
        });
    });
})();
