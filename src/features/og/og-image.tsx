import type { loadOgSearchParams } from '@/features/og/search-params'

export type OgImageProps = Awaited<ReturnType<typeof loadOgSearchParams>>

export function OgImage({
  title,
  description,
  author,
  tags,
  hero,
  avatar,
  section,
}: OgImageProps) {
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
        fontFamily: 'Geist Pixel',
        letterSpacing: '0.05em',
      }}
    >
      {/* Hero background */}
      {hero && (
        <img
          src={hero}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.15,
          }}
        />
      )}

      {/* White accent bar — solid, pixel-style */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '8px',
          backgroundColor: '#FFFFFF',
        }}
      />

      {/* Top: site branding */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            fontSize: '24px',
            fontWeight: 400,
            color: '#FFFFFF',
            letterSpacing: '0.05em',
          }}
        >
          noe.tatoud.com
        </div>
        {section && (
          <div
            style={{
              marginLeft: '12px',
              fontSize: '20px',
              color: '#666666',
              letterSpacing: '0.05em',
            }}
          >
            / {section}
          </div>
        )}
      </div>

      {/* Middle: title + description */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: '60px',
            fontWeight: 400,
            lineHeight: 1.25,
            color: '#FFFFFF',
            letterSpacing: '0.05em',
          }}
        >
          {title.length > 80 ? title.slice(0, 80) + '...' : title}
        </div>
        {description && (
          <div
            style={{
              marginTop: '24px',
              fontSize: '24px',
              lineHeight: 1.625,
              color: '#999999',
              letterSpacing: '0.02em',
            }}
          >
            {description.length > 140
              ? description.slice(0, 140) + '...'
              : description}
          </div>
        )}
      </div>

      {/* Bottom: tags + author */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {tags?.slice(0, 4).map((tag) => (
            <span
              key={tag}
              style={{
                marginRight: '12px',
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingTop: '6px',
                paddingBottom: '6px',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1,
                backgroundColor: '#1A1A1A',
                color: '#FFFFFF',
                border: '1px solid #333333',
                letterSpacing: '0.05em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        {(avatar || author) && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {avatar && (
              <img
                src={avatar}
                style={{
                  height: '48px',
                  width: '48px',
                  marginRight: '12px',
                  imageRendering: 'pixelated',
                }}
              />
            )}
            {author && (
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 400,
                  color: '#CCCCCC',
                  letterSpacing: '0.05em',
                }}
              >
                {author}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
