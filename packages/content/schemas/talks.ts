import { Image } from '@ntatoud/effect-collections'

import { Effect, Schema } from 'effect'

import { DateString } from './date.ts'

const StageEventSchema = Schema.Struct({
  event: Schema.String,
  city: Schema.String,
  date: DateString,
  url: Schema.optionalKey(Schema.String),
  logo: Schema.optionalKey(Image),
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

export type StageResource = (typeof StageResourceSchema)['Type']
