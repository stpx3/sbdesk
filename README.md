# SB Desk (sbdesk.com)

> AI assistants and reviewers: start with `AGENTS.md`, then `docs/status.md`.

NQ market analysis by Bernard (founder & owner) and Stipe Pupačić, Split. Public site in English, admin pages in Croatian. The site is public; there is no password screen.

## How it works
- **Netlify** builds this repo: push to `main` → live on sbdesk.com. The build runs the tests first (`npm test`); a failing test stops the deploy.
- **Notes** are stored in Netlify Blobs (store `notes`), one entry per note. The server sets the time (New York); notes cannot be back-dated, edited or deleted. Replacing an After chart keeps the earlier one in `nowHistory`.
- **Free early access**: a note under 24 hours old is sent in full only to admins and approved early-access users (Blobs store `members`); visitors get only its time, timeframes and author. The 24 hours are exact (New York time converted to real time, summer / winter time included).
- **Accounts**: Netlify Identity. Registration is **open** (anyone can create an account, with Google or email; email confirmation required). Only emails in the Netlify environment variable `ADMINS` (`email:Name,email:Name`) can post. Early-access users are approved by an admin (firm + order number).
- **Backups**: daily copy into Blobs store `backups` (last 60), downloadable on the Admin page.

## Pages (`public/`)
| Page | Who | What |
|---|---|---|
| `index.html` | everyone | Desk, Archive, Method, About, Suggestions, Privacy |
| `pristup.html` | everyone | Free early access: Google / email login, purchase form, status |
| `prijava.html` | admins | Admin login, invite and password links |
| `admin.html` | admins | New note, After per note, picture for X, access requests, early-access list, suggestions, backups |
| `objavi.html` | admins | Posting form (TradingView links per timeframe) and After form |

## Server (`netlify/functions/`)
| Function | Path | What |
|---|---|---|
| `notes` | `GET/POST /api/notes` | list (locked notes reduced for visitors) / publish (admins) |
| `after` | `POST /api/after` | add or replace the After chart (history kept) |
| `me` | `GET /api/me` | who is logged in |
| `access` | `/api/access` | early-access requests, approve / reject / revoke |
| `suggestions` | `/api/suggestions` | visitor suggestions (5 per hour per visitor) |
| `share` | `GET /n/<id>` | page per note with its own preview; full for early-access users, locked for others |
| `sitemap` | `GET /sitemap.xml` | Desk, early access page, every public note |
| `backup` | daily schedule | copy of notes, members, requests |
| `backups` | `GET /api/backups` | admins: list / download backups |
| `img` | `GET /api/img` | TradingView snapshot images only, for the X picture |

Shared rules: `netlify/lib/desk.mjs`. Tests: `test/`.

## Build
`npm install && npm run build` (tests, then bundles `src/auth.js` → `public/js/auth.js`).

## History
The old daily-bias version is on the branch `stari-daily-bias`. Decisions: `docs/decisions.md`; changes: `docs/changelog.md`.
