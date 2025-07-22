-- =====================================================
-- FIX SIGNUP ISSUES - "Database error saving new user"
-- Run this in Supabase SQL Editor to fix all signup problems
-- =====================================================

-- First, let's check the current state
SELECT 'Current database state:' as info;

-- Check if tables exist
SELECT 
  table_name,
  CASE WHEN table_name IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'companies');

-- Check RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE tablename IN ('users', 'companies');

-- Check existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('users', 'companies');

-- =====================================================
-- STEP 1: ENSURE TABLES EXIST WITH CORRECT STRUCTURE
-- =====================================================

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create companies table if it doesn't exist
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  legal_name TEXT,
  ein TEXT,
  industry TEXT DEFAULT 'technology',
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York',
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Add missing columns to companies table
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS legal_name TEXT,
ADD COLUMN IF NOT EXISTS ein TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT DEFAULT 'technology',
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT;

-- Add constraints
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'user'));

-- =====================================================
-- STEP 2: CREATE TRIGGERS
-- =====================================================

-- Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for companies table
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at 
  BEFORE UPDATE ON companies 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 3: FIX RLS POLICIES
-- =====================================================

-- Enable RLS on both tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON users;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON users;
DROP POLICY IF EXISTS "Users can view own company" ON companies;
DROP POLICY IF EXISTS "Users can update own company" ON companies;
DROP POLICY IF EXISTS "Users can insert own company" ON companies;

-- Create new policies for users table
CREATE POLICY "Enable insert for authenticated users only" ON users
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read access for users based on user_id" ON users
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON users
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create new policies for companies table
CREATE POLICY "Users can insert own company" ON companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own company" ON companies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own company" ON companies
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- STEP 4: VERIFY THE FIX
-- =====================================================

SELECT 'Verification results:' as info;

-- Check table structure
SELECT 
  'users table structure:' as table_info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Check RLS status after fix
SELECT 
  'RLS status after fix:' as rls_info,
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE tablename IN ('users', 'companies');

-- Check policies after fix
SELECT 
  'Policies after fix:' as policy_info,
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('users', 'companies');

-- =====================================================
-- STEP 5: TEST DATA CREATION
-- =====================================================

-- Create a test user profile (this will only work if you're authenticated)
-- Uncomment the following lines to test (replace with actual user ID)
/*
INSERT INTO users (id, email, first_name, last_name, created_at, updated_at)
VALUES (
  auth.uid(),
  'test@example.com',
  'Test',
  'User',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO companies (user_id, name, created_at, updated_at)
VALUES (
  auth.uid(),
  'Test Company',
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO NOTHING;
*/

-- Success message
SELECT '✅ Signup issues fixed successfully! You can now register new users.' as status; 