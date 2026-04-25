import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'

import { allBlogPosts } from 'content-collections'
import type { BlogPosting } from 'schema-dts'

import { PageError } from '@/components/page-error'
import { PageBlogPost, blogMdx } from '@/features/blog/page-blog-post'
import { ogMeta } from '@/features/og/meta'
import { resolveContentImage } from '@/lib/content-images'
import { jsonLd } from '@/lib/json-ld'
import { siteUrl } from '@/lib/site'

export const Route = createFileRoute('/blog/$')({
  component: Page,
  notFoundComponent: () => (
    <PageError
      code="404"
      title="Article not found"
      description="This article doesn't exist or has been removed."
    />
  ),
  loader: async ({ params }) => {
    const slug = params._splat ?? ''
    const data = await serverLoader({ data: slug })
    if (data.externalUrl) {
      throw redirect({ href: data.externalUrl })
    }
    await blogMdx.preload(`/content/blog/${slug}/index.mdx`)
    return data
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    return {
      meta: [
        ...ogMeta({
          ...loaderData,
          ogImageUrl: siteUrl(
            loaderData.origin,
            `${loaderData.url}/assets/og-image`,
          ),
        }),
        jsonLd<BlogPosting>({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: loaderData.title,
          ...(loaderData.description && {
            description: loaderData.description,
          }),
          author: { '@type': 'Person', name: loaderData.author },
          datePublished: loaderData.date,
          url: siteUrl(loaderData.origin, loaderData.url),
        }),
      ],
    }
  },
})

const serverLoader = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(({ data: slug }: { data: string }) => {
    const post = allBlogPosts.find((p) => p._meta.path === slug)
    if (!post) throw notFound()
    const origin = getRequestUrl({ xForwardedHost: true }).origin

    return {
      slug,
      title: post.title,
      description: post.description ?? null,
      author: post.author,
      date: new Date(post.date).toISOString().split('T')[0],
      tags: post.tags ?? null,
      translations: post.translations ?? null,
      url: `/blog/${slug}`,
      hero: resolveContentImage(
        `content/blog/${post._meta.directory}`,
        post.hero,
      ),
      externalUrl: post.externalUrl ?? null,
      origin,
    }
  })

function Page() {
  const data = Route.useLoaderData()
  return <PageBlogPost {...data} />
}
