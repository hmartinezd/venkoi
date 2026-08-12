import { render } from 'react-email';
import { getProductBySlug, type Product } from '@/lib/products';
import { getEmailConfig, type EmailConfig } from './client';
import { InternalLeadNotificationEmail, type InternalEmailField } from './templates/InternalLeadNotificationEmail';
import { UserAcknowledgementEmail, type AcknowledgementTemplateCopy } from './templates/UserAcknowledgementEmail';
import type { LeadRecord } from '../leads/types';

export type LeadEmailContent = { subject: string; text: string };
export type LeadProductResolver = (slug: string) => Pick<Product, 'name' | 'earlyAccess'> | undefined;

function resolveProduct(lead: LeadRecord, resolver: LeadProductResolver) {
  return lead.product ? resolver(lead.product) : undefined;
}

function subjectTagForLead(lead: LeadRecord, resolver: LeadProductResolver): string {
  if (lead.lead_type === 'DEMO') {
    const product = resolveProduct(lead, resolver);
    const productName = product?.name ?? lead.product ?? 'Product';
    return lead.early_access_interest
      ? `${productName} Access Request`
      : `${productName} Demo`;
  }
  if (lead.lead_type === 'CUSTOM_PROJECT') {
    if (lead.interest === 'mobile') return 'Mobile Application Inquiry';
    if (lead.interest === 'web' || lead.interest === 'website' || lead.interest === 'web_application') return 'Web Project Inquiry';
    return 'Services Inquiry';
  }
  return 'General Inquiry';
}

export function getInternalEmailFields(lead: LeadRecord, resolver: LeadProductResolver = getProductBySlug): InternalEmailField[] {
  const product = resolveProduct(lead, resolver);
  const fullName = lead.name || [lead.first_name, lead.last_name].filter(Boolean).join(' ');
  const optional: Array<[string, string | null | undefined]> = [
    ['Product', product?.name ?? lead.product],
    ['Access request', lead.early_access_interest ? 'Yes' : undefined],
    ['Name', fullName],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Company', lead.company],
    ['Number of locations', lead.location_count],
    ['Current system', lead.current_system],
    ['Service interest', lead.interest],
    ['Project stage', lead.project_stage],
    ['Message', lead.message],
    ['Locale', lead.locale],
    ['Source path', lead.source_path],
    ['UTM source', lead.utm_source],
    ['UTM medium', lead.utm_medium],
    ['UTM campaign', lead.utm_campaign],
    ['UTM content', lead.utm_content],
    ['Referrer', lead.referrer],
    ['Lead ID', lead.id],
    ['Created', lead.created_at]
  ];
  return [{ label: 'Lead type', value: lead.lead_type }, ...optional.filter((field): field is [string, string] => Boolean(field[1])).map(([label, value]) => ({ label, value }))];
}

export function buildInternalNotificationEmail(lead: LeadRecord, resolver: LeadProductResolver = getProductBySlug): LeadEmailContent {
  const subjectTag = subjectTagForLead(lead, resolver);
  const subject = `[Venkoi Lead] ${subjectTag} — ${lead.name || lead.first_name || lead.email}`;
  const details = getInternalEmailFields(lead, resolver).map(({ label, value }) => `${label}: ${value}`).join('\n');
  return { subject, text: `New lead received:\n\n${details}` };
}

export function buildAcknowledgementTemplateCopy(lead: LeadRecord, resolver: LeadProductResolver = getProductBySlug): AcknowledgementTemplateCopy {
  const isSpanish = lead.locale === 'es';
  const name = lead.first_name || lead.name || (isSpanish ? 'hola' : 'there');
  const product = resolveProduct(lead, resolver);
  const productName = product?.name ?? lead.product;
  const demo = lead.lead_type === 'DEMO';
  const accessRequest = demo && lead.early_access_interest;
  const heading = accessRequest
    ? isSpanish ? (productName ? `Solicitud de acceso a ${productName} recibida` : 'Solicitud de acceso recibida') : (productName ? `${productName} access request received` : 'Access request received')
    : demo
    ? isSpanish ? (productName ? `Solicitud de demo de ${productName} recibida` : 'Solicitud de demo recibida') : (productName ? `${productName} demo request received` : 'Demo request received')
    : isSpanish ? 'Mensaje recibido' : 'Message received';
  const confirmation = accessRequest
    ? isSpanish ? (productName ? `Recibimos tu solicitud de acceso a ${productName}.` : 'Recibimos tu solicitud de acceso.') : (productName ? `We received your request for access to ${productName}.` : 'We received your access request.')
    : demo
    ? isSpanish ? (productName ? `Recibimos tu solicitud para conocer mejor ${productName}.` : 'Recibimos tu solicitud de demo.') : (productName ? `We received your request to learn more about ${productName}.` : 'We received your demo request.')
    : isSpanish ? 'Recibimos tu mensaje y revisaremos la información que compartiste sobre tu proyecto.' : 'We received your message and will review the information you shared about your project.';
  const offer = accessRequest && product
    ? isSpanish
      ? `Los participantes aceptados pueden usar ${product.name} gratis durante ${product.earlyAccess.freeMonths} meses.`
      : `Accepted participants can use ${product.name} free for ${product.earlyAccess.freeMonths} months.`
    : undefined;
  return {
    locale: lead.locale,
    preview: isSpanish ? 'Venkoi recibió tu solicitud.' : 'Venkoi received your request.',
    heading,
    greeting: isSpanish ? `Gracias, ${name}.` : `Thanks, ${name}.`,
    confirmation,
    offer,
    nextHeading: isSpanish ? 'Qué sigue' : 'What happens next',
    nextText: accessRequest
      ? isSpanish ? 'Revisaremos tu solicitud y nos pondremos en contacto contigo para explicarte la disponibilidad y los próximos pasos. El acceso es limitado, por lo que la aceptación y los plazos no están garantizados.' : "We'll review your request and contact you about availability and next steps. Access is limited, so acceptance and timing aren't guaranteed."
      : demo
      ? isSpanish ? 'Nos pondremos en contacto para conocer más sobre tu restaurante y coordinar la demo.' : "We'll be in touch to learn more about your restaurant and help coordinate your demo."
      : isSpanish ? 'Revisaremos los detalles y nos pondremos en contacto contigo.' : "We'll review the details and be in touch.",
    replyNote: accessRequest
      ? isSpanish
        ? 'Si tienes alguna pregunta o quieres compartir algo más sobre tu solicitud de acceso, responde directamente a este correo.'
        : 'If you have any questions or want to share anything else about your access request, just reply to this email.'
      : demo
      ? isSpanish
        ? 'Si tienes alguna pregunta o quieres compartir algo más sobre tu solicitud de demo, responde directamente a este correo.'
        : 'If you have any questions or want to share anything else about your demo request, just reply to this email.'
      : isSpanish
        ? 'Si quieres agregar algún detalle o tienes alguna pregunta, responde directamente a este correo.'
        : "If you'd like to add any details or have a question, just reply to this email."
  };
}

export function buildUserAcknowledgementEmail(lead: LeadRecord, resolver: LeadProductResolver = getProductBySlug): LeadEmailContent {
  const copy = buildAcknowledgementTemplateCopy(lead, resolver);
  const productName = resolveProduct(lead, resolver)?.name ?? lead.product;
  const subject = lead.lead_type === 'DEMO' && lead.early_access_interest
    ? copy.locale === 'es' ? (productName ? `Recibimos tu solicitud de acceso a ${productName}` : 'Recibimos tu solicitud de acceso') : (productName ? `We received your ${productName} access request` : 'We received your access request')
    : lead.lead_type === 'DEMO'
    ? copy.locale === 'es' ? (productName ? `Recibimos tu solicitud de demo de ${productName}` : 'Recibimos tu solicitud de demo') : (productName ? `We received your ${productName} demo request` : 'We received your demo request')
    : copy.locale === 'es' ? 'Recibimos tu mensaje — Venkoi' : 'We received your message — Venkoi';
  const parts = [copy.greeting, copy.confirmation, copy.offer, `${copy.nextHeading}\n${copy.nextText}`, copy.replyNote].filter(Boolean);
  return { subject, text: parts.join('\n\n') };
}

export async function renderUserAcknowledgementHtml(lead: LeadRecord, resolver: LeadProductResolver = getProductBySlug): Promise<string> {
  return render(<UserAcknowledgementEmail copy={buildAcknowledgementTemplateCopy(lead, resolver)} />);
}

export async function renderInternalNotificationHtml(lead: LeadRecord, resolver: LeadProductResolver = getProductBySlug): Promise<string> {
  return render(<InternalLeadNotificationEmail subjectTag={subjectTagForLead(lead, resolver)} fields={getInternalEmailFields(lead, resolver)} />);
}

function assertResendSuccess(result: { error: { message?: string } | null }): void {
  if (result.error) throw new Error('Resend rejected the email request');
}

export async function sendInternalNotificationEmail(lead: LeadRecord, config: EmailConfig): Promise<void> {
  const content = buildInternalNotificationEmail(lead);
  const result = await config.resend.emails.send({ from: config.fromEmail, to: config.notificationEmail, ...content, html: await renderInternalNotificationHtml(lead), replyTo: lead.email }, { idempotencyKey: `venkoi-lead-internal/${lead.id}` });
  assertResendSuccess(result);
}

export async function sendUserAcknowledgementEmail(lead: LeadRecord, config: EmailConfig): Promise<void> {
  const content = buildUserAcknowledgementEmail(lead);
  const result = await config.resend.emails.send({ from: config.fromEmail, to: lead.email, ...content, html: await renderUserAcknowledgementHtml(lead), replyTo: config.notificationEmail }, { idempotencyKey: `venkoi-lead-ack/${lead.id}` });
  assertResendSuccess(result);
}

export async function sendLeadEmails(lead: LeadRecord, config: EmailConfig | null = getEmailConfig()): Promise<void> {
  if (!config) {
    console.warn(`[Email Service] Email delivery skipped for lead ${lead.id}: incomplete or invalid Resend environment configuration.`);
    return;
  }
  const deliveries = [
    { label: 'Internal notification', promise: sendInternalNotificationEmail(lead, config) },
    { label: 'User acknowledgement', promise: sendUserAcknowledgementEmail(lead, config) }
  ];
  const results = await Promise.allSettled(deliveries.map(({ promise }) => promise));
  results.forEach((result, index) => {
    if (result.status === 'rejected') console.error(`[Email Service] ${deliveries[index].label} email failed for lead ${lead.id}:`, result.reason instanceof Error ? result.reason.message : 'Email delivery failed');
  });
}
