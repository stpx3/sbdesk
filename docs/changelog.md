# Changelog

## 2026-11-17
- Code moved to GitHub (this repo). The old daily-bias site stays on branch `stari-daily-bias`.
- Real accounts: Netlify Identity, invite only; admins = Stipe and Bernard (env var `ADMINS`).
- Notes and After charts stored on the server (Netlify Blobs) instead of one browser. Admin page moves old browser-only notes once.
- New login page `prijava.html` (invite, login, forgotten password). Admin pages require login; public desk keeps the 1950 password screen until launch.
- Note author shown from the account that posted it.

## 2026-11-16
- "Powered by Netlify" badge off. Dark theme is the default.
- Glossary links (first word: Double top) in notes and After text.
- Update bar (last update, how long ago, note date range) and NEW tag on notes under 24 h.
- Admin page for After; public pages no longer show After buttons.
- Password screen asks again in every new browser session.
