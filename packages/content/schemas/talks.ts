import { Effect, Schema } from 'effect'

const StageEventSchema = Schema.Struct({
  event: Schema.String,
  city: Schema.String,
  date: Schema.String,
  url: Schema.optionalKey(Schema.String),
  logo: Schema.optionalKey(Schema.String),
})

const StageResourceSchema = Schema.Struct({
  kind: Schema.Literals(['slides', 'docs', 'website']),
  url: Schema.String,
})

export const StageItemSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
  kind: Schema.Literals(['talk', 'workshop']).pipe(
    Schema.withDecodingDefaultTypeKey(Effect.succeed('talk')),
  ),
  resource: Schema.optionalKey(StageResourceSchema),
  tags: Schema.optionalKey(Schema.Array(Schema.String)),
  events: Schema.Array(StageEventSchema).pipe(
    Schema.withDecodingDefaultTypeKey(Effect.succeed([])),
  ),
})

export type StageEvent = (typeof StageEventSchema)['Type']
export type StageResource = (typeof StageResourceSchema)['Type']
export type StageFrontmatter = (typeof StageItemSchema)['Type']
