import type { CollectionData, DocumentMeta } from '@ntatoud/effect-collections'

import { caseStudies as caseStudiesCollection } from '../collections.ts'

export type CaseStudy = CollectionData<typeof caseStudiesCollection>

export type CaseStudyDetail = CaseStudy & {
  /** The rendered body, as HTML. */
  html: string
}

/** Published case studies, newest first. */
export const getCaseStudies = (
  documents: ReadonlyArray<DocumentMeta<CaseStudy>>,
): ReadonlyArray<CaseStudy> =>
  documents
    .map((doc) => doc.data)
    .filter((caseStudy) => caseStudy.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
