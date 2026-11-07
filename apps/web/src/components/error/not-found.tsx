import { ButtonAnchor, ButtonLink } from '@/components/ui/button-link'
import { emailHref } from '@/layout/site-config'

export function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-24">
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">This page wandered off.</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        It doesn't exist or has moved. If a link here brought you, tell me and
        I'll fix it.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to="/" size="lg">
          Back home
        </ButtonLink>
        <ButtonAnchor
          href={emailHref('Broken link on noe.tatoud.com')}
          variant="outline"
          size="lg"
        >
          Report the link
        </ButtonAnchor>
      </div>
    </main>
  )
}
