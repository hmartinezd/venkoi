import { NextResponse, type NextRequest } from 'next/server';
import { checkBotId } from '@/server/leads/bot';
import { processLeadSubmission } from '@/server/leads/service';

export async function POST(request: NextRequest) {
  // 1. Vercel BotID Verification BEFORE DB insertion
  const botResult = checkBotId(request);
  if (botResult.isBot) {
    console.warn(`[BotID Protection] Blocked automated request: ${botResult.reason}`);
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }

  // 2. Parse payload JSON
  let body: unknown;
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }

  // 3. Process Lead submission (Validation -> Persist -> Email)
  const result = await processLeadSubmission(body);

  if (!result.success) {
    if (result.errors) {
      return NextResponse.json(
        { success: false, errors: result.errors, message: result.message },
        { status: 400 }
      );
    }
    // Database or internal failure
    return NextResponse.json(
      { success: false, message: result.message || 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, leadId: result.leadId },
    { status: 201 }
  );
}
