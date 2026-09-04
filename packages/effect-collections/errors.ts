import { Schema } from 'effect'

/**
 * A document that was asked for by slug does not exist. Distinct from
 * `CollectionError` so callers can answer an honest 404 without also swallowing
 * genuine read/decode failures.
 *
 * Both fields are safe to serialize: the collection *name* rather than its
 * absolute directory, so encoding this error (as an `HttpApi` error schema
 * would) can never disclose a server filesystem path.
 */
export class DocumentNotFound extends Schema.TaggedError<DocumentNotFound>()(
  'effect-collections/DocumentNotFound',
  {
    collection: Schema.String,
    slug: Schema.String,
  },
) {}

export class CollectionError extends Schema.TaggedError<CollectionError>()(
  'effect-collections/CollectionError',
  {
    operation: Schema.String,
    cause: Schema.Unknown,
  },
) {}
