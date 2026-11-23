// Basic checks of the shared rules (run: npm test)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cleanLink, nyToEpoch, ageMinutes, nyNow } from '../netlify/lib/desk.mjs';

test('only TradingView chart images and published ideas are accepted', () => {
  assert.equal(cleanLink('https://www.tradingview.com/x/AbCd1234/'), 'https://www.tradingview.com/x/AbCd1234/');
  assert.equal(cleanLink('https://www.tradingview.com/x/AbCd1234'), 'https://www.tradingview.com/x/AbCd1234/');
  assert.ok(cleanLink('https://www.tradingview.com/chart/NQ1!/AbCd1234-double-top/'));
  assert.equal(cleanLink('https://evil.example/x/AbCd1234/'), null);
  assert.equal(cleanLink('javascript:alert(1)'), null);
  assert.equal(cleanLink('https://www.tradingview.com/chart/'), null);
});

test('New York time to real time, summer and winter', () => {
  assert.equal(new Date(nyToEpoch('2026-07-01T09:30')).toISOString(), '2026-07-01T13:30:00.000Z'); // EDT, UTC-4
  assert.equal(new Date(nyToEpoch('2026-11-17T09:30')).toISOString(), '2026-11-17T14:30:00.000Z'); // EST, UTC-5
});

test('age of a note in minutes', () => {
  const n = { t: '2026-10-31T10:00' };
  assert.equal(ageMinutes(n, nyToEpoch(n.t) + 90 * 60000), 90);
});

test('server time format', () => {
  assert.match(nyNow(), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
});

test('visit counter is on public pages and never on admin pages', () => {
  const has = (f) => readFileSync(f, 'utf8').includes('data-goatcounter=');
  for (const f of ['public/index.html', 'public/404.html', 'netlify/functions/share.mjs']) assert.ok(has(f), f);
  for (const f of ['public/admin.html', 'public/publish.html', 'public/login.html']) assert.ok(!has(f), f);
});

test('free for everyone: no early access, no lock, new disclaimer (20 Nov 2026)', () => {
  const files = ['public/index.html', 'public/404.html', 'public/admin.html', 'netlify/functions/share.mjs',
    'netlify/functions/notes.mjs', 'netlify/functions/sitemap.mjs', 'netlify/lib/desk.mjs', 'build.mjs'];
  for (const f of files) {
    const t = readFileSync(f, 'utf8');
    assert.ok(!/early.access|candor code|code buyer|partner firm|locked|LOCK_HOURS/i.test(t), f);
  }
  const dis = 'SB Desk publishes educational market analysis for information only. No entries, stops or targets; not financial advice. Each trader is responsible for their own trading decisions.';
  for (const f of ['public/index.html', 'netlify/functions/share.mjs']) assert.ok(readFileSync(f, 'utf8').includes(dis), f);
});
