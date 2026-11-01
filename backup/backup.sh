#!/bin/sh
# ============================================================================
# MiForge - MOCK backup loop (local dev only).
# Logs "backup complete" once a day. Nothing is actually written.
# For real deployments, replace this container with restic/kopia targeting
# Backblaze B2 (deliberately NOT part of the local stack).
# ============================================================================
while true; do
    echo "[backup] $(date -u '+%Y-%m-%dT%H:%M:%SZ') backup complete (mock - local dev, nothing written)"
    sleep 86400
done
