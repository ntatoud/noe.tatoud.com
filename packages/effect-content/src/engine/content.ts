import { Context, Layer } from 'effect'
import { HighlighterService, makeCollections } from 'effect-collections'

import { blog } from '#blog/collection'

export type { BlogPost, BlogPostWithBody } from '#blog/collection'

export class ContentService extends Context.Service<ContentService>()(
  '@ntatoud/effect-content/ContentService',
  { make: makeCollections({ blog }) },
) {
  // `Context.Service` registers the key + build recipe (`make`) but does not
  // create a Layer, so reuse `make` here rather than calling `makeCollections`
  // again.
  static readonly Default = Layer.effect(
    ContentService,
    ContentService.make,
  ).pipe(Layer.provide(HighlighterService.Default))
}
