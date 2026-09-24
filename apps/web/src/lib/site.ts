// The site's page inventory: every page and file that is not a content
// document. Content documents come from `readContentPages` in
// `@ntatoud/content/pages`. The Vite config and `scripts/check-static.ts` import
// this module, so it must stay free of imports and of anything that only
// resolves inside the app.

export const SITE_URL = 'https://noe.tatoud.com'

export const SITE_NAME = 'noe.tatoud.com'

export const SITE_DESCRIPTION = 'Noé Tatoud | Software engineer.'

/**
 * Where a page's social card lives: `/` → `/og/index.png`,
 * `/blog/what-is-mcp` → `/og/blog/what-is-mcp.png`. The build emits the files
 * (`plugins/og-images.ts`) and the meta tags point at them, both through this.
 */
export const ogImagePath = (pagePath: string): string => {
  const trimmed = pagePath.replace(/^\/+|\/+$/g, '')
  return `/og/${trimmed === '' ? 'index' : trimmed}.png`
}

/**
 * The home and listing pages. Their routes' meta tags, their social cards and
 * their markdown twins (ADR-0009) all read from here, so the three cannot
 * describe a page differently.
 */
export const STATIC_PAGES = {
  home: { path: '/', title: 'Noé Tatoud', description: SITE_DESCRIPTION },
  blog: {
    path: '/blog',
    title: 'Blog | Noé Tatoud',
    description: 'Articles on software engineering.',
    kind: 'blog',
  },
  projects: {
    path: '/projects',
    title: 'Projects | Noé Tatoud',
    description: 'Personal and open-source projects.',
    kind: 'project',
  },
  talks: {
    path: '/talks',
    title: 'Talks | Noé Tatoud',
    description: 'Conference talks and workshops.',
    kind: 'talk',
  },
} as const

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
