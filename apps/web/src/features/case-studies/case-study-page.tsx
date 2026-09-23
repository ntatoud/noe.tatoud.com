import type { CaseStudyDetail } from '@ntatoud/content'

import { DetailPage } from '@/components/detail-page'

type CaseStudyPageProps = {
  caseStudy: CaseStudyDetail
}

export function CaseStudyPage({ caseStudy }: CaseStudyPageProps) {
  const byline = [caseStudy.client, caseStudy.role].filter(Boolean).join(' · ')

  return (
    <DetailPage
      slot="case-study"
      back={{ to: '/case-studies', label: 'Case studies' }}
      title={caseStudy.title}
      byline={byline || undefined}
      description={caseStudy.description}
      tags={caseStudy.tags}
      html={caseStudy.html}
    />
  )
}
