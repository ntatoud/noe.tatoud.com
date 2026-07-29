import { getBlogPost, getBlogPosts } from '@ntatoud/content'
import type { FeedItemInput } from '@ntatoud/effect-rss'

import { renderToStaticMarkup } from 'react-dom/server'

import { SITE_URL } from '@/lib/site'
import { Feed, readContent, runtime } from '@/server/runtime'

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
  const posts = await readContent(getBlogPosts)

  return Promise.all(
    posts.map(async (post): Promise<FeedItemInput> => {
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

      // Logged like the page reads in `@/server/content`: the slugs come from
      // the list read just above, so a failure here means a genuinely broken
      // document, and it takes down all three feeds at once.
      const detail = await readContent(getBlogPost(post.slug))
      return {
        ...base,
        path: post.url,
        content: renderToStaticMarkup(<detail.Content />),
      }
    }),
  )
}
