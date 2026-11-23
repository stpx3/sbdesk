// Browser login helper for SB Desk admin pages. Built into public/js/auth.js.
import {
  getUser, login, logout, signup, oauthLogin, handleAuthCallback, acceptInvite,
  requestPasswordRecovery, recoverPassword, refreshSession, updateUser,
} from '@netlify/identity';

// A login token lasts one hour. Renew it (with the refresh token) before asking
// the server who we are; otherwise a returning user looks logged out.
async function fresh() {
  try {
    const u = await getUser();
    if (!u) return null;
    await refreshSession();
    return u;
  } catch { return null; }
}

async function me() {
  await fresh();
  try {
    const r = await fetch('/api/me', { credentials: 'same-origin', cache: 'no-store' });
    return r.ok ? await r.json() : { admin: false };
  } catch { return { admin: false }; }
}

function toLogin() {
  const here = location.pathname.replace(/^\//, '') + location.search + location.hash;
  location.replace('login.html?next=' + encodeURIComponent(here || 'admin.html'));
}

// Admin pages call this first. Not logged in -> login page.
async function requireAdmin() {
  let u = null;
  try { u = await getUser(); } catch { u = null; }
  if (!u) { toLogin(); return null; }
  const m = await me();
  if (!m.admin) { toLogin(); return null; }
  return m;
}

// POST JSON to our API with a fresh login token.
async function post(path, data) {
  try { await refreshSession(); } catch { /* token still valid */ }
  const r = await fetch(path, {
    method: 'POST', credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  let out = {};
  try { out = await r.json(); } catch { out = {}; }
  if (!r.ok) throw new Error(out.error || 'Greška ' + r.status + '. Pokušaj ponovno.');
  return out;
}

async function notes() {
  const r = await fetch('/api/notes', { cache: 'no-store' });
  if (!r.ok) throw new Error('Ne mogu učitati objave.');
  return (await r.json()).notes || [];
}

async function signOut(to) {
  try { await logout(); } catch { /* cookies are cleared anyway */ }
  location.href = to || 'index.html';
}

window.SBAuth = {
  getUser, login, signup, oauthLogin, handleAuthCallback, acceptInvite, requestPasswordRecovery, recoverPassword, updateUser,
  me, fresh, requireAdmin, post, notes, signOut,
};
