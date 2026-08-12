import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createTranslator } from "next-intl";
import en from "../src/i18n/messages/en.json";
import es from "../src/i18n/messages/es.json";
import { FEATURED_PRODUCT } from "../src/lib/products";
import { leadSubmissionSchema } from "../src/server/leads/validation";
import { normalizeServiceInterest } from "../src/lib/services";

const read = (file: string) =>
  readFileSync(resolve(process.cwd(), file), "utf8");
const form = read("src/components/forms/ContactProjectForm.tsx");
const page = read("src/app/[locale]/contact/page.tsx");
const demoPage = read("src/app/[locale]/demo/page.tsx");
const nextSteps = read("src/components/shared/NextSteps.tsx");

assert.match(page, /buildProductDemoHref\(currentLocale, FEATURED_PRODUCT\)/);
for (const key of ["heading", "body"] as const) {
  assert.match(
    page,
    new RegExp(
      `t\\(\\"productDemo\\.${key}\\", \\{ productName: FEATURED_PRODUCT\\.name \\}\\)`
    ),
    `Contact product-demo ${key} should use the registry display name`
  );
}

const productDemoMessages = { en: en.contactPage.productDemo, es: es.contactPage.productDemo };
const placeholders = (message: string) => [...message.matchAll(/\{([\w]+)\}/g)].map((match) => match[1]).sort();

for (const key of ["heading", "body"] as const) {
  assert.deepEqual(
    placeholders(productDemoMessages.en[key]),
    ["productName"],
    `EN Contact product-demo ${key} should require productName`
  );
  assert.deepEqual(
    placeholders(productDemoMessages.es[key]),
    placeholders(productDemoMessages.en[key]),
    `EN and ES Contact product-demo ${key} should require equivalent interpolation values`
  );
}

for (const [locale, messages] of Object.entries({ en, es })) {
  const t = createTranslator({ locale, messages, namespace: "contactPage.productDemo" });
  for (const key of ["heading", "body"] as const) {
    const rendered = t(key, { productName: FEATURED_PRODUCT.name });
    assert.ok(rendered.includes(FEATURED_PRODUCT.name));
    assert.doesNotMatch(rendered, /\{productName\}/, `${locale.toUpperCase()} ${key} must fully interpolate`);
  }
}
assert.doesNotMatch(form, /name=["']product["']|early_access_interest|location_count|current_system/);
assert.match(demoPage, /getLocalizedPath\('contact', currentLocale\)/);
assert.doesNotMatch(demoPage, /type=services|interest=|product=/);
assert.match(demoPage, /contactEscape\.prompt/);
assert.match(demoPage, /contactEscape\.link/);

const directContactEnd = demoPage.indexOf("</div>", demoPage.indexOf("direct.heading"));
const contactEscapeStart = demoPage.indexOf("contactEscape.prompt");
assert.ok(
  directContactEnd > 0 && contactEscapeStart > directContactEnd,
  "Demo Contact escape must render separately from the direct-contact bar"
);

for (const source of [page, demoPage]) {
  const primaryGridEnd = source.indexOf("</div>", source.indexOf("lg:grid-cols-12"));
  assert.ok(
    source.indexOf("<NextSteps", primaryGridEnd) > primaryGridEnd,
    "NextSteps must render after the primary 7/5 grid"
  );
}
assert.match(nextSteps, /<section/);
assert.match(nextSteps, /<ol/);
assert.match(nextSteps, /md:grid-cols-3/);

const detailsStart = form.indexOf("<details");
const detailsEnd = form.indexOf("</details>");
const detailsSource = form.slice(detailsStart, detailsEnd);

assert.ok(
  detailsStart > 0 && detailsEnd > detailsStart,
  "Optional fields must use native details disclosure"
);
for (const requiredField of ["name", "email", "message"]) {
  const fieldPosition = form.indexOf(`name="${requiredField}"`);
  assert.ok(
    fieldPosition > 0 && fieldPosition < detailsStart,
    `${requiredField} must appear before optional details`
  );
}
for (const optionalField of ["phone", "company", "interest", "project_stage"]) {
  assert.match(
    detailsSource,
    new RegExp(`name="${optionalField}"`),
    `${optionalField} must remain inside details`
  );
}

for (const lead_type of ["CUSTOM_PROJECT", "GENERAL_CONTACT"] as const) {
  const result = leadSubmissionSchema.safeParse({
    lead_type,
    name: "Contact Test",
    email: "contact@example.com",
    message: "A useful first message",
  });
  assert.equal(
    result.success,
    true,
    `${lead_type} must accept all four optional fields omitted`
  );
}

assert.ok(
  form.indexOf("optionalDetailsRef.current.open = true") <
    form.indexOf("inputElement.focus()"),
  "Optional details must open before focus moves to a hidden field"
);
for (const optionalField of ["phone", "company", "interest", "project_stage"]) {
  assert.match(form, new RegExp(`["']${optionalField}["']`));
}

assert.deepEqual(
  ["mobile", "web", "unsure", "website", "web_application"].map(
    normalizeServiceInterest
  ),
  ["mobile", "web", "unsure", "web", "web"]
);
assert.match(
  form,
  /initialType === ["']services["'] \|\| initialType === ["']custom-software["']/
);
assert.match(form, /\? ["']CUSTOM_PROJECT["']\s*:\s*["']GENERAL_CONTACT["']/);
assert.match(form, /interest: initialInterest/);
assert.match(form, /interest: formData\.interest/);

for (const event of [
  "contact_form_start",
  "contact_form_submit",
  "contact_form_success",
]) {
  assert.match(
    form,
    new RegExp(`trackCustomEvent\\(["']${event}["']`),
    `${event} must remain tracked`
  );
}

assert.doesNotMatch(
  page,
  /messages=\{\{ contactPage: messages\.contactPage \}\}/
);
assert.match(page, /form: contactMessages\.form/);
assert.match(
  page,
  /projectTypeIndicator:\s*contactMessages\.projectTypeIndicator/
);
assert.doesNotMatch(page, /^\s*(['"])use client\1;/);
assert.match(form, /^["']use client["'];/);

console.log("Contact experience regression checks passed.");
