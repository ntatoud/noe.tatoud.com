import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { ButtonLink } from '@/components/ui/button-link'

export function AchievementsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-bold">Achievements</h1>
      <p className="mt-2 text-muted-foreground">
        A gamified grid of unlockable items lives here. Coming soon.
      </p>
      <ButtonLink to="/" variant="ghost" size="sm" className="mt-6">
        <HugeiconsIcon
          icon={ArrowLeft02Icon}
          size={16}
          data-icon="inline-start"
        />
        Back home
      </ButtonLink>
    </main>
  )
}
