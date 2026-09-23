import { readContentPaths } from '@ntatoud/content/pages'
import { content } from '@ntatoud/content/vite'
import { contentMarkdown } from '@ntatoud/content/vite-markdown'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import netlify from '@netlify/vite-plugin-tanstack-start'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import {
  PAGE_DESCRIPTIONS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from './src/lib/site'

// Server routes with no `<a>` pointing at them, so the crawler never finds them.
const FEED_PATHS = ['/rss.xml', '/atom.xml', '/feed.json', '/sitemap.xml']

export default defineConfig(async ({ mode }) => ({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    ...(mode !== 'development' ? [netlify()] : []),
    // Bakes every collection into `virtual:content` at build time, so pages read
    // content from the bundle instead of calling a serverless function.
    content(),
    // Emits a `.md` twin of every page plus `/llms.txt` into the client build, so
    // the edge function can answer `Accept: text/markdown` from a static file
    // instead of converting HTML per request (ADR-0009).
    contentMarkdown({
      site: { url: SITE_URL, name: SITE_NAME, description: SITE_DESCRIPTION },
      pages: PAGE_DESCRIPTIONS,
      optionalLinks: [
        { title: 'Sitemap', path: '/sitemap.xml' },
        { title: 'RSS feed', path: '/rss.xml' },
      ],
    }),
    tailwindcss(),
    // Prerender every page at build time so first loads are served statically
    // from the CDN instead of invoking the SSR function (cold start + content
    // pipeline). Crawling alone misses every page nothing links to: documents
    // whose cards link off-site, the feeds, the sitemap. Listing them
    // explicitly keeps every route a static file, so none of them falls back
    // to the serverless function. Unmatched paths still fall back to SSR.
    tanstackStart({
      pages: [...(await readContentPaths()), ...FEED_PATHS].map((path) => ({
        path,
      })),
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    }),
    viteReact({ include: /\.(tsx|ts|jsx|js)$/ }),
  ],
}))
