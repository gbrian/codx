import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VUE_APP_PUBLIC_PATH,
  server: {
    host: true,
    port: 8080,
    hmr: {
      port: process.env.CODX_WEB_PORT,
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  define: {
    'process.env': process.env
  }
})
