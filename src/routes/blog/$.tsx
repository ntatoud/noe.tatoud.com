import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { PageBlogPost, blogPostLoader } from '@/features/blog/page-blog-post'
import { serializeOgSearchParams } from '@/features/og/search-params'
import { blog } from '@/lib/source'
import { SITE_URL } from '@/lib/site'

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

    const { title, description, author, tags, url, hero } = loaderData

    const ogImageUrl = `${SITE_URL}/api/og${serializeOgSearchParams({ title, description, author, tags, hero })}`
    const pageUrl = `${SITE_URL}${url}`

    return {
      meta: [
        { title },
        { name: 'description', content: description ?? '' },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description ?? '' },
        { property: 'og:image', content: ogImageUrl },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:url', content: pageUrl },
        { property: 'og:site_name', content: 'Noe Tatoud' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description ?? '' },
        { name: 'twitter:image', content: ogImageUrl },
      ],
    }
  },
})

const serverLoader = createServerFn({ method: 'GET' })
  .inputValidator((slugs: Array<string>) => slugs)
  .handler(({ data: slugs }: { data: Array<string> }) => {
    const page = blog.getPage(slugs)
    if (!page) throw notFound()
    const hero = (page.data as unknown as Record<string, unknown>)._exports as
      | Record<string, unknown>
      | undefined
    const heroUrl = hero?.hero as string | undefined
    return {
      path: page.path,
      title: page.data.title,
      description: page.data.description,
      author: page.data.author,
      tags: page.data.tags,
      url: page.url,
      hero: heroUrl ?? null,
    }
  })

function Page() {
  const { path } = Route.useLoaderData()
  return <PageBlogPost path={path} />
}
