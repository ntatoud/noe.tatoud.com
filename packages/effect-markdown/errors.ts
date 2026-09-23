import { Schema } from 'effect'

export class MarkdownParseError extends Schema.TaggedError<MarkdownParseError>()(
  'effect-markdown/MarkdownParseError',
  {
    cause: Schema.Unknown,
  },
) {
  // The YAML parser's own message ("Nested mappings are not allowed…") is the
  // useful part; without this the error prints as an empty string.
  override get message(): string {
    return this.cause instanceof Error ? this.cause.message : String(this.cause)
  }
}
