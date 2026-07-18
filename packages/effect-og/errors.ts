import { Schema } from 'effect'

/** Typed failure raised while building the renderer or rendering an OG image. */
export class OgImageError extends Schema.TaggedErrorClass<OgImageError>()(
  'effect-og/OgImageError',
  {
    operation: Schema.String,
    cause: Schema.Unknown,
  },
) {}
