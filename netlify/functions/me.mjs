// GET /api/me -> who is logged in (any account; admin = may post).
import { viewer, json } from '../lib/desk.mjs';

export default async () => {
  const v = await viewer();
  if (!v) return json({ loggedIn: false, admin: false });
  return json({ loggedIn: true, admin: v.admin, name: v.name, email: v.email });
};

export const config = { path: '/api/me' };
