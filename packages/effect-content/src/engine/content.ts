import { Context, Layer } from 'effect'
import { HighlighterService, makeCollections } from 'effect-collections'

import { blog } from '#blog/collection'

export type { BlogPost, BlogPostWithBody } from '#blog/collection'

/**
 * Composition root that hosts the collection readers. Blog-specific logic lives
 * under `blog/`; this service wires it to the `effect-collections` core via
 * {@link makeCollections}, which captures the engine services
 * (`CollectionsConfig`, `HighlighterService`, and the platform `FileSystem`/
 * `Path`) once and re-provides them to every reader call. Yielding the service
 * therefore returns ready accessors — `content.blog.list()` /
 * `content.blog.get(slug)` — that need no further environment.
 *
 * `Default` depends on the abstract `FileSystem`/`Path` services (never a
 * concrete platform) so the package stays framework-agnostic: the runner
 * provides `NodeServices.layer` (or another platform Layer) at the edge.
 */
export class ContentService extends Context.Service<ContentService>()(
  '@ntatoud/effect-content/ContentService',
  { make: makeCollections({ blog }) },
) {
  // `Context.Service` only registers the key + build recipe (`make`); it does
  // not create a Layer. Reuse that recipe here rather than calling
  // `makeCollections` again, and bake in the one service `make` depends on that
  // the runner shouldn't have to (`HighlighterService`); the platform
  // `FileSystem`/`Path` and `CollectionsConfig` are still provided at the edge.
  static readonly Default = Layer.effect(
    ContentService,
    ContentService.make,
  ).pipe(Layer.provide(HighlighterService.Default))
}
