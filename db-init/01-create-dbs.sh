#!/bin/bash
# ============================================================================
# MiForge - Postgres 16 init script.
# Mounted into /docker-entrypoint-initdb.d/ of the `postgres` service, so it
# runs automatically on first boot of the shared Postgres.
#
# Creates the databases for: NocoDB, Nextcloud, n8n, Formbricks, Chatwoot
# (+ the extensions those apps need).
#
# The MariaDB side lives in db-init/mariadb/01-create-dbs.sql because MariaDB
# is a separate container with its own init directory.
# ============================================================================
set -euo pipefail

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE nocodb;
    CREATE DATABASE nextcloud;
    CREATE DATABASE n8n;
    CREATE DATABASE formbricks;
    CREATE DATABASE chatwoot;
EOSQL

# Formbricks needs pgvector:
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname formbricks \
    -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Chatwoot needs pgcrypto + pg_trgm:
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname chatwoot <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
EOSQL

echo "MiForge: created databases nocodb, nextcloud, n8n, formbricks, chatwoot"
