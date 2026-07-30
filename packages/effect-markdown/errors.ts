import { Schema } from 'effect'

export class MarkdownParseError extends Schema.TaggedErrorClass<MarkdownParseError>()(
  'effect-markdown/MarkdownParseError',
  {
    cause: Schema.Unknown,
  },
) {}
