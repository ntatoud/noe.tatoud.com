import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import mdx from 'fumadocs-mdx/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'
import * as MdxConfig from './source.config'

const config = defineConfig({
  optimizeDeps: {
    exclude: [
      '@takumi-rs/image-response',
      '@takumi-rs/core',
      '@takumi-rs/helpers',
    ],
  },
  ssr: {
    external: [
      '@takumi-rs/image-response',
      '@takumi-rs/core',
      '@takumi-rs/helpers',
      '@takumi-rs/core-linux-x64-gnu',
      '@takumi-rs/core-darwin-arm64',
    ],
  },
  plugins: [
    devtools(),
    mdx(MdxConfig),
    netlify(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
