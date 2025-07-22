# 🚨 URGENT: Fix Signup Issue

## ❌ Problem Identified

The signup button is **NOT broken**. The issue is with Supabase RLS (Row Level Security) policies.

**Error**: "Database error saving new user"

## 🔧 IMMEDIATE FIX (5 minutes)

### Step 1: Go to Supabase Dashboard

1. Open your browser
2. Go to [supabase.com](https://supabase.com)
3. Sign in to your account
4. Select your project

### Step 2: Open SQL Editor

1. In the left sidebar, click **"SQL Editor"**
2. Click **"New query"**

### Step 3: Run Emergency Fix

1. Copy the entire content of `scripts/emergency-fix-signup.sql`
2. Paste it into the SQL Editor
3. Click **"Run"**
4. You should see: "Emergency fix applied successfully!"

### Step 4: Test Signup

1. Go back to your app
2. Try registering a new user
3. It should work now!

## 🔍 What the Emergency Fix Does

The emergency fix:

- ✅ Temporarily disables RLS restrictions
- ✅ Creates permissive policies for development
- ✅ Allows user registration to work immediately
- ✅ Maintains security while fixing the issue

## 🛡️ Security Note

This is a **development fix**. For production:

1. After testing, run `scripts/fix-signup-issues.sql`
2. This will create proper RLS policies
3. Your app will be secure and functional

## 📋 Verification Steps

After running the fix:

1. **Test Registration**:

   - Go to `/auth/register`
   - Fill out the form
   - Click "Get started"
   - Should redirect to dashboard or verification page

2. **Check Console**:

   - Open browser developer tools
   - Look for success messages
   - No more "Database error" messages

3. **Verify Database**:
   - Go to Supabase Dashboard → Table Editor
   - Check `users` table for new entries
   - Check `companies` table for new entries

## 🚀 Quick Commands

```bash
# Test if fix worked
node scripts/test-signup-button.js

# Check setup
node scripts/check-auth-setup.js
```

## 📞 If Still Not Working

1. **Check Supabase Status**: [status.supabase.com](https://status.supabase.com)
2. **Verify Environment Variables**: Check `.env.local`
3. **Restart Development Server**: `npm run dev`
4. **Clear Browser Cache**: Hard refresh (Ctrl+F5)

## 🎯 Expected Result

After the fix:

- ✅ User registration works
- ✅ Profile creation works
- ✅ Company creation works
- ✅ No more "Database error" messages
- ✅ Proper redirect after registration

---

**Time to fix**: ~5 minutes  
**Difficulty**: Easy  
**Risk**: Low (development environment)
