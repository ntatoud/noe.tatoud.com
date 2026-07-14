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

import { contentImagesStatic } from './plugins/content-images-static'
import { prepareContentForBuild } from './plugins/content-prerender'
import rehypeImgDimensions from './plugins/rehype-img-dimensions'

const here = path.dirname(fileURLToPath(import.meta.url))
const contentConfig = path.resolve(
  here,
  '../../packages/content/content-collections.ts',
)
const contentRoot = path.resolve(here, '../../packages/content/content')

export default defineConfig(async ({ mode, command }) => {
  // Strict build-time content validation + prerender page enumeration
  // (ADR-0006, issue #100) only apply to a real `vite build`: `prepareContentForBuild`
  // fails the build outright on invalid frontmatter, a missing referenced
  // image, or un-compilable MDX, and otherwise returns every route to
  // prerender to static HTML (home, the four list routes, and every
  // published Document's detail route) — so the MDX compiler / Shiki never
  // run at request time in production.
  const isBuild = command === 'build'
  const pages = isBuild ? await prepareContentForBuild(contentRoot) : []

  return {
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      devtools(),
      contentCollections({ configPath: contentConfig }),
      contentImagesStatic(contentRoot),
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
      tanstackStart({
        pages,
        prerender: isBuild ? { enabled: true, crawlLinks: false } : undefined,
      }),
      viteReact({ include: /\.(tsx|ts|jsx|js)$/ }),
    ],
  }
})
