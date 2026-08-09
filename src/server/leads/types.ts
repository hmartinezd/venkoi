export type LeadType = 'DEMO' | 'CUSTOM_PROJECT' | 'GENERAL_CONTACT';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'CLOSED';

export type LocationCountEnum = '1' | '2_5' | '6_20' | '20_plus';
export type CurrentSystemEnum = 'none' | 'spreadsheet' | 'pos_tools' | 'other';
export type InterestEnum = 'mobile' | 'website' | 'web_application' | 'unsure';
export type ProjectStageEnum = 'idea' | 'planning' | 'existing_product' | 'needs_improvement';

export interface LeadInput {
  lead_type: LeadType;
  product?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
  email: string;
  phone?: string | null;
  company?: string | null;
  location_count?: LocationCountEnum | string | null;
  current_system?: CurrentSystemEnum | string | null;
  interest?: InterestEnum | string | null;
  project_stage?: ProjectStageEnum | string | null;
  message?: string | null;
  early_access_interest?: boolean;
  locale: 'en' | 'es';
  source_path?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  referrer?: string | null;
  website?: string | null; // Honeypot field
}

export interface LeadRecord {
  id: string;
  lead_type: LeadType;
  product: string | null;
  first_name: string | null;
  last_name: string | null;
  name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  location_count: string | null;
  current_system: string | null;
  interest: string | null;
  project_stage: string | null;
  message: string | null;
  early_access_interest: boolean;
  locale: 'en' | 'es';
  source_path: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  referrer: string | null;
  status: LeadStatus;
  created_at: string;
}

