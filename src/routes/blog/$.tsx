import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'
import { PageBlogPost, blogPostLoader } from '@/features/blog/page-blog-post'
import { ogMeta } from '@/features/og/meta'
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
    return { meta: ogMeta(loaderData) }
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
      description: page.data.description,
      author: page.data.author,
      tags: page.data.tags,
      url: page.url,
      hero: page.data._exports.hero as string | undefined,
      origin,
    }
  })

function Page() {
  const { path } = Route.useLoaderData()
  return <PageBlogPost path={path} />
}
