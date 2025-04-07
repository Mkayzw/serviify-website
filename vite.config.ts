import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // This configuration allows for the development server to properly 
    // handle page reloads when using React Router
    proxy: {},
  },
  build: {
    // Makes sure the build outputs a single-page application that works with React Router
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
