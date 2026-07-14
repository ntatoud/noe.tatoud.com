import { Effect, FileSystem, Option, Path } from 'effect'
import matter from 'gray-matter'

import { CollectionsConfig } from '#core/config'
import { ContentNotFound } from '#core/errors'

/** A Document read from disk: raw (undecoded) frontmatter, body, and its path. */
export type RawDocument = {
  readonly data: Record<string, unknown>
  readonly body: string
  readonly file: string
}

/**
 * Lists the slugs of a collection: the immediate sub-directories of
 * `<contentRoot>/<collection>` that contain an `index.mdx`. A missing
 * collection directory yields an empty list rather than an error.
 */
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

/**
 * Reads and gray-matter-parses a Document's `index.mdx`. A missing file becomes
 * a typed {@link ContentNotFound}; frontmatter is returned undecoded (validation
 * is the caller's concern).
 */
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

/**
 * The modification time of a Document file as epoch millis, used as a cache key.
 * Falls back to `0` if the file cannot be stat-ed.
 */
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
