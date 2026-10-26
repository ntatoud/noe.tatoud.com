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
  /**
   * `url`'s Open Graph image (a screenshot when the site has none), shown when
   * the entry is hovered on the timeline. Stored with the entry rather than
   * fetched at build time, so the build never depends on third-party sites.
   */
  preview: Schema.optionalKey(Image),
  /** The logo's brand color, as `#rrggbb`: the role's bar on the timeline. */
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
