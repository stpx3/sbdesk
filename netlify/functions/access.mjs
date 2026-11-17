// Access for people who bought a challenge through the Candor code.
// POST /api/access {firm, order}           -> a logged-in visitor asks for access
// GET  /api/access                         -> admins: pending requests and members
// POST /api/access {approve|reject|revoke: email} -> admins decide
import { viewer, adminUser, membersStore, requestsStore, json, fail, nyNow, clip } from '../lib/desk.mjs';

const listAll = async (store) => {
  const { blobs } = await store.list();
  return (await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })))).filter(Boolean);
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
  if (order.length < 3) return fail('Enter your order number.');
  await reqs.setJSON(v.email, { email: v.email, firm, order, note: clip(d.note, 300), at: new Date().toISOString(), t: nyNow() });
  return json({ ok: true, pending: true });
};

export const config = { path: '/api/access' };
