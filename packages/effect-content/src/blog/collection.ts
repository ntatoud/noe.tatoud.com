import { Effect } from 'effect'
import { defineCollection } from 'effect-collections'

import { BlogFrontmatter } from '#blog/schema'

const BLOG = 'blog'

/**
 * Blog collection metadata (no body), the shape features already consume.
 *
 * Derived from the frontmatter Schema so the pass-through fields stay in sync
 * with validation: `hero`/`externalUrl` are swapped for their resolved forms
 * (a `/content` URL and a normalised `null`), and the reader adds `slug`, `url`
 * and the stamped `heroDimensions`.
 */
export type BlogPost = Omit<BlogFrontmatter, 'hero' | 'externalUrl'> & {
  readonly slug: string
  readonly url: string
  readonly externalUrl: string | null
  readonly hero: string | null
  readonly heroDimensions: {
    readonly width: number
    readonly height: number
  } | null
}

/** A single Blog Document: its metadata plus the compiled function-body string. */
export type BlogPostWithBody = BlogPost & { body: string }

/**
 * The site's Blog collection, defined on the generic `effect-collections` core:
 * `toMetadata` builds the `/blog/<slug>` URL and resolves `hero` via the injected
 * `resolveImage`; `include` keeps only published posts; `order` is date-descending.
 */
export const blog = defineCollection({
  name: BLOG,
  schema: BlogFrontmatter,
  toMetadata: ({ slug, frontmatter, resolveImage }) =>
    Effect.gen(function* () {
      let hero: string | null = null
      let heroDimensions: { width: number; height: number } | null = null
      if (frontmatter.hero) {
        const resolved = yield* resolveImage(frontmatter.hero)
        hero = resolved.url
        heroDimensions =
          resolved.width !== null && resolved.height !== null
            ? { width: resolved.width, height: resolved.height }
            : null
      }

      const post: BlogPost = {
        slug,
        url: `/${BLOG}/${slug}`,
        title: frontmatter.title,
        description: frontmatter.description,
        author: frontmatter.author,
        date: frontmatter.date,
        published: frontmatter.published,
        translations: frontmatter.translations
          ? frontmatter.translations.map((t) => ({ lang: t.lang, url: t.url }))
          : undefined,
        tags: frontmatter.tags ? [...frontmatter.tags] : undefined,
        externalUrl: frontmatter.externalUrl ?? null,
        hero,
        heroDimensions,
      }
      return post
    }),
  include: (post) => post.published,
  order: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
})
