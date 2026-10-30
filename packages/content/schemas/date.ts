import { Schema } from 'effect'

// Fails the build on an unparseable date instead of sorting as `NaN`.
export const DateString = Schema.String.check(
  Schema.makeFilter(
    (value: string) =>
      !Number.isNaN(new Date(value).getTime()) ||
      `Expected a date, got "${value}"`,
  ),
)
