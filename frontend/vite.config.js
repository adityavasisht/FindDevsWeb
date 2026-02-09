import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Used for 'npm run dev'
    host: true, // Exposes host for AWS/Network access
  },
  preview: {
    port: 5173, // <--- IMPORTANT: Used for 'npm run preview' (Production)
    host: true,
  }
})