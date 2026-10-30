export const metaList = (
  label: string,
  values: ReadonlyArray<string> | undefined,
) => (values && values.length > 0 ? `- ${label}: ${values.join(', ')}` : null)

export const joinNonEmpty = (
  values: ReadonlyArray<string | null | undefined>,
) => values.filter(Boolean).join(' · ')
