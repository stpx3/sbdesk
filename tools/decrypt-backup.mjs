// Opens an encrypted SB Desk backup (branch `backups`, file backups/<day>.json).
// Usage: node tools/decrypt-backup.mjs backups/2026-11-19.json > backup.json
// It asks for the passphrase (the BACKUP_KEY Stipe keeps). Output: notes, members, requests, suggestions.
import crypto from 'node:crypto';
import fs from 'node:fs';
import readline from 'node:readline';

const file = process.argv[2];
if (!file) { console.error('Usage: node tools/decrypt-backup.mjs <backup file>'); process.exit(1); }
const b = JSON.parse(fs.readFileSync(file, 'utf8'));
const rl = readline.createInterface({ input: process.stdin, output: process.stderr });
rl.question('Passphrase: ', (pass) => {
  rl.close();
  const key = crypto.scryptSync(pass.trim(), Buffer.from(b.salt, 'base64'), 32);
  const d = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(b.iv, 'base64'));
  d.setAuthTag(Buffer.from(b.tag, 'base64'));
  try {
    process.stdout.write(Buffer.concat([d.update(Buffer.from(b.data, 'base64')), d.final()]).toString('utf8') + '\n');
  } catch { console.error('Wrong passphrase or damaged file.'); process.exit(1); }
});
