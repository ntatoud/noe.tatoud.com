import { Image } from '@ntatoud/effect-collections'

import { Schema } from 'effect'

import { DateString } from './date.ts'

export const ExperienceSchema = Schema.Struct({
  title: Schema.String,
  organization: Schema.String,
  url: Schema.optionalKey(Schema.String),
  startDate: DateString,
  endDate: Schema.optionalKey(DateString),
  kind: Schema.Literals(['work', 'volunteer', 'education']),
  logo: Schema.optionalKey(Image),
})

export type ExperienceFrontmatter = (typeof ExperienceSchema)['Type']
