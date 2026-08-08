import { z } from 'zod';
import type { LeadType } from './types';

const ALLOWED_LEAD_TYPES: [LeadType, ...LeadType[]] = ['DEMO', 'CUSTOM_PROJECT', 'GENERAL_CONTACT'];

const normalizeString = (val: unknown): string | null => {
  if (typeof val !== 'string') return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const leadSubmissionSchema = z
  .object({
    lead_type: z.enum(ALLOWED_LEAD_TYPES),
    product: z.preprocess(normalizeString, z.string().max(50).nullable().optional()),
    first_name: z.preprocess(normalizeString, z.string().max(100).nullable().optional()),
    last_name: z.preprocess(normalizeString, z.string().max(100).nullable().optional()),
    name: z.preprocess(normalizeString, z.string().max(200).nullable().optional()),
    email: z
      .string({ message: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Invalid email address')
      .max(255, 'Email is too long'),
    phone: z.preprocess(normalizeString, z.string().max(50).nullable().optional()),
    company: z.preprocess(normalizeString, z.string().max(200).nullable().optional()),
    location_count: z.preprocess(normalizeString, z.string().max(50).nullable().optional()),
    current_system: z.preprocess(normalizeString, z.string().max(100).nullable().optional()),
    interest: z.preprocess(normalizeString, z.string().max(100).nullable().optional()),
    project_stage: z.preprocess(normalizeString, z.string().max(100).nullable().optional()),
    message: z.preprocess(normalizeString, z.string().max(5000).nullable().optional()),
    early_access_interest: z.boolean().optional().default(false),
    locale: z.enum(['en', 'es']).default('en'),
    source_path: z.preprocess(normalizeString, z.string().max(500).nullable().optional()),
    utm_source: z.preprocess(normalizeString, z.string().max(100).nullable().optional()),
    utm_medium: z.preprocess(normalizeString, z.string().max(100).nullable().optional()),
    utm_campaign: z.preprocess(normalizeString, z.string().max(100).nullable().optional()),
    utm_content: z.preprocess(normalizeString, z.string().max(100).nullable().optional()),
    referrer: z.preprocess(normalizeString, z.string().max(500).nullable().optional()),
    website: z.preprocess(normalizeString, z.string().nullable().optional()) // Honeypot
  })
  .superRefine((data, ctx) => {
    // Honeypot check
    if (data.website) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Spam detected',
        path: ['website']
      });
      return;
    }

    if (data.lead_type === 'DEMO') {
      if (!data.first_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'First name is required',
          path: ['first_name']
        });
      }
      if (!data.last_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Last name is required',
          path: ['last_name']
        });
      }
      if (!data.company) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Restaurant or company name is required',
          path: ['company']
        });
      }
    } else {
      // CUSTOM_PROJECT or GENERAL_CONTACT
      if (!data.name && (!data.first_name || !data.last_name)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Name is required',
          path: ['name']
        });
      }
      if (!data.message) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Message is required',
          path: ['message']
        });
      }
    }
  });

export type ValidatedLeadPayload = z.infer<typeof leadSubmissionSchema>;
