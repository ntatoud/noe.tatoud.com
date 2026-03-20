import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { useHotkey } from '@tanstack/react-hotkeys'
import type { Project } from '@/features/projects/get-projects'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardTags,
  CardTitle,
} from '@/components/ui/card-list'
import { cn } from '@/lib/utils'

export function ProjectsList({
  projects,
  enableKeyboardNav = false,
}: {
  projects: Array<Project>
  enableKeyboardNav?: boolean
}) {
  const listRef = useRef<HTMLDivElement>(null)

  useHotkey(
    'J',
    () => {
      const links = listRef.current?.querySelectorAll<HTMLAnchorElement>('a')
      if (!links?.length) return
      const current = Array.from(links).findIndex(
        (link) => link === document.activeElement,
      )
      const next = current < links.length - 1 ? current + 1 : 0
      links[next].focus()
    },
    { enabled: enableKeyboardNav },
  )

  useHotkey(
    'K',
    () => {
      const links = listRef.current?.querySelectorAll<HTMLAnchorElement>('a')
      if (!links?.length) return
      const current = Array.from(links).findIndex(
        (link) => link === document.activeElement,
      )
      const prev = current > 0 ? current - 1 : links.length - 1
      links[prev].focus()
    },
    { enabled: enableKeyboardNav },
  )

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <span className="font-head text-8xl font-bold text-muted-foreground/20 select-none">
          ∅
        </span>
        <p className="text-pretty text-muted-foreground">
          No projects yet. Check back soon!
        </p>
      </div>
    )
  }

  return (
    <div ref={listRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {projects.map((project) => (
        <Card
          key={project.slug}
          className={cn(
            'border-t-2',
            project.kind === 'contribution'
              ? 'border-t-primary'
              : 'border-t-accent',
          )}
        >
          <Link
            to="/projects/$"
            params={{ _splat: project.slug }}
            className="flex h-full"
          >
            <CardContent>
              <div className="flex items-center gap-3">
                <CardTitle>{project.title}</CardTitle>
                <Badge
                  variant={
                    project.kind === 'contribution' ? 'default' : 'secondary'
                  }
                >
                  {project.kind === 'contribution'
                    ? 'Contribution'
                    : 'Personal'}
                </Badge>
              </div>
              {project.description && (
                <CardDescription>{project.description}</CardDescription>
              )}
              {project.tags && project.tags.length > 0 && (
                <CardTags tags={project.tags} />
              )}
            </CardContent>
          </Link>
        </Card>
      ))}
      {enableKeyboardNav && (
        <p className="col-span-full flex items-center justify-center gap-2 font-mono text-xs text-muted-foreground/50">
          <kbd className="border border-border bg-muted px-1.5 py-0.5">J</kbd>
          <kbd className="border border-border bg-muted px-1.5 py-0.5">K</kbd>
          <span>to navigate</span>
        </p>
      )}
    </div>
  )
}
