import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, layer } from '@effect/vitest'
import { Effect, Schema } from 'effect'

import { Collections, CollectionsLive, defineCollection } from '../index.ts'

// A fixture Content Collection checked in under the package's test fixtures.
// `defineCollection`'s `directory` param points the real service at it, so no
// production code changes to exercise real filesystem reads, schema decoding,
// and the `transform` extension point.
const PostSchema = Schema.Struct({
  title: Schema.String,
  // Exercises decode-time defaulting: `second-post` omits `published`.
  published: Schema.Boolean.pipe(
    Schema.withDecodingDefaultTypeKey(Effect.succeed(false)),
  ),
  tags: Schema.optionalKey(Schema.Array(Schema.String)),
})

const postsDirectory = fileURLToPath(
  new URL('./fixtures/posts', import.meta.url),
)

// A `transform` that derives a public URL from the slug — the extension point
// under test. `getAll` returns the transformed shape, not raw
// frontmatter.
const posts = defineCollection({
  name: 'posts',
  directory: postsDirectory,
  schema: PostSchema,
  transform: (data, meta) =>
    Effect.succeed({ ...data, url: `/posts/${meta.slug}` }),
})

// A fixture whose only document omits the required `title`, so decoding fails.
const brokenDirectory = fileURLToPath(
  new URL('./fixtures/broken', import.meta.url),
)

const broken = defineCollection({
  name: 'broken',
  directory: brokenDirectory,
  schema: PostSchema,
  transform: (data) => Effect.succeed(data),
})

// The expected decoded + transformed shape for the `hello-world` fixture.
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
        // `source` is the raw file, frontmatter included: the markdown twins and
        // the detail modules are built from it.
        expect(bySlug.get('hello-world')?.source).toContain(
          'title: Hello World',
        )

        // `published` defaulted to `false`; absent optional `tags` stays absent.
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
      // The message is what a failed build prints: it must say which file to
      // fix and why, not be an empty string.
      expect(error.message).toContain(path.join('missing-title', 'index.mdx'))
      expect(error.message).toContain('title')
    }),
  )
})
