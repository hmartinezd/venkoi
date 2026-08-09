import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const socialCardSize = {
  width: 1200,
  height: 630
};

export const socialCardContentType = 'image/png';

export type SocialCardVariant = 'venkoi' | 'zaiko' | 'insights';

interface SocialCardOptions {
  locale: string;
  variant?: SocialCardVariant;
}

export async function generateSocialCardResponse({
  locale,
  variant = 'venkoi'
}: SocialCardOptions): Promise<ImageResponse> {
  const isSpanish = locale === 'es';

  // Read logo file as base64 for reliable standalone rendering in ImageResponse
  let logoBase64 = '';
  try {
    const logoBuffer = readFileSync(join(process.cwd(), 'public/brand/venkoi-logo-light.png'));
    logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  } catch {
    logoBase64 = '';
  }

  let eyebrow = '';
  let heading = '';
  let subheading = '';

  if (variant === 'zaiko') {
    eyebrow = 'ZAIKO BY VENKOI';
    heading = isSpanish
      ? 'Gestión de inventario para restaurantes.'
      : 'Restaurant inventory management.';
    subheading = isSpanish
      ? 'Inventario, compras, actividad y costos — en una sola imagen clara.'
      : 'Inventory, purchases, activity, and costs — in one clearer picture.';
  } else if (variant === 'insights') {
    eyebrow = isSpanish ? 'RECURSOS DE VENKOI' : 'VENKOI INSIGHTS';
    heading = isSpanish
      ? 'Guías prácticas para mejor software.'
      : 'Practical guides for better software.';
    subheading = isSpanish
      ? 'Aprendizaje sobre desarrollo de software, gestión de proyectos y tecnología empresarial.'
      : 'Insights on software development, project management, and business technology.';
  } else {
    eyebrow = isSpanish ? 'SOFTWARE DE VENKOI' : 'VENKOI SOFTWARE';
    heading = isSpanish
      ? 'Software que impulsa tu empresa hacia adelante.'
      : 'Software that moves business forward.';
    subheading = isSpanish
      ? 'Productos de software y servicios de desarrollo a medida diseñados para el mundo real.'
      : 'Software products and custom development services built for the real world.';
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#14161C', // Branded Ink
          backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(248, 77, 37, 0.08) 0%, transparent 45%)',
          padding: '80px 100px',
          boxSizing: 'border-box',
          fontFamily: 'sans-serif'
        }}
      >
        {/* Top Header / Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '2px', // Slightly squared for modern look
              backgroundColor: '#F84D25' // Branded Orange
            }}
          />
          <span
            style={{
              color: '#F84D25',
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase'
            }}
          >
            {eyebrow}
          </span>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
          <div
            style={{
              color: '#F7F8FA', // Branded Off White
              fontSize: '64px',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}
          >
            {heading}
          </div>
          <div
            style={{
              color: 'rgba(247, 248, 250, 0.6)',
              fontSize: '28px',
              fontWeight: 400,
              lineHeight: 1.4,
              maxWidth: '800px'
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
            borderTop: '1px solid rgba(247, 248, 250, 0.1)',
            paddingTop: '40px'
          }}
        >
          {logoBase64 ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logoBase64}
              alt="Venkoi"
              style={{
                height: '42px',
                width: 'auto'
              }}
            />
          ) : (
            <div style={{ color: '#F7F8FA', fontSize: '24px', fontWeight: 800 }}>VENKOI</div>
          )}

          <div
            style={{
              color: 'rgba(247, 248, 250, 0.4)',
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '0.05em'
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
