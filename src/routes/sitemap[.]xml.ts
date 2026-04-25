import { createFileRoute } from '@tanstack/react-router'
import type { FileRoutesByPath } from '@tanstack/react-router'

import { allBlogPosts } from 'content-collections'

const BASE_URL = 'https://noe.tatoud.com'

// Derive public page paths from the router — excludes API, dynamic, and meta routes
type StaticPagePath = Exclude<
  keyof FileRoutesByPath,
  '/api/og' | '/sitemap.xml' | '/styleguide' | '/blog/$'
>

// satisfies ensures every entry is a valid route from routeTree.gen.ts
const staticRoutes = [
  '/',
  '/blog/',
  '/achievements/',
] satisfies Array<StaticPagePath>

function buildSitemap(urls: Array<string>): string {
  const entries = urls
    .map((url) => {
      const normalized = url.length > 1 ? url.replace(/\/$/, '') : url
      return `  <url><loc>${BASE_URL}${normalized}</loc></url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const blogSlugs = allBlogPosts
          .filter((p) => p.published)
          .map((p) => `/blog/${p._meta.path}`)

        const xml = buildSitemap([...staticRoutes, ...blogSlugs])

        return new Response(xml, {
          headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        })
      },
    },
  },
})
