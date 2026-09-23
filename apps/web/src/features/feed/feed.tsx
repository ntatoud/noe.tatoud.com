import { Effect } from 'effect'
import { blogPosts, loadBlogPost } from 'virtual:content'

import { buildFeed } from '@/features/feed/build'
import { FEED_CONFIG } from '@/features/feed/feed-config'
import type { FeedItemInput } from '@/features/feed/schema'
import { SITE_URL } from '@/lib/site'

/**
 * Blog feed serializers bound to this site's channel config
 * (`./feed-config`). Reuse them from the `/rss.xml`, `/atom.xml`, and
 * `/feed.json` route handlers, which run once, during the build's prerender
 * pass (ADR-0011).
 */
export const feed = {
  rss: (items: ReadonlyArray<FeedItemInput>): Promise<string> =>
    Effect.runPromise(buildFeed('rss', FEED_CONFIG, items)),
  atom: (items: ReadonlyArray<FeedItemInput>): Promise<string> =>
    Effect.runPromise(buildFeed('atom', FEED_CONFIG, items)),
  json: (items: ReadonlyArray<FeedItemInput>): Promise<string> =>
    Effect.runPromise(buildFeed('json', FEED_CONFIG, items)),
}

/**
 * Turn every published blog post into a feed item. Posts hosted here embed
 * their full rendered HTML body; cross-posts link out to their canonical URL
 * while keeping a stable, on-domain GUID.
 */
export async function getFeedItems(): Promise<FeedItemInput[]> {
  return Promise.all(
    blogPosts.map(async (post): Promise<FeedItemInput> => {
      const base = {
        title: post.title,
        date: post.date,
        ...(post.description ? { description: post.description } : {}),
        ...(post.tags ? { categories: post.tags } : {}),
        ...(post.hero ? { image: `${SITE_URL}${post.hero}` } : {}),
      }

      if (post.externalUrl) {
        return { ...base, path: post.externalUrl, id: `${SITE_URL}${post.url}` }
      }

      // The slug comes from the listing, so the chunk always exists; an absent
      // one would be a bug in the content plugin rather than a missing post.
      const load = loadBlogPost[post.slug]
      if (!load) throw new Error(`No content chunk for blog post: ${post.slug}`)

      return { ...base, path: post.url, content: (await load()).default.html }
    }),
  )
}
