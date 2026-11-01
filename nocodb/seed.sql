-- ============================================================================
-- MiForge CRM - NocoDB seed (PostgreSQL).
--
-- Creates the 7 MiForge tables in the `nocodb` database and inserts the
-- sample data. NocoDB is connected to this same Postgres (NC_DB), so after
-- it is up it will show these tables in the UI automatically.
--
-- Runs automatically on first `docker compose up -d` via the `seeder`
-- one-shot service. To re-run manually:
--   docker compose exec postgres psql -U miforge -d nocodb -f /seed/seed.sql
--   (mount: ./nocodb/seed.sql -> /seed/seed.sql in the postgres container is
--    only set on the seeder service; for the postgres container use:)
--   docker compose exec -T postgres psql -U miforge -d nocodb < nocodb/seed.sql
--
-- Idempotent: drops and recreates the MiForge tables.
-- ============================================================================

BEGIN;

DROP TABLE IF EXISTS "Consent & Access Log" CASCADE;
DROP TABLE IF EXISTS "Jewels" CASCADE;
DROP TABLE IF EXISTS "Templates Library" CASCADE;
DROP TABLE IF EXISTS "Referrals" CASCADE;
DROP TABLE IF EXISTS "Invoices" CASCADE;
DROP TABLE IF EXISTS "Visits" CASCADE;
DROP TABLE IF EXISTS "Clients" CASCADE;

-- ---------------------------------------------------------------------------
-- 1. Clients
-- ---------------------------------------------------------------------------
CREATE TABLE "Clients" (
    id              SERIAL PRIMARY KEY,
    client_number   VARCHAR(10)  UNIQUE NOT NULL,          -- C-001 ...
    full_name       VARCHAR(200) NOT NULL,
    age             INTEGER,
    descriptor      VARCHAR(200),                          -- preacher, widow, couple ...
    source          VARCHAR(100),                          -- Craigslist, church referral, Nextdoor ...
    status          VARCHAR(30)  NOT NULL DEFAULT 'Lead',  -- Lead | Active | Completed
    tier            VARCHAR(30),                           -- Session | Partnership | NULL (not booked)
    phone           VARCHAR(50),
    email           VARCHAR(200),
    address         VARCHAR(300),
    devices         TEXT,
    tech_comfort    VARCHAR(20),                           -- Zero | Low | Medium | High
    payment_terms   TEXT,
    monthly_amount  NUMERIC(10,2),
    referred_by     VARCHAR(200),
    last_visit_date DATE,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 2. Visits
-- ---------------------------------------------------------------------------
CREATE TABLE "Visits" (
    id             SERIAL PRIMARY KEY,
    client_id      INTEGER NOT NULL REFERENCES "Clients"(id) ON DELETE CASCADE,
    visit_date     DATE NOT NULL,
    duration_hours NUMERIC(4,1),
    tier           VARCHAR(30),
    amount_due     NUMERIC(10,2),
    amount_paid    NUMERIC(10,2),
    payment_method VARCHAR(50),                            -- Cash | CashApp | Venmo | Chime | Check | Whop
    notes          TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3. Invoices
-- ---------------------------------------------------------------------------
CREATE TABLE "Invoices" (
    id             SERIAL PRIMARY KEY,
    invoice_number VARCHAR(30) UNIQUE NOT NULL,            -- INV-2026-001 ...
    client_id      INTEGER NOT NULL REFERENCES "Clients"(id) ON DELETE CASCADE,
    issue_date     DATE NOT NULL,
    due_date       DATE,
    amount         NUMERIC(10,2) NOT NULL,
    currency       CHAR(3) NOT NULL DEFAULT 'USD',
    status         VARCHAR(20) NOT NULL DEFAULT 'Draft',   -- Draft | Sent | Paid | Overdue
    payment_method VARCHAR(50),
    paid_date      DATE,
    notes          TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 4. Referrals
-- ---------------------------------------------------------------------------
CREATE TABLE "Referrals" (
    id                SERIAL PRIMARY KEY,
    referrer_client_id INTEGER REFERENCES "Clients"(id) ON DELETE SET NULL,
    referred_name     VARCHAR(200) NOT NULL,
    referred_contact  VARCHAR(200),
    source            VARCHAR(100),
    status            VARCHAR(30) NOT NULL DEFAULT 'Lead', -- Lead | Booked | Converted
    date_referred     DATE NOT NULL DEFAULT CURRENT_DATE,
    notes             TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 5. Templates Library
-- ---------------------------------------------------------------------------
CREATE TABLE "Templates Library" (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(200) NOT NULL,
    category   VARCHAR(100),
    content    TEXT,
    status     VARCHAR(40) NOT NULL DEFAULT 'Awaiting Operator Access',  -- Awaiting Operator Access | Approved | Draft
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 6. Jewels  (memorable things clients say)
-- ---------------------------------------------------------------------------
CREATE TABLE "Jewels" (
    id            SERIAL PRIMARY KEY,
    client_id     INTEGER REFERENCES "Clients"(id) ON DELETE SET NULL,
    quote         TEXT NOT NULL,
    context       TEXT,
    date_captured DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 7. Consent & Access Log
-- ---------------------------------------------------------------------------
CREATE TABLE "Consent & Access Log" (
    id           SERIAL PRIMARY KEY,
    client_id    INTEGER NOT NULL REFERENCES "Clients"(id) ON DELETE CASCADE,
    consent_type VARCHAR(30) NOT NULL,                     -- Verbal | Written | Implied
    scope        VARCHAR(200) NOT NULL,                    -- what exactly was consented to
    granted      BOOLEAN NOT NULL DEFAULT TRUE,
    granted_date DATE NOT NULL DEFAULT CURRENT_DATE,
    revoked_date DATE,
    notes        TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- 3 sample clients -----------------------------------------------------------
INSERT INTO "Clients"
    (client_number, full_name, age, descriptor, source, status, tier, phone, email, address, devices, tech_comfort, payment_terms, monthly_amount, referred_by, last_visit_date, notes)
VALUES
    ('C-001', 'Bruce', 74, 'Preacher', 'Craigslist', 'Completed', 'Session',
     '904-555-0141', 'bruce@example.com', 'Riverside, Jacksonville, FL',
     'Desktop (Windows 10), Android phone', 'Medium',
     'One-time session, $150 cash paid at the visit', NULL, NULL, '2026-09-12',
     '3-hour visit building a book inventory system with Arena AI + Google Sheets. Left a printed index of his sermon archive and a cheat sheet.'),
    ('C-002', 'Margaret', 81, 'Widow', 'Church referral', 'Active', 'Partnership',
     '904-555-0187', 'margaret@example.com', 'Mandarin, Jacksonville, FL',
     'Desktop (Windows 7)', 'Zero',
     'Partnership, $200/month via Venmo', 200.00, NULL, '2026-10-18',
     'Prefers phone calls over email. Keep every instruction to one page, large print. Windows 7 - do not upgrade.'),
    ('C-003', 'Robert & Diane', 70, 'Couple, both in their 70s', 'Nextdoor', 'Lead', NULL,
     '904-555-0122', 'robert.diane@example.com', 'San Marco, Jacksonville, FL',
     'Laptop (Windows 11), two iPhones', 'Low',
     NULL, NULL, 'Margaret (C-002)', '2026-10-25',
     'Interested in organizing photos and email. Free consult done; full session not booked yet.');

-- 5 sample visits -------------------------------------------------------------
INSERT INTO "Visits"
    (client_id, visit_date, duration_hours, tier, amount_due, amount_paid, payment_method, notes)
VALUES
    (1, '2026-09-12', 3.0, 'Session', 150.00, 150.00, 'Cash',
     'Built a book inventory system in Google Sheets with Arena AI: every book gets a row (title, author, year, condition, shelf). Scanned 40 books together; Bruce finishes the rest himself using the printed cheat sheet.'),
    (2, '2026-09-20', 2.0, 'Partnership', 200.00, 200.00, 'Venmo',
     'Helped Margaret set up video calling with her granddaughter. Left a one-page cheat sheet taped to her monitor.'),
    (2, '2026-10-04', 1.5, 'Partnership', 200.00, 200.00, 'Venmo',
     'Monthly check-in: updated Windows 7 as far as it will safely go, cleaned up desktop icons, practiced the video-call steps again from the cheat sheet.'),
    (2, '2026-10-18', 2.0, 'Partnership', 200.00, 0.00, NULL,
     'Set up email filters and a scam-spotting routine. October payment still outstanding - follow up by phone.'),
    (3, '2026-10-25', 0.5, 'Consult (free)', 0.00, 0.00, NULL,
     'Free 30-minute intro consult at the San Marco farmers market: showed them how to back up photos to Google Photos. Full session pending.');

-- 3 sample invoices -----------------------------------------------------------
INSERT INTO "Invoices"
    (invoice_number, client_id, issue_date, due_date, amount, currency, status, payment_method, paid_date, notes)
VALUES
    ('INV-2026-001', 1, '2026-09-12', '2026-09-12', 150.00, 'USD', 'Paid', 'Cash', '2026-09-12',
     'Session visit - book inventory system (3 hours). Paid in cash on site.'),
    ('INV-2026-002', 2, '2026-10-01', '2026-10-15', 200.00, 'USD', 'Paid', 'Venmo', '2026-10-04',
     'Partnership - October 2026.'),
    ('INV-2026-003', 2, '2026-10-18', '2026-11-01', 200.00, 'USD', 'Sent', NULL,
     'Partnership - November 2026. Sent by email; follow up by phone if unpaid by the due date.');

-- 1 sample referral -----------------------------------------------------------
INSERT INTO "Referrals"
    (referrer_client_id, referred_name, referred_contact, source, status, date_referred, notes)
VALUES
    (2, 'Robert & Diane', 'robert.diane@example.com / 904-555-0122', 'Nextdoor', 'Lead', '2026-10-11',
     'Margaret met them at church and passed along our card; they also found us on Nextdoor after that.');

-- 1 sample template -----------------------------------------------------------
INSERT INTO "Templates Library" (name, category, content, status)
VALUES
    ('First-Visit Intake Script', 'Intake',
     '1) Greet and confirm today''s goals. 2) Ask which devices they own and use most. 3) Agree on a flat price before starting. 4) Record consent in the Consent & Access Log. 5) Leave a one-page cheat sheet, taped to the monitor if they like.',
     'Awaiting Operator Access');

-- 2 sample jewels -------------------------------------------------------------
INSERT INTO "Jewels" (client_id, quote, context, date_captured)
VALUES
    (2, 'My husband always said the machine should work for you, not the other way around. I think he''d like you.',
     'Said while we set up video calling with her granddaughter.', '2026-09-20'),
    (1, 'Every book in this house has a story - now every story has a row in a spreadsheet, and I can actually find them.',
     'Bruce, at the end of the first inventory session.', '2026-09-12');

-- Consent log entries for every client ----------------------------------------
INSERT INTO "Consent & Access Log" (client_id, consent_type, scope, granted, granted_date, notes)
VALUES
    (1, 'Verbal',  'Remote access to his desktop during the scheduled visit', TRUE, '2026-09-12',
     'Confirmed by phone before the visit; access ended when the visit ended.'),
    (1, 'Written', 'Store visit notes and invoice records in MiForge systems', TRUE, '2026-09-12',
     'Paper consent form signed at the visit; copy in Nextcloud clients/Bruce/consent/.'),
    (2, 'Written', 'Remote access to her desktop (Windows 7) for monthly check-ins', TRUE, '2026-09-20',
     'Signed consent form on file in Nextcloud clients/Margaret/consent/.'),
    (2, 'Written', 'One photo of the cheat-sheet setup for our records', TRUE, '2026-09-20',
     'Monitor + cheat sheet only, no faces.'),
    (2, 'Implied', 'Phone follow-ups about unpaid invoices', TRUE, '2026-10-18',
     'Prefers phone over email.'),
    (3, 'Verbal',  'Contact by phone/email about a future booking', TRUE, '2026-10-25',
     'No remote access granted yet - no session booked.');

COMMIT;
