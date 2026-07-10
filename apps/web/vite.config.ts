import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import contentCollections from '@content-collections/vite'
import mdx from '@mdx-js/rollup'
import netlify from '@netlify/vite-plugin-tanstack-start'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import rehypeMdxImportMedia from 'rehype-mdx-import-media'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'

import rehypeImgDimensions from './plugins/rehype-img-dimensions'

const here = path.dirname(fileURLToPath(import.meta.url))
const contentConfig = path.resolve(
  here,
  '../../packages/content/content-collections.ts',
)

export default defineConfig(({ mode }) => ({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    contentCollections({ configPath: contentConfig }),
    {
      // MDX must run before viteReact so .mdx files are compiled to JSX first
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkGfm],
        rehypePlugins: [
          rehypeImgDimensions,
          rehypeMdxImportMedia,
          [rehypePrettyCode, { theme: 'github-dark' }],
        ],
      }),
    },
    ...(mode !== 'development' ? [netlify()] : []),
    tailwindcss(),
    tanstackStart(),
    viteReact({ include: /\.(tsx|ts|jsx|js)$/ }),
  ],
}))
