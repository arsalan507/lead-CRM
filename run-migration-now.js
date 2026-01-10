const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xjcimairaesuxvszbkah.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqY2ltYWlyYWVzdXh2c3pia2FoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYwNjMzMiwiZXhwIjoyMDgzMTgyMzMyfQ.iDwdAiIMNacv8eMnxTfBvZw2pJ3zeYHuzphKRazxqKc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🔵 Starting database migration...\n');

  // Test if columns already exist
  const { data: testData, error: testError } = await supabase
    .from('leads')
    .select('review_status, reviewed_by')
    .limit(1);

  if (!testError) {
    console.log('✅ Columns already exist! Migration not needed.');
    console.log('Sample data:', testData);
    return;
  }

  console.log('⚠️  Columns do not exist. Need to run migration.');
  console.log('\n📋 MANUAL STEPS REQUIRED:\n');
  console.log('1. Go to: https://supabase.com/dashboard/project/xjcimairaesuxvszbkah/sql/new');
  console.log('2. Copy and paste the contents of: referral-earnings-updates.sql');
  console.log('3. Click "Run" to execute the migration\n');
  console.log('The SQL file adds the following columns to the leads table:');
  console.log('  - review_status (TEXT)');
  console.log('  - reviewed_by (UUID)');
  console.log('  - has_incentive (BOOLEAN)');
  console.log('  - incentive_amount (DECIMAL)\n');
}

runMigration().catch(console.error);
