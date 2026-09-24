import type { BlogPost } from '@ntatoud/content'

import { Image02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import {
  CardDescription,
  CardTags,
  CardTitle,
  ContentCard,
} from '@/components/content-card'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

type BlogCardProps = {
  post: BlogPost
  /** The most recent post: a full-width, side-by-side card with a larger title. */
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const external = post.externalUrl !== null

  return (
    <ContentCard
      slot="blog-card"
      link={
        post.externalUrl !== null
          ? { external: true, href: post.externalUrl }
          : { to: '/blog/$slug', slug: post.slug }
      }
      lift={false}
      featured={featured}
      media={
        <div
          className={cn(
            'aspect-video w-full shrink-0 overflow-hidden bg-muted',
            featured && 'md:aspect-auto md:min-h-80 md:w-3/5',
          )}
        >
          {post.hero ? (
            <img
              src={post.hero}
              alt=""
              width={post.heroDimensions?.width}
              height={post.heroDimensions?.height}
              loading="lazy"
              className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          ) : (
            <div
              className="flex size-full items-center justify-center"
              aria-hidden="true"
            >
              <HugeiconsIcon
                icon={Image02Icon}
                size={28}
                className="text-muted-foreground/30"
              />
            </div>
          )}
        </div>
      }
    >
      <div className="flex items-center gap-2">
        {featured && (
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
            Latest
          </span>
        )}
        <time dateTime={post.date} className="text-xs text-muted-foreground">
          {formatDate(post.date)}
        </time>
      </div>
      <CardTitle
        external={external}
        className={cn(featured && 'text-2xl sm:text-3xl md:line-clamp-3')}
      >
        {post.title}
      </CardTitle>
      <CardDescription
        className={cn(featured && 'text-base md:line-clamp-4 md:min-h-0')}
      >
        {post.description}
      </CardDescription>
      <CardTags tags={post.tags} />
    </ContentCard>
  )
}
