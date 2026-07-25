import { fileURLToPath } from 'node:url'

import { createElement } from 'react'

import { expect, layer } from '@effect/vitest'
import { Effect, Schema } from 'effect'
import { renderToStaticMarkup } from 'react-dom/server'

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
// under test. `getAll`/`getBySlug` return the transformed shape, not raw
// frontmatter.
const posts = defineCollection({
  name: 'posts',
  directory: postsDirectory,
  schema: PostSchema,
  transform: (data, meta) =>
    Effect.succeed({ ...data, url: `/posts/${meta.slug}` }),
})

// The expected decoded + transformed shape for the `hello-world` fixture,
// shared by the `getAll` and `getBySlug` assertions.
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

        // `published` defaulted to `false`; absent optional `tags` stays absent.
        expect(bySlug.get('second-post')?.data).toEqual({
          title: 'Second Post',
          published: false,
          url: '/posts/second-post',
        })
      }),
  )

  it.effect(
    'getBySlug returns a document whose data matches its frontmatter and whose body is compiled',
    () =>
      Effect.gen(function* () {
        const collections = yield* Collections
        const doc = yield* collections.getBySlug(posts, 'hello-world')

        expect(doc.slug).toBe('hello-world')
        expect(doc.data).toEqual(helloWorldData)

        // The body compiled into a real component that renders the MDX markup.
        const html = renderToStaticMarkup(createElement(doc.Content))
        expect(html).toContain('<h1')
        expect(html).toContain('Hello')
        expect(html).toContain('<strong>first</strong>')
      }),
  )
})
