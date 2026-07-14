import { Effect, ParseResult, Schema } from 'effect'

import { FrontmatterInvalid } from '../engine/errors'
import { FrontmatterDate } from '../engine/schema'

/** Effect Schema for Experience Document frontmatter (mirrors the legacy valibot shape). */
export const ExperienceFrontmatter = Schema.Struct({
  title: Schema.String,
  organization: Schema.String,
  url: Schema.optional(Schema.String),
  startDate: FrontmatterDate,
  endDate: Schema.optional(FrontmatterDate),
  kind: Schema.Literal('work', 'volunteer', 'education'),
  logo: Schema.optional(Schema.String),
})

export type ExperienceFrontmatter = typeof ExperienceFrontmatter.Type

/** Decodes unknown frontmatter, mapping validation failures to a typed error. */
export const decodeExperienceFrontmatter = (slug: string, data: unknown) =>
  Schema.decodeUnknown(ExperienceFrontmatter)(data).pipe(
    Effect.mapError(
      (error) =>
        new FrontmatterInvalid({
          collection: 'experiences',
          slug,
          reason: ParseResult.TreeFormatter.formatErrorSync(error),
        }),
    ),
  )
