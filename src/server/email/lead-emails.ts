import { getEmailConfig, type EmailConfig } from './client';
import type { LeadRecord } from '../leads/types';

export async function sendInternalNotificationEmail(
  lead: LeadRecord,
  config: EmailConfig
): Promise<void> {
  let subjectTag = 'General Inquiry';
  if (lead.lead_type === 'DEMO') {
    subjectTag = lead.early_access_interest ? 'Zaiko Early Access Demo' : 'Zaiko Demo';
  } else if (lead.lead_type === 'CUSTOM_PROJECT') {
    subjectTag = 'Custom Software Inquiry';
  }

  const subject = `[Venkoi Lead] ${subjectTag} — ${lead.name || lead.first_name || lead.email}`;

  const detailsList = [
    `Lead ID: ${lead.id}`,
    `Type: ${lead.lead_type}`,
    `Product: ${lead.product || 'N/A'}`,
    `Name: ${lead.name || [lead.first_name, lead.last_name].filter(Boolean).join(' ') || 'N/A'}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || 'N/A'}`,
    `Company: ${lead.company || 'N/A'}`,
    `Location Count: ${lead.location_count || 'N/A'}`,
    `Current System: ${lead.current_system || 'N/A'}`,
    `Interest: ${lead.interest || 'N/A'}`,
    `Project Stage: ${lead.project_stage || 'N/A'}`,
    `Early Access Interest: ${lead.early_access_interest ? 'Yes' : 'No'}`,
    `Locale: ${lead.locale}`,
    `Source Path: ${lead.source_path || 'N/A'}`,
    `UTM Source: ${lead.utm_source || 'N/A'}`,
    `UTM Medium: ${lead.utm_medium || 'N/A'}`,
    `UTM Campaign: ${lead.utm_campaign || 'N/A'}`,
    `Referrer: ${lead.referrer || 'N/A'}`,
    `Message:\n${lead.message || 'N/A'}`
  ].join('\n');

  await config.resend.emails.send({
    from: config.fromEmail,
    to: config.notificationEmail,
    subject,
    text: `New lead received:\n\n${detailsList}`
  });
}

export async function sendUserAcknowledgementEmail(
  lead: LeadRecord,
  config: EmailConfig
): Promise<void> {
  const isSpanish = lead.locale === 'es';

  let subject = '';
  let body = '';

  if (lead.lead_type === 'DEMO') {
    const greetingName = lead.first_name || lead.name || (isSpanish ? 'hola' : 'there');
    if (isSpanish) {
      subject = 'Recibimos tu solicitud de demo de Zaiko';
      body = `Gracias, ${greetingName}.\n\nRecibimos tu solicitud para conocer mejor Zaiko.\n\nNos pondremos en contacto contigo para conocer un poco más sobre tu restaurante y coordinar la demo.`;
      if (lead.early_access_interest) {
        body += `\n\nTambién hemos registrado tu interés en el acceso anticipado de Zaiko.`;
      }
    } else {
      subject = 'We received your Zaiko demo request';
      body = `Thanks, ${greetingName}.\n\nWe received your request to learn more about Zaiko.\n\nWe'll be in touch to learn more about your restaurant and help coordinate your demo.`;
      if (lead.early_access_interest) {
        body += `\n\nWe've also noted your interest in Zaiko Early Access.`;
      }
    }
  } else {
    // CUSTOM_PROJECT or GENERAL_CONTACT
    const greetingName = lead.name || lead.first_name || (isSpanish ? 'hola' : 'there');
    if (isSpanish) {
      subject = 'Recibimos tu mensaje — Venkoi';
      body = `Gracias, ${greetingName}.\n\nRecibimos tu mensaje y revisaremos la información que compartiste sobre tu proyecto.\n\nNos pondremos en contacto contigo.`;
    } else {
      subject = 'We received your message — Venkoi';
      body = `Thanks, ${greetingName}.\n\nWe received your message and will review the information you shared about your project.\n\nWe'll be in touch.`;
    }
  }

  await config.resend.emails.send({
    from: config.fromEmail,
    to: lead.email,
    subject,
    text: body
  });
}

export async function sendLeadEmails(lead: LeadRecord): Promise<void> {
  const config = getEmailConfig();
  if (!config) {
    console.warn(`[Email Service] Email delivery skipped for lead ${lead.id}: incomplete Resend environment configuration.`);
    return;
  }

  const results = await Promise.allSettled([
    sendInternalNotificationEmail(lead, config),
    sendUserAcknowledgementEmail(lead, config)
  ]);

  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error(`[Email Service] Notification email failed for lead ${lead.id}:`, result.reason);
    }
  });
}

