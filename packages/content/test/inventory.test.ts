import { describe, expect, it } from 'vitest'

import { sitePages, type StaticPages } from '../inventory.ts'
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

  it('lists a page the app adds beyond home and the listings', () => {
    const withStyleguide: StaticPages = {
      ...STATIC,
      styleguide: { path: '/styleguide', title: 'Styleguide' },
    }
    expect(
      sitePages(CONTENT, withStyleguide).find((p) => p.path === '/styleguide'),
    ).toEqual({
      path: '/styleguide',
      title: 'Styleguide',
      published: true,
      ogImage: '/og/styleguide.png',
      markdown: '/styleguide.md',
    })
  })

  // The route and its meta tags use the app's path, the markdown twin uses the
  // catalog's: a mismatch would publish a twin for a page that does not exist.
  it("refuses a listing whose path is not the catalog's", () => {
    const moved = { ...STATIC, blog: { ...STATIC.blog, path: '/posts' } }
    expect(() => sitePages(CONTENT, moved)).toThrow(/blog/)
    const extra = { ...moved, styleguide: { path: '/styleguide', title: 'S' } }
    expect(() => sitePages(CONTENT, extra)).toThrow(/blog/)
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
