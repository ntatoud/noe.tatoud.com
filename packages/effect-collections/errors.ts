import { Schema } from 'effect'

/**
 * A collection directory or document that could not be read. `path` is the
 * directory or file involved, so a failed build names what to fix instead of
 * printing an empty message.
 */
export class CollectionError extends Schema.TaggedError<CollectionError>()(
  'effect-collections/CollectionError',
  {
    operation: Schema.String,
    path: Schema.String,
    cause: Schema.Unknown,
  },
) {
  override get message(): string {
    const reason =
      this.cause instanceof Error ? this.cause.message : String(this.cause)
    return `${this.operation} failed for ${this.path}: ${reason}`
  }
}
