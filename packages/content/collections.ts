import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineCollection } from '@ntatoud/effect-collections'
import type { CollectionMeta, ImageValue } from '@ntatoud/effect-collections'

import { Effect } from 'effect'

import { BlogPostSchema } from './schemas/blog.ts'
import { ExperienceSchema } from './schemas/experiences.ts'
import { ProjectSchema } from './schemas/projects.ts'
import { StageItemSchema } from './schemas/talks.ts'

const here = path.dirname(fileURLToPath(import.meta.url))

// Resolve the repo-root `content/` directory. Relying on the source-file
// location (`import.meta.url`) breaks once this module is bundled into a
// serverless function, where the emitted file no longer sits next to the
// content folder. Walk up from both the current working directory and the
// module location, returning the first ancestor that contains a `content/`
// directory. Falls back to the source-relative path for local dev safety.
//
// A candidate holding a `package.json` is rejected: this Package is itself
// named `content`, so walking up from anywhere inside `packages/` would
// otherwise stop at `packages/content` (the Package) rather than the repo-root
// content folder, which is plain data and has no manifest.
const isContentRoot = (candidate: string) =>
  fs.statSync(candidate, { throwIfNoEntry: false })?.isDirectory() === true &&
  !fs.existsSync(path.join(candidate, 'package.json'))

const findContentRoot = () => {
  for (const start of [process.cwd(), here]) {
    let dir = start
    while (true) {
      const candidate = path.join(dir, 'content')
      if (isContentRoot(candidate)) {
        return candidate
      }
      const parent = path.dirname(dir)
      if (parent === dir) break
      dir = parent
    }
  }
  return path.resolve(here, '../../content')
}

// Exported for the Vite plugin (`./vite`), which resolves the frontmatter image
// URLs derived below back to files on disk in order to import them as assets.
export const contentRoot = findContentRoot()

// `Image` decodes a frontmatter path into an absolute filesystem path, which is
// meaningless to a browser. Every collection carrying an image derives a
// portable `/content/<collection>/<slug>/<file>` URL here — once — rather than
// in its Reader; the App maps that back to a hashed asset URL via
// `resolveContentImage`. Separators are forced to `/` so the value stays a URL
// on Windows, where `path.relative` returns backslashes.
const publicImageUrl = (image: ImageValue, meta: CollectionMeta) => {
  const collection = path.basename(meta.directory)
  const relative = path
    .relative(meta.directory, image.path)
    .split(path.sep)
    .join('/')
  return `/content/${collection}/${relative}`
}

export const blogPosts = defineCollection({
  name: 'blogPosts',
  directory: path.join(contentRoot, 'blog'),
  schema: BlogPostSchema,
  // `externalUrl` is normalized to `null` rather than left absent so that
  // "no external link" has one representation across the derived data, matching
  // `hero` — the App branches on it, so flipping it to `undefined` here would
  // silently mark every post as external.
  transform: ({ hero, externalUrl, ...data }, meta) =>
    Effect.succeed({
      ...data,
      slug: meta.slug,
      url: `/blog/${meta.slug}`,
      externalUrl: externalUrl ?? null,
      hero: hero ? publicImageUrl(hero, meta) : null,
      heroDimensions: hero ? { width: hero.width, height: hero.height } : null,
    }),
})

export const projects = defineCollection({
  name: 'projects',
  directory: path.join(contentRoot, 'projects'),
  schema: ProjectSchema,
  transform: (data, meta) => Effect.succeed({ ...data, slug: meta.slug }),
})

export const experiences = defineCollection({
  name: 'experiences',
  directory: path.join(contentRoot, 'experiences'),
  schema: ExperienceSchema,
  transform: ({ logo, ...data }, meta) =>
    Effect.succeed({
      ...data,
      slug: meta.slug,
      logo: logo ? publicImageUrl(logo, meta) : null,
    }),
})

export const talks = defineCollection({
  name: 'talks',
  directory: path.join(contentRoot, 'talks'),
  schema: StageItemSchema,
  transform: (data, meta) => Effect.succeed({ ...data, slug: meta.slug }),
})
