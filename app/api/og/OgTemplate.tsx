import { OgParams, CATEGORY_STYLES, DEFAULT_STYLE } from './ogConfig'

export function OgTemplate({ title, description, category }: OgParams) {
  const style = category ? CATEGORY_STYLES[category] : DEFAULT_STYLE
  const { accent, badge } = style

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        background: '#0A0A0F',
        fontFamily: 'sans-serif',
        padding: '64px 72px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent glow top-left */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          left: -120,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: accent,
          opacity: 0.15,
          filter: 'blur(80px)',
        }}
      />

      {/* Grid texture lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${accent}18 1px, transparent 1px), linear-gradient(90deg, ${accent}18 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Top bar: logo + badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}
          >
            📸
          </div>
          <span style={{ color: '#ffffff', fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px' }}>
            ImageSnap
          </span>
        </div>

        {badge ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: `${accent}22`,
              border: `1px solid ${accent}55`,
              borderRadius: 8,
              padding: '6px 16px',
              color: accent,
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {badge}
          </div>
        ) : null}
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', position: 'relative', gap: 20 }}>
        <div
          style={{
            color: '#ffffff',
            fontSize: title.length > 60 ? 44 : 52,
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-1px',
            maxWidth: 960,
          }}
        >
          {title}
        </div>

        {description && (
          <div
            style={{
              color: '#94a3b8',
              fontSize: 22,
              lineHeight: 1.5,
              maxWidth: 860,
            }}
          >
            {description.length > 120 ? description.slice(0, 117) + '...' : description}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          borderTop: `1px solid #ffffff18`,
          paddingTop: 20,
        }}
      >
        <span style={{ color: '#64748b', fontSize: 16 }}>imagesnap.cloud</span>
        <div
          style={{
            width: 48,
            height: 3,
            borderRadius: 4,
            background: accent,
          }}
        />
      </div>
    </div>
  )
}
