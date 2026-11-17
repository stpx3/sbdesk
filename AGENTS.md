# Instructions for AI assistants (Claude, ChatGPT, others)

Read this first, then `docs/vision.md`, `docs/decisions.md`, `docs/must-keep.md`, `docs/roadmap.md` and `docs/status.md` (current state and open questions). The technical layout is in `README.md`; every change is in `docs/changelog.md`.

## The project

SB Desk (sbdesk.com): NQ (Nasdaq 100 futures) market analysis by a father and son from Split, Croatia: **Bernard Pupačić (founder & owner)** and **Stipe Pupačić (co-founder, trader)**. Owner and final decision maker on the product: Stipe. Sister project: Candor (propfirmcandor.com, repo `stpx3/propfirmcandor`), a futures prop firm comparison site that Stipe also runs.

## Rules that never change

1. **No signals.** No entries, stops, targets, trade calls, live trades, trade notifications or copy trading. Prop firms ban signal services and copy trading, and Stipe trades at prop firms. SB Desk is analysis only.
2. **No invented content.** No sample notes, no placeholders, no made-up stats, quotes or track record on the live site. Text about the method comes from Stipe; an assistant may lay it out and tidy the English, never invent it.
3. **The method:** they read the market in **waves, with their own MACD-based method**. It is an **objective** way of reading waves: Elliott Wave is subjective (ten people, ten counts); MACD decides where a wave starts and ends. Never write generic commentary ("buyers defended the prior day high"), never Elliott ABC / 1-2-3-4-5 counts.
4. **Every note is free.** Buyers through the Candor code get **free early access** (they see new notes as soon as they are posted; everyone else 24 hours later). Never word it as paid, premium or members-only, and never push visitors away.
5. **Notes are never edited or deleted** after publishing. Only the "After" chart (how it played out) can be added or replaced.
6. **No prop firm logos or "official partners" on SB Desk.** Firms belong on Candor.
7. **No secrets in the repository.** Admin emails live in the Netlify environment variable `ADMINS`.

## How we work

- Talk to Stipe in short, simple Croatian. Be frank. He wants proposals: suggest every useful feature and let him judge; do not hold ideas back to keep the site small. "Simple" means easy to use, not few features.
- The public site is in English; admin pages (`admin.html`, `objavi.html`, `prijava.html`) are in Croatian.
- Claude pushes to `main` (this repo, agreed with Stipe); Netlify deploys `main` to sbdesk.com in about a minute. Every change gets a line in `docs/changelog.md`, every decision a line in `docs/decisions.md`.
- Before pushing: build (`npm run build`), check desktop and phone (no JS errors, no horizontal overflow). Stipe mostly looks at the site on his phone.
- Bernard is not comfortable on a PC: posting must stay near error-proof.
- Look and feel: premium, financial, not generic AI. Dark theme is the default; light and dark use the same fonts. The six timeframe colours are part of the identity but only as small separate marks, never a rainbow strip.

## For a reviewer (ChatGPT or another assistant)

Stipe asks for a second opinion. Start with `docs/status.md`: it lists what is built, what Claude thinks is missing, the risks, and the open questions. Challenge anything there. Proposals go to Stipe in plain words; nothing is built until he agrees.
