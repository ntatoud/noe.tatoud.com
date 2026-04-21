import { createFileRoute, notFound } from '@tanstack/react-router'

import { allBlogPosts } from 'content-collections'

import { handleOgImage } from '@/features/og/handler'
import { serializeOgSearchParams } from '@/features/og/search-params'
import { resolveContentImage } from '@/lib/content-images'

export const Route = createFileRoute('/blog/$slug/assets/og-image')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const post = allBlogPosts.find((p) => p._meta.path === params.slug)
        if (!post) throw notFound()

        const origin = new URL(request.url).origin
        const section = 'blog'
        const hero = resolveContentImage(
          `content/blog/${post._meta.directory}`,
          post.hero,
        )

        const ogUrl = new URL(
          `/api/og${serializeOgSearchParams({
            title: post.title,
            description: post.description ?? null,
            author: post.author,
            tags: post.tags ?? null,
            hero,
            avatar: null,
            section,
          })}`,
          origin,
        )

        return handleOgImage(new Request(ogUrl))
      },
    },
  },
})
