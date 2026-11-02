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

export type ContentSnapshot = {
  readonly [E in CatalogEntry as E['key']]: Effect.Success<E['read']>
}

export type AnyCollectionSnapshot = CollectionSnapshot<
  string,
  unknown,
  PageKind,
  ListingName
>

export const collectionsOf = (
  content: ContentSnapshot,
): ReadonlyArray<AnyCollectionSnapshot> => Object.values(content)

const runtime = ManagedRuntime.make(CollectionsLive)

export const readContent = (): Promise<ContentSnapshot> =>
  runtime.runPromise(
    Effect.gen(function* () {
      const collections = yield* Effect.forEach(
        catalog,
        (
          entry,
        ): Effect.Effect<AnyCollectionSnapshot, CollectionError, Collections> =>
          entry.read,
        { concurrency: 'unbounded' },
      )
      // `Object.fromEntries` cannot pair each key with its own collection's snapshot type.
      return Object.fromEntries(
        collections.map((collection) => [collection.key, collection]),
      ) as ContentSnapshot
    }),
  )

export const renderBody = (source: string): Promise<string> =>
  Effect.runPromise(
    toHtml(source).pipe(Effect.map((markdown) => markdown.html)),
  )
