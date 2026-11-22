// GET /n/<id> -> a real page for one note: readable by Google and by people,
// with its own share preview (X, WhatsApp, ...). Every note is public at once.
import { notesStore, TFS } from '../lib/desk.mjs';

const SITE = 'https://sbdesk.com';
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const snap = (u) => { const m = /tradingview\.com\/x\/([A-Za-z0-9]+)/.exec(u || ''); return m ? `https://s3.tradingview.com/snapshots/${m[1].charAt(0).toLowerCase()}/${m[1]}.png` : null; };
const day = (t) => new Date(t.slice(0, 10) + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
// New York wall time -> ISO with offset (EST/EDT) for structured data
function isoNY(t) {
  const guess = new Date(t + ':00Z');
  const ny = new Date(guess.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const off = Math.round((guess - ny) / 3600000);
  return t + ':00' + (off >= 0 ? '-' : '+') + String(Math.abs(off)).padStart(2, '0') + ':00';
}

function chart(tf, link) {
  const img = snap(link);
  const idea = /\/chart\/[^/]+\/([A-Za-z0-9]+)/.exec(link || '');
  if (!img && idea) return `<figure><figcaption><span class="tf tf-${tf}">${tf}</span><a href="${esc(link)}" rel="noopener" target="_blank">open on TradingView</a></figcaption><iframe src="https://s.tradingview.com/embed/${idea[1]}/" title="NQ ${tf} chart on TradingView" loading="lazy" style="width:100%;height:480px;border:0;display:block"></iframe></figure>`;
  if (img) return `<figure><figcaption><span class="tf tf-${tf}">${tf}</span><a href="${esc(link)}" rel="noopener" target="_blank">open on TradingView</a></figcaption><img src="${esc(img)}" alt="NQ ${tf} chart" width="1200" height="675" loading="lazy" decoding="async"></figure>`;
  return `<figure><figcaption><span class="tf tf-${tf}">${tf}</span><a href="${esc(link)}" rel="noopener" target="_blank">interactive chart on TradingView</a></figcaption></figure>`;
}

export default async (req) => {
  const id = decodeURIComponent(new URL(req.url).pathname.split('/')[2] || '');
  if (!/^[0-9a-f-]{6,40}$/.test(id)) return Response.redirect(SITE + '/', 302);
  const n = await notesStore().get(id, { type: 'json' });
  if (!n) return Response.redirect(SITE + '/', 302);

  const tfs = TFS.filter((x) => n.ideas && n.ideas[x]);
  const url = `${SITE}/n/${id}`;
  let title, desc, image = SITE + '/img/og.png', main, ld = '';

  {
    title = `${n.title} · NQ ${tfs.join(' · ')} · SB Desk`;
    desc = String(n.body || '').replace(/\s+/g, ' ').slice(0, 180);
    const last = tfs[tfs.length - 1];
    image = snap(n.ideas[last]) || image;
    main = `<p class="meta">${esc(n.kind)} · ${esc(day(n.t))} · ${esc(n.t.slice(11, 16))} ET${n.by ? ' · ' + esc(n.by) : ''}</p>
<h1>${esc(n.title)}</h1>
<p class="body">${esc(n.body)}</p>
${tfs.map((x) => chart(x, n.ideas[x])).join('\n')}
${n.now ? `<section class="after"><h2>After · ${esc(day(n.now.t))} ${esc(n.now.t.slice(11, 16))} ET</h2>${n.now.body ? `<p>${esc(n.now.body)}</p>` : ''}${chart(n.now.tf, n.now.link)}${(n.nowHistory || []).length ? `<p class="hist">This After chart was replaced ${n.nowHistory.length} time${n.nowHistory.length > 1 ? 's' : ''}; earlier versions are kept in the record (first added ${esc(day(n.nowHistory[0].t))} ${esc(n.nowHistory[0].t.slice(11, 16))} ET).</p>` : ''}</section>` : ''}
<p class="hist">Posted ${esc(n.t.slice(11, 16))} ET by the server clock. Notes are never edited or deleted.</p>
<p class="cand"><a href="https://propfirmcandor.com/?utm_source=sbdesk&amp;utm_medium=note" target="_blank" rel="noopener">We trade NQ at prop firms. Compare them and get our discount on PropFirmCandor →</a></p>`;
    ld = `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org', '@type': 'AnalysisNewsArticle', headline: n.title, description: desc,
      datePublished: isoNY(n.t), url, image: [image], inLanguage: 'en',
      author: n.by ? { '@type': 'Person', name: n.by } : { '@type': 'Organization', name: 'SB Desk' },
      publisher: { '@type': 'Organization', name: 'SB Desk', logo: { '@type': 'ImageObject', url: SITE + '/img/apple-touch-icon.png' } },
    }).replace(/</g, '\\u003c')}</script>`;
  }

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}"><meta name="robots" content="index,follow">
<link rel="canonical" href="${url}"><link rel="icon" href="/img/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<meta name="theme-color" content="#050505">
<meta property="og:type" content="article"><meta property="og:site_name" content="SB Desk">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}"><meta property="og:image" content="${esc(image)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${esc(image)}">
${ld}
<style>
body{margin:0;background:#050505;color:#d8d8d8;font:16px/1.6 Tahoma,Verdana,sans-serif}
.wrap{max-width:860px;margin:0 auto;padding:18px 18px 60px}
header{display:flex;align-items:center;gap:10px;padding-bottom:16px;border-bottom:1px solid #2a2a2a;margin-bottom:22px}
header a.brand{display:flex;align-items:center;gap:10px;color:#ece6d6;text-decoration:none;font:22px Georgia,serif;letter-spacing:.05em}
header .r{margin-left:auto;display:flex;gap:14px;font-size:14px}header .r a{color:#bdb6a6}
.meta{font:13px Consolas,'Courier New',monospace;color:#8f8f8f;margin:0 0 6px;text-transform:uppercase;letter-spacing:.04em}
h1{font:700 28px/1.25 Georgia,serif;color:#fff;margin:0 0 12px}
h2{font:700 18px Georgia,serif;color:#22d34a;margin:0 0 8px}
.body{white-space:pre-wrap;margin:0 0 22px}
figure{margin:0 0 18px;border:1px solid #2a2a2a}figure img{display:block;width:100%;height:auto}
figcaption{display:flex;gap:12px;align-items:center;padding:6px 10px;background:#141414;font-size:13px}figcaption a{color:#ffb000}
.tf{font:700 12px Consolas,monospace;border:1px solid #2a2a2a;border-left:4px solid #888;padding:1px 6px}
.tf-1m{border-left-color:#f23645}.tf-5m{border-left-color:#fdd835}.tf-15m{border-left-color:#9c27b0}.tf-1H{border-left-color:#4fc3f7}.tf-4H{border-left-color:#1e40af}
.after{margin-top:26px;padding-top:16px;border-top:2px solid #22d34a}
.hist{font-size:12.5px;color:#7d776d}
.btn{display:inline-block;padding:12px 18px;border-radius:3px;font-weight:700;text-decoration:none;margin:6px 8px 0 0}

.cand{font-size:13px;margin:4px 0 0}.cand a{color:#9a9384;text-decoration:underline}
.btn.line{border:1px solid #333;color:#ece6d6}
footer{margin-top:34px;font-size:12px;color:#7d776d;border-top:1px solid #2a2a2a;padding-top:12px}
</style>
<script>window.goatcounter={path:function(p){return 'sbdesk.com'+p;}};</script>
<script data-goatcounter="https://candor.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
</head><body><div class="wrap">
<header><a class="brand" href="/"><img src="/img/favicon.svg" width="34" height="34" alt="">SB DESK</a><nav class="r"><a href="/">Desk</a><a href="/archive/">Archive</a><a href="/before-after/">Before / After</a><a href="/method/">Method</a></nav></header>
<main>
${main}
<p><a class="btn line" href="/#note/${esc(id)}">Open on the Desk</a><a class="btn line" href="/archive/">All notes</a></p>
</main>
<footer>SB Desk publishes educational market analysis for information only. No entries, stops or targets; not financial advice. Each trader is responsible for their own trading decisions.<br><a href="https://propfirmcandor.com/?utm_source=sbdesk&amp;utm_medium=footer" target="_blank" rel="noopener" style="color:inherit">We trade NQ at prop firms. Compare them and get our discount on PropFirmCandor →</a> Candor earns affiliate commission from the firms listed there.</footer>
</div></body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
};

export const config = { path: '/n/*' };
