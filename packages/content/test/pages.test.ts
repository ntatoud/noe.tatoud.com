import * as fs from 'node:fs'

import { describe, expect, it } from 'vitest'

import { blog } from '../catalog/blog.ts'
import { projects } from '../catalog/projects.ts'
import { talks } from '../catalog/talks.ts'
import { readContentPages } from '../pages.ts'

const readContentPaths = async () =>
  (await readContentPages()).documents.map((page) => page.path)

/**
 * Pins the list handed to the prerender pass against the real `content/`
 * directory. A document missing from it is not a build error: it is simply
 * not prerendered, so it 404s in production (ADR-0011).
 */

/** Document directories on disk, which is what a slug is. */
const slugsOnDisk = (directory: string) =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

describe('readContentPages paths', () => {
  it('returns one path per document on disk, drafts included', async () => {
    const paths = await readContentPaths()
    const documents = [blog, projects, talks].reduce(
      (count, { collection }) =>
        count + slugsOnDisk(collection.directory).length,
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
      expect(path).toMatch(/^\/(?:blog|projects|talks)\/[^/]+$/)
    }
  })
})

const KIND_BY_PREFIX = {
  blog: 'blog',
  projects: 'project',
  talks: 'talk',
} as const

describe('readContentPages', () => {
  // Each page's title is what its social card shows, so an empty one is a
  // blank card rather than an error.
  it('gives every page a non-empty title', async () => {
    for (const page of (await readContentPages()).documents) {
      expect(page.title.trim(), `${page.path}: empty title`).not.toBe('')
    }
  })

  it('gives every page the kind its path belongs to', async () => {
    for (const page of (await readContentPages()).documents) {
      const prefix = page.path.split('/')[1] as keyof typeof KIND_BY_PREFIX
      expect(page.kind, page.path).toBe(KIND_BY_PREFIX[prefix])
    }
  })

  it('omits the description key rather than setting it to undefined', async () => {
    for (const page of (await readContentPages()).documents) {
      if ('description' in page) expect(page.description).toBeTruthy()
    }
  })
})

describe('readContentPages sitemap data', () => {
  const page = async (path: string) =>
    (await readContentPages()).documents.find((page) => page.path === path)

  it('dates a document by its own frontmatter date', async () => {
    expect(await page('/blog/what-is-mcp')).toMatchObject({
      lastmod: '2025-06-25',
      published: true,
    })
  })

  it('dates a talk by its latest event', async () => {
    expect(
      await page('/talks/build-your-first-game-with-kaplay'),
    ).toMatchObject({ lastmod: '2025-12-20' })
  })

  it('gives each listing page the kind of the documents it lists', async () => {
    expect((await readContentPages()).listings).toEqual([
      { name: 'blog', path: '/blog', kind: 'blog' },
      { name: 'projects', path: '/projects', kind: 'project' },
      { name: 'talks', path: '/talks', kind: 'talk' },
    ])
  })
})
