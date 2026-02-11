import { createFileRoute, redirect } from '@tanstack/react-router'
import { PageStyleguide } from '@/features/devtools/page-styleguide'

export const Route = createFileRoute('/styleguide')({
  beforeLoad: () => {
    if (import.meta.env.PROD) {
      throw redirect({ to: '/' })
    }
  },
  component: PageStyleguide,
})
