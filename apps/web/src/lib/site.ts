// The site's pages and files that are not content documents. `sitePages` in
// `@ntatoud/content/inventory` merges them with the content pages. The Vite
// config and `scripts/check-static.ts` import this module, so it must stay free
// of runtime imports and of anything that only resolves inside the app.

import type { StaticPages } from '@ntatoud/content/inventory'

export const SITE_URL = 'https://noe.tatoud.com'

export const SITE_NAME = 'noe.tatoud.com'

export const SITE_DESCRIPTION = 'Noé Tatoud | Software engineer.'

/**
 * The home and listing pages, keyed by the catalog's listing names. Their
 * routes' meta tags, their social cards and their markdown twins (ADR-0009) all
 * read from here, so the three cannot describe a page differently. A listing's
 * badge comes from the catalog.
 */
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

/** The blog's feeds, advertised by the root route and rendered by `features/feed`. */
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

/**
 * Server routes the prerender pass writes to files. Nothing links to them, so
 * the crawler never finds them on its own (ADR-0011).
 */
export const FILE_ROUTES: ReadonlyArray<string> = [
  ...Object.values(FEEDS).map((feed) => feed.path),
  SITEMAP_PATH,
]
