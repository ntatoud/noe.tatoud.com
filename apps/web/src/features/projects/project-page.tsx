import type { Project, ProjectDetail } from '@ntatoud/content'

import { DetailPage, ExternalLinkButton } from '@/components/detail-page'
import { MoreSection } from '@/components/more-section'
import { SayHello } from '@/components/say-hello'
import { ProjectCard, ProjectKindChip } from '@/features/projects/project-card'
import { ProjectCta } from '@/features/projects/project-cta'
import { sharedElement } from '@/lib/view-transition'

type ProjectPageProps = {
  project: ProjectDetail
  moreProjects: readonly Project[]
}

export function ProjectPage({ project, moreProjects }: ProjectPageProps) {
  return (
    <DetailPage
      slot="project"
      back={{ to: '/projects', label: 'Projects' }}
      title={project.title}
      titleTransition={sharedElement('title', 'projects', project.slug, 'page')}
      badge={<ProjectKindChip kind={project.kind} />}
      description={project.description}
      tags={project.tags}
      html={project.html}
      footer={
        <>
          {project.cta ? (
            <ProjectCta {...project.cta} />
          ) : (
            <SayHello
              title="Curious about this project?"
              subject={`About ${project.title}`}
              className="mt-16"
            >
              <p>
                Tried {project.title}, found a bug, or have an idea for it? Tell
                me.
              </p>
            </SayHello>
          )}
          {moreProjects.length > 0 && (
            <MoreSection title="More projects" slot="more-projects">
              {moreProjects.map((other) => (
                <ProjectCard key={other.slug} project={other} />
              ))}
            </MoreSection>
          )}
        </>
      }
    >
      {(project.url || project.repo) && (
        <div className="mt-6 flex flex-wrap gap-3">
          {project.url && (
            <ExternalLinkButton href={project.url}>Website</ExternalLinkButton>
          )}
          {project.repo && (
            <ExternalLinkButton href={project.repo}>
              Repository
            </ExternalLinkButton>
          )}
        </div>
      )}
    </DetailPage>
  )
}
