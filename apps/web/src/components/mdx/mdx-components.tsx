import type { ComponentProps } from 'react'

import { Link } from '@tanstack/react-router'

import type { MDXComponents } from 'mdx/types'

import { resolveContentImage } from '@/lib/content-images'
import { cn } from '@/lib/utils'

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

/** Resolves content-relative image refs the same way hero images do. */
function MdxImage({ src, alt, ...props }: ComponentProps<'img'>) {
  const resolved =
    typeof src === 'string' ? (resolveContentImage(src) ?? src) : src
  return <img src={resolved} alt={alt ?? ''} loading="lazy" {...props} />
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
}
