import { FileSystem, Path } from '@effect/platform'
import { Effect, Option } from 'effect'
import matter from 'gray-matter'

import { ContentConfig } from '../engine/config'
import { ContentNotFound } from '../engine/errors'
import { HighlighterService } from '../engine/highlighter'
import { resolveLogo } from '../engine/image'
import { compileMdxBody } from '../engine/mdx'
import {
  type ExperienceFrontmatter,
  decodeExperienceFrontmatter,
} from './schema'

/** Experience collection metadata (no body), the shape features already consume. */
export type Experience = {
  slug: string
  title: string
  organization: string
  url: string | undefined
  startDate: string
  endDate: string | undefined
  kind: 'work' | 'volunteer' | 'education'
  logo: string | null
}

/** A single Experience Document: its metadata plus the compiled function-body string. */
export type ExperienceWithBody = Experience & { body: string }

const EXPERIENCES = 'experiences'

/**
 * Builds the Experiences readers as Effect programs, wiring the shared engine
 * (`ContentConfig`, `HighlighterService`) and the platform `FileSystem`/`Path`
 * services. Compiled bodies are memoized in-memory, keyed by slug + file mtime,
 * so repeated reads do not recompile. Unlike Blog's hero, the logo is inlined
 * as a base64 data-URL (`resolveLogo`, ADR-0008) rather than served from
 * `/content`.
 */
export const makeExperiencesReader = Effect.gen(function* () {
  const { contentRoot } = yield* ContentConfig
  const { highlighter } = yield* HighlighterService
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const compiledCache = new Map<string, string>()
  const experiencesDir = path.join(contentRoot, EXPERIENCES)

  const toMetadata = (slug: string, frontmatter: ExperienceFrontmatter) =>
    Effect.gen(function* () {
      let logo: string | null = null
      if (frontmatter.logo) {
        const resolved = yield* resolveLogo(
          contentRoot,
          EXPERIENCES,
          slug,
          frontmatter.logo,
        )
        logo = resolved?.dataUrl ?? null
      }

      const experience: Experience = {
        slug,
        title: frontmatter.title,
        organization: frontmatter.organization,
        url: frontmatter.url,
        startDate: frontmatter.startDate,
        endDate: frontmatter.endDate,
        kind: frontmatter.kind,
        logo,
      }
      return experience
    })

  const readFrontmatter = (slug: string) =>
    Effect.gen(function* () {
      const file = path.join(experiencesDir, slug, 'index.mdx')
      const raw = yield* fs
        .readFileString(file)
        .pipe(
          Effect.mapError(
            () => new ContentNotFound({ collection: EXPERIENCES, slug }),
          ),
        )
      const parsed = matter(raw)
      const frontmatter = yield* decodeExperienceFrontmatter(slug, parsed.data)
      return { frontmatter, body: parsed.content, file }
    })

  const listSlugs = Effect.gen(function* () {
    const entries = yield* fs
      .readDirectory(experiencesDir)
      .pipe(Effect.orElseSucceed((): Array<string> => []))

    const slugs: Array<string> = []
    for (const name of entries) {
      const hasDocument = yield* fs
        .exists(path.join(experiencesDir, name, 'index.mdx'))
        .pipe(Effect.orElseSucceed(() => false))
      if (hasDocument) slugs.push(name)
    }
    return slugs
  })

  const getExperiences = () =>
    Effect.gen(function* () {
      const slugs = yield* listSlugs
      const experiences = yield* Effect.forEach(slugs, (slug) =>
        readFrontmatter(slug).pipe(
          Effect.flatMap(({ frontmatter }) => toMetadata(slug, frontmatter)),
        ),
      )
      return experiences.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      )
    })

  const getExperience = (slug: string) =>
    Effect.gen(function* () {
      const { frontmatter, body, file } = yield* readFrontmatter(slug)
      const metadata = yield* toMetadata(slug, frontmatter)
      const info = yield* fs
        .stat(file)
        .pipe(
          Effect.mapError(
            () => new ContentNotFound({ collection: EXPERIENCES, slug }),
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
          EXPERIENCES,
          slug,
          body,
          highlighter,
        )
        compiledCache.set(cacheKey, compiled)
      }

      const experience: ExperienceWithBody = { ...metadata, body: compiled }
      return experience
    })

  return { getExperiences, getExperience } as const
})
