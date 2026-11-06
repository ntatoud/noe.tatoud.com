import type { ProjectDetail } from '@ntatoud/content'

import { DetailPage, ExternalLinkButton } from '@/components/detail-page'
import { SayHello } from '@/components/say-hello'
import { ProjectKindChip } from '@/features/projects/project-card'
import { ProjectCta } from '@/features/projects/project-cta'

type ProjectPageProps = {
  project: ProjectDetail
}

export function ProjectPage({ project }: ProjectPageProps) {
  return (
    <DetailPage
      slot="project"
      back={{ to: '/projects', label: 'Projects' }}
      title={project.title}
      badge={<ProjectKindChip kind={project.kind} />}
      description={project.description}
      tags={project.tags}
      html={project.html}
      footer={
        project.cta ? (
          <ProjectCta {...project.cta} />
        ) : (
          <SayHello
            title="Curious about this project?"
            subject={`About ${project.title}`}
            className="mt-16"
          >
            <p>
              Questions, ideas or feedback on {project.title} are always
              welcome.
            </p>
          </SayHello>
        )
      }
    >
      <div className="mt-4 flex gap-4">
        {project.url && (
          <ExternalLinkButton href={project.url}>Website</ExternalLinkButton>
        )}
        {project.repo && (
          <ExternalLinkButton href={project.repo}>
            Repository
          </ExternalLinkButton>
        )}
      </div>
    </DetailPage>
  )
}
