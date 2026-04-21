import { Suspense, useEffect, useRef } from 'react'
import type { ComponentProps } from 'react'

import { CardTags } from '@/components/ui/card-list'
import { Image } from '@/components/ui/image'
import { engine, useAchievements } from '@/features/achievements/engine'
import { Hero, HeroMeta, HeroTitle } from '@/layout/hero'
import { PageBreadcrumb } from '@/layout/page-breadcrumb'
import { formatDate } from '@/lib/format'
import { createLazyMDXLoader } from '@/lib/mdx'

const getLazyMDX = createLazyMDXLoader(
  import.meta.glob('/content/blog/**/*.mdx'),
)

const mdxComponents = {
  figure: ({
    children,
    ...props
  }: ComponentProps<'figure'> & {
    'data-rehype-pretty-code-figure'?: string
  }) => {
    if ('data-rehype-pretty-code-figure' in props) return <>{children}</>
    return <figure {...props}>{children}</figure>
  },
  pre: (props: ComponentProps<'pre'>) => (
    <div className="relative my-4 bg-border pixel-shadow clip-pixel-lg pixel-shadow-card pixel-shadow-x-4 before:absolute before:inset-[2px] before:-z-10 before:bg-card before:content-[''] before:clip-pixel-lg">
      <pre
        {...props}
        className="!my-0 overflow-auto p-4 text-sm [&_code]:bg-transparent [&_code]:p-0"
      />
    </div>
  ),
}

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
        engine.collectItem('completionist', slug)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [slug, unlock])

  return <div ref={sentinelRef} />
}

export function PageBlogPost({
  slug,
  hero,
  title,
  author,
  date,
  tags,
  translations,
}: {
  slug: string
  hero: string | null
  title: string
  author: string
  date: string
  tags: Array<string> | null
  translations: Array<{ lang: string; url: string }> | null
}) {
  const LazyMDX = getLazyMDX(`/content/blog/${slug}/index.mdx`)

  return (
    <>
      <Hero className="pt-12 text-center">
        <PageBreadcrumb href="/blog" label="Blog" current={title} />
        {tags && tags.length > 0 && <CardTags tags={tags} />}
        <HeroTitle className="text-3xl sm:text-4xl">{title}</HeroTitle>
        <HeroMeta>
          <span>{author}</span>
          <span>·</span>
          <time>{formatDate(date)}</time>
        </HeroMeta>

        {hero && (
          <Image
            src={hero}
            alt={title}
            className="inset-0 clip-pixel-lg"
            sizes="(max-width: 672px) 100vw, 672px"
            priority
          />
        )}

        {translations && translations.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <span>Also available in: </span>
            {translations.map((t, i) => (
              <span key={t.lang}>
                <a
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:no-underline"
                >
                  {t.lang.toUpperCase()}
                </a>
                {i < translations.length - 1 && ', '}
              </span>
            ))}
          </div>
        )}
      </Hero>

      <article className="mx-auto prose w-full max-w-3xl px-4 py-6 prose-invert *:mx-auto *:max-w-2xl sm:py-8 md:px-0">
        {LazyMDX && (
          <Suspense
            fallback={<div className="p-8 text-center">Loading...</div>}
          >
            <LazyMDX components={mdxComponents} />
          </Suspense>
        )}
      </article>

      <ScrollTracker slug={slug} />
    </>
  )
}
