import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: 'window', // 讓 `global` 指向 `window`
  },
  plugins: [react()],
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
      'livekit': {
        target: 'http://localhost',
      }
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
