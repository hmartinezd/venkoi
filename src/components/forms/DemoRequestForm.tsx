'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { FormField } from './FormField';
import { FormStatus } from './FormStatus';
import { Button } from '@/components/ui/Button';
import { trackCustomEvent } from '@/lib/analytics';
import { getLeadAcquisitionContext } from '@/lib/lead-acquisition';
import { getDefaultDemoProduct } from '@/lib/products';
import type { Locale } from '@/i18n/config';
import { getLocalizedPath, internalRoutes } from '@/i18n/routing';
import { LocalizedLink } from '@/i18n/navigation';
import type { DemoConversionSource } from '@/lib/product-links';
import type { DemoIntent } from '@/lib/demo-intent';

interface DemoRequestFormProps {
  locale: Locale;
  initialProduct?: string;
  initialInterest?: string;
  productName: string;
  freeMonths: number;
  earlyAccessEnabled: boolean;
  fixedEarlyAccessIntent?: boolean;
  conversionSource?: DemoConversionSource;
}

export function DemoRequestForm({
  locale,
  initialProduct,
  initialInterest = '',
  productName,
  freeMonths,
  earlyAccessEnabled,
  fixedEarlyAccessIntent = false,
  conversionSource
}: DemoRequestFormProps) {
  const activeProduct = initialProduct || getDefaultDemoProduct().slug;
  const initialIntent: DemoIntent = fixedEarlyAccessIntent || (earlyAccessEnabled && initialInterest === 'early-access')
    ? 'early-access'
    : 'demo';
  const t = useTranslations('demoPage.form');
  const tp = useTranslations('demoPage');
  const formRef = useRef<HTMLFormElement>(null);
  const optionalDetailsRef = useRef<HTMLDetailsElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const [manualIntent, setManualIntent] = useState<DemoIntent | null>(
    initialIntent === 'early-access' ? 'early-access' : null
  );
  const requestIntent: DemoIntent = fixedEarlyAccessIntent
    ? 'early-access'
    : (manualIntent ?? 'demo');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    location_count: '',
    current_system: '',
    message: '',
    website: '' // Honeypot
  });

  const acquisitionRef = useRef({
    source_path: '',
    referrer: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: '',
    gclid: '',
    gbraid: '',
    wbraid: ''
  });

  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const hasStartedRef = useRef(false);

  // The page owns the URL intent. The form clears intent-specific UI after a
  // client-side demo/access navigation without discarding entered fields.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setManualIntent(null);
      setErrors({});
      setStatus('idle');
      setStatusMessage('');
      hasStartedRef.current = false;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [fixedEarlyAccessIntent, locale, activeProduct]);

  useEffect(() => {
    if (status === 'success') {
      successRef.current?.focus();
    }
  }, [status]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      acquisitionRef.current = getLeadAcquisitionContext({
        href: window.location.href,
        pathname: window.location.pathname,
        referrer: document.referrer
      });
    }
  }, []);

  const focusFirstError = (errObj: Record<string, string>) => {
    const fieldOrder = ['first_name', 'last_name', 'email', 'company', 'phone', 'location_count', 'current_system', 'message'];
    const firstFieldKey = fieldOrder.find((fieldName) => errObj[fieldName]);
    if (firstFieldKey && formRef.current) {
      if (['phone', 'location_count', 'current_system', 'message'].includes(firstFieldKey)) {
        if (optionalDetailsRef.current) optionalDetailsRef.current.open = true;
      }
      const inputElement = formRef.current.querySelector<HTMLElement>(`[name="${firstFieldKey}"]`);
      if (inputElement) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
          inputElement.scrollIntoView({
            block: 'start',
            inline: 'nearest',
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });
          inputElement.focus({ preventScroll: true });
        }));
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;

    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      const effectiveEarlyAccess = name === 'early_access_interest' ? checked : requestIntent === 'early-access';
      trackCustomEvent('demo_form_start', {
        locale,
        product: activeProduct,
        earlyAccess: effectiveEarlyAccess,
        source: conversionSource
      });
    }

    if (isCheckbox && name === 'early_access_interest') {
      setErrors({});
      setStatus('idle');
      setStatusMessage('');
      setManualIntent(checked ? 'early-access' : 'demo');
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setErrors({});
    setStatus('idle');

    trackCustomEvent('demo_form_submit', {
      locale,
      product: activeProduct,
      earlyAccess: requestIntent === 'early-access',
      source: conversionSource
    });

    // Inline client validation
    const clientErrors: Record<string, string> = {};
    if (!formData.first_name.trim()) clientErrors.first_name = t('firstNameRequired');
    if (!formData.last_name.trim()) clientErrors.last_name = t('lastNameRequired');
    if (!formData.email.trim()) {
      clientErrors.email = t('emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      clientErrors.email = t('invalidEmail');
    }
    if (!formData.company.trim()) clientErrors.company = t('companyRequired');

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setPending(false);
      setTimeout(() => focusFirstError(clientErrors), 50);
      return;
    }

    const payload = {
      lead_type: 'DEMO',
      product: activeProduct,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      location_count: formData.location_count,
      current_system: formData.current_system,
      message: formData.message,
      early_access_interest: requestIntent === 'early-access',
      locale,
      website: formData.website,
      ...acquisitionRef.current
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setStatus('error');
        if (data.fieldErrors) {
          const mappedFieldErrors: Record<string, string> = {};
          for (const [key, code] of Object.entries(data.fieldErrors as Record<string, string>)) {
            if (code === 'REQUIRED') {
              mappedFieldErrors[key] = key === 'first_name'
                ? t('firstNameRequired')
                : key === 'last_name'
                  ? t('lastNameRequired')
                  : key === 'email'
                    ? t('emailRequired')
                    : key === 'company'
                      ? t('companyRequired')
                      : t('required');
            }
            else if (code === 'INVALID_EMAIL') mappedFieldErrors[key] = t('invalidEmail');
            else if (code === 'TOO_LONG') mappedFieldErrors[key] = t('tooLong');
            else if (code === 'INVALID_OPTION') mappedFieldErrors[key] = t('invalidOption');
            else mappedFieldErrors[key] = t('submissionError');
          }
          setErrors(mappedFieldErrors);
          setTimeout(() => focusFirstError(mappedFieldErrors), 50);
        }
        if (data.code === 'BOT_BLOCKED') {
          setStatusMessage(t('botBlocked'));
        } else {
          setStatusMessage(t('submissionError'));
        }
      } else {
        setStatus('success');
        trackCustomEvent('demo_form_success', {
          locale,
          product: activeProduct,
          earlyAccess: requestIntent === 'early-access',
          source: conversionSource
        });
      }
    } catch {
      setStatus('error');
      setStatusMessage(t('networkError'));
    } finally {
      setPending(false);
    }
  };

  if (status === 'success') {
    const successTitle = requestIntent === 'early-access'
      ? tp('earlyAccess.successTitle')
      : tp('standard.successTitle');

    const successMessage = requestIntent === 'early-access'
      ? tp('earlyAccess.successMessage', { productName, freeMonths })
      : tp('standard.successMessage', { productName });

    return (
      <div ref={successRef} tabIndex={-1} className="focus:outline-hidden">
        <FormStatus
          status="success"
          title={successTitle}
          message={successMessage}
        />
        <div className="mt-5 flex flex-wrap gap-3">
          <Button href={getLocalizedPath('productsServe', locale)} variant="secondary">
            {tp('successActions.product')}
          </Button>
          <Button href={getLocalizedPath('insightRestaurantInventory', locale)} variant="text">
            {tp('successActions.guide')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
      {status === 'error' && statusMessage ? (
        <FormStatus status="error" message={statusMessage} />
      ) : null}

      {/* Hidden Honeypot Field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="demo-website">Website</label>
        <input
          id="demo-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label={t('firstName')} required error={errors.first_name}>
          {(fieldProps) => (
            <input
              {...fieldProps}
              type="text"
              name="first_name"
              maxLength={100}
              autoComplete="given-name"
              value={formData.first_name}
              onChange={handleChange}
              className="form-control-boundary scroll-mt-24 w-full rounded-xl border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
            />
          )}
        </FormField>

        <FormField label={t('lastName')} required error={errors.last_name}>
          {(fieldProps) => (
            <input
              {...fieldProps}
              type="text"
              name="last_name"
              maxLength={100}
              autoComplete="family-name"
              value={formData.last_name}
              onChange={handleChange}
              className="form-control-boundary scroll-mt-24 w-full rounded-xl border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
            />
          )}
        </FormField>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label={t('email')} required error={errors.email}>
          {(fieldProps) => (
            <input
              {...fieldProps}
              type="email"
              name="email"
              maxLength={255}
              autoComplete="email"
              inputMode="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control-boundary scroll-mt-24 w-full rounded-xl border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
            />
          )}
        </FormField>

        <FormField label={t('company')} required error={errors.company}>
          {(fieldProps) => (
            <input
              {...fieldProps}
              type="text"
              name="company"
              maxLength={200}
              autoComplete="organization"
              value={formData.company}
              onChange={handleChange}
              className="form-control-boundary scroll-mt-24 w-full rounded-xl border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
            />
          )}
        </FormField>
      </div>

      <details ref={optionalDetailsRef} className="group rounded-xl border border-border bg-surface-muted/50">
        <summary className="cursor-pointer list-none rounded-xl px-4 py-3 text-sm font-semibold text-ink outline-none transition hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-4">
            {t('optionalSummary')}
            <span aria-hidden="true" className="text-orange transition-transform group-open:rotate-45">+</span>
          </span>
        </summary>
        <div className="space-y-6 border-t border-border p-4 sm:p-6">
          <FormField label={t('phone')} error={errors.phone}>
            {(fieldProps) => (
              <input
                {...fieldProps}
                type="tel"
                name="phone"
                maxLength={50}
                autoComplete="tel"
                inputMode="tel"
                value={formData.phone}
                onChange={handleChange}
                className="form-control-boundary scroll-mt-24 w-full rounded-xl border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
              />
            )}
          </FormField>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label={t('locationCount')} error={errors.location_count}>
              {(fieldProps) => (
                <select {...fieldProps} name="location_count" value={formData.location_count} onChange={handleChange} className="form-control-boundary scroll-mt-24 w-full rounded-xl border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden">
                  <option value="">{t('selectPlaceholder')}</option>
                  <option value="1">{t('locationOptions.1')}</option>
                  <option value="2_5">{t('locationOptions.2-5')}</option>
                  <option value="6_20">{t('locationOptions.6-20')}</option>
                  <option value="20_plus">{t('locationOptions.20+')}</option>
                </select>
              )}
            </FormField>

            <FormField label={t('currentSystem')} error={errors.current_system}>
          {(fieldProps) => (
            <select
              {...fieldProps}
              name="current_system"
              value={formData.current_system}
              onChange={handleChange}
              className="form-control-boundary scroll-mt-24 w-full rounded-xl border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
            >
              <option value="">{t('selectPlaceholder')}</option>
              <option value="none">{t('systemOptions.none')}</option>
              <option value="spreadsheet">{t('systemOptions.spreadsheet')}</option>
              <option value="pos_tools">{t('systemOptions.pos')}</option>
              <option value="other">{t('systemOptions.other')}</option>
            </select>
          )}
            </FormField>
          </div>

          <FormField label={t('message')} error={errors.message}>
            {(fieldProps) => (
              <textarea {...fieldProps} name="message" rows={4} maxLength={5000} value={formData.message} onChange={handleChange} className="form-control-boundary scroll-mt-24 w-full rounded-xl border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden resize-y" />
            )}
          </FormField>
        </div>
      </details>

      {earlyAccessEnabled ? <div className="flex flex-col gap-2 pt-2">
        {fixedEarlyAccessIntent ? (
          <div className="rounded-xl border border-orange/30 bg-orange/10 p-4">
            <p className="text-sm font-semibold text-ink">{t('earlyAccessFixed', { productName, freeMonths })}</p>
            <p className="mt-1 text-xs leading-relaxed text-foreground-muted">{t('earlyAccessFixedHelp')}</p>
          </div>
        ) : <>
        <div className="flex items-start gap-3">
          <input
            id="demo-early-access"
            type="checkbox"
            name="early_access_interest"
            checked={requestIntent === 'early-access'}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-border text-orange focus:ring-orange"
          />
          <label htmlFor="demo-early-access" className="text-sm font-medium text-ink cursor-pointer">
            {t('earlyAccess', { productName, freeMonths })}
          </label>
        </div>
        {requestIntent === 'early-access' && (
          <p className="text-[11px] text-orange-text font-bold pl-7 animate-in fade-in slide-in-from-left-1">
            {tp('earlyAccess.badge', { freeMonths })}
          </p>
        )}
        </>}
      </div> : null}

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={pending}
          className="w-full justify-center sm:w-auto min-w-[200px]"
        >
          {pending
            ? t('submitting')
            : requestIntent === 'early-access'
              ? t('submitEarlyAccess')
              : t('submit')}
        </Button>
      </div>
      <p className="text-sm leading-relaxed text-foreground-muted">
        {t('privacyNote')}{' '}
        <LocalizedLink
          href={internalRoutes.privacy}
          locale={locale}
          className="font-semibold text-ink underline decoration-border-strong underline-offset-4 outline-none transition hover:text-orange-text focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        >
          {t('privacyLink')}
        </LocalizedLink>
      </p>
    </form>
  );
}
