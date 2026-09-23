import type { CaseStudy } from '@ntatoud/content'

import { ListingPage } from '@/components/listing-page'
import { CaseStudyCard } from '@/features/case-studies/case-study-card'

type CaseStudiesPageProps = {
  caseStudies: readonly CaseStudy[]
}

export function CaseStudiesPage({ caseStudies }: CaseStudiesPageProps) {
  return (
    <ListingPage
      slot="case-studies-page"
      title="Case studies"
      subtitle="Client work, told in depth. Clients stay anonymous."
      columns={2}
    >
      {caseStudies.length > 0 ? (
        caseStudies.map((caseStudy) => (
          <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
        ))
      ) : (
        <li className="text-sm text-muted-foreground">Nothing here yet.</li>
      )}
    </ListingPage>
  )
}
