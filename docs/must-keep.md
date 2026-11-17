# Must keep

What must not break. Change only with Stipe's agreement, and say so in the change.

1. **No signals.** No entries, stops, targets, trade calls, live trades, alerts or copy trading anywhere (site, notes, X pictures).
2. **Notes are never edited or deleted** after publishing (the server has no edit or delete). Only the After chart can be added or replaced.
3. **Server-side early access.** A note under 24 hours old is sent only to admins and approved early-access users; visitors get only time, timeframes, author and "public in X h". Never send a locked note's title, text or chart links to the browser of a visitor.
4. **Every note is free** and public after 24 hours; Before / After is public. Wording: "free early access", never paid / members-only.
5. **Only TradingView chart images or published TradingView ideas** are accepted as chart links (server check in `netlify/lib/desk.mjs`).
6. **Admins only via `ADMINS`** (Netlify environment variable). No emails in the code or in public API answers.
7. **Posting stays error-proof for Bernard**: paste link → preview → red message on a wrong link → Publish disabled until ready.
8. **The Google Search Console file** `public/googlee042b48ca290edf5.html` stays (removing it loses verification).
9. **Daily backup** (`netlify/functions/backup.mjs`) keeps running.
10. **Method text is Stipe's.** Assistants lay it out, never invent it.
11. **Look:** dark default, same fonts in both themes, the seal logo, timeframe colours only as separate marks.
