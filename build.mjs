// Bundles the login helper for the browser: src/auth.js -> public/js/auth.js
import { build } from 'esbuild';
await build({
  entryPoints: ['src/auth.js'],
  outfile: 'public/js/auth.js',
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2019'],
});
console.log('built public/js/auth.js');

// Own address for every section (better for Google): /archive, /method, ...
// Each page is a copy of index.html with its own title, description, canonical
// address and that section open. Generated at build; not kept in git.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const PAGES = [
  ['archive', 'p-archive', 'Archive · SB Desk', 'Every SB Desk note on NQ (Nasdaq futures), in order. Search by word, timeframe or type. Nothing removed.'],
  ['before-after', 'p-gallery', 'Before / After · SB Desk', 'NQ charts from SB Desk notes next to what the market did later. Hits and misses stay up the same way.'],
  ['method', 'p-method', 'Method · SB Desk', 'How SB Desk reads NQ: waves made objective with MACD, one colour per timeframe, double tops and double bottoms.'],
  ['about', 'p-about', 'About · SB Desk', 'SB Desk is a father-and-son NQ research desk in Split, owned by Bernard Pupačić.'],
  ['suggestions', 'p-suggest', 'Suggestions · SB Desk', 'Tell SB Desk what to improve.'],
  ['privacy', 'p-privacy', 'Privacy · SB Desk', 'What SB Desk keeps about visitors and early-access users.'],
];
const src = readFileSync('public/index.html', 'utf8');
const swap = (s, a, b) => { if (!s.includes(a)) throw new Error('page build: missing ' + a); return s.split(a).join(b); };
for (const [slug, sec, title, desc] of PAGES) {
  const url = `https://sbdesk.com/${slug}/`;
  let h = src;
  h = swap(h, '<title>SB Desk · NQ research desk</title>', `<title>${title}</title>`);
  h = h.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${desc}">`);
  h = h.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${desc}">`);
  h = h.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${desc}">`);
  h = swap(h, '<meta property="og:title" content="SB Desk · NQ research desk">', `<meta property="og:title" content="${title}">`);
  h = swap(h, '<meta name="twitter:title" content="SB Desk · NQ research desk">', `<meta name="twitter:title" content="${title}">`);
  h = swap(h, '<link rel="canonical" href="https://sbdesk.com/">', `<link rel="canonical" href="${url}">`);
  h = swap(h, '<meta property="og:url" content="https://sbdesk.com/">', `<meta property="og:url" content="${url}">`);
  h = swap(h, '<h1 class="sr">SB Desk · NQ research desk</h1>', `<h1 class="sr">${title}</h1>`);
  h = swap(h, '<section id="p-desk">', '<section id="p-desk" hidden>');
  h = swap(h, `<section id="${sec}" hidden>`, `<section id="${sec}">`);
  mkdirSync(`public/${slug}`, { recursive: true });
  writeFileSync(`public/${slug}/index.html`, h);
}
console.log('built pages:', PAGES.map((p) => p[0]).join(', '));
