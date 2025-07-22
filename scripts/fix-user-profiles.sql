-- =====================================================
-- FIX MISSING USER PROFILES
-- Run this in Supabase SQL Editor to create profiles for users who registered but don't have profiles
-- =====================================================

-- First, let's see which auth users don't have profiles
SELECT 
  au.id as auth_user_id,
  au.email as auth_email,
  au.created_at as auth_created_at,
  CASE WHEN u.id IS NULL THEN 'MISSING' ELSE 'EXISTS' END as profile_status
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE u.id IS NULL
ORDER BY au.created_at DESC;

-- Create profiles for users who don't have them
INSERT INTO users (id, email, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Create default company records for users who don't have them
INSERT INTO companies (user_id, name, created_at, updated_at)
SELECT 
  u.id,
  'My Company',
  NOW(),
  NOW()
FROM users u
LEFT JOIN companies c ON u.id = c.user_id
WHERE c.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Verify the fix
SELECT 
  'Profile creation summary:' as info,
  COUNT(*) as total_users,
  COUNT(u.id) as users_with_profiles,
  COUNT(*) - COUNT(u.id) as users_without_profiles
FROM auth.users au
LEFT JOIN users u ON au.id = u.id;

-- Check company creation
SELECT 
  'Company creation summary:' as info,
  COUNT(*) as total_users,
  COUNT(c.user_id) as users_with_companies,
  COUNT(*) - COUNT(c.user_id) as users_without_companies
FROM users u
LEFT JOIN companies c ON u.id = c.user_id;

-- Show the final status
SELECT 
  au.id as auth_user_id,
  au.email as auth_email,
  au.created_at as auth_created_at,
  CASE WHEN u.id IS NULL THEN 'MISSING' ELSE 'EXISTS' END as profile_status
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
ORDER BY au.created_at DESC;

-- Success message
SELECT 'User profiles and companies fixed successfully!' as status; 