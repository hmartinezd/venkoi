-- Migration 005: Add explicit paid-attribution fields and canonical lead lifecycle values.
-- This migration is intentionally additive and must be reviewed/applied by the owner.

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS utm_term VARCHAR(100),
  ADD COLUMN IF NOT EXISTS gclid VARCHAR(200),
  ADD COLUMN IF NOT EXISTS gbraid VARCHAR(200),
  ADD COLUMN IF NOT EXISTS wbraid VARCHAR(200);

-- Preserve the meaning of legacy statuses before replacing the old constraint:
-- CONTACTED did not represent a human qualification decision, while CONVERTED and
-- CLOSED map to the canonical commercial outcomes WON and LOST respectively.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_leads_status') THEN
    ALTER TABLE leads DROP CONSTRAINT chk_leads_status;
  END IF;
END $$;

UPDATE leads
SET status = CASE status
  WHEN 'CONTACTED' THEN 'NEW'
  WHEN 'CONVERTED' THEN 'WON'
  WHEN 'CLOSED' THEN 'LOST'
  ELSE status
END;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_leads_status') THEN
    ALTER TABLE leads ADD CONSTRAINT chk_leads_status CHECK (
      status IN ('NEW', 'QUALIFIED', 'DISQUALIFIED', 'WON', 'LOST')
    );
  END IF;
END $$;
