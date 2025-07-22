#!/usr/bin/env node

/**
 * Test Signup with Valid UUIDs
 * This script tests the signup process using proper UUIDs
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Simple UUID generator
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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

console.log('🧪 Testing Signup with Valid UUIDs...\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDirectInsert() {
  console.log('📝 Testing direct insert with valid UUID...');
  
  const validUUID = generateUUID();
  const testEmail = `test-${Date.now()}@example.com`;
  
  console.log(`   UUID: ${validUUID}`);
  console.log(`   Email: ${testEmail}`);
  
  try {
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert({
        id: validUUID,
        email: testEmail,
        first_name: 'Test',
        last_name: 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (insertError) {
      console.log(`   ❌ Insert failed: ${insertError.message}`);
      console.log(`   Error code: ${insertError.code}`);
      console.log(`   Error details: ${insertError.details}`);
      console.log(`   Error hint: ${insertError.hint}`);
      return false;
    } else {
      console.log(`   ✅ Insert successful!`);
      console.log(`   Inserted data:`, insertData);
      
      // Clean up
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', validUUID);
      
      if (deleteError) {
        console.log(`   ⚠️  Could not clean up: ${deleteError.message}`);
      } else {
        console.log(`   🧹 Test record cleaned up`);
      }
      
      return true;
    }
  } catch (error) {
    console.log(`   ❌ Unexpected error: ${error.message}`);
    return false;
  }
}

async function testAuthSignup() {
  console.log('\n🔐 Testing auth signup...');
  
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

async function checkTableStructure() {
  console.log('📊 Checking table structure...');
  
  try {
    // Try to get a sample record to understand the structure
    const { data: sampleData, error: sampleError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.log(`   ❌ Could not query users table: ${sampleError.message}`);
      return false;
    }
    
    if (sampleData && sampleData.length > 0) {
      console.log(`   ✅ Users table accessible`);
      console.log(`   📋 Sample record structure:`, Object.keys(sampleData[0]));
    } else {
      console.log(`   ✅ Users table accessible (empty)`);
    }
    
    return true;
  } catch (error) {
    console.log(`   ❌ Table structure check failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting UUID-based tests...\n');
  
  const results = {
    structure: await checkTableStructure(),
    directInsert: await testDirectInsert(),
    authSignup: await testAuthSignup()
  };
  
  console.log('\n📋 TEST RESULTS:');
  console.log(`   Table Structure: ${results.structure ? '✅ OK' : '❌ ISSUE'}`);
  console.log(`   Direct Insert: ${results.directInsert ? '✅ OK' : '❌ ISSUE'}`);
  console.log(`   Auth Signup: ${results.authSignup ? '✅ OK' : '❌ ISSUE'}`);
  
  console.log('\n🔧 ANALYSIS:');
  
  if (results.directInsert && !results.authSignup) {
    console.log('✅ Direct insert works but auth signup fails');
    console.log('💡 The issue is in the auth signup process, not the database');
    console.log('🔧 This suggests a trigger or policy issue during auth signup');
  } else if (!results.directInsert) {
    console.log('❌ Direct insert fails');
    console.log('💡 The issue is with database permissions or RLS');
    console.log('🔧 Run the simple fix script in Supabase');
  } else if (results.authSignup) {
    console.log('✅ Everything works!');
    console.log('💡 The issue might be in the frontend or environment');
  }
  
  console.log('\n📞 Next Steps:');
  if (!results.directInsert) {
    console.log('1. Run scripts/simple-fix-signup.sql in Supabase');
  } else if (!results.authSignup) {
    console.log('1. Check Supabase auth settings');
    console.log('2. Check for database triggers');
  } else {
    console.log('1. Test the frontend signup form');
    console.log('2. Check browser console for errors');
  }
}

main().catch(console.error); 