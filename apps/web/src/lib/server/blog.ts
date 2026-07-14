import { ContentService } from '@ntatoud/effect-content'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { Effect } from 'effect'

import { runContentProgram } from './content-runtime'

function isTagged(error: unknown): error is { _tag: string } {
  return typeof error === 'object' && error !== null && '_tag' in error
}

/**
 * Maps `ContentNotFound` to a router `notFound()`; rethrows everything else
 * (`FrontmatterInvalid`, `CompileFailed`, defects) as-is for the nearest
 * route `errorComponent` (ADR-0006 / ADR-0007, issue #95).
 */
function rethrowContentError(error: unknown): never {
  if (isTagged(error) && error._tag === 'ContentNotFound') {
    throw notFound()
  }
  throw error
}

/**
 * Blog server-fn seam: wraps the two Blog `@ntatoud/effect-content` programs
 * in `createServerFn` so filesystem work (and the MDX/Shiki toolchain) stays
 * server-only. `@/lib/content` is the only intended caller.
 */
export const getBlogPostsServerFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      return await runContentProgram(
        Effect.gen(function* () {
          const content = yield* ContentService
          return yield* content.getBlogPosts()
        }),
      )
    } catch (error) {
      rethrowContentError(error)
    }
  },
)

export const getBlogPostServerFn = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
      return await runContentProgram(
        Effect.gen(function* () {
          const content = yield* ContentService
          return yield* content.getBlogPost(slug)
        }),
      )
    } catch (error) {
      rethrowContentError(error)
    }
  })
