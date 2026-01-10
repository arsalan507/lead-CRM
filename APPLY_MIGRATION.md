# Apply Database Migration for Incentive Feature

## Step 1: Run the SQL Migration

You need to apply the database migration to add the incentive fields to your `leads` table.

### Option A: Using Supabase Dashboard (Recommended)

1. Go to: https://supabase.com/dashboard/project/xjcimairaesuxvszbkah/sql/new

2. Copy and paste this SQL:

```sql
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS has_incentive BOOLEAN DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS incentive_amount DECIMAL(10, 2) DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_leads_incentive ON leads(has_incentive)
WHERE has_incentive IS NOT NULL;
```

3. Click "Run" to execute

4. You should see: "Success. No rows returned"

### Option B: Using the Migration File

The migration is also available in: `migrations/add-incentive-fields.sql`

## Step 2: Access Admin Dashboard

Currently, you're logged in as a **sales_rep**. To test the incentive feature:

1. **Logout**: Click the "Logout" button in the current dashboard

2. **Login as Admin**:
   - You need to use an admin account
   - The admin phone number and PIN from your database

3. **Access the Feature**:
   - Navigate to: http://localhost:3000/admin/dashboard
   - Expand any sales rep's section
   - You'll see the new "Incentive" column with Yes/No buttons

## Step 3: Test the Feature

Once logged in as admin:

1. **Initial State**: Each lead shows "Yes" and "No" buttons
2. **Click "No"**: Saves immediately as "No incentive"
3. **Click "Yes"**: Opens input field to enter amount
4. **Enter Amount & Save**: Displays the amount

## Troubleshooting

### If you get "column already exists" error:
The migration was already applied - you're good to go!

### If you don't see the Incentive column:
1. Make sure you're logged in as **admin** (not sales_rep)
2. Clear browser cache and hard refresh (Ctrl+Shift+R)
3. Check browser console for any errors

### To create an admin account:
If you don't have an admin account, you can update an existing user in Supabase:

```sql
UPDATE users
SET role = 'admin'
WHERE phone = 'YOUR_PHONE_NUMBER';
```

## Verify Migration Success

Run this query in Supabase SQL Editor to verify:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'leads'
  AND column_name IN ('has_incentive', 'incentive_amount');
```

You should see:
- `has_incentive` | boolean | YES
- `incentive_amount` | numeric | YES
