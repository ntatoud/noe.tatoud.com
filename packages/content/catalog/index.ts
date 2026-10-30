import { blog } from './blog.ts'
import { experiences } from './experiences.ts'
import { projects } from './projects.ts'
import { talks } from './talks.ts'

// Order here is the order of sections in `/index.md` and `/llms.txt`.
export const catalog = [blog, projects, talks, experiences] as const

export type CatalogEntry = (typeof catalog)[number]

export type PageKind = NonNullable<CatalogEntry['detail']>['kind']

export type ListingName = NonNullable<CatalogEntry['listingPage']>['name']
