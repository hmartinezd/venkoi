import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'react-email';
import type { ReactNode } from 'react';

const colors = {
  ink: '#14161C',
  orange: '#F84D25',
  offWhite: '#F7F8FA',
  white: '#FFFFFF',
  slate: '#5C6470',
  border: '#E5E7EB'
};

export function EmailLayout({
  locale,
  preview,
  heading,
  children
}: {
  locale: 'en' | 'es';
  preview: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <Html lang={locale}>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, backgroundColor: colors.offWhite, color: colors.ink, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 16px' }}>
          <Section style={{ backgroundColor: colors.ink, padding: '20px 28px', borderRadius: '10px 10px 0 0' }}>
            <Text style={{ color: colors.white, fontSize: '20px', fontWeight: 700, margin: 0 }}>Venkoi</Text>
          </Section>
          <Section style={{ backgroundColor: colors.white, border: `1px solid ${colors.border}`, borderTop: `4px solid ${colors.orange}`, padding: '28px', borderRadius: '0 0 10px 10px' }}>
            <Heading as="h1" style={{ color: colors.ink, fontSize: '26px', lineHeight: '34px', margin: '0 0 20px' }}>{heading}</Heading>
            {children}
            <Hr style={{ borderColor: colors.border, margin: '28px 0 20px' }} />
            <Text style={{ color: colors.slate, fontSize: '12px', lineHeight: '18px', margin: 0 }}>Venkoi</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const emailStyles = {
  paragraph: { color: colors.ink, fontSize: '16px', lineHeight: '25px', margin: '0 0 16px' },
  label: { color: colors.slate, fontSize: '12px', fontWeight: 700, lineHeight: '18px', margin: '14px 0 2px', textTransform: 'uppercase' as const },
  value: { color: colors.ink, fontSize: '15px', lineHeight: '23px', margin: 0, whiteSpace: 'pre-wrap' as const },
  callout: { backgroundColor: colors.offWhite, borderLeft: `4px solid ${colors.orange}`, padding: '16px 18px', margin: '22px 0' }
};
