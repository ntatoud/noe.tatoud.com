import { sitePages } from '@ntatoud/content/inventory'
import { readContentPages } from '@ntatoud/content/pages'
import { content } from '@ntatoud/content/vite'
import { contentMarkdown } from '@ntatoud/content/vite-markdown'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { ogImages } from './plugins/og-images.ts'
import {
  FEEDS,
  FILE_ROUTES,
  SITEMAP_PATH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  STATIC_PAGES,
} from './src/lib/site.ts'

export default defineConfig(async () => {
  // Every page on the site, drafts included: what gets prerendered and what
  // gets a social card.
  const pages = sitePages(await readContentPages(), STATIC_PAGES)

  return {
    resolve: {
      tsconfigPaths: true,
    },
    // The site is static, so "today" is the day it was built. A constant keeps
    // the prerendered HTML and the hydrated client agreeing on it.
    define: {
      'import.meta.env.BUILD_DATE': JSON.stringify(
        new Date().toISOString().slice(0, 10),
      ),
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
        pages: STATIC_PAGES,
        optionalLinks: [
          { title: 'Sitemap', path: SITEMAP_PATH },
          { title: 'RSS feed', path: FEEDS.rss.path },
        ],
      }),
      // Renders every page's social card to `/og/<path>.png` at build time, so no
      // request runs the image renderer (ADR-0010).
      ogImages({ pages }),
      tailwindcss(),
      // Prerender every page at build time: the deploy is `dist/client` and
      // nothing else, so a route that is not prerendered does not exist in
      // production (ADR-0011). Crawling alone misses every page nothing links
      // to: documents whose cards link off-site, the feeds, the sitemap, the
      // 404 page. Listing them explicitly keeps every route a static file.
      tanstackStart({
        pages: [
          ...pages.map(({ path }) => ({ path })),
          ...FILE_ROUTES.map((path) => ({ path })),
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
  }
})
