import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineCollection } from '@ntatoud/effect-collections'
import type { CollectionMeta, ImageValue } from '@ntatoud/effect-collections'

import { BlogPostSchema } from './schemas/blog.ts'
import { ExperienceSchema } from './schemas/experiences.ts'
import { ProjectSchema } from './schemas/projects.ts'
import { StageItemSchema } from './schemas/talks.ts'

const here = path.dirname(fileURLToPath(import.meta.url))

// The repo-root `content/` folder. This module only ever runs from source,
// inside the Vite plugins and their tests, so its own location is reliable.
export const contentRoot = path.resolve(here, '../../content')

const CONTENT_URL_BASE = '/content'

/**
 * The public URL of something inside `content/`:
 * `/content/<collection>/<slug>[/<file>]`.
 *
 * This scheme and its inverse below are the seam between the collections and the
 * Vite plugin, which turns such a URL back into a path on disk to import as a
 * hashed asset. Both directions live here so the `/content` prefix is written in
 * exactly one place — a mismatch would not fail loudly, it would degrade into
 * "image not found" warnings and unbundled images.
 */
export const contentUrl = (
  collectionDirectory: string,
  ...segments: ReadonlyArray<string>
) =>
  [CONTENT_URL_BASE, path.basename(collectionDirectory), ...segments].join('/')

/** Inverse of `contentUrl`: the file on disk it points at, or `null`. */
export const contentFilePath = (url: string): string | null =>
  url.startsWith(`${CONTENT_URL_BASE}/`)
    ? path.join(contentRoot, url.slice(CONTENT_URL_BASE.length + 1))
    : null

// `Image` decodes a frontmatter path into an absolute filesystem path, which is
// meaningless to a browser. Every collection carrying an image derives a portable
// URL here — once — rather than in its Reader. Separators are forced to `/` so
// the value stays a URL on Windows, where `path.relative` returns backslashes.
const publicImageUrl = (image: ImageValue, meta: CollectionMeta) =>
  contentUrl(
    meta.directory,
    path.relative(meta.directory, image.path).split(path.sep).join('/'),
  )

export const blogPosts = defineCollection({
  name: 'blogPosts',
  directory: path.join(contentRoot, 'blog'),
  schema: BlogPostSchema,
  // `externalUrl` is normalized to `null` rather than left absent so that
  // "no external link" has one representation across the derived data, matching
  // `hero` — the App branches on it, so flipping it to `undefined` here would
  // silently mark every post as external.
  transform: ({ hero, externalUrl, ...data }, meta) => ({
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
  transform: (data, meta) => ({
    ...data,
    slug: meta.slug,
    path: `/projects/${meta.slug}`,
  }),
})

export const experiences = defineCollection({
  name: 'experiences',
  directory: path.join(contentRoot, 'experiences'),
  schema: ExperienceSchema,
  transform: ({ logo, ...data }, meta) => ({
    ...data,
    slug: meta.slug,
    logo: logo ? publicImageUrl(logo, meta) : null,
  }),
})

export const talks = defineCollection({
  name: 'talks',
  directory: path.join(contentRoot, 'talks'),
  schema: StageItemSchema,
  transform: ({ events, ...data }, meta) => ({
    ...data,
    slug: meta.slug,
    path: `/talks/${meta.slug}`,
    // Newest first, so "the latest event" is always `events[0]` for every
    // consumer (cards, sitemap, listing order, markdown twins).
    events: events
      .map(({ logo, ...event }) => ({
        ...event,
        logo: logo ? publicImageUrl(logo, meta) : null,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  }),
})
