import { ContentService } from '@ntatoud/effect-content'
import { createServerFn } from '@tanstack/react-start'

import { Effect } from 'effect'

import { rethrowContentError, runContentProgram } from './content-runtime'

/**
 * Experiences server-fn seam: wraps the two Experience
 * `@ntatoud/effect-content` programs in `createServerFn` so filesystem work
 * (and the MDX/Shiki toolchain) stays server-only. `@/lib/content` is the
 * only intended caller.
 */
export const getExperiencesServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    return await runContentProgram(
      Effect.gen(function* () {
        const content = yield* ContentService
        return yield* content.getExperiences()
      }),
    )
  } catch (error) {
    rethrowContentError(error)
  }
})

export const getExperienceServerFn = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
      return await runContentProgram(
        Effect.gen(function* () {
          const content = yield* ContentService
          return yield* content.getExperience(slug)
        }),
      )
    } catch (error) {
      rethrowContentError(error)
    }
  })
