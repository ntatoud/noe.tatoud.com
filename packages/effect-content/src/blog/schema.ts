import { Effect, ParseResult, Schema } from 'effect'

import { FrontmatterInvalid } from '../engine/errors'
import { FrontmatterDate } from '../engine/schema'

const Translation = Schema.Struct({
  lang: Schema.String,
  url: Schema.String,
})

/** Effect Schema for Blog Document frontmatter (mirrors the legacy valibot shape). */
export const BlogFrontmatter = Schema.Struct({
  title: Schema.String,
  description: Schema.optional(Schema.String),
  author: Schema.String,
  date: FrontmatterDate,
  published: Schema.optionalWith(Schema.Boolean, { default: () => false }),
  translations: Schema.optional(Schema.Array(Translation)),
  tags: Schema.optional(Schema.Array(Schema.String)),
  externalUrl: Schema.optional(Schema.String),
  hero: Schema.optional(Schema.String),
})

export type BlogFrontmatter = typeof BlogFrontmatter.Type

/** Decodes unknown frontmatter, mapping validation failures to a typed error. */
export const decodeBlogFrontmatter = (slug: string, data: unknown) =>
  Schema.decodeUnknown(BlogFrontmatter)(data).pipe(
    Effect.mapError(
      (error) =>
        new FrontmatterInvalid({
          collection: 'blog',
          slug,
          reason: ParseResult.TreeFormatter.formatErrorSync(error),
        }),
    ),
  )
