import { Image } from '@ntatoud/effect-collections'

import { Schema } from 'effect'

export const ExperienceSchema = Schema.Struct({
  title: Schema.String,
  organization: Schema.String,
  url: Schema.optionalKey(Schema.String),
  startDate: Schema.String,
  endDate: Schema.optionalKey(Schema.String),
  kind: Schema.Literals(['work', 'volunteer', 'education']),
  logo: Schema.optionalKey(Image),
})

export type ExperienceFrontmatter = (typeof ExperienceSchema)['Type']
