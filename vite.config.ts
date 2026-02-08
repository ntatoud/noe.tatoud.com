import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import mdx from 'fumadocs-mdx/vite'
import { nitro } from 'nitro/vite'
import * as MdxConfig from './source.config'

const config = defineConfig({
  ssr: {
    noExternal: ['@takumi-rs/core', '@takumi-rs/image-response'],
  },
  optimizeDeps: {
    exclude: ['@takumi-rs/core'],
  },
  plugins: [
    devtools(),
    mdx(MdxConfig),
    nitro({ preset: 'netlify' }),
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
