import { leadSubmissionSchema } from '../src/server/leads/validation';
import { processLeadSubmission } from '../src/server/leads/service';
import { checkBotId } from '../src/server/leads/bot';

async function runTests() {
  console.log('=== RUNNING LEAD INFRASTRUCTURE & VALIDATION TESTS ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Missing email
  const t1 = leadSubmissionSchema.safeParse({
    lead_type: 'DEMO',
    first_name: 'John',
    last_name: 'Doe',
    company: 'Test Resto'
  });
  assert(!t1.success, 'Reject missing email');

  // 2. Invalid email
  const t2 = leadSubmissionSchema.safeParse({
    lead_type: 'DEMO',
    first_name: 'John',
    last_name: 'Doe',
    company: 'Test Resto',
    email: 'not-an-email'
  });
  assert(!t2.success, 'Reject invalid email format');

  // 3. Missing required fields for DEMO
  const t3 = leadSubmissionSchema.safeParse({
    lead_type: 'DEMO',
    email: 'john@example.com'
  });
  assert(!t3.success, 'Reject DEMO missing first/last name & company');

  // 4. Oversized message (>5000 chars)
  const longMsg = 'a'.repeat(5001);
  const t4 = leadSubmissionSchema.safeParse({
    lead_type: 'GENERAL_CONTACT',
    name: 'Jane',
    email: 'jane@example.com',
    message: longMsg
  });
  assert(!t4.success, 'Reject oversized message');

  // 5. Invalid lead type
  const t5 = leadSubmissionSchema.safeParse({
    lead_type: 'INVALID_TYPE',
    email: 'jane@example.com',
    message: 'Hello'
  });
  assert(!t5.success, 'Reject invalid lead type');

  // 6. Populated honeypot (website)
  const t6 = leadSubmissionSchema.safeParse({
    lead_type: 'DEMO',
    first_name: 'Spam',
    last_name: 'Bot',
    email: 'spam@bot.com',
    company: 'Spam Co',
    website: 'http://spam-link.com'
  });
  assert(!t6.success, 'Reject populated honeypot field');

  // 7. Normalization: lowercase email & trim strings
  const t7 = leadSubmissionSchema.safeParse({
    lead_type: 'DEMO',
    first_name: '  John  ',
    last_name: '  Doe  ',
    company: '  Tasty Tacos  ',
    email: '  JOHN.DOE@EXAMPLE.COM  '
  });
  assert(t7.success, 'Valid DEMO payload parses');
  if (t7.success) {
    assert(t7.data.email === 'john.doe@example.com', 'Email normalized to lowercase');
    assert(t7.data.first_name === 'John', 'First name trimmed');
  }

  // 8. BotID verification helper check
  const fakeBotRequest = new Request('http://localhost/api/leads', {
    headers: { 'x-test-bot': 'true' }
  });
  const botCheck = checkBotId(fakeBotRequest);
  assert(botCheck.isBot, 'BotID check flags test bot header');

  // 9. Process lead submission end-to-end (memory fallback mode when no DB connection)
  const processResult = await processLeadSubmission({
    lead_type: 'DEMO',
    first_name: 'Alice',
    last_name: 'Smith',
    email: 'alice@restaurant.com',
    company: 'Ocean Grill',
    location_count: '2–5',
    current_system: 'Spreadsheet',
    early_access_interest: true,
    locale: 'en'
  });
  assert(processResult.success, 'Process lead submission succeeds with valid payload');
  assert(Boolean(processResult.leadId?.startsWith('lead_')), 'Generates valid lead ID');

  console.log(`\n=== SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
