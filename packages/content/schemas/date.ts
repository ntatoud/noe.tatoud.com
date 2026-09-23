import { Schema } from 'effect'

/**
 * A frontmatter date. It stays the authored string (it is serialized into
 * `virtual:content` as-is), but a value `new Date()` cannot parse fails the
 * build here, instead of silently sorting as `NaN` in every listing.
 */
export const DateString = Schema.String.check(
  Schema.makeFilter(
    (value: string) =>
      !Number.isNaN(new Date(value).getTime()) ||
      `Expected a date, got "${value}"`,
  ),
)
