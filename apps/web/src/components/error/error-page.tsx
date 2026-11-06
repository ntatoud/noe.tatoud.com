import { ButtonLink } from '@/components/ui/button-link'

// Says nothing about the error: it can carry absolute server paths.
export function ErrorPage() {
  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-24">
      <h1 className="text-4xl sm:text-5xl">Something went wrong</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        This page failed to load. Try again in a moment.
      </p>
      <ButtonLink to="/" size="lg" className="mt-8">
        Back home
      </ButtonLink>
    </main>
  )
}
