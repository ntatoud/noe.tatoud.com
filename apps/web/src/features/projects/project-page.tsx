import { Link } from '@tanstack/react-router'

type ProjectPageProps = {
  slug: string
}

export function ProjectPage({ slug }: ProjectPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12" data-slot="project-page">
      <Link
        to="/projects"
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Projects
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">{slug}</h1>
      <p className="mt-2 text-muted-foreground">Project content goes here.</p>
    </main>
  )
}
