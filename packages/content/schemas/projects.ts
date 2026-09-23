import { Effect, Schema } from 'effect'

import { DateString } from './date.ts'

/**
 * A closing call-to-action for a project page. Lives in frontmatter rather than
 * in the body because the body is plain markdown — it has no way to name a
 * React component.
 */
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

export type ProjectFrontmatter = (typeof ProjectSchema)['Type']
