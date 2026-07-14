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

// The engine depends on the abstract FileSystem/Path services; the runner
// (here, the test) supplies a concrete platform via NodeContext.layer.
const layerFor = (root: string) =>
  ContentService.Default.pipe(
    Layer.provide(ContentConfig.layer(root)),
    Layer.provideMerge(NodeContext.layer),
  )

const contentLayer = layerFor(path.join(fixtures, 'content'))
const invalidLayer = layerFor(path.join(fixtures, 'invalid-frontmatter'))
const uncompilableLayer = layerFor(path.join(fixtures, 'uncompilable'))

describe('getProjects', () => {
  it.effect(
    'returns only published projects, personal-kind first then contribution',
    () =>
      Effect.gen(function* () {
        const content = yield* ContentService
        const projects = yield* content.getProjects()

        expect(projects.map((project) => project.slug)).toEqual([
          'beta-project',
          'alpha-project',
        ])
        expect(projects.every((project) => project.published)).toBe(true)
      }).pipe(Effect.provide(contentLayer)),
  )
})

describe('getProject', () => {
  it.effect('returns metadata plus a compiled function-body string', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const project = yield* content.getProject('beta-project')

      expect(project.slug).toBe('beta-project')
      expect(project.title).toBe('Beta Project')
      expect(project.kind).toBe('personal')
      expect(typeof project.body).toBe('string')
      expect(project.body.length).toBeGreaterThan(0)
    }).pipe(Effect.provide(contentLayer)),
  )

  it.effect(
    'rewrites an inline body image to a /content/projects URL with stamped dimensions',
    () =>
      Effect.gen(function* () {
        const content = yield* ContentService
        const project = yield* content.getProject('alpha-project')

        expect(project.body).toContain(
          '/content/projects/alpha-project/hero.png',
        )
        expect(project.body).not.toContain('src: "./hero.png"')
        expect(project.body).toMatch(/width:\s*"?80"?/)
        expect(project.body).toMatch(/height:\s*"?80"?/)
      }).pipe(Effect.provide(contentLayer)),
  )

  it.effect(
    'compiles an embedded custom MDX component reference (ProjectCta)',
    () =>
      Effect.gen(function* () {
        const content = yield* ContentService
        const project = yield* content.getProject('alpha-project')

        expect(project.body).toContain('ProjectCta')
      }).pipe(Effect.provide(contentLayer)),
  )
})

describe('typed failures', () => {
  it.effect('missing Document -> ContentNotFound', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const error = yield* Effect.flip(content.getProject('does-not-exist'))

      expect(error).toBeInstanceOf(ContentNotFound)
    }).pipe(Effect.provide(contentLayer)),
  )

  it.effect('invalid frontmatter -> FrontmatterInvalid', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const error = yield* Effect.flip(content.getProject('missing-fields'))

      expect(error).toBeInstanceOf(FrontmatterInvalid)
    }).pipe(Effect.provide(invalidLayer)),
  )

  it.effect('un-compilable MDX -> CompileFailed', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const error = yield* Effect.flip(content.getProject('broken-mdx'))

      expect(error).toBeInstanceOf(CompileFailed)
    }).pipe(Effect.provide(uncompilableLayer)),
  )
})
