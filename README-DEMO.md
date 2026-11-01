# README-DEMO.md — the 2-minute local walkthrough

Everything runs locally. Nothing is deployed, nothing leaves your laptop.
Every page shows a thin amber strip: **"Local demo — not live. All data is fake
except Client #001 reference."**

## Start (two terminals)

```bash
cd site   && npm run dev    # marketing site  -> http://localhost:4321
cd portal && npm run dev    # portal + admin + family + system -> http://localhost:5173
```

All mock data lives in `portal/src/data/mock.json` (mirrors the NocoDB seed:
Bruce C-001, Margaret C-002, Robert & Diane C-003). Admin password (local dev
only): `miforge-admin`.

## The walkthrough (~2 minutes, in this order)

1. **Marketing site** — http://localhost:4321 — 15s
   Home: hero, the 3 pillars (Session $100/hr 2hr min · Project $300–$1,500 ·
   Partnership $200/mo), who I serve, 4-step "how it works", trust cards with
   the greyed-out flag placeholders (background checked / insured / testimonial
   all OFF), contact form (mock — submitting shows the success card). Footer →
   **/trust** (10-section plain-English Privacy & Trust Agreement, hours +
   Jacksonville-only service area in §8). 404 page exists too.

2. **Client portal login** — http://localhost:5173/login — 10s
   Click **"demo: open the portal as Bruce"** → home screen with 6 big tiles.
   (Also try **"dev: simulate offline"** on the login page → offline screen
   with the phone number.)

3. **Client home tiles** — http://localhost:5173 — 25s
   Call John (`tel:`), Message Us (mock thread), My Tools, Next Visit (past
   visits with what was asked/done/left behind), **Share My Screen** → start →
   red "session active" screen → end → ended screen, Family Access →
   manage/add family members (verify, Full/Limited/Decision-Partner levels).
   Account page: export-your-data (JSON download) + delete-data request flow.

4. **Family portal** — http://localhost:5173/family/login — 20s
   Three demo personas. Log in as the **Decision Partner** → family home shows
   the pending **$450 project banner: Approve / Decline / Call** button. Try
   `?level=limited` → dates + summaries only. **/family/concern** → call /
   email John page, 24-hour concern logging promise.

5. **Operator admin** — http://localhost:5173/admin/login — 40s
   Password `miforge-admin` → **Dashboard**: date header, "3 visits today ·
   $450 projected · 2 follow-ups due", 3 schedule cards with Start Session,
   red-bordered Needs Attention ×3, This Week, quick tiles.
   → **Clients** (search, avatars, status pills) → **Bruce's profile**: 7 tabs
   (Overview / Visits / Invoices / Tools / Family / Jewels / Consent Log) — try
   **Mark Paid**, **+ Add Tool**, jewel **Permission-to-Share** toggle.
   → **Start Session** → Before / During / After wizard: checklist, running
   timer + autosave indicator, offline-mock toggle, tool chips, jewel capture,
   family-present, then the **10-question ethical checkpoint** (Complete stays
   grey until all-Yes; any No → amber "Save as Incomplete" + private note).
   → **Revenue** ($1,250 this month; MRR/one-time/outstanding/lifetime; stacked
   Cash/CashApp/Venmo/Check bar, no charts) → **Templates** (Deploy to Client)
   → **Settings** (feature flags all OFF, read-only brand config incl. domain,
   hours, service area).

6. **System overview** — http://localhost:5173/system — 10s
   Architecture SVG (Oracle VM, Caddy, edge/data zones, Cloudflare, B2,
   RustDesk grey-cloud, legend) · **/system/flow** 12-step day in the life ·
   **/system/memory** 24 GB bar with 22 GB red line · **/system/checklist**
   50-item launch list (18 local-done).

## What to say while demoing

- "The amber strip means this is the local demo — nothing here is live yet."
- Client data is the seed (Bruce / Margaret / Robert & Diane) until Go-Live.
- Admin password is dev-only; real operator auth comes with deployment.

## Not in this demo (Go-Live phase, separate session)

DNS/SSL/Cloudflare/Pages, real auth (OIDC), email mailbox + SMTP, payment
handles + Invoice Ninja production, insurance/background/attorney proofs,
real client migration, backups to B2, sitemap/robots, ToS page, deletion
runbook, status page, multi-operator. Full list: `docs/brand.md`.
