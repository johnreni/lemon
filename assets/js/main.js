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
