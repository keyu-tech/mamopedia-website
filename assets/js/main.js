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
  // Pre-assign stagger index to children of .reveal-stagger (if not already inlined)
  $$('.reveal-stagger').forEach((parent) => {
    Array.from(parent.children).forEach((child, idx) => {
      if (!child.style.getPropertyValue('--i')) {
        child.style.setProperty('--i', idx);
      }
    });
  });
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

  /* --------- Scroll progress bar --------- */
  const progressEl = $('.scroll-progress');
  if (progressEl) {
    let ticking = false;
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progressEl.style.setProperty('--p', p);
      ticking = false;
    };
    on(window, 'scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    updateProgress();
  }

  /* --------- Stat counter animation --------- */
  const statEls = $$('.stat-counter');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animateStat = (el) => {
    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) {
      el.textContent = target.toLocaleString() + suffix;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && statEls.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach((el) => statObserver.observe(el));
  } else {
    statEls.forEach(animateStat);
  }

  /* --------- FAQ accordion smooth height (progressive enhancement) --------- */
  $$('.faq-item').forEach((item) => {
    on(item, 'toggle', () => {
      if (reduceMotion) return;
      const answer = item.querySelector('.faq-answer');
      if (!answer) return;
      if (item.open) {
        answer.style.maxHeight = '0px';
        answer.style.overflow = 'hidden';
        requestAnimationFrame(() => {
          answer.style.transition = 'max-height 0.3s ease';
          answer.style.maxHeight = answer.scrollHeight + 'px';
        });
        answer.addEventListener('transitionend', function clear() {
          answer.style.maxHeight = '';
          answer.style.overflow = '';
          answer.style.transition = '';
          answer.removeEventListener('transitionend', clear);
        });
      }
    });
  });

  /* --------- Chat preview auto-cycle --------- */
  const chatStream = $('#chat-stream');
  if (chatStream && !reduceMotion) {
    const scripts = [
      [
        { role: 'user', text: 'ما هو قانون نيوتن الثاني؟', dir: 'rtl', lang: 'ar' },
        { role: 'ai', html: "Newton's second law: <strong>F = m &middot; a</strong>. The force on an object equals its mass times its acceleration. Want a quick quiz?" },
        { role: 'user', text: 'Yes, one question please.' },
        { role: 'ai', html: '<span class="typing-dots" aria-hidden="true"><span></span><span></span><span></span></span>' },
      ],
      [
        { role: 'user', text: 'چۆن فۆتۆسینتیسیس کار دەکات؟', dir: 'rtl', lang: 'ckb' },
        { role: 'ai', html: "Plants turn <strong>sunlight + CO₂ + water</strong> into glucose and oxygen. Let's walk through the chemical equation together." },
        { role: 'user', text: 'Show me the equation.' },
        { role: 'ai', html: '<span class="typing-dots" aria-hidden="true"><span></span><span></span><span></span></span>' },
      ],
      [
        { role: 'user', text: 'Help me solve: 2x + 5 = 17' },
        { role: 'ai', html: "Subtract 5: <strong>2x = 12</strong>. Divide by 2: <strong>x = 6</strong>. Want to try one on your own?" },
        { role: 'user', text: 'Yes, please!' },
        { role: 'ai', html: '<span class="typing-dots" aria-hidden="true"><span></span><span></span><span></span></span>' },
      ],
    ];
    let idx = 0;
    let paused = false;
    const render = () => {
      chatStream.innerHTML = '';
      scripts[idx].forEach((msg) => {
        const b = document.createElement('div');
        b.className = `chat-bubble ${msg.role}`;
        if (msg.dir) b.setAttribute('dir', msg.dir);
        if (msg.lang) b.setAttribute('lang', msg.lang);
        if (msg.html) b.innerHTML = msg.html;
        else b.textContent = msg.text;
        chatStream.appendChild(b);
      });
    };
    on(chatStream.parentElement, 'mouseenter', () => { paused = true; });
    on(chatStream.parentElement, 'mouseleave', () => { paused = false; });
    on(chatStream.parentElement, 'focusin', () => { paused = true; });
    on(chatStream.parentElement, 'focusout', () => { paused = false; });
    setInterval(() => {
      if (paused) return;
      idx = (idx + 1) % scripts.length;
      render();
    }, 5200);
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
  const setStatus = (text, kind) => {
    if (!status) return;
    const icon = kind === 'ok' ? 'check_circle' : kind === 'err' ? 'error' : 'progress_activity';
    status.className = 'form-status ' + (kind === 'ok' ? 'status-ok' : kind === 'err' ? 'status-err' : '');
    status.innerHTML = text
      ? `<span class="material-symbols-rounded" aria-hidden="true">${icon}</span><span>${text}</span>`
      : '';
  };
  if (form) {
    // Live validation affordance
    $$('#contact-form .field-input').forEach((input) => {
      on(input, 'blur', () => {
        const parent = input.closest('.field');
        if (!parent) return;
        if (input.value && input.checkValidity()) {
          parent.classList.add('field-state-ok');
          parent.classList.remove('field-state-err');
        } else if (!input.checkValidity() && input.value) {
          parent.classList.add('field-state-err');
          parent.classList.remove('field-state-ok');
        } else {
          parent.classList.remove('field-state-ok', 'field-state-err');
        }
      });
    });
    on(form, 'submit', async (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        const invalid = form.querySelector(':invalid');
        if (invalid) {
          invalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          invalid.focus({ preventScroll: true });
        }
        form.reportValidity();
        return;
      }
      e.preventDefault();
      setStatus('Sending your message...', 'pending');
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
          $$('#contact-form .field').forEach((f) => f.classList.remove('field-state-ok', 'field-state-err'));
          setStatus('Thanks! Your message has been sent.', 'ok');
        } else {
          throw new Error(text || 'Unknown error');
        }
      } catch (err) {
        setStatus('Sorry, something went wrong. Please email info@keyu.tech.', 'err');
      }
    });
  }

  /* --------- Message character counter --------- */
  const msgField = $('#message');
  const msgCounter = $('#message-counter');
  if (msgField && msgCounter) {
    const max = parseInt(msgField.getAttribute('maxlength') || '1000', 10);
    const update = () => {
      const len = msgField.value.length;
      msgCounter.textContent = `${len} / ${max}`;
      msgCounter.classList.toggle('near', len > max * 0.9);
    };
    on(msgField, 'input', update);
    update();
  }

  /* --------- Newsletter (honest disclaimer, no backend wired) --------- */
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
      newsletterStatus.textContent = "Thanks - we've noted your interest and will email you when subscriptions open.";
    }
  });
})();
