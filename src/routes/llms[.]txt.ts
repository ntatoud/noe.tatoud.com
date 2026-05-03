import { createFileRoute } from '@tanstack/react-router'

import { allBlogPosts, allTalks } from 'content-collections'

import { latestEvent } from '@/lib/stage'

const BASE_URL = 'https://noe.tatoud.com'

function buildLlmsTxt(): string {
  const posts = allBlogPosts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const talks = allTalks.sort(
    (a, b) =>
      new Date(latestEvent(a.events)?.date ?? 0).getTime() -
      new Date(latestEvent(b.events)?.date ?? 0).getTime(),
  )

  const blogSection = posts
    .map((p) => {
      const url = `${BASE_URL}/blog/${p._meta.path}`
      const desc = p.description ? `: ${p.description}` : ''
      return `- [${p.title}](${url})${desc}`
    })
    .join('\n')

  const stageSection = talks
    .map((t) => {
      const url = `${BASE_URL}/stage/${t._meta.path}`
      return `- [${t.title}](${url}): ${t.description}`
    })
    .join('\n')

  return `# Noé Tatoud

> Frontend developer based in France. I build web apps and write about things I find interesting.

## Blog

${blogSection}

## Stage

${stageSection}

## Pages

- [Home](${BASE_URL}/): Personal website with projects, experiences, and recent posts.
- [Blog](${BASE_URL}/blog): All articles on web development, tooling, and engineering.
- [Stage](${BASE_URL}/stage): Talks and workshops I've given at tech events.

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
