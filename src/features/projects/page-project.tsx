import browserCollections from 'fumadocs-mdx:collections/browser'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock'
import { Suspense } from 'react'
import type { ComponentProps } from 'react'
import { CardTags } from '@/components/ui/card-list'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PixelExternalLink, PixelSourceCode } from '@/components/icons'
import { Hero, HeroTitle } from '@/layout/hero'
import {
  ProjectCta,
  ProjectInlineLink,
  ProjectLinks,
  ProjectLinkItem,
} from '@/features/projects/project-cta'

const mdxComponents = {
  ...defaultMdxComponents,
  pre: (props: ComponentProps<'pre'>) => (
    <div className="relative my-4 bg-border [filter:drop-shadow(4px_4px_0_var(--shelf-card))] clip-pixel-lg before:absolute before:inset-[2px] before:-z-10 before:bg-card before:content-[''] before:clip-pixel-lg">
      <CodeBlock
        {...props}
        className="!my-0 !rounded-none !border-none !bg-transparent !shadow-none"
      >
        <Pre>{props.children}</Pre>
      </CodeBlock>
    </div>
  ),
  ProjectCta,
  ProjectInlineLink,
  ProjectLinks,
  ProjectLinkItem,
}

export const projectLoader = browserCollections.projects.createClientLoader({
  component({ frontmatter, default: MDX }) {
    return (
      <>
        <Hero className="pt-12 text-center">
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <CardTags tags={frontmatter.tags} />
          )}
          <div className="flex items-center gap-3">
            <HeroTitle className="text-3xl sm:text-4xl">
              {frontmatter.title}
            </HeroTitle>
            <Badge
              variant={
                frontmatter.kind === 'contribution' ? 'default' : 'secondary'
              }
            >
              {frontmatter.kind === 'contribution'
                ? 'Contribution'
                : 'Personal'}
            </Badge>
          </div>
          {frontmatter.description && (
            <p className="text-pretty text-muted-foreground">
              {frontmatter.description}
            </p>
          )}
          <div className="flex items-center gap-4">
            {frontmatter.url && (
              <Button
                nativeButton={false}
                render={
                  <a
                    href={frontmatter.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <PixelExternalLink className="size-4" />
                Visit
              </Button>
            )}
            {frontmatter.repo && (
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <a
                    href={frontmatter.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <PixelSourceCode className="size-4" />
                Source
              </Button>
            )}
          </div>
        </Hero>
        <article className="mx-auto prose w-full max-w-3xl px-4 py-6 *:mx-auto *:max-w-2xl sm:py-8 md:px-0">
          <MDX components={mdxComponents} />
        </article>
      </>
    )
  },
})

export function PageProject({ path }: { path: string }) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      {projectLoader.useContent(path)}
    </Suspense>
  )
}
