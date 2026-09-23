import { readContentPages, readContentPaths } from '@ntatoud/content/pages'
import { content } from '@ntatoud/content/vite'
import { contentMarkdown } from '@ntatoud/content/vite-markdown'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { ogImages } from './plugins/og-images.ts'
import {
  PAGE_DESCRIPTIONS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  STATIC_PAGES,
} from './src/lib/site.ts'

// Server routes with no `<a>` pointing at them, so the crawler never finds them.
const FEED_PATHS = ['/rss.xml', '/atom.xml', '/feed.json', '/sitemap.xml']

export default defineConfig(async () => ({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    // Bakes every collection into `virtual:content` at build time, so pages read
    // content from the bundle instead of the filesystem.
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
    // Renders every page's social card to `/og/<path>.png` at build time, so no
    // request runs the image renderer (ADR-0010).
    ogImages({
      pages: async () => [
        ...Object.values(STATIC_PAGES),
        ...(await readContentPages()),
      ],
    }),
    tailwindcss(),
    // Prerender every page at build time: the deploy is `dist/client` and
    // nothing else, so a route that is not prerendered does not exist in
    // production (ADR-0011). Crawling alone misses every page nothing links
    // to: documents whose cards link off-site, the feeds, the sitemap, the
    // 404 page. Listing them explicitly keeps every route a static file.
    tanstackStart({
      pages: [
        ...[...(await readContentPaths()), ...FEED_PATHS].map((path) => ({
          path,
        })),
        // Netlify serves `404.html` for any path without a file.
        { path: '/404', prerender: { outputPath: '/404.html' } },
      ],
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    }),
    viteReact({ include: /\.(tsx|ts|jsx|js)$/ }),
  ],
}))
