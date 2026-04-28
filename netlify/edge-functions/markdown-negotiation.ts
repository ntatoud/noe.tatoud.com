import type { Context } from '@netlify/edge-functions'

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
  const accept = req.headers.get('accept') ?? ''

  if (!accept.includes('text/markdown')) {
    return context.next()
  }

  const url = new URL(req.url)
  const markdown = MARKDOWN_PAGES[url.pathname]

  if (!markdown) {
    return context.next()
  }

  return new Response(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept',
    },
  })
}
