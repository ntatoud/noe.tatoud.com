import * as path from 'node:path'

import { Collections } from '@ntatoud/effect-collections'
import type { DocumentMeta } from '@ntatoud/effect-collections'

import { Effect } from 'effect'

import { experiences as experiencesCollection } from '../collections'
import type { ExperienceFrontmatter } from '../schemas/experiences'

export type Experience = Omit<ExperienceFrontmatter, 'logo'> & {
  slug: string
  logo: string | null
}

const collectionName = path.basename(experiencesCollection.directory)

/** Turns an absolute logo image path into a portable, content-root-relative URL path. */
function publicLogoPath(absolutePath: string): string {
  const relative = path.relative(experiencesCollection.directory, absolutePath)
  return `/content/${collectionName}/${relative}`
}

function toExperience(
  doc: DocumentMeta<(typeof experiencesCollection.schema)['Type']>,
): Experience {
  const exp = { slug: doc.slug, ...doc.data }
  return {
    ...exp,
    logo: exp.logo ? publicLogoPath(exp.logo.path) : null,
  }
}

export const getExperiences = Collections.use((collections) =>
  collections.getAll(experiencesCollection),
).pipe(
  Effect.map((docs) =>
    docs
      .map(toExperience)
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      ),
  ),
)
