import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import tailwind from 'tailwindcss';

export default defineConfig({
  plugins: [react()], // Temporairement, retirons @tailwindcss/vite
  css: {
    postcss: {
      plugins: [
        tailwind(),
        autoprefixer(),
      ],
    },
  },
});