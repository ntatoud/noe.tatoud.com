import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import browserCollections from 'fumadocs-mdx:collections/browser'
import { Suspense } from 'react'
import { blog } from '@/lib/source'
import { formatDate } from '@/features/blog/schemas'

export const Route = createFileRoute('/blog/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/') ?? []
    const data = await serverLoader({ data: slugs })
    await clientLoader.preload(data.path)
    return data
  },
})

const serverLoader = createServerFn({ method: 'GET' })
  .inputValidator((slugs: Array<string>) => slugs)
  .handler(({ data: slugs }: { data: Array<string> }) => {
    const page = blog.getPage(slugs)
    if (!page) throw notFound()
    return { path: page.path }
  })

const clientLoader = browserCollections.blogPosts.createClientLoader({
  component({ frontmatter, default: MDX }) {
    return (
      <article className="prose-neutral dark:prose-invert mx-auto prose max-w-3xl px-4 py-8">
        <header className="not-prose mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            {frontmatter.title}
          </h1>
          {frontmatter.description && (
            <p className="text-lg text-muted-foreground">
              {frontmatter.description}
            </p>
          )}
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{frontmatter.author}</span>
            <span>·</span>
            <time>{formatDate(frontmatter.date)}</time>
          </div>
        </header>
        <MDX />
      </article>
    )
  },
})

function Page() {
  const data = Route.useLoaderData()
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      {clientLoader.useContent(data.path)}
    </Suspense>
  )
}
