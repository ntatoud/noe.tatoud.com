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
