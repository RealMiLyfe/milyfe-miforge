#!/usr/bin/env bash
# ============================================================================
# MiForge - optional host-side finishing touches after `docker compose up -d`.
#
# Most setup is already automatic (DBs, NocoDB seed, Nextcloud folders, Kuma
# monitors, n8n workflows, Invoice Ninja config). This script covers the few
# things that need to run inside the app containers themselves.
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")/.."

echo "== Nextcloud: rescan files, silence update/survey nags (telemetry) =="
docker compose exec -u www-data nextcloud php occ files:scan --all || true
docker compose exec -u www-data nextcloud php occ config:app:set updatenotification enabled --value no || true
docker compose exec -u www-data nextcloud php occ config:app:set survey enabled --value no || true
docker compose exec -u www-data nextcloud php occ config:system:set upgrade.autochecker --value false --type bool || true

echo "== Chatwoot: create super admin admin@miforge.local / miforge-dev-2025 =="
docker compose exec chatwoot bundle exec rails runner '
  unless User.exists?(email: "admin@miforge.local")
    u = User.new(email: "admin@miforge.local", name: "MiForge Admin",
                 password: "miforge-dev-2025", password_confirmation: "miforge-dev-2025")
    u.skip_confirmation!
    u.save!
    begin
      SuperAdmin.create!(user: u)
    rescue StandardError
      nil
    end
    puts "created super admin"
  else
    puts "super admin already exists"
  end
' || true

echo "== Done. Open the apps in this order (see README-LOCAL.md) =="
