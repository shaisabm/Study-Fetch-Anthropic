import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://study-fetch-anthropic.vercel.app:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})