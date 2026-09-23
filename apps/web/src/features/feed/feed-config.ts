import { SITE_URL } from '@/lib/site'

import type { FeedConfig } from './schema'

const AUTHOR = { name: 'Noé Tatoud' } as const

/**
 * Blog feed channel config bound to this site. Passed to `buildFeed` by the
 * serializers in `./feed`.
 */
export const FEED_CONFIG: FeedConfig = {
  title: 'Noé Tatoud — Blog',
  description: 'Articles on software engineering by Noé Tatoud.',
  siteUrl: SITE_URL,
  language: 'en',
  copyright: '© Noé Tatoud',
  author: AUTHOR,
}
