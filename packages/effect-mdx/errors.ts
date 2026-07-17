import { Schema } from 'effect'

export class MarkdownParseError extends Schema.TaggedErrorClass<MarkdownParseError>()(
  'effect-mdx/MarkdownParseError',
  {
    cause: Schema.Unknown,
  },
) {}
