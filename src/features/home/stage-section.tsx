import { Link, useLoaderData } from '@tanstack/react-router'

import { PixelArrowRight } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { StageList } from '@/features/talks/stage-list'
import {
  Section,
  SectionActions,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from '@/layout/section'

export function StageSection() {
  const { talks } = useLoaderData({ from: '/' })
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Stage</SectionTitle>
        <SectionActions>
          <Button
            variant="ghost"
            className="px-2"
            render={<Link to="/stage" />}
            nativeButton={false}
          >
            All sessions <PixelArrowRight size={16} aria-hidden />
          </Button>
        </SectionActions>
      </SectionHeader>
      <SectionContent>
        <StageList talks={talks} />
      </SectionContent>
    </Section>
  )
}
