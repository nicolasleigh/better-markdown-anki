import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Customize asset file names
        assetFileNames: (assetInfo) => {
          // Check if the asset is a common font type
          if (/\.(ttf|woff|woff2|eot|otf)$/.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`; // Place fonts in 'assets/fonts/'
          }
          // Default behavior for other assets (e.g., images, css, js)
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
});