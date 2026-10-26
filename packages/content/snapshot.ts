import {
  type CollectionError,
  type Collections,
  CollectionsLive,
} from '@ntatoud/effect-collections'
import { toHtml } from '@ntatoud/effect-markdown'

import { Effect, ManagedRuntime } from 'effect'

import type { CollectionSnapshot } from './catalog/define.ts'
import {
  catalog,
  type CatalogEntry,
  type ListingName,
  type PageKind,
} from './catalog/index.ts'

/**
 * Everything the build knows about content, keyed by each Content Collection's
 * `key`. Both Vite plugins (`vite.ts` and `vite-markdown.ts`) read it from
 * here, so "which documents exist" is answered in one place.
 */
export type ContentSnapshot = {
  readonly [E in CatalogEntry as E['key']]: Effect.Success<E['read']>
}

/** Any one collection's snapshot, for code that iterates the catalog. */
export type AnyCollectionSnapshot = CollectionSnapshot<
  string,
  unknown,
  PageKind,
  ListingName
>

/** The snapshot's collections, in catalog order. */
export const collectionsOf = (
  content: ContentSnapshot,
): ReadonlyArray<AnyCollectionSnapshot> => Object.values(content)

const runtime = ManagedRuntime.make(CollectionsLive)

export const readContent = (): Promise<ContentSnapshot> =>
  runtime.runPromise(
    Effect.gen(function* () {
      // Each collection is read from disk exactly once; the listings and the
      // per-document pages are both derived from that one read.
      const collections = yield* Effect.forEach(
        catalog,
        // Widened so the entries' differently-typed reads form one array.
        (
          entry,
        ): Effect.Effect<AnyCollectionSnapshot, CollectionError, Collections> =>
          entry.read,
        { concurrency: 'unbounded' },
      )
      // `Object.fromEntries` cannot see that each key is paired with its own
      // collection's snapshot; `catalog` is the only source of both.
      return Object.fromEntries(
        collections.map((collection) => [collection.key, collection]),
      ) as ContentSnapshot
    }),
  )

/** Renders one document's body (frontmatter excluded) to HTML. */
export const renderBody = (source: string): Promise<string> =>
  Effect.runPromise(
    toHtml(source).pipe(Effect.map((markdown) => markdown.html)),
  )
