import { leadSubmissionSchema } from '../src/server/leads/validation';
import { processLeadSubmission } from '../src/server/leads/service';

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
    product: 'zaiko',
    first_name: 'John',
    last_name: 'Doe',
    company: 'Test Resto'
  });
  assert(!t1.success, 'Reject missing email');

  // 2. Invalid email
  const t2 = leadSubmissionSchema.safeParse({
    lead_type: 'DEMO',
    product: 'zaiko',
    first_name: 'John',
    last_name: 'Doe',
    company: 'Test Resto',
    email: 'not-an-email'
  });
  assert(!t2.success, 'Reject invalid email format');

  // 3. Missing required fields for DEMO
  const t3 = leadSubmissionSchema.safeParse({
    lead_type: 'DEMO',
    product: 'zaiko',
    email: 'john@example.com'
  });
  assert(!t3.success, 'Reject DEMO missing first/last name & company');

  // 4. Invalid product for DEMO
  const t4 = leadSubmissionSchema.safeParse({
    lead_type: 'DEMO',
    product: 'garbage_product',
    first_name: 'John',
    last_name: 'Doe',
    company: 'Test Resto',
    email: 'john@example.com'
  });
  assert(!t4.success, 'Reject DEMO with non-demo-enabled product');

  // 5. Valid product for DEMO
  const t5 = leadSubmissionSchema.safeParse({
    lead_type: 'DEMO',
    product: 'zaiko',
    first_name: 'John',
    last_name: 'Doe',
    company: 'Test Resto',
    email: 'john@example.com',
    location_count: '2_5',
    current_system: 'pos_tools'
  });
  assert(t5.success, 'Accept DEMO with valid demo product & stable enums');

  // 6. Oversized message (>5000 chars)
  const longMsg = 'a'.repeat(5001);
  const t6 = leadSubmissionSchema.safeParse({
    lead_type: 'GENERAL_CONTACT',
    name: 'Jane',
    email: 'jane@example.com',
    message: longMsg
  });
  assert(!t6.success, 'Reject oversized message');

  // 7. Invalid lead type
  const t7 = leadSubmissionSchema.safeParse({
    lead_type: 'INVALID_TYPE',
    email: 'jane@example.com',
    message: 'Hello'
  });
  assert(!t7.success, 'Reject invalid lead type');

  // 8. Invalid enum values
  const t8 = leadSubmissionSchema.safeParse({
    lead_type: 'DEMO',
    product: 'zaiko',
    first_name: 'John',
    last_name: 'Doe',
    company: 'Test Resto',
    email: 'john@example.com',
    location_count: 'invalid_location_count'
  });
  assert(!t8.success, 'Reject invalid location_count enum');

  const t9 = leadSubmissionSchema.safeParse({
    lead_type: 'CUSTOM_PROJECT',
    name: 'Alice',
    email: 'alice@example.com',
    message: 'We need custom software',
    interest: 'invalid_interest',
    project_stage: 'idea'
  });
  assert(!t9.success, 'Reject invalid interest enum');

  // 9. Populated honeypot (website)
  const t10 = leadSubmissionSchema.safeParse({
    lead_type: 'DEMO',
    product: 'zaiko',
    first_name: 'Spam',
    last_name: 'Bot',
    email: 'spam@bot.com',
    company: 'Spam Co',
    website: 'http://spam-link.com'
  });
  assert(!t10.success, 'Reject populated honeypot field');

  // 10. Normalization: lowercase email & trim strings
  const t11 = leadSubmissionSchema.safeParse({
    lead_type: 'DEMO',
    product: 'zaiko',
    first_name: '  John  ',
    last_name: '  Doe  ',
    company: '  Tasty Tacos  ',
    email: '  JOHN.DOE@EXAMPLE.COM  '
  });
  assert(t11.success, 'Valid DEMO payload parses and normalizes');
  if (t11.success) {
    assert(t11.data.email === 'john.doe@example.com', 'Email normalized to lowercase');
    assert(t11.data.first_name === 'John', 'First name trimmed');
  }

  // 11. Valid CUSTOM_PROJECT payload
  const t12 = leadSubmissionSchema.safeParse({
    lead_type: 'CUSTOM_PROJECT',
    name: 'Carlos Ruiz',
    email: 'carlos@example.com',
    interest: 'custom_business_software',
    project_stage: 'planning',
    message: 'Need a logistics management dashboard for Florida operations.'
  });
  assert(t12.success, 'Valid CUSTOM_PROJECT payload parses successfully');

  // 13. Unknown extra field (strict mode test)
  const t13 = leadSubmissionSchema.safeParse({
    lead_type: 'DEMO',
    product: 'zaiko',
    first_name: 'John',
    last_name: 'Doe',
    company: 'Test Resto',
    email: 'john@example.com',
    unknown_hacker_field: 'malicious_input'
  });
  assert(!t13.success, 'Reject unknown extra field in payload (strict mode)');

  // 14. Process lead submission without DATABASE_URL (must fail, NEVER report success)
  delete process.env.DATABASE_URL;
  const processResult = await processLeadSubmission({
    lead_type: 'DEMO',
    product: 'zaiko',
    first_name: 'Alice',
    last_name: 'Smith',
    email: 'alice@restaurant.com',
    company: 'Ocean Grill',
    location_count: '2_5',
    current_system: 'spreadsheet',
    early_access_interest: true,
    locale: 'en'
  });
  assert(!processResult.ok, 'Process lead submission fails without DATABASE_URL');
  if (!processResult.ok) {
    assert(processResult.code === 'SUBMISSION_ERROR', 'Returns SUBMISSION_ERROR code on DB absence');
  }

  console.log(`\n=== SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});

