// Shared helpers for the SB Desk functions.
import { getUser } from '@netlify/identity';
import { getStore } from '@netlify/blobs';

export const TFS = ['5m', '15m', '1H', '4H'];
export const KINDS = ['Pre-market', 'NY open', 'Session', 'Close', 'Weekly review'];

// Admins come from the Netlify environment variable ADMINS, not from the code
// (the repo can be public). Format: "email:Name,email:Name".
export function admins() {
  const map = {};
  String(process.env.ADMINS || '').split(',').forEach((pair) => {
    const i = pair.indexOf(':');
    if (i < 1) return;
    map[pair.slice(0, i).trim().toLowerCase()] = pair.slice(i + 1).trim();
  });
  return map;
}

// Returns {email, name} for a logged-in admin, otherwise null.
export async function adminUser() {
  const v = await viewer();
  return v && v.admin ? { email: v.email, name: v.name } : null;
}

export const notesStore = () => getStore({ name: 'notes', consistency: 'strong' });
export const membersStore = () => getStore({ name: 'members', consistency: 'strong' });
export const requestsStore = () => getStore({ name: 'access-requests', consistency: 'strong' });

// New notes are for members (people who bought through the Candor code) for this many hours.
export const LOCK_HOURS = 24;

// Who is looking: { email, name, admin, member } or null for a visitor without an account.
export async function viewer() {
  let user = null;
  try { user = await getUser(); } catch { user = null; }
  if (!user || !user.email) return null;
  const email = String(user.email).toLowerCase();
  const name = admins()[email];
  if (name) return { email, name, admin: true, member: true };
  const m = await membersStore().get(email, { type: 'json' });
  return { email, name: null, admin: false, member: !!(m && m.active) };
}

// minutes between two New York wall-clock times "YYYY-MM-DDTHH:MM"
export const minutesBetween = (a, b) => Math.round((Date.parse(b + ':00Z') - Date.parse(a + ':00Z')) / 60000);

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
export const fail = (msg, status = 400) => json({ error: msg }, status);

// New York wall-clock time as "YYYY-MM-DDTHH:MM" (the desk works in ET).
export function nyNow() {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date()).map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
export const isTime = (t) => typeof t === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(t);

// Only TradingView chart images and published TradingView ideas are accepted.
export function cleanLink(u) {
  u = String(u || '').trim();
  let m = /^https:\/\/www\.tradingview\.com\/x\/([A-Za-z0-9]+)\/?$/.exec(u);
  if (m) return `https://www.tradingview.com/x/${m[1]}/`;
  m = /^https?:\/\/([a-z]+\.)?tradingview\.com\/chart\/[^\s"'<>\/]+\/[A-Za-z0-9]+[^\s"'<>]*$/.exec(u);
  if (m) return u;
  return null;
}
export const clip = (s, n) => String(s == null ? '' : s).trim().slice(0, n);
