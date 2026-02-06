import browserCollections from 'fumadocs-mdx:collections/browser'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { Suspense } from 'react'
import { formatDate } from '@/lib/format'

export const blogPostLoader = browserCollections.blogPosts.createClientLoader({
  component({ frontmatter, hero, default: MDX }) {
    const heroSrc = hero as string | undefined
    return (
      <article className="prose-neutral dark:prose-invert mx-auto prose w-full max-w-3xl min-w-0 px-4 py-6 sm:py-8">
        <header className="not-prose mb-6 sm:mb-8">
          {heroSrc && (
            <img
              src={heroSrc}
              alt=""
              className="mb-6 aspect-video w-full rounded-lg object-cover"
            />
          )}
          <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {frontmatter.title}
          </h1>
          {frontmatter.description && (
            <p className="text-base text-muted-foreground sm:text-lg">
              {frontmatter.description}
            </p>
          )}
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{frontmatter.author}</span>
            <span>·</span>
            <time>{formatDate(frontmatter.date)}</time>
          </div>
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {frontmatter.translations && frontmatter.translations.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              <span>Also available in: </span>
              {frontmatter.translations.map((translation, index) => (
                <span key={translation.lang}>
                  <a
                    href={translation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:no-underline"
                  >
                    {translation.lang.toUpperCase()}
                  </a>
                  {index < frontmatter.translations!.length - 1 && ', '}
                </span>
              ))}
            </div>
          )}
        </header>
        <MDX components={defaultMdxComponents} />
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
