import { Section, Text } from 'react-email';
import { EmailLayout, emailStyles } from './EmailLayout';

export type AcknowledgementTemplateCopy = {
  locale: 'en' | 'es';
  preview: string;
  heading: string;
  greeting: string;
  confirmation: string;
  offer?: string;
  nextHeading: string;
  nextText: string;
  replyNote: string;
};

export function UserAcknowledgementEmail({ copy }: { copy: AcknowledgementTemplateCopy }) {
  return (
    <EmailLayout locale={copy.locale} preview={copy.preview} heading={copy.heading}>
      <Text style={emailStyles.paragraph}>{copy.greeting}</Text>
      <Text style={emailStyles.paragraph}>{copy.confirmation}</Text>
      {copy.offer ? <Section style={emailStyles.callout}><Text style={{ ...emailStyles.paragraph, margin: 0 }}>{copy.offer}</Text></Section> : null}
      <Text style={{ ...emailStyles.paragraph, fontWeight: 700, marginTop: '24px', marginBottom: '6px' }}>{copy.nextHeading}</Text>
      <Text style={emailStyles.paragraph}>{copy.nextText}</Text>
      <Text style={{ ...emailStyles.paragraph, color: '#5C6470', marginBottom: 0 }}>{copy.replyNote}</Text>
    </EmailLayout>
  );
}
