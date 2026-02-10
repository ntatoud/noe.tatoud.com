import browserCollections from 'fumadocs-mdx:collections/browser'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { Suspense } from 'react'
import { CardTags } from '@/components/ui/card-list'
import { formatDate } from '@/lib/format'
import { Hero, HeroMeta, HeroTitle } from '@/layout/hero'

export const blogPostLoader = browserCollections.blogPosts.createClientLoader({
  component({ frontmatter, hero, default: MDX }) {
    const heroSrc = hero as string | undefined
    return (
      <>
        <Hero className="text-center">
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <CardTags tags={frontmatter.tags} />
          )}
          <HeroTitle className="text-3xl sm:text-4xl">
            {frontmatter.title}
          </HeroTitle>
          <HeroMeta>
            <span>{frontmatter.author}</span>
            <span>·</span>
            <time>{formatDate(frontmatter.date)}</time>
          </HeroMeta>

          {heroSrc && (
            <img
              src={heroSrc}
              alt=""
              className="aspect-video w-full max-w-2xl rounded-lg object-cover"
            />
          )}

          {frontmatter.translations && frontmatter.translations.length > 0 && (
            <div className="text-sm text-muted-foreground">
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
        </Hero>
        <article className="prose-neutral dark:prose-invert mx-auto prose w-full max-w-3xl px-4 py-6 sm:py-8 md:px-0 [&]:max-w-3xl">
          <MDX components={defaultMdxComponents} />
        </article>
      </>
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
