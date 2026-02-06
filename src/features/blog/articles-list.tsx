import { Link } from '@tanstack/react-router'
import type { BlogPost } from '@/features/blog/get-blog-posts'
import { formatDate } from '@/features/blog/schemas'
import {
  Card,
  CardDescription,
  CardFooter,
  CardList,
  CardTags,
  CardTitle,
} from '@/components/ui/card-list'

export function ArticlesList({ posts }: { posts: Array<BlogPost> }) {
  if (posts.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No blog posts yet. Check back soon!
      </p>
    )
  }

  return (
    <CardList>
      {posts.map((post) => (
        <Card key={post.slug}>
          <Link
            to="/blog/$"
            params={{ _splat: post.slug }}
            className="block p-6"
          >
            <CardTitle>{post.title}</CardTitle>
            {post.description && (
              <CardDescription>{post.description}</CardDescription>
            )}
            <CardFooter>
              <span>{post.author}</span>
              <span>·</span>
              <time>{formatDate(post.date)}</time>
            </CardFooter>
            {post.tags && post.tags.length > 0 && <CardTags tags={post.tags} />}
          </Link>
        </Card>
      ))}
    </CardList>
  )
}
