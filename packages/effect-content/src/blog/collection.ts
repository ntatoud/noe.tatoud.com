import { defineCollection, type ResolveImageRefs } from 'effect-collections'

import { BlogFrontmatter } from '#blog/schema'

const BLOG = 'blog'

/**
 * Blog collection metadata (no body), the shape features already consume.
 *
 * Derived straight from the frontmatter Schema: image fields are swapped for
 * their resolved form (so `hero` is a single `{ src, width, height }` or
 * `undefined`), and the reader auto-adds `slug` and `url`.
 */
export type BlogPost = ResolveImageRefs<BlogFrontmatter> & {
  readonly slug: string
  readonly url: string
}

/** A single Blog Document: its metadata plus the compiled function-body string. */
export type BlogPostWithBody = BlogPost & { readonly body: string }

/**
 * The site's Blog collection, defined on the generic `effect-collections` core.
 * With no `toMetadata`, the reader auto-adds `slug`/`url` and resolves the
 * schema's `hero` `Image` field; `include` keeps only published posts; `order`
 * is date-descending.
 */
export const blog = defineCollection({
  name: BLOG,
  schema: BlogFrontmatter,
  include: (post) => post.published,
  order: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
})
