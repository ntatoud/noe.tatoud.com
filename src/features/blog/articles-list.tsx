import { Link } from '@tanstack/react-router'
import type { BlogPost } from '@/features/blog/get-blog-posts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardImage,
  CardList,
  CardTags,
  CardTitle,
} from '@/components/ui/card-list'
import { formatDate } from '@/lib/format'

export function ArticlesList({ posts }: { posts: Array<BlogPost> }) {
  if (posts.length === 0) {
    return (
      <p className="text-center text-pretty text-muted-foreground">
        No blog posts yet. Check back soon!
      </p>
    )
  }

  return (
    <CardList>
      {posts.map((post) => (
        <Card
          key={post.slug}
          className={post.hero ? 'min-h-[280px] overflow-hidden' : ''}
        >
          {post.hero && <CardImage src={post.hero} alt={post.title} />}
          <Link
            to="/blog/$"
            params={{ _splat: post.slug }}
            className="flex h-full"
          >
            <CardContent className={post.hero ? 'justify-end' : ''}>
              <CardTitle>{post.title}</CardTitle>
              {post.description && (
                <CardDescription>{post.description}</CardDescription>
              )}
              {post.tags && post.tags.length > 0 && (
                <CardTags tags={post.tags} />
              )}
              <CardFooter>
                <span>{post.author}</span>
                <span>·</span>
                <time>{formatDate(post.date)}</time>
              </CardFooter>
            </CardContent>
          </Link>
        </Card>
      ))}
    </CardList>
  )
}
