import type { FeedConfig } from '@ntatoud/effect-rss'

import { SITE_URL } from '@/lib/site'

const AUTHOR = { name: 'Noé Tatoud' } as const

/**
 * Blog feed channel config bound to this site. Consumed by the shared App
 * runtime (`@/server/runtime`) to build the `Feed` layer.
 */
export const FEED_CONFIG: FeedConfig = {
  title: 'Noé Tatoud — Blog',
  description: 'Articles on software engineering by Noé Tatoud.',
  siteUrl: SITE_URL,
  language: 'en',
  copyright: '© Noé Tatoud',
  author: AUTHOR,
}
