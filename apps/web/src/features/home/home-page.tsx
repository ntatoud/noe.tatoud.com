type HomePageProps = {
  posts: { length: number }
  projects: { length: number }
  talks: { length: number }
  experiences: { length: number }
}

export function HomePage({
  posts,
  projects,
  talks,
  experiences,
}: HomePageProps) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-bold">noe.tatoud.com</h1>
      <p className="mt-2 text-muted-foreground">
        App skeleton — content readers wired through.
      </p>
      <ul className="mt-6 space-y-1 text-sm text-muted-foreground">
        <li>blog posts: {posts.length}</li>
        <li>projects: {projects.length}</li>
        <li>talks: {talks.length}</li>
        <li>experiences: {experiences.length}</li>
      </ul>
    </main>
  )
}
