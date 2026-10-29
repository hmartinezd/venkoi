-- Migration 006: Add the custom-software project-interest categories used by the public form.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_leads_interest') THEN
    ALTER TABLE leads DROP CONSTRAINT chk_leads_interest;
  END IF;

  ALTER TABLE leads ADD CONSTRAINT chk_leads_interest CHECK (
    interest IS NULL OR interest IN (
      'mobile',
      'web',
      'internal_tools',
      'workflow_automation',
      'integrations',
      'operations_software',
      'unsure',
      'website',
      'web_application',
      'custom_business_software',
      'product_development'
    )
  );
END $$;
