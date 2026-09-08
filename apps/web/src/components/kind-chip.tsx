import type { IconSvgElement } from '@hugeicons/react'
import { HugeiconsIcon } from '@hugeicons/react'

import { cn } from '@/lib/utils'

type Tone = 'moss' | 'honey'

const toneClasses: Record<Tone, string> = {
  moss: 'bg-moss-500/15 text-moss-700 dark:bg-moss-400/15 dark:text-moss-300',
  honey:
    'bg-honey-500/20 text-honey-800 dark:bg-honey-400/20 dark:text-honey-200',
}

type KindChipProps = {
  icon: IconSvgElement
  label: string
  tone: Tone
}

export function KindChip({ icon, label, tone }: KindChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-transform duration-200 ease-out group-hover:scale-105',
        toneClasses[tone],
      )}
      data-slot="kind-chip"
    >
      <HugeiconsIcon icon={icon} size={14} />
      {label}
    </span>
  )
}
