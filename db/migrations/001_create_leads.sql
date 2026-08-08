-- Migration 001: Create leads table and indexes for Venkoi lead capture infrastructure
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(64) PRIMARY KEY,
  lead_type VARCHAR(50) NOT NULL,
  product VARCHAR(50),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  name VARCHAR(200),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(200),
  location_count VARCHAR(50),
  current_system VARCHAR(100),
  interest VARCHAR(100),
  project_stage VARCHAR(100),
  message TEXT,
  early_access_interest BOOLEAN DEFAULT FALSE,
  locale VARCHAR(10) NOT NULL DEFAULT 'en',
  source_path VARCHAR(500),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_content VARCHAR(100),
  referrer VARCHAR(500),
  status VARCHAR(50) DEFAULT 'NEW',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_type_status ON leads (lead_type, status);
