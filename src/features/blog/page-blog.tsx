import { useLoaderData } from '@tanstack/react-router'
import { ArticlesList } from '@/features/blog/articles-list'
import { Hero, HeroSubtitle, HeroTitle } from '@/layout/hero'
import { Section, SectionContent } from '@/layout/section'

export function PageBlog() {
  const { posts } = useLoaderData({ from: '/blog/' })
  return (
    <div>
      <Hero className="pb-16">
        <HeroTitle>Blog</HeroTitle>
        <HeroSubtitle>
          Thoughts on web development, technology, and more.
        </HeroSubtitle>
      </Hero>

      <Section>
        <SectionContent>
          <ArticlesList posts={posts} />
        </SectionContent>
      </Section>
    </div>
  )
}
