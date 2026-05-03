import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { allTalks } from 'content-collections'

import { PageError } from '@/components/page-error'
import type { Talk } from '@/features/talks/get-talks'
import { PageTalk } from '@/features/talks/page-talk'

const getTalk = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(({ data: slug }): Talk => {
    const talk = allTalks.find((t) => t._meta.path === slug)
    if (!talk) throw notFound()
    return {
      slug,
      title: talk.title,
      description: talk.description,
      kind: talk.kind,
      resource: talk.resource,
      tags: talk.tags,
      events: talk.events,
    }
  })

export const Route = createFileRoute('/stage/$slug')({
  component: Page,
  notFoundComponent: () => (
    <PageError
      code="404"
      title="Talk not found"
      description="This talk doesn't exist or has been removed."
    />
  ),
  loader: ({ params }) => getTalk({ data: params.slug }),
})

function Page() {
  const talk = Route.useLoaderData()
  return <PageTalk talk={talk} />
}
