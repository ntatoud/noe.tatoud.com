import { blogPosts, projects, talks } from 'virtual:content'

import { SITE_URL, STATIC_PAGES } from '@/lib/site'

/** Every indexable page: static ones, then published documents (no drafts). */
const URLS: ReadonlyArray<{ path: string; lastmod?: string | undefined }> = [
  ...Object.values(STATIC_PAGES).map(({ path }) => ({ path })),
  ...blogPosts.map((post) => ({ path: post.url, lastmod: post.date })),
  ...projects.map((project) => ({ path: project.path, lastmod: project.date })),
  ...talks.map((talk) => ({ path: talk.path, lastmod: talk.events[0]?.date })),
]

const escape = (value: string): string =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

/** A sitemap 0.9 document (https://www.sitemaps.org/protocol.html). */
export const sitemapResponse = (): Response =>
  new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...URLS.map(({ path, lastmod }) =>
        [
          '  <url>',
          `    <loc>${escape(`${SITE_URL}${path}`)}</loc>`,
          ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
          '  </url>',
        ].join('\n'),
      ),
      '</urlset>',
    ].join('\n'),
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  )
