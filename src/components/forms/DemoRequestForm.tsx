'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FormField } from './FormField';
import { FormStatus } from './FormStatus';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@/i18n/config';

interface DemoRequestFormProps {
  locale: Locale;
  initialProduct?: string;
  initialInterest?: string;
}

export function DemoRequestForm({
  locale,
  initialProduct = 'zaiko',
  initialInterest = ''
}: DemoRequestFormProps) {
  const t = useTranslations('demoPage.form');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    location_count: '1',
    current_system: 'none',
    message: '',
    early_access_interest: initialInterest === 'early-access',
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
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
      return;
    }

    // Map localized selection strings
    const currentSystemMap: Record<string, string> = {
      none: 'None',
      spreadsheet: 'Spreadsheet',
      pos: 'POS tools',
      other: 'Other software'
    };

    const payload = {
      lead_type: 'DEMO',
      product: initialProduct || 'zaiko',
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      location_count: formData.location_count,
      current_system: currentSystemMap[formData.current_system] || formData.current_system,
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

      if (!res.ok || !data.success) {
        setStatus('error');
        if (data.errors) {
          setErrors(data.errors);
        }
        setStatusMessage(data.message || 'Submission failed. Please check your entries.');
      } else {
        setStatus('success');
      }
    } catch (err) {
      setStatus('error');
      setStatusMessage('Network error. Please try again later.');
    } finally {
      setPending(false);
    }
  };

  if (status === 'success') {
    return (
      <FormStatus
        status="success"
        title={t('successTitle')}
        message={t('successMessage')}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
              autoComplete="email"
              inputMode="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
            />
          )}
        </FormField>

        <FormField label={t('phone')} error={errors.phone}>
          {(fieldProps) => (
            <input
              {...fieldProps}
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
            />
          )}
        </FormField>
      </div>

      <FormField label={t('company')} required error={errors.company}>
        {(fieldProps) => (
          <input
            {...fieldProps}
            type="text"
            name="company"
            autoComplete="organization"
            value={formData.company}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
          />
        )}
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label={t('locationCount')} error={errors.location_count}>
          {(fieldProps) => (
            <select
              {...fieldProps}
              name="location_count"
              value={formData.location_count}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
            >
              <option value="1">{t('locationOptions.1')}</option>
              <option value="2–5">{t('locationOptions.2-5')}</option>
              <option value="6–20">{t('locationOptions.6-20')}</option>
              <option value="20+">{t('locationOptions.20+')}</option>
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
              <option value="none">{t('systemOptions.none')}</option>
              <option value="spreadsheet">{t('systemOptions.spreadsheet')}</option>
              <option value="pos">{t('systemOptions.pos')}</option>
              <option value="other">{t('systemOptions.other')}</option>
            </select>
          )}
        </FormField>
      </div>

      <FormField label={t('message')} error={errors.message}>
        {(fieldProps) => (
          <textarea
            {...fieldProps}
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden resize-y"
          />
        )}
      </FormField>

      <div className="flex items-start gap-3 pt-2">
        <input
          id="demo-early-access"
          type="checkbox"
          name="early_access_interest"
          checked={formData.early_access_interest}
          onChange={handleChange}
          className="mt-1 h-4 w-4 rounded border-border text-orange focus:ring-orange"
        />
        <label htmlFor="demo-early-access" className="text-sm font-medium text-ink cursor-pointer">
          {t('earlyAccess')}
        </label>
      </div>

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
