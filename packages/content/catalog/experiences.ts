import * as path from 'node:path'

import { defineCollection } from '@ntatoud/effect-collections'
import type { CollectionData } from '@ntatoud/effect-collections'

import { contentRoot, publicImageUrl } from '../content-url.ts'
import { ExperienceSchema } from '../schemas/experiences.ts'
import { newestFirst } from '../sort.ts'
import { defineContentCollection } from './define.ts'
import { joinNonEmpty } from './twin-lines.ts'

const collection = defineCollection({
  name: 'experiences',
  directory: path.join(contentRoot, 'experiences'),
  schema: ExperienceSchema,
  transform: ({ logo, preview, ...data }, meta) => ({
    ...data,
    slug: meta.slug,
    logo: logo ? publicImageUrl(logo, meta) : null,
    preview: preview ? publicImageUrl(preview, meta) : null,
  }),
})

export type Experience = CollectionData<typeof collection>

// Experiences have no page of their own (they only ever render inline on the
// home page), so they are indexed without a link rather than pointed at a
// markdown twin that would 404.
export const experiences = defineContentCollection({
  key: 'experiences',
  collection,
  // Every experience, most recently started first.
  reader: (documents) =>
    documents
      .map((doc) => doc.data)
      .sort(newestFirst((experience) => experience.startDate)),
  index: {
    title: 'Experience',
    entry: (experience) => ({
      title: `${experience.title}, ${experience.organization}`,
      routePath: null,
      note: joinNonEmpty([
        experience.kind,
        `${experience.startDate}–${experience.endDate ?? 'present'}`,
      ]),
      description: experience.url,
    }),
  },
})
