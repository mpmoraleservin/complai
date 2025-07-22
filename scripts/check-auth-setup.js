#!/usr/bin/env node

/**
 * Auth Setup Diagnostic Script
 * Run this script to check if your Supabase configuration is correct
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Supabase Auth Setup...\n');

// Check for .env.local file
const envPath = path.join(process.cwd(), '.env.local');
const hasEnvFile = fs.existsSync(envPath);

console.log('📁 Environment File:');
if (hasEnvFile) {
  console.log('✅ .env.local file exists');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL');
  const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  console.log(`   Supabase URL: ${hasSupabaseUrl ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Supabase Key: ${hasSupabaseKey ? '✅ Found' : '❌ Missing'}`);
  
  if (!hasSupabaseUrl || !hasSupabaseKey) {
    console.log('\n⚠️  Please add the missing environment variables to .env.local');
  }
} else {
  console.log('❌ .env.local file not found');
  console.log('   Create .env.local with your Supabase credentials');
}

// Check package.json for required dependencies
console.log('\n📦 Dependencies:');
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const deps = packageJson.dependencies || {};
  
  const requiredDeps = [
    '@supabase/supabase-js',
    '@supabase/auth-helpers-nextjs',
    'react-hook-form',
    '@hookform/resolvers',
    'zod'
  ];
  
  requiredDeps.forEach(dep => {
    const hasDep = deps[dep] || packageJson.devDependencies?.[dep];
    console.log(`   ${dep}: ${hasDep ? '✅ Installed' : '❌ Missing'}`);
  });
}

// Check for auth files
console.log('\n📂 Auth Files:');
const authFiles = [
  'src/lib/hooks/use-auth.ts',
  'src/lib/context/auth-context.tsx',
  'src/lib/supabase/client.ts',
  'src/app/auth/register/page.tsx',
  'src/app/auth/login/page.tsx'
];

authFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const exists = fs.existsSync(filePath);
  console.log(`   ${file}: ${exists ? '✅ Exists' : '❌ Missing'}`);
});

console.log('\n🎯 Next Steps:');
if (!hasEnvFile) {
  console.log('1. Create .env.local with your Supabase credentials');
  console.log('2. Get credentials from Supabase Dashboard → Settings → API');
} else {
  console.log('1. Restart your development server');
  console.log('2. Try registering a new user');
  console.log('3. Check browser console for detailed logs');
}

console.log('\n📚 For more help, see SUPABASE_SETUP.md'); 