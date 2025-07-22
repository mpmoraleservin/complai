#!/usr/bin/env node

/**
 * Debug Signup Process
 * This script helps identify why users aren't being created in the database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

console.log('🔍 Debugging Signup Process...\n');

// Check environment variables
console.log('📁 Environment Variables:');
console.log(`   Supabase URL: ${supabaseUrl ? '✅ Found' : '❌ Missing'}`);
console.log(`   Supabase Key: ${supabaseKey ? '✅ Found' : '❌ Missing'}`);

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Missing environment variables. Please check .env.local');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  console.log('\n🔗 Testing Database Connection:');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`   ❌ Database connection failed: ${error.message}`);
      return false;
    }
    
    console.log('   ✅ Database connection successful');
    return true;
  } catch (err) {
    console.log(`   ❌ Database connection error: ${err.message}`);
    return false;
  }
}

async function testRLSPolicies() {
  console.log('\n🔒 Testing RLS Policies:');
  
  try {
    // Test if we can read from users table
    const { data: readData, error: readError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (readError) {
      console.log(`   ❌ Read policy test failed: ${readError.message}`);
    } else {
      console.log('   ✅ Read policy test passed');
    }
    
    // Test if we can insert into users table (this should fail without auth)
    const testUserId = `test-user-${Date.now()}`;
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert({
        id: testUserId,
        email: 'test@example.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (insertError) {
      console.log(`   ⚠️  Insert policy test (expected to fail): ${insertError.message}`);
    } else {
      console.log('   ❌ Insert policy test passed (this should have failed)');
    }
    
  } catch (err) {
    console.log(`   ❌ RLS test error: ${err.message}`);
  }
}

async function testAuthSignup() {
  console.log('\n🔐 Testing Auth Signup:');
  
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    
    console.log(`   Testing with email: ${testEmail}`);
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    });
    
    if (error) {
      console.log(`   ❌ Auth signup failed: ${error.message}`);
      return null;
    }
    
    console.log(`   ✅ Auth signup successful`);
    console.log(`   User ID: ${data.user?.id}`);
    console.log(`   Session: ${data.session ? 'Created' : 'Not created'}`);
    
    return data.user;
  } catch (err) {
    console.log(`   ❌ Auth signup error: ${err.message}`);
    return null;
  }
}

async function testProfileCreation(userId) {
  if (!userId) {
    console.log('\n❌ Cannot test profile creation without user ID');
    return;
  }
  
  console.log('\n👤 Testing Profile Creation:');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.log(`   ❌ Profile creation failed: ${error.message}`);
      console.log(`   Error code: ${error.code}`);
      console.log(`   Error details: ${error.details}`);
      console.log(`   Error hint: ${error.hint}`);
    } else {
      console.log('   ✅ Profile creation successful');
    }
  } catch (err) {
    console.log(`   ❌ Profile creation error: ${err.message}`);
  }
}

async function testCompanyCreation(userId) {
  if (!userId) {
    console.log('\n❌ Cannot test company creation without user ID');
    return;
  }
  
  console.log('\n🏢 Testing Company Creation:');
  
  try {
    const { data, error } = await supabase
      .from('companies')
      .insert({
        user_id: userId,
        name: 'Test Company',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.log(`   ❌ Company creation failed: ${error.message}`);
      console.log(`   Error code: ${error.code}`);
      console.log(`   Error details: ${error.details}`);
      console.log(`   Error hint: ${error.hint}`);
    } else {
      console.log('   ✅ Company creation successful');
    }
  } catch (err) {
    console.log(`   ❌ Company creation error: ${err.message}`);
  }
}

async function main() {
  console.log('🚀 Starting debug process...\n');
  
  // Test database connection
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.log('\n❌ Cannot proceed without database connection');
    return;
  }
  
  // Test RLS policies
  await testRLSPolicies();
  
  // Test auth signup
  const user = await testAuthSignup();
  
  // Test profile creation
  await testProfileCreation(user?.id);
  
  // Test company creation
  await testCompanyCreation(user?.id);
  
  console.log('\n📋 Summary:');
  console.log('1. Check the error messages above');
  console.log('2. If RLS policies are failing, run the fix-rls-policies.sql script');
  console.log('3. If auth signup is failing, check your Supabase project settings');
  console.log('4. If profile/company creation is failing, check the database schema');
  
  console.log('\n🔧 Next Steps:');
  console.log('- Go to Supabase Dashboard → SQL Editor');
  console.log('- Run the content of scripts/fix-rls-policies.sql');
  console.log('- Try registering again');
}

main().catch(console.error); 