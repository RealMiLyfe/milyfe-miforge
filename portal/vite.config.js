import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Local dev only - no external hosting, no analytics.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // allow the sandbox preview host (and any host) for local preview
    allowedHosts: true,
  },
  preview: { host: '0.0.0.0', port: 4173, allowedHosts: true },
});
