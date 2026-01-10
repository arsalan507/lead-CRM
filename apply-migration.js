const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xjcimairaesuxvszbkah.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqY2ltYWlyYWVzdXh2c3pia2FoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYwNjMzMiwiZXhwIjoyMDgzMTgyMzMyfQ.iDwdAiIMNacv8eMnxTfBvZw2pJ3zeYHuzphKRazxqKc';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function executeSql(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql })
  });
  
  const result = await response.text();
  return { ok: response.ok, status: response.status, result };
}

async function runMigration() {
  console.log('🔵 Applying database migration...\n');

  const steps = [
    {
      name: 'Add review_status column',
      sql: `ALTER TABLE leads ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'pending';`
    },
    {
      name: 'Add reviewed_by column',
      sql: `ALTER TABLE leads ADD COLUMN IF NOT EXISTS reviewed_by UUID;`
    },
    {
      name: 'Add has_incentive column',
      sql: `ALTER TABLE leads ADD COLUMN IF NOT EXISTS has_incentive BOOLEAN DEFAULT NULL;`
    },
    {
      name: 'Add incentive_amount column',
      sql: `ALTER TABLE leads ADD COLUMN IF NOT EXISTS incentive_amount DECIMAL(10, 2) DEFAULT NULL;`
    }
  ];

  for (const step of steps) {
    console.log(`▶️  ${step.name}...`);
    const result = await executeSql(step.sql);
    if (result.ok || result.status === 404) {
      console.log(`  ✅ Success`);
    } else {
      console.log(`  ❌ Failed: ${result.status} - ${result.result}`);
    }
  }

  // Verify columns exist now
  console.log('\n🔍 Verifying migration...');
  const { data, error } = await supabase
    .from('leads')
    .select('id, review_status, reviewed_by, has_incentive, incentive_amount')
    .limit(1);

  if (error) {
    console.log('❌ Verification failed:', error.message);
    console.log('\n⚠️  The columns might not have been created.');
    console.log('Please run the SQL manually in Supabase dashboard:');
    console.log('https://supabase.com/dashboard/project/xjcimairaesuxvszbkah/sql/new\n');
  } else {
    console.log('✅ Migration successful! Columns exist and can be queried.');
    console.log('Sample:', data);
  }
}

runMigration().catch(console.error);
