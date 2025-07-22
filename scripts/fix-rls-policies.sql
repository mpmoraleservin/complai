-- =====================================================
-- FIX RLS POLICIES FOR AUTH FLOW
-- Run this in Supabase SQL Editor to fix "Database error saving new user"
-- =====================================================

-- First, let's check if the users table exists and has RLS enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'users';

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Enable RLS on users table (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a more permissive policy for user registration
-- This allows users to insert their profile during signup
CREATE POLICY "Enable insert for authenticated users only" ON users
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create policy for viewing own profile
CREATE POLICY "Enable read access for users based on user_id" ON users
  FOR SELECT 
  USING (auth.uid() = id);

-- Create policy for updating own profile
CREATE POLICY "Enable update for users based on user_id" ON users
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create a fallback policy for development/testing
-- This allows all operations if RLS is causing issues
-- COMMENT OUT THIS POLICY IN PRODUCTION
-- CREATE POLICY "Allow all operations for development" ON users
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users';

-- Test the setup by checking if we can insert a test user
-- (This will only work if you have a valid auth.uid())
-- INSERT INTO users (id, email, created_at, updated_at) 
-- VALUES (auth.uid(), 'test@example.com', NOW(), NOW())
-- ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- ADDITIONAL FIXES FOR COMMON ISSUES
-- =====================================================

-- Make sure the users table has the correct structure
-- If the table doesn't exist, create it
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

-- Add any missing columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York',
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Add constraint if it doesn't exist
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'user'));

-- Create trigger for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Check RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'users';

-- Check policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users';

-- Success message
SELECT 'RLS policies fixed successfully! You can now register new users.' as status; 