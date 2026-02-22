import { useEffect } from 'react'
import { useLoaderData } from '@tanstack/react-router'
import {
  getReadPosts,
  useAchievements,
} from '@/features/achievements/use-achievements'
import { ArticlesList } from '@/features/blog/articles-list'
import { Hero, HeroSubtitle, HeroTitle } from '@/layout/hero'
import { Section, SectionContent } from '@/layout/section'

export function PageBlog() {
  const { posts } = useLoaderData({ from: '/blog/' })
  const { unlock } = useAchievements()

  useEffect(() => {
    if (posts.length === 0) return
    const readSlugs = getReadPosts()
    const allRead = posts.every((p) => readSlugs.has(p.slug))
    if (allRead) unlock('completionist')
  }, [posts, unlock])

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
