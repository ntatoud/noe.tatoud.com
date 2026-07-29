import { getBlogPosts, getProjects, getTalks } from '@ntatoud/content'

import { SITE_URL } from '@/lib/site'
import { runtime } from '@/server/runtime'

export type SitemapUrl = {
  path: string
  lastmod?: string
}

const STATIC_PATHS: ReadonlyArray<string> = [
  '/',
  '/blog',
  '/projects',
  '/talks',
]

/** Most recent event date for a talk, or `undefined` if it has none. */
function latestTalkDate(talk: {
  events: ReadonlyArray<{ date: string }> | undefined
}): string | undefined {
  if (!talk.events || talk.events.length === 0) return undefined
  return talk.events.reduce((latest, e) => (e.date > latest.date ? e : latest))
    .date
}

/** Every crawlable page on the site, static and content-backed. */
export async function getSitemapUrls(): Promise<SitemapUrl[]> {
  const [posts, projects, talks] = await Promise.all([
    runtime.runPromise(getBlogPosts),
    runtime.runPromise(getProjects),
    runtime.runPromise(getTalks),
  ])

  return [
    ...STATIC_PATHS.map((path) => ({ path })),
    ...posts.map((post) => ({ path: post.url, lastmod: post.date })),
    ...projects.map((project) => ({
      path: `/projects/${project.slug}`,
      lastmod: project.date,
    })),
    ...talks.map((talk) => ({
      path: `/talks/${talk.slug}`,
      lastmod: latestTalkDate(talk),
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
