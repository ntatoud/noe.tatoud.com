import { Effect, Schema, SchemaGetter } from 'effect'

/**
 * Frontmatter dates are authored as bare YAML dates (`date: 2026-04-08`), which
 * the parser hands back as `Date` instances, or as quoted strings. Either way we
 * normalise to the original `YYYY-MM-DD` string the readers expose.
 */
const FrontmatterDate = Schema.Union([Schema.String, Schema.Date]).pipe(
  Schema.decodeTo(Schema.String, {
    decode: SchemaGetter.transform((value: string | Date) =>
      typeof value === 'string' ? value : value.toISOString().slice(0, 10),
    ),
    encode: SchemaGetter.transform((value: string): string | Date => value),
  }),
)

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
  published: Schema.Boolean.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed(false)),
  ),
  translations: Schema.optional(Schema.Array(Translation)),
  tags: Schema.optional(Schema.Array(Schema.String)),
  externalUrl: Schema.optional(Schema.String),
  hero: Schema.optional(Schema.String),
})

export type BlogFrontmatter = Schema.Schema.Type<typeof BlogFrontmatter>
