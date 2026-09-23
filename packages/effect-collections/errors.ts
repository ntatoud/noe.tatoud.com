import { Schema } from 'effect'

export class CollectionError extends Schema.TaggedError<CollectionError>()(
  'effect-collections/CollectionError',
  {
    operation: Schema.String,
    cause: Schema.Unknown,
  },
) {}
