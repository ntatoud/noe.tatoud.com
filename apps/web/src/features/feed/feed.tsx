import type { FeedItemInput } from '@ntatoud/effect-rss'

import { blogPosts, loadBlogPost } from 'virtual:content'

import { SITE_URL } from '@/lib/site'
import { Feed, runtime } from '@/server/runtime'

/**
 * Blog feed serializers bound to this site, backed by the shared App runtime's
 * `Feed` service. Reuse them from the `/rss.xml`, `/atom.xml`, and `/feed.json`
 * route handlers — the channel config lives in `./feed-config`.
 */
export const feed = {
  rss: (items: ReadonlyArray<FeedItemInput>): Promise<string> =>
    runtime.runPromise(Feed.use((f) => f.rss(items))),
  atom: (items: ReadonlyArray<FeedItemInput>): Promise<string> =>
    runtime.runPromise(Feed.use((f) => f.atom(items))),
  json: (items: ReadonlyArray<FeedItemInput>): Promise<string> =>
    runtime.runPromise(Feed.use((f) => f.json(items))),
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
