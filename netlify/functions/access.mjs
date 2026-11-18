// Access for people who bought a challenge through the Candor code.
// POST /api/access {firm, order}           -> a logged-in visitor asks for access
// GET  /api/access                         -> admins: pending requests and members
// POST /api/access {approve|reject|revoke: email} -> admins decide
import { viewer, adminUser, membersStore, requestsStore, json, fail, nyNow, clip } from '../lib/desk.mjs';

const listAll = async (store) => {
  const { blobs } = await store.list();
  return (await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })))).filter(Boolean);
};

// Email to the admins about a new request: one Netlify Forms submission
// (form "novi-zahtjev" in public/obavijest-forma.html); the email itself is a
// form notification set in Netlify. Never blocks the request if it fails.
const notifyAdmins = async (req, f) => {
  try {
    const origin = process.env.URL || new URL(req.url).origin;
    const body = new URLSearchParams({ 'form-name': 'novi-zahtjev', ...f, odobri: origin + '/admin.html' });
    await fetch(origin + '/obavijest-forma.html', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
  } catch (e) { console.log('notify failed', e && e.message); }
  // push to the admins' phones: ntfy app, subscribed to the topic in NTFY_TOPIC
  const topic = process.env.NTFY_TOPIC;
  if (topic) {
    try {
      const origin = process.env.URL || new URL(req.url).origin;
      await fetch('https://ntfy.sh/' + topic, { method: 'POST', body: `${f.email} · ${f.firma} · ${f.narudzba}`,
        headers: { Title: 'SB Desk: new early-access request', Click: origin + '/admin.html', Tags: 'bell' } });
    } catch (e) { console.log('ntfy failed', e && e.message); }
  }
};

export default async (req) => {
  const reqs = requestsStore(), mem = membersStore();

  if (req.method === 'GET') {
    if (!(await adminUser())) return fail('Nisi prijavljen kao admin.', 401);
    const requests = (await listAll(reqs)).sort((a, b) => (a.at < b.at ? 1 : -1));
    const members = (await listAll(mem)).sort((a, b) => (a.approvedAt < b.approvedAt ? 1 : -1));
    return json({ requests, members });
  }
  if (req.method !== 'POST') return fail('Method not allowed', 405);
  let d;
  try { d = await req.json(); } catch { return fail('Bad request.'); }

  if (d.approve || d.reject || d.revoke) {
    const who = await adminUser();
    if (!who) return fail('Nisi prijavljen kao admin.', 401);
    const email = String(d.approve || d.reject || d.revoke).toLowerCase();
    if (d.approve) {
      const r = (await reqs.get(email, { type: 'json' })) || { email };
      await mem.setJSON(email, { email, firm: r.firm || '', order: r.order || '', active: true, approvedAt: new Date().toISOString(), approvedBy: who.name });
      await reqs.delete(email);
    } else if (d.reject) {
      await reqs.delete(email);
    } else {
      await mem.delete(email);
    }
    return json({ ok: true });
  }

  // a visitor with an account asks for access
  const v = await viewer();
  if (!v) return fail('Log in first.', 401);
  if (v.member) return json({ ok: true, member: true });
  const firm = clip(d.firm, 60), order = clip(d.order, 80);
  if (!firm) return fail('Choose the firm.');
  if (order.length < 3) return fail('Enter your order number or the email you bought with.');
  const note = clip(d.note, 300), t = nyNow();
  await reqs.setJSON(v.email, { email: v.email, firm, order, note, at: new Date().toISOString(), t });
  await notifyAdmins(req, { email: v.email, firma: firm, narudzba: order, napomena: note, vrijeme: t.replace('T', ' ') + ' NY' });
  return json({ ok: true, pending: true });
};

export const config = { path: '/api/access' };
