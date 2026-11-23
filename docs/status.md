# Status and open questions (for Stipe and for a second opinion)

Written by Claude, 17 Nov 2026; updated after ChatGPT's review the same day (see the last section). **Updated 20 Nov 2026: SB Desk is free for everyone at once (see `decisions.md`); the early-access parts below are marked as removed.** Honest view of where SB Desk stands, what is missing, and what could go wrong. A reviewer should challenge this file first.

## Built and live (sbdesk.com)

- **Desk**: chart of the selected note per timeframe (TradingView images or interactive published ideas), Before / After view, Research Wire (all notes, newest first, author, timeframe chips, NEW / BEFORE-AFTER tags), one status line (gold "NEW NOTE" bar when a note is under 24 h old).
- **Archive, Method, About, Suggestions, Privacy** sections; dark default, light theme; glossary links (double top, double bottom).
- **Note pages** `/n/<id>`: real pages Google can read, own share preview (title, text, chart image), structured data; every note public and indexable at once.
- **Free for everyone** (20 Nov): every note visible at once, no login to read. One calm Candor link in the footer. Early access, requests and member lists removed.
- **Admin (Croatian)**: new note (paste TradingView links), After per note, "Slika za X" (Before / After PNG), suggestions, daily backups + instant download.
- **Accounts**: Netlify Identity, admins only; only `ADMINS` can post.
- **SEO / quality**: sitemap (all public notes), Search Console verified, Open Graph / X cards, Organization + WebSite data, 404, manifest and icons, security headers, keyboard access, no layout jump while loading.
- **Logo**: seal "NQ RESEARCH DESK / SPLIT", "SB / DESK", six timeframe marks.
- **Contact**: hello@sbdesk.com.

## Not live yet

- **Candor card** (Candor PR, 20 Nov): "free daily NQ analysis from the people behind Candor", not tied to buying. Live when Stipe's PR is merged.

## What Claude thinks is missing (by value)

1. **Method text and picture.** The Method page has the core idea (objective waves, colours, two main patterns) but not yet how a wave is read with MACD on each timeframe, in Stipe's words, with one annotated chart. This is the most important missing content: it is what people search for and what makes the notes understandable.
2. **Real notes, regularly.** The site is only as strong as the notes. A rhythm (for example pre-market + one update) matters more than any feature.
3. **Bernard's first post.** Posting has been tested by Stipe, not yet by Bernard. A short test with him will show if anything is unclear.
4. **Notify readers of a new note** (email for those who ask, or an X post). Needs an email service (for example Resend, free tier) and an unsubscribe link.
5. **Notify admins** when someone sends a suggestion (same email service). Today Stipe must open the Admin page to see it.
6. **Before / After gallery page**: all notes that have an After, as a grid. The strongest proof page for X visitors. No new data needed.
7. **Visitor stats:** done 18 Nov (GoatCounter, candor.goatcounter.com, addresses starting `sbdesk.com/`).
8. **RSS feed** of public notes (cheap; some traders and tools follow feeds; helps discovery).
9. **Corrections without editing**: notes cannot be edited (on purpose). A typo or a wrong chart link can only be fixed by a new note. Proposal: an admin "Correction" line added under a note with its own timestamp, original kept.
10. **Offsite backup**: daily backups live in Netlify too. A weekly copy to GitHub or email would protect against losing the Netlify account.
11. **Terms / risk disclosure page**: the footer has a short disclaimer; a fuller page (no advice, no signals, past notes do not predict, futures risk) is usual for a market-analysis site.
12. **Timeline on the chart** (one big NQ chart with every note marked): wanted by Stipe, later; the hard part is price data.

## Risks

- **Affiliate terms**: solved 20 Nov by making SB Desk free for everyone; nothing is tied to buying, so no firm needs to approve SB Desk.
- **Prop firm rules on signals**: SB Desk must stay analysis. Any note that reads like "buy here, stop there" would put Stipe's own funded accounts and the affiliate deals at risk.
- **Netlify plan**: the account is on a legacy (non-credit) plan. Netlify's current docs say credit-based Free/Personal plans include unlimited Identity users and custom OAuth credentials; on legacy plans Identity follows the old service levels (the dashboard asked for Identity Pro for branded Google login). Moving the account to a credit plan could unlock it, but credits are also spent on every deploy (Candor deploys often), so check costs first.
- **Elliott wording**: "objective waves" is the message; the site must not claim proven results or superiority without evidence.

## Open questions for Stipe

0. The rules behind "objective" waves, plus one marked chart for Method (only Stipe can write them).

1. *(Settled 20 Nov: SB Desk is free for everyone; no firm needs to allow anything.)*
2. Email notifications (points 4 and 5): yes?
3. Before / After gallery page: yes?
4. Visitor stats with GoatCounter: done 18 Nov.
5. Branded Google login needs Netlify Identity Pro (paid): keep "Netlify Identity" on Google's screen for now?
6. When does Candor get CFD and perp firms (Stipe, 17 Nov: later)?

## Review by ChatGPT (17 Nov) and what was done

Fixed the same day:
- *(Removed 20 Nov, no lock any more.)* **Note page for early-access users**: `/n/<id>` showed the locked version even to approved users. Now it checks who is looking; full page for admins and early-access users, locked for others. Pages of notes under 24 h are never kept in a shared cache (`private, no-store`) and stay `noindex`.
- **Back-dating closed**: the one-time import path (which accepted a given time) is removed. Every note gets the server's time.
- **After history**: replacing an After chart keeps the earlier version (`nowHistory`, with the time it was replaced); the note page and the Desk say when an After was replaced.
- *(Removed 20 Nov.)* **Exact 24 hours**: the lock now converts New York time to real time, so summer / winter time no longer shifts it by an hour. Covered by a test.
- **Synthetic sample chart** generator removed from the page.
- **Note page embeds published TradingView ideas** (interactive), not only a link.
- **Tests**: `npm test` (link rules, time conversion, note age; since 20 Nov also: no early-access wording, disclaimer present); the Netlify build runs them first.
- **README** brought up to date (open registration, no password screen, all functions).
- Checked: registration is **Open** in Netlify (it was switched from invite-only on 17 Nov). *23 Nov: keep it Open (accounts for everyone).*

Agreed, but needs Stipe:
- **24 h lock**: kept on 17 Nov, **removed 20 Nov** (SB Desk free for everyone).
- **"Objective" must be shown, not only claimed**: the Method page needs the rules (what starts a wave, what ends it, what happens in unclear cases, same rules on every timeframe) with one marked chart. If some parts stay discretionary, say so.
- **Method, About, Archive as their own pages**: done 17 Nov (`/method`, `/about`, `/archive`, `/before-after`).
- **Archive filters**: done 17 Nov (Stipe removed the text search: not wanted). Latest notes above the chart on the phone: Stipe does not want it.
- **Posting rhythm**: wanted, Stipe first has to settle his routine.
- **A rhythm** (for example before the New York open + after the session) and Before / After posts that also show misses.
- **Strategic question, decided (17 Nov)**: both, archive + method for credibility and a daily tool for traders. Next: a posting rhythm and the daily-tool features below.
- **Email to readers about new notes**: open (see point 4).

Not agreed / different view:
- ChatGPT said branded Google login does not need a paid plan. True for Netlify's new credit plans, not for this account's legacy plan (see Risks).
- Loading all notes on every visit is fine at today's size; to fix (paging or a summary index) when the archive passes a few hundred notes.
