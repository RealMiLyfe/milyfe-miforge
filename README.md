# milyfe-miforge

**MiForge Founder Services** ([miforgefs.milyfe.fun](https://miforgefs.milyfe.fun)) —
in-home tech help in Jacksonville, FL, built on **MiForge OS**, the white-labelable
platform that is part of the **MiLyfe economy** (milyfe.fun). The service and the OS
are separate products; this repo ships the service's front ends plus the local
dev stack.

- `site/` — marketing site (Astro + Tailwind), `npm run dev` → http://localhost:4321
- `portal/` — client portal PWA + operator admin + family portal + system overview
  (Vite + React + Tailwind), `npm run dev` → http://localhost:5173
- Docker Compose local stack (Caddy, Postgres 16, MariaDB 11, NocoDB, Nextcloud,
  Vaultwarden, Invoice Ninja, n8n, Uptime Kuma, ntfy, Chatwoot, Formbricks, backup)
  — see **README-LOCAL.md**
- `docs/brand.md` — logo, colors, naming (MiForge FS vs MiForge OS)

Brand: MiLyfe palette (harbor `#1E3A6E` / teal `#00C1AE` / mly `#FFC107`) on warm
cream `#F5F0E8`. Phone everywhere: 904-562-0544 → `tel:9045620544`.
