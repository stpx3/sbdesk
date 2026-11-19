// Basic checks of the shared rules (run: npm test)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cleanLink, nyToEpoch, ageMinutes, isOpen, nyNow, LOCK_HOURS } from '../netlify/lib/desk.mjs';

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

test('24 h lock is exact across the clock change (1 Nov 2026)', () => {
  const n = { t: '2026-10-31T10:00' }; // EDT
  const posted = nyToEpoch(n.t);
  assert.equal(isOpen(n, posted + (LOCK_HOURS * 60 - 1) * 60000), false);
  assert.equal(isOpen(n, posted + LOCK_HOURS * 60 * 60000), true);
  assert.equal(ageMinutes(n, posted + 90 * 60000), 90);
});

test('server time format', () => {
  assert.match(nyNow(), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
});

test('visit counter is on public pages and never on admin pages', () => {
  const has = (f) => readFileSync(f, 'utf8').includes('data-goatcounter=');
  for (const f of ['public/index.html', 'public/early-access/index.html', 'public/404.html', 'netlify/functions/share.mjs']) assert.ok(has(f), f);
  for (const f of ['public/admin.html', 'public/objavi.html', 'public/prijava.html', 'public/obavijest-forma.html']) assert.ok(!has(f), f);
});
