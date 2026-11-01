# MiForge n8n workflows

Three sample workflows, pre-imported automatically on first
`docker compose up -d` by the `n8n-import` one-shot service
(`n8n import:workflow --input=...`). To re-import manually:

```bash
docker compose run --rm n8n-import
docker compose exec n8n n8n import:workflow --input=/workflows/01-new-client-welcome.json
```

(or import via the n8n UI: **Workflows → Import from File**)

| File | Trigger | What it does |
|---|---|---|
| `01-new-client-welcome.json` | Webhook `POST /webhook/miforge-new-client` | Sends a welcome email to a new client, then posts to ntfy topic `miforge-clients` |
| `02-48-hour-follow-up.json` | Cron `0 10 * * *` (daily 10:00) | Finds clients whose last visit was exactly 2 days ago, sends a follow-up email, posts to ntfy |
| `03-14-day-check-in.json` | Cron `0 9 * * 1` (Mondays 09:00) | Finds Active clients with no visit in 14+ days, sends a check-in email, posts to ntfy |

## Two things to fill in after first open of http://localhost:5678

1. **SMTP credential** named exactly `MiForge Dev SMTP (mock)`
   (Settings → Credentials → Add → SMTP) with the mock values:
   - host `smtp.miforge.local`, port `587`, TLS on
   - user `n8n@miforge.local`, password `miforge-dev-2025`

   These are intentionally mock — nothing is ever sent locally. To actually
   see outgoing mail in a browser, swap the host for a local Mailpit
   (`axllent/mailpit`, SMTP on 1025, web UI on 8025) later.

2. **NocoDB table ID + API token** in the `Set table IDs` node of workflows
   02 and 03 (`REPLACE_WITH_CLIENTS_TABLE_ID`, `REPLACE_WITH_NOCODB_API_TOKEN`):
   - Table ID: in NocoDB open the **Clients** table → the id is in the table
     URL / API docs (or via `GET /api/v2/meta/bases` → tables).
   - API token: NocoDB → Team & Settings → API Tokens → New token.

## Wiring the welcome webhook

In NocoDB: open the **Clients** table → Automations → New webhook →
`POST http://n8n:5678/webhook/miforge-new-client` (after insert).
From the laptop the public URL is `http://localhost:5678/webhook/miforge-new-client`.
