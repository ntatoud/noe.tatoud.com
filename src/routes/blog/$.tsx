import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'

import { allBlogPosts } from 'content-collections'
import type { BlogPosting } from 'schema-dts'

import { PageError } from '@/components/page-error'
import { PageBlogPost, blogMdx } from '@/features/blog/page-blog-post'
import { canonicalLink, ogMeta } from '@/features/og/meta'
import { resolveContentImage } from '@/lib/content-images'
import { jsonLd } from '@/lib/json-ld'
import { siteUrl } from '@/lib/site'

export const Route = createFileRoute('/blog/$')({
  component: Page,
  notFoundComponent: () => (
    <PageError
      code="404"
      title="Article not found"
      description="This article doesn't exist or has been removed."
    />
  ),
  loader: async ({ params }) => {
    const slug = params._splat ?? ''
    const data = await serverLoader({ data: slug })
    if (data.externalUrl) {
      throw redirect({ href: data.externalUrl })
    }
    await blogMdx.preload(`/content/blog/${slug}/index.mdx`)
    return data
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const heroPreload = loaderData.hero
      ? [
          {
            rel: 'preload',
            as: 'image',
            href: `/.netlify/images?url=${encodeURIComponent(loaderData.hero)}&w=828&q=75`,
            imageSrcSet: [320, 640, 828, 1080]
              .map(
                (w) =>
                  `/.netlify/images?url=${encodeURIComponent(loaderData.hero!)}&w=${w}&q=75 ${w}w`,
              )
              .join(', '),
            imageSizes: '(max-width: 672px) 100vw, 672px',
          },
        ]
      : []

    const pageUrl = siteUrl(loaderData.origin, loaderData.url)
    const hreflangLinks = (loaderData.translations ?? []).map((t) => ({
      rel: 'alternate',
      hrefLang: t.lang,
      href: t.url.startsWith('http')
        ? t.url
        : siteUrl(loaderData.origin, t.url),
    }))

    return {
      links: [
        canonicalLink(loaderData.url, loaderData.origin),
        ...hreflangLinks,
        ...heroPreload,
      ],
      meta: [
        ...ogMeta({
          ...loaderData,
          ogImageUrl: siteUrl(
            loaderData.origin,
            `${loaderData.url}/assets/og-image`,
          ),
        }),
        jsonLd<BlogPosting>({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: loaderData.title,
          ...(loaderData.description && {
            description: loaderData.description,
          }),
          author: {
            '@type': 'Person',
            name: loaderData.author,
            url: siteUrl(loaderData.origin, '/'),
          },
          datePublished: loaderData.date,
          url: pageUrl,
          mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
          isPartOf: {
            '@type': 'WebSite',
            name: 'Noé Tatoud',
            url: siteUrl(loaderData.origin, '/'),
          },
          ...(loaderData.hero && {
            image: {
              '@type': 'ImageObject',
              url: loaderData.hero,
            },
          }),
        }),
      ],
    }
  },
})

const serverLoader = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(({ data: slug }: { data: string }) => {
    const post = allBlogPosts.find((p) => p._meta.path === slug)
    if (!post) throw notFound()
    const origin = getRequestUrl({ xForwardedHost: true }).origin

    return {
      slug,
      title: post.title,
      description: post.description ?? null,
      author: post.author,
      date: new Date(post.date).toISOString().split('T')[0],
      tags: post.tags ?? null,
      translations: post.translations ?? null,
      url: `/blog/${slug}`,
      hero: resolveContentImage(
        `content/blog/${post._meta.directory}`,
        post.hero,
      ),
      heroDimensions: post.heroDimensions ?? null,
      externalUrl: post.externalUrl ?? null,
      origin,
    }
  })

function Page() {
  const data = Route.useLoaderData()
  return <PageBlogPost {...data} />
}
