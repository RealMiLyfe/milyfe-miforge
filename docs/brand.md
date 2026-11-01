# Brand — MiForge Founder Services (miforgefs.milyfe.fun)

**Naming** (owner decision, 2026-11-01):

- **MiForge OS** — the separate, white-labelable operating system for the whole
  industry. Lives in the **MiLyfe economy** (milyfe.fun). Platform branding stays
  INTERNAL only (admin + /system + docs). Never on client-facing screens.
- **MiForge Founder Services** — the in-home tech service in Jacksonville, FL,
  built on that OS. Short name: **MiForge FS**. Domain: **miforgefs.milyfe.fun**.
  Email: carnell@miforgefs.milyfe.fun. Phone everywhere: 904-562-0544 → `tel:9045620544`.
  Client-facing screens show ONLY "MiForge Founder Services" + "part of the
  MiLyfe economy".

## Logo & imagery

- Wordmark: `site/public/logo.png`, `portal/public/logo.png` — the "MiLyfe" mark
  from `RealMiLyfe/MiLyfe-Platform-OS` `public/logo.png` (harbor-navy → teal
  gradient). **Locked for the local demo** (owner, 2026-11-01); a dedicated
  MiForge FS mark may be commissioned later — drop the new file over `logo.png`
  and regenerate favicon/apple/icon-192/icon-512 from it.
- Favicons/PWA icons: `favicon.png`, `apple-touch-icon.png`, `icon-192.png`,
  `icon-512.png` in both `public/` dirs (generated from the wordmark on cream).
- OG/social image: `og-image.png` in both `public/` dirs (generated from the
  wordmark, 1200×630 intent), referenced via `og:image`/`twitter:image` in
  `site/src/layouts/Layout.astro` and `portal/index.html`.
- Operator photo: grey dashed placeholder on the site hero reading
  **"Carnell Lee — photo pending"** (owner, 2026-11-01). Replace at Go-Live.

## Colors (source of truth: MiLyfe brand)

From `RealMiLyfe/MiLyfe-Platform-OS` `tailwind.config.ts` + `globals.css`
(scales `harbor` / `teal` / `mly`). Applied in `site/tailwind.config.js` and
`portal/tailwind.config.js` (keep the two files' color blocks identical):

| Token (code) | Hex | Brand source | Role |
|---|---|---|---|
| `navy` | `#1E3A6E` | harbor-800 | headlines, primary structure |
| `cream` | `#F5F0E8` | warm paper (MiLyfe surface-light is `#FAFBFC`) | ALL backgrounds — no pure white |
| `rust` | `#006558` | teal-900 | single accent — primary CTA only, one per screen + focus ring (AA-safe; bright `#00C1AE` fails contrast with cream text) |
| `charcoal` | `#2A2A2A` | — | body text — no pure black |
| `olive` | `#00C1AE` | teal-500 | Call tile (dark text) |
| `blue` | `#5B87BF` | harbor-400 | Visit tile |
| `gold` | `#FFC107` | mly-500 | Screen Share tile (dark text) |
| `purple` | `#3664A2` | harbor-600 | Family tile |
| `success` / `warn` / `danger` | `#4A7C59` / `#C4872A` / `#B34040` | — | semantic status; `warn` also the DEMO banner strip |

Hardcoded brand hexes also live in: `portal/src/index.css` + `site/src/styles/global.css`
(focus ring `#006558`), `portal/src/pages/system/SystemArch.jsx` (SVG),
`portal/src/data/mock.json` (`admin.brand.colors`, `admin.revenue.methods[].color`,
`system.memory.segments[].color`). Full MiLyfe scales: harbor 50–950
`#e8eef5`…`#0d1b33`, teal 50–900 `#e0f7f5`…`#006558`, mly 50–900 `#fff8e1`…`#ff6f00`.

## Type

Local/offline builds intentionally use system stacks (no external font CDNs):
Georgia/"Times New Roman" serif headlines, system-ui body. PRODUCTION: swap to
**Lora** + **Inter** via `<link>` in `site/src/layouts/Layout.astro` and
`portal/index.html` (marked in comments). The MiLyfe OS itself uses Atkinson
Hyperlegible — align all three if you choose that instead.

## Demo mode

Every page shows a thin amber strip (site: `Layout.astro`; portal:
`components/DemoBanner.jsx` rendered above all routes): *"Local demo — not
live. All data is fake except Client #001 reference."* Remove both at Go-Live.
Walkthrough script: `README-DEMO.md`.

## Service area & hours (owner, 2026-11-01)

Jacksonville, FL only. Hours: **Tue–Thu 9–5 · Fri 9–3 · Sat 10–2 by
appointment · Sun–Mon off.** Shown on `/trust` §8, site contact section, and
in mock data (`meta.operator`, `admin.brand`) which Admin → Settings displays.

## Seed data

Bruce (C-001), Margaret (C-002), Robert & Diane (C-003) stay as seed for the
local demo. Real clients are added ONE AT A TIME at Go-Live, by the owner.

## Admin auth

`miforge-admin` is the LOCAL DEV password only. Real operator auth (OIDC etc.)
is a Go-Live item.

## ⛔ Deferred to the Go-Live phase (separate session — do NOT start early)

DNS records for miforgefs.milyfe.fun · Cloudflare zone + scoped API token ·
Cloudflare Pages projects (site, portal) · SSL Full(strict) + Caddy origin
cert · Oracle VM public IP or Tunnel token · Backblaze B2 bucket + S3 keys ·
SMTP credentials + `carnell@miforgefs.milyfe.fun` mailbox · SMS/voicemail
forwarding for 904-562-0544 · payment handles (CashApp/Venmo/Zelle/check
address) + Invoice Ninja production setup · LLC legal name/EIN · GL insurance
certificate · background-check proof · Florida attorney review of `/trust` ·
written testimonial permissions · real backup schedule + restore test · PWA
install prompts for clients · real operator auth (OIDC) · sitemap.xml +
robots.txt · terms-of-service page · data-deletion runbook · Uptime Kuma
public status page? · multi-operator admin · real-client migration (one at a
time) · custom MiForge FS logo · production fonts (Lora/Inter) · remove DEMO
banner strips.

## Operator (locked 2026-11-01)

Operator name: **Carnell Lee** (phone 904-562-0544 → `tel:9045620544`). Email alias on miforgefs.milyfe.fun: `carnell@`. Prior "John" placeholder fully removed in commit `__HASH__` (`fix: replace placeholder "John" with operator name "Carnell Lee" across all surfaces`).
