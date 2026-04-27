import { Suspense, useEffect, useRef } from 'react'

import { mdxComponents } from '@/components/mdx'
import { CardTags } from '@/components/ui/card-list'
import { Image } from '@/components/ui/image'
import { engine, useAchievements } from '@/features/achievements/engine'
import { Hero, HeroMeta, HeroTitle } from '@/layout/hero'
import { PageBreadcrumb } from '@/layout/page-breadcrumb'
import { formatDate } from '@/lib/format'
import { createLazyMDXLoader } from '@/lib/mdx'

export const blogMdx = createLazyMDXLoader(
  import.meta.glob('/content/blog/**/*.mdx'),
)

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
  heroDimensions,
  title,
  author,
  date,
  tags,
  translations,
}: {
  slug: string
  hero: string | null
  heroDimensions: { width: number; height: number } | null
  title: string
  author: string
  date: string
  tags: Array<string> | null
  translations: Array<{ lang: string; url: string }> | null
}) {
  const LazyMDX = blogMdx(`/content/blog/${slug}/index.mdx`)

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
            width={heroDimensions?.width}
            height={heroDimensions?.height}
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

      <article className="prose-article mx-auto prose w-full max-w-2xl px-4 py-6 prose-invert sm:py-8 md:px-0">
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
