import { Schema } from 'effect'

/**
 * Frontmatter dates are authored as bare YAML dates (`date: 2026-04-08`), which
 * the parser hands back as `Date` instances, or as quoted strings. Either way we
 * normalise to the original `YYYY-MM-DD` string the readers expose. Shared by
 * every collection's frontmatter Schema.
 */
export const FrontmatterDate = Schema.transform(
  Schema.Union(Schema.String, Schema.DateFromSelf),
  Schema.String,
  {
    strict: true,
    decode: (value) =>
      typeof value === 'string' ? value : value.toISOString().slice(0, 10),
    encode: (value) => value,
  },
)
