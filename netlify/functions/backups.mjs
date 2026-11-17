// GET /api/backups          -> admins: list of daily backups
// GET /api/backups?key=...  -> admins: one backup as a file
import { getStore } from '@netlify/blobs';
import { adminUser, json, fail } from '../lib/desk.mjs';

export default async (req) => {
  if (!(await adminUser())) return fail('Nisi prijavljen kao admin.', 401);
  const backups = getStore({ name: 'backups', consistency: 'strong' });
  const key = new URL(req.url).searchParams.get('key');
  if (key) {
    if (!/^sbdesk-\d{4}-\d{2}-\d{2}$/.test(key)) return fail('Bad key.');
    const d = await backups.get(key, { type: 'json' });
    if (!d) return fail('Not found.', 404);
    return new Response(JSON.stringify(d, null, 2), { headers: { 'Content-Type': 'application/json', 'Content-Disposition': `attachment; filename="${key}.json"`, 'Cache-Control': 'no-store' } });
  }
  const { blobs } = await backups.list();
  return json({ backups: blobs.map((b) => b.key).sort().reverse() });
};

export const config = { path: '/api/backups' };
