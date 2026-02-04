import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { execSync } from 'child_process'

// Find a free port dynamically
function findFreePort(startPort = 1420, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i
    try {
      // Try to check if port is in use (macOS/Linux)
      execSync(`lsof -Pi :${port} -sTCP:LISTEN -t`, { stdio: 'ignore' })
    } catch {
      // Port is free
      return port
    }
  }
  return startPort // Fallback
}

const PORT = findFreePort()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    host: '127.0.0.1',
    port: PORT,
    strictPort: false, // Allow fallback to next available port
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    target: ['es2021', 'chrome100', 'safari13'],
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
  // Log the port so Tauri can use it
  define: {
    __VITE_PORT__: JSON.stringify(PORT),
  },
})
