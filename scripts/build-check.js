#!/usr/bin/env node

/**
 * Build Check Script
 * Verifies environment variables before building
 */

console.log('🔍 Checking environment variables for build...')

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

const missingVars = []

for (const envVar of requiredEnvVars) {
  const value = process.env[envVar]
  if (!value || value === 'your_supabase_url' || value === 'your_supabase_anon_key') {
    missingVars.push(envVar)
    console.log(`❌ Missing or invalid: ${envVar}`)
  } else {
    console.log(`✅ Found: ${envVar}`)
  }
}

if (missingVars.length > 0) {
  console.log('\n⚠️  Some environment variables are missing or invalid.')
  console.log('   The build will continue with mock mode enabled.')
  console.log('   Make sure to set these variables in your deployment environment:')
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`)
  })
} else {
  console.log('\n✅ All environment variables are properly configured.')
}

console.log('\n🚀 Proceeding with build...') 