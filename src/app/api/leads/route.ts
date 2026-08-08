import { NextResponse, type NextRequest } from 'next/server';
import { checkBotId } from 'botid/server';
import { processLeadSubmission } from '@/server/leads/service';

const MAX_BODY_BYTES = 100 * 1024; // 100 KB max payload limit

export async function POST(request: NextRequest) {
  // 1. Official Vercel BotID Verification BEFORE processing
  try {
    const verification = await checkBotId();
    if (verification.isBot) {
      return NextResponse.json(
        { ok: false, code: 'BOT_BLOCKED' },
        { status: 403 }
      );
    }
  } catch (err) {
    // If BotID throws during local dev/unconfigured environment, log warning & continue
    console.warn('[BotID Check] Verification skipped or errored:', err);
  }

  // 2. Parse payload JSON with size check
  let bodyText = '';
  try {
    bodyText = await request.text();
  } catch {
    return NextResponse.json(
      { ok: false, code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  if (bodyText.length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, code: 'VALIDATION_ERROR' },
      { status: 413 }
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(bodyText);
  } catch {
    return NextResponse.json(
      { ok: false, code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  // 3. Process Lead submission (Validation -> Persist -> Email)
  const result = await processLeadSubmission(body);

  if (!result.ok) {
    if (result.code === 'VALIDATION_ERROR') {
      return NextResponse.json(result, { status: 400 });
    }
    // Database or internal configuration failure
    return NextResponse.json(
      { ok: false, code: 'SUBMISSION_ERROR' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

