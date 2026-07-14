import { Badge } from '@/components/ui/badge'
import type { BlogPost } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { netlifyImageUrl } from '@/lib/netlify-image'
import { cn } from '@/lib/utils'

import { Slice } from './slice'

type BlogSliceProps = {
  posts: BlogPost[]
}

export function BlogSlice({ posts }: BlogSliceProps) {
  const latest = posts.slice(0, 3)

  return (
    <Slice title="Blog" seeAllHref="/blog" data-slot="blog-slice">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {latest.map((post) => {
          const href = post.externalUrl ?? post.url
          const isExternal = post.externalUrl !== null
          const heroSrc = post.hero
            ? netlifyImageUrl(post.hero, {
                width: post.heroDimensions?.width,
                height: post.heroDimensions?.height,
              })
            : null
          return (
            <a
              key={post.slug}
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className={cn(
                'group relative flex flex-col overflow-hidden rounded-lg border border-border transition-all hover:-translate-y-0.5 hover:border-foreground/20',
                heroSrc && 'min-h-[280px]',
              )}
              data-slot="blog-post-link"
            >
              {heroSrc && (
                <>
                  <img
                    src={heroSrc}
                    alt=""
                    className="absolute inset-0 -z-10 h-full w-full object-cover"
                    data-slot="blog-post-hero"
                  />
                  <div className="absolute inset-0 -z-10 bg-linear-to-t from-card via-card/90 to-card/40" />
                </>
              )}
              <div
                className={cn(
                  'flex flex-1 flex-col gap-1 p-4',
                  post.hero && 'justify-end',
                )}
              >
                <div className="flex items-baseline gap-2">
                  <h3 className="font-medium group-hover:underline">
                    {post.title}
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(post.date)}
                </span>
                {post.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {post.description}
                  </p>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </a>
          )
        })}
      </div>
    </Slice>
  )
}
