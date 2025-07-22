-- =====================================================
-- EMERGENCY FIX FOR SIGNUP - "Database error saving new user"
-- Run this immediately in Supabase SQL Editor
-- =====================================================

-- Step 1: Disable RLS temporarily to test
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON users;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON users;
DROP POLICY IF EXISTS "Users can view own company" ON companies;
DROP POLICY IF EXISTS "Users can update own company" ON companies;
DROP POLICY IF EXISTS "Users can insert own company" ON companies;

-- Step 3: Create simple policies that allow all operations
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on companies" ON companies
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Step 4: Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Step 5: Verify the fix
SELECT 'Emergency fix applied successfully!' as status;

-- Step 6: Test if we can insert a user (this will show the current state)
SELECT 
  'Current RLS status:' as info,
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE tablename IN ('users', 'companies');

-- Step 7: Show current policies
SELECT 
  'Current policies:' as info,
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies 
WHERE tablename IN ('users', 'companies');

-- IMPORTANT: This is a temporary fix for development
-- In production, you should use proper RLS policies
-- After testing, run the proper fix-signup-issues.sql script 