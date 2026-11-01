import { defineConfig } from 'astro/config';

// Local dev only - no Cloudflare Pages, no external hosting.
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4321,
    // allow the sandbox preview host (and any host) for local preview
    allowedHosts: true,
  },
  build: { outDir: 'dist' },
});
