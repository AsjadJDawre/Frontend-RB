import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { 
      '/api': 'https://gas-agency-booking-woy3-3mk24i582-asjad-j-dawres-projects.vercel.app'
    }
  } ,
})
