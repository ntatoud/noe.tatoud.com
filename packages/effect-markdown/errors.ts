import { Schema } from 'effect'

export class MarkdownParseError extends Schema.TaggedError<MarkdownParseError>()(
  'effect-markdown/MarkdownParseError',
  {
    cause: Schema.Unknown,
  },
) {
  // Without this the error prints as an empty string.
  override get message(): string {
    return this.cause instanceof Error ? this.cause.message : String(this.cause)
  }
}
