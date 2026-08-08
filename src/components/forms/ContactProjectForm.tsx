'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FormField } from './FormField';
import { FormStatus } from './FormStatus';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@/i18n/config';

interface ContactProjectFormProps {
  locale: Locale;
  initialType?: string;
}

export function ContactProjectForm({ locale, initialType = '' }: ContactProjectFormProps) {
  const t = useTranslations('contactPage.form');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    interest: 'custom_business_software',
    project_stage: 'idea',
    message: '',
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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

    // Client inline validation
    const clientErrors: Record<string, string> = {};
    if (!formData.name.trim()) clientErrors.name = t('required');
    if (!formData.email.trim()) {
      clientErrors.email = t('required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      clientErrors.email = t('invalidEmail');
    }
    if (!formData.message.trim()) clientErrors.message = t('required');

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setPending(false);
      return;
    }

    // Lead type: CUSTOM_PROJECT if query has type=custom-software, else GENERAL_CONTACT
    const lead_type = initialType === 'custom-software' ? 'CUSTOM_PROJECT' : 'GENERAL_CONTACT';

    const payload = {
      lead_type,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      interest: formData.interest,
      project_stage: formData.project_stage,
      message: formData.message,
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
        }
        if (data.code === 'BOT_BLOCKED') {
          setStatusMessage(t('botBlocked'));
        } else {
          setStatusMessage(t('submissionError'));
        }
      } else {
        setStatus('success');
      }
    } catch {
      setStatus('error');
      setStatusMessage(t('networkError'));
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
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label={t('name')} required error={errors.name}>
          {(fieldProps) => (
            <input
              {...fieldProps}
              type="text"
              name="name"
              maxLength={200}
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
            />
          )}
        </FormField>

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
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
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

        <FormField label={t('company')} error={errors.company}>
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

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label={t('interest')} error={errors.interest}>
          {(fieldProps) => (
            <select
              {...fieldProps}
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
            >
              <option value="mobile">{t('interestOptions.mobile')}</option>
              <option value="web">{t('interestOptions.web')}</option>
              <option value="custom_business_software">{t('interestOptions.custom')}</option>
              <option value="product_development">{t('interestOptions.product')}</option>
              <option value="unsure">{t('interestOptions.unsure')}</option>
            </select>
          )}
        </FormField>

        <FormField label={t('projectStage')} error={errors.project_stage}>
          {(fieldProps) => (
            <select
              {...fieldProps}
              name="project_stage"
              value={formData.project_stage}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden"
            >
              <option value="idea">{t('stageOptions.idea')}</option>
              <option value="planning">{t('stageOptions.planning')}</option>
              <option value="existing_product">{t('stageOptions.existingProduct')}</option>
              <option value="needs_improvement">{t('stageOptions.needsImprovement')}</option>
            </select>
          )}
        </FormField>
      </div>

      <FormField label={t('message')} required error={errors.message}>
        {(fieldProps) => (
          <textarea
            {...fieldProps}
            name="message"
            rows={5}
            maxLength={5000}
            value={formData.message}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink transition focus:border-orange focus:outline-hidden resize-y"
          />
        )}
      </FormField>

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

