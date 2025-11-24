import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      // Polyfills para módulos do Node.js
      events: 'events',
      stream: 'stream-browserify',
      buffer: 'buffer',
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      // Define global para o esbuild também
      define: {
        global: 'globalThis',
      },
    },
  },
});
