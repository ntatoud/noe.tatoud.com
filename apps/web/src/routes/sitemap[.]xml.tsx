import { createFileRoute } from '@tanstack/react-router'

import { sitemapResponse } from '@/features/sitemap/sitemap'

export const Route = createFileRoute('/sitemap.xml')({
  server: { handlers: { GET: sitemapResponse } },
})
