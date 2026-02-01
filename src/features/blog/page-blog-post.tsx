import browserCollections from 'fumadocs-mdx:collections/browser'
import { Suspense } from 'react'
import { formatDate } from '@/features/blog/schemas'

export const blogPostLoader = browserCollections.blogPosts.createClientLoader({
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

export function PageBlogPost({ path }: { path: string }) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      {blogPostLoader.useContent(path)}
    </Suspense>
  )
}
