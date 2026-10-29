/* LEMON — site behaviour: mobile menu, contact form (WhatsApp or email), in-page links,
   and the projects / clients / advert sections loaded from data/*.json (edited with Pages CMS). */
(function () {
  'use strict';

  var html = document.documentElement;
  var FR = (html.lang || '').toLowerCase().indexOf('fr') === 0;
  var ROOT = html.getAttribute('data-root') || ''; // '' on the English page, '../' on /fr/
  var WHATSAPP = '237656433069';
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var T = FR ? {
    needName: 'Merci d’indiquer votre nom.',
    needEmail: 'Merci d’indiquer une adresse e-mail valide.',
    sending: 'Envoi…',
    sent: 'Merci ! Votre message est bien arrivé. Nous revenons vers vous très vite avec votre audit gratuit.',
    failed: 'Désolé, l’envoi n’a pas fonctionné. Écrivez-nous directement par e-mail ou WhatsApp.',
    openingMail: 'Ouverture de votre messagerie… Si rien ne se passe, écrivez-nous à ',
    openingWa: 'Ouverture de WhatsApp… Si rien ne se passe, écrivez-nous au +237 656 433 069.',
    subject: 'Demande d’audit gratuit — ',
    lines: ['Nom', 'E-mail', 'Besoin'],
    hello: 'Bonjour LEMON,',
    pkg: function (p) { return 'Bonjour LEMON, je suis intéressé(e) par l’offre ' + p + '.'; },
    preview: ' — aperçu du projet',
    showAd: 'Afficher l’annonce ',
    ad: 'Publicité'
  } : {
    needName: 'Please add your name.',
    needEmail: 'Please add a valid email address.',
    sending: 'Sending…',
    sent: 'Thanks! Your message is in. We’ll be in touch with your free audit soon.',
    failed: 'Sorry, that didn’t go through. Please email or WhatsApp us directly instead.',
    openingMail: 'Opening your email app… If nothing happens, email us at ',
    openingWa: 'Opening WhatsApp… If nothing happens, message us on +237 656 433 069.',
    subject: 'Free audit request — ',
    lines: ['Name', 'Email', 'Need'],
    hello: 'Hi LEMON,',
    pkg: function (p) { return 'Hi LEMON, I’m interested in the ' + p + ' package.'; },
    preview: ' — project preview',
    showAd: 'Show advert ',
    ad: 'Advertisement'
  };

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
    var serviceSelect = form.querySelector('select[name="service"]');
    var messageBox = form.querySelector('textarea[name="message"]');

    // Package buttons pre-fill the form.
    document.querySelectorAll('[data-package]').forEach(function (link) {
      link.addEventListener('click', function () {
        var pkg = link.getAttribute('data-package');
        if (pkg === 'Whole Lemon') serviceSelect.selectedIndex = serviceSelect.options.length - 1;
        if (!messageBox.value.trim()) messageBox.value = T.pkg(pkg);
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

      var via = (e.submitter && e.submitter.value) || 'email';
      var name = (data.get('name') || '').trim();
      var email = (data.get('email') || '').trim();
      var service = data.get('service') || '';
      var message = (data.get('message') || '').trim();
      if (!name) { say(T.needName, true); form.elements['name'].focus(); return; }
      // Email address is optional for WhatsApp (they reply on WhatsApp), required for email.
      if (via !== 'whatsapp' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { say(T.needEmail, true); form.elements['email'].focus(); return; }

      var summary = T.lines[0] + ': ' + name + '\n' + (email ? T.lines[1] + ': ' + email + '\n' : '') + T.lines[2] + ': ' + service + (message ? '\n\n' + message : '');

      // WhatsApp: open a chat with the message already written.
      if (via === 'whatsapp') {
        window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(T.hello + '\n\n' + summary), '_blank', 'noopener');
        say(T.openingWa);
        return;
      }

      // Email, option A: a form service URL is set in action="" (e.g. Formspree) — send in the background.
      var endpoint = (form.getAttribute('action') || '').trim();
      if (/^https?:\/\//.test(endpoint)) {
        var button = e.submitter;
        var label = button ? button.textContent : '';
        if (button) { button.disabled = true; button.textContent = T.sending; }
        data.delete('via');
        say('');
        fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (res) {
            if (!res.ok) throw new Error('Request failed');
            form.reset();
            say(T.sent);
          })
          .catch(function () { say(T.failed, true); })
          .then(function () { if (button) { button.disabled = false; button.textContent = label; } });
        return;
      }

      // Email, option B: open the visitor's email app with everything filled in.
      var to = form.getAttribute('data-email') || '';
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(T.subject + service) + '&body=' + encodeURIComponent(summary);
      say(T.openingMail + to + '.');
    });
  }

  /* ---------- In-page links: scroll without adding "#section" to the web address ---------- */
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    var target = id ? document.getElementById(id) : null;
    if (id && !target) return;
    e.preventDefault();
    if (!target || id === 'top') {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    // Move keyboard focus to the section too, for screen-reader and keyboard users.
    var focusEl = target || document.getElementById('main');
    if (focusEl) {
      if (!focusEl.hasAttribute('tabindex')) focusEl.setAttribute('tabindex', '-1');
      focusEl.focus({ preventScroll: true });
    }
    if (window.history && history.replaceState) history.replaceState(null, '', location.pathname + location.search);
  });
  // Old links that still end in "#something": tidy the address after arriving.
  if (location.hash && window.history && history.replaceState) {
    var tidy = function () { setTimeout(function () { history.replaceState(null, '', location.pathname + location.search); }, 300); };
    if (document.readyState === 'complete') tidy(); else window.addEventListener('load', tidy);
  }

  /* ---------- Header: hairline appears once the page scrolls ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Scroll-in animation: sections fade and rise gently as they appear ---------- */
  var REVEAL = '.section-head, .process .h2, .service-card, .steps li, .project, .client, .ad-slot .ad:not([hidden]), .package, .about__card, .contact__card';
  var observer = null;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var node = entry.target;
        node.classList.add('is-visible');
        observer.unobserve(node);
        // After it has appeared, drop the stagger delay so hover effects respond instantly.
        setTimeout(function () { node.style.removeProperty('--d'); }, 1400);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  }
  function revealIn(root) {
    if (!observer) return;
    var items = root.matches && root.matches(REVEAL) ? [root] : [].slice.call(root.querySelectorAll(REVEAL));
    items.forEach(function (node) {
      if (node.classList.contains('reveal')) return;
      // Stagger cards that sit side by side in the same grid.
      var siblings = node.parentElement ? [].slice.call(node.parentElement.children) : [];
      var index = Math.max(0, siblings.indexOf(node));
      node.style.setProperty('--d', (Math.min(index, 5) * 0.08) + 's');
      node.classList.add('reveal');
      observer.observe(node);
    });
  }
  revealIn(document);

  /* ---------- Menu: highlight the section currently on screen ---------- */
  if (nav && 'IntersectionObserver' in window) {
    var links = {};
    [].slice.call(nav.querySelectorAll('a[href^="#"]')).forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
          link.setAttribute('aria-current', 'true');
        } else if (link.getAttribute('aria-current') === 'true') {
          link.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) { var sec = document.getElementById(id); if (sec) spy.observe(sec); });
  }

  /* ---------- Footer year ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* =====================================================================
     Content from data/*.json (edited with Pages CMS)
     ===================================================================== */
  var COLOURS = ['ink', 'zest', 'leaf'];

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }
  function clean(v) { return typeof v === 'string' ? v.trim() : ''; }
  // French page: use the "_fr" version of a field when it has been filled in.
  function pick(item, key) { return (FR && clean(item[key + '_fr'])) || clean(item[key]); }
  // Only allow normal web links, email/phone links and on-page links.
  function safeLink(url) {
    url = clean(url);
    if (!url) return '';
    if (/^(https?:|mailto:|tel:|#)/i.test(url)) return url;
    if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(url)) return 'https://' + url; // "example.com" -> https://example.com
    return '';
  }
  // Pictures uploaded in the editor are saved as "assets/uploads/…"; adjust for the /fr/ page.
  function asset(src) {
    src = clean(src);
    if (!src || /^(https?:|data:|\/)/i.test(src)) return src;
    return ROOT + src;
  }
  function isExternal(url) { return /^https?:/i.test(url); }
  function colour(v) { return COLOURS.indexOf(v) > -1 ? v : 'ink'; }
  function load(path) {
    return fetch(ROOT + path, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(path);
      return r.json();
    });
  }
  function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
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
        var img = asset(p.image);
        if (img) {
          var image = el('img');
          image.src = img;
          image.alt = clean(p.title) + T.preview;
          image.loading = 'lazy';
          image.decoding = 'async';
          media.appendChild(image);
        } else {
          media.appendChild(el('span', 'project__site', link && isExternal(link) ? link.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '') : clean(p.title)));
        }
        card.appendChild(media);
        if (pick(p, 'services')) card.appendChild(el('span', 'project__meta', pick(p, 'services')));
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
      // Keep the "your project here" card while the last row isn't full.
      if (nextCard && items.length % 3 !== 0) grid.appendChild(nextCard);
      revealIn(grid);
    }).catch(function () { /* keep the built-in cards */ });
  }

  /* ---------- Clients ---------- */
  var clientGrid = document.querySelector('[data-testimonials]');
  if (clientGrid) {
    load('data/testimonials.json').then(function (data) {
      var items = (data && Array.isArray(data.testimonials) ? data.testimonials : []).filter(function (t) {
        return clean(t.name) && t.show !== false;
      });
      if (!items.length) return; // keep the built-in cards
      clientGrid.textContent = '';
      items.forEach(function (t) {
        var card = el('figure', 'client');
        var quote = pick(t, 'quote');
        if (quote) card.appendChild(el('blockquote', null, quote));
        var cap = el('figcaption');
        var avatar = el('span', 'client__avatar');
        avatar.setAttribute('aria-hidden', 'true');
        var photo = asset(t.photo);
        if (photo) {
          var img = el('img');
          img.src = photo;
          img.alt = '';
          img.loading = 'lazy';
          avatar.appendChild(img);
        } else {
          avatar.textContent = initials(clean(t.name));
        }
        cap.appendChild(avatar);
        cap.appendChild(el('strong', 'client__name', clean(t.name)));
        var line = [pick(t, 'role'), pick(t, 'service')].filter(Boolean).join(' · ');
        if (line) cap.appendChild(el('span', 'client__service', line));
        card.appendChild(cap);
        clientGrid.appendChild(card);
      });
      revealIn(clientGrid);
    }).catch(function () { /* keep the built-in cards */ });
  }

  /* ---------- Advert banner ---------- */
  var slot = document.querySelector('[data-ads]');
  if (slot) {
    load('data/ads.json').then(function (data) {
      var ads = (data && Array.isArray(data.ads) ? data.ads : []).filter(function (a) {
        return a.show !== false && (pick(a, 'headline') || clean(a.image));
      });
      if (!ads.length) return;

      var slides = ads.map(function (a) {
        var link = safeLink(a.link);
        var img = asset((FR && clean(a.image_fr)) || a.image);
        var label = pick(a, 'label');
        var slide;
        if (img) {
          slide = el(link ? 'a' : 'div', 'ad ad--image');
          var image = el('img');
          image.src = img;
          image.alt = pick(a, 'headline') || T.ad;
          image.loading = 'lazy';
          image.decoding = 'async';
          slide.appendChild(image);
          if (label) slide.appendChild(el('span', 'ad__label ad__label--float', label));
        } else {
          slide = el(link ? 'a' : 'div', 'ad ad--' + colour(a.style));
          var copy = el('div', 'ad__copy');
          if (label) copy.appendChild(el('span', 'ad__label', label));
          copy.appendChild(el('strong', 'ad__headline', pick(a, 'headline')));
          if (pick(a, 'text')) copy.appendChild(el('span', 'ad__text', pick(a, 'text')));
          slide.appendChild(copy);
          if (link && pick(a, 'button_text')) slide.appendChild(el('span', 'ad__button', pick(a, 'button_text') + ' →'));
        }
        if (link) {
          slide.href = link;
          if (isExternal(link)) { slide.target = '_blank'; slide.rel = 'noopener sponsored'; }
        }
        return slide;
      });

      slides.forEach(function (s, i) { if (i) s.hidden = true; slot.appendChild(s); });
      slot.hidden = false;
      revealIn(slot);

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
          b.setAttribute('aria-label', T.showAd + (i + 1));
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
