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

type BlogCardProps = {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
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
      media={
        <div className="aspect-video w-full shrink-0 overflow-hidden bg-muted">
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
      <time dateTime={post.date} className="text-xs text-muted-foreground">
        {formatDate(post.date)}
      </time>
      <CardTitle external={external}>{post.title}</CardTitle>
      <CardDescription>{post.description}</CardDescription>
      <CardTags tags={post.tags} />
    </ContentCard>
  )
}
