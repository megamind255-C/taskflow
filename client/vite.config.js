// client/vite.config.js
// Vite config. The /api proxy means frontend requests to /api/* are
// forwarded to the backend at localhost:5000 during dev — this sidesteps
// CORS entirely if we use relative URLs. We will still use the full URL
// in services for clarity, but this is a useful safety net.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});