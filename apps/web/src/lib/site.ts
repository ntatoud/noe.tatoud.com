// Imported by the Vite config and check-static.ts: no runtime imports, nothing app-only.

import type { StaticPages } from '@ntatoud/content/inventory'

export const SITE_URL = 'https://noe.tatoud.com'

export const SITE_NAME = 'noe.tatoud.com'

export const SITE_DESCRIPTION = 'Noé Tatoud | Software engineer.'

// Meta tags, social cards and markdown twins (ADR-0009) all read this, so they cannot disagree.
export const STATIC_PAGES = {
  home: { path: '/', title: 'Noé Tatoud', description: SITE_DESCRIPTION },
  blog: {
    path: '/blog',
    title: 'Blog | Noé Tatoud',
    description: 'Articles on software engineering.',
  },
  projects: {
    path: '/projects',
    title: 'Projects | Noé Tatoud',
    description: 'Personal and open-source projects.',
  },
  talks: {
    path: '/talks',
    title: 'Talks | Noé Tatoud',
    description: 'Conference talks and workshops.',
  },
} as const satisfies StaticPages

export const FEED_TITLE = 'Noé Tatoud — Blog'

export const FEEDS = {
  rss: { path: '/rss.xml', type: 'application/rss+xml', label: 'RSS' },
  atom: { path: '/atom.xml', type: 'application/atom+xml', label: 'Atom' },
  json: {
    path: '/feed.json',
    type: 'application/feed+json',
    label: 'JSON Feed',
  },
} as const

export const SITEMAP_PATH = '/sitemap.xml'

// Server routes the prerender pass writes to files; nothing links to them (ADR-0011).
export const FILE_ROUTES: ReadonlyArray<string> = [
  ...Object.values(FEEDS).map((feed) => feed.path),
  SITEMAP_PATH,
]
