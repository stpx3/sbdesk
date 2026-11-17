// GET /n/<id> -> a page for one note with its own share preview (X, WhatsApp, ...),
// which sends people straight on to the note on the Desk.
import { notesStore, nyNow, minutesBetween, LOCK_HOURS, TFS } from '../lib/desk.mjs';

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SITE = 'https://sbdesk.com';

export default async (req) => {
  const id = decodeURIComponent(new URL(req.url).pathname.split('/')[2] || '');
  if (!/^[0-9a-f-]{6,40}$/.test(id)) return Response.redirect(SITE + '/', 302);
  const n = await notesStore().get(id, { type: 'json' });
  if (!n) return Response.redirect(SITE + '/', 302);

  const age = minutesBetween(n.t, nyNow());
  const open = age >= LOCK_HOURS * 60;
  const tfs = TFS.filter((x) => n.ideas && n.ideas[x]);
  let title, desc, image = SITE + '/img/og.png';
  if (open) {
    title = `${n.title} · SB Desk`;
    desc = String(n.body || '').replace(/\s+/g, ' ').slice(0, 180);
    const tf = tfs[tfs.length - 1];
    const m = tf && /tradingview\.com\/x\/([A-Za-z0-9]+)/.exec(n.ideas[tf]);
    if (m) image = `https://s3.tradingview.com/snapshots/${m[1].charAt(0).toLowerCase()}/${m[1]}.png`;
  } else {
    const h = Math.max(1, Math.round((LOCK_HOURS * 60 - age) / 60));
    title = `New NQ note (${tfs.join(' · ')}) · SB Desk`;
    desc = `Public in about ${h} h. Traders who bought their challenge through our Candor code see it now, free.`;
  }
  const target = `${SITE}/#note/${id}`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="article"><meta property="og:site_name" content="SB Desk">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}/n/${id}"><meta property="og:image" content="${esc(image)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${esc(image)}">
<link rel="canonical" href="${SITE}/n/${id}">
<meta http-equiv="refresh" content="0;url=${target}">
</head><body style="background:#050505;color:#ece6d6;font-family:Georgia,serif">
<p><a style="color:#ffb000" href="${target}">Open the note on SB Desk</a></p>
<script>location.replace(${JSON.stringify(target)});</script>
</body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
};

export const config = { path: '/n/*' };
