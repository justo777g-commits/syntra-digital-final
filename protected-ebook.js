/* ═══════════════════════════════════════════════════════════════
   js/protected-ebook.js
   Place this script as the FIRST script in ebook-iax.html
   It runs before anything renders and redirects if no session.
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const SESSION_KEY = 'syntra_ebook_session';
  const PORTAL_URL  = './portal-ebook.html';
  const PRODUCT     = 'ebook_iax';

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

  // Block render immediately if no valid session
  if (!isValid()) {
    // Store intended destination so portal can redirect back
    try {
      sessionStorage.setItem('syntra_redirect_after_login', window.location.href);
    } catch {}
    window.location.replace(PORTAL_URL);
  }
})();
