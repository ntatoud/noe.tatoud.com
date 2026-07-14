import { Context, Effect, FileSystem, Layer, Path } from 'effect'
import {
  type CollectionDeps,
  CollectionsConfig,
  HighlighterService,
  makeReaders,
} from 'effect-collections'

import { blog } from '#blog/collection'

export type { BlogPost, BlogPostWithBody } from '#blog/collection'

/**
 * Builds the Blog readers on the generic `effect-collections` core and captures
 * the engine services (`CollectionsConfig`, `HighlighterService`, and the
 * platform `FileSystem`/`Path`) once, re-providing them to each reader call so
 * the exposed `getBlogPosts`/`getBlogPost` need no further environment.
 */
const makeContent = Effect.gen(function* () {
  const config = yield* CollectionsConfig
  const highlighter = yield* HighlighterService
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const readers = makeReaders(blog)

  const provide = <A, E>(effect: Effect.Effect<A, E, CollectionDeps>) =>
    effect.pipe(
      Effect.provideService(CollectionsConfig, config),
      Effect.provideService(HighlighterService, highlighter),
      Effect.provideService(FileSystem.FileSystem, fs),
      Effect.provideService(Path.Path, path),
    )

  return {
    getBlogPosts: () => provide(readers.list),
    getBlogPost: (slug: string) => provide(readers.get(slug)),
  } as const
})

/**
 * Composition root that hosts the collection readers. Blog-specific logic lives
 * under `blog/`; this service wires it to the `effect-collections` core and
 * exposes the reader access (`getBlogPosts`/`getBlogPost`) as the package's
 * entry point.
 *
 * `Default` depends on the abstract `FileSystem`/`Path` services (never a
 * concrete platform) so the package stays framework-agnostic: the runner
 * provides `NodeServices.layer` (or another platform Layer) at the edge.
 */
export class ContentService extends Context.Service<ContentService>()(
  '@ntatoud/effect-content/ContentService',
  { make: makeContent },
) {
  static readonly Default = Layer.effect(ContentService, makeContent).pipe(
    Layer.provide(HighlighterService.Default),
  )
}
