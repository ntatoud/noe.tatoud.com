import { Effect, Schema } from 'effect'

import { DateString } from './date.ts'

// In frontmatter because the body is plain markdown and cannot name a React component.
const ProjectCtaSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.optionalKey(Schema.String),
  href: Schema.String,
  buttonLabel: Schema.String,
})

export type ProjectCtaFrontmatter = (typeof ProjectCtaSchema)['Type']

export const ProjectSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.optionalKey(Schema.String),
  date: DateString,
  published: Schema.Boolean.pipe(
    Schema.withDecodingDefaultTypeKey(Effect.succeed(false)),
  ),
  kind: Schema.Literals(['personal', 'contribution']).pipe(
    Schema.withDecodingDefaultTypeKey(Effect.succeed('personal')),
  ),
  url: Schema.optionalKey(Schema.String),
  repo: Schema.optionalKey(Schema.String),
  tags: Schema.optionalKey(Schema.Array(Schema.String)),
  cta: Schema.optionalKey(ProjectCtaSchema),
})
