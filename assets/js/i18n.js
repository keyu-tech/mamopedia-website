/* =====================================================================
   Mamopedia - i18n.js
   Tiny i18n runtime: loads /assets/i18n/<code>.json, swaps marked text
   and attributes, flips <html dir lang>, and notifies subscribers.

   Annotations on HTML elements:
     data-i18n="some.key"          -> sets textContent
     data-i18n-html="some.key"     -> sets innerHTML (use sparingly)
     data-i18n-attr="attr:key,..." -> sets attributes (e.g. placeholder, content, aria-label, alt)

   API on window.MPI18n:
     code                           -> current language code
     dict                           -> current dictionary (raw)
     t(key, fallback?)              -> get string by dotted path
     setLang(code)                  -> switch language
     onChange(fn)                   -> subscribe to language changes
     supported                      -> array of language metadata
   ===================================================================== */

(() => {
  'use strict';

  const STORAGE_KEY = 'mp-lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED = [
    { code: 'en',  name: 'English',          nativeName: 'English',  dir: 'ltr', htmlLang: 'en'  },
    { code: 'ar',  name: 'Arabic',           nativeName: 'العربية',  dir: 'rtl', htmlLang: 'ar'  },
    { code: 'ckb', name: 'Kurdish (Sorani)', nativeName: 'کوردی',     dir: 'rtl', htmlLang: 'ckb' },
  ];

  const dicts = Object.create(null);
  const listeners = new Set();
  let current = DEFAULT_LANG;

  /* --- Detect a sensible initial language without reading localStorage twice --- */
  const detectInitial = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.some((l) => l.code === saved)) return saved;
    } catch (e) { /* storage blocked */ }
    const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (nav.startsWith('ckb') || nav.startsWith('ku')) return 'ckb';
    if (nav.startsWith('ar')) return 'ar';
    return DEFAULT_LANG;
  };

  /* --- Nested key lookup: "a.b.c" --- */
  const lookup = (obj, key) => {
    if (!obj || !key) return undefined;
    const parts = key.split('.');
    let node = obj;
    for (let i = 0; i < parts.length; i++) {
      if (node == null || typeof node !== 'object') return undefined;
      node = node[parts[i]];
    }
    return node;
  };

  const t = (key, fallback) => {
    const v = lookup(dicts[current], key);
    if (typeof v === 'string') return v;
    if (fallback !== undefined) return fallback;
    // Fall back to English so the page never shows raw keys.
    const en = lookup(dicts.en, key);
    return typeof en === 'string' ? en : '';
  };

  /* --- Apply current dictionary to the DOM --- */
  const applyDom = (root) => {
    const scope = root || document;

    scope.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const v = t(key);
      if (v) el.textContent = v;
    });

    scope.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      const v = t(key);
      if (v) el.innerHTML = v;
    });

    scope.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const spec = el.getAttribute('data-i18n-attr');
      if (!spec) return;
      spec.split(',').forEach((pair) => {
        const idx = pair.indexOf(':');
        if (idx <= 0) return;
        const attr = pair.slice(0, idx).trim();
        const key = pair.slice(idx + 1).trim();
        const v = t(key);
        if (v) el.setAttribute(attr, v);
      });
    });
  };

  /* --- Update <html dir lang>, <title>, and primary meta description --- */
  const applyDocAttrs = () => {
    const meta = SUPPORTED.find((l) => l.code === current) || SUPPORTED[0];
    document.documentElement.setAttribute('lang', meta.htmlLang);
    document.documentElement.setAttribute('dir', meta.dir);
    document.documentElement.setAttribute('data-lang', meta.code);
  };

  /* --- Fetch a dictionary file once --- */
  const loadDict = async (code) => {
    if (dicts[code]) return dicts[code];
    const res = await fetch(`assets/i18n/${code}.json`, { credentials: 'same-origin' });
    if (!res.ok) throw new Error(`Failed to load ${code}.json (${res.status})`);
    const data = await res.json();
    dicts[code] = data;
    return data;
  };

  const setLang = async (code) => {
    if (!SUPPORTED.some((l) => l.code === code)) return;
    try {
      // Always make sure English is available as a fallback dictionary.
      if (!dicts.en && code !== 'en') await loadDict('en');
      await loadDict(code);
    } catch (e) {
      // If loading the chosen dict fails, stay on English silently.
      if (!dicts.en) return;
      code = 'en';
    }
    current = code;
    try { localStorage.setItem(STORAGE_KEY, code); } catch (e) { /* storage blocked */ }
    applyDocAttrs();
    applyDom();
    listeners.forEach((fn) => { try { fn(code); } catch (e) { /* listener error */ } });
  };

  const onChange = (fn) => {
    if (typeof fn === 'function') listeners.add(fn);
    return () => listeners.delete(fn);
  };

  /* --- Pre-paint helper (called from inline <head> script before this file loads) ---
     The inline script sets <html dir/lang> from localStorage so the page paints
     in the correct direction without a visible flash. We just respect that here. */
  const preLang = document.documentElement.getAttribute('data-lang');
  if (preLang && SUPPORTED.some((l) => l.code === preLang)) current = preLang;
  else current = detectInitial();

  window.MPI18n = {
    get code() { return current; },
    get dict() { return dicts[current]; },
    t,
    setLang,
    onChange,
    supported: SUPPORTED.slice(),
    applyDom,
  };

  // Kick off initial load + apply.
  setLang(current);
})();
