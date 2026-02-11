import {
  Github01Icon,
  Linkedin01Icon,
  Mail01Icon,
  SourceCodeIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Grainient from '@/components/ui/grainient'
import { cn } from '@/lib/utils'

function FooterEdgeMask() {
  return (
    <>
      <svg className="absolute size-0" aria-hidden="true">
        <defs>
          <filter
            id="footer-edge-warp"
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.005 0.002"
              numOctaves="2"
              seed="7"
            />
            <feDisplacementMap
              in="SourceGraphic"
              scale="50"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="14" />
          </filter>
        </defs>
      </svg>
      <div
        className="pointer-events-none absolute -inset-x-6 -top-7 z-1 h-48 bg-[linear-gradient(to_bottom,oklch(0_0_0)_20%,oklch(0_0_0/0.5)_38%,oklch(0_0_0/0.15)_50%,oklch(0_0_0/0.03)_62%,oklch(0_0_0/0)_78%)]"
        style={{ filter: 'url(#footer-edge-warp)' }}
      />
    </>
  )
}

export function Footer() {
  return (
    <footer className="relative overflow-x-clip">
      <div className="absolute inset-0 z-0">
        <Grainient
          color1="#00D1FF"
          color2="#FFB8F2"
          color3="#00D1FF"
          timeSpeed={0.5}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0}
          grainScale={2}
          grainAnimated
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>
      <FooterEdgeMask />
      <div className="relative z-2 container mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 pt-24 pb-24 md:px-0 md:pb-12">
        <div className="flex flex-col items-center gap-4">
          <p className="font-head text-lg font-semibold tracking-tight">
            Let&apos;s connect
          </p>
          <div className="flex items-center gap-1">
            <FooterLink
              href="https://github.com/ntatoud"
              label="GitHub"
              icon={Github01Icon}
            />
            <FooterLink
              href="https://linkedin.com/in/noetatoud"
              label="LinkedIn"
              icon={Linkedin01Icon}
            />
            <FooterLink
              href="mailto:noe.tatoud@gmail.com"
              label="Email"
              icon={Mail01Icon}
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4 border-t border-muted-foreground pt-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <HugeiconsIcon icon={SourceCodeIcon} size={16} />
            <span>Built with React, TanStack & Tailwind</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Noe Tatoud. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({
  href,
  label,
  icon,
}: {
  href: string
  label: string
  icon: typeof Github01Icon
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        'group relative flex size-10 items-center justify-center',
        'text-muted-foreground',
        'transition-colors duration-200',
        'hover:text-primary',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      )}
    >
      <HugeiconsIcon icon={icon} size={22} />
      <span
        className={cn(
          'absolute -bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-primary',
          'transition-all duration-200',
          'group-hover:w-5',
        )}
      />
    </a>
  )
}
