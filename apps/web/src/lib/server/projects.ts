import { ContentService } from '@ntatoud/effect-content'
import { createServerFn } from '@tanstack/react-start'

import { Effect } from 'effect'

import { rethrowContentError, runContentProgram } from './content-runtime'

/**
 * Projects server-fn seam: wraps the two Project `@ntatoud/effect-content`
 * programs in `createServerFn` so filesystem work (and the MDX/Shiki
 * toolchain) stays server-only. `@/lib/content` is the only intended caller.
 */
export const getProjectsServerFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      return await runContentProgram(
        Effect.gen(function* () {
          const content = yield* ContentService
          return yield* content.getProjects()
        }),
      )
    } catch (error) {
      rethrowContentError(error)
    }
  },
)

export const getProjectServerFn = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
      return await runContentProgram(
        Effect.gen(function* () {
          const content = yield* ContentService
          return yield* content.getProject(slug)
        }),
      )
    } catch (error) {
      rethrowContentError(error)
    }
  })
