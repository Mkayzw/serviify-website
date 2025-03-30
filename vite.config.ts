import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
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
