import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { NodeContext } from '@effect/platform-node'
import { describe, expect, it } from '@effect/vitest'
import { Effect, Layer } from 'effect'

import { ContentConfig, ContentService } from '../index'

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
const missingImageLayer = layerFor(path.join(fixtures, 'missing-image'))

describe('validate', () => {
  it.effect('reports no issues for a well-formed content tree', () =>
    Effect.gen(function* () {
      const content = yield* ContentService
      const issues = yield* content.validate()

      expect(issues).toEqual([])
    }).pipe(Effect.provide(contentLayer)),
  )

  it.effect(
    'reports frontmatter-invalid for every collection, naming the slug and the offending field',
    () =>
      Effect.gen(function* () {
        const content = yield* ContentService
        const issues = yield* content.validate()

        expect(issues).toHaveLength(4)
        expect(
          issues.every((issue) => issue.kind === 'frontmatter-invalid'),
        ).toBe(true)
        expect(issues.every((issue) => issue.slug === 'missing-fields')).toBe(
          true,
        )

        const blogIssue = issues.find((issue) => issue.collection === 'blog')
        expect(blogIssue?.file).toMatch(
          /blog[/\\]missing-fields[/\\]index\.mdx$/,
        )
        expect(blogIssue?.detail).toContain('title')
      }).pipe(Effect.provide(invalidLayer)),
  )

  it.effect(
    'reports compile-failed for every collection, naming the slug',
    () =>
      Effect.gen(function* () {
        const content = yield* ContentService
        const issues = yield* content.validate()

        expect(issues).toHaveLength(4)
        expect(issues.every((issue) => issue.kind === 'compile-failed')).toBe(
          true,
        )
        expect(issues.every((issue) => issue.slug === 'broken-mdx')).toBe(true)
      }).pipe(Effect.provide(uncompilableLayer)),
  )

  it.effect(
    'reports image-not-found for a missing hero, logo, and inline body image',
    () =>
      Effect.gen(function* () {
        const content = yield* ContentService
        const issues = yield* content.validate()
        const imageIssues = issues.filter(
          (issue) => issue.kind === 'image-not-found',
        )

        expect(imageIssues).toHaveLength(3)

        const hero = imageIssues.find((issue) => issue.slug === 'missing-hero')
        expect(hero?.collection).toBe('blog')
        expect(hero?.detail).toContain('does-not-exist.png')

        const bodyImage = imageIssues.find(
          (issue) => issue.slug === 'missing-body-image',
        )
        expect(bodyImage?.collection).toBe('blog')

        const logo = imageIssues.find((issue) => issue.slug === 'missing-logo')
        expect(logo?.collection).toBe('experiences')
      }).pipe(Effect.provide(missingImageLayer)),
  )
})
