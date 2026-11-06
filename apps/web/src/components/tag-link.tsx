import { Link } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'

type TagLinkProps = {
  tag: string
  current?: boolean
}

export function TagLink({ tag, current = false }: TagLinkProps) {
  return (
    <Link
      to="/blog"
      search={{ tag }}
      aria-current={current ? 'page' : undefined}
      className="inline-flex min-h-6 items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring aria-[current=page]:[&>span]:border-primary aria-[current=page]:[&>span]:text-foreground [&>span]:hover:border-primary [&>span]:hover:text-foreground"
    >
      <Badge variant="outline">{tag}</Badge>
    </Link>
  )
}
