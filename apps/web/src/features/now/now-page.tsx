import { SayHello } from '@/components/say-hello'
import { formatDate } from '@/lib/format'

import { NOW, NOW_UPDATED } from './now'

export function NowPage() {
  return (
    <main
      id="main"
      className="mx-auto w-full max-w-2xl px-4 pt-12 pb-20 sm:pt-16"
      data-slot="now-page"
    >
      <h1 className="text-4xl tracking-tight sm:text-5xl">Now</h1>
      <p className="mt-4 text-lg text-pretty text-muted-foreground">
        What I am up to these days. Updated{' '}
        <time dateTime={NOW_UPDATED} className="text-foreground">
          {formatDate(NOW_UPDATED)}
        </time>
        .
      </p>
      <dl className="mt-10 flex flex-col gap-8">
        {NOW.map((entry) => (
          <div key={entry.heading} className="flex flex-col gap-2">
            <dt className="font-serif text-2xl">{entry.heading}</dt>
            <dd className="max-w-xl text-lg/relaxed text-pretty">
              {entry.body}
            </dd>
          </div>
        ))}
      </dl>
      <SayHello
        title="Doing something similar?"
        className="mt-16"
        subject="Your /now page"
      >
        <p>
          If any of this overlaps with what you are working on or wondering
          about, I would like to compare notes.
        </p>
      </SayHello>
    </main>
  )
}
