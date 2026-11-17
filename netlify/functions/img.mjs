// GET /api/img?u=<TradingView chart snapshot>  or  /api/img?idea=<published idea id>
// -> the same image from our own address, so the Admin page can draw it into the
// Before / After picture for X. Only TradingView chart images are allowed (not an open proxy).
const TYPES = { png: 'image/png', webp: 'image/webp' };

async function get(url) {
  const r = await fetch(url);
  if (!r.ok) return null;
  const ext = url.split('.').pop();
  return new Response(await r.arrayBuffer(), { headers: { 'Content-Type': TYPES[ext] || 'image/png', 'Cache-Control': 'public, max-age=86400' } });
}

export default async (req) => {
  const q = new URL(req.url).searchParams;
  const u = q.get('u') || '', idea = q.get('idea') || '';
  if (u) {
    if (!/^https:\/\/s3\.tradingview\.com\/snapshots\/[a-z0-9]\/[A-Za-z0-9]+\.png$/.test(u)) return new Response('Bad image', { status: 400 });
    return (await get(u)) || new Response('Image not found', { status: 404 });
  }
  if (/^[A-Za-z0-9]{6,12}$/.test(idea)) {
    // a published idea has a preview image: big if there is one, else the medium one
    const base = `https://s3.tradingview.com/${idea.charAt(0).toLowerCase()}/${idea}`;
    for (const end of ['_big.png', '_mid.png', '_mid.webp']) {
      const r = await get(base + end);
      if (r) return r;
    }
    return new Response('Image not found', { status: 404 });
  }
  return new Response('Bad image', { status: 400 });
};

export const config = { path: '/api/img' };
