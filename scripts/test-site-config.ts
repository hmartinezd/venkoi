import { isProductionEnv, isPreviewEnv, isDeployedEnv } from '../src/lib/site-config';

export function testSiteConfig() {
  console.log('=== RUNNING SITE CONFIG ENVIRONMENT TESTS ===\n');

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

  // Backup original env vars
  const origVercelEnv = process.env.VERCEL_ENV;
  const origNodeEnv = process.env.NODE_ENV;

  // Helper to safely mutate process.env properties for testing
  const setEnv = (key: string, value: string | undefined) => {
    if (value === undefined) {
      delete (process.env as Record<string, string | undefined>)[key];
    } else {
      (process.env as Record<string, string | undefined>)[key] = value;
    }
  };

  try {
    // 1. VERCEL_ENV=production
    setEnv('VERCEL_ENV', 'production');
    setEnv('NODE_ENV', 'production');
    assert(isProductionEnv() === true, 'VERCEL_ENV=production -> isProductionEnv true');
    assert(isPreviewEnv() === false, 'VERCEL_ENV=production -> isPreviewEnv false');
    assert(isDeployedEnv() === true, 'VERCEL_ENV=production -> isDeployedEnv true');

    // 2. VERCEL_ENV=preview + NODE_ENV=production (Critical Preview test)
    setEnv('VERCEL_ENV', 'preview');
    setEnv('NODE_ENV', 'production');
    assert(isProductionEnv() === false, 'VERCEL_ENV=preview + NODE_ENV=production -> isProductionEnv false');
    assert(isPreviewEnv() === true, 'VERCEL_ENV=preview -> isPreviewEnv true');
    assert(isDeployedEnv() === true, 'VERCEL_ENV=preview -> isDeployedEnv true');

    // 3. VERCEL_ENV=development
    setEnv('VERCEL_ENV', 'development');
    setEnv('NODE_ENV', 'development');
    assert(isProductionEnv() === false, 'VERCEL_ENV=development -> isProductionEnv false');
    assert(isPreviewEnv() === false, 'VERCEL_ENV=development -> isPreviewEnv false');
    assert(isDeployedEnv() === false, 'VERCEL_ENV=development -> isDeployedEnv false');

    // 4. No VERCEL_ENV + NODE_ENV=production
    setEnv('VERCEL_ENV', undefined);
    setEnv('NODE_ENV', 'production');
    assert(isProductionEnv() === true, 'No VERCEL_ENV + NODE_ENV=production -> isProductionEnv true');
    assert(isPreviewEnv() === false, 'No VERCEL_ENV + NODE_ENV=production -> isPreviewEnv false');
    assert(isDeployedEnv() === true, 'No VERCEL_ENV + NODE_ENV=production -> isDeployedEnv true');

    // 5. No VERCEL_ENV + NODE_ENV=development
    setEnv('VERCEL_ENV', undefined);
    setEnv('NODE_ENV', 'development');
    assert(isProductionEnv() === false, 'No VERCEL_ENV + NODE_ENV=development -> isProductionEnv false');
    assert(isPreviewEnv() === false, 'No VERCEL_ENV + NODE_ENV=development -> isPreviewEnv false');
    assert(isDeployedEnv() === false, 'No VERCEL_ENV + NODE_ENV=development -> isDeployedEnv false');

  } finally {
    // Restore original env vars
    setEnv('VERCEL_ENV', origVercelEnv);
    setEnv('NODE_ENV', origNodeEnv);
  }

  console.log(`\n=== SITE CONFIG SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

// Execute directly if run via CLI
if (require.main === module) {
  testSiteConfig();
}
