# Supabase Setup Guide

## 🔧 Configuration

To fix the "Database error saving new user" issue, you need to properly configure Supabase:

### 1. Create Environment File

Create a `.env.local` file in the root directory with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

### 2. Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy the "Project URL" and "anon public" key

### 3. Database Schema

Make sure you've run the SQL schema in your Supabase SQL Editor:

```sql
-- Run this in Supabase SQL Editor
-- (The complete schema from the previous conversation)
```

### 4. Row Level Security (RLS) - FIX FOR "Database error saving new user"

**This is the most common cause of the error!** Run this SQL in your Supabase SQL Editor:

```sql
-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a more permissive policy for user registration
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
```

**Alternative: Use the complete fix script**
Copy and paste the entire content of `scripts/fix-rls-policies.sql` into your Supabase SQL Editor and run it.

### 5. Test the Setup

1. Restart your development server
2. Try registering a new user
3. Check the browser console for detailed logs

## 🐛 Troubleshooting

### Common Issues:

1. **"Database error saving new user"**

   - Check that RLS policies are configured correctly
   - Verify the database schema is created
   - Ensure environment variables are set correctly

2. **"Supabase environment variables are required"**

   - Create `.env.local` file with proper credentials
   - Restart the development server

3. **"RLS policy violation"**
   - Check that the user ID matches the authenticated user
   - Verify RLS policies are enabled and configured

### Development Mode

If you don't have Supabase configured, the app will run in mock mode for development purposes.

## 🚀 Quick Fix Steps

If you're getting "Database error saving new user":

1. **Run the diagnostic script:**

   ```bash
   node scripts/check-auth-setup.js
   ```

2. **Run the comprehensive debug script:**

   ```bash
   node scripts/debug-signup.js
   ```

3. **Fix all issues in Supabase:**

   - Go to your Supabase Dashboard
   - Open SQL Editor
   - Copy and paste the content of `scripts/fix-signup-issues.sql`
   - Click "Run"
   - This will fix tables, RLS policies, and triggers

4. **Restart your development server:**

   ```bash
   npm run dev
   ```

5. **Test registration again**

## 🔍 Debugging

Check the browser console for detailed logs. The improved auth flow now includes:

- Detailed error messages
- Step-by-step logging
- Better error handling
- Mock mode fallback

## 🛠️ Fixing "Profile creation failed" Error

If you see "Registration successful but profile creation failed":

### Option 1: Automatic Fix (Recommended)

1. Go to your Account Profile page (`/settings`)
2. If you see a "Create Profile" button, click it
3. The system will automatically create your profile

### Option 2: Manual Database Fix

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the content of `scripts/fix-user-profiles.sql`
3. Click "Run"
4. This will create profiles for all users who registered but don't have profiles

### Option 3: Retry During Login

The system now automatically tries to create profiles during login, so try signing out and signing back in.

## 🔄 Profile Creation Flow

The improved system now:

1. **Checks if profile exists** before trying to create
2. **Retries during login** if profile creation failed during registration
3. **Provides manual retry** in Account Settings
4. **Shows clear status** of profile creation attempts
5. **Continues registration** even if profile creation fails
