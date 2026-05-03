import { Link } from '@tanstack/react-router'

import {
  Card,
  CardContent,
  CardFooter,
  CardTags,
  CardTitle,
} from '@/components/ui/card-list'
import type { StageItem } from '@/features/talks/get-stage'
import { formatDate } from '@/lib/format'
import { latestEvent } from '@/lib/stage'

export function StageList({ talks }: { talks: Array<StageItem> }) {
  if (talks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <span className="font-head text-8xl font-bold text-muted-foreground/20 select-none">
          ∅
        </span>
        <p className="text-pretty text-muted-foreground">
          No talks yet. Check back soon!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {talks.map((talk) => {
        const latest = latestEvent(talk.events)
        return (
          <Card key={talk.slug}>
            <Link
              to="/stage/$slug"
              params={{ slug: talk.slug }}
              className="flex h-full"
            >
              <CardContent>
                <CardTitle>{talk.title}</CardTitle>
                {talk.tags && talk.tags.length > 0 && (
                  <CardTags tags={talk.tags} />
                )}
                {latest && (
                  <CardFooter>
                    <span>{latest.event}</span>
                    <span className="text-muted-foreground/50">·</span>
                    <span className="text-muted-foreground/50">
                      {formatDate(latest.date)}
                    </span>
                  </CardFooter>
                )}
              </CardContent>
            </Link>
          </Card>
        )
      })}
    </div>
  )
}
