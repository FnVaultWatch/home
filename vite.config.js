import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// base: './' makes the build use relative asset paths, which works when
// deployed to GitHub Pages at either https://<user>.github.io/ or
// https://<user>.github.io/<repo>/ without any changes needed.
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
