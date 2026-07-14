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

describe('getTalks', () => {
  it.effect(
    'orders talks by their most recent Event date descending, not by a event array position',
    () =>
      Effect.gen(function* () {
        const content = yield* ContentService
        const talks = yield* content.getTalks()

        // gamma-talk's latest Event (2026-12-01) is its *first* array entry,
        // alpha-talk's latest (2026-01-01) is its *last* entry, and
        // beta-talk's latest (2025-06-01) is its *first* entry — so neither
        // "take events[0]" nor "take events[at(-1)]" reproduces this order;
        // only reducing over every Event's date does.
        expect(talks.map((talk) => talk.slug)).toEqual([
          'gamma-talk',
          'alpha-talk',
          'beta-talk',
          'delta-talk',
        ])
      }).pipe(Effect.provide(contentLayer)),
  )

  it.effect('defaults kind to talk and events to an empty array', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const talks = yield* content.getTalks()
      const delta = talks.find((talk) => talk.slug === 'delta-talk')

      expect(delta?.kind).toBe('talk')
      expect(delta?.events).toEqual([])
      expect(delta?.resource).toBeUndefined()
      expect(delta?.tags).toBeUndefined()
    }).pipe(Effect.provide(contentLayer)),
  )

  it.effect('passes an Event logo reference through unresolved', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const talks = yield* content.getTalks()
      const alpha = talks.find((talk) => talk.slug === 'alpha-talk')
      const firstEvent = alpha?.events.find(
        (event) => event.event === 'Alpha Conf',
      )

      expect(firstEvent?.logo).toBe('/logos/alpha-conf.png')
      expect(firstEvent?.url).toBe('https://alphaconf.example.com')
    }).pipe(Effect.provide(contentLayer)),
  )

  it.effect('carries the resource link through unchanged', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const talks = yield* content.getTalks()
      const alpha = talks.find((talk) => talk.slug === 'alpha-talk')

      expect(alpha?.resource).toEqual({
        kind: 'slides',
        url: 'https://slides.example.com/alpha',
      })
    }).pipe(Effect.provide(contentLayer)),
  )
})

describe('getTalk', () => {
  it.effect('returns metadata plus a compiled function-body string', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const talk = yield* content.getTalk('alpha-talk')

      expect(talk.slug).toBe('alpha-talk')
      expect(talk.title).toBe('Alpha Talk')
      expect(talk.events).toHaveLength(2)
      expect(typeof talk.body).toBe('string')
      expect(talk.body.length).toBeGreaterThan(0)
    }).pipe(Effect.provide(contentLayer)),
  )
})

describe('typed failures', () => {
  it.effect('missing Document -> ContentNotFound', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const error = yield* Effect.flip(content.getTalk('does-not-exist'))

      expect(error).toBeInstanceOf(ContentNotFound)
    }).pipe(Effect.provide(contentLayer)),
  )

  it.effect('invalid frontmatter -> FrontmatterInvalid', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const error = yield* Effect.flip(content.getTalk('missing-fields'))

      expect(error).toBeInstanceOf(FrontmatterInvalid)
    }).pipe(Effect.provide(invalidLayer)),
  )

  it.effect('un-compilable MDX -> CompileFailed', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const error = yield* Effect.flip(content.getTalk('broken-mdx'))

      expect(error).toBeInstanceOf(CompileFailed)
    }).pipe(Effect.provide(uncompilableLayer)),
  )
})
