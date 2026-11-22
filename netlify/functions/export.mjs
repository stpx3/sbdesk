// GET /api/export -> an ENCRYPTED copy of everything SB Desk keeps (notes with After charts
// and suggestions). Fetched every day by the GitHub Action
// .github/workflows/backup.yml and kept on the repo's `backups` branch, so a copy exists
// outside Netlify. Without the passphrase (env BACKUP_KEY, kept by Stipe) the file is unreadable.
// Decrypt: node tools/decrypt-backup.mjs <file> (asks for the passphrase).
import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { notesStore } from '../lib/desk.mjs';

const all = async (store) => {
  const { blobs } = await store.list();
  return (await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })))).filter(Boolean);
};

export default async () => {
  const pass = process.env.BACKUP_KEY;
  if (!pass || pass.length < 20) return new Response('Backup key not set.', { status: 503 });
  const data = {
    saved: new Date().toISOString(),
    notes: await all(notesStore()),
    suggestions: await all(getStore({ name: 'suggestions', consistency: 'strong' })),
  };
  const salt = crypto.randomBytes(16), iv = crypto.randomBytes(12);
  const key = crypto.scryptSync(pass, salt, 32);
  const c = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([c.update(JSON.stringify(data), 'utf8'), c.final()]);
  const out = { v: 1, alg: 'aes-256-gcm, key = scrypt(passphrase, salt)', saved: data.saved, counts: { notes: data.notes.length },
    salt: salt.toString('base64'), iv: iv.toString('base64'), tag: c.getAuthTag().toString('base64'), data: enc.toString('base64') };
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
};

export const config = { path: '/api/export' };
