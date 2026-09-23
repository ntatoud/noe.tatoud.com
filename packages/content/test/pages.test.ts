import * as fs from 'node:fs'

import { describe, expect, it } from 'vitest'

import { blogPosts, caseStudies, projects, talks } from '../collections.ts'
import { readContentPages, readContentPaths } from '../pages.ts'

/**
 * Pins the list handed to the prerender pass against the real `content/`
 * directory. A document missing from it is not a build error: it silently
 * falls back to the serverless function on every request.
 */

/** Document directories on disk, which is what a slug is. */
const slugsOnDisk = (directory: string) =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

describe('readContentPaths', () => {
  it('returns one path per document on disk, drafts included', async () => {
    const paths = await readContentPaths()
    const documents = [blogPosts, projects, caseStudies, talks].reduce(
      (count, collection) => count + slugsOnDisk(collection.directory).length,
      0,
    )

    expect(paths).toHaveLength(documents)
    expect(new Set(paths).size).toBe(paths.length)
  })

  // The three documents the link crawler never reaches, because their cards
  // link off-site.
  it('includes the documents nothing links to', async () => {
    const paths = await readContentPaths()

    expect(paths).toContain('/projects/cowat')
    expect(paths).toContain('/projects/start-ui-web')
    expect(paths).toContain('/blog/fork-it-for-kids-2-interview')
  })

  it('only returns content routes', async () => {
    for (const path of await readContentPaths()) {
      expect(path).toMatch(/^\/(?:blog|projects|case-studies|talks)\/[^/]+$/)
    }
  })
})

const KIND_BY_PREFIX = {
  blog: 'blog',
  projects: 'project',
  'case-studies': 'case-study',
  talks: 'talk',
} as const

describe('readContentPages', () => {
  // Each page's title is what its social card shows, so an empty one is a
  // blank card rather than an error.
  it('gives every page a non-empty title', async () => {
    for (const page of await readContentPages()) {
      expect(page.title.trim(), `${page.path}: empty title`).not.toBe('')
    }
  })

  it('gives every page the kind its path belongs to', async () => {
    for (const page of await readContentPages()) {
      const prefix = page.path.split('/')[1] as keyof typeof KIND_BY_PREFIX
      expect(page.kind, page.path).toBe(KIND_BY_PREFIX[prefix])
    }
  })

  it('omits the description key rather than setting it to undefined', async () => {
    for (const page of await readContentPages()) {
      if ('description' in page) expect(page.description).toBeTruthy()
    }
  })
})
