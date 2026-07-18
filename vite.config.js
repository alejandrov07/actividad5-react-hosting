import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: para GitHub Pages, "base" debe ser "/nombre-exacto-de-tu-repo/".
  // Si no coincide con el nombre del repositorio en GitHub, la página se ve en blanco
  // porque el navegador busca los archivos JS/CSS en la ruta equivocada.
  // Cambia esto ANTES de desplegar (ver README.md, paso 1).
  base: '/actividad5-react-hosting/',
  build: {
    // Por defecto Vite convierte archivos pequeños (<4kb) importados desde src/
    // en un string base64 dentro del propio JS, en vez de generar un archivo aparte.
    // Lo desactivamos para que el icono importado desde src/assets se vea
    // como un archivo independiente en dist/assets/ (más claro para esta actividad).
    assetsInlineLimit: 0,
  },
})
