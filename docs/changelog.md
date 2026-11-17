# Changelog

## 2026-11-17 (5)
- Wording (Stipe): early access must not look paid or push people away. "Members" → **free early access**; every note is free, Candor-code traders just see new notes 24 h earlier. Locked note: "Public in X h · every note is free", button "See it now: free early access".
- **Google login** (Netlify Identity, Google provider with Netlify's default app) as the main way in on `pristup.html`; email stays as a small "Use email instead" option. Google's return link (`#access_token=`) is forwarded to `pristup.html`.
- **Own link per note with its own share preview**: `sbdesk.com/n/<id>` (function `share`): public notes show their title, text and chart image on X / WhatsApp; new (early access) notes show only "New NQ note, public in about X h" and the SB Desk image. "Copy link" gives this link.

## 2026-11-17 (3)
- New logo (chosen by Stipe: design canvas "SB Desk logo", board 8): round seal "NQ RESEARCH DESK" around "SB / DESK", fine ticks, six timeframe colours as separate marks along the bottom (never touching, so it does not read as a rainbow). Wordmark "SB DESK" in Libre Caslon Display. Top text "NQ RESEARCH DESK" and bottom text "SPLIT" sit in the middle of the ring band; "SB / DESK" in the centre.
- Logo on the site: small mark + wordmark in the header, full seal on About (light and dark versions), favicon `public/img/favicon.svg` on every page, mark on the login page.
- Decided: the logo carries no personal names (names stay on About).

## 2026-11-17 (2)
- Author shown on every note: in the reading header, the Research Wire and the Archive.
- Suggestions: small form (footer link → #suggest), max 5 per hour per visitor, hidden bot field. Read and delete on the admin page.
- Method page: one colour per timeframe (TradingView colours: 1m red, 5m yellow, 15m purple, 1H light blue, 4H dark blue, 1D orange) with a visual legend; double top and double bottom named as the two main patterns (Stipe's words). Timeframe chips on the Desk use the same colours.
- Glossary: Double bottom added.

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
