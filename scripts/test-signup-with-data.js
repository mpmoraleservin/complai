#!/usr/bin/env node

/**
 * Test Signup with User Data
 * This script tests that signup correctly saves first name, last name, and company
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

console.log('🧪 Testing Signup with User Data...\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignupWithData() {
  console.log('🔐 Testing signup with user data...');
  
  const testEmail = `testuser${Date.now()}@gmail.com`;
  const testPassword = 'testpassword123';
  const testData = {
    firstName: 'John',
    lastName: 'Doe',
    company: 'Test Company Inc.'
  };
  
  console.log(`   Email: ${testEmail}`);
  console.log(`   Password: ${testPassword}`);
  console.log(`   First Name: ${testData.firstName}`);
  console.log(`   Last Name: ${testData.lastName}`);
  console.log(`   Company: ${testData.company}`);
  
  try {
    // Step 1: Sign up with user data
    console.log('\n📝 Step 1: Signing up with user data...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          email: testEmail,
          first_name: testData.firstName,
          last_name: testData.lastName,
          company: testData.company
        }
      }
    });
    
    if (authError) {
      console.log(`   ❌ Auth signup failed: ${authError.message}`);
      console.log(`   Error code: ${authError.code}`);
      console.log(`   Error details: ${authError.details}`);
      return false;
    }
    
    console.log(`   ✅ Auth signup successful!`);
    console.log(`   User ID: ${authData.user?.id}`);
    console.log(`   Session created: ${authData.session ? 'Yes' : 'No'}`);
    
    if (!authData.user) {
      console.log('   ❌ No user data returned');
      return false;
    }
    
    // Step 2: Check user metadata
    console.log('\n👤 Step 2: Checking user metadata...');
    const user = authData.user;
    console.log(`   User metadata:`, user.user_metadata);
    
    const metadataCheck = {
      first_name: user.user_metadata?.first_name === testData.firstName,
      last_name: user.user_metadata?.last_name === testData.lastName,
      company: user.user_metadata?.company === testData.company,
      email: user.user_metadata?.email === testEmail
    };
    
    console.log(`   ✅ First name saved: ${metadataCheck.first_name}`);
    console.log(`   ✅ Last name saved: ${metadataCheck.last_name}`);
    console.log(`   ✅ Company saved: ${metadataCheck.company}`);
    console.log(`   ✅ Email saved: ${metadataCheck.email}`);
    
    // Step 3: Check if profile was created in users table
    console.log('\n📊 Step 3: Checking users table...');
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.log(`   ⚠️  Could not check users table: ${profileError.message}`);
      console.log(`   💡 This might be expected if RLS is blocking access`);
    } else {
      console.log(`   ✅ Profile found in users table`);
      console.log(`   Profile data:`, profileData);
    }
    
    // Step 4: Check if company was created
    console.log('\n🏢 Step 4: Checking companies table...');
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (companyError) {
      console.log(`   ⚠️  Could not check companies table: ${companyError.message}`);
      console.log(`   💡 This might be expected if RLS is blocking access`);
    } else {
      console.log(`   ✅ Company found in companies table`);
      console.log(`   Company data:`, companyData);
    }
    
    // Step 5: Clean up
    console.log('\n🧹 Step 5: Cleaning up test data...');
    try {
      await supabase.auth.admin.deleteUser(user.id);
      console.log(`   ✅ Test user deleted`);
    } catch (cleanupError) {
      console.log(`   ⚠️  Could not delete test user: ${cleanupError.message}`);
    }
    
    // Summary
    const allMetadataSaved = Object.values(metadataCheck).every(Boolean);
    console.log(`\n📋 SUMMARY:`);
    console.log(`   Metadata saved correctly: ${allMetadataSaved ? '✅ YES' : '❌ NO'}`);
    
    if (!allMetadataSaved) {
      console.log(`   Missing metadata:`, Object.entries(metadataCheck)
        .filter(([key, value]) => !value)
        .map(([key]) => key)
        .join(', '));
    }
    
    return allMetadataSaved;
    
  } catch (error) {
    console.log(`   ❌ Unexpected error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting signup data test...\n');
  
  const success = await testSignupWithData();
  
  console.log('\n📋 TEST RESULTS:');
  if (success) {
    console.log('✅ Signup correctly saves user data');
    console.log('💡 The signup process is working correctly');
  } else {
    console.log('❌ Signup has issues saving user data');
    console.log('💡 Check the error messages above');
  }
  
  console.log('\n🔧 Next Steps:');
  if (success) {
    console.log('1. Test the frontend signup form');
    console.log('2. Verify data appears in Account Profile');
  } else {
    console.log('1. Check Supabase configuration');
    console.log('2. Run the foreign key fix script');
    console.log('3. Check RLS policies');
  }
}

main().catch(console.error); 