import type { BlogPost, BlogPostDetail } from '@ntatoud/content'

import { ArrowUpRight02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { DetailPage } from '@/components/detail-page'
import { Monogram } from '@/components/monogram'
import { MoreSection } from '@/components/more-section'
import { SayHello } from '@/components/say-hello'
import { ButtonAnchor } from '@/components/ui/button-link'
import { formatDate, readingMinutes } from '@/lib/format'
import { inlineLink } from '@/lib/link-styles'
import { sharedElement } from '@/lib/view-transition'

import { BlogCard } from './blog-card'
import { DEFAULT_POST_PROMPT, POST_PROMPTS } from './post-prompts'

type BlogPostPageProps = {
  post: BlogPostDetail
  morePosts: readonly BlogPost[]
}

const languageNames = new Intl.DisplayNames('en', { type: 'language' })

export function BlogPostPage({ post, morePosts }: BlogPostPageProps) {
  return (
    <DetailPage
      slot="blog-post"
      back={{ to: '/blog', label: 'All posts' }}
      title={post.title}
      titleTransition={sharedElement('title', 'blog', post.slug)}
      byline={<Byline post={post} />}
      description={post.description}
      tags={post.tags}
      linkTags
      html={post.html}
      footer={
        <>
          <SayHello
            title={
              post.externalUrl
                ? 'Read it? Tell me what you think'
                : 'What do you think?'
            }
            subject={`About "${post.title}"`}
            className="mt-16"
          >
            <p>{POST_PROMPTS[post.slug] ?? DEFAULT_POST_PROMPT}</p>
          </SayHello>
          {morePosts.length > 0 && (
            <MoreSection title="Keep reading" slot="more-posts">
              {morePosts.map((other) => (
                <BlogCard key={other.slug} post={other} />
              ))}
            </MoreSection>
          )}
        </>
      }
    >
      {post.hero && (
        <img
          {...sharedElement('hero', 'blog', post.slug)}
          src={post.hero}
          alt=""
          width={post.heroDimensions?.width}
          height={post.heroDimensions?.height}
          fetchPriority="high"
          className="mt-8 max-h-80 w-full rounded-2xl border border-border object-cover dark:brightness-90"
          data-slot="blog-post-hero"
        />
      )}
      {post.externalUrl && (
        <ButtonAnchor
          href={post.externalUrl}
          size="lg"
          className="mt-8"
          data-slot="blog-post-external"
        >
          Read it on {new URL(post.externalUrl).host.replace(/^www\./, '')}
          <HugeiconsIcon
            icon={ArrowUpRight02Icon}
            size={18}
            data-icon="inline-end"
          />
        </ButtonAnchor>
      )}
    </DetailPage>
  )
}

function Byline({ post }: { post: BlogPostDetail }) {
  return (
    <div className="flex items-center gap-3" data-slot="blog-post-byline">
      <Monogram className="size-11 text-xl" />
      <div className="flex flex-col text-sm">
        <span className="font-medium text-foreground">{post.author}</span>
        <span className="text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {!post.externalUrl && <> · {readingMinutes(post.html)} min read</>}
          {post.translations?.map(({ lang, url }) => (
            <span key={lang}>
              {' '}
              ·{' '}
              <a href={url} hrefLang={lang} className={inlineLink}>
                Also in {languageNames.of(lang) ?? lang}
              </a>
            </span>
          ))}
        </span>
      </div>
    </div>
  )
}
