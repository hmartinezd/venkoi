import { getProductBySlug, type Product } from '@/lib/products';
import { getEmailConfig, type EmailConfig } from './client';
import type { LeadRecord } from '../leads/types';

export type LeadEmailContent = {
  subject: string;
  text: string;
};

export type LeadProductResolver = (slug: string) => Pick<Product, 'name'> | undefined;

function resolveLeadProductName(
  lead: LeadRecord,
  resolver: LeadProductResolver,
  genericName: string
): string {
  if (!lead.product) return genericName;
  return resolver(lead.product)?.name ?? lead.product;
}

export function buildInternalNotificationEmail(
  lead: LeadRecord,
  resolver: LeadProductResolver = getProductBySlug
): LeadEmailContent {
  let subjectTag = 'General Inquiry';
  if (lead.lead_type === 'DEMO') {
    const productName = resolveLeadProductName(lead, resolver, 'Product');
    subjectTag = lead.early_access_interest
      ? `${productName} Early Access Demo`
      : `${productName} Demo`;
  } else if (lead.lead_type === 'CUSTOM_PROJECT') {
    if (lead.interest === 'mobile') {
      subjectTag = 'Mobile Application Inquiry';
    } else if (lead.interest === 'web' || lead.interest === 'website' || lead.interest === 'web_application') {
      subjectTag = 'Web Project Inquiry';
    } else {
      subjectTag = 'Services Inquiry';
    }
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
    `UTM Content: ${lead.utm_content || 'N/A'}`,
    `Referrer: ${lead.referrer || 'N/A'}`,
    `Message:\n${lead.message || 'N/A'}`
  ].join('\n');

  return { subject, text: `New lead received:\n\n${detailsList}` };
}

export function buildUserAcknowledgementEmail(
  lead: LeadRecord,
  resolver: LeadProductResolver = getProductBySlug
): LeadEmailContent {
  const isSpanish = lead.locale === 'es';

  if (lead.lead_type === 'DEMO') {
    const greetingName = lead.first_name || lead.name || (isSpanish ? 'hola' : 'there');
    const productName = resolveLeadProductName(lead, resolver, isSpanish ? 'el producto' : 'the product');
    if (isSpanish) {
      const subject = `Recibimos tu solicitud de demo de ${productName}`;
      let text = `Gracias, ${greetingName}.\n\nRecibimos tu solicitud para conocer mejor ${productName}.\n\nNos pondremos en contacto contigo para conocer un poco más sobre tu restaurante y coordinar la demo.`;
      if (lead.early_access_interest) {
        text += `\n\nTambién hemos registrado tu interés en el acceso anticipado de ${productName}.`;
      }
      return { subject, text };
    }

    const subject = `We received your ${productName} demo request`;
    let text = `Thanks, ${greetingName}.\n\nWe received your request to learn more about ${productName}.\n\nWe'll be in touch to learn more about your restaurant and help coordinate your demo.`;
    if (lead.early_access_interest) {
      text += `\n\nWe've also noted your interest in ${productName} Early Access.`;
    }
    return { subject, text };
  }

  const greetingName = lead.name || lead.first_name || (isSpanish ? 'hola' : 'there');
  return isSpanish
    ? {
        subject: 'Recibimos tu mensaje — Venkoi',
        text: `Gracias, ${greetingName}.\n\nRecibimos tu mensaje y revisaremos la información que compartiste sobre tu proyecto.\n\nNos pondremos en contacto contigo.`
      }
    : {
        subject: 'We received your message — Venkoi',
        text: `Thanks, ${greetingName}.\n\nWe received your message and will review the information you shared about your project.\n\nWe'll be in touch.`
      };
}

export async function sendInternalNotificationEmail(lead: LeadRecord, config: EmailConfig): Promise<void> {
  const content = buildInternalNotificationEmail(lead);
  await config.resend.emails.send({
    from: config.fromEmail,
    to: config.notificationEmail,
    ...content
  });
}

export async function sendUserAcknowledgementEmail(lead: LeadRecord, config: EmailConfig): Promise<void> {
  const content = buildUserAcknowledgementEmail(lead);
  await config.resend.emails.send({
    from: config.fromEmail,
    to: lead.email,
    ...content
  });
}

export async function sendLeadEmails(lead: LeadRecord): Promise<void> {
  const config = getEmailConfig();
  if (!config) {
    console.warn(`[Email Service] Email delivery skipped for lead ${lead.id}: incomplete Resend environment configuration.`);
    return;
  }

  const deliveries = [
    { label: 'Internal notification', promise: sendInternalNotificationEmail(lead, config) },
    { label: 'User acknowledgement', promise: sendUserAcknowledgementEmail(lead, config) }
  ];
  const results = await Promise.allSettled(deliveries.map(({ promise }) => promise));

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(
        `[Email Service] ${deliveries[index].label} email failed for lead ${lead.id}:`,
        result.reason instanceof Error ? result.reason.message : 'Email delivery failed'
      );
    }
  });
}
