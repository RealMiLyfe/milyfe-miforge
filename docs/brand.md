# Brand — MiForge Founder Services (miforgefs.milyfe.fun)

**Naming** (per owner, 2026-11-01):

- **MiForge OS** — the separate, white-labelable operating system for the whole
  industry. Lives in the **MiLyfe economy** (milyfe.fun). Not this repo's product
  surface.
- **MiForge Founder Services** — John's in-home tech service in Jacksonville, FL,
  built on top of that OS. Short name: **MiForge FS**. Domain:
  **miforgefs.milyfe.fun**. Email: john@miforgefs.milyfe.fun. Phone everywhere:
  904-562-0544 → `tel:9045620544`.

## Logo

- Wordmark: `site/public/logo.png` and `portal/public/logo.png` (also
  `favicon.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`).
- Source: `RealMiLyfe/MiLyfe-Platform-OS` → `public/logo.png` (the "MiLyfe"
  mark, a harbor-navy → teal gradient). If a dedicated miforgefs logo is
  designed later, drop it over those files — nothing else references paths.

## Colors (source of truth: MiLyfe brand)

From `RealMiLyfe/MiLyfe-Platform-OS` `tailwind.config.ts` + `globals.css`
(scales `harbor` / `teal` / `mly`). Applied in `site/tailwind.config.js` and
`portal/tailwind.config.js` (keep the two files' color blocks identical):

| Token (code) | Hex | Brand source | Role |
|---|---|---|---|
| `navy` | `#1E3A6E` | harbor-800 | headlines, primary structure |
| `cream` | `#F5F0E8` | warm paper (MiLyfe surface-light is `#FAFBFC`) | ALL backgrounds — no pure white |
| `rust` | `#006558` | teal-900 | single accent — primary CTA only, one per screen + focus ring (AA-safe; brighter `#00C1AE` fails contrast with cream text) |
| `charcoal` | `#2A2A2A` | — | body text — no pure black |
| `olive` | `#00C1AE` | teal-500 | Call tile (dark text) |
| `blue` | `#5B87BF` | harbor-400 | Visit tile |
| `gold` | `#FFC107` | mly-500 | Screen Share tile (dark text) |
| `purple` | `#3664A2` | harbor-600 | Family tile |
| `success` / `warn` / `danger` | `#4A7C59` / `#C4872A` / `#B34040` | — | semantic status only |

Hardcoded brand hexes also live in: `portal/src/index.css` (focus ring),
`site/src/styles/global.css` (focus ring), `portal/src/pages/system/SystemArch.jsx`
(SVG diagram), `portal/src/data/mock.json` (`admin.brand.colors`,
`admin.revenue.methods[].color`, `system.memory.segments[].color`).

Full MiLyfe scales for reference (harbor 50–950 `#e8eef5`…`#0d1b33`,
teal 50–900 `#e0f7f5`…`#006558`, mly 50–900 `#fff8e1`…`#ff6f00`).

## Type

Local/offline builds intentionally use system stacks (no external font CDNs):
Georgia/"Times New Roman" serif for headlines, system-ui stack for body.
PRODUCTION: swap to **Lora** (headings) + **Inter** (body) via `<link>` in
`site/src/layouts/Layout.astro` and `portal/index.html` (marked in comments).
The MiLyfe OS itself uses Atkinson Hyperlegible — if you want that instead,
say so and we'll align all three.
