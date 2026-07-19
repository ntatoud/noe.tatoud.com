import * as path from 'node:path'

import type { ComponentType } from 'react'

import { getAll, getBySlug } from '@ntatoud/effect-collections'
import type { DocumentMeta } from '@ntatoud/effect-collections'

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

export async function getBlogPosts(): Promise<BlogPost[]> {
  const docs = await getAll(blogPostsCollection)
  return docs
    .map(toBlogPost)
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getBlogPost(slug: string): Promise<BlogPostDetail> {
  const doc = await getBySlug(blogPostsCollection, slug)
  return { ...toBlogPost(doc), Content: doc.Content }
}
