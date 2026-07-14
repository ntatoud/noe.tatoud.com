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
  Image,
  isRelativeRef,
  Logo,
  makeCollections,
  makeReaders,
  type ResolvedImage,
  resolveLogo,
} from '../index'

const fixtures = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'fixtures',
)

const ASSET_BASE_URL = '/assets'

// A generic fixture collection exercised purely through the public
// `defineCollection` + `makeReaders` API — no blog/project knowledge, and no
// `toMetadata`: `slug`/`url` and image resolution are automatic.
const NoteFrontmatter = Schema.Struct({
  title: Schema.String,
  date: Schema.String,
  published: Schema.Boolean.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed(false)),
  ),
  cover: Schema.optional(Image),
  logo: Schema.optional(Logo),
})

const notes = defineCollection({
  name: 'notes',
  schema: NoteFrontmatter,
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

describe('makeReaders — get (auto slug/url)', () => {
  it.effect('returns auto slug/url plus a non-empty compiled body', () =>
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
})

describe('makeReaders — automatic image resolution (no toMetadata)', () => {
  it.effect(
    'an Image field resolves to <assetBaseUrl>/<name>/<slug>/<file>',
    () =>
      Effect.gen(function* () {
        const note = yield* readers.get('first-note')

        // The schema declared `cover: Image`; the reader resolved it with no
        // `toMetadata` in sight.
        const cover: ResolvedImage | undefined = note.cover
        expect(cover?.src).toBe('/assets/notes/first-note/cover.png')
        expect(cover?.width ?? 0).toBeGreaterThan(0)
        expect(cover?.height ?? 0).toBeGreaterThan(0)
      }).pipe(Effect.provide(contentLayer)),
  )

  it.effect('a Logo field resolves to an inlined base64 data URL', () =>
    Effect.gen(function* () {
      const note = yield* readers.get('first-note')

      const logo: ResolvedImage | undefined = note.logo
      expect(logo?.src.startsWith('data:image/png;base64,')).toBe(true)
      expect(logo?.width ?? 0).toBeGreaterThan(0)
      expect(logo?.height ?? 0).toBeGreaterThan(0)
    }).pipe(Effect.provide(contentLayer)),
  )

  it.effect('an absent optional image stays undefined', () =>
    Effect.gen(function* () {
      const note = yield* readers.get('second-note')

      expect(note.cover).toBeUndefined()
      expect(note.logo).toBeUndefined()
    }).pipe(Effect.provide(contentLayer)),
  )
})

describe('image resolution', () => {
  it.effect('resolveLogo inlines the file as a base64 data URL', () =>
    Effect.gen(function* () {
      const logo = yield* resolveLogo('notes', 'first-note', './cover.png')

      expect(logo.src.startsWith('data:image/png;base64,')).toBe(true)
      expect(logo.src.length).toBeGreaterThan('data:image/png;base64,'.length)
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

describe('makeCollections — layer-boundary injection', () => {
  // The env is provided ONCE, to the `makeCollections` effect. The resulting
  // accessors escape with `R = never`, so the test body below runs the readers
  // with no `Effect.provide` of its own — the whole point of the accessor.
  const content = makeCollections({ notes }).pipe(Effect.provide(contentLayer))

  it.effect(
    'yields env-injected notes.list()/get() that run with no plumbing',
    () =>
      Effect.gen(function* () {
        const { notes: reader } = yield* content

        const metas = yield* reader.list()
        expect(metas.map((note) => note.slug)).toEqual([
          'second-note',
          'first-note',
        ])
        expect(metas.every((note) => note.published)).toBe(true)

        const note = yield* reader.get('second-note')
        expect(note.slug).toBe('second-note')
        expect(note.url).toBe('/notes/second-note')
        expect(typeof note.body).toBe('string')
        expect(note.body.length).toBeGreaterThan(0)
      }),
  )
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
