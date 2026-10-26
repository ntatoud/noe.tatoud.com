import { notFound } from '@tanstack/react-router'

type DocumentLoaders<T> = Readonly<
  Record<string, (() => Promise<{ default: T }>) | undefined>
>

/** A document's detail chunk from `virtual:content`; an unknown slug is a 404. */
export async function loadDocument<T>(
  loaders: DocumentLoaders<T>,
  slug: string,
): Promise<T> {
  const load = loaders[slug]
  if (!load) throw notFound()
  return (await load()).default
}
