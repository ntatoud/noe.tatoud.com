import * as path from 'node:path'

import { defineCollection } from '@ntatoud/effect-collections'
import type { CollectionData } from '@ntatoud/effect-collections'

import { contentRoot, publicImageUrl } from '../content-url.ts'
import { StageItemSchema } from '../schemas/talks.ts'
import { newestFirst } from '../sort.ts'
import { defineContentCollection } from './define.ts'
import { joinNonEmpty, metaList } from './twin-lines.ts'

const collection = defineCollection({
  name: 'talks',
  directory: path.join(contentRoot, 'talks'),
  schema: StageItemSchema,
  transform: ({ events, ...data }, meta) => ({
    ...data,
    slug: meta.slug,
    path: `/talks/${meta.slug}`,
    // Newest first, so "the latest event" is always `events[0]` for every
    // consumer (cards, sitemap, listing order, markdown twins).
    events: events
      .map(({ logo, ...event }) => ({
        ...event,
        logo: logo ? publicImageUrl(logo, meta) : null,
      }))
      .sort(newestFirst((event) => event.date)),
  }),
})

export type StageItem = CollectionData<typeof collection>

export type TalkDetail = StageItem & {
  /** The rendered body, as HTML. */
  html: string
}

export const talks = defineContentCollection({
  key: 'talks',
  collection,
  // Every talk, ordered by its most recent event (`events[0]`), newest first.
  reader: (documents) =>
    documents
      .map((doc) => doc.data)
      .sort(newestFirst((talk) => talk.events[0]?.date)),
  index: {
    title: 'Talks',
    entry: (talk) => ({
      title: talk.title,
      routePath: talk.path,
      description: talk.description,
      note: talk.events[0]
        ? joinNonEmpty([talk.events[0].event, talk.events[0].date])
        : talk.kind,
    }),
  },
  listingPage: { name: 'talks', path: '/talks' },
  detail: {
    loader: 'loadTalk',
    kind: 'talk',
    page: (talk) => ({
      path: talk.path,
      title: talk.title,
      description: talk.description,
      lastmod: talk.events[0]?.date,
      details: [
        `- Kind: ${talk.kind}`,
        talk.resource ? `- ${talk.resource.kind}: ${talk.resource.url}` : null,
        metaList('Tags', talk.tags),
        metaList(
          'Presented at',
          talk.events.map((event) =>
            joinNonEmpty([event.event, event.city, event.date]),
          ),
        ),
      ],
    }),
  },
})
