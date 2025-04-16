import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: 'window', // 讓 `global` 指向 `window`
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // 每次啟動會自動檢查更新
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'android-chrome-512x512.png', '/android-chrome-192x192.png'],
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
      },
      manifest: {
        name: 'Cooba',
        short_name: 'Cooba',
        description: 'Cooba App 聊天室',
        theme_color: '#070809',
        background_color: '#070809',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/apple-touch-icon.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/favicon.ico',
            sizes: '48x48',
            type: 'image/png'
          }
        ]
      }
    }),
  ],
  server: {
    open: true,
    proxy: {
      '/ws': {
        target: 'ws://localhost:8080', // 後端 WebSocket server
        ws: true,                      // 啟用 WebSocket 代理
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''), // 可選：重寫路徑
      },
    }
  },
  build: {
    outDir: 'dist', // 打包輸出的資料夾，可自訂
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
})