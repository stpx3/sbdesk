// GET /api/me -> who is logged in, and whether they are an admin.
import { getUser } from '@netlify/identity';
import { adminUser, json } from '../lib/desk.mjs';

export default async () => {
  const who = await adminUser();
  if (who) return json({ loggedIn: true, admin: true, name: who.name, email: who.email });
  let user = null;
  try { user = await getUser(); } catch { user = null; }
  return json({ loggedIn: !!user, admin: false, email: user ? user.email : null });
};

export const config = { path: '/api/me' };
