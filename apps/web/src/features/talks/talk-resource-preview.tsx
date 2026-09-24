import { useRef } from 'react'

import type { StageResource } from '@ntatoud/content'

import {
  BookOpen01Icon,
  FullScreenIcon,
  Globe02Icon,
  LinkSquare02Icon,
  Presentation01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Button } from '@/components/ui/button'
import { ButtonAnchor } from '@/components/ui/button-link'
import { cn } from '@/lib/utils'

const KINDS = {
  slides: { label: 'Slides', icon: Presentation01Icon, frame: 'aspect-video' },
  docs: { label: 'Docs', icon: BookOpen01Icon, frame: 'aspect-[4/3]' },
  website: { label: 'Website', icon: Globe02Icon, frame: 'aspect-[4/3]' },
} satisfies Record<StageResource['kind'], unknown>

/**
 * A talk's slides, docs or website, embedded in a browser-like frame so it can
 * be browsed without leaving the page. Every resource must allow framing (no
 * `X-Frame-Options` / `frame-ancestors`), or the frame renders empty.
 */
export function TalkResourcePreview({ kind, url }: StageResource) {
  const frame = useRef<HTMLIFrameElement>(null)
  const { label, icon, frame: aspect } = KINDS[kind]
  const host = new URL(url).host

  return (
    <figure
      className="mt-8 overflow-hidden rounded-lg border border-border bg-card shadow-sm"
      data-slot="talk-resource"
    >
      <figcaption className="flex items-center gap-2 border-b border-border px-3 py-2">
        <HugeiconsIcon
          icon={icon}
          size={16}
          className="shrink-0 text-muted-foreground"
        />
        <span className="text-sm font-medium">{label}</span>
        <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
          {host}
        </span>
        {kind === 'slides' && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="View slides fullscreen"
            onClick={() => frame.current?.requestFullscreen()}
          >
            <HugeiconsIcon icon={FullScreenIcon} size={16} />
          </Button>
        )}
        <ButtonAnchor
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          size="sm"
        >
          Open
          <HugeiconsIcon
            icon={LinkSquare02Icon}
            size={16}
            data-icon="inline-end"
          />
        </ButtonAnchor>
      </figcaption>
      <iframe
        ref={frame}
        src={url}
        title={`${label}: ${host}`}
        loading="lazy"
        allow="fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        className={cn('block w-full bg-background', aspect)}
      />
    </figure>
  )
}
