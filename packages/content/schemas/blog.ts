import { Image } from '@ntatoud/effect-collections'

import { Effect, Schema } from 'effect'

export const BlogPostSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.optionalKey(Schema.String),
  author: Schema.String,
  date: Schema.String,
  published: Schema.Boolean.pipe(
    Schema.withDecodingDefaultTypeKey(Effect.succeed(false)),
  ),
  translations: Schema.optionalKey(
    Schema.Array(Schema.Struct({ lang: Schema.String, url: Schema.String })),
  ),
  tags: Schema.optionalKey(Schema.Array(Schema.String)),
  externalUrl: Schema.optionalKey(Schema.String),
  hero: Schema.optionalKey(Image),
})
