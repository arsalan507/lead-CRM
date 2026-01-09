-- Add incentive tracking fields to leads table
-- Date: 2026-01-09

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS has_incentive BOOLEAN DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS incentive_amount DECIMAL(10, 2) DEFAULT NULL;

-- Add index for filtering
CREATE INDEX IF NOT EXISTS idx_leads_incentive ON leads(has_incentive) WHERE has_incentive IS NOT NULL;

-- Verification
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'leads'
  AND column_name IN ('has_incentive', 'incentive_amount');
