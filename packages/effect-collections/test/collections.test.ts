import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { NodeServices } from '@effect/platform-node'
import { describe, expect, it } from '@effect/vitest'
import { Effect, Layer, Schema } from 'effect'

import {
  collectImageRefs,
  CollectionsConfig,
  CompileFailed,
  ContentNotFound,
  defineCollection,
  FrontmatterInvalid,
  HighlighterService,
  isRelativeRef,
  makeReaders,
  resolveLogo,
} from '../index'

const fixtures = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'fixtures',
)

const ASSET_BASE_URL = '/assets'

// A generic fixture collection exercised purely through the public
// `defineCollection` + `makeReaders` API — no blog/project knowledge.
const NoteFrontmatter = Schema.Struct({
  title: Schema.String,
  date: Schema.String,
  published: Schema.Boolean.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed(false)),
  ),
  cover: Schema.optional(Schema.String),
})

type NoteMeta = {
  readonly slug: string
  readonly url: string
  readonly title: string
  readonly date: string
  readonly published: boolean
  readonly cover: string | null
  readonly coverWidth: number | null
  readonly coverHeight: number | null
}

const notes = defineCollection({
  name: 'notes',
  schema: NoteFrontmatter,
  toMetadata: ({ slug, frontmatter, resolveImage }) =>
    Effect.gen(function* () {
      let cover: string | null = null
      let coverWidth: number | null = null
      let coverHeight: number | null = null
      if (frontmatter.cover) {
        const resolved = yield* resolveImage(frontmatter.cover)
        cover = resolved.url
        coverWidth = resolved.width
        coverHeight = resolved.height
      }
      const meta: NoteMeta = {
        slug,
        url: `/notes/${slug}`,
        title: frontmatter.title,
        date: frontmatter.date,
        published: frontmatter.published,
        cover,
        coverWidth,
        coverHeight,
      }
      return meta
    }),
  include: (note) => note.published,
  order: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
})

const readers = makeReaders(notes)

// The engine depends on the abstract FileSystem/Path services; the test supplies
// a concrete platform via NodeServices.layer.
const layerFor = (root: string) =>
  Layer.mergeAll(
    CollectionsConfig.layer({
      contentRoot: root,
      assetBaseUrl: ASSET_BASE_URL,
    }),
    HighlighterService.Default,
    NodeServices.layer,
  )

const contentLayer = layerFor(path.join(fixtures, 'content'))
const invalidLayer = layerFor(path.join(fixtures, 'invalid'))
const brokenLayer = layerFor(path.join(fixtures, 'broken'))

describe('makeReaders — list', () => {
  it.effect('applies include (filter) and order (sort)', () =>
    Effect.gen(function* () {
      const metas = yield* readers.list

      expect(metas.map((note) => note.slug)).toEqual([
        'second-note',
        'first-note',
      ])
      expect(metas.every((note) => note.published)).toBe(true)
    }).pipe(Effect.provide(contentLayer)),
  )
})

describe('makeReaders — get', () => {
  it.effect('returns metadata plus a non-empty compiled body', () =>
    Effect.gen(function* () {
      const note = yield* readers.get('second-note')

      expect(note.slug).toBe('second-note')
      expect(note.url).toBe('/notes/second-note')
      expect(typeof note.body).toBe('string')
      expect(note.body.length).toBeGreaterThan(0)
      // inline `![](./inline.png)` was rewritten against assetBaseUrl
      expect(note.body).toContain('/assets/notes/second-note/inline.png')
    }).pipe(Effect.provide(contentLayer)),
  )

  it.effect(
    'resolves an image ref to <assetBaseUrl>/<name>/<slug>/<file>',
    () =>
      Effect.gen(function* () {
        const note = yield* readers.get('first-note')

        expect(note.cover).toBe('/assets/notes/first-note/cover.png')
        expect(note.coverWidth ?? 0).toBeGreaterThan(0)
        expect(note.coverHeight ?? 0).toBeGreaterThan(0)
      }).pipe(Effect.provide(contentLayer)),
  )
})

describe('image resolution', () => {
  it.effect('resolveLogo inlines the file as a base64 data URL', () =>
    Effect.gen(function* () {
      const logo = yield* resolveLogo('notes', 'first-note', './cover.png')

      expect(logo.url.startsWith('data:image/png;base64,')).toBe(true)
      expect(logo.url.length).toBeGreaterThan('data:image/png;base64,'.length)
    }).pipe(Effect.provide(contentLayer)),
  )

  it('isRelativeRef distinguishes local refs from URLs and root paths', () => {
    expect(isRelativeRef('./x.png')).toBe(true)
    expect(isRelativeRef('nested/x.png')).toBe(true)
    expect(isRelativeRef('https://cdn.example.com/x.png')).toBe(false)
    expect(isRelativeRef('/content/x.png')).toBe(false)
    expect(isRelativeRef('data:image/png;base64,AAAA')).toBe(false)
  })

  it('collectImageRefs finds relative markdown + html image refs', () => {
    const refs = collectImageRefs(
      '![a](./a.png)\n<img src="./b.png">\n![c](https://x/c.png)',
    )
    expect(refs).toEqual(['./a.png', './b.png'])
  })
})

describe('typed failures', () => {
  it.effect('missing Document -> ContentNotFound', () =>
    Effect.gen(function* () {
      const error = yield* Effect.flip(readers.get('does-not-exist'))
      expect(error).toBeInstanceOf(ContentNotFound)
    }).pipe(Effect.provide(contentLayer)),
  )

  it.effect('invalid frontmatter -> FrontmatterInvalid', () =>
    Effect.gen(function* () {
      const error = yield* Effect.flip(readers.get('bad-note'))
      expect(error).toBeInstanceOf(FrontmatterInvalid)
    }).pipe(Effect.provide(invalidLayer)),
  )

  it.effect('un-compilable MDX -> CompileFailed', () =>
    Effect.gen(function* () {
      const error = yield* Effect.flip(readers.get('broken-note'))
      expect(error).toBeInstanceOf(CompileFailed)
    }).pipe(Effect.provide(brokenLayer)),
  )
})
