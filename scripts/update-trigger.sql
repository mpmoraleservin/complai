-- =====================================================
-- UPDATE TRIGGER TO USE USER METADATA CORRECTLY
-- Run this in Supabase SQL Editor to fix the trigger
-- =====================================================

-- Step 1: Drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Update the function to use correct metadata keys
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into users table when a new auth user is created
  INSERT INTO public.users (id, email, first_name, last_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'firstName', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', NEW.raw_user_meta_data->>'lastName', ''),
    NOW(),
    NOW()
  );
  
  -- Insert into companies table
  INSERT INTO public.companies (user_id, name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'company', 'Default Company'),
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 4: Verify the fix
SELECT 'Trigger updated successfully!' as status;

-- Step 5: Show the updated function
SELECT 
  'Updated function:' as info,
  pg_get_functiondef(oid) as function_definition
FROM pg_proc 
WHERE proname = 'handle_new_user'; 