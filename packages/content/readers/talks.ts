import type { ComponentType } from 'react'

import { getAll, getBySlug } from '@ntatoud/effect-collections'

import { talks as talksCollection } from '../collections'
import type { StageEvent, StageFrontmatter } from '../schemas/talks'

export type StageItem = StageFrontmatter & {
  slug: string
}

export type TalkDetail = StageItem & {
  Content: ComponentType
}

/** Returns the event with the most recent date, or undefined. */
function latestEvent(
  events: ReadonlyArray<StageEvent> | undefined,
): StageEvent | undefined {
  if (!events || events.length === 0) return undefined
  return events.reduce((latest, e) =>
    new Date(e.date) > new Date(latest.date) ? e : latest,
  )
}

export async function getTalks(): Promise<StageItem[]> {
  const docs = await getAll(talksCollection)
  return docs
    .map((doc) => ({ slug: doc.slug, ...doc.data }))
    .sort(
      (a, b) =>
        new Date(latestEvent(b.events)?.date ?? 0).getTime() -
        new Date(latestEvent(a.events)?.date ?? 0).getTime(),
    )
}

export async function getTalk(slug: string): Promise<TalkDetail> {
  const doc = await getBySlug(talksCollection, slug)
  return { slug: doc.slug, ...doc.data, Content: doc.Content }
}
