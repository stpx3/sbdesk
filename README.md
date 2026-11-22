# SB Desk (sbdesk.com)

> AI assistants and reviewers: start with `AGENTS.md`, then `docs/status.md`.

NQ market analysis by Bernard (founder & owner) and Stipe Pupačić, Split. Public site in English, admin pages in Croatian. The site is public; there is no password screen and no login to read.

## How it works
- **Netlify** builds this repo: push to `main` → live on sbdesk.com. The build runs the tests first (`npm test`); a failing test stops the deploy.
- **Notes** are stored in Netlify Blobs (store `notes`), one entry per note. The server sets the time (New York); notes cannot be back-dated, edited or deleted. Replacing an After chart keeps the earlier one in `nowHistory`.
- **Every note is public at once** (20 Nov 2026). Readers need no account.
- **Accounts**: Netlify Identity, for the admins only. Only emails in the Netlify environment variable `ADMINS` (`email:Name,email:Name`) can post. Registration should be set to invite only in Netlify (no public sign-up needed any more).
- **Backups**: daily copy into Blobs store `backups` (last 60), downloadable on the Admin page.

## Pages (`public/`)
| Page | Who | What |
|---|---|---|
| `index.html` | everyone | Desk, Archive, Method, About, Suggestions, Privacy |
| `prijava.html` | admins | Admin login, invite and password links |
| `admin.html` | admins | New note, After per note, picture for X, suggestions, backups |
| `objavi.html` | admins | Posting form (TradingView links per timeframe) and After form |

## Server (`netlify/functions/`)
| Function | Path | What |
|---|---|---|
| `notes` | `GET/POST /api/notes` | list of every note (public) / publish (admins) |
| `after` | `POST /api/after` | add or replace the After chart (history kept) |
| `me` | `GET /api/me` | who is logged in |
| `suggestions` | `/api/suggestions` | visitor suggestions (5 per hour per visitor) |
| `share` | `GET /n/<id>` | page per note with its own preview |
| `sitemap` | `GET /sitemap.xml` | Desk, its sections, every note |
| `backup` | daily schedule | copy of every note |
| `backups` | `GET /api/backups` | admins: list / download backups |
| `img` | `GET /api/img` | TradingView snapshot images only, for the X picture |

Shared rules: `netlify/lib/desk.mjs`. Tests: `test/`.

## Build
`npm install && npm run build` (tests, then bundles `src/auth.js` → `public/js/auth.js`).

## History
The old daily-bias version is on the branch `stari-daily-bias`. Decisions: `docs/decisions.md`; changes: `docs/changelog.md`.
