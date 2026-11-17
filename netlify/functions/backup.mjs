// Runs every day: saves a copy of every note (with After charts), the early-access list and
// the open requests into the Blobs store "backups". Keeps the last 60 copies.
import { getStore } from '@netlify/blobs';
import { notesStore, membersStore, requestsStore } from '../lib/desk.mjs';

const all = async (store) => {
  const { blobs } = await store.list();
  return (await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })))).filter(Boolean);
};

export default async () => {
  const backups = getStore({ name: 'backups', consistency: 'strong' });
  const day = new Date().toISOString().slice(0, 10);
  const data = { saved: new Date().toISOString(), notes: await all(notesStore()), members: await all(membersStore()), requests: await all(requestsStore()) };
  await backups.setJSON('sbdesk-' + day, data);
  const { blobs } = await backups.list();
  const keys = blobs.map((b) => b.key).sort();
  for (const k of keys.slice(0, Math.max(0, keys.length - 60))) await backups.delete(k);
  return new Response('ok');
};

export const config = { schedule: '@daily' };
