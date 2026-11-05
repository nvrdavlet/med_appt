import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The production build is written to server/build so the backend can serve it.
// base: './' keeps asset paths relative so the build also works on any static host.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 3000, open: true },
  build: {
    outDir: 'server/build',
    emptyOutDir: true,
  },
});
