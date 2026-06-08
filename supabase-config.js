/* ═══════════════════════════════════════════════════════════════
   js/supabase-config.js
   Syntra Digital — Supabase connection layer
   ✅ Supabase production values configured for syntra-auth
═══════════════════════════════════════════════════════════════ */

const SYNTRA_SUPABASE_URL  = 'https://diosggvbaxbgcondwvwv.supabase.co';
const SYNTRA_SUPABASE_ANON = 'sb_publishable_bAomhp5CIuy6MdjuMBUqSg_dfjfWygI';

/* ── Minimal REST helper (no SDK dependency) ─────────────────── */
const SupabaseClient = {
  async query(table, filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => params.set(k, `eq.${v}`));
    params.set('limit', '1');

    const res = await fetch(
      `${SYNTRA_SUPABASE_URL}/rest/v1/${table}?${params}`,
      {
        headers: {
          'apikey':        SYNTRA_SUPABASE_ANON,
          'Authorization': `Bearer ${SYNTRA_SUPABASE_ANON}`,
          'Content-Type':  'application/json',
        }
      }
    );
    if (!res.ok) throw new Error(`Supabase error ${res.status}`);
    return res.json();
  },

  async update(table, match, data) {
    const params = new URLSearchParams();
    Object.entries(match).forEach(([k, v]) => params.set(k, `eq.${v}`));

    const res = await fetch(
      `${SYNTRA_SUPABASE_URL}/rest/v1/${table}?${params}`,
      {
        method: 'PATCH',
        headers: {
          'apikey':        SYNTRA_SUPABASE_ANON,
          'Authorization': `Bearer ${SYNTRA_SUPABASE_ANON}`,
          'Content-Type':  'application/json',
          'Prefer':        'return=minimal',
        },
        body: JSON.stringify(data),
      }
    );
    return res.ok;
  }
};

/* ── Session keys ───────────────────────────────────────────── */
const SESSION_KEYS = {
  ebook:     'syntra_ebook_session',
  biblioteca: 'syntra_bib_session',
};

/* ── Auth core ──────────────────────────────────────────────── */
const SyntraAuth = {

  /**
   * Attempt login for a given product.
   * @param {string} product  'ebook_iax' | 'biblioteca_iax'
   * @param {string} matricula
   * @param {string} senha
   * @returns {{ ok: boolean, error?: string }}
   */
  async login(product, matricula, senha) {
    try {
      const rows = await SupabaseClient.query('access_credentials', {
        product,
        matricula: matricula.trim().toUpperCase(),
        active: 'true',
      });

      if (!rows || rows.length === 0) {
        return { ok: false, error: 'Credencial não encontrada ou inativa.' };
      }

      const credential = rows[0];

      // Constant-time-ish comparison
      if (credential.senha !== senha.trim()) {
        return { ok: false, error: 'Senha incorreta.' };
      }

      // Save session
      const sessionKey = product === 'ebook_iax'
        ? SESSION_KEYS.ebook
        : SESSION_KEYS.biblioteca;

      const session = {
        product,
        matricula: credential.matricula,
        grantedAt: Date.now(),
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
      };
      localStorage.setItem(sessionKey, JSON.stringify(session));

      // Update last_login_at (fire-and-forget)
      SupabaseClient.update(
        'access_credentials',
        { matricula: credential.matricula },
        { last_login_at: new Date().toISOString() }
      ).catch(() => {});

      return { ok: true };
    } catch (err) {
      console.error('[SyntraAuth]', err);
      return { ok: false, error: 'Erro de conexão. Tente novamente.' };
    }
  },

  /** Check active session for a product */
  hasSession(product) {
    const key = product === 'ebook_iax'
      ? SESSION_KEYS.ebook
      : SESSION_KEYS.biblioteca;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return false;
      const s = JSON.parse(raw);
      if (s.product !== product) return false;
      if (Date.now() > s.expiresAt) {
        localStorage.removeItem(key);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  /** Logout for a product */
  logout(product) {
    const key = product === 'ebook_iax'
      ? SESSION_KEYS.ebook
      : SESSION_KEYS.biblioteca;
    localStorage.removeItem(key);
  }
};

window.SyntraAuth = SyntraAuth;
