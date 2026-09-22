import type { BlogPost } from '@ntatoud/content'

import { ArrowUpRight02Icon, Image02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format'

type BlogCardProps = {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const external = post.externalUrl !== null
  const href = post.externalUrl ?? post.url

  return (
    <li data-slot="blog-card">
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card outline-none transition-colors hover:border-foreground/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
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
        <div className="flex flex-1 flex-col gap-2 p-4">
          <time dateTime={post.date} className="text-xs text-muted-foreground">
            {formatDate(post.date)}
          </time>
          <h3 className="line-clamp-2 min-h-[2lh] font-semibold tracking-tight text-foreground underline-offset-4 group-hover:underline">
            {post.title}
            {external && (
              <HugeiconsIcon
                icon={ArrowUpRight02Icon}
                size={14}
                className="ml-1 inline-block align-text-top text-muted-foreground"
                aria-hidden="true"
              />
            )}
          </h3>
          <p className="line-clamp-2 min-h-[2lh] text-sm text-muted-foreground">
            {post.description}
          </p>
          <div className="mt-auto flex min-h-5.5 flex-wrap gap-1 pt-2">
            {post.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </a>
    </li>
  )
}
