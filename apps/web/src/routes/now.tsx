import { createFileRoute } from '@tanstack/react-router'

import { NowPage } from '@/features/now/now-page'
import { pageMeta } from '@/features/og/metadata'
import { STATIC_PAGES } from '@/lib/site'

export const Route = createFileRoute('/now')({
  component: NowPage,
  head: () => ({ meta: pageMeta(STATIC_PAGES.now.path) }),
})
