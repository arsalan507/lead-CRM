-- ============================================
-- Database Updates - January 10, 2026
-- ============================================
-- This file contains all database schema updates made today

-- ============================================
-- 1. LEADS TABLE UPDATES
-- ============================================

-- Add review status for win leads
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS review_status VARCHAR(20) DEFAULT 'pending'
CHECK (review_status IN ('pending', 'yet_to_review', 'reviewed'));

-- Add reviewed_by to track who reviewed the lead
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add incentive tracking columns
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS has_incentive BOOLEAN DEFAULT NULL;

ALTER TABLE leads
ADD COLUMN IF NOT EXISTS incentive_amount DECIMAL(10,2) DEFAULT NULL;

-- Add lead rating for lost leads (1-5 stars)
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS lead_rating INTEGER
CHECK (lead_rating >= 1 AND lead_rating <= 5);

-- Add purchase timeline for lost leads
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS purchase_timeline VARCHAR(20)
CHECK (purchase_timeline IN ('today', '3_days', '7_days', '30_days'));

-- Add reason for not purchasing today
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS not_today_reason VARCHAR(50)
CHECK (not_today_reason IN ('need_family_approval', 'price_high', 'want_more_options', 'just_browsing', 'other'));

-- Add custom reason text when "other" is selected
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS other_reason TEXT;

-- Add deal size for lost leads
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS deal_size DECIMAL(10,2);

-- Add model name for lost leads
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS model_name VARCHAR(255);

-- ============================================
-- 2. USERS TABLE UPDATES
-- ============================================

-- Ensure role column exists with proper constraints
-- (This might already exist, but we're ensuring it's properly set up)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users
        ADD COLUMN role VARCHAR(20) DEFAULT 'sales_rep'
        CHECK (role IN ('admin', 'sales_rep'));
    END IF;
END $$;

-- Update existing users to have proper roles if needed
-- (Commented out - uncomment and adjust as needed for your data)
-- UPDATE users SET role = 'admin' WHERE phone = 'YOUR_ADMIN_PHONE';

-- ============================================
-- 3. INDEXES FOR PERFORMANCE
-- ============================================

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_leads_review_status ON leads(review_status);
CREATE INDEX IF NOT EXISTS idx_leads_reviewed_by ON leads(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_leads_sales_rep_status ON leads(sales_rep_id, status);
CREATE INDEX IF NOT EXISTS idx_leads_organization_status ON leads(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on leads table if not already enabled
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view leads from their organization" ON leads;
DROP POLICY IF EXISTS "Admins can insert leads" ON leads;
DROP POLICY IF EXISTS "Admins can update leads" ON leads;
DROP POLICY IF EXISTS "Admins can delete leads" ON leads;

-- Create policies for leads table
CREATE POLICY "Users can view leads from their organization"
ON leads FOR SELECT
TO authenticated
USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can insert leads"
ON leads FOR INSERT
TO authenticated
WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Admins can update leads"
ON leads FOR UPDATE
TO authenticated
USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can delete leads"
ON leads FOR DELETE
TO authenticated
USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);

-- ============================================
-- 5. SAMPLE DATA UPDATES (Optional)
-- ============================================

-- Update review_status for existing win leads
UPDATE leads
SET review_status = 'pending'
WHERE status = 'win'
AND review_status IS NULL;

-- ============================================
-- 6. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN leads.review_status IS 'Status of admin review for win leads: pending, yet_to_review, or reviewed';
COMMENT ON COLUMN leads.reviewed_by IS 'User ID of admin who reviewed the lead';
COMMENT ON COLUMN leads.has_incentive IS 'Whether the sales rep gets incentive for this lead (NULL = not reviewed yet)';
COMMENT ON COLUMN leads.incentive_amount IS 'Amount of incentive given to sales rep';
COMMENT ON COLUMN leads.lead_rating IS 'Rating of lead conversion likelihood (1-5 stars) - mandatory for lost leads';
COMMENT ON COLUMN leads.purchase_timeline IS 'When customer plans to purchase: today, 3_days, 7_days, or 30_days';
COMMENT ON COLUMN leads.not_today_reason IS 'Reason why customer is not buying today';
COMMENT ON COLUMN leads.other_reason IS 'Custom reason text when not_today_reason is "other"';
COMMENT ON COLUMN leads.deal_size IS 'Estimated deal size for lost leads';
COMMENT ON COLUMN leads.model_name IS 'Model/product name customer was interested in for lost leads';
COMMENT ON COLUMN users.role IS 'User role: admin (full access) or sales_rep (limited access)';

-- ============================================
-- 7. VERIFICATION QUERIES
-- ============================================

-- Run these queries to verify the updates:

-- Check leads table structure
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'leads'
-- ORDER BY ordinal_position;

-- Check users table structure
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'users'
-- ORDER BY ordinal_position;

-- Count leads by review status
-- SELECT review_status, COUNT(*) as count
-- FROM leads
-- WHERE status = 'win'
-- GROUP BY review_status;

-- Count users by role
-- SELECT role, COUNT(*) as count
-- FROM users
-- GROUP BY role;

-- ============================================
-- END OF MIGRATION
-- ============================================
