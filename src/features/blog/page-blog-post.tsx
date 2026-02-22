import browserCollections from 'fumadocs-mdx:collections/browser'
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { Suspense, useEffect, useRef } from 'react'
import type { ComponentProps } from 'react'
import {
  addReadPost,
  useAchievements,
} from '@/features/achievements/use-achievements'
import { CardTags } from '@/components/ui/card-list'
import { Image } from '@/components/ui/image'
import { formatDate } from '@/lib/format'
import { Hero, HeroMeta, HeroTitle } from '@/layout/hero'

const mdxComponents = {
  ...defaultMdxComponents,
  pre: (props: ComponentProps<'pre'>) => (
    <div className="relative my-4 bg-border [filter:drop-shadow(4px_4px_0_var(--shelf-card))] clip-pixel-lg before:absolute before:inset-[2px] before:-z-10 before:bg-card before:content-[''] before:clip-pixel-lg">
      <CodeBlock
        {...props}
        className="!my-0 !rounded-none !border-none !bg-transparent !shadow-none"
      >
        <Pre>{props.children}</Pre>
      </CodeBlock>
    </div>
  ),
}

export const blogPostLoader = browserCollections.blogPosts.createClientLoader({
  component({ frontmatter, hero, default: MDX }) {
    const heroSrc = hero as string | undefined
    return (
      <>
        <Hero className="pt-12 text-center">
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
            <Image
              src={heroSrc}
              alt={frontmatter.title}
              className="inset-0 clip-pixel-lg"
              sizes="(max-width: 672px) 100vw, 672px"
              priority
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
        <article className="mx-auto prose w-full max-w-3xl px-4 py-6 *:mx-auto *:max-w-2xl sm:py-8 md:px-0">
          <MDX components={mdxComponents} />
        </article>
      </>
    )
  },
})

function ScrollTracker({ slug }: { slug: string }) {
  const { unlock } = useAchievements()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const firedRef = useRef(false)

  useEffect(() => {
    firedRef.current = false
  }, [slug])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !firedRef.current) {
        firedRef.current = true
        unlock('reader')
        addReadPost(slug)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [slug, unlock])

  return <div ref={sentinelRef} />
}

export function PageBlogPost({ path, slug }: { path: string; slug: string }) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      {blogPostLoader.useContent(path)}
      <ScrollTracker slug={slug} />
    </Suspense>
  )
}
