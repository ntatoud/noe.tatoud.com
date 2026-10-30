import { describe, expect, it } from 'vitest'

import { sitePages } from '../inventory.ts'
import type { ContentInventory } from '../pages.ts'

const STATIC = {
  home: { path: '/', title: 'Home', description: 'Welcome.' },
  blog: { path: '/blog', title: 'Blog', description: 'Posts.' },
  projects: { path: '/projects', title: 'Projects', description: 'Work.' },
  talks: { path: '/talks', title: 'Talks', description: 'Talks.' },
}

const CONTENT: ContentInventory = {
  documents: [
    {
      path: '/blog/hello',
      title: 'Hello',
      kind: 'blog',
      published: true,
      lastmod: '2025-01-02',
    },
    { path: '/talks/draft', title: 'Draft', kind: 'talk', published: false },
  ],
  listings: [
    { name: 'blog', path: '/blog', kind: 'blog' },
    { name: 'projects', path: '/projects', kind: 'project' },
    { name: 'talks', path: '/talks', kind: 'talk' },
  ],
}

describe('sitePages', () => {
  it('lists the static pages, then the content documents', () => {
    expect(sitePages(CONTENT, STATIC).map((page) => page.path)).toEqual([
      '/',
      '/blog',
      '/projects',
      '/talks',
      '/blog/hello',
      '/talks/draft',
    ])
  })

  it('badges a listing page with the kind the catalog gives it', () => {
    const blog = sitePages(CONTENT, STATIC).find((p) => p.path === '/blog')
    expect(blog).toMatchObject({
      title: 'Blog',
      description: 'Posts.',
      kind: 'blog',
      published: true,
    })
    const home = sitePages(CONTENT, STATIC).find((p) => p.path === '/')
    expect(home).not.toHaveProperty('kind')
  })

  // The route uses the app's path, the twin the catalog's: a mismatch publishes a twin for a missing page.
  it("refuses a listing whose path is not the catalog's", () => {
    const moved = { ...STATIC, blog: { ...STATIC.blog, path: '/posts' } }
    expect(() => sitePages(CONTENT, moved)).toThrow(/blog/)
  })

  it('names every page its social card and markdown twin', () => {
    expect(
      sitePages(CONTENT, STATIC)
        .filter(({ path }) => path === '/' || path === '/blog/hello')
        .map(({ ogImage, markdown }) => ({ ogImage, markdown })),
    ).toEqual([
      { ogImage: '/og/index.png', markdown: '/index.md' },
      { ogImage: '/og/blog/hello.png', markdown: '/blog/hello.md' },
    ])
  })
})
