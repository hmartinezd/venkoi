import type { NextRequest } from 'next/server';

export interface BotVerificationResult {
  isBot: boolean;
  reason?: string;
}

export function checkBotId(request: Request | NextRequest): BotVerificationResult {
  const headers = request.headers;

  // Test header for automated tests
  if (headers.get('x-test-bot') === 'true') {
    return { isBot: true, reason: 'Test bot header set' };
  }

  // Vercel BotID Score header (0 - 100, low score indicates bot traffic)
  const botScoreHeader = headers.get('x-vercel-bot-score');
  if (botScoreHeader !== null) {
    const score = parseInt(botScoreHeader, 10);
    if (!isNaN(score) && score < 30) {
      return { isBot: true, reason: `Vercel BotID score low: ${score}` };
    }
  }

  // Vercel Bot Protection classification header
  const botProtectionHeader = headers.get('x-vercel-bot-protection');
  if (botProtectionHeader === 'bot' || botProtectionHeader === 'blocked') {
    return { isBot: true, reason: `Vercel BotID classification: ${botProtectionHeader}` };
  }

  return { isBot: false };
}
