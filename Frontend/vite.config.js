
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // All API calls to `/api` will be proxied to Django (running on http://localhost:8000)
      '/api': {
        target: 'http://localhost:8000', // Django server URL
        changeOrigin: true,
        secure: false, // Set to true if you're using HTTPS for the backend
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: strip the `/api` prefix
      },
    },
  },
});
