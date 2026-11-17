# SB Desk (sbdesk.com)

> AI assistants and reviewers: start with `AGENTS.md`, then `docs/status.md`.

NQ market analysis by Bernard and Stipe Pupačić. Public site in English, admin pages in Croatian.

## How it works
- **Netlify** builds this repo: push to `main` → live on sbdesk.com.
- **Notes** are stored in Netlify Blobs (store `notes`), one entry per note. Everyone sees the same notes.
- **Login**: Netlify Identity, invite only. Only emails listed in the Netlify environment variable `ADMINS` can post
  (format `email:Name,email:Name`; kept out of the code because the repo may be public).
- Notes are never edited or deleted. Only the "After" chart can be added or replaced.

## Pages (`public/`)
| Page | Who | What |
|---|---|---|
| `index.html` | everyone | Desk, Archive, Method, About. Still behind the simple password screen (`gate.js`) until launch. |
| `prijava.html` | admins | Login, set password from the invite email, forgotten password. |
| `admin.html` | admins | "+ Nova analiza", list of all notes with "+ Dodaj After", one-time move of old browser-only notes. |
| `objavi.html` | admins | Posting form (TradingView links per timeframe) and the After form. |

## Server (`netlify/functions/`)
- `GET /api/notes` all notes (public) · `POST /api/notes` new note (admin)
- `POST /api/after` add/replace the After chart of a note (admin)
- `GET /api/me` who is logged in
- Shared rules: `netlify/lib/desk.mjs` (only TradingView links accepted, times in New York time).

## Glossary
Words in notes that link to the Method page: the `GLOSS` list at the top of the script in `public/index.html`.

## Build
`npm install && npm run build` (bundles `src/auth.js` → `public/js/auth.js`).

## History
The old daily-bias version is kept on the branch `stari-daily-bias`. Decisions and changes: `docs/changelog.md`.
