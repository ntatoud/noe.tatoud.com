import { Effect, Schema, SchemaGetter } from 'effect'
import { Image } from 'effect-collections'

// gray-matter's YAML parser turns bare `date: 2026-04-08` into a `Date`
// instance (quoted dates stay strings) — normalise both to `YYYY-MM-DD`.
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
  hero: Schema.optional(Image),
})

export type BlogFrontmatter = Schema.Schema.Type<typeof BlogFrontmatter>
