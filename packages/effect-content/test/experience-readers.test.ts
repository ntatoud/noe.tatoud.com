import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { NodeContext } from '@effect/platform-node'
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

const layerFor = (root: string) =>
  ContentService.Default.pipe(
    Layer.provide(ContentConfig.layer(root)),
    Layer.provideMerge(NodeContext.layer),
  )

const contentLayer = layerFor(path.join(fixtures, 'content'))
const invalidLayer = layerFor(path.join(fixtures, 'invalid-frontmatter'))
const uncompilableLayer = layerFor(path.join(fixtures, 'uncompilable'))

describe('getExperiences', () => {
  it.effect('orders experiences by startDate descending', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const experiences = yield* content.getExperiences()

      expect(experiences.map((experience) => experience.slug)).toEqual([
        'beta-experience',
        'alpha-experience',
      ])
    }).pipe(Effect.provide(contentLayer)),
  )

  it.effect('inlines the logo as a base64 data-URL', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const experiences = yield* content.getExperiences()
      const alpha = experiences.find(
        (experience) => experience.slug === 'alpha-experience',
      )

      expect(alpha?.logo).toMatch(/^data:image\/png;base64,/)
    }).pipe(Effect.provide(contentLayer)),
  )

  it.effect('leaves logo null when frontmatter has no logo', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const experiences = yield* content.getExperiences()
      const beta = experiences.find(
        (experience) => experience.slug === 'beta-experience',
      )

      expect(beta?.logo).toBeNull()
    }).pipe(Effect.provide(contentLayer)),
  )
})

describe('getExperience', () => {
  it.effect('returns metadata plus a compiled function-body string', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const experience = yield* content.getExperience('alpha-experience')

      expect(experience.slug).toBe('alpha-experience')
      expect(experience.title).toBe('Senior Engineer')
      expect(experience.organization).toBe('Alpha Corp')
      expect(experience.kind).toBe('work')
      expect(typeof experience.body).toBe('string')
      expect(experience.body.length).toBeGreaterThan(0)
    }).pipe(Effect.provide(contentLayer)),
  )
})

describe('typed failures', () => {
  it.effect('missing Document -> ContentNotFound', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const error = yield* Effect.flip(content.getExperience('does-not-exist'))

      expect(error).toBeInstanceOf(ContentNotFound)
    }).pipe(Effect.provide(contentLayer)),
  )

  it.effect('invalid frontmatter -> FrontmatterInvalid', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const error = yield* Effect.flip(content.getExperience('missing-fields'))

      expect(error).toBeInstanceOf(FrontmatterInvalid)
    }).pipe(Effect.provide(invalidLayer)),
  )

  it.effect('un-compilable MDX -> CompileFailed', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const error = yield* Effect.flip(content.getExperience('broken-mdx'))

      expect(error).toBeInstanceOf(CompileFailed)
    }).pipe(Effect.provide(uncompilableLayer)),
  )
})
