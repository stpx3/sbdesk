// POST /api/after -> add or replace the "After" chart of a note (admins only).
// The note itself is never changed.
import { TFS, adminUser, notesStore, json, fail, nyNow, cleanLink, clip } from '../lib/desk.mjs';

export default async (req) => {
  if (req.method !== 'POST') return fail('Method not allowed', 405);
  const who = await adminUser();
  if (!who) return fail('Nisi prijavljen kao admin.', 401);
  let d;
  try { d = await req.json(); } catch { return fail('Neispravan zahtjev.'); }
  const store = notesStore();
  const note = d.id ? await store.get(String(d.id), { type: 'json' }) : null;
  if (!note) return fail('Ta analiza ne postoji.', 404);
  const link = cleanLink(d.link);
  if (!link) return fail('Link nije TradingView slika grafa.');
  if (!TFS.includes(d.tf)) return fail('Odaberi timeframe.');
  // an earlier After is never lost: it moves to nowHistory with the time it was replaced
  if (note.now) {
    note.nowHistory = Array.isArray(note.nowHistory) ? note.nowHistory : [];
    note.nowHistory.push({ ...note.now, replacedAt: new Date().toISOString() });
  }
  note.now = { t: nyNow(), tf: d.tf, link, body: clip(d.body, 300), by: who.name, postedAt: new Date().toISOString() };
  await store.setJSON(note.id, note);
  return json({ ok: true, note });
};

export const config = { path: '/api/after' };
