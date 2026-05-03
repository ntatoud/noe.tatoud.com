import { createFileRoute } from '@tanstack/react-router'

import { getTalks } from '@/features/talks/get-talks'
import { PageTalks } from '@/features/talks/page-talks'

export const Route = createFileRoute('/stage/')({
  component: PageTalks,
  loader: async () => {
    const talks = await getTalks()
    return { talks }
  },
})
