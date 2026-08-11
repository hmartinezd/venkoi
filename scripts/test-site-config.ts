import {
  getSiteOrigin,
  isProductionEnv,
  isPreviewEnv,
  isDeployedEnv,
  normalizeSiteOrigin
} from '../src/lib/site-config';

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
  const origSiteUrl = process.env.SITE_URL;

  // Helper to safely mutate process.env properties for testing
  const setEnv = (key: string, value: string | undefined) => {
    if (value === undefined) {
      delete (process.env as Record<string, string | undefined>)[key];
    } else {
      (process.env as Record<string, string | undefined>)[key] = value;
    }
  };

  try {
    const originCases: Array<[string | undefined, string, string]> = [
      [undefined, 'https://venkoi.com', 'undefined SITE_URL uses canonical fallback'],
      ['https://venkoi.com', 'https://venkoi.com', 'canonical SITE_URL is accepted'],
      ['https://venkoi.com/', 'https://venkoi.com', 'root trailing slash is normalized'],
      ['not a URL', 'https://venkoi.com', 'malformed SITE_URL safely falls back'],
      ['venkoi.com', 'https://venkoi.com', 'relative SITE_URL safely falls back'],
      ['//venkoi.com', 'https://venkoi.com', 'protocol-relative SITE_URL safely falls back'],
      ['ftp://venkoi.com', 'https://venkoi.com', 'non-HTTP(S) SITE_URL safely falls back'],
      ['http://venkoi.com', 'https://venkoi.com', 'HTTP SITE_URL safely falls back to HTTPS canonical'],
      ['https://venkoi.com/path', 'https://venkoi.com', 'path-bearing SITE_URL safely falls back'],
      ['https://venkoi.com?foo=bar', 'https://venkoi.com', 'query-bearing SITE_URL safely falls back'],
      ['https://venkoi.com/#section', 'https://venkoi.com', 'fragment-bearing SITE_URL safely falls back'],
      ['https://user:pass@venkoi.com', 'https://venkoi.com', 'credential-bearing SITE_URL safely falls back'],
      [' https://attacker.example', 'https://venkoi.com', 'whitespace-bearing SITE_URL safely falls back'],
      ['https://venkoi.com\nX-Test: injected', 'https://venkoi.com', 'header-control SITE_URL safely falls back']
    ];

    for (const [siteUrl, expected, label] of originCases) {
      setEnv('SITE_URL', siteUrl);
      assert(getSiteOrigin() === expected, label);
    }
    assert(normalizeSiteOrigin('https://example.com:8443/') === 'https://example.com:8443', 'pure helper accepts and normalizes an HTTPS origin');
    assert(normalizeSiteOrigin('https://example.com/path') === undefined, 'pure helper rejects a non-root path');

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
    setEnv('SITE_URL', origSiteUrl);
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
