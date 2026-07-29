import * as path from 'node:path'

import type { ComponentType } from 'react'

import { Collections } from '@ntatoud/effect-collections'
import type { DocumentMeta } from '@ntatoud/effect-collections'

import { Effect } from 'effect'

import { blogPosts as blogPostsCollection } from '../collections'

export type BlogPost = {
  slug: string
  url: string
  title: string
  description: string | undefined
  author: string
  date: string
  published: boolean
  translations: ReadonlyArray<{ lang: string; url: string }> | undefined
  tags: ReadonlyArray<string> | undefined
  externalUrl: string | null
  hero: string | null
  heroDimensions: { width: number; height: number } | null
}

export type BlogPostDetail = BlogPost & {
  Content: ComponentType
}

const collectionName = path.basename(blogPostsCollection.directory)

/** Turns an absolute hero image path into a portable, content-root-relative URL path. */
function publicHeroPath(absolutePath: string): string {
  const relative = path.relative(blogPostsCollection.directory, absolutePath)
  return `/content/${collectionName}/${relative}`
}

function toBlogPost(
  doc: DocumentMeta<(typeof blogPostsCollection.schema)['Type']>,
): BlogPost {
  const post = { slug: doc.slug, ...doc.data }
  return {
    slug: post.slug,
    url: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    author: post.author,
    date: post.date,
    published: post.published,
    translations: post.translations,
    tags: post.tags,
    externalUrl: post.externalUrl ?? null,
    hero: post.hero ? publicHeroPath(post.hero.path) : null,
    heroDimensions: post.hero
      ? { width: post.hero.width, height: post.hero.height }
      : null,
  }
}

export const getBlogPosts = Collections.use((collections) =>
  collections.getAll(blogPostsCollection),
).pipe(
  Effect.map((docs) =>
    docs
      .map(toBlogPost)
      .filter((post) => post.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  ),
)

export const getBlogPost = (slug: string) =>
  Collections.use((collections) =>
    collections.getBySlug(blogPostsCollection, slug),
  ).pipe(
    Effect.map(
      (doc): BlogPostDetail => ({ ...toBlogPost(doc), Content: doc.Content }),
    ),
  )
