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

export function ProjectsList({ projects }: { projects: Array<Project> }) {
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
          <CardContent>
            <div className="flex items-center gap-3">
              <CardTitle>{project.title}</CardTitle>
              <Badge
                variant={
                  project.kind === 'contribution' ? 'default' : 'secondary'
                }
              >
                {project.kind === 'contribution' ? 'Contribution' : 'Personal'}
              </Badge>
            </div>
            {project.description && (
              <CardDescription>{project.description}</CardDescription>
            )}
            {project.tags && project.tags.length > 0 && (
              <CardTags tags={project.tags} />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
