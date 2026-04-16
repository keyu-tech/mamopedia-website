/* =====================================================================
   MamoPedia AI - main.js
   Vanilla JS for navigation, scroll effects, reveal, and form handling.
   ===================================================================== */

(() => {
  'use strict';

  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* --------- Current year in footer --------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* --------- Header scroll state --------- */
  const header = $('#header');
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  updateHeader();
  on(window, 'scroll', updateHeader, { passive: true });

  /* --------- Mobile menu --------- */
  const menuBtn = $('#mobile-menu-btn');
  const menu = $('#mobile-menu');
  const closeMenu = () => {
    if (!menu || !menuBtn) return;
    menu.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    const icon = menuBtn.querySelector('.material-symbols-rounded');
    if (icon) icon.textContent = 'menu';
  };
  const openMenu = () => {
    if (!menu || !menuBtn) return;
    menu.classList.remove('hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close menu');
    const icon = menuBtn.querySelector('.material-symbols-rounded');
    if (icon) icon.textContent = 'close';
  };

  on(menuBtn, 'click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  });

  // Close mobile menu when a link is clicked or viewport is resized
  $$('#mobile-menu a').forEach((a) => on(a, 'click', closeMenu));
  on(window, 'resize', () => {
    if (window.innerWidth >= 768) closeMenu();
  });
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* --------- Active nav link highlight --------- */
  const navLinks = $$('.nav-link');
  const sections = $$('main section[id]');
  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('bg-primary-container', isActive);
      link.classList.toggle('text-primary-onContainer', isActive);
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* --------- Scroll reveal --------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* --------- Back to top --------- */
  const backToTop = $('#back-to-top');
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 400);
    };
    toggleBackToTop();
    on(window, 'scroll', toggleBackToTop, { passive: true });
    on(backToTop, 'click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------- Contact form (progressive enhancement, AJAX) --------- */
  const form = $('#contact-form');
  const status = $('#form-status');
  on(form, 'submit', async (e) => {
    if (!form) return;
    // Native validation first
    if (!form.checkValidity()) {
      e.preventDefault();
      form.reportValidity();
      return;
    }
    e.preventDefault();
    if (status) {
      status.textContent = 'Sending your message...';
      status.className = 'text-sm text-surface-onVariant';
    }
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const ok = text.trim().toUpperCase() === 'OK' || res.ok;
      if (ok) {
        form.reset();
        if (status) {
          status.textContent = 'Thanks! Your message has been sent.';
          status.className = 'text-sm text-tertiary';
          status.style.color = '#51643F';
        }
      } else {
        throw new Error(text || 'Unknown error');
      }
    } catch (err) {
      if (status) {
        status.textContent = 'Sorry, something went wrong. Please email info@keyu.tech.';
        status.style.color = '#B3261E';
      }
    }
  });

  /* --------- Newsletter (local only, no backend wired) --------- */
  const newsletter = $('#newsletter-form');
  const newsletterStatus = $('#newsletter-status');
  on(newsletter, 'submit', (e) => {
    e.preventDefault();
    if (!newsletter.checkValidity()) {
      newsletter.reportValidity();
      return;
    }
    newsletter.reset();
    if (newsletterStatus) {
      newsletterStatus.textContent = 'Thanks for subscribing!';
    }
  });
})();
