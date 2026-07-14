import { Context, Layer } from 'effect'

import { makeBlogReader } from '#blog/reader'
import { HighlighterService } from '#engine/highlighter'

export type { BlogPost, BlogPostWithBody } from '#blog/reader'

/**
 * Composition root that hosts the collection readers. Blog-specific logic lives
 * under `blog/`; this service wires it to the shared engine and exposes the
 * reader access (`getBlogPosts`/`getBlogPost`) as the package's entry point.
 *
 * `Default` depends on the abstract `FileSystem`/`Path` services (never a
 * concrete platform) so the package stays framework-agnostic: the runner
 * provides `NodeServices.layer` (or another platform Layer) at the edge.
 */
export class ContentService extends Context.Service<ContentService>()(
  '@ntatoud/effect-content/ContentService',
  { make: makeBlogReader },
) {
  static readonly Default = Layer.effect(ContentService, makeBlogReader).pipe(
    Layer.provide(HighlighterService.Default),
  )
}
