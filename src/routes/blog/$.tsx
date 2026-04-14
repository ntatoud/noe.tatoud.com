import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'

import type { BlogPosting } from 'schema-dts'

import { PageError } from '@/components/page-error'
import { PageBlogPost, blogPostLoader } from '@/features/blog/page-blog-post'
import { ogMeta } from '@/features/og/meta'
import { jsonLd } from '@/lib/json-ld'
import { siteUrl } from '@/lib/site'
import { blog } from '@/lib/source'

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
    const slugs = params._splat?.split('/') ?? []
    const data = await serverLoader({ data: slugs })
    if (data.externalUrl) {
      throw redirect({ href: data.externalUrl })
    }
    await blogPostLoader.preload(data.path)
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
  .inputValidator((slugs: Array<string>) => slugs)
  .handler(({ data: slugs }: { data: Array<string> }) => {
    const page = blog.getPage(slugs)
    if (!page) throw notFound()
    const origin = getRequestUrl({ xForwardedHost: true }).origin

    return {
      path: page.path,
      title: page.data.title,
      description: page.data.description ?? null,
      author: page.data.author,
      date: new Date(page.data.date).toISOString().split('T')[0],
      tags: page.data.tags ?? null,
      url: page.url,
      hero: (page.data._exports.hero as string | undefined) ?? null,
      externalUrl: page.data.externalUrl ?? null,
      origin,
    }
  })

function Page() {
  const { path } = Route.useLoaderData()
  const params = Route.useParams()
  return <PageBlogPost path={path} slug={params._splat ?? ''} />
}
