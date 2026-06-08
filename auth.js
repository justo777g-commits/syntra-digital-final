/* ═══════════════════════════════════════════════════════════════
   js/auth.js
   Shared login logic for both portals.
   Depends on: supabase-config.js (loaded first)
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const form        = document.getElementById('syntra-login-form');
  const inputMat    = document.getElementById('matricula');
  const inputPass   = document.getElementById('senha');
  const btnSubmit   = document.getElementById('btn-login');
  const msgError    = document.getElementById('msg-error');
  const msgSuccess  = document.getElementById('msg-success');
  const loadingEl   = document.getElementById('login-loading');

  if (!form) return;

  // Product is set as data attribute on <form data-product="ebook_iax">
  const PRODUCT     = form.dataset.product;
  const REDIRECT    = form.dataset.redirect; // e.g. "./ebook-iax.html"

  function setLoading(on) {
    btnSubmit.disabled = on;
    if (loadingEl) loadingEl.style.display = on ? 'flex' : 'none';
    btnSubmit.textContent = on ? 'Verificando...' : 'Acessar';
  }

  function showError(msg) {
    if (msgError) {
      msgError.textContent = msg;
      msgError.style.display = 'block';
    }
    if (msgSuccess) msgSuccess.style.display = 'none';
    // Shake animation
    form.classList.remove('shake');
    void form.offsetWidth;
    form.classList.add('shake');
  }

  function showSuccess(msg) {
    if (msgSuccess) {
      msgSuccess.textContent = msg;
      msgSuccess.style.display = 'block';
    }
    if (msgError) msgError.style.display = 'none';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const matricula = inputMat.value.trim();
    const senha     = inputPass.value.trim();

    if (!matricula || !senha) {
      showError('Preencha matrícula e senha.');
      return;
    }

    setLoading(true);
    if (msgError) msgError.style.display = 'none';

    const result = await SyntraAuth.login(PRODUCT, matricula, senha);

    setLoading(false);

    if (!result.ok) {
      showError(result.error || 'Credenciais inválidas.');
      return;
    }

    showSuccess('Acesso liberado! Redirecionando...');

    setTimeout(() => {
      // Check if there's a stored redirect destination
      let dest = REDIRECT;
      try {
        const stored = sessionStorage.getItem('syntra_redirect_after_login');
        if (stored) {
          sessionStorage.removeItem('syntra_redirect_after_login');
          dest = stored;
        }
      } catch {}
      window.location.href = dest;
    }, 900);
  });

  // Toggle password visibility
  const togglePass = document.getElementById('toggle-pass');
  if (togglePass) {
    togglePass.addEventListener('click', () => {
      const type = inputPass.type === 'password' ? 'text' : 'password';
      inputPass.type = type;
      togglePass.innerHTML = type === 'password'
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    });
  }
});
