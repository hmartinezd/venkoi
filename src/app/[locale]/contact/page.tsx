import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ContactProjectForm } from "@/components/forms/ContactProjectForm";
import { DirectContactChannels } from "@/components/contact/DirectContactChannels";
import { NextSteps } from "@/components/shared/NextSteps";
import { locales, type Locale } from "@/i18n/config";
import { createMetadata } from "@/lib/seo";
import { normalizeServiceInterest } from "@/lib/services";
import { buildProductDemoHref } from "@/lib/product-links";
import { FEATURED_PRODUCT } from "@/lib/products";
import type { Metadata } from "next";
import {
  getMessages,
  getTranslations,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function parseLocale(locale: string): Locale {
  if (locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  notFound();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);
  const t = await getTranslations({
    locale: currentLocale,
    namespace: "contactPage",
  });
  const seo = await getTranslations({
    locale: currentLocale,
    namespace: "seo",
  });
  return createMetadata({
    title: `${t("eyebrow")} | ${seo("title")}`,
    description: t("body"),
    routeKey: "contact",
    locale: currentLocale,
  });
}

export default async function ContactPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { type, interest } = await searchParams;
  const currentLocale = parseLocale(locale);

  const t = await getTranslations("contactPage");
  const messages = await getMessages();
  const contactMessages = messages.contactPage as {
    form: AbstractIntlMessages;
    projectTypeIndicator: string;
  };

  const selectedType = typeof type === "string" ? type : "";
  const initialInterest = normalizeServiceInterest(interest);

  const isServicesIntent =
    selectedType === "services" && initialInterest !== "";

  let eyebrowText = t("eyebrow");
  let headingText = t("heading");
  let bodyText = t("body");

  if (isServicesIntent) {
    eyebrowText = t(`intent.${initialInterest}.eyebrow`);
    headingText = t(`intent.${initialInterest}.heading`);
    bodyText = t(`intent.${initialInterest}.body`);
  }

  return (
    <Section variant="light" spacing="hero">
      <Container className="space-y-10">
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
            {eyebrowText}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl leading-tight">
            {headingText}
          </h1>
          <p className="text-lg text-foreground-muted leading-relaxed max-w-2xl">
            {bodyText}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8 lg:col-span-7">
            <NextIntlClientProvider
              messages={{
                contactPage: {
                  form: contactMessages.form,
                  projectTypeIndicator: contactMessages.projectTypeIndicator,
                },
              }}
            >
              <ContactProjectForm
                locale={currentLocale}
                initialType={selectedType}
                initialInterest={initialInterest}
              />
            </NextIntlClientProvider>
          </div>

          <aside className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
              <div className="space-y-5">
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-text">
                    {t("direct.eyebrow")}
                  </p>
                  <h2 className="text-2xl font-bold text-ink sm:text-3xl">
                    {t("direct.heading")}
                  </h2>
                  <p className="text-sm leading-relaxed text-foreground-muted">
                    {t("direct.body")}
                  </p>
                </div>
                <DirectContactChannels
                  variant="panel"
                  whatsappMessage={t("direct.whatsappMessage")}
                  whatsappLabel={t("direct.whatsappLabel")}
                  whatsappAriaLabel={t("direct.whatsappAriaLabel")}
                  emailLabel={t("direct.emailLabel")}
                  emailAriaLabel={t("direct.emailAriaLabel")}
                  emailSubject={t("direct.emailSubject")}
                  showWhatsAppNumber
                />
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="space-y-2 rounded-xl bg-surface-muted p-4">
                <h2 className="font-bold text-ink">
                  {t("productDemo.heading", { productName: FEATURED_PRODUCT.name })}
                </h2>
                <p className="text-sm text-foreground-muted">
                  {t("productDemo.body")}
                </p>
                <a
                  href={buildProductDemoHref(currentLocale, FEATURED_PRODUCT)}
                  className="inline-flex text-sm font-semibold text-orange-text underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 rounded-sm outline-none"
                >
                  {t("productDemo.cta")}
                </a>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-text">
                {t("locationEyebrow")}
              </p>
              <h3 className="text-lg font-bold text-ink">
                {t("locationBoxTitle")}
              </h3>
              <p className="text-sm leading-relaxed text-foreground-muted">
                {t("locationBoxDesc")}
              </p>
            </div>
          </aside>
        </div>

        <NextSteps
          heading={t("nextSteps.heading")}
          steps={[1, 2, 3].map((step) => t(`nextSteps.step${step}`))}
          note={t("nextSteps.differentiator")}
        />
      </Container>
    </Section>
  );
}
