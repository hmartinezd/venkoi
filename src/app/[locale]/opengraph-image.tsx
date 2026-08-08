import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

export const alt = 'Venkoi | Software Products & Custom Development in Tampa Bay';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isSpanish = locale === 'es';

  // Read logo file as base64 for reliable standalone rendering in ImageResponse
  let logoBase64 = '';
  try {
    const logoBuffer = readFileSync(join(process.cwd(), 'public/brand/venkoi-logo-dark.png'));
    logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  } catch {
    logoBase64 = '';
  }

  const eyebrow = isSpanish
    ? 'EMPRESA DE SOFTWARE EN TAMPA BAY'
    : 'TAMPA BAY SOFTWARE COMPANY';

  const heading = isSpanish
    ? 'Software diseñado para la forma en que realmente funciona tu empresa.'
    : 'Software built for the way business actually works.';

  const subheading = isSpanish
    ? 'Productos de software y desarrollo a medida en Tampa Bay, South Florida y más allá.'
    : 'Software products and custom digital solutions in Tampa Bay, South Florida & beyond.';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0A0F1D',
          backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(255, 85, 0, 0.12) 0%, transparent 45%)',
          padding: '70px 90px',
          boxSizing: 'border-box',
          fontFamily: 'sans-serif'
        }}
      >
        {/* Top Header / Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#FF5500'
            }}
          />
          <span
            style={{
              color: '#FF5500',
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase'
            }}
          >
            {eyebrow}
          </span>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '980px' }}>
          <div
            style={{
              color: '#FFFFFF',
              fontSize: '52px',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em'
            }}
          >
            {heading}
          </div>
          <div
            style={{
              color: '#94A3B8',
              fontSize: '24px',
              fontWeight: 400,
              lineHeight: 1.4
            }}
          >
            {subheading}
          </div>
        </div>

        {/* Footer / Logo Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '32px'
          }}
        >
          {logoBase64 ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logoBase64}
              alt="Venkoi"
              style={{
                height: '46px',
                width: 'auto'
              }}
            />
          ) : (
            <div style={{ color: '#FFFFFF', fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em' }}>
              VENKOI
            </div>
          )}

          <div
            style={{
              color: '#64748B',
              fontSize: '16px',
              fontWeight: 500
            }}
          >
            venkoi.com
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
