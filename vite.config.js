import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const apiProxy = {
  '/api': {
    target: 'http://127.0.0.1:4177',
    changeOrigin: true
  }
}

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    port: 5175,
    proxy: apiProxy
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    proxy: apiProxy
  },
  build: {
    target: 'es2020',
    cssCodeSplit: false
  }
})

