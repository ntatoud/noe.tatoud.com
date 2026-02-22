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
      style={{
        backgroundColor: '#000000',
        fontFamily: 'Geist Pixel',
        letterSpacing: '0.05em',
      }}
    >
      {/* Hero background */}
      {hero && (
        <img
          src={hero}
          tw="absolute inset-0 h-full w-full"
          style={{ objectFit: 'cover', opacity: 0.15 }}
        />
      )}

      {/* White accent bar — solid, pixel-style */}
      <div
        tw="absolute left-0 top-0 h-full w-2"
        style={{ backgroundColor: '#FFFFFF' }}
      />

      {/* Top: site branding */}
      <div tw="flex items-center">
        <div
          tw="text-2xl font-bold"
          style={{ color: '#FFFFFF', letterSpacing: '0.05em' }}
        >
          noe.tatoud.com
        </div>
        <div
          tw="ml-3 text-xl"
          style={{ color: '#666666', letterSpacing: '0.05em' }}
        >
          / blog
        </div>
      </div>

      {/* Middle: title + description */}
      <div tw="flex flex-col">
        <div
          tw="text-6xl font-bold leading-tight"
          style={{ color: '#FFFFFF', letterSpacing: '0.05em' }}
        >
          {title.length > 80 ? title.slice(0, 80) + '...' : title}
        </div>
        {description && (
          <div
            tw="mt-6 text-2xl leading-relaxed"
            style={{ color: '#999999', letterSpacing: '0.02em' }}
          >
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
              tw="mr-3 flex px-4 py-2 text-sm font-medium"
              style={{
                backgroundColor: '#1A1A1A',
                color: '#FFFFFF',
                border: '1px solid #333333',
                letterSpacing: '0.05em',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        {author && (
          <div
            tw="text-xl font-medium"
            style={{ color: '#999999', letterSpacing: '0.05em' }}
          >
            {author}
          </div>
        )}
      </div>
    </div>
  )
}
