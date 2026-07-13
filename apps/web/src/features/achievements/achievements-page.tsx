import { Link } from '@tanstack/react-router'

export function AchievementsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-bold">Achievements</h1>
      <p className="mt-2 text-muted-foreground">
        A gamified grid of unlockable items lives here. Coming soon.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block text-sm text-foreground underline"
      >
        ← Back home
      </Link>
    </main>
  )
}
