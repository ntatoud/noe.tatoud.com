import { ArrowRight } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import {
  Section,
  SectionActions,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from '@/layout/section'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function ArticlesSection() {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Articles</SectionTitle>
        <SectionActions>
          <Button variant="ghost" size="lg">
            See more <HugeiconsIcon icon={ArrowRight} />
          </Button>
        </SectionActions>
      </SectionHeader>
      <SectionContent>
        <Card className="flex flex-1">
          <CardHeader>Something</CardHeader>
          <CardContent>To say</CardContent>
        </Card>
      </SectionContent>
    </Section>
  )
}
