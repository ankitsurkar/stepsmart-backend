import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        liveHost: new URL('./live/host.html', import.meta.url).pathname,
        livePhone: new URL('./live/phone.html', import.meta.url).pathname,
        liveReplay: new URL('./live/replay.html', import.meta.url).pathname,
        livePreview: new URL('./live/preview.html', import.meta.url).pathname,
      },
    },
  },
  server: {
    proxy: {
      '/learn': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
