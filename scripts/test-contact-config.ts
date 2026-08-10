import { buildEmailUrl, buildWhatsAppUrl, PUBLIC_CONTACT } from '../src/lib/contact';
import { FEATURED_PRODUCT } from '../src/lib/products';

console.log('=== RUNNING CONTACT CONFIG REGRESSION TESTS ===\n');

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

const genericMessage = 'Hi, I found Venkoi online and would like to talk about a software project.';
const genericUrl = buildWhatsAppUrl(genericMessage);
const parsedGenericUrl = new URL(genericUrl);
const productMessage = `Hi, I found Venkoi online and would like to learn more about ${FEATURED_PRODUCT.name}.`;
const productUrl = new URL(buildWhatsAppUrl(productMessage));

assert(PUBLIC_CONTACT.whatsapp.number === '16145863968', 'Canonical WhatsApp number is correct');
assert(PUBLIC_CONTACT.whatsapp.displayNumber.length > 0, 'WhatsApp display number exists');
assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(PUBLIC_CONTACT.email), 'Canonical email has a valid structure');
assert(parsedGenericUrl.origin === 'https://wa.me', 'Generic WhatsApp URL uses wa.me over HTTPS');
assert(parsedGenericUrl.pathname === '/16145863968', 'Generic WhatsApp URL uses canonical number');
assert(parsedGenericUrl.searchParams.get('text') === genericMessage, 'Generic message survives URL encoding');
assert(genericUrl.includes('text=') && !genericUrl.includes(' '), 'WhatsApp message is URL encoded');
assert(productUrl.searchParams.get('text')?.includes(FEATURED_PRODUCT.name) === true, 'Product message uses public registry name');
assert(FEATURED_PRODUCT.id === 'zaiko' && FEATURED_PRODUCT.slug === 'zaiko', 'Machine product identifiers remain zaiko');
assert(buildEmailUrl('Venkoi inquiry').startsWith(`mailto:${PUBLIC_CONTACT.email}?subject=`), 'Mailto uses canonical email and encoded subject');

const configKeys = Object.keys(PUBLIC_CONTACT).join(' ').toLowerCase();
assert(!/(twitter|instagram|linkedin|facebook|\bx\b)/.test(configKeys), 'Contact config contains no placeholder social networks');

console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);

if (failed > 0) process.exit(1);
