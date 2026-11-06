import type { BlogPost } from '@ntatoud/content'
import { Link } from '@tanstack/react-router'

import { ListingPage } from '@/components/listing-page'
import { useHydrated } from '@/hooks/use-hydrated'
import { inlineLink } from '@/lib/link-styles'

import { BlogCard } from './blog-card'
import { startHerePost } from './start-here'

type BlogPageProps = {
  posts: readonly BlogPost[]
  tag?: string
}

export function BlogPage({ posts, tag }: BlogPageProps) {
  const activeTag = useHydrated() ? tag : undefined
  const shown = activeTag
    ? posts.filter((post) => post.tags?.includes(activeTag))
    : posts

  return (
    <ListingPage
      slot="blog-page"
      title="Blog"
      subtitle="What I learn while building for the web: frontend, tooling, AI and the craft around it."
      listTitle={activeTag ? `Posts tagged ${activeTag}` : 'All posts'}
      intro={
        <p className="mt-4 text-muted-foreground" data-slot="blog-intro">
          {activeTag ? (
            <>
              Showing posts tagged{' '}
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
