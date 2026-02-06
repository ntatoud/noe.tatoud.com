import type { Project } from '@/features/projects/get-projects'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardList,
  CardTags,
  CardTitle,
} from '@/components/ui/card-list'

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
        <Card key={project.slug}>
          <CardContent>
            <div className="flex items-center gap-3">
              <CardTitle>{project.title}</CardTitle>
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                {project.kind === 'contribution' ? 'Contribution' : 'Personal'}
              </span>
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
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    Visit
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    Source
                  </a>
                )}
              </CardFooter>
            )}
          </CardContent>
        </Card>
      ))}
    </CardList>
  )
}
