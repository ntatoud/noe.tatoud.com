import { blogPosts, caseStudies, projects, talks } from 'virtual:content'

import { SITE_URL } from '@/lib/site'

export type SitemapUrl = {
  path: string
  lastmod?: string
}

const STATIC_PATHS: ReadonlyArray<string> = [
  '/',
  '/blog',
  '/projects',
  '/case-studies',
  '/talks',
]

/** Every crawlable page on the site, static and content-backed. */
export function getSitemapUrls(): SitemapUrl[] {
  return [
    ...STATIC_PATHS.map((path) => ({ path })),
    ...blogPosts.map((post) => ({ path: post.url, lastmod: post.date })),
    ...projects.map((project) => ({
      path: project.path,
      lastmod: project.date,
    })),
    ...caseStudies.map((caseStudy) => ({
      path: caseStudy.path,
      lastmod: caseStudy.date,
    })),
    ...talks.map((talk) => ({
      path: talk.path,
      lastmod: talk.events[0]?.date,
    })),
  ]
}

const escape = (value: string): string =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

const urlEntry = ({ path, lastmod }: SitemapUrl): string =>
  [
    '  <url>',
    `    <loc>${escape(`${SITE_URL}${path}`)}</loc>`,
    ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
    '  </url>',
  ].join('\n')

/** Serialize a sitemap 0.9 document (https://www.sitemaps.org/protocol.html). */
export function renderSitemap(urls: ReadonlyArray<SitemapUrl>): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(urlEntry),
    '</urlset>',
  ].join('\n')
}
