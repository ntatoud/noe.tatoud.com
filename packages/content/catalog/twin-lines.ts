// Formatting shared by the catalog entries' markdown twin headers and index
// entries (ADR-0009).

/**
 * One `- Label: a, b, c` metadata line, or nothing when the field is absent or
 * empty, so an optional frontmatter array never leaves a dangling label behind.
 */
export const metaList = (
  label: string,
  values: ReadonlyArray<string> | undefined,
) => (values && values.length > 0 ? `- ${label}: ${values.join(', ')}` : null)

/** Joins the parts of a one-line summary, skipping the ones a document omitted. */
export const joinNonEmpty = (
  values: ReadonlyArray<string | null | undefined>,
) => values.filter(Boolean).join(' · ')
