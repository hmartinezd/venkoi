-- Migration 002: Harden leads table with PostgreSQL constraints for stable invariants

ALTER TABLE leads
  ALTER COLUMN early_access_interest SET DEFAULT FALSE,
  ALTER COLUMN early_access_interest SET NOT NULL,
  ALTER COLUMN status SET DEFAULT 'NEW',
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN created_at SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_leads_lead_type') THEN
    ALTER TABLE leads ADD CONSTRAINT chk_leads_lead_type CHECK (lead_type IN ('DEMO', 'CUSTOM_PROJECT', 'GENERAL_CONTACT'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_leads_locale') THEN
    ALTER TABLE leads ADD CONSTRAINT chk_leads_locale CHECK (locale IN ('en', 'es'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_leads_status') THEN
    ALTER TABLE leads ADD CONSTRAINT chk_leads_status CHECK (status IN ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'CLOSED'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_leads_location_count') THEN
    ALTER TABLE leads ADD CONSTRAINT chk_leads_location_count CHECK (location_count IS NULL OR location_count IN ('1', '2_5', '6_20', '20_plus'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_leads_current_system') THEN
    ALTER TABLE leads ADD CONSTRAINT chk_leads_current_system CHECK (current_system IS NULL OR current_system IN ('none', 'spreadsheet', 'pos_tools', 'other'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_leads_interest') THEN
    ALTER TABLE leads ADD CONSTRAINT chk_leads_interest CHECK (interest IS NULL OR interest IN ('mobile', 'web', 'custom_business_software', 'product_development', 'unsure'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_leads_project_stage') THEN
    ALTER TABLE leads ADD CONSTRAINT chk_leads_project_stage CHECK (project_stage IS NULL OR project_stage IN ('idea', 'planning', 'existing_product', 'needs_improvement'));
  END IF;
END $$;
