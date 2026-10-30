import { afterEach, describe, expect, it, vi } from 'vitest'

import handler, {
  config as edgeConfig,
  markdownPath as edgeMarkdownPath,
  prefersMarkdown as edgePrefersMarkdown,
} from '../../../netlify/edge-functions/markdown-negotiation.ts'
import {
  bodyImageUrl,
  renderDocument,
  renderIndex,
  renderLlmsTxt,
  renderMarkdownFiles,
} from '../markdown.ts'
import { markdownFileName, markdownPath } from '../paths.ts'
import { readContent } from '../snapshot.ts'
import { estimateTokens, prefersMarkdown } from '../vite-markdown.ts'
import { PAGES } from './helpers.ts'

// The route mapping and `Accept` decision are duplicated in the edge function and pinned against its source below (ADR-0009).

const SITE = {
  url: 'https://example.com',
  name: 'example.com',
  description: 'A site.',
}

const noAssets = () => null
const noWarnings = () => {}

describe('markdownPath', () => {
  it('maps a route onto its markdown twin', () => {
    expect(markdownPath('/')).toBe('/index.md')
    expect(markdownPath('/blog')).toBe('/blog.md')
    expect(markdownPath('/blog/what-is-mcp')).toBe('/blog/what-is-mcp.md')
  })

  it('ignores a trailing slash, which a route and its link may disagree on', () => {
    expect(markdownPath('/blog/')).toBe('/blog.md')
    expect(markdownPath('/blog/what-is-mcp/')).toBe('/blog/what-is-mcp.md')
  })

  it('yields a build-output name with no leading slash', () => {
    expect(markdownFileName('/')).toBe('index.md')
    expect(markdownFileName('/blog/what-is-mcp')).toBe('blog/what-is-mcp.md')
  })
})

describe('bodyImageUrl', () => {
  it('resolves a document-relative src against its content URL', () => {
    expect(bodyImageUrl('/content/blog/a', './x.png')).toBe(
      '/content/blog/a/x.png',
    )
    expect(bodyImageUrl('/content/blog/a', 'x.png')).toBe(
      '/content/blog/a/x.png',
    )
  })

  it('leaves an absolute src alone', () => {
    expect(bodyImageUrl('/content/blog/a', 'https://e.com/x.png')).toBeNull()
    expect(bodyImageUrl('/content/blog/a', '/x.png')).toBeNull()
  })
})

describe('prefersMarkdown', () => {
  it('says no to a browser', () => {
    expect(
      prefersMarkdown(
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      ),
    ).toBe(false)
  })

  it('says no when there is no Accept header at all', () => {
    expect(prefersMarkdown(null)).toBe(false)
    expect(prefersMarkdown('')).toBe(false)
  })

  it('says yes to an agent asking for markdown', () => {
    expect(prefersMarkdown('text/markdown')).toBe(true)
    expect(prefersMarkdown('text/markdown, */*')).toBe(true)
    expect(prefersMarkdown('text/x-markdown')).toBe(true)
    expect(prefersMarkdown(' TEXT/MARKDOWN ')).toBe(true)
  })

  it('honours q-values in both directions', () => {
    expect(prefersMarkdown('text/markdown;q=0.5, text/html')).toBe(false)
    expect(prefersMarkdown('text/html;q=0.9, text/markdown')).toBe(true)
    expect(prefersMarkdown('text/markdown;q=0, text/html')).toBe(false)
    expect(prefersMarkdown('text/html, text/markdown')).toBe(true)
  })
})

describe('renderDocument', () => {
  const source = [
    '---',
    "title: 'A post'",
    'date: 2025-06-25',
    '---',
    '',
    '## Heading',
    '',
    'Body text with an ![image](./diagram.png).',
  ].join('\n')

  const render = (overrides?: {
    resolveAsset?: (url: string) => string | null
    warn?: (message: string) => void
  }) =>
    renderDocument({
      site: SITE,
      routePath: '/blog/a-post',
      meta: {
        title: 'A post',
        description: 'What it is about.',
        details: ['- Published: 2025-06-25', null, '- Author: Someone'],
      },
      source,
      documentUrl: '/content/blog/a-post',
      resolveAsset: overrides?.resolveAsset ?? noAssets,
      warn: overrides?.warn ?? noWarnings,
    })

  it('strips the frontmatter block', () => {
    const output = render()
    expect(output).not.toContain('---\ntitle:')
    expect(output).not.toContain("title: 'A post'")
    expect(output).toContain('## Heading')
  })

  it('builds a header from frontmatter, dropping absent fields', () => {
    const output = render()
    expect(output).toContain('# A post')
    expect(output).toContain('> What it is about.')
    expect(output).toContain('- Published: 2025-06-25')
    expect(output).toContain('- Author: Someone')
    expect(output).toContain('- Canonical: https://example.com/blog/a-post')
    expect(output).not.toMatch(/^-\s*$/m)
  })

  it('points body images at the URL that serves them', () => {
    const output = render({
      resolveAsset: (url) =>
        url === '/content/blog/a-post/diagram.png'
          ? 'https://example.com/assets/diagram-abc123.png'
          : null,
    })
    expect(output).toContain(
      '![image](https://example.com/assets/diagram-abc123.png)',
    )
    expect(output).not.toContain('./diagram.png')
  })

  it('warns and leaves an unresolvable image alone', () => {
    const warnings: string[] = []
    const output = render({ warn: (message) => warnings.push(message) })
    expect(output).toContain('./diagram.png')
    expect(warnings).toEqual([
      'image not found, left as-is: /content/blog/a-post/diagram.png',
    ])
  })

  it('leaves an absolute image reference untouched', () => {
    const output = renderDocument({
      site: SITE,
      routePath: '/blog/a-post',
      meta: { title: 'A post' },
      source: '---\ntitle: x\n---\n\n![remote](https://cdn.example/x.png)',
      documentUrl: '/content/blog/a-post',
      resolveAsset: () => {
        throw new Error('should not be asked to resolve an absolute src')
      },
      warn: noWarnings,
    })
    expect(output).toContain('![remote](https://cdn.example/x.png)')
  })

  it('rewrites raw <img src> too, which allowHtml passes through', () => {
    const output = renderDocument({
      site: SITE,
      routePath: '/blog/a-post',
      meta: { title: 'A post' },
      source: '---\ntitle: x\n---\n\n<img src="./shot.png" alt="">',
      documentUrl: '/content/blog/a-post',
      resolveAsset: () => 'https://example.com/assets/shot-def456.png',
      warn: noWarnings,
    })
    expect(output).toContain('src="https://example.com/assets/shot-def456.png"')
  })
})

describe('renderIndex', () => {
  const output = renderIndex({
    site: SITE,
    routePath: '/blog',
    title: 'Blog',
    description: 'Articles.',
    sections: [
      {
        title: 'Blog',
        entries: [
          {
            title: 'A post',
            routePath: '/blog/a-post',
            description: 'About things.',
            note: '2025-06-25',
          },
          { title: 'Bare', routePath: '/blog/bare' },
        ],
      },
      { title: 'Empty', entries: [] },
    ],
  })

  it('links entries to their markdown twin', () => {
    expect(output).toContain(
      '- [A post](https://example.com/blog/a-post.md): 2025-06-25 — About things.',
    )
  })

  it('omits the tail when an entry has neither note nor description', () => {
    expect(output).toContain('- [Bare](https://example.com/blog/bare.md)\n')
    expect(output).not.toContain('bare.md):')
  })

  it('says so rather than emitting a heading with nothing under it', () => {
    expect(output).toContain('## Empty\n\n_Nothing here yet._')
  })
})

describe('renderLlmsTxt', () => {
  const output = renderLlmsTxt({
    site: SITE,
    sections: [
      {
        title: 'Blog',
        description: 'Articles.',
        entries: [{ title: 'A post', routePath: '/blog/a-post' }],
      },
      { title: 'Talks', entries: [] },
      {
        title: 'Experience',
        entries: [{ title: 'Somewhere', routePath: null, note: 'work' }],
      },
    ],
    optional: ['- [Sitemap](https://example.com/sitemap.xml)'],
  })

  it('opens with the H1 and blockquote the format specifies', () => {
    expect(output.startsWith('# example.com\n\n> A site.\n\n')).toBe(true)
  })

  it('drops sections with nothing in them', () => {
    expect(output).not.toContain('## Talks')
    expect(output).toContain('## Blog')
  })

  it('renders a page-less entry as plain text, not a link that 404s', () => {
    expect(output).toContain('- **Somewhere**: work')
    expect(output).not.toContain('Somewhere](')
  })

  it('puts extra links under Optional', () => {
    expect(output).toContain(
      '## Optional\n\n- [Sitemap](https://example.com/sitemap.xml)',
    )
  })
})

describe('edge function handler', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const stubOrigin = (
    responses: Readonly<Record<string, string>>,
  ): { requested: Array<string> } => {
    const requested: Array<string> = []
    vi.stubGlobal('fetch', (input: URL | string) => {
      const url = new URL(String(input))
      requested.push(url.pathname)
      const body = responses[url.pathname]
      return Promise.resolve(
        body === undefined
          ? new Response('Not Found', { status: 404 })
          : new Response(body, { status: 200 }),
      )
    })
    return { requested }
  }

  const get = (pathname: string, accept: string | null) =>
    handler(
      new Request(`https://example.com${pathname}`, {
        headers: accept === null ? {} : { accept },
      }),
    )

  it('serves markdown with the headers the contract requires', async () => {
    stubOrigin({ '/blog/a-post.md': '# A post\n' })

    const response = await get('/blog/a-post', 'text/markdown')

    expect(response?.status).toBe(200)
    expect(response?.headers.get('content-type')).toBe(
      'text/markdown; charset=utf-8',
    )
    expect(response?.headers.get('x-markdown-tokens')).toBe(
      String(estimateTokens('# A post\n')),
    )
    expect(response?.headers.get('vary')).toBe('Accept')
    expect(response?.headers.get('link')).toBe(
      '<https://example.com/blog/a-post>; rel="canonical"',
    )
    expect(await response?.text()).toBe('# A post\n')
  })

  it('fetches the twin of the requested route', async () => {
    const { requested } = stubOrigin({ '/index.md': '# Home\n' })
    await get('/', 'text/markdown')
    expect(requested).toEqual(['/index.md'])
  })

  it('stays out of the way of a browser', async () => {
    const { requested } = stubOrigin({ '/index.md': '# Home\n' })
    const response = await get(
      '/',
      'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    )
    expect(response).toBeUndefined()
    expect(requested).toEqual([])
  })

  it('falls through when the route has no markdown twin', async () => {
    stubOrigin({})
    expect(await get('/styleguide', 'text/markdown')).toBeUndefined()
  })

  it('passes through a request that already names a .md file', async () => {
    const { requested } = stubOrigin({ '/blog/a-post.md': '# A post\n' })
    expect(await get('/blog/a-post.md', 'text/markdown')).toBeUndefined()
    expect(requested).toEqual([])
  })
})

describe('estimateTokens', () => {
  it('scales with length and never returns a fraction', () => {
    expect(estimateTokens('')).toBe(0)
    expect(estimateTokens('abc')).toBe(1)
    expect(estimateTokens('a'.repeat(400))).toBe(100)
  })
})

// The Deno edge function duplicates this logic; only this test stops drift (importable: its only import is `import type`).
describe('edge function parity', () => {
  const CASES: ReadonlyArray<string | null> = [
    null,
    '',
    'text/markdown',
    'text/markdown, */*',
    'text/x-markdown',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'text/markdown;q=0.5, text/html',
    'text/html;q=0.9, text/markdown',
    'text/markdown;q=0, text/html',
    'text/html, text/markdown',
    'application/json',
  ]

  it('agrees with the dev server on every Accept header', () => {
    for (const accept of CASES) {
      expect(
        edgePrefersMarkdown(accept),
        `disagreed on Accept: ${JSON.stringify(accept)}`,
      ).toBe(prefersMarkdown(accept))
    }
  })

  // The regex may over-match (the handler turns the request away) but must never under-match, which would silently disable markdown.
  it('never pre-filters away a request that should get markdown', () => {
    const pattern = edgeConfig.header?.accept
    expect(typeof pattern).toBe('string')
    const accepts = new RegExp(pattern as string, 'i')

    for (const accept of CASES) {
      if (!prefersMarkdown(accept)) continue
      expect(
        accepts.test(accept ?? ''),
        `config.header would skip the function for Accept: ${JSON.stringify(accept)}, ` +
          'which prefersMarkdown accepts',
      ).toBe(true)
    }
  })

  it('maps routes to the same paths the build emits', () => {
    for (const route of [
      '/',
      '/blog',
      '/blog/',
      '/blog/what-is-mcp',
      '/blog/what-is-mcp/',
      '/projects/some-project',
      '/talks/some-talk',
    ]) {
      expect(edgeMarkdownPath(route), `disagreed on ${route}`).toBe(
        markdownPath(route),
      )
    }
  })
})

describe('renderMarkdownFiles', () => {
  it('gives every document on disk a twin, drafts included', async () => {
    const content = await readContent()
    const names = renderMarkdownFiles(content, {
      site: SITE,
      pages: PAGES,
      resolveAsset: noAssets,
      warn: noWarnings,
    }).map((file) => file.fileName)

    const routes = [
      ...content.blogPosts.detail!.documents.map(({ data }) => data.url),
      ...content.projects.detail!.documents.map(({ data }) => data.path),
      ...content.talks.detail!.documents.map(({ data }) => data.path),
    ]
    for (const route of routes) expect(names).toContain(markdownFileName(route))
    for (const name of ['blog.md', 'projects.md', 'talks.md', 'index.md']) {
      expect(names).toContain(name)
    }
    expect(names).toContain('llms.txt')
    expect(new Set(names).size).toBe(names.length)
  })

  it('lists only published documents', async () => {
    const content = await readContent()
    const blog = renderMarkdownFiles(content, {
      site: SITE,
      pages: PAGES,
      resolveAsset: noAssets,
      warn: noWarnings,
    }).find((file) => file.fileName === 'blog.md')

    expect(blog?.source.match(/^- \[/gm)).toHaveLength(
      content.blogPosts.listing.length,
    )
  })
})
