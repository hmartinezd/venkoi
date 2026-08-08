import { NextResponse, type NextRequest } from 'next/server';
import { checkBotId } from 'botid/server';
import { processLeadSubmission } from '@/server/leads/service';
import { isDeployedEnv } from '@/lib/site-config';

const MAX_BODY_BYTES = 100 * 1024; // 100 KB max payload limit

export async function POST(request: NextRequest) {
  // 1. Official Vercel BotID Verification BEFORE processing
  const isDeployed = isDeployedEnv();
  try {
    const verification = await checkBotId();
    if (verification.isBot) {
      return NextResponse.json(
        { ok: false, code: 'BOT_BLOCKED' },
        { status: 403 }
      );
    }
  } catch (err) {
    if (isDeployed) {
      console.error('[BotID Check] Deployed BotID verification error:', err instanceof Error ? err.message : 'Verification failed');
      return NextResponse.json(
        { ok: false, code: 'SUBMISSION_ERROR' },
        { status: 500 }
      );
    }
    console.warn('[BotID Check] Non-deployed verification warning:', err instanceof Error ? err.message : err);
  }

  // 2. Validate Content-Type header
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json(
      { ok: false, code: 'VALIDATION_ERROR' },
      { status: 415 }
    );
  }

  // 3. Byte-accurate request size check & payload extraction
  const contentLengthHeader = request.headers.get('content-length');
  if (contentLengthHeader && parseInt(contentLengthHeader, 10) > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, code: 'VALIDATION_ERROR' },
      { status: 413 }
    );
  }

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await request.arrayBuffer();
  } catch {
    return NextResponse.json(
      { ok: false, code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  if (arrayBuffer.byteLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, code: 'VALIDATION_ERROR' },
      { status: 413 }
    );
  }

  const decoder = new TextDecoder('utf-8');
  const bodyText = decoder.decode(arrayBuffer);

  let body: unknown;
  try {
    body = JSON.parse(bodyText);
  } catch {
    return NextResponse.json(
      { ok: false, code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  // 4. Process Lead submission (Validation -> Persist -> Email)
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


