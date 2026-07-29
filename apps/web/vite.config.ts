import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import netlify from '@netlify/vite-plugin-tanstack-start'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  resolve: {
    tsconfigPaths: true,
    alias: [
      // rehype-pretty-code statically imports shiki's bundled-grammar registry
      // (300+ chunks, ~12MB inside the serverless function) even though we hand
      // it an explicit fine-grained highlighter. See the shim for details.
      { find: /^shiki$/, replacement: '@ntatoud/effect-mdx/shiki-shim' },
    ],
  },
  plugins: [
    devtools(),
    ...(mode !== 'development' ? [netlify()] : []),
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
