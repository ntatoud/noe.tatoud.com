import { blog } from './blog.ts'
import { experiences } from './experiences.ts'
import { projects } from './projects.ts'
import { talks } from './talks.ts'

/**
 * The Content Catalog: every Content Collection, in output order. The build
 * iterates it instead of naming collections, so this order is the order of the
 * sections in `/index.md` and `/llms.txt` and of the content pages.
 *
 * Adding a collection means adding its module here, plus its declaration in
 * `virtual.d.ts` and its routes in the app.
 */
export const catalog = [blog, projects, talks, experiences] as const

export type CatalogEntry = (typeof catalog)[number]

/** The badge a content page's social card carries. */
export type PageKind = NonNullable<CatalogEntry['detail']>['kind']

/** The listing pages, named as the app's `STATIC_PAGES` names them. */
export type ListingName = NonNullable<CatalogEntry['listingPage']>['name']
