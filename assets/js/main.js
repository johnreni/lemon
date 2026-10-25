/* LEMON — small enhancements: mobile menu, package pre-select, contact form, footer year. */
(function () {
  'use strict';

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.querySelector('.contact-form');
  if (form) {
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');
    var buttonLabel = button.textContent;
    var serviceSelect = form.querySelector('select[name="service"]');
    var messageBox = form.querySelector('textarea[name="message"]');

    // Package buttons pre-fill the form.
    document.querySelectorAll('[data-package]').forEach(function (link) {
      link.addEventListener('click', function () {
        var pkg = link.getAttribute('data-package');
        if (pkg === 'Whole Lemon') serviceSelect.value = 'A bit of everything';
        if (!messageBox.value.trim()) messageBox.value = 'Hi LEMON, I’m interested in the ' + pkg + ' package.';
      });
    });

    var say = function (text, isError) {
      status.textContent = text;
      status.classList.toggle('is-error', !!isError);
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      if (data.get('_gotcha')) return; // spam bot

      var name = (data.get('name') || '').trim();
      var email = (data.get('email') || '').trim();
      if (!name) { say('Please add your name.', true); form.elements['name'].focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { say('Please add a valid email address.', true); form.elements['email'].focus(); return; }

      var endpoint = (form.getAttribute('action') || '').trim();

      // Option A: a form service URL is set (e.g. Formspree) — send in the background.
      if (/^https?:\/\//.test(endpoint)) {
        button.disabled = true;
        button.textContent = 'Sending…';
        say('');
        fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (res) {
            if (!res.ok) throw new Error('Request failed');
            form.reset();
            say('Thanks! Your message is in. We’ll be in touch with your free audit soon.');
          })
          .catch(function () {
            say('Sorry, that didn’t go through. Please email us directly instead.', true);
          })
          .then(function () {
            button.disabled = false;
            button.textContent = buttonLabel;
          });
        return;
      }

      // Option B: no form service — open the visitor's email app with everything filled in.
      var to = form.getAttribute('data-email') || '';
      var subject = 'Free audit request — ' + data.get('service');
      var body = 'Name: ' + name + '\nEmail: ' + email + '\nService: ' + data.get('service') + '\n\n' + (data.get('message') || '');
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      say('Opening your email app… If nothing happens, email us at ' + to + '.');
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();

/* LEMON — projects and advert banner, loaded from data/*.json (edited with Pages CMS). */
(function () {
  'use strict';

  var COLOURS = ['ink', 'zest', 'leaf'];
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }
  function clean(v) { return typeof v === 'string' ? v.trim() : ''; }
  // Only allow normal web links, email/phone links and on-page links.
  function safeLink(url) {
    url = clean(url);
    if (!url) return '';
    if (/^(https?:|mailto:|tel:|#)/i.test(url)) return url;
    if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(url)) return 'https://' + url; // "example.com" -> https://example.com
    return '';
  }
  function isExternal(url) { return /^https?:/i.test(url); }
  function colour(v) { return COLOURS.indexOf(v) > -1 ? v : 'ink'; }
  function load(path) {
    return fetch(path, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(path);
      return r.json();
    });
  }

  /* ---------- Projects ---------- */
  var grid = document.querySelector('[data-projects]');
  if (grid) {
    load('data/projects.json').then(function (data) {
      var items = (data && Array.isArray(data.projects) ? data.projects : []).filter(function (p) { return clean(p.title); });
      if (!items.length) return; // keep the built-in cards
      var nextCard = grid.querySelector('.project--next');
      grid.textContent = '';
      items.forEach(function (p) {
        var link = safeLink(p.link);
        var card = el(link ? 'a' : 'div', 'project');
        if (link) {
          card.href = link;
          if (isExternal(link)) { card.target = '_blank'; card.rel = 'noopener'; }
        }
        var media = el('div', 'project__media project__media--' + colour(p.colour));
        var img = clean(p.image);
        if (img) {
          var image = el('img');
          image.src = img;
          image.alt = clean(p.title) + ' — project preview';
          image.loading = 'lazy';
          media.appendChild(image);
        } else {
          media.appendChild(el('span', 'project__site', link && isExternal(link) ? link.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '') : clean(p.title)));
        }
        card.appendChild(media);
        if (clean(p.services)) card.appendChild(el('span', 'project__meta', clean(p.services)));
        var title = el('strong', null, clean(p.title));
        if (link && isExternal(link)) {
          title.appendChild(document.createTextNode(' '));
          var arrow = el('span', 'project__ext', '↗');
          arrow.setAttribute('aria-hidden', 'true');
          title.appendChild(arrow);
        }
        card.appendChild(title);
        grid.appendChild(card);
      });
      // Keep the "your project here" card while there are fewer than 3 projects.
      if (nextCard && items.length % 3 !== 0) grid.appendChild(nextCard);
    }).catch(function () { /* keep the built-in cards */ });
  }

  /* ---------- Advert banner ---------- */
  var slot = document.querySelector('[data-ads]');
  if (slot) {
    load('data/ads.json').then(function (data) {
      var ads = (data && Array.isArray(data.ads) ? data.ads : []).filter(function (a) {
        return a.show !== false && (clean(a.headline) || clean(a.image));
      });
      if (!ads.length) return;

      var slides = ads.map(function (a) {
        var link = safeLink(a.link);
        var img = clean(a.image);
        var slide;
        if (img) {
          slide = el(link ? 'a' : 'div', 'ad ad--image');
          var image = el('img');
          image.src = img;
          image.alt = clean(a.headline) || 'Advertisement';
          image.loading = 'lazy';
          slide.appendChild(image);
          if (clean(a.label)) slide.appendChild(el('span', 'ad__label ad__label--float', clean(a.label)));
        } else {
          slide = el(link ? 'a' : 'div', 'ad ad--' + colour(a.style));
          var copy = el('div', 'ad__copy');
          if (clean(a.label)) copy.appendChild(el('span', 'ad__label', clean(a.label)));
          copy.appendChild(el('strong', 'ad__headline', clean(a.headline)));
          if (clean(a.text)) copy.appendChild(el('span', 'ad__text', clean(a.text)));
          slide.appendChild(copy);
          if (link && clean(a.button_text)) slide.appendChild(el('span', 'ad__button', clean(a.button_text) + ' →'));
        }
        if (link) {
          slide.href = link;
          if (isExternal(link)) { slide.target = '_blank'; slide.rel = 'noopener sponsored'; }
        }
        return slide;
      });

      slides.forEach(function (s, i) { if (i) s.hidden = true; slot.appendChild(s); });
      slot.hidden = false;

      // Several adverts: show each for 7 seconds; pause while the visitor hovers or focuses the banner.
      if (slides.length > 1) {
        var dots = el('div', 'ad-dots');
        var current = 0, paused = false;
        var show = function (n) {
          slides[current].hidden = true; dots.children[current].setAttribute('aria-current', 'false');
          current = (n + slides.length) % slides.length;
          slides[current].hidden = false; dots.children[current].setAttribute('aria-current', 'true');
        };
        slides.forEach(function (_, i) {
          var b = el('button', 'ad-dot');
          b.type = 'button';
          b.setAttribute('aria-label', 'Show advert ' + (i + 1));
          b.setAttribute('aria-current', i === 0 ? 'true' : 'false');
          b.addEventListener('click', function () { show(i); });
          dots.appendChild(b);
        });
        slot.appendChild(dots);
        slot.addEventListener('mouseenter', function () { paused = true; });
        slot.addEventListener('mouseleave', function () { paused = false; });
        slot.addEventListener('focusin', function () { paused = true; });
        slot.addEventListener('focusout', function () { paused = false; });
        if (!reduceMotion) setInterval(function () { if (!paused && !document.hidden) show(current + 1); }, 7000);
      }
    }).catch(function () { /* no banner */ });
  }
})();
