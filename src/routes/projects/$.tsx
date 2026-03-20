import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'
import { PageError } from '@/components/page-error'
import { PageProject, projectLoader } from '@/features/projects/page-project'
import { ogMeta } from '@/features/og/meta'
import { projects } from '@/lib/source'

export const Route = createFileRoute('/projects/$')({
  component: Page,
  notFoundComponent: () => (
    <PageError
      code="404"
      title="Project not found"
      description="This project doesn't exist or has been removed."
    />
  ),
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/') ?? []
    const data = await serverLoader({ data: slugs })
    await projectLoader.preload(data.path)
    return data
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    return {
      meta: ogMeta({
        title: `${loaderData.title} | Noé Tatoud`,
        description: loaderData.description,
        author: 'Noé Tatoud',
        tags: loaderData.tags,
        hero: null,
        url: loaderData.url,
        origin: loaderData.origin,
        type: 'website',
      }),
    }
  },
})

const serverLoader = createServerFn({ method: 'GET' })
  .inputValidator((slugs: Array<string>) => slugs)
  .handler(({ data: slugs }: { data: Array<string> }) => {
    const page = projects.getPage(slugs)
    if (!page) throw notFound()
    const origin = getRequestUrl({ xForwardedHost: true }).origin

    return {
      path: page.path,
      title: page.data.title,
      description: page.data.description ?? null,
      kind: page.data.kind,
      projectUrl: page.data.url ?? null,
      repo: page.data.repo ?? null,
      tags: page.data.tags ?? null,
      url: page.url,
      origin,
    }
  })

function Page() {
  const { path } = Route.useLoaderData()
  return <PageProject path={path} />
}
