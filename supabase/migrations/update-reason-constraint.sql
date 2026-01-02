-- Migration: Update not_today_reason constraint to include 'other'
-- This allows the new 'other' option to be saved in the database

-- Drop the existing constraint
ALTER TABLE leads
  DROP CONSTRAINT IF EXISTS leads_not_today_reason_check;

-- Add updated constraint with 'other' option
ALTER TABLE leads
  ADD CONSTRAINT leads_not_today_reason_check
  CHECK (not_today_reason IN (
    'need_family_approval',
    'price_high',
    'want_more_options',
    'just_browsing',
    'other'
  ));
