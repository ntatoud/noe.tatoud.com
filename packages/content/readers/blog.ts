import { Collections } from '@ntatoud/effect-collections'
import type { CollectionData } from '@ntatoud/effect-collections'

import { Effect } from 'effect'

import { blogPosts as blogPostsCollection } from '../collections.ts'

export type BlogPost = CollectionData<typeof blogPostsCollection>

export type BlogPostDetail = BlogPost & {
  /** The rendered body, as HTML. */
  html: string
}

export const getBlogPosts = Collections.use((collections) =>
  collections.getAll(blogPostsCollection),
).pipe(
  Effect.map((docs) =>
    docs
      .map((doc) => doc.data)
      .filter((post) => post.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  ),
)

export const getBlogPost = (slug: string) =>
  Collections.use((collections) =>
    collections.getBySlug(blogPostsCollection, slug),
  ).pipe(Effect.map((doc): BlogPostDetail => ({ ...doc.data, html: doc.html })))
