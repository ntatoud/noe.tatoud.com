export const SITE_URL = 'https://noe.tatoud.com'

export const SITE_NAME = 'noe.tatoud.com'

export const SITE_DESCRIPTION = 'Noé Tatoud | Software engineer.'

/**
 * The one-line summary of each listing page.
 *
 * Shared rather than inlined per route because these strings are read from two
 * places now: the route's own `<meta name="description">`, and the markdown twin
 * `@ntatoud/content/vite-markdown` emits for agents (ADR-0009), which is built
 * from `vite.config.ts`. One copy is what stops the HTML and the markdown from
 * describing the same page differently.
 *
 * The Vite config imports this module, so it must stay free of imports and of
 * anything that only resolves inside the app.
 */
export const PAGE_DESCRIPTIONS = {
  home: SITE_DESCRIPTION,
  blog: 'Articles on software engineering.',
  projects: 'Personal and open-source projects.',
  talks: 'Conference talks and workshops.',
} as const

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
 * The home and listing pages' titles and card badges, shared by their routes
 * and the OG image build so the two cannot disagree.
 */
export const STATIC_PAGES = {
  home: { path: '/', title: 'Noé Tatoud', description: SITE_DESCRIPTION },
  blog: {
    path: '/blog',
    title: 'Blog | Noé Tatoud',
    description: PAGE_DESCRIPTIONS.blog,
    kind: 'blog',
  },
  projects: {
    path: '/projects',
    title: 'Projects | Noé Tatoud',
    description: PAGE_DESCRIPTIONS.projects,
    kind: 'project',
  },
  talks: {
    path: '/talks',
    title: 'Talks | Noé Tatoud',
    description: PAGE_DESCRIPTIONS.talks,
    kind: 'talk',
  },
} as const
