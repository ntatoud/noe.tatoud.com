import { Link } from '@tanstack/react-router'

import type { Experience } from '@/lib/content'

type ExperiencesPageProps = {
  experiences: Experience[]
}

export function ExperiencesPage({ experiences }: ExperiencesPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12" data-slot="experiences-page">
      <h1 className="text-3xl font-bold tracking-tight">Experiences</h1>
      <p className="mt-2 text-muted-foreground">
        Roles, companies, and timelines.
      </p>
      <ul className="mt-8 flex flex-col gap-2">
        {experiences.map((exp) => (
          <li key={exp.slug}>
            <Link
              to="/experiences/$slug"
              params={{ slug: exp.slug }}
              className="text-sm text-foreground underline-offset-4 hover:underline"
            >
              {exp.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
