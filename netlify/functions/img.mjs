// GET /api/img?u=<TradingView chart image> -> the same image from our own address,
// so the Admin page can draw it into the Before / After picture for X.
// Only TradingView chart snapshots are allowed (this is not an open proxy).
export default async (req) => {
  const u = new URL(req.url).searchParams.get('u') || '';
  if (!/^https:\/\/s3\.tradingview\.com\/snapshots\/[a-z0-9]\/[A-Za-z0-9]+\.png$/.test(u)) return new Response('Bad image', { status: 400 });
  const r = await fetch(u);
  if (!r.ok) return new Response('Image not found', { status: 404 });
  return new Response(await r.arrayBuffer(), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } });
};

export const config = { path: '/api/img' };
