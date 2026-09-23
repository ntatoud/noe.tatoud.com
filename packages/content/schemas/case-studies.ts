import { Effect, Schema } from 'effect'

import { DateString } from './date.ts'

/**
 * A case study: a write-up of client work, anonymised. Unlike a project it has
 * no public website or repository to link, so the page carries who it was for
 * (`client`, described rather than named) and what the author did (`role`).
 */
export const CaseStudySchema = Schema.Struct({
  title: Schema.String,
  description: Schema.optionalKey(Schema.String),
  date: DateString,
  published: Schema.Boolean.pipe(
    Schema.withDecodingDefaultTypeKey(Effect.succeed(false)),
  ),
  client: Schema.optionalKey(Schema.String),
  role: Schema.optionalKey(Schema.String),
  tags: Schema.optionalKey(Schema.Array(Schema.String)),
})

export type CaseStudyFrontmatter = (typeof CaseStudySchema)['Type']
