import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { NodeServices } from '@effect/platform-node'
import { describe, expect, it } from '@effect/vitest'
import { Effect, Layer } from 'effect'

import { ContentConfig, ContentService } from '../index'

const fixtures = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'fixtures',
)

const contentLayer = ContentService.Default.pipe(
  Layer.provide(ContentConfig.layer(path.join(fixtures, 'content'))),
  Layer.provideMerge(NodeServices.layer),
)

describe('blog collection wiring', () => {
  it.effect(
    'filters to published, orders date-desc, wires /blog + /content',
    () =>
      Effect.gen(function* () {
        const content = yield* ContentService

        const posts = yield* content.blog.list()
        expect(posts.every((post) => post.published)).toBe(true)
        expect(posts.map((post) => post.slug)).toEqual([
          'beta-post',
          'alpha-post',
        ])

        const post = yield* content.blog.get('alpha-post')
        expect(post.url).toBe('/blog/alpha-post')
        expect(post.hero?.src).toBe('/content/blog/alpha-post/hero.png')
      }).pipe(Effect.provide(contentLayer)),
  )
})
