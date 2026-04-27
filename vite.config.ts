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

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    contentCollections(),
    {
      // MDX must run before viteReact so .mdx files are compiled to JSX first
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkGfm],
        rehypePlugins: [
          rehypeMdxImportMedia,
          [rehypePrettyCode, { theme: 'github-dark' }],
        ],
      }),
    },
    netlify(),
    tailwindcss(),
    tanstackStart(),
    viteReact({ include: /\.(tsx|ts|jsx|js)$/ }),
  ],
})

export default config
