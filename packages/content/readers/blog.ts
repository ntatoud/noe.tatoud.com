import type { CollectionData, DocumentMeta } from '@ntatoud/effect-collections'

import { blogPosts as blogPostsCollection } from '../collections.ts'

export type BlogPost = CollectionData<typeof blogPostsCollection>

export type BlogPostDetail = BlogPost & {
  /** The rendered body, as HTML. */
  html: string
}

/** Published posts, newest first: what the blog listing shows. */
export const getBlogPosts = (
  documents: ReadonlyArray<DocumentMeta<BlogPost>>,
): ReadonlyArray<BlogPost> =>
  documents
    .map((doc) => doc.data)
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
