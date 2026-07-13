import { createFileRoute } from '@tanstack/react-router'

import { AchievementsPage } from '@/features/achievements/achievements-page'

export const Route = createFileRoute('/achievements')({
  component: AchievementsPage,
})
