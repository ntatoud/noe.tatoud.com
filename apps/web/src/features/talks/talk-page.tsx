import { Link } from '@tanstack/react-router'

type TalkPageProps = {
  slug: string
}

export function TalkPage({ slug }: TalkPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12" data-slot="talk-page">
      <Link
        to="/talks"
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Talks
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">{slug}</h1>
      <p className="mt-2 text-muted-foreground">Talk content goes here.</p>
    </main>
  )
}
