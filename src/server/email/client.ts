import { Resend } from 'resend';

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL || 'Venkoi <notifications@venkoi.com>';
}

export function getNotificationEmail(): string {
  return process.env.LEADS_NOTIFICATION_EMAIL || 'leads@venkoi.com';
}
