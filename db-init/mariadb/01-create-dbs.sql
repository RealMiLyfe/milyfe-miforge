-- ============================================================================
-- MiForge - MariaDB 11 init (Invoice Ninja only).
-- Mounted into /docker-entrypoint-initdb.d/ of the `mariadb` service.
-- MARIADB_DATABASE=ninja in docker-compose.yml already creates the database;
-- this file is the explicit, idempotent version of the same step.
-- ============================================================================
CREATE DATABASE IF NOT EXISTS ninja CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON ninja.* TO 'ninja'@'%';
FLUSH PRIVILEGES;
