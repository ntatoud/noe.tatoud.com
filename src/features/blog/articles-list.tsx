import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { useHotkey } from '@tanstack/react-hotkeys'
import type { BlogPost } from '@/features/blog/get-blog-posts'
import { PixelExternalLink } from '@/components/icons'
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

export function ArticlesList({
  posts,
  enableKeyboardNav = false,
}: {
  posts: Array<BlogPost>
  enableKeyboardNav?: boolean
}) {
  const listRef = useRef<HTMLDivElement>(null)

  useHotkey(
    'J',
    () => {
      const links = listRef.current?.querySelectorAll<HTMLAnchorElement>('a')
      if (!links?.length) return
      const current = Array.from(links).findIndex(
        (link) => link === document.activeElement,
      )
      const next = current < links.length - 1 ? current + 1 : 0
      links[next].focus()
    },
    { enabled: enableKeyboardNav },
  )

  useHotkey(
    'K',
    () => {
      const links = listRef.current?.querySelectorAll<HTMLAnchorElement>('a')
      if (!links?.length) return
      const current = Array.from(links).findIndex(
        (link) => link === document.activeElement,
      )
      const prev = current > 0 ? current - 1 : links.length - 1
      links[prev].focus()
    },
    { enabled: enableKeyboardNav },
  )

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <span className="font-head text-8xl font-bold text-muted-foreground/20 select-none">
          ∅
        </span>
        <p className="text-pretty text-muted-foreground">
          No blog posts yet. Check back soon!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <CardList ref={listRef}>
        {posts.map((post, index) => (
          <Card
            key={post.slug}
            className={post.hero ? 'min-h-[280px] overflow-hidden' : ''}
          >
            {post.hero && (
              <CardImage
                src={post.hero}
                alt={post.title}
                priority={index === 0}
              />
            )}
            {post.externalUrl ? (
              <a
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full"
              >
                <CardContent className={post.hero ? 'justify-end' : ''}>
                  <CardTitle className="flex items-center gap-2">
                    {post.title}
                    <PixelExternalLink
                      size={12}
                      aria-hidden
                      className="shrink-0 text-muted-foreground"
                    />
                  </CardTitle>
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
              </a>
            ) : (
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
            )}
          </Card>
        ))}
      </CardList>
      {enableKeyboardNav && (
        <p className="flex items-center justify-center gap-2 font-mono text-xs text-muted-foreground/50">
          <kbd className="border border-border bg-muted px-1.5 py-0.5">J</kbd>
          <kbd className="border border-border bg-muted px-1.5 py-0.5">K</kbd>
          <span>to navigate</span>
        </p>
      )}
    </div>
  )
}
