import * as path from 'node:path'

import { defineCollection } from '@ntatoud/effect-collections'
import type { CollectionData } from '@ntatoud/effect-collections'

import { contentRoot, publicImageUrl } from '../content-url.ts'
import { BlogPostSchema } from '../schemas/blog.ts'
import { newestFirst } from '../sort.ts'
import { defineContentCollection } from './define.ts'
import { metaList } from './twin-lines.ts'

const collection = defineCollection({
  name: 'blogPosts',
  directory: path.join(contentRoot, 'blog'),
  schema: BlogPostSchema,
  // `null`, not `undefined`: the App branches on it, and `undefined` would mark every post external.
  transform: ({ hero, externalUrl, ...data }, meta) => ({
    ...data,
    slug: meta.slug,
    url: `/blog/${meta.slug}`,
    externalUrl: externalUrl ?? null,
    hero: hero ? publicImageUrl(hero, meta) : null,
    heroDimensions: hero ? { width: hero.width, height: hero.height } : null,
  }),
})

export type BlogPost = CollectionData<typeof collection>

export type BlogPostDetail = BlogPost & {
  html: string
}

export const blog = defineContentCollection({
  key: 'blogPosts',
  collection,
  reader: (documents) =>
    documents
      .map((doc) => doc.data)
      .filter((post) => post.published)
      .sort(newestFirst((post) => post.date)),
  index: {
    title: 'Blog',
    entry: (post) => ({
      title: post.title,
      routePath: post.url,
      description: post.description,
      note: post.date,
    }),
  },
  listingPage: { name: 'blog', path: '/blog' },
  detail: {
    loader: 'loadBlogPost',
    kind: 'blog',
    page: (post) => ({
      path: post.url,
      title: post.title,
      description: post.description,
      lastmod: post.date,
      details: [
        `- Published: ${post.date}`,
        `- Author: ${post.author}`,
        metaList('Tags', post.tags),
        post.externalUrl ? `- Originally published: ${post.externalUrl}` : null,
        metaList(
          'Translations',
          post.translations?.map(({ lang, url }) => `${lang}: ${url}`),
        ),
      ],
    }),
  },
})
