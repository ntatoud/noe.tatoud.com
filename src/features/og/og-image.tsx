import type { loadOgSearchParams } from '@/features/og/search-params'

export type OgImageProps = Awaited<ReturnType<typeof loadOgSearchParams>>

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
      style={{ backgroundColor: '#000000', fontFamily: 'Geist' }}
    >
      {/* Pink tinted overlay */}
      <div
        tw="absolute inset-0"
        style={{ backgroundColor: '#FFB8F2', opacity: 0.06 }}
      />

      {/* Hero background */}
      {hero && (
        <img
          src={hero}
          tw="absolute inset-0 h-full w-full"
          style={{ objectFit: 'cover', opacity: 0.2 }}
        />
      )}

      {/* Accent bar — gradient from primary blue to accent pink */}
      <div
        tw="absolute left-0 top-0 h-full w-2"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #00D1FF, #FFB8F2)',
        }}
      />

      {/* Top: site branding */}
      <div tw="flex items-center">
        <div
          tw="text-2xl font-bold tracking-tight"
          style={{ color: '#00D1FF' }}
        >
          noe.tatoud.com
        </div>
        <div tw="ml-3 text-xl" style={{ color: '#DEDEDE' }}>
          / blog
        </div>
      </div>

      {/* Middle: title + description */}
      <div tw="flex flex-col">
        <div
          tw="text-6xl font-bold leading-tight tracking-tight"
          style={{ color: '#FFFFFF' }}
        >
          {title.length > 80 ? title.slice(0, 80) + '...' : title}
        </div>
        {description && (
          <div tw="mt-6 text-2xl leading-relaxed" style={{ color: '#DEDEDE' }}>
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
              style={{ backgroundColor: '#1A1A1A', color: '#00D1FF' }}
            >
              {tag}
            </div>
          ))}
        </div>
        {author && (
          <div tw="text-xl font-medium" style={{ color: '#DEDEDE' }}>
            {author}
          </div>
        )}
      </div>
    </div>
  )
}
