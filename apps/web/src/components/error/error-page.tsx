/**
 * Shown when a route loader fails for any reason other than missing content.
 * Deliberately says nothing about the underlying error, which can carry absolute
 * server paths that must not reach a visitor.
 */
export function ErrorPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">
        This page failed to load. Try again in a moment.
      </p>
    </main>
  )
}
