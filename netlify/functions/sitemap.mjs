// GET /sitemap.xml -> the Desk, its sections and every note page (/n/<id>).
import { notesStore } from '../lib/desk.mjs';

export default async () => {
  const store = notesStore();
  const { blobs } = await store.list();
  const notes = (await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })))).filter(Boolean);
  const urls = [['https://sbdesk.com/', null], ...['archive', 'before-after', 'method', 'about'].map((p) => [`https://sbdesk.com/${p}/`, null])];
  notes
    .sort((a, b) => (a.t < b.t ? 1 : -1))
    .forEach((n) => urls.push([`https://sbdesk.com/n/${n.id}`, n.t.slice(0, 10)]));
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(([u, d]) => `  <url><loc>${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`).join('\n') + '\n</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=900' } });
};

export const config = { path: '/sitemap.xml' };
