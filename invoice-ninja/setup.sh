#!/usr/bin/env bash
# ============================================================================
# MiForge - (re)run the Invoice Ninja post-setup one-shot container.
#
# Use after completing first-run setup once at http://localhost:8083
# (login admin@miforge.local / miforge-dev-2025), or any time you want to
# re-apply company settings / payment methods / sample invoices.
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")/.."

docker compose up --force-recreate ninja-setup
