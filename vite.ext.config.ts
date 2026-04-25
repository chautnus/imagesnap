import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    {
      name: 'post-build-cleanup',
      closeBundle() {
        if (!existsSync('dist-ext')) mkdirSync('dist-ext');
        // Copy manifest
        copyFileSync('src/extension/manifest.json', 'dist-ext/manifest.json');
        
        // Copy icons
        const icons = ['icon16.png', 'icon32.png', 'icon48.png', 'icon128.png'];
        icons.forEach(icon => {
          const srcPath = path.resolve(__dirname, `src/extension/${icon}`);
          if (existsSync(srcPath)) {
            copyFileSync(srcPath, `dist-ext/${icon}`);
          }
        });

        // Move index.html from src/extension/index.html to root
        const popupPath = path.resolve(__dirname, 'dist-ext/src/extension/index.html');
        if (existsSync(popupPath)) {
          copyFileSync(popupPath, 'dist-ext/index.html');
        }
      },
    },
  ],
  build: {
    outDir: 'dist-ext',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/extension/index.html'),
        background: path.resolve(__dirname, 'src/extension/background.js'),
        content: path.resolve(__dirname, 'src/extension/content_script.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
});
