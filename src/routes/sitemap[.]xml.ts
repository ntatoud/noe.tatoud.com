import { createFileRoute } from '@tanstack/react-router'
import type { FileRoutesByPath } from '@tanstack/react-router'

import { allBlogPosts, allTalks } from 'content-collections'

import { latestEvent } from '@/lib/stage'

const BASE_URL = 'https://noe.tatoud.com'

// Derive public page paths from the router — excludes API, dynamic, and meta routes
type StaticPagePath = Exclude<
  keyof FileRoutesByPath,
  '/api/og' | '/sitemap.xml' | '/styleguide' | '/blog/$' | '/stage/$slug'
>

// satisfies ensures every entry is a valid route from routeTree.gen.ts
const staticRoutes = [
  '/',
  '/blog/',
  '/achievements/',
  '/stage/',
] satisfies Array<StaticPagePath>

type SitemapEntry = { url: string; lastmod?: string }

function buildSitemap(entries: Array<SitemapEntry>): string {
  const items = entries
    .map(({ url, lastmod }) => {
      const normalized = url.length > 1 ? url.replace(/\/$/, '') : url
      const lastmodTag = lastmod ? `<lastmod>${lastmod}</lastmod>` : ''
      return `  <url><loc>${BASE_URL}${normalized}</loc>${lastmodTag}</url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const blogEntries = allBlogPosts
          .filter((p) => p.published)
          .map((p) => ({
            url: `/blog/${p._meta.path}`,
            lastmod: new Date(p.date).toISOString().split('T')[0],
          }))

        const talkEntries = allTalks.map((t) => {
          const latest = latestEvent(t.events)
          return {
            url: `/stage/${t._meta.path}`,
            lastmod: latest
              ? new Date(latest.date).toISOString().split('T')[0]
              : undefined,
          }
        })

        const staticEntries = staticRoutes.map((url) => ({ url }))
        const xml = buildSitemap([
          ...staticEntries,
          ...blogEntries,
          ...talkEntries,
        ])

        return new Response(xml, {
          headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        })
      },
    },
  },
})
