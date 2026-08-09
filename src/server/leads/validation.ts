import { z } from 'zod';
import type { LeadType } from './types';
import { isDemoEnabledProduct } from '@/lib/products';

const ALLOWED_LEAD_TYPES: [LeadType, ...LeadType[]] = ['DEMO', 'CUSTOM_PROJECT', 'GENERAL_CONTACT'];
const LOCATION_COUNTS = ['1', '2_5', '6_20', '20_plus'] as const;
const CURRENT_SYSTEMS = ['none', 'spreadsheet', 'pos_tools', 'other'] as const;
const CANONICAL_INTERESTS = ['mobile', 'web', 'unsure'] as const;
const PROJECT_STAGES = ['idea', 'planning', 'existing_product', 'needs_improvement'] as const;

const normalizeString = (val: unknown): string | null => {
  if (typeof val !== 'string') return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const normalizeInterest = (val: unknown): string | null => {
  const str = normalizeString(val);
  if (!str) return null;
  if (str === 'website' || str === 'web_application') {
    return 'web';
  }
  return str;
};

export const leadSubmissionSchema = z
  .object({
    lead_type: z.enum(ALLOWED_LEAD_TYPES, { error: 'INVALID_OPTION' }),
    product: z.preprocess(normalizeString, z.string().max(50).nullable().optional()),
    first_name: z.preprocess(normalizeString, z.string().max(100).nullable().optional()),
    last_name: z.preprocess(normalizeString, z.string().max(100).nullable().optional()),
    name: z.preprocess(normalizeString, z.string().max(200).nullable().optional()),
    email: z
      .string({ error: 'REQUIRED' })
      .trim()
      .toLowerCase()
      .email('INVALID_EMAIL')
      .max(255, 'TOO_LONG'),
    phone: z.preprocess(normalizeString, z.string().max(50).nullable().optional()),
    company: z.preprocess(normalizeString, z.string().max(200).nullable().optional()),
    location_count: z.preprocess(
      normalizeString,
      z.enum(LOCATION_COUNTS, { error: 'INVALID_OPTION' }).nullable().optional()
    ),
    current_system: z.preprocess(
      normalizeString,
      z.enum(CURRENT_SYSTEMS, { error: 'INVALID_OPTION' }).nullable().optional()
    ),
    interest: z.preprocess(
      normalizeInterest,
      z.enum(CANONICAL_INTERESTS, { error: 'INVALID_OPTION' }).nullable().optional()
    ),
    project_stage: z.preprocess(
      normalizeString,
      z.enum(PROJECT_STAGES, { error: 'INVALID_OPTION' }).nullable().optional()
    ),
    message: z.preprocess(normalizeString, z.string().max(5000, 'TOO_LONG').nullable().optional()),
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
  .strict()
  .superRefine((data, ctx) => {
    // Honeypot check
    if (data.website) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'SPAM_DETECTED',
        path: ['website']
      });
      return;
    }

    if (data.lead_type === 'DEMO') {
      if (!data.product || !isDemoEnabledProduct(data.product)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'INVALID_PRODUCT',
          path: ['product']
        });
      }
      if (!data.first_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'REQUIRED',
          path: ['first_name']
        });
      }
      if (!data.last_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'REQUIRED',
          path: ['last_name']
        });
      }
      if (!data.company) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'REQUIRED',
          path: ['company']
        });
      }
    } else {
      // CUSTOM_PROJECT or GENERAL_CONTACT
      if (!data.name && (!data.first_name || !data.last_name)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'REQUIRED',
          path: ['name']
        });
      }
      if (!data.message) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'REQUIRED',
          path: ['message']
        });
      }
    }
  });

export type ValidatedLeadPayload = z.infer<typeof leadSubmissionSchema>;

