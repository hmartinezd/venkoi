import { getDb } from '../db/client';
import type { LeadRecord, LeadType } from './types';
import type { ValidatedLeadPayload } from './validation';
import { randomBytes } from 'crypto';

function generateLeadId(): string {
  const hex = randomBytes(8).toString('hex');
  return `lead_${Date.now().toString(36)}_${hex}`;
}

export async function createLead(payload: ValidatedLeadPayload): Promise<LeadRecord> {
  const leadId = generateLeadId();
  const createdAt = new Date().toISOString();

  // Resolve composite name or first/last
  const fullName = payload.name
    ? payload.name
    : [payload.first_name, payload.last_name].filter(Boolean).join(' ') || null;

  const leadRecord: LeadRecord = {
    id: leadId,
    lead_type: payload.lead_type as LeadType,
    product: payload.product ?? null,
    first_name: payload.first_name ?? null,
    last_name: payload.last_name ?? null,
    name: fullName,
    email: payload.email,
    phone: payload.phone ?? null,
    company: payload.company ?? null,
    location_count: payload.location_count ?? null,
    current_system: payload.current_system ?? null,
    interest: payload.interest ?? null,
    project_stage: payload.project_stage ?? null,
    message: payload.message ?? null,
    early_access_interest: Boolean(payload.early_access_interest),
    locale: payload.locale ?? 'en',
    source_path: payload.source_path ?? null,
    utm_source: payload.utm_source ?? null,
    utm_medium: payload.utm_medium ?? null,
    utm_campaign: payload.utm_campaign ?? null,
    utm_content: payload.utm_content ?? null,
    referrer: payload.referrer ?? null,
    status: 'NEW',
    created_at: createdAt
  };

  const sql = getDb();
  if (!sql) {
    console.error('[DB Client] DATABASE_URL is missing or invalid. Lead persistence aborted.');
    throw new Error('DATABASE_UNAVAILABLE');
  }


  await sql`
    INSERT INTO leads (
      id,
      lead_type,
      product,
      first_name,
      last_name,
      name,
      email,
      phone,
      company,
      location_count,
      current_system,
      interest,
      project_stage,
      message,
      early_access_interest,
      locale,
      source_path,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      referrer,
      status,
      created_at
    ) VALUES (
      ${leadRecord.id},
      ${leadRecord.lead_type},
      ${leadRecord.product},
      ${leadRecord.first_name},
      ${leadRecord.last_name},
      ${leadRecord.name},
      ${leadRecord.email},
      ${leadRecord.phone},
      ${leadRecord.company},
      ${leadRecord.location_count},
      ${leadRecord.current_system},
      ${leadRecord.interest},
      ${leadRecord.project_stage},
      ${leadRecord.message},
      ${leadRecord.early_access_interest},
      ${leadRecord.locale},
      ${leadRecord.source_path},
      ${leadRecord.utm_source},
      ${leadRecord.utm_medium},
      ${leadRecord.utm_campaign},
      ${leadRecord.utm_content},
      ${leadRecord.referrer},
      ${leadRecord.status},
      ${leadRecord.created_at}
    )
  `;

  console.log(`Lead ${leadId} persisted`);
  return leadRecord;
}
