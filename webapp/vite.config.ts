import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    build({
      minify: true,
      // Explicitly configure static content manifest
      external: ['__STATIC_CONTENT_MANIFEST']
    }),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    })
  ],
  build: {
    rollupOptions: {
      external: ['__STATIC_CONTENT_MANIFEST']
    }
  }
})
