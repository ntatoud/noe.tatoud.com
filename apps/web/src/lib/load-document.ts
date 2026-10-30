import { notFound } from '@tanstack/react-router'

type DocumentLoaders<T> = Readonly<
  Record<string, (() => Promise<{ default: T }>) | undefined>
>

export async function loadDocument<T>(
  loaders: DocumentLoaders<T>,
  slug: string,
): Promise<T> {
  const load = loaders[slug]
  if (!load) throw notFound()
  return (await load()).default
}
