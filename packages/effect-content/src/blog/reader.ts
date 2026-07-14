import { FileSystem, Path } from '@effect/platform'
import { Effect, Option } from 'effect'
import matter from 'gray-matter'

import { ContentConfig } from '../engine/config'
import { ContentNotFound } from '../engine/errors'
import { HighlighterService } from '../engine/highlighter'
import { resolveImage } from '../engine/image'
import { compileMdxBody } from '../engine/mdx'
import { type BlogFrontmatter, decodeBlogFrontmatter } from './schema'

/** Blog collection metadata (no body), the shape features already consume. */
export type BlogPost = {
  slug: string
  url: string
  title: string
  description: string | undefined
  author: string
  date: string
  published: boolean
  translations: Array<{ lang: string; url: string }> | undefined
  tags: Array<string> | undefined
  externalUrl: string | null
  hero: string | null
  heroDimensions: { width: number; height: number } | null
}

/** A single Blog Document: its metadata plus the compiled function-body string. */
export type BlogPostWithBody = BlogPost & { body: string }

const BLOG = 'blog'

/**
 * Builds the Blog readers as Effect programs, wiring the shared engine
 * (`ContentConfig`, `HighlighterService`) and the platform `FileSystem`/`Path`
 * services. Compiled bodies are memoized in-memory, keyed by slug + file mtime,
 * so repeated reads do not recompile.
 */
export const makeBlogReader = Effect.gen(function* () {
  const { contentRoot } = yield* ContentConfig
  const { highlighter } = yield* HighlighterService
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const compiledCache = new Map<string, string>()
  const blogDir = path.join(contentRoot, BLOG)

  const toMetadata = (slug: string, frontmatter: BlogFrontmatter) =>
    Effect.gen(function* () {
      let hero: string | null = null
      let heroDimensions: { width: number; height: number } | null = null
      if (frontmatter.hero) {
        const resolved = yield* resolveImage(
          contentRoot,
          BLOG,
          slug,
          frontmatter.hero,
        )
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
          ? frontmatter.translations.map((t) => ({
              lang: t.lang,
              url: t.url,
            }))
          : undefined,
        tags: frontmatter.tags ? [...frontmatter.tags] : undefined,
        externalUrl: frontmatter.externalUrl ?? null,
        hero,
        heroDimensions,
      }
      return post
    })

  const readFrontmatter = (slug: string) =>
    Effect.gen(function* () {
      const file = path.join(blogDir, slug, 'index.mdx')
      const raw = yield* fs
        .readFileString(file)
        .pipe(
          Effect.mapError(
            () => new ContentNotFound({ collection: BLOG, slug }),
          ),
        )
      const parsed = matter(raw)
      const frontmatter = yield* decodeBlogFrontmatter(slug, parsed.data)
      return { frontmatter, body: parsed.content, file }
    })

  const listSlugs = Effect.gen(function* () {
    const entries = yield* fs
      .readDirectory(blogDir)
      .pipe(Effect.orElseSucceed((): Array<string> => []))

    const slugs: Array<string> = []
    for (const name of entries) {
      const hasDocument = yield* fs
        .exists(path.join(blogDir, name, 'index.mdx'))
        .pipe(Effect.orElseSucceed(() => false))
      if (hasDocument) slugs.push(name)
    }
    return slugs
  })

  const getBlogPosts = () =>
    Effect.gen(function* () {
      const slugs = yield* listSlugs
      const posts = yield* Effect.forEach(slugs, (slug) =>
        readFrontmatter(slug).pipe(
          Effect.flatMap(({ frontmatter }) => toMetadata(slug, frontmatter)),
        ),
      )
      return posts
        .filter((post) => post.published)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    })

  const getBlogPost = (slug: string) =>
    Effect.gen(function* () {
      const { frontmatter, body, file } = yield* readFrontmatter(slug)
      const metadata = yield* toMetadata(slug, frontmatter)
      const info = yield* fs
        .stat(file)
        .pipe(
          Effect.mapError(
            () => new ContentNotFound({ collection: BLOG, slug }),
          ),
        )

      const mtime = Option.getOrElse(
        Option.map(info.mtime, (date) => date.getTime()),
        () => 0,
      )
      const cacheKey = `${slug}:${mtime}`
      let compiled = compiledCache.get(cacheKey)
      if (compiled === undefined) {
        compiled = yield* compileMdxBody(
          contentRoot,
          BLOG,
          slug,
          body,
          highlighter,
        )
        compiledCache.set(cacheKey, compiled)
      }

      const post: BlogPostWithBody = { ...metadata, body: compiled }
      return post
    })

  return { getBlogPosts, getBlogPost, readFrontmatter } as const
})
