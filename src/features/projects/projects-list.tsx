import type { Project } from '@/features/projects/get-projects'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardList,
  CardTags,
  CardTitle,
} from '@/components/ui/card-list'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function ProjectsList({ projects }: { projects: Array<Project> }) {
  if (projects.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No projects yet. Check back soon!
      </p>
    )
  }

  return (
    <CardList>
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
            {(project.url || project.repo) && (
              <CardFooter className="gap-4">
                {project.url && (
                  <Button
                    variant="link"
                    nativeButton={false}
                    render={
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    Visit
                  </Button>
                )}
                {project.repo && (
                  <Button
                    variant="link"
                    nativeButton={false}
                    render={
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    Source
                  </Button>
                )}
              </CardFooter>
            )}
          </CardContent>
        </Card>
      ))}
    </CardList>
  )
}
