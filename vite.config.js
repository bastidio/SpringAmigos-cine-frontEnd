import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // En desarrollo, Vite reenvia /api al backend Spring. Asi el navegador
    // cree que todo viene del mismo origen (localhost:5173) y no hay CORS.
    proxy: {
      '/api': 'http://localhost:4002',
      // Los controllers de peliculas, funciones y productos no estan bajo
      // /api, asi que van aparte. Ojo: las rutas del front (App.jsx) no pueden
      // empezar igual que estas, por eso el detalle es /pelicula y no /peliculas.
      '/peliculas': 'http://localhost:4002',
      '/funciones': 'http://localhost:4002',
      '/productos': 'http://localhost:4002',
    },
  },
})
