import type { IconSvgElement } from '@hugeicons/react'
import { HugeiconsIcon } from '@hugeicons/react'

import { cn } from '@/lib/utils'

type Tone = 'clay' | 'olive'

const toneClasses: Record<Tone, string> = {
  clay: 'bg-clay-500/15 text-clay-700 dark:bg-clay-400/15 dark:text-clay-300',
  olive:
    'bg-olive-500/20 text-olive-800 dark:bg-olive-400/20 dark:text-olive-200',
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
