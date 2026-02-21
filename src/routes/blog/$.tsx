import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'
import { PageBlogPost, blogPostLoader } from '@/features/blog/page-blog-post'
import { ogMeta } from '@/features/og/meta'
import { siteUrl } from '@/lib/site'
import { blog } from '@/lib/source'

export const Route = createFileRoute('/blog/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/') ?? []
    const data = await serverLoader({ data: slugs })
    await blogPostLoader.preload(data.path)
    return data
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    return {
      meta: [
        ...ogMeta(loaderData),
        {
          'script:ld+json': {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: loaderData.title,
            ...(loaderData.description && {
              description: loaderData.description,
            }),
            author: { '@type': 'Person', name: loaderData.author },
            datePublished: loaderData.date,
            url: siteUrl(loaderData.origin, loaderData.url),
          },
        } as never,
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
      origin,
    }
  })

function Page() {
  const { path } = Route.useLoaderData()
  return <PageBlogPost path={path} />
}
