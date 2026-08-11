import { Text } from 'react-email';
import { EmailLayout, emailStyles } from './EmailLayout';

export type InternalEmailField = { label: string; value: string };

export function InternalLeadNotificationEmail({ subjectTag, fields }: { subjectTag: string; fields: InternalEmailField[] }) {
  return (
    <EmailLayout locale="en" preview={`New Venkoi lead: ${subjectTag}`} heading={subjectTag}>
      <Text style={emailStyles.paragraph}>A new lead has been persisted and is ready for review.</Text>
      {fields.map((field) => (
        <div key={field.label}>
          <Text style={emailStyles.label}>{field.label}</Text>
          <Text style={emailStyles.value}>{field.value}</Text>
        </div>
      ))}
    </EmailLayout>
  );
}
