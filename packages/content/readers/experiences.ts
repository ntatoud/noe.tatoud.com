import * as path from 'node:path'

import { getAll } from '@ntatoud/effect-collections'
import type { DocumentMeta } from '@ntatoud/effect-collections'

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

export async function getExperiences(): Promise<Experience[]> {
  const docs = await getAll(experiencesCollection)
  return docs
    .map(toExperience)
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    )
}
