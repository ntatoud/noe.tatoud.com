import { useId } from 'react'

import type { TalkResource } from '@/features/talks/schemas'
import { cn } from '@/lib/utils'

const LABELS: Record<TalkResource['kind'], string> = {
  slides: 'View slides',
  docs: 'View docs',
  website: 'Open website',
}

/**
 * SVG clipPath that reproduces clip-pixel-lg as a union of rectangles.
 * Uses calc() in SVG length attributes (supported in all modern browsers)
 * so the corners stay at exactly 6 CSS pixels regardless of frame size.
 *
 * Why SVG instead of CSS clip-path? Iframes render on their own compositor
 * layer and ignore CSS clip-path / overflow:hidden from ancestors. SVG
 * clipPath applied to a <foreignObject> works at the SVG render stage,
 * which DOES clip the iframe.
 */
function PixelLgClipPath({ id }: { id: string }) {
  return (
    <defs>
      <clipPath id={id}>
        <rect x="6" y="0" width="calc(100% - 12px)" height="1" />
        <rect x="4" y="1" width="calc(100% - 8px)" height="1" />
        <rect x="2" y="2" width="calc(100% - 4px)" height="2" />
        <rect x="1" y="4" width="calc(100% - 2px)" height="2" />
        <rect x="0" y="6" width="100%" height="calc(100% - 12px)" />
        <rect x="1" y="calc(100% - 6px)" width="calc(100% - 2px)" height="2" />
        <rect x="2" y="calc(100% - 4px)" width="calc(100% - 4px)" height="2" />
        <rect x="4" y="calc(100% - 2px)" width="calc(100% - 8px)" height="1" />
        <rect x="6" y="calc(100% - 1px)" width="calc(100% - 12px)" height="1" />
      </clipPath>
    </defs>
  )
}

function FrameContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative aspect-video bg-border clip-pixel-lg',
        'pixel-shadow pixel-shadow-card pixel-shadow-x-4',
        className,
      )}
    >
      {/* Inner surface — own clip-pixel-lg + overflow-hidden so contents
          (incl. iframes) are clipped to the pixel shape, same pattern as
          CardImage in src/components/ui/card-list.tsx. */}
      <div className="absolute inset-0.5 overflow-hidden bg-card clip-pixel-lg">
        {children}
      </div>
    </div>
  )
}

function FramePlaceholder({ title }: { title?: string }) {
  return (
    <FrameContainer>
      {/* Fake slide chrome */}
      <div className="absolute inset-x-0 top-0 flex h-5 items-center gap-1.5 border-b border-border/30 bg-muted/50 px-3">
        <span className="size-1.5 rounded-none bg-border/60" />
        <span className="size-1.5 rounded-none bg-border/60" />
        <span className="size-1.5 rounded-none bg-border/60" />
      </div>

      {/* Dot-grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 pt-5">
        {title && (
          <p className="line-clamp-2 text-center font-head text-sm font-semibold tracking-wide text-foreground/20 uppercase sm:text-base">
            {title}
          </p>
        )}
        <p className="font-mono text-xs tracking-widest text-muted-foreground/40 uppercase">
          Coming soon
        </p>
      </div>
    </FrameContainer>
  )
}

export function SlideFrame({
  resource,
  title,
}: {
  resource?: TalkResource
  title?: string
}) {
  const clipId = useId()

  if (!resource) {
    return <FramePlaceholder title={title} />
  }

  return (
    <FrameContainer>
      {/* SVG wraps the iframe inside <foreignObject>. The SVG clipPath
          actually clips the iframe (CSS clip-path on ancestors does not). */}
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <PixelLgClipPath id={clipId} />
        <foreignObject width="100%" height="100%" clipPath={`url(#${clipId})`}>
          <iframe
            src={resource.url}
            title={title ?? resource.kind}
            className="pointer-events-none h-full w-full border-0"
            // scrolling is deprecated but still the most reliable cross-browser
            // way to suppress the iframe's own scrollbar
            scrolling="no"
            allowFullScreen
          />
        </foreignObject>
      </svg>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-3 bottom-3 flex items-center gap-1.5 bg-card/80 px-3 py-1.5 font-mono text-xs tracking-widest text-muted-foreground uppercase backdrop-blur-sm transition-colors clip-pixel hover:text-foreground"
      >
        {LABELS[resource.kind]} →
      </a>
    </FrameContainer>
  )
}
