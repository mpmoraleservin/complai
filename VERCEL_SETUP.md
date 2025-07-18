# Vercel Setup Guide - COMPLai

## 🚨 Quick Fix for "Secret does not exist" Error

### Problem

You're seeing: `Environment Variable "NEXT_PUBLIC_SUPABASE_URL" references Secret "supabase_url", which does not exist.`

### Solution (Step by Step)

#### 1. Go to Vercel Dashboard

- Visit: https://vercel.com/dashboard
- Select your COMPLai project

#### 2. Navigate to Environment Variables

- Click **Settings** tab
- Click **Environment Variables** in the left sidebar

#### 3. Add Required Variables

Add these variables **one by one**:

**Variable 1:**

- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://your-project-id.supabase.co`
- Environment: Production (check all boxes)
- Click **Save**

**Variable 2:**

- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your anon key)
- Environment: Production (check all boxes)
- Click **Save**

**Variable 3:**

- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your service role key)
- Environment: Production (check all boxes)
- Click **Save**

#### 4. Redeploy

- Go to **Deployments** tab
- Click **Redeploy** on your latest deployment
- Or push a new commit to trigger automatic deployment

## 📋 Where to Find Your Supabase Credentials

### Step 1: Go to Supabase Dashboard

- Visit: https://supabase.com/dashboard
- Select your COMPLai project

### Step 2: Get API Keys

- Click **Settings** (gear icon) in the left sidebar
- Click **API** in the settings menu
- You'll see:
  - **Project URL**: `https://your-project-id.supabase.co`
  - **anon public**: Your public API key
  - **service_role secret**: Your service role key

### Step 3: Copy Values

Copy these exact values to Vercel environment variables.

## ✅ Verification Steps

### 1. Check Environment Variables

In Vercel dashboard, verify all variables are set:

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

### 2. Test Deployment

- Visit your deployed app: `https://your-app.vercel.app`
- Try to register a new user
- Verify the authentication flow works

### 3. Check Build Logs

- Go to **Deployments** in Vercel
- Click on the latest deployment
- Check that build completed successfully

## 🔧 Optional Variables (Add Later)

These are optional and can be added when you implement those features:

```bash
# For Contract Generator (Phase 2)
OPENAI_API_KEY=sk-...

# For AI Auditor (Phase 3)
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX_NAME=complai-legal-embeddings

# For E-Signatures (Phase 4)
PANDADOC_API_KEY=your_pandadoc_key
```

## 🚨 Common Issues & Solutions

### Issue 1: "Build still failing"

**Solution**:

- Make sure you added variables to **Production** environment
- Check that variable names are exactly as shown (case-sensitive)
- Redeploy after adding variables

### Issue 2: "Authentication not working"

**Solution**:

- Verify Supabase project is active
- Check that OAuth redirect URLs include your Vercel domain
- Test with a new user registration

### Issue 3: "Database connection failed"

**Solution**:

- Verify Supabase URL and keys are correct
- Check that RLS policies are configured
- Ensure database migrations have been run

## 📞 Need Help?

If you're still having issues:

1. **Check Vercel Build Logs**: Look for specific error messages
2. **Verify Supabase Project**: Ensure it's active and accessible
3. **Test Locally**: Run `npm run build` locally to check for issues
4. **Review Documentation**: Check the full `DEPLOYMENT.md` guide

---

**Last Updated**: July 18, 2024
**Status**: Ready for deployment
