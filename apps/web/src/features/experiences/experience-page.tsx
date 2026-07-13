import { Link } from '@tanstack/react-router'

type ExperiencePageProps = {
  slug: string
}

export function ExperiencePage({ slug }: ExperiencePageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12" data-slot="experience-page">
      <Link
        to="/experiences"
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Experiences
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">{slug}</h1>
      <p className="mt-2 text-muted-foreground">
        Experience content goes here.
      </p>
    </main>
  )
}
