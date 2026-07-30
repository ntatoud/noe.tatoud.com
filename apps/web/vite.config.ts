import { content } from '@ntatoud/content/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import netlify from '@netlify/vite-plugin-tanstack-start'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    ...(mode !== 'development' ? [netlify()] : []),
    // Bakes every collection into `virtual:content` at build time, so pages read
    // content from the bundle instead of calling a serverless function.
    content(),
    tailwindcss(),
    // Prerender every page reachable from / at build time so first loads are
    // served statically from the CDN instead of invoking the SSR function
    // (cold start + content pipeline). Unmatched paths still fall back to SSR.
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    }),
    viteReact({ include: /\.(tsx|ts|jsx|js)$/ }),
  ],
}))
