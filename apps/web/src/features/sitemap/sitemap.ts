import { sitePages } from '@ntatoud/content/inventory'

import { contentInventory } from 'virtual:content'

import { SITE_URL, STATIC_PAGES } from '@/lib/site'
import { escapeXml } from '@/lib/xml'

/** Every indexable page: static ones, then published documents (no drafts). */
const URLS = sitePages(contentInventory, STATIC_PAGES).filter(
  (page) => page.published,
)

/** A sitemap 0.9 document (https://www.sitemaps.org/protocol.html). */
export const sitemapResponse = (): Response =>
  new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...URLS.map(({ path, lastmod }) =>
        [
          '  <url>',
          `    <loc>${escapeXml(`${SITE_URL}${path}`)}</loc>`,
          ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
          '  </url>',
        ].join('\n'),
      ),
      '</urlset>',
    ].join('\n'),
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  )
