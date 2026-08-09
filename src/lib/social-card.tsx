import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const socialCardSize = {
  width: 1200,
  height: 630
};

export const socialCardContentType = 'image/png';

export async function generateSocialCardResponse(locale: string): Promise<ImageResponse> {
  const isSpanish = locale === 'es';

  // Read logo file as base64 for reliable standalone rendering in ImageResponse
  let logoBase64 = '';
  try {
    const logoBuffer = readFileSync(join(process.cwd(), 'public/brand/venkoi-logo-light.png'));
    logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  } catch {
    logoBase64 = '';
  }

  const eyebrow = isSpanish
    ? 'COMPAÑÍA DE SOFTWARE DE TAMPA BAY'
    : 'TAMPA BAY SOFTWARE COMPANY';

  const heading = isSpanish
    ? 'Software diseñado para la forma en que realmente funciona tu empresa.'
    : 'Software built for the way business actually works.';

  const subheading = isSpanish
    ? 'Productos de software, aplicaciones móviles, páginas web y aplicaciones web en Tampa Bay, South Florida y más allá.'
    : 'Software products, mobile applications, websites, and web applications in Tampa Bay, South Florida & beyond.';

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
          backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(248, 77, 37, 0.12) 0%, transparent 45%)',
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
              backgroundColor: '#F84D25'
            }}
          />
          <span
            style={{
              color: '#F84D25',
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
            <div />
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
      ...socialCardSize
    }
  );
}
