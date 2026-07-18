import type { CSSProperties } from 'react'

import { OG_FONT_FAMILY } from '@/features/og/og-fonts'

/** Takumi's flowing-text clamp — not part of the standard CSSProperties type. */
type ClampStyle = CSSProperties & { lineClamp?: number }

const KIND_LABELS = {
  blog: 'Blog',
  project: 'Project',
  talk: 'Talk',
  experience: 'Experience',
} as const

export type OgCardKind = keyof typeof KIND_LABELS

export const OG_CARD_KINDS = Object.keys(KIND_LABELS) as OgCardKind[]

export type OgCardProps = {
  title: string
  description?: string
  kind?: OgCardKind
}

export function OgCard({ title, description, kind }: OgCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '64px',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: OG_FONT_FAMILY,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 28, color: 'rgba(255, 255, 255, 0.6)' }}>
          noe.tatoud.com
        </span>
        {kind && (
          <span
            style={{
              fontSize: 24,
              padding: '8px 20px',
              borderRadius: 999,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
            }}
          >
            {KIND_LABELS[kind]}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h1
          style={
            {
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineClamp: 3,
            } satisfies ClampStyle
          }
        >
          {title}
        </h1>
        {description && (
          <p
            style={
              {
                fontSize: 30,
                lineHeight: 1.4,
                margin: 0,
                color: 'rgba(255, 255, 255, 0.6)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineClamp: 2,
              } satisfies ClampStyle
            }
          >
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
