<?php
// MiForge local Nextcloud config.
// Mounted into /var/www/html/config/ (the official image merges every
// *.config.php in that directory). Makes Nextcloud serve under the
// /files sub-path so Caddy can route it at http://localhost/files.
$CONFIG = array(
    'overwritewebroot'   => '/files',
    'overwrite.cli.url'  => 'http://localhost/files',
    'overwritehost'      => 'localhost',
    'overwriteprotocol'  => 'http',
    'trusted_domains'    => array('localhost', '127.0.0.1'),
    // keep everything local; no external lookups
    'upgrade.autochecker' => false,
);
