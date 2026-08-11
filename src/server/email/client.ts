import { Resend } from 'resend';

export type EmailSendResult = {
  data: unknown;
  error: { message?: string } | null;
};

export interface EmailSender {
  emails: {
    send: (
      payload: {
        from: string;
        to: string;
        subject: string;
        html: string;
        text: string;
        replyTo: string;
      },
      options: { idempotencyKey: string }
    ) => Promise<EmailSendResult>;
  };
}

export interface EmailConfig {
  resend: EmailSender;
  fromEmail: string;
  notificationEmail: string;
}

const DOMAIN_LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export function normalizeResendEmailDomain(value: string | undefined): string | null {
  if (!value) return null;
  const domain = value.trim().toLowerCase();
  if (domain.length > 253 || domain.includes('@') || domain.includes('://') || /[\s<>,"'\\/]/.test(domain)) {
    return null;
  }
  const labels = domain.split('.');
  if (labels.length < 2 || labels.some((label) => !DOMAIN_LABEL.test(label))) return null;
  return domain;
}

export function buildResendFromAddress(domain: string | undefined): string | null {
  const normalizedDomain = normalizeResendEmailDomain(domain);
  return normalizedDomain ? `Venkoi <notifications@${normalizedDomain}>` : null;
}

export function getEmailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = buildResendFromAddress(process.env.RESEND_EMAIL_DOMAIN);
  const notificationEmail = process.env.LEADS_NOTIFICATION_EMAIL;

  if (!apiKey || !fromEmail || !notificationEmail) {
    return null;
  }

  return {
    resend: new Resend(apiKey),
    fromEmail,
    notificationEmail
  };
}
