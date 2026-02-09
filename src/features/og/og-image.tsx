import type { loadOgSearchParams } from '@/features/og/search-params'

export type OgImageProps = Awaited<ReturnType<typeof loadOgSearchParams>>

// TODO: Fix the styling later
export function OgImage({
  title,
  description,
  author,
  tags,
  hero,
}: OgImageProps) {
  return (
    <div
      tw="flex h-full w-full flex-col justify-between p-16"
      style={{ backgroundColor: '#1a2e28', fontFamily: 'Geist' }}
    >
      {/* Hero background */}
      {hero && (
        <img
          src={hero}
          tw="absolute inset-0 h-full w-full"
          style={{ objectFit: 'cover', opacity: 0.25 }}
        />
      )}

      {/* Accent bar */}
      <div
        tw="absolute left-0 top-0 h-full w-2"
        style={{ backgroundColor: '#3ec98b' }}
      />

      {/* Top: site branding */}
      <div tw="flex items-center">
        <div
          tw="text-2xl font-bold tracking-tight"
          style={{ color: '#3ec98b' }}
        >
          noe.tatoud.com
        </div>
        <div tw="ml-3 text-xl" style={{ color: '#a8b8b0' }}>
          / blog
        </div>
      </div>

      {/* Middle: title + description */}
      <div tw="flex flex-col">
        <div
          tw="text-6xl font-bold leading-tight tracking-tight"
          style={{ color: '#eef0ed' }}
        >
          {title.length > 80 ? title.slice(0, 80) + '...' : title}
        </div>
        {description && (
          <div tw="mt-6 text-2xl leading-relaxed" style={{ color: '#a8b8b0' }}>
            {description.length > 140
              ? description.slice(0, 140) + '...'
              : description}
          </div>
        )}
      </div>

      {/* Bottom: tags + author */}
      <div tw="flex items-center justify-between">
        <div tw="flex items-center">
          {tags?.slice(0, 4).map((tag) => (
            <div
              key={tag}
              tw="mr-3 flex rounded-full px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: '#3a4a45', color: '#3ec98b' }}
            >
              {tag}
            </div>
          ))}
        </div>
        {author && (
          <div tw="text-xl font-medium" style={{ color: '#a8b8b0' }}>
            {author}
          </div>
        )}
      </div>
    </div>
  )
}
