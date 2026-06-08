/* ═══════════════════════════════════════════════════════════════
   js/protected-biblioteca.js
   Place this script as the FIRST script in biblioteca-estrategica-iax.html
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const SESSION_KEY = 'syntra_bib_session';
  const PORTAL_URL  = './portal-biblioteca.html';
  const PRODUCT     = 'biblioteca_iax';

  function isValid() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return false;
      const s = JSON.parse(raw);
      if (s.product !== PRODUCT) return false;
      if (Date.now() > s.expiresAt) {
        localStorage.removeItem(SESSION_KEY);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  if (!isValid()) {
    try {
      sessionStorage.setItem('syntra_redirect_after_login', window.location.href);
    } catch {}
    window.location.replace(PORTAL_URL);
  }
})();
