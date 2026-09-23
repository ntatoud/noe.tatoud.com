import type { CaseStudy } from '@ntatoud/content'

import {
  CardDescription,
  CardTags,
  CardTitle,
  ContentCard,
} from '@/components/content-card'
import { formatMonthYear } from '@/lib/format'

type CaseStudyCardProps = {
  caseStudy: CaseStudy
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <ContentCard
      slot="case-study-card"
      link={{ to: '/case-studies/$slug', slug: caseStudy.slug }}
    >
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="truncate">{caseStudy.client}</span>
        <time dateTime={caseStudy.date} className="shrink-0 tabular-nums">
          {formatMonthYear(caseStudy.date)}
        </time>
      </div>
      <CardTitle>{caseStudy.title}</CardTitle>
      {caseStudy.description && (
        <CardDescription>{caseStudy.description}</CardDescription>
      )}
      <CardTags tags={caseStudy.tags} />
    </ContentCard>
  )
}
