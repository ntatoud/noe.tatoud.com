import { getBlogPost, getBlogPosts } from '@ntatoud/content'
import { makeFeed, type FeedItemInput } from '@ntatoud/effect-rss'

import { renderToStaticMarkup } from 'react-dom/server'

import { SITE_URL } from '@/lib/site'

const AUTHOR = { name: 'Noé Tatoud' } as const

/**
 * Blog feed builder bound to this site. Reuse it from the `/rss.xml`,
 * `/atom.xml`, and `/feed.json` route handlers — see `@ntatoud/effect-rss`.
 */
export const feed = makeFeed({
  title: 'Noé Tatoud — Blog',
  description: 'Articles on software engineering by Noé Tatoud.',
  siteUrl: SITE_URL,
  language: 'en',
  copyright: '© Noé Tatoud',
  author: AUTHOR,
})

/**
 * Turn every published blog post into a feed item. Posts hosted here embed
 * their full rendered HTML body; cross-posts link out to their canonical URL
 * while keeping a stable, on-domain GUID.
 */
export async function getFeedItems(): Promise<FeedItemInput[]> {
  const posts = await getBlogPosts()

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

      const detail = await getBlogPost(post.slug)
      return {
        ...base,
        path: post.url,
        content: renderToStaticMarkup(<detail.Content />),
      }
    }),
  )
}
