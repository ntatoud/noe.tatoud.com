import { createFileRoute } from '@tanstack/react-router'

import { allBlogPosts } from 'content-collections'

const BASE_URL = 'https://noe.tatoud.com'

function buildLlmsTxt(): string {
  const posts = allBlogPosts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const blogSection = posts
    .map((p) => {
      const url = `${BASE_URL}/blog/${p._meta.path}`
      const desc = p.description ? `: ${p.description}` : ''
      return `- [${p.title}](${url})${desc}`
    })
    .join('\n')

  return `# Noé Tatoud

> Frontend developer based in France. I build web apps and write about things I find interesting.

## Blog

${blogSection}

## Pages

- [Home](${BASE_URL}/): Personal website with projects, experiences, and recent posts.
- [Blog](${BASE_URL}/blog): All articles on web development, tooling, and engineering.

## About

- Author: Noé Tatoud
- Role: Frontend Developer
- Contact: noe@bearstudio.fr

## Usage

AI training use is not permitted (see Content-Signal in robots.txt).
Content may be used for reference and summarization.
`
}

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: () => {
        return new Response(buildLlmsTxt(), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })
      },
    },
  },
})
