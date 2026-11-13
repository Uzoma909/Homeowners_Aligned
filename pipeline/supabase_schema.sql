-- ============================================================
-- Homeowners Aligned — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Main HOA profiles table
CREATE TABLE hoas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Core identity
  legal_name TEXT NOT NULL,
  association_name TEXT,
  subdivision_name TEXT,
  county TEXT NOT NULL,
  city TEXT NOT NULL,
  zip TEXT,
  association_type TEXT CHECK (association_type IN ('POA', 'COA', 'HOA')),
  certificate_url TEXT,
  
  -- Management company
  mgmt_company_name TEXT,
  mgmt_company_address TEXT,
  mgmt_company_phone TEXT,
  mgmt_company_email TEXT,
  mgmt_company_website TEXT,
  
  -- Association contact
  association_address TEXT,
  association_website TEXT,
  
  -- Recording data
  recording_county TEXT,
  recording_instrument_number TEXT,
  recording_volume_page TEXT,
  recording_date TEXT,
  
  -- CC&R references (array of instrument numbers)
  ccr_references JSONB DEFAULT '[]',
  
  -- Comptroller / entity data
  taxpayer_id TEXT UNIQUE,
  fei_number TEXT,
  entity_status TEXT,
  sos_status TEXT,
  sos_file_number TEXT,
  sos_effective_date TEXT,
  state_of_formation TEXT,
  registered_agent_name TEXT,
  registered_agent_address TEXT,
  comptroller_mailing_address TEXT,
  comptroller_report_year TEXT,
  
  -- Extraction metadata
  extraction_method TEXT,
  extraction_cost NUMERIC(10, 6),
  
  -- Health score (populated later by app logic)
  health_score INTEGER,
  health_score_updated_at TIMESTAMPTZ,
  
  -- Verification
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  
  -- Timestamps
  scraped_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  comptroller_processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Board members / officers
CREATE TABLE hoa_officers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hoa_id UUID NOT NULL REFERENCES hoas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  active_year TEXT,
  address TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Transfer fees
CREATE TABLE hoa_fees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hoa_id UUID NOT NULL REFERENCES hoas(id) ON DELETE CASCADE,
  fee_type TEXT NOT NULL,
  amount NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Indexes for search performance
-- ============================================================

-- Full-text search on HOA name and subdivision
CREATE INDEX idx_hoas_legal_name_trgm ON hoas USING gin (legal_name gin_trgm_ops);
CREATE INDEX idx_hoas_subdivision_trgm ON hoas USING gin (subdivision_name gin_trgm_ops);
CREATE INDEX idx_hoas_association_name_trgm ON hoas USING gin (association_name gin_trgm_ops);

-- County and city filtering
CREATE INDEX idx_hoas_county ON hoas (county);
CREATE INDEX idx_hoas_city ON hoas (city);
CREATE INDEX idx_hoas_zip ON hoas (zip);
CREATE INDEX idx_hoas_type ON hoas (association_type);

-- Entity status
CREATE INDEX idx_hoas_entity_status ON hoas (entity_status);

-- Officer lookups
CREATE INDEX idx_officers_hoa_id ON hoa_officers (hoa_id);

-- Fee lookups
CREATE INDEX idx_fees_hoa_id ON hoa_fees (hoa_id);

-- Management company name (for grouping/search)
CREATE INDEX idx_hoas_mgmt_company ON hoas (mgmt_company_name);

-- Taxpayer ID lookup
CREATE INDEX idx_hoas_taxpayer_id ON hoas (taxpayer_id);

-- ============================================================
-- Enable trigram extension (required for fuzzy search)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE hoas ENABLE ROW LEVEL SECURITY;
ALTER TABLE hoa_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE hoa_fees ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view HOA data)
CREATE POLICY "Public read access" ON hoas
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON hoa_officers
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON hoa_fees
  FOR SELECT USING (true);

-- Service role has full access (for seed script and admin)
CREATE POLICY "Service role full access" ON hoas
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON hoa_officers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON hoa_fees
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- Updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hoas_updated_at
  BEFORE UPDATE ON hoas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();