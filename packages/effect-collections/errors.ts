import { Schema } from 'effect'

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
