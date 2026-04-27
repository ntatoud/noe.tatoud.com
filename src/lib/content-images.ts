const imageModules = import.meta.glob<string>(
  '/content/**/*.{png,jpg,jpeg,webp,avif}',
  { eager: true, query: '?url', import: 'default' },
)

export function resolveContentImage(
  directory: string,
  relativePath: string | undefined,
): string | null {
  if (!relativePath) return null
  const cleaned = relativePath.replace(/^\.\//, '')
  const key = `/${directory}/${cleaned}`.replace(/\/+/g, '/')
  return (imageModules[key] as string | undefined) ?? null
}
