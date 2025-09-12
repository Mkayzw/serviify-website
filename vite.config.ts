import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import generateSitemap from 'vite-plugin-sitemap'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Serviify - Find Local Service Providers | All Services in One Platform',
          description: 'Connect with trusted local service providers on Serviify. From home repairs to professional services, find reliable providers for all your needs.'
        }
      }
    }),
    generateSitemap({
      hostname: 'https://serviify.co.zw',
      dynamicRoutes: [
        '/',
        '/services',
        '/about',
        '/support',
        '/help-centre',
        '/auth',
        '/provider-search',
        '/privacy-policy',
        '/terms-of-service'
      ],
      changefreq: 'weekly',
      priority: 0.8
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // This configuration allows for the development server to properly 
    // handle page reloads when using React Router
    proxy: {
      '/api': {
        target: 'https://serviify-container.calmriver-5338a541.southafricanorth.azurecontainerapps.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    // Makes sure the build outputs a single-page application that works with React Router
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  
    copyPublicDir: true,
  },
})
