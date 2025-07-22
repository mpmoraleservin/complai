-- =====================================================
-- SIMPLE FIX FOR SIGNUP - Disable RLS for development
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Disable RLS completely for development
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;

-- Step 2: Verify the fix
SELECT 'Simple fix applied - RLS disabled for development!' as status;

-- Step 3: Show current status
SELECT 
  'Current RLS status:' as info,
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE tablename IN ('users', 'companies');

-- Step 4: Test that we can insert
DO $$
BEGIN
    -- Try to insert a test record
    INSERT INTO users (id, email, first_name, last_name, created_at, updated_at)
    VALUES ('test-id-' || extract(epoch from now())::text, 'test@example.com', 'Test', 'User', now(), now());
    
    RAISE NOTICE '✅ Test insert successful - RLS is disabled and working!';
    
    -- Clean up the test record
    DELETE FROM users WHERE id LIKE 'test-id-%';
    RAISE NOTICE '✅ Test record cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Still having issues: %', SQLERRM;
END $$;

-- IMPORTANT: This disables security for development
-- Remember to re-enable RLS and add proper policies for production 