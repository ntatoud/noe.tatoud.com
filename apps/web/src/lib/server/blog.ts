import { ContentService } from '@ntatoud/effect-content'
import { createServerFn } from '@tanstack/react-start'

import { Effect } from 'effect'

import { rethrowContentError, runContentProgram } from './content-runtime'

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
