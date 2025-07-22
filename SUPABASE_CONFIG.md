# 🔧 Supabase Configuration Guide

## Fix Email Redirect Issue

The email confirmation is currently redirecting to `localhost:3000` instead of your production domain. Follow these steps to fix it:

### 1. Update Supabase Dashboard Configuration

1. **Go to your Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/[your-project-id]
   ```

2. **Navigate to Settings → Authentication → URL Configuration**

3. **Update these URLs:**
   ```
   Site URL: https://complai-gamma.vercel.app
   
   Redirect URLs:
   - https://complai-gamma.vercel.app/auth/callback
   - https://complai-gamma.vercel.app/dashboard
   - https://complai-gamma.vercel.app/auth/login
   ```

### 2. Verify Email Settings

In **Settings → Authentication → Auth Providers → Email**:
- ✅ **Enable email confirmations** should be enabled
- ✅ **Secure email change** should be enabled

### 3. Update Email Templates

In **Settings → Authentication → Email Templates → Confirm signup**:
- **Subject:** "Confirm Your COMPLai Account"
- **Template:** Use the updated HTML template we created

### 4. Code Changes Applied

✅ **Updated signup function** in `src/lib/hooks/use-auth.ts`:
- Added `emailRedirectTo` option
- Uses production URL in production, localhost in development

### 5. Environment Variables

Ensure these are set in Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=https://aevkohnskujxleffiel.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 6. After Making Changes

1. **Save configuration** in Supabase
2. **Redeploy** your Vercel app
3. **Test** the signup process again

## Expected Result

After these changes, email confirmations should redirect to:
```
https://complai-gamma.vercel.app/auth/callback
```

Instead of:
```
http://localhost:3000/#access_token=...
```
