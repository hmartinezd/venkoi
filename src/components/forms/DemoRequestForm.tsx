'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { FormField } from './FormField';
import { FormStatus } from './FormStatus';
import { Button } from '@/components/ui/Button';
import { trackCustomEvent } from '@/lib/analytics';
import { getDefaultDemoProduct } from '@/lib/products';
import type { Locale } from '@/i18n/config';

interface DemoRequestFormProps {
  locale: Locale;
  initialProduct?: string;
  initialInterest?: string;
  productName: string;
  freeMonths: number;
  earlyAccessEnabled: boolean;
}

export function DemoRequestForm({
  locale,
  initialProduct,
  initialInterest = '',
  productName,
  freeMonths,
  earlyAccessEnabled
}: DemoRequestFormProps) {
  const activeProduct = initialProduct || getDefaultDemoProduct().slug;
  const t = useTranslations('demoPage.form');
  const tp = useTranslations('demoPage');
  const formRef = useRef<HTMLFormElement>(null);
  const optionalDetailsRef = useRef<HTMLDetailsElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    location_count: '',
    current_system: '',
    message: '',
    early_access_interest: earlyAccessEnabled && initialInterest === 'early-access',
    website: '' // Honeypot
  });

  const [acquisition, setAcquisition] = useState({
    source_path: '',
    referrer: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: ''
  });

  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (status === 'success') {
      successRef.current?.focus();
    }
  }, [status]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      setAcquisition({
        source_path: window.location.pathname,
        referrer: document.referrer || '',
        utm_source: searchParams.get('utm_source') || '',
        utm_medium: searchParams.get('utm_medium') || '',
        utm_campaign: searchParams.get('utm_campaign') || '',
        utm_content: searchParams.get('utm_content') || ''
      });
    }
  }, []);

  const focusFirstError = (errObj: Record<string, string>) => {
    const firstFieldKey = Object.keys(errObj)[0];
    if (firstFieldKey && formRef.current) {
      if (['phone', 'location_count', 'current_system', 'message'].includes(firstFieldKey)) {
        if (optionalDetailsRef.current) optionalDetailsRef.current.open = true;
      }
      const inputElement = formRef.current.querySelector<HTMLElement>(`[name="${firstFieldKey}"]`);
      if (inputElement) {
        inputElement.focus();
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
      const effectiveEarlyAccess = name === 'early_access_interest' ? checked : formData.early_access_interest;
      trackCustomEvent('demo_form_start', {
        locale,
        product: activeProduct,
        earlyAccess: effectiveEarlyAccess
      });
    }

    if (isCheckbox) {
      setFormData((prev) => ({ ...prev, [name]: checked }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setErrors({});
    setStatus('idle');

    trackCustomEvent('demo_form_submit', {
      locale,
      product: activeProduct,
      earlyAccess: formData.early_access_interest
    });

    // Inline client validation
    const clientErrors: Record<string, string> = {};
    if (!formData.first_name.trim()) clientErrors.first_name = t('required');
    if (!formData.last_name.trim()) clientErrors.last_name = t('required');
    if (!formData.email.trim()) {
      clientErrors.email = t('required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      clientErrors.email = t('invalidEmail');
    }
    if (!formData.company.trim()) clientErrors.company = t('required');

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
      early_access_interest: formData.early_access_interest,
      locale,
      website: formData.website,
      ...acquisition
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
            if (code === 'REQUIRED') mappedFieldErrors[key] = t('required');
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
          earlyAccess: formData.early_access_interest
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
    const successTitle = formData.early_access_interest
      ? tp('earlyAccess.successTitle')
      : tp('standard.successTitle');

    const successMessage = formData.early_access_interest
      ? tp('earlyAccess.successMessage', { productName })
      : tp('standard.successMessage', { productName });

    return (
      <div ref={successRef} tabIndex={-1} className="focus:outline-hidden">
        <FormStatus
          status="success"
          title={successTitle}
          message={successMessage}
        />
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
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
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
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
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
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
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
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
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
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
              />
            )}
          </FormField>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label={t('locationCount')} error={errors.location_count}>
              {(fieldProps) => (
                <select {...fieldProps} name="location_count" value={formData.location_count} onChange={handleChange} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden">
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
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
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
              <textarea {...fieldProps} name="message" rows={4} maxLength={5000} value={formData.message} onChange={handleChange} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden resize-y" />
            )}
          </FormField>
        </div>
      </details>

      {earlyAccessEnabled ? <div className="flex flex-col gap-2 pt-2">
        <div className="flex items-start gap-3">
          <input
            id="demo-early-access"
            type="checkbox"
            name="early_access_interest"
            checked={formData.early_access_interest}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-border text-orange focus:ring-orange"
          />
          <label htmlFor="demo-early-access" className="text-sm font-medium text-ink cursor-pointer">
            {t('earlyAccess', { productName, freeMonths })}
          </label>
        </div>
        {formData.early_access_interest && (
          <p className="text-[11px] text-orange-text font-bold pl-7 animate-in fade-in slide-in-from-left-1">
            {tp('earlyAccess.badge', { freeMonths })}
          </p>
        )}
      </div> : null}

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={pending}
          className="w-full justify-center sm:w-auto min-w-[200px]"
        >
          {pending ? t('submitting') : t('submit')}
        </Button>
      </div>
    </form>
  );
}
