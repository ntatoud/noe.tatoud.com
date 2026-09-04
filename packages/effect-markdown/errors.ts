import { Schema } from 'effect'

export class MarkdownParseError extends Schema.TaggedError<MarkdownParseError>()(
  'effect-markdown/MarkdownParseError',
  {
    cause: Schema.Unknown,
  },
) {}
