export const MORE_COUNT = 2

export function others<T extends { slug: string }>(
  items: readonly T[],
  slug: string,
): T[] {
  return items.filter((item) => item.slug !== slug).slice(0, MORE_COUNT)
}
