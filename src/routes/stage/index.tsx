import { createFileRoute } from '@tanstack/react-router'

import { getTalks } from '@/features/talks/get-stage'
import { PageStage } from '@/features/talks/page-stage'

export const Route = createFileRoute('/stage/')({
  component: PageStage,
  loader: async () => {
    const talks = await getTalks()
    return { talks }
  },
})
