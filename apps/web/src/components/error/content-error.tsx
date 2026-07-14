import type { ErrorComponentProps } from '@tanstack/react-router'

/**
 * Route-level error boundary for content Documents: an invalid frontmatter
 * or un-compilable MDX body (`FrontmatterInvalid` / `CompileFailed`, ADR-0006)
 * surfaces here instead of `notFound()`.
 */
export function ContentError({ error }: ErrorComponentProps) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </main>
  )
}
