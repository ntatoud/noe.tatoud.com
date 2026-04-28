type Context = { next: () => Promise<Response> }

const LINK_HEADERS: Record<string, string> = {
  '/': '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json", </llms.txt>; rel="describedby"; type="text/plain"',
  '/.well-known/api-catalog':
    '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
}

// Page-specific markdown content for agent consumption
const MARKDOWN_PAGES: Record<string, string> = {
  '/': `# Noé Tatoud

Frontend Developer based in France. I build web apps and write about things I find interesting.

## About

Software engineer focused on frontend development, building with React, TypeScript, and modern web technologies.

## Blog

Visit [/blog](/blog) for articles on web development, tooling, and software engineering.

## Links

- Website: https://noe.tatoud.com
- GitHub: https://github.com/ntatoud
`,
  '/blog': `# Blog — Noé Tatoud

Articles on web development, tooling, and software engineering.

Visit https://noe.tatoud.com/blog for the full list of posts.
`,
}

export default async function handler(req: Request, context: Context) {
  const url = new URL(req.url)
  const accept = req.headers.get('accept') ?? ''
  const linkHeader = LINK_HEADERS[url.pathname]

  if (!accept.includes('text/markdown')) {
    const res = await context.next()
    if (linkHeader) res.headers.set('Link', linkHeader)
    return res
  }

  const markdown = MARKDOWN_PAGES[url.pathname]

  if (!markdown) {
    const res = await context.next()
    if (linkHeader) res.headers.set('Link', linkHeader)
    return res
  }

  return new Response(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept',
      ...(linkHeader && { Link: linkHeader }),
    },
  })
}
