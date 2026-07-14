import { FileSystem, Path } from '@effect/platform'
import { Effect, Option } from 'effect'
import matter from 'gray-matter'

import { ContentConfig } from '../engine/config'
import { ContentNotFound } from '../engine/errors'
import { HighlighterService } from '../engine/highlighter'
import { compileMdxBody } from '../engine/mdx'
import { type ProjectFrontmatter, decodeProjectFrontmatter } from './schema'

/** Project collection metadata (no body), the shape features already consume. */
export type Project = {
  slug: string
  title: string
  description: string | undefined
  date: string
  published: boolean
  kind: 'personal' | 'contribution'
  url: string | undefined
  repo: string | undefined
  tags: Array<string> | undefined
}

/** A single Project Document: its metadata plus the compiled function-body string. */
export type ProjectWithBody = Project & { body: string }

const PROJECTS = 'projects'

/**
 * Builds the Projects readers as Effect programs, wiring the shared engine
 * (`ContentConfig`, `HighlighterService`) and the platform `FileSystem`/`Path`
 * services. Compiled bodies are memoized in-memory, keyed by slug + file mtime,
 * so repeated reads do not recompile.
 */
export const makeProjectsReader = Effect.gen(function* () {
  const { contentRoot } = yield* ContentConfig
  const { highlighter } = yield* HighlighterService
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const compiledCache = new Map<string, string>()
  const projectsDir = path.join(contentRoot, PROJECTS)

  const toMetadata = (
    slug: string,
    frontmatter: ProjectFrontmatter,
  ): Project => ({
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    published: frontmatter.published,
    kind: frontmatter.kind,
    url: frontmatter.url,
    repo: frontmatter.repo,
    tags: frontmatter.tags ? [...frontmatter.tags] : undefined,
  })

  const readFrontmatter = (slug: string) =>
    Effect.gen(function* () {
      const file = path.join(projectsDir, slug, 'index.mdx')
      const raw = yield* fs
        .readFileString(file)
        .pipe(
          Effect.mapError(
            () => new ContentNotFound({ collection: PROJECTS, slug }),
          ),
        )
      const parsed = matter(raw)
      const frontmatter = yield* decodeProjectFrontmatter(slug, parsed.data)
      return { frontmatter, body: parsed.content, file }
    })

  const listSlugs = Effect.gen(function* () {
    const entries = yield* fs
      .readDirectory(projectsDir)
      .pipe(Effect.orElseSucceed((): Array<string> => []))

    const slugs: Array<string> = []
    for (const name of entries) {
      const hasDocument = yield* fs
        .exists(path.join(projectsDir, name, 'index.mdx'))
        .pipe(Effect.orElseSucceed(() => false))
      if (hasDocument) slugs.push(name)
    }
    return slugs
  })

  const getProjects = () =>
    Effect.gen(function* () {
      const slugs = yield* listSlugs
      const projects = yield* Effect.forEach(slugs, (slug) =>
        readFrontmatter(slug).pipe(
          Effect.map(({ frontmatter }) => toMetadata(slug, frontmatter)),
        ),
      )
      return projects
        .filter((project) => project.published)
        .sort((a, b) => {
          if (a.kind === b.kind) return 0
          return a.kind === 'personal' ? -1 : 1
        })
    })

  const getProject = (slug: string) =>
    Effect.gen(function* () {
      const { frontmatter, body, file } = yield* readFrontmatter(slug)
      const metadata = toMetadata(slug, frontmatter)
      const info = yield* fs
        .stat(file)
        .pipe(
          Effect.mapError(
            () => new ContentNotFound({ collection: PROJECTS, slug }),
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
          PROJECTS,
          slug,
          body,
          highlighter,
        )
        compiledCache.set(cacheKey, compiled)
      }

      const project: ProjectWithBody = { ...metadata, body: compiled }
      return project
    })

  return { getProjects, getProject, readFrontmatter } as const
})
