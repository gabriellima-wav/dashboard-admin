import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      'zone.js': 'zone.js/dist/zone.js'
    }
  },
  optimizeDeps: {
    include: ['zone.js'],
    force: true
  },
  esbuild: {
    target: 'es2020'
  }
});
