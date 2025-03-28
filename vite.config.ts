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
