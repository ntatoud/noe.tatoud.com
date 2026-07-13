import type { BlogPost } from '@ntatoud/content'

import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format'

import { Slice } from './slice'

type BlogSliceProps = {
  posts: BlogPost[]
}

export function BlogSlice({ posts }: BlogSliceProps) {
  const latest = posts.slice(0, 3)

  return (
    <Slice title="Blog" seeAllHref="/blog" data-slot="blog-slice">
      <ul className="flex flex-col divide-y divide-border">
        {latest.map((post) => (
          <li key={post.slug} className="py-4">
            <a
              href={post.url}
              className="group flex flex-col gap-1"
              data-slot="blog-post-link"
            >
              <div className="flex items-baseline gap-2">
                <h3 className="font-medium group-hover:underline">
                  {post.title}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {formatDate(post.date)}
                </span>
              </div>
              {post.description && (
                <p className="text-sm text-muted-foreground">
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
            </a>
          </li>
        ))}
      </ul>
    </Slice>
  )
}
