import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Zid had l-line bach l-site i-dir build l l-root nichan 
  // Hit ghadi t-khdem b custom domain
  base: '/', 
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    // Hada kiy-khalli l-output folder kheddam mzyan m3a gh-pages
    outDir: 'dist',
  }
})