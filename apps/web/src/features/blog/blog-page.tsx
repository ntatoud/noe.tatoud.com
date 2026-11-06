import { useEffect } from 'react'

import type { BlogPost } from '@ntatoud/content'
import { Link } from '@tanstack/react-router'

import { ListingPage } from '@/components/listing-page'
import { Badge } from '@/components/ui/badge'
import { useHydrated } from '@/hooks/use-hydrated'
import { inlineLink } from '@/lib/link-styles'

import { BlogCard } from './blog-card'
import { startHerePost } from './start-here'

type BlogPageProps = {
  posts: readonly BlogPost[]
  tag?: string
}

const sameTag = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

export function BlogPage({ posts, tag }: BlogPageProps) {
  const hydrated = useHydrated()
  const activeTag = hydrated ? tag : undefined
  const shown = activeTag
    ? posts.filter((post) => post.tags?.some((t) => sameTag(t, activeTag)))
    : posts
  const allTags = [...new Set(posts.flatMap((post) => post.tags ?? []))].sort(
    (a, b) => a.localeCompare(b),
  )

  useEffect(() => {
    if (hydrated) delete document.documentElement.dataset.filtering
  }, [hydrated])

  return (
    <ListingPage
      slot="blog-page"
      title="Blog"
      subtitle="What I learn while building for the web: frontend, tooling, AI and the craft around it."
      listTitle={activeTag ? `Posts tagged ${activeTag}` : 'All posts'}
      intro={
        <div className="mt-4 flex flex-col gap-4" data-slot="blog-intro">
          <p className="text-muted-foreground">
            {activeTag ? (
              <>
                {shown.length === 0 ? 'No posts tagged ' : 'Posts tagged '}
                <span className="text-foreground">{activeTag}</span>.{' '}
                <Link to="/blog" className={inlineLink}>
                  Show all posts
                </Link>
              </>
            ) : (
              <>
                New here? Start with{' '}
                <Link
                  to="/blog/$slug"
                  params={{ slug: startHerePost.slug }}
                  className={inlineLink}
                >
                  {startHerePost.title}
                </Link>
                .
              </>
            )}
          </p>
          <nav aria-label="Tags">
            <ul className="flex flex-wrap gap-1.5">
              {allTags.map((name) => (
                <li key={name}>
                  <Link
                    to="/blog"
                    search={{ tag: name }}
                    aria-current={
                      activeTag && sameTag(name, activeTag) ? 'page' : undefined
                    }
                    className="inline-flex min-h-6 items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring aria-[current=page]:[&>span]:border-primary aria-[current=page]:[&>span]:text-foreground [&>span]:hover:border-primary [&>span]:hover:text-foreground"
                  >
                    <Badge variant="outline">{name}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      }
      columns={2}
    >
      {shown.map((post, index) => (
        <BlogCard
          key={post.slug}
          post={post}
          featured={!activeTag && index === 0}
        />
      ))}
    </ListingPage>
  )
}
