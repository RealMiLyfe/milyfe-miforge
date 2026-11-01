# MiForge OS — local development environment

Everything runs on your laptop with Docker Compose. No cloud (no Oracle, no
Cloudflare Pages, no Backblaze, no external DNS). All images are pinned and
multi-arch (amd64 + arm64), total memory budget < 8 GB, telemetry disabled.

## Run these 3 commands

```bash
git clone <this-repo-url> milyfe-miforge && cd milyfe-miforge
cp .env.example .env
docker compose up -d
```

Optional finishing touches (Chatwoot super-admin, Nextcloud file rescan,
telemetry-off switches):

```bash
./scripts/post-setup.sh
```

First `up` also runs one-shot jobs automatically: databases are created
(`db-init/`), the CRM is seeded (`seeder` → `nocodb/seed.sql`), the
`clients/` tree is created in Nextcloud (`nextcloud-init`), monitors are
added to Uptime Kuma (`kuma-setup`), and the 3 n8n workflows are imported
(`n8n-import`).

## Port / URL mapping

| App | Type | Open this | Notes |
|---|---|---|---|
| Caddy front door | path | http://localhost | landing page listing all apps (https://localhost also works; `docker compose exec caddy caddy trust` once to silence the cert warning) |
| Nextcloud (files) | **path** | http://localhost/files | Nextcloud supports sub-paths natively (`overwritewebroot=/files`). Direct port: http://localhost:8081/files |
| ntfy (notify) | **path** | http://localhost/notify | ntfy runs with `--base-url /notify`. CLI publish (no prefix): `curl -d "hi" http://localhost:8089/miforge` |
| NocoDB (CRM) | port | http://localhost:8080 | port-based because NocoDB builds absolute URLs and breaks behind a stripped prefix |
| Vaultwarden (vault) | port | http://localhost:8082 | port-based: websockets + absolute `/api/*`. Admin panel: http://localhost:8082/admin |
| Invoice Ninja (invoice) | port | http://localhost:8083 | port-based: Laravel absolute redirects/assets |
| n8n (flow) | port | http://localhost:5678 | port-based: editor + webhooks are root-based |
| Uptime Kuma (status) | port | http://localhost:3001 | port-based: socket.io hardcoded at `/socket.io` |
| Chatwoot (chat) | port | http://localhost:8084 | port-based: Rails absolute asset/cable paths. App at `/app` |
| Formbricks (forms) | port | http://localhost:3002 | port-based: Next.js router is root-based |
| Postgres 16 | laptop-only | `127.0.0.1:5432` | psql / DBeaver |
| MariaDB 11 | laptop-only | `127.0.0.1:3306` | Invoice Ninja DB |

## Login credentials (all from `.env.example`, dev-safe)

| App | Login |
|---|---|
| NocoDB | first open → sign up: `operator@miforge.local` / `miforge-dev-2025` (creates owner account) |
| Nextcloud | `admin` / `miforge-dev-2025` |
| Vaultwarden | signups disabled; admin panel http://localhost:8082/admin with token `miforge-dev-2025` (invite yourself there) |
| Invoice Ninja | `admin@miforge.local` / `miforge-dev-2025` (first-run setup; `ninja-setup` then applies company/payment methods/invoices) |
| n8n | first open → owner account: `operator@miforge.local` / `miforge-dev-2025`. Then create SMTP credential `MiForge Dev SMTP (mock)`: host `smtp.miforge.local`, port `587`, user `n8n@miforge.local`, pass `miforge-dev-2025` (see `n8n/workflows/README.md`) |
| Uptime Kuma | `admin` / `miforge-dev-2025` (auto-created by `kuma-setup`) |
| Chatwoot | `admin@miforge.local` / `miforge-dev-2025` (created by `./scripts/post-setup.sh`) |
| Formbricks | first open → sign up: `operator@miforge.local` / `miforge-dev-2025` |
| ntfy | no auth (local only) |
| Postgres | `miforge` / `miforge-dev-2025` |
| MariaDB | `ninja` / `miforge-dev-2025` (root: `miforge-dev-2025`) |

## Open these tabs in this order

1. **http://localhost** — Caddy landing page; confirms the proxy is up.
2. **http://localhost:8080** — NocoDB: sign up, then open the project and see
   the 7 seeded tables (Clients, Visits, Invoices, Referrals, Templates
   Library, Jewels, Consent & Access Log) with Bruce/Margaret/Robert & Diane.
3. **http://localhost/files** — Nextcloud: log in as `admin`, open the
   `clients/` folder (Bruce, Margaret, Robert-and-Diane, each with
   visits/invoices/consent subfolders).
4. **http://localhost:8082/admin** — Vaultwarden admin panel (token above);
   invite your first vault user.
5. **http://localhost:8083** — Invoice Ninja: log in; company "MiForge",
   USD, payment methods Cash/CashApp/Venmo/Chime/Check/Whop, 3 sample
   invoices (INV-2026-001/002/003).
6. **http://localhost:3001** — Uptime Kuma: all monitors should go green.
7. **http://localhost:5678** — n8n: 3 workflows imported (activate the ones
   you want; fill in the NocoDB table ID/token per `n8n/workflows/README.md`).
8. **http://localhost:8084** — Chatwoot: log in, create an inbox.
9. **http://localhost:3002** — Formbricks: sign up, create a form.
10. **http://localhost/notify** — ntfy: test with
    `curl -d "hello from MiForge" http://localhost:8089/miforge-test`
    and watch it appear in the browser tab.

## Memory budget (hard limits per container)

| Service | Limit |
|---|---|
| caddy | 128 MB |
| postgres (pgvector/pg16) | 1 GB |
| mariadb | 512 MB |
| redis | 128 MB |
| nocodb | 512 MB |
| nextcloud | 512 MB |
| vaultwarden | 128 MB |
| invoice ninja | 512 MB |
| uptime kuma | 256 MB |
| n8n | 512 MB |
| ntfy | 64 MB |
| chatwoot | 768 MB |
| formbricks | 384 MB |
| backup (mock) | 32 MB |
| **steady-state total** | **≈ 5.3 GB** (budget 8 GB, ~2.6 GB headroom) |
| one-shots (seeder, nextcloud-init, kuma-setup, n8n-import, ninja-setup) | 128–256 MB each, run once and exit |

## What was cut, and why

- **Outline (docs)** — cut. It hard-requires an OIDC/SAML SSO provider plus
  its own Postgres and Redis; that's another ~1 GB and real complexity for no
  local-dev value. The docs are served as local markdown in `docs/` instead.
- **Mailpit / real SMTP** — not added; n8n workflows use mock SMTP
  credentials (`smtp.miforge.local`) as requested. Add Mailpit later if you
  want to see outgoing mail (see `n8n/workflows/README.md`).
- **Cloudflare Pages / Backblaze / Oracle / external DNS** — excluded by
  constraint; the backup container is a mock that only logs "backup complete".

## Telemetry

Disabled explicitly: n8n (`N8N_DIAGNOSTICS_ENABLED=false`, version
notifications, templates, personalization), NocoDB (`NC_TELEMETRY_DISABLE`),
Formbricks (`TELEMETRY_DISABLED=1`), Nextcloud update/survey nags via
`scripts/post-setup.sh`. Vaultwarden, Uptime Kuma, ntfy, Chatwoot and Caddy
do not phone home.

## Useful commands

```bash
docker compose ps                              # status
docker compose logs -f <service>               # logs (e.g. backup, seeder, kuma-setup)
docker compose exec -T postgres psql -U miforge -d nocodb < nocodb/seed.sql   # re-seed CRM
docker compose up --force-recreate ninja-setup # re-apply Invoice Ninja config
./invoice-ninja/setup.sh                       # same, from the repo root
docker compose down -v                         # nuke everything (volumes too)
```
