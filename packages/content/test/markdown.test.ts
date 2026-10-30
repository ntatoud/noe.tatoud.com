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

/**
 * Covers the markdown twins served for `Accept: text/markdown` (ADR-0009).
 *
 * Two things here are load-bearing beyond the rendering itself:
 *
 * - the route→file mapping, which the build and the edge function each implement
 *   separately and must agree on, and
 * - the `Accept` decision, which is duplicated into the edge function because
 *   Deno at Netlify's edge cannot import from this workspace.
 *
 * Both are pinned against the edge function's own source below.
 */

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

  /**
   * The reason this is a q-value parser and not `accept.includes('text/markdown')`.
   * A client that ranks HTML above markdown has asked for HTML, and saying
   * otherwise would hand plain text to something expecting a page.
   */
  it('honours q-values in both directions', () => {
    expect(prefersMarkdown('text/markdown;q=0.5, text/html')).toBe(false)
    expect(prefersMarkdown('text/html;q=0.9, text/markdown')).toBe(true)
    expect(prefersMarkdown('text/markdown;q=0, text/html')).toBe(false)
    // A tie goes to markdown: the client named it without ranking it below HTML.
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
    // The `null` detail must not leave an empty bullet behind.
    expect(output).not.toMatch(/^-\s*$/m)
  })

  /**
   * `resolveAsset` hands back the finished URL — the plugin builds an absolute one
   * so that markdown stays valid wherever an agent copies it to, and this asserts
   * `renderDocument` substitutes it verbatim rather than re-deriving anything.
   */
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

  /**
   * A body image that resolves to nothing is left alone and warned about rather
   * than failing the build — the same call `vite.ts` makes for the HTML path. The
   * warning is what the build-level test asserts is empty.
   */
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

  /**
   * Entries link to markdown, not HTML: an agent that lands on a listing should be
   * able to keep following markdown down to a document without re-negotiating on
   * every hop.
   */
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

  /** llmstxt.org: an H1, then a blockquoted summary, then H2 sections of links. */
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

/**
 * The response contract an agent actually sees. The headers asserted here are the
 * observable part of the feature — `Content-Type: text/markdown` is what makes a
 * client treat the body as markdown at all, and `Vary` is what stops a cache from
 * replaying it to a browser.
 */
describe('edge function handler', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  /** Stubs the origin so the handler's own fetch resolves without a network. */
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

  /**
   * Returning `undefined` hands the request back to Netlify's chain, which is what
   * leaves HTML the default. A browser must never reach the fetch at all.
   */
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

  /**
   * The guard that keeps the handler's own fetch from re-entering it. Without it a
   * request for `/blog/a-post.md` would look up `/blog/a-post.md.md` forever.
   */
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

/**
 * The edge function carries its own copy of the `Accept` decision and the route
 * mapping (it deploys to Netlify's Deno edge runtime, separately from this Node
 * workspace — see the note in the function itself). Nothing but this test stops the
 * two from drifting, and drift is silent: the dev server would keep serving
 * markdown while production quietly stopped, or the edge would fetch a path the
 * build never emitted.
 *
 * Importing it here works because its only import is `import type`, which is
 * erased, and nothing at module scope touches a Deno global.
 */
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

  /**
   * `config.header` is a pre-filter Netlify evaluates before invoking the
   * function, so it keeps browser traffic from paying for this feature at all.
   * That makes it load-bearing in the dangerous direction: anything it rejects
   * never reaches `prefersMarkdown`, so a regex that is too narrow silently
   * disables markdown for the clients it excludes — with no error anywhere.
   *
   * The invariant is one-way. The regex may over-match (the handler then turns the
   * request away properly); it must never under-match.
   */
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

describe('renderMarkdownFiles with a page the app adds', () => {
  const render = async () =>
    renderMarkdownFiles(await readContent(), {
      site: SITE,
      pages: {
        ...PAGES,
        styleguide: {
          path: '/styleguide',
          title: 'Styleguide',
          description: 'The design system.',
        },
      },
      resolveAsset: noAssets,
      warn: noWarnings,
    })

  it('gives it a twin that names it and points back to llms.txt', async () => {
    const twin = (await render()).find(
      (file) => file.fileName === 'styleguide.md',
    )
    expect(twin?.source).toBe(
      [
        '# Styleguide',
        '> The design system.',
        '- Canonical: https://example.com/styleguide',
        'More of this site, as markdown: [llms.txt](https://example.com/llms.txt)',
      ].join('\n\n') + '\n',
    )
  })

  it('lists it in llms.txt under Other pages', async () => {
    const llms = (await render()).find((file) => file.fileName === 'llms.txt')
    expect(llms?.source).toContain(
      '## Other pages\n\n- [Styleguide](https://example.com/styleguide.md): The design system.',
    )
  })

  it('leaves the home twin alone', async () => {
    const [withPage, without] = await Promise.all([
      render(),
      readContent().then((content) =>
        renderMarkdownFiles(content, {
          site: SITE,
          pages: PAGES,
          resolveAsset: noAssets,
          warn: noWarnings,
        }),
      ),
    ])
    const home = (files: typeof without) =>
      files.find((file) => file.fileName === 'index.md')?.source
    expect(home(withPage)).toBe(home(without))
  })
})
