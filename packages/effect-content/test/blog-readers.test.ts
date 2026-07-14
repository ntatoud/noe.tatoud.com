import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { NodeServices } from '@effect/platform-node'
import { describe, expect, it } from '@effect/vitest'
import { Effect, Layer } from 'effect'

import {
  CompileFailed,
  ContentConfig,
  ContentNotFound,
  ContentService,
  FrontmatterInvalid,
} from '../index'

const fixtures = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'fixtures',
)

// The engine depends on the abstract FileSystem/Path services; the runner
// (here, the test) supplies a concrete platform via NodeServices.layer.
const layerFor = (root: string) =>
  ContentService.Default.pipe(
    Layer.provide(ContentConfig.layer(root)),
    Layer.provideMerge(NodeServices.layer),
  )

const contentLayer = layerFor(path.join(fixtures, 'content'))
const invalidLayer = layerFor(path.join(fixtures, 'invalid-frontmatter'))
const uncompilableLayer = layerFor(path.join(fixtures, 'uncompilable'))

describe('getBlogPosts', () => {
  it.effect('returns only published posts, sorted date-descending', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const posts = yield* content.getBlogPosts()

      expect(posts.map((post) => post.slug)).toEqual([
        'beta-post',
        'alpha-post',
      ])
      expect(posts.every((post) => post.published)).toBe(true)
    }).pipe(Effect.provide(contentLayer)),
  )
})

describe('getBlogPost', () => {
  it.effect('returns metadata plus a compiled function-body string', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const post = yield* content.getBlogPost('beta-post')

      expect(post.slug).toBe('beta-post')
      expect(post.url).toBe('/blog/beta-post')
      expect(post.title).toBe('Beta Post')
      expect(typeof post.body).toBe('string')
      expect(post.body.length).toBeGreaterThan(0)
    }).pipe(Effect.provide(contentLayer)),
  )

  it.effect('resolves the hero to a /content URL with stamped dimensions', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const post = yield* content.getBlogPost('alpha-post')

      const hero = post.hero
      expect(hero).not.toBeUndefined()
      expect(hero?.src).toBe('/content/blog/alpha-post/hero.png')
      expect(typeof hero?.width).toBe('number')
      expect(typeof hero?.height).toBe('number')
      expect(hero?.width ?? 0).toBeGreaterThan(0)
      expect(hero?.height ?? 0).toBeGreaterThan(0)
    }).pipe(Effect.provide(contentLayer)),
  )
})

describe('typed failures', () => {
  it.effect('missing Document -> ContentNotFound', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const error = yield* Effect.flip(content.getBlogPost('does-not-exist'))

      expect(error).toBeInstanceOf(ContentNotFound)
    }).pipe(Effect.provide(contentLayer)),
  )

  it.effect('invalid frontmatter -> FrontmatterInvalid', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const error = yield* Effect.flip(content.getBlogPost('missing-fields'))

      expect(error).toBeInstanceOf(FrontmatterInvalid)
    }).pipe(Effect.provide(invalidLayer)),
  )

  it.effect('un-compilable MDX -> CompileFailed', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const error = yield* Effect.flip(content.getBlogPost('broken-mdx'))

      expect(error).toBeInstanceOf(CompileFailed)
    }).pipe(Effect.provide(uncompilableLayer)),
  )
})
