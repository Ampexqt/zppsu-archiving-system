import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'ZPPSU Archiving & Records Management System',
        short_name: 'ZPPSU Archive',
        description: 'ZPPSU Official Institutional Guidance Records and Archiving System',
        theme_color: '#4A0E1C',
        background_color: '#FFFCF7',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: '/logo.jpg',
            sizes: '192x192 512x512',
            type: 'image/jpeg',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
    host: true, // Listen on 0.0.0.0 so other laptops/devices on the same Wi-Fi/LAN can connect
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/exceljs')) {
            return 'excel';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor';
          }
        }
      }
    }
  }
})