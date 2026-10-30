import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, layer } from '@effect/vitest'
import { Effect, Schema } from 'effect'

import { Collections, CollectionsLive, defineCollection } from '../index.ts'

const PostSchema = Schema.Struct({
  title: Schema.String,
  published: Schema.Boolean.pipe(
    Schema.withDecodingDefaultTypeKey(Effect.succeed(false)),
  ),
  tags: Schema.optionalKey(Schema.Array(Schema.String)),
})

const postsDirectory = fileURLToPath(
  new URL('./fixtures/posts', import.meta.url),
)

const posts = defineCollection({
  name: 'posts',
  directory: postsDirectory,
  schema: PostSchema,
  transform: (data, meta) => ({ ...data, url: `/posts/${meta.slug}` }),
})

const brokenDirectory = fileURLToPath(
  new URL('./fixtures/broken', import.meta.url),
)

const broken = defineCollection({
  name: 'broken',
  directory: brokenDirectory,
  schema: PostSchema,
  transform: (data) => data,
})

const helloWorldData = {
  title: 'Hello World',
  published: true,
  tags: ['intro', 'demo'],
  url: '/posts/hello-world',
}

layer(CollectionsLive)('Collections', (it) => {
  it.effect(
    'getAll returns decoded, transformed frontmatter for each document',
    () =>
      Effect.gen(function* () {
        const collections = yield* Collections
        const docs = yield* collections.getAll(posts)
        const bySlug = new Map(docs.map((doc) => [doc.slug, doc]))

        expect([...bySlug.keys()].sort()).toEqual([
          'hello-world',
          'second-post',
        ])

        expect(bySlug.get('hello-world')?.data).toEqual(helloWorldData)
        expect(bySlug.get('hello-world')?.source).toContain(
          'title: Hello World',
        )

        expect(bySlug.get('second-post')?.data).toEqual({
          title: 'Second Post',
          published: false,
          url: '/posts/second-post',
        })
      }),
  )

  it.effect('getAll failures name the document and the schema issue', () =>
    Effect.gen(function* () {
      const collections = yield* Collections
      const error = yield* Effect.flip(collections.getAll(broken))

      expect(error._tag).toBe('effect-collections/CollectionError')
      expect(error.operation).toBe('decode')
      expect(error.path).toBe(
        path.join(brokenDirectory, 'missing-title', 'index.mdx'),
      )
      expect(error.message).toContain(path.join('missing-title', 'index.mdx'))
      expect(error.message).toContain('title')
    }),
  )
})
