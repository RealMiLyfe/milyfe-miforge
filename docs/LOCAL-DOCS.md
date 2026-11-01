# MiForge OS — spec (local markdown docs)

> Outline (the docs app) is intentionally **cut** from the local stack: it
> requires an OIDC/SAML SSO provider plus its own Postgres/Redis, which blows
> the 8 GB laptop budget for zero local-dev value. The docs live here as
> plain markdown instead — open this file in any editor or `git`-friendly
> viewer.

## Services (see README-LOCAL.md for URLs)

| App | Role | Local URL |
|---|---|---|
| NocoDB | CRM | http://localhost:8080 |
| Nextcloud | file storage | http://localhost/files |
| Vaultwarden | password vault | http://localhost:8082 |
| Invoice Ninja | invoicing | http://localhost:8083 |
| n8n | automation | http://localhost:5678 |
| Uptime Kuma | monitoring | http://localhost:3001 |
| ntfy | push notifications | http://localhost/notify |
| Chatwoot | live chat | http://localhost:8084 |
| Formbricks | forms/surveys | http://localhost:3002 |

## CRM data model (7 tables, seeded in `nocodb/seed.sql`)

1. **Clients** — client_number, full_name, age, descriptor, source, status
   (Lead/Active/Completed), tier (Session/Partnership), phone, email,
   address, devices, tech_comfort (Zero/Low/Medium/High), payment_terms,
   monthly_amount, referred_by, last_visit_date, notes
2. **Visits** — client_id, visit_date, duration_hours, tier, amount_due,
   amount_paid, payment_method, notes
3. **Invoices** — invoice_number, client_id, issue_date, due_date, amount,
   currency, status (Draft/Sent/Paid/Overdue), payment_method, paid_date, notes
4. **Referrals** — referrer_client_id, referred_name, referred_contact,
   source, status, date_referred, notes
5. **Templates Library** — name, category, content, status
   (Awaiting Operator Access/Approved/Draft)
6. **Jewels** — client_id, quote, context, date_captured
7. **Consent & Access Log** — client_id, consent_type (Verbal/Written/Implied),
   scope, granted, granted_date, revoked_date, notes

## Payment methods (Invoice Ninja)

Cash, CashApp, Venmo, Chime, Check, Whop — all configured as offline
payment methods. Currency: USD.

## Sample clients

- **C-001 Bruce**, 74, preacher, Craigslist, Completed, Session tier,
  $150 cash paid, 3-hour visit building a book inventory system with
  Arena AI + Google Sheets.
- **C-002 Margaret**, 81, widow, church referral, Active, Partnership tier,
  $200/month, tech comfort Zero, device: Desktop (Windows 7).
- **C-003 Robert & Diane**, 70s couple, Nextdoor, Lead, not booked yet,
  referred by Margaret.
