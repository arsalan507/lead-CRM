-- Migration: Add lead_rating column for Lost leads
-- This allows sales reps to rate the likelihood of conversion (1-5 stars)

-- Add lead_rating column to leads table
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS lead_rating INTEGER CHECK (lead_rating >= 1 AND lead_rating <= 5);

-- Add comment
COMMENT ON COLUMN leads.lead_rating IS 'Sales rep rating (1-5 stars) for likelihood of lead conversion - only for Lost leads';

-- Create index for filtering by rating
CREATE INDEX IF NOT EXISTS idx_leads_rating ON leads(lead_rating) WHERE lead_rating IS NOT NULL;

-- Note: lead_score will be calculated dynamically based on:
-- - purchase_timeline (40 points max)
-- - deal_size (25 points max)
-- - not_today_reason (20 points max)
-- - lead_rating (15 points max)
-- Total: 0-100 points
