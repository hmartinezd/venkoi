-- Migration 003: Update service interests check constraint
-- Canonical current application values: 'mobile', 'web', 'unsure'
-- Compatibility / legacy values preserved for row compatibility:
-- 'website', 'web_application', 'custom_business_software', 'product_development'

DO $$
BEGIN
  -- Drop constraint if it exists from migration 002
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_leads_interest') THEN
    ALTER TABLE leads DROP CONSTRAINT chk_leads_interest;
  END IF;

  -- Add updated constraint allowing both active and historical legacy values
  ALTER TABLE leads ADD CONSTRAINT chk_leads_interest CHECK (
    interest IS NULL OR interest IN (
      -- Canonical current application values
      'mobile',
      'web',
      'unsure',
      -- Compatibility / legacy values (read and historical row compatibility)
      'website',
      'web_application',
      'custom_business_software',
      'product_development'
    )
  );
END $$;
