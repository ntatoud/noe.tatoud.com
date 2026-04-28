import { createFileRoute, notFound } from '@tanstack/react-router'

import { allBlogPosts } from 'content-collections'

const BASE_URL = 'https://noe.tatoud.com'

export const Route = createFileRoute('/blog/$slug/llms.txt')({
  server: {
    handlers: {
      GET: ({ params }) => {
        const post = allBlogPosts.find((p) => p._meta.path === params.slug)
        if (!post || !post.published) throw notFound()

        const url = `${BASE_URL}/blog/${params.slug}`
        const date = new Date(post.date).toISOString().split('T')[0]
        const tags = post.tags?.length ? `\nTags: ${post.tags.join(', ')}` : ''

        const body = `# ${post.title}

> ${post.description ?? ''}

- Author: ${post.author}
- Published: ${date}
- URL: ${url}${tags}

---

${post.content}
`

        return new Response(body, {
          headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
        })
      },
    },
  },
})
