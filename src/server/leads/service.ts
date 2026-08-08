import { leadSubmissionSchema } from './validation';
import { createLead } from './repository';
import { sendLeadEmails } from '../email/lead-emails';
import type { LeadRecord } from './types';

export interface ProcessLeadResult {
  success: boolean;
  leadId?: string;
  errors?: Record<string, string>;
  message?: string;
}

export async function processLeadSubmission(rawPayload: unknown): Promise<ProcessLeadResult> {
  // 1. Zod validation & Honeypot check
  const parseResult = leadSubmissionSchema.safeParse(rawPayload);

  if (!parseResult.success) {
    const formattedErrors: Record<string, string> = {};
    for (const issue of parseResult.error.issues) {
      const field = issue.path[0] ? String(issue.path[0]) : '_global';
      formattedErrors[field] = issue.message;
    }
    return {
      success: false,
      errors: formattedErrors,
      message: 'Validation failed'
    };
  }

  const validatedData = parseResult.data;

  // 2. Persist lead in PostgreSQL
  let lead: LeadRecord;
  try {
    lead = await createLead(validatedData);
  } catch (err) {
    console.error('Database persistence failed during lead submission:', err);
    // Requirement 22: Generic error, do not expose SQL/connection/stack traces
    return {
      success: false,
      message: 'An error occurred while processing your request. Please try again later.'
    };
  }

  // 3. Send emails asynchronously (DB persistence succeeded)
  // Requirement 23: If email delivery fails, the form submission is STILL SUCCESSFUL.
  try {
    await sendLeadEmails(lead);
  } catch (emailErr) {
    console.error(`Notification email failed for lead ${lead.id}:`, emailErr);
  }

  return {
    success: true,
    leadId: lead.id
  };
}
