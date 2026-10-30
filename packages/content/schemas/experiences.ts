import { Image } from '@ntatoud/effect-collections'

import { Schema } from 'effect'

import { DateString } from './date.ts'

export const ExperienceSchema = Schema.Struct({
  title: Schema.String,
  organization: Schema.String,
  url: Schema.optionalKey(Schema.String),
  startDate: DateString,
  endDate: Schema.optionalKey(DateString),
  kind: Schema.Literals([
    'work',
    'internship',
    'volunteer',
    'education',
    'milestone',
  ]),
  logo: Schema.optionalKey(Image),
  // Stored with the entry so the build never depends on third-party sites.
  preview: Schema.optionalKey(Image),
  color: Schema.optionalKey(
    Schema.String.check(
      Schema.makeFilter(
        (value: string) =>
          /^#[0-9a-f]{6}$/i.test(value) ||
          `Expected a #rrggbb color, got "${value}"`,
      ),
    ),
  ),
})
