import { Schema } from 'effect'

/**
 * Typed failure raised while decoding feed items, resolving URLs, or
 * serializing a feed. `operation` names the step that failed so callers get a
 * useful diagnostic instead of an opaque parse error.
 */
export class FeedError extends Schema.TaggedError<FeedError>()(
  'effect-rss/FeedError',
  {
    operation: Schema.String,
    cause: Schema.Unknown,
  },
) {}
