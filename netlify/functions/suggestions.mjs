// POST /api/suggestions -> anyone can send a suggestion (small form on the site)
// GET  /api/suggestions -> admins read them; POST {delete:id} -> admin removes one
import { createHash } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { adminUser, json, fail, nyNow, clip } from '../lib/desk.mjs';

const store = () => getStore({ name: 'suggestions', consistency: 'strong' });
const limits = () => getStore({ name: 'limits', consistency: 'strong' });

export default async (req, context) => {
  const s = store();

  if (req.method === 'GET') {
    if (!(await adminUser())) return fail('Nisi prijavljen kao admin.', 401);
    const { blobs } = await s.list();
    const items = (await Promise.all(blobs.map((b) => s.get(b.key, { type: 'json' })))).filter(Boolean);
    items.sort((a, b) => (a.at < b.at ? 1 : -1));
    return json({ suggestions: items });
  }
  if (req.method !== 'POST') return fail('Method not allowed', 405);

  let d;
  try { d = await req.json(); } catch { return fail('Bad request.'); }

  if (d.delete) {
    if (!(await adminUser())) return fail('Nisi prijavljen kao admin.', 401);
    await s.delete(String(d.delete));
    return json({ ok: true });
  }

  if (d.website) return json({ ok: true }); // hidden field filled in = a bot; pretend it worked
  const text = clip(d.text, 1000);
  if (text.length < 3) return fail('Write a little more.');

  // at most 5 suggestions per hour from one address
  const ip = (context && context.ip) || req.headers.get('x-nf-client-connection-ip') || 'unknown';
  const key = createHash('sha256').update(ip + new Date().toISOString().slice(0, 13)).digest('hex').slice(0, 24);
  const l = limits();
  const n = Number((await l.get(key)) || 0);
  if (n >= 5) return fail('Too many messages. Try again later.', 429);
  await l.set(key, String(n + 1));

  const at = new Date().toISOString();
  const id = 's-' + at.replace(/\D/g, '').slice(0, 14) + '-' + Math.random().toString(16).slice(2, 8);
  await s.setJSON(id, { id, at, t: nyNow(), text, name: clip(d.name, 60), contact: clip(d.contact, 100) });
  return json({ ok: true });
};

export const config = { path: '/api/suggestions' };
