# Changelog





## 2026-11-17 (18): early-access page for Candor users
- Stipe: the page looked scammy and should say it is for Candor users. New page: same header as the site, title "Early access for Candor users", Everyone vs Candor users, how it works with code CANDOR, an honest "Why is it free?" (Candor commission), firm suggestions (partner firms), names in the footer. Buttons elsewhere: "Candor user? See it now".
- Logged-in admins are no longer sent to the admin page automatically (Stipe ended up there while testing with Google); the page says who is logged in and offers the admin panel or log out.
## 2026-11-17 (17): archive without search
- Stipe: the search box is removed. Archive grouped by day ("Tuesday, 10 November 2026"), time on the left, title, timeframe chips in the timeframe colours, type, author, Before / After tag. Filters (timeframe, type, Before / After only) stay.
## 2026-11-17 (16): own addresses, archive search, Before / After page
- Every section has its own address: `/archive/`, `/before-after/`, `/method/`, `/about/`, `/suggestions/`, `/privacy/` (with the trailing slash, as Netlify serves them) (own title, description and canonical; generated from `index.html` by `build.mjs`, not kept in git). Old links like `/#method/double-top` move to `/method/#double-top`. In-site links change the address without reloading.
- Archive: search (all words must match: title, text, type, author, timeframe), timeframe and type filters, "Before / After only".
- New **Before / After** page: every note with a later chart, Before and After side by side (click to enlarge), the After text, a link to the note page; replaced Afters are mentioned.
- Sitemap lists the new pages. Note pages and the early-access page link to the new addresses.
## 2026-11-17 (15): email on new early-access request
- A new request sends one Netlify Forms submission (form `novi-zahtjev`, hidden page `obavijest-forma.html`); a Forms email notification sends it to the admins. Failure never blocks the request.
## 2026-11-17 (14): 24 h lock kept, Candor link
- Decided: keep the 24 h lock; SB Desk is both archive and daily tool.
- Locked notes (Desk and `/n/` page) and the early-access page link to Candor with `utm_source=sbdesk`.

## 2026-11-17 (13): After, one field per timeframe
- Posting an After: every timeframe has its own link field (like a new note). Switching 1m <-> 1H shows that timeframe's own field; links are kept per timeframe; the button publishes the selected one ("Objavi After · 1m"). Picking another note empties the fields.

## 2026-11-17 (12): After keeps the link
- Reverts (11): switching the After timeframe keeps the pasted link and saves it under the timeframe selected when you press the button (emptying the field lost Stipe's link). The button now reads "Objavi After · 1m" (the selected timeframe).

## 2026-11-17 (11): After timeframe switch
- Posting an After: switching the timeframe (e.g. 1H -> 1m) now empties the link field and its preview, so a 1H chart can no longer end up saved as the 1m After.

## 2026-11-17 (10): 1m charts
- 1m added as a timeframe (Stipe: to show a 1m double top). Posting page has a fifth link row (1m), the Desk shows a 1m tab and the live chart has 1m; After charts can be 1m too. Method page and meta description list 1m.

## 2026-11-17 (9): fixes from ChatGPT's review
- `/n/<id>` shows the full note to admins and early-access users, the locked view to others; pages of new notes are never cached by a shared cache and stay noindex. Published TradingView ideas are embedded there.
- Notes can no longer be back-dated (import path removed; the server sets the time). Admin page: the one-time "move old browser notes" box removed.
- Replacing an After chart keeps the earlier version (`nowHistory`); shown on the note page and the Desk.
- 24 h lock computed in real time (summer / winter time safe).
- Synthetic sample chart code removed.
- Tests (`npm test`), run by the build before every deploy.
- README updated; `docs/status.md` has the review and what was done.

## 2026-11-17 (8)
- Method page: "Waves, made objective" (Stipe's words: Elliott Wave is subjective, ten people count ten ways; MACD decides where a wave starts and ends). Site description mentions it for search.
- Contact hello@sbdesk.com on Privacy, footer, early access page and structured data.
- Docs for AI assistants and reviewers, like Candor: `AGENTS.md`, `docs/vision.md`, `docs/decisions.md`, `docs/must-keep.md`, `docs/roadmap.md`, `docs/status.md` (what is built, what is missing, risks, open questions).

## 2026-11-17 (7)
- Light theme uses the same fonts as the dark theme (Stipe: fonts looked different).
- **Automatic backup**: scheduled function `backup` saves every note, the early-access list and open requests each day into Blobs store `backups` (last 60 days). Admin page: "Backup" section with download links (`/api/backups`).
- **Before / After picture for X**: on the Admin page, notes with an After chart get "Slika za X": a 1600×900 PNG (SB Desk seal, BEFORE and AFTER charts with times, title, `sbdesk.com/n/<id>`, "Analysis only · not a signal"). Chart images come through `/api/img` (only TradingView snapshot images allowed).

## 2026-11-17 (6): site check and phone fixes
- **One status line** at the top of the Desk instead of three pieces: a gold "NEW NOTE · time · how long ago" bar (with "See it now →" for visitors when it is in early access) when the newest note is under 24 h old; otherwise one quiet "Updated X ago · notes dd.mm. – dd.mm.". The bar is there from the first paint, so nothing jumps when notes load.
- **"Log in"** link in the header for everyone not logged in (→ `pristup.html`); admins who log in there go straight to the Admin page.
- **About**: Bernard Pupačić presented as founder & owner (large card), Stipe Pupačić as co-founder.
- **Note pages** `/n/<id>` are now real pages (title, text, charts, After, author, structured data `AnalysisNewsArticle`) that Google can read, with their own share preview; new notes are `noindex` until public. Archive links point to them.
- **Sitemap** is generated (`/sitemap.xml`: Desk, early access page, every public note).
- SEO / quality: `<main>` landmark and an `<h1>` on the Desk, page title per section, Organization + WebSite structured data, theme colour, Apple touch icon, web manifest and app icons, `noscript` notice, 404 page, chart images with size + lazy iframes, keyboard access to the Research Wire, NEW tag readable (contrast).
- Security and caching headers (nosniff, referrer policy, frame options, HSTS, permissions policy; images cached a week).
- Admin: "Backup objava" downloads every note as one JSON file.

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
