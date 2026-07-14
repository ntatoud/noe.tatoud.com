import { Effect, FileSystem, Option, Path } from 'effect'
import matter from 'gray-matter'

import { CollectionsConfig } from '#core/config'
import { ContentNotFound } from '#core/errors'

export type RawDocument = {
  readonly data: Record<string, unknown>
  readonly body: string
  readonly file: string
}

export const listSlugs = (
  collection: string,
): Effect.Effect<
  ReadonlyArray<string>,
  never,
  CollectionsConfig | FileSystem.FileSystem | Path.Path
> =>
  Effect.gen(function* () {
    const { contentRoot } = yield* CollectionsConfig
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const dir = path.join(contentRoot, collection)

    const entries = yield* fs
      .readDirectory(dir)
      .pipe(Effect.orElseSucceed((): ReadonlyArray<string> => []))

    const slugs: Array<string> = []
    for (const name of entries) {
      const hasDocument = yield* fs
        .exists(path.join(dir, name, 'index.mdx'))
        .pipe(Effect.orElseSucceed(() => false))
      if (hasDocument) slugs.push(name)
    }
    return slugs
  })

export const readDocument = (
  collection: string,
  slug: string,
): Effect.Effect<
  RawDocument,
  ContentNotFound,
  CollectionsConfig | FileSystem.FileSystem | Path.Path
> =>
  Effect.gen(function* () {
    const { contentRoot } = yield* CollectionsConfig
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const file = path.join(contentRoot, collection, slug, 'index.mdx')

    const raw = yield* fs
      .readFileString(file)
      .pipe(Effect.mapError(() => new ContentNotFound({ collection, slug })))

    const parsed = matter(raw)
    return { data: parsed.data, body: parsed.content, file }
  })

export const documentMtime = (
  file: string,
): Effect.Effect<number, never, FileSystem.FileSystem> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const stat = yield* fs.stat(file).pipe(Effect.orElseSucceed(() => null))
    if (stat === null) return 0
    return Option.getOrElse(
      Option.map(stat.mtime, (date) => date.getTime()),
      () => 0,
    )
  })
