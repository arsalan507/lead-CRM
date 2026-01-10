-- ================================================
-- CRITICAL: RUN THIS IN SUPABASE SQL EDITOR
-- ================================================
-- Go to: https://supabase.com/dashboard/project/xjcimairaesuxvszbkah/sql/new
-- Copy this entire file and click "Run"
-- ================================================

-- Add review_status column to leads table
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'pending'
CHECK (review_status IN ('pending', 'yet_to_review', 'reviewed'));

-- Add reviewed_by column to leads table
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS reviewed_by UUID;

-- Add incentive tracking columns
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS has_incentive BOOLEAN DEFAULT NULL;

ALTER TABLE leads
ADD COLUMN IF NOT EXISTS incentive_amount DECIMAL(10, 2) DEFAULT NULL;

-- Update existing WIN leads to have pending status
UPDATE leads
SET review_status = 'pending'
WHERE status = 'win' AND review_status IS NULL;

-- ================================================
-- That's it! Click "Run" above
-- ================================================
