import { Effect, ParseResult, Schema } from 'effect'

import { FrontmatterInvalid } from '../engine/errors'
import { FrontmatterDate } from '../engine/schema'

/** A single stage appearance for a Talk (mirrors the legacy `StageEvent` shape). */
const TalkEvent = Schema.Struct({
  event: Schema.String,
  city: Schema.String,
  date: FrontmatterDate,
  url: Schema.optional(Schema.String),
  logo: Schema.optional(Schema.String),
})

/** An optional companion resource (slides/docs/site) for a Talk. */
const TalkResource = Schema.Struct({
  kind: Schema.Literal('slides', 'docs', 'website'),
  url: Schema.String,
})

/** Effect Schema for Talk Document frontmatter (mirrors the legacy valibot shape). */
export const TalkFrontmatter = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
  kind: Schema.optionalWith(Schema.Literal('talk', 'workshop'), {
    default: () => 'talk' as const,
  }),
  resource: Schema.optional(TalkResource),
  tags: Schema.optional(Schema.Array(Schema.String)),
  events: Schema.optionalWith(Schema.Array(TalkEvent), {
    default: () => [],
  }),
})

export type TalkFrontmatter = typeof TalkFrontmatter.Type
export type TalkEventFrontmatter = typeof TalkEvent.Type
export type TalkResourceFrontmatter = typeof TalkResource.Type

/** Decodes unknown frontmatter, mapping validation failures to a typed error. */
export const decodeTalkFrontmatter = (slug: string, data: unknown) =>
  Schema.decodeUnknown(TalkFrontmatter)(data).pipe(
    Effect.mapError(
      (error) =>
        new FrontmatterInvalid({
          collection: 'talks',
          slug,
          reason: ParseResult.TreeFormatter.formatErrorSync(error),
        }),
    ),
  )
