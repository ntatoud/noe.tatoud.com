import { FileSystem, Path } from '@effect/platform'
import { Effect, Option } from 'effect'
import matter from 'gray-matter'

import { ContentConfig } from '../engine/config'
import { ContentNotFound } from '../engine/errors'
import { HighlighterService } from '../engine/highlighter'
import { compileMdxBody } from '../engine/mdx'
import { type TalkFrontmatter, decodeTalkFrontmatter } from './schema'

/** A single stage appearance for a Talk (mirrors the legacy `StageEvent` shape). */
export type TalkEvent = {
  event: string
  city: string
  date: string
  url: string | undefined
  logo: string | undefined
}

/** An optional companion resource (slides/docs/site) for a Talk. */
export type TalkResource = {
  kind: 'slides' | 'docs' | 'website'
  url: string
}

/** Talk collection metadata (no body), the shape features already consume. */
export type Talk = {
  slug: string
  title: string
  description: string
  kind: 'talk' | 'workshop'
  resource: TalkResource | undefined
  tags: Array<string> | undefined
  events: Array<TalkEvent>
}

/** A single Talk Document: its metadata plus the compiled function-body string. */
export type TalkWithBody = Talk & { body: string }

const TALKS = 'talks'

/**
 * Returns the timestamp of a Talk's most recent Event, or `0` (the epoch)
 * when it has none — so undated Talks sort last, never crash the comparator.
 */
const latestEventDate = (events: ReadonlyArray<TalkEvent>): number =>
  events.reduce(
    (latest, event) => Math.max(latest, new Date(event.date).getTime()),
    0,
  )

/**
 * Builds the Talks readers as Effect programs, wiring the shared engine
 * (`ContentConfig`, `HighlighterService`) and the platform `FileSystem`/`Path`
 * services. Compiled bodies are memoized in-memory, keyed by slug + file mtime,
 * so repeated reads do not recompile.
 *
 * Event logos are carried through as raw frontmatter strings, not resolved to
 * `/content` URLs or data-URLs (unlike Blog's hero / Experiences' logo):
 * today's authored refs point at absolute public paths (e.g.
 * `/logos/forkit.png`), not files relative to the Talk's own Document
 * directory, and neither the Talks list nor detail UI renders `event.logo`
 * yet. A plain pass-through matches the legacy `@ntatoud/content` reader's
 * behavior exactly.
 */
export const makeTalksReader = Effect.gen(function* () {
  const { contentRoot } = yield* ContentConfig
  const { highlighter } = yield* HighlighterService
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const compiledCache = new Map<string, string>()
  const talksDir = path.join(contentRoot, TALKS)

  const toMetadata = (slug: string, frontmatter: TalkFrontmatter): Talk => ({
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    kind: frontmatter.kind,
    resource: frontmatter.resource,
    tags: frontmatter.tags ? [...frontmatter.tags] : undefined,
    events: frontmatter.events.map((event) => ({
      event: event.event,
      city: event.city,
      date: event.date,
      url: event.url,
      logo: event.logo,
    })),
  })

  const readFrontmatter = (slug: string) =>
    Effect.gen(function* () {
      const file = path.join(talksDir, slug, 'index.mdx')
      const raw = yield* fs
        .readFileString(file)
        .pipe(
          Effect.mapError(
            () => new ContentNotFound({ collection: TALKS, slug }),
          ),
        )
      const parsed = matter(raw)
      const frontmatter = yield* decodeTalkFrontmatter(slug, parsed.data)
      return { frontmatter, body: parsed.content, file }
    })

  const listSlugs = Effect.gen(function* () {
    const entries = yield* fs
      .readDirectory(talksDir)
      .pipe(Effect.orElseSucceed((): Array<string> => []))

    const slugs: Array<string> = []
    for (const name of entries) {
      const hasDocument = yield* fs
        .exists(path.join(talksDir, name, 'index.mdx'))
        .pipe(Effect.orElseSucceed(() => false))
      if (hasDocument) slugs.push(name)
    }
    return slugs
  })

  const getTalks = () =>
    Effect.gen(function* () {
      const slugs = yield* listSlugs
      const talks = yield* Effect.forEach(slugs, (slug) =>
        readFrontmatter(slug).pipe(
          Effect.map(({ frontmatter }) => toMetadata(slug, frontmatter)),
        ),
      )
      return talks.sort(
        (a, b) => latestEventDate(b.events) - latestEventDate(a.events),
      )
    })

  const getTalk = (slug: string) =>
    Effect.gen(function* () {
      const { frontmatter, body, file } = yield* readFrontmatter(slug)
      const metadata = toMetadata(slug, frontmatter)
      const info = yield* fs
        .stat(file)
        .pipe(
          Effect.mapError(
            () => new ContentNotFound({ collection: TALKS, slug }),
          ),
        )

      const mtime = Option.getOrElse(
        Option.map(info.mtime, (date) => date.getTime()),
        () => 0,
      )
      const cacheKey = `${slug}:${mtime}`
      let compiled = compiledCache.get(cacheKey)
      if (compiled === undefined) {
        compiled = yield* compileMdxBody(
          contentRoot,
          TALKS,
          slug,
          body,
          highlighter,
        )
        compiledCache.set(cacheKey, compiled)
      }

      const talk: TalkWithBody = { ...metadata, body: compiled }
      return talk
    })

  return { getTalks, getTalk, readFrontmatter } as const
})
