// GET /api/me -> who is logged in: admin, member, or waiting for access.
import { viewer, requestsStore, json } from '../lib/desk.mjs';

export default async () => {
  const v = await viewer();
  if (!v) return json({ loggedIn: false, admin: false, member: false });
  const pending = !v.member && !!(await requestsStore().get(v.email, { type: 'json' }));
  return json({ loggedIn: true, admin: v.admin, member: v.member, pending, name: v.name, email: v.email });
};

export const config = { path: '/api/me' };
