-- Migration: Add 'other_reason' field for custom Lost reasons
-- This allows sales reps to specify custom reasons beyond the predefined options

-- Add other_reason column to leads table
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS other_reason TEXT;

-- Add comment
COMMENT ON COLUMN leads.other_reason IS 'Custom reason text when not_today_reason is "other"';

-- Create index for searching/filtering (optional, for performance)
CREATE INDEX IF NOT EXISTS idx_leads_other_reason ON leads(other_reason) WHERE other_reason IS NOT NULL;
