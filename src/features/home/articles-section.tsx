import { Link, useLoaderData } from '@tanstack/react-router'
import { PixelArrowRight } from '@/components/icons'

import { Button } from '@/components/ui/button'
import {
  Section,
  SectionActions,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from '@/layout/section'
import { ArticlesList } from '@/features/blog/articles-list'

export function ArticlesSection() {
  const { posts } = useLoaderData({ from: '/' })
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Articles</SectionTitle>
        <SectionActions>
          <Button
            variant="ghost"
            className="px-2"
            render={<Link to="/blog" />}
            nativeButton={false}
          >
            All articles <PixelArrowRight size={16} aria-hidden />
          </Button>
        </SectionActions>
      </SectionHeader>
      <SectionContent>
        <ArticlesList posts={posts} />
      </SectionContent>
    </Section>
  )
}
