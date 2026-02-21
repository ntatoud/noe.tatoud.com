import { ArrowRight } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, useLoaderData } from '@tanstack/react-router'

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
            size="lg"
            render={<Link to="/blog" />}
            nativeButton={false}
          >
            All articles <HugeiconsIcon icon={ArrowRight} aria-hidden />
          </Button>
        </SectionActions>
      </SectionHeader>
      <SectionContent>
        <ArticlesList posts={posts} />
      </SectionContent>
    </Section>
  )
}
