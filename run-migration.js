const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('🔄 Running incentive field migration...');
    console.log('Connected to:', supabaseUrl);

    // Add incentive columns to leads table
    const sql = `
      ALTER TABLE leads
        ADD COLUMN IF NOT EXISTS has_incentive BOOLEAN DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS incentive_amount DECIMAL(10, 2) DEFAULT NULL;

      CREATE INDEX IF NOT EXISTS idx_leads_incentive ON leads(has_incentive) WHERE has_incentive IS NOT NULL;
    `;

    // Execute using Supabase REST API - we'll make a test query first
    console.log('Testing connection...');
    const { error: testError } = await supabase.from('leads').select('id').limit(1);

    if (testError) {
      console.error('❌ Connection test failed:', testError);
      console.log('\n⚠️  Please run the following SQL manually in Supabase SQL Editor:');
      console.log(sql);
      process.exit(1);
    }

    console.log('✅ Connection successful!');
    console.log('\n📋 SQL to run in Supabase SQL Editor:');
    console.log('='.repeat(60));
    console.log(sql);
    console.log('='.repeat(60));
    console.log('\nPlease execute the above SQL in your Supabase SQL Editor:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the SQL above');
    console.log('4. Click "Run" to execute');
    console.log('\nAfter running the SQL, the migration will be complete! ✅');

  } catch (error) {
    console.error('❌ Migration setup failed:', error);
    process.exit(1);
  }
}

runMigration();
