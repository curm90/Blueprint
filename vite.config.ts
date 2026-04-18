import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  optimizeDeps: {
    exclude: [
      '@convex-dev/better-auth/react-start',
      '@convex-dev/better-auth/react',
      '@convex-dev/better-auth/client/plugins',
    ],
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart(),
    viteReact(),
    nitro(),
  ],
  ssr: {
    noExternal: ['@convex-dev/better-auth'],
  },
})
