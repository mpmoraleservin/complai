#!/usr/bin/env node

/**
 * Deep Diagnosis for Signup Issues
 * This script performs a comprehensive analysis of the signup problem
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables manually
function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const env = {};
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          env[key] = valueParts.join('=');
        }
      }
    });
    
    return env;
  } catch (error) {
    console.log('Could not load .env.local file');
    return {};
  }
}

const env = loadEnvFile('.env.local');
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 DEEP DIAGNOSIS - Signup Issue Analysis\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseSchema() {
  console.log('📊 Checking database schema...');
  
  try {
    // Check if tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['users', 'companies']);
    
    if (tablesError) {
      console.log(`   ❌ Error checking tables: ${tablesError.message}`);
      return false;
    }
    
    console.log(`   ✅ Tables found: ${tables.map(t => t.table_name).join(', ')}`);
    
    // Check users table structure
    const { data: userColumns, error: userColumnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'users');
    
    if (userColumnsError) {
      console.log(`   ❌ Error checking user columns: ${userColumnsError.message}`);
    } else {
      console.log(`   📋 Users table columns: ${userColumns.map(c => c.column_name).join(', ')}`);
    }
    
    return true;
  } catch (error) {
    console.log(`   ❌ Schema check failed: ${error.message}`);
    return false;
  }
}

async function checkRLSStatus() {
  console.log('\n🔒 Checking RLS status...');
  
  try {
    // Check RLS status using a direct query
    const { data: rlsStatus, error: rlsError } = await supabase
      .rpc('check_rls_status');
    
    if (rlsError) {
      console.log(`   ⚠️  Could not check RLS via RPC: ${rlsError.message}`);
      console.log(`   💡 This is normal if the function doesn't exist`);
    } else {
      console.log(`   📋 RLS Status:`, rlsStatus);
    }
    
    // Try to insert a test record to see what happens
    console.log('\n🧪 Testing insert capability...');
    const testId = `test-${Date.now()}`;
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert({
        id: testId,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (insertError) {
      console.log(`   ❌ Insert test failed: ${insertError.message}`);
      console.log(`   Error code: ${insertError.code}`);
      console.log(`   Error details: ${insertError.details}`);
      console.log(`   Error hint: ${insertError.hint}`);
      return false;
    } else {
      console.log(`   ✅ Insert test successful!`);
      
      // Clean up test record
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', testId);
      
      if (deleteError) {
        console.log(`   ⚠️  Could not clean up test record: ${deleteError.message}`);
      } else {
        console.log(`   🧹 Test record cleaned up`);
      }
      
      return true;
    }
  } catch (error) {
    console.log(`   ❌ RLS check failed: ${error.message}`);
    return false;
  }
}

async function testAuthSignup() {
  console.log('\n🔐 Testing auth signup specifically...');
  
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  
  try {
    console.log(`   Testing with email: ${testEmail}`);
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          email: testEmail
        }
      }
    });
    
    if (authError) {
      console.log(`   ❌ Auth signup failed: ${authError.message}`);
      console.log(`   Error code: ${authError.code}`);
      console.log(`   Error details: ${authError.details}`);
      
      // Check if it's a specific database error
      if (authError.message.includes('Database error')) {
        console.log(`   🔍 This is a database-level error, not auth-level`);
        console.log(`   💡 The issue is likely in the database triggers or policies`);
      }
      
      return false;
    }
    
    console.log(`   ✅ Auth signup successful!`);
    console.log(`   User ID: ${authData.user?.id}`);
    console.log(`   Session created: ${authData.session ? 'Yes' : 'No'}`);
    
    // Clean up
    if (authData.user?.id) {
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
        console.log(`   🧹 Test user cleaned up`);
      } catch (cleanupError) {
        console.log(`   ⚠️  Could not clean up test user: ${cleanupError.message}`);
      }
    }
    
    return true;
  } catch (error) {
    console.log(`   ❌ Unexpected error: ${error.message}`);
    return false;
  }
}

async function checkSupabaseConfig() {
  console.log('\n⚙️  Checking Supabase configuration...');
  
  try {
    // Check if we can access the auth API
    const { data: authConfig, error: authConfigError } = await supabase.auth.getSession();
    
    if (authConfigError) {
      console.log(`   ❌ Auth API error: ${authConfigError.message}`);
    } else {
      console.log(`   ✅ Auth API accessible`);
    }
    
    // Check project URL and key format
    console.log(`   📋 Supabase URL: ${supabaseUrl.substring(0, 30)}...`);
    console.log(`   📋 Supabase Key: ${supabaseKey.substring(0, 20)}...`);
    
    // Validate URL format
    if (!supabaseUrl.includes('supabase.co')) {
      console.log(`   ⚠️  Supabase URL doesn't look like a standard Supabase URL`);
    }
    
    // Validate key format
    if (!supabaseKey.startsWith('eyJ')) {
      console.log(`   ⚠️  Supabase key doesn't look like a JWT token`);
    }
    
    return true;
  } catch (error) {
    console.log(`   ❌ Config check failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting deep diagnosis...\n');
  
  const results = {
    schema: await checkDatabaseSchema(),
    rls: await checkRLSStatus(),
    auth: await testAuthSignup(),
    config: await checkSupabaseConfig()
  };
  
  console.log('\n📋 DIAGNOSIS RESULTS:');
  console.log(`   Database Schema: ${results.schema ? '✅ OK' : '❌ ISSUE'}`);
  console.log(`   RLS Status: ${results.rls ? '✅ OK' : '❌ ISSUE'}`);
  console.log(`   Auth Signup: ${results.auth ? '✅ OK' : '❌ ISSUE'}`);
  console.log(`   Configuration: ${results.config ? '✅ OK' : '❌ ISSUE'}`);
  
  console.log('\n🔧 RECOMMENDED ACTIONS:');
  
  if (!results.schema) {
    console.log('1. ❌ Database schema issue - Check if tables exist');
  }
  
  if (!results.rls) {
    console.log('2. ❌ RLS issue - Run the simple fix script');
  }
  
  if (!results.auth) {
    console.log('3. ❌ Auth signup issue - This is the main problem');
    console.log('   💡 Try running: scripts/simple-fix-signup.sql in Supabase');
  }
  
  if (!results.config) {
    console.log('4. ❌ Configuration issue - Check environment variables');
  }
  
  if (results.schema && results.rls && results.auth && results.config) {
    console.log('✅ All checks passed - signup should work!');
  }
  
  console.log('\n📞 If issues persist:');
  console.log('- Check Supabase project status');
  console.log('- Verify environment variables');
  console.log('- Check browser console for errors');
}

main().catch(console.error); 