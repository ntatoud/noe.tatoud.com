import { Schema } from 'effect'

/**
 * Typed failure raised while decoding feed items, resolving URLs, or
 * serializing a feed. `operation` names the step that failed so callers get a
 * useful diagnostic instead of an opaque parse error.
 */
export class FeedError extends Schema.TaggedError<FeedError>()(
  'feed/FeedError',
  {
    operation: Schema.String,
    cause: Schema.Unknown,
  },
) {
  override get message(): string {
    const reason =
      this.cause instanceof Error ? this.cause.message : String(this.cause)
    return `${this.operation} failed: ${reason}`
  }
}
