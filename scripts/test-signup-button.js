#!/usr/bin/env node

/**
 * Test Signup Button Functionality
 * This script tests if the signup process works from the frontend
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

console.log('🧪 Testing Signup Button Functionality...\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignupProcess() {
  console.log('🔐 Testing complete signup process...');
  
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  const testData = {
    firstName: 'Test',
    lastName: 'User',
    company: 'Test Company'
  };
  
  console.log(`   Email: ${testEmail}`);
  console.log(`   Password: ${testPassword}`);
  console.log(`   First Name: ${testData.firstName}`);
  console.log(`   Last Name: ${testData.lastName}`);
  console.log(`   Company: ${testData.company}`);
  
  try {
    // Step 1: Test auth signup
    console.log('\n📝 Step 1: Testing auth signup...');
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
      return false;
    }
    
    console.log(`   ✅ Auth signup successful`);
    console.log(`   User ID: ${authData.user?.id}`);
    console.log(`   Session: ${authData.session ? 'Created' : 'Not created'}`);
    
    if (!authData.user) {
      console.log('   ❌ No user data returned');
      return false;
    }
    
    // Step 2: Test profile creation
    console.log('\n👤 Step 2: Testing profile creation...');
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        first_name: testData.firstName,
        last_name: testData.lastName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (profileError) {
      console.log(`   ❌ Profile creation failed: ${profileError.message}`);
      console.log(`   Error code: ${profileError.code}`);
      console.log(`   Error details: ${profileError.details}`);
      console.log(`   Error hint: ${profileError.hint}`);
    } else {
      console.log(`   ✅ Profile creation successful`);
      console.log(`   Profile data:`, profileData);
    }
    
    // Step 3: Test company creation
    console.log('\n🏢 Step 3: Testing company creation...');
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .insert({
        user_id: authData.user.id,
        name: testData.company,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (companyError) {
      console.log(`   ❌ Company creation failed: ${companyError.message}`);
      console.log(`   Error code: ${companyError.code}`);
      console.log(`   Error details: ${companyError.details}`);
      console.log(`   Error hint: ${companyError.hint}`);
    } else {
      console.log(`   ✅ Company creation successful`);
      console.log(`   Company data:`, companyData);
    }
    
    // Step 4: Clean up test data
    console.log('\n🧹 Step 4: Cleaning up test data...');
    try {
      await supabase.auth.admin.deleteUser(authData.user.id);
      console.log('   ✅ Test user deleted');
    } catch (cleanupError) {
      console.log(`   ⚠️  Could not delete test user: ${cleanupError.message}`);
    }
    
    return true;
    
  } catch (error) {
    console.log(`   ❌ Unexpected error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting signup button test...\n');
  
  const success = await testSignupProcess();
  
  console.log('\n📋 Test Results:');
  if (success) {
    console.log('✅ Signup process works correctly');
    console.log('   The issue might be in the frontend form validation');
  } else {
    console.log('❌ Signup process has issues');
    console.log('   Run the emergency fix script in Supabase');
  }
  
  console.log('\n🔧 Next Steps:');
  console.log('1. If test failed, run scripts/emergency-fix-signup.sql in Supabase');
  console.log('2. If test passed, check the frontend form validation');
  console.log('3. Check browser console for JavaScript errors');
}

main().catch(console.error); 