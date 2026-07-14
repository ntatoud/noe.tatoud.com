import { Effect, ParseResult, Schema } from 'effect'

import { FrontmatterInvalid } from '../engine/errors'
import { FrontmatterDate } from '../engine/schema'

/** Effect Schema for Project Document frontmatter (mirrors the legacy valibot shape). */
export const ProjectFrontmatter = Schema.Struct({
  title: Schema.String,
  description: Schema.optional(Schema.String),
  date: FrontmatterDate,
  published: Schema.optionalWith(Schema.Boolean, { default: () => false }),
  kind: Schema.optionalWith(Schema.Literal('personal', 'contribution'), {
    default: () => 'personal',
  }),
  url: Schema.optional(Schema.String),
  repo: Schema.optional(Schema.String),
  tags: Schema.optional(Schema.Array(Schema.String)),
})

export type ProjectFrontmatter = typeof ProjectFrontmatter.Type

/** Decodes unknown frontmatter, mapping validation failures to a typed error. */
export const decodeProjectFrontmatter = (slug: string, data: unknown) =>
  Schema.decodeUnknown(ProjectFrontmatter)(data).pipe(
    Effect.mapError(
      (error) =>
        new FrontmatterInvalid({
          collection: 'projects',
          slug,
          reason: ParseResult.TreeFormatter.formatErrorSync(error),
        }),
    ),
  )
