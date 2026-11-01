// ============================================================================
// MiForge - one-shot Uptime Kuma monitor setup.
//
// Kuma has no config-file import, so we drive its socket.io API once at boot:
// create the admin user if needed, log in, then add a monitor for every other
// MiForge service.
//
// NOTE: monitors use in-network service names (http://nocodb:8080, ...) or
// the Caddy front door (http://caddy/...), because from inside a container
// "localhost" is the container itself, not the laptop.
// ============================================================================
import { io } from "socket.io-client";

const KUMA_URL = process.env.KUMA_URL || "http://kuma:3001";
const USER = process.env.KUMA_ADMIN_USER || "admin";
const PASS = process.env.KUMA_ADMIN_PASSWORD || "miforge-dev-2025";

const MONITORS = [
  { name: "Caddy front door (localhost)", url: "http://caddy/" },
  { name: "Nextcloud via Caddy /files",   url: "http://caddy/files/login" },
  { name: "ntfy via Caddy /notify",      url: "http://caddy/notify/" },
  { name: "NocoDB (CRM)",                url: "http://nocodb:8080/" },
  { name: "Vaultwarden",                 url: "http://vaultwarden/alive" },
  { name: "Invoice Ninja",               url: "http://ninja/" },
  { name: "n8n",                         url: "http://n8n:5678/healthz" },
  { name: "Chatwoot",                    url: "http://chatwoot:3000/" },
  { name: "Formbricks",                  url: "http://formbricks:3000/" },
  { name: "Postgres 16",                 url: "postgres:5432",  type: "tcp" },
  { name: "MariaDB 11",                  url: "mariadb:3306",   type: "tcp" },
  { name: "Redis",                       url: "redis:6379",     type: "tcp" },
];

const socket = io(KUMA_URL, { transports: ["websocket"], reconnectionAttempts: 60 });

const emit = (event, ...args) =>
  new Promise((resolve, reject) => {
    socket.emit(event, ...args, (res) => {
      if (res && res.ok === false) reject(new Error(`${event}: ${JSON.stringify(res)}`));
      else resolve(res);
    });
  });

async function main() {
  await new Promise((resolve, reject) => {
    socket.on("connect", resolve);
    socket.on("connect_error", reject);
  });
  console.log("connected to", KUMA_URL);

  const setupNeeded = await new Promise((res) => socket.emit("needSetup", res));
  if (setupNeeded) {
    await emit("setup", USER, PASS, `${USER}@miforge.local`);
    console.log("created admin user:", USER);
  }

  await emit("login", { username: USER, password: PASS, token: "" });
  console.log("logged in as", USER);

  for (const m of MONITORS) {
    const monitor = {
      type: m.type || "http",
      name: m.name,
      url: m.url,
      interval: 60,
      retryInterval: 60,
      maxretries: 3,
      active: true,
      notificationIDList: [],
    };
    if (m.type === "tcp") {
      const [host, port] = m.url.split(":");
      monitor.hostname = host;
      monitor.port = Number(port);
      delete monitor.url;
    }
    await emit("addMonitor", monitor);
    console.log("added monitor:", m.name);
  }

  socket.disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error("kuma-setup failed:", e.message || e);
  process.exit(1);
});

setTimeout(() => {
  console.error("kuma-setup timed out");
  process.exit(1);
}, 180000);
