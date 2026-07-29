import { fileURLToPath } from 'node:url'

import { createElement } from 'react'

import { expect, layer } from '@effect/vitest'
import { Effect, Schema } from 'effect'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  CollectionError,
  Collections,
  CollectionsLive,
  defineCollection,
  DocumentNotFound,
} from '../index.ts'

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

// A fixture collection whose one document directory exists but has no
// `index.mdx` — the "present but unreadable" case.
const malformed = defineCollection({
  name: 'malformed',
  directory: fileURLToPath(new URL('./fixtures/malformed', import.meta.url)),
  schema: PostSchema,
})

// Points at a directory that does not exist — the misconfigured-collection case.
const absentCollection = defineCollection({
  name: 'absent',
  directory: fileURLToPath(new URL('./fixtures/absent', import.meta.url)),
  schema: PostSchema,
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

  it.effect('getBySlug raises DocumentNotFound for an absent slug', () =>
    Effect.gen(function* () {
      const collections = yield* Collections
      const error = yield* collections
        .getBySlug(posts, 'nonexistent')
        .pipe(Effect.flip)

      expect(error).toBeInstanceOf(DocumentNotFound)
      // Carries the collection *name*, never its absolute directory — the error
      // is serializable without disclosing a server filesystem path.
      expect(error).toMatchObject({
        collection: 'posts',
        slug: 'nonexistent',
      })
      expect(JSON.stringify(error)).not.toContain(postsDirectory)
    }),
  )

  // The other half of the not-found contract: only a genuinely absent document
  // is `DocumentNotFound`. A document that exists but cannot be read stays a
  // `CollectionError`, so a real bug surfaces as a 500 instead of a fake 404.
  it.effect(
    'getBySlug raises CollectionError when a present document cannot be read',
    () =>
      Effect.gen(function* () {
        const collections = yield* Collections
        const error = yield* collections
          .getBySlug(malformed, 'no-index')
          .pipe(Effect.flip)

        expect(error).toBeInstanceOf(CollectionError)
        expect(error).not.toBeInstanceOf(DocumentNotFound)
        expect(error).toMatchObject({ operation: 'readFile' })
      }),
  )

  // Slugs arrive from a URL segment, so they must not be able to address
  // anything but a direct child of the collection directory. Without this,
  // `../posts/hello-world` reads a real document from outside the collection
  // the caller asked about.
  it.effect('getBySlug refuses to escape the collection directory', () =>
    Effect.gen(function* () {
      const collections = yield* Collections

      for (const slug of [
        '../posts/hello-world',
        '..',
        '.',
        '',
        'nested/hello-world',
        'hello-world\0',
        // Longer than NAME_MAX. The OS rejects this with a reason other than
        // `NotFound`, so without the length screen it would 500 rather than 404
        // — and junk URLs this long are exactly what crawlers generate.
        'a'.repeat(300),
      ]) {
        const error = yield* collections
          .getBySlug(posts, slug)
          .pipe(Effect.flip)
        expect(error, `slug ${JSON.stringify(slug)}`).toBeInstanceOf(
          DocumentNotFound,
        )
      }
    }),
  )

  // A whole collection directory going missing is a misconfiguration, not a
  // missing document. Reporting it as `DocumentNotFound` would turn every detail
  // page into a silent 404 — and since not-found is deliberately never logged,
  // there would be nothing at all to notice it by.
  it.effect(
    'getBySlug raises CollectionError when the collection directory is absent',
    () =>
      Effect.gen(function* () {
        const collections = yield* Collections
        const error = yield* collections
          .getBySlug(absentCollection, 'hello-world')
          .pipe(Effect.flip)

        expect(error).toBeInstanceOf(CollectionError)
        expect(error).not.toBeInstanceOf(DocumentNotFound)
      }),
  )
})
