import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo, Vite reenvia /api al backend Spring. Asi el navegador
    // cree que todo viene del mismo origen (localhost:5173) y no hay CORS.
    proxy: {
      '/api': 'http://localhost:4002',
      // Los controllers de peliculas y funciones no estan bajo /api,
      // asi que van aparte.
      '/peliculas': 'http://localhost:4002',
      '/funciones': 'http://localhost:4002',
    },
  },
})
