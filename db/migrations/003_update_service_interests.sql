-- Migration 003: Update service interests check constraint
-- Active public API values: 'mobile', 'website', 'web_application', 'unsure'
-- Historical legacy database values preserved for row compatibility: 'web', 'custom_business_software', 'product_development'

DO $$
BEGIN
  -- Drop constraint if it exists from migration 002
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_leads_interest') THEN
    ALTER TABLE leads DROP CONSTRAINT chk_leads_interest;
  END IF;

  -- Add updated constraint allowing both active and historical legacy values
  ALTER TABLE leads ADD CONSTRAINT chk_leads_interest CHECK (
    interest IS NULL OR interest IN (
      -- Active V1 Services interest values
      'mobile',
      'website',
      'web_application',
      'unsure',
      -- Legacy historical interest values (read compatibility only)
      'web',
      'custom_business_software',
      'product_development'
    )
  );
END $$;
