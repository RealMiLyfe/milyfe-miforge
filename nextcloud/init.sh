#!/bin/sh
# ============================================================================
# MiForge - Nextcloud first-boot folder setup (runs once, as the
# `nextcloud-init` container, using the nextcloud image's curl).
#
# Pre-creates the clients/ folder structure via WebDAV (MKCOL) logged in as
# the admin user that the official image creates from NEXTCLOUD_ADMIN_* env.
# ============================================================================
set -eu

NC_URL="${NC_URL:-http://nextcloud}"
NC_USER="${NC_USER:?NC_USER required}"
NC_PASS="${NC_PASS:?NC_PASS required}"

FOLDERS="
clients
clients/Bruce
clients/Bruce/visits
clients/Bruce/invoices
clients/Bruce/consent
clients/Margaret
clients/Margaret/visits
clients/Margaret/invoices
clients/Margaret/consent
clients/Robert-and-Diane
clients/Robert-and-Diane/visits
clients/Robert-and-Diane/invoices
clients/Robert-and-Diane/consent
clients/_shared
clients/_shared/templates
"

# Wait for Nextcloud to finish installing (admin user exists => PROPFIND works)
i=0
until curl -sf -u "$NC_USER:$NC_PASS" -X PROPFIND -H "Depth: 0" \
      "$NC_URL/remote.php/dav/files/$NC_USER/" >/dev/null 2>&1; do
  i=$((i + 1))
  if [ "$i" -gt 60 ]; then
    echo "nextcloud-init: Nextcloud did not become ready in time" >&2
    exit 1
  fi
  echo "nextcloud-init: waiting for nextcloud... ($i)"
  sleep 5
done

for f in $FOLDERS; do
  enc=$(printf '%s' "$f" | sed 's/ /%20/g')
  code=$(curl -s -o /dev/null -w '%{http_code}' -u "$NC_USER:$NC_PASS" \
         -X MKCOL "$NC_URL/remote.php/dav/files/$NC_USER/$enc")
  case "$code" in
    201) echo "created /$f" ;;
    405) echo "exists  /$f" ;;
    *)   echo "WARN: MKCOL /$f -> HTTP $code" ;;
  esac
done

echo "nextcloud-init: clients/ folder structure ready"
