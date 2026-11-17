// GET  /api/notes  -> every note (public)
// POST /api/notes  -> publish a note (admins only)
import { TFS, KINDS, adminUser, viewer, notesStore, json, fail, nyNow, isTime, cleanLink, clip, LOCK_HOURS, minutesBetween } from '../lib/desk.mjs';

export default async (req) => {
  const store = notesStore();

  if (req.method === 'GET') {
    const { blobs } = await store.list();
    const notes = (await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })))).filter(Boolean);
    notes.sort((a, b) => (a.t < b.t ? -1 : a.t > b.t ? 1 : 0));
    const v = await viewer();
    const full = !!(v && v.member);
    const now = nyNow();
    const out = notes.map((n) => {
      const age = minutesBetween(n.t, now);
      if (full || age >= LOCK_HOURS * 60) {
        const { postedBy, ...pub } = n; // never send admin emails to the page
        return pub;
      }
      // locked for visitors: they see that a note exists, when, which timeframes, and when it opens
      return {
        id: n.id, t: n.t, sym: n.sym, kind: n.kind, tf: n.tf, by: n.by, locked: true,
        tfs: TFS.filter((x) => n.ideas && n.ideas[x]),
        opensIn: LOCK_HOURS * 60 - age,
      };
    });
    return json({ notes: out, member: full, lockHours: LOCK_HOURS });
  }

  if (req.method !== 'POST') return fail('Method not allowed', 405);
  const who = await adminUser();
  if (!who) return fail('Nisi prijavljen kao admin.', 401);

  let d;
  try { d = await req.json(); } catch { return fail('Neispravan zahtjev.'); }

  const ideas = {};
  for (const tf of TFS) {
    if (d.ideas && d.ideas[tf]) {
      const l = cleanLink(d.ideas[tf]);
      if (!l) return fail(`Link za ${tf} nije TradingView slika grafa.`);
      ideas[tf] = l;
    }
  }
  if (!Object.keys(ideas).length) return fail('Zalijepi barem jedan graf.');
  const title = clip(d.title, 140), body = clip(d.body, 5000);
  if (!title) return fail('Upiši naslov.');
  if (!body) return fail('Napiši tekst.');
  const kind = KINDS.includes(d.kind) ? d.kind : 'Session';

  // Moving old notes from a browser keeps their original time; new notes get the server's time.
  const imported = d.import === true && isTime(d.t);
  const t = imported ? d.t : nyNow();
  const id = t.replace(/\D/g, '') + '-' + Math.random().toString(16).slice(2, 8);
  const have = TFS.filter((x) => ideas[x]);
  const note = {
    id, t, sym: 'NQ', kind, tf: have[have.length - 1], title, body, ideas,
    by: imported && d.by ? clip(d.by, 60) : who.name,
    postedBy: who.email, postedAt: new Date().toISOString(),
  };
  if (imported && d.now) {
    const l = cleanLink(d.now.link);
    if (l && TFS.includes(d.now.tf) && isTime(d.now.t)) note.now = { t: d.now.t, tf: d.now.tf, link: l, body: clip(d.now.body, 300) };
  }
  await store.setJSON(id, note);
  return json({ ok: true, note });
};

export const config = { path: '/api/notes' };
