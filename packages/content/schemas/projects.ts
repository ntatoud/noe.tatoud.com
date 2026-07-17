import { Effect, Schema } from 'effect'

export const ProjectSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.optionalKey(Schema.String),
  date: Schema.String,
  published: Schema.Boolean.pipe(
    Schema.withDecodingDefaultTypeKey(Effect.succeed(false)),
  ),
  kind: Schema.Literals(['personal', 'contribution']).pipe(
    Schema.withDecodingDefaultTypeKey(Effect.succeed('personal')),
  ),
  url: Schema.optionalKey(Schema.String),
  repo: Schema.optionalKey(Schema.String),
  tags: Schema.optionalKey(Schema.Array(Schema.String)),
})

export type ProjectFrontmatter = (typeof ProjectSchema)['Type']
