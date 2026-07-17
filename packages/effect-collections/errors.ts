import { Schema } from 'effect'

export class CollectionError extends Schema.TaggedErrorClass<CollectionError>()(
  'effect-collections/CollectionError',
  {
    operation: Schema.String,
    cause: Schema.Unknown,
  },
) {}
