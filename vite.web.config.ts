import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: 'src/web',
  build: {
    outDir: '../../dist-web',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  server: {
    port: 8080,
    host: true,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
});
