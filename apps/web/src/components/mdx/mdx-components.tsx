import type { ComponentProps } from 'react'

import { Link } from '@tanstack/react-router'

import type { MDXComponents } from 'mdx/types'

import { ProjectCta, ProjectInlineLink } from '@/features/projects/project-cta'
import { netlifyImageUrl } from '@/lib/netlify-image'
import { cn } from '@/lib/utils'

/** `width`/`height` come off the compiled MDX as either numbers or strings. */
function toDimension(value: number | string | undefined) {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  return undefined
}

function isExternalHref(href: string) {
  return /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')
}

/** Internal links (`/...`) navigate client-side; everything else stays `<a>`. */
function MdxLink({ href = '', children, ...props }: ComponentProps<'a'>) {
  if (href.startsWith('#') || isExternalHref(href)) {
    const external = isExternalHref(href)
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    )
  }
  return (
    <Link to={href} {...props}>
      {children}
    </Link>
  )
}

/**
 * Body image refs are already rewritten to `/content/...` URLs with stamped
 * dimensions server-side (ADR-0008); route them through the Netlify Image
 * CDN for responsive, format-negotiated delivery.
 */
function MdxImage({
  src,
  alt,
  width,
  height,
  ...props
}: ComponentProps<'img'>) {
  const resolved =
    typeof src === 'string'
      ? netlifyImageUrl(src, {
          width: toDimension(width),
          height: toDimension(height),
        })
      : src
  return (
    <img
      src={resolved}
      alt={alt ?? ''}
      width={width}
      height={height}
      loading="lazy"
      {...props}
    />
  )
}

/** Wraps `rehype-pretty-code` output; highlighting itself is server-baked. */
function MdxPre({ className, ...props }: ComponentProps<'pre'>) {
  return (
    <pre
      className={cn(
        'overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm',
        className,
      )}
      {...props}
    />
  )
}

/** Shared MDX component map (ADR-0007) for every rendered Document body. */
export const mdxComponents: MDXComponents = {
  a: MdxLink,
  img: MdxImage,
  pre: MdxPre,
  ProjectCta,
  ProjectInlineLink,
}
