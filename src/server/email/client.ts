import { Resend } from 'resend';

export interface EmailConfig {
  resend: Resend;
  fromEmail: string;
  notificationEmail: string;
}

export function getEmailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
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

