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
  const pages = sitePages(await readContentPages(), STATIC_PAGES)

  return {
    resolve: {
      tsconfigPaths: true,
    },
    // The build day is the site's "today"; a constant keeps SSR and hydration in agreement.
    define: {
      'import.meta.env.BUILD_DATE': JSON.stringify(
        new Date().toISOString().slice(0, 10),
      ),
    },
    plugins: [
      devtools(),
      content(),
      contentMarkdown({
        site: { url: SITE_URL, name: SITE_NAME, description: SITE_DESCRIPTION },
        pages: STATIC_PAGES,
        optionalLinks: [
          { title: 'Sitemap', path: SITEMAP_PATH },
          { title: 'RSS feed', path: FEEDS.rss.path },
        ],
      }),
      ogImages({ pages }),
      tailwindcss(),
      // Crawling alone misses pages nothing links to (off-site cards, feeds, sitemap, 404), so list them (ADR-0011).
      tanstackStart({
        pages: [
          ...pages.map(({ path }) => ({ path })),
          ...FILE_ROUTES.map((path) => ({ path })),
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
