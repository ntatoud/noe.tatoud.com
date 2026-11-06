import { Link } from '@tanstack/react-router'

import { SayHello } from '@/components/say-hello'
import { formatDate } from '@/lib/format'
import { inlineLink } from '@/lib/link-styles'
import { cn } from '@/lib/utils'

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
      <div className="mt-10 flex flex-col gap-8">
        {NOW.map((entry) => (
          <section key={entry.heading} className="flex flex-col gap-2">
            <h2 className="text-2xl">{entry.heading}</h2>
            <p className="max-w-xl text-lg/relaxed text-pretty">{entry.body}</p>
            {entry.source && (
              <Link
                to={entry.source.to}
                params={{ slug: entry.source.slug }}
                className={cn(inlineLink, 'self-start text-sm')}
              >
                {entry.source.label}
              </Link>
            )}
          </section>
        ))}
      </div>
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
