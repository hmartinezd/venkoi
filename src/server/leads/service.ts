import { leadSubmissionSchema } from './validation';
import { createLead } from './repository';
import { sendLeadEmails } from '../email/lead-emails';
import type { LeadRecord } from './types';

export type ProcessLeadResult =
  | { ok: true; leadId?: string }
  | { ok: false; code: 'VALIDATION_ERROR'; fieldErrors?: Record<string, string> }
  | { ok: false; code: 'SUBMISSION_ERROR' };

export async function processLeadSubmission(rawPayload: unknown): Promise<ProcessLeadResult> {
  // 1. Zod validation & Honeypot check
  const parseResult = leadSubmissionSchema.safeParse(rawPayload);

  if (!parseResult.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parseResult.error.issues) {
      if (issue.message === 'SPAM_DETECTED') {
        // Honeypot hit - return generic validation error without detail
        return { ok: false, code: 'VALIDATION_ERROR' };
      }
      const field = issue.path[0] ? String(issue.path[0]) : '_global';
      fieldErrors[field] = issue.message;
    }
    return {
      ok: false,
      code: 'VALIDATION_ERROR',
      fieldErrors
    };
  }

  const validatedData = parseResult.data;

  // 2. Persist lead in PostgreSQL (Required for success)
  let lead: LeadRecord;
  try {
    lead = await createLead(validatedData);
  } catch (err) {
    console.error('[Lead Service] Database persistence failed during lead submission:', err instanceof Error ? err.message : 'Persistence error');
    return {
      ok: false,
      code: 'SUBMISSION_ERROR'
    };
  }

  // 3. Send emails asynchronously (DB persistence succeeded)
  // Requirement 24: If email delivery fails, lead submission is STILL SUCCESSFUL.
  try {
    await sendLeadEmails(lead);
  } catch (emailErr) {
    console.error(`[Lead Service] Notification email failed for lead ${lead.id}:`, emailErr instanceof Error ? emailErr.message : 'Email error');
  }

  return {
    ok: true,
    leadId: lead.id
  };
}

