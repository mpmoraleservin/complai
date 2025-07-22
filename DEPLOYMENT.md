# 🚀 Deployment Guide

## Environment Variables Setup

### Required Environment Variables

Make sure to set these environment variables in your deployment platform:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Vercel Deployment

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add the required variables above
   - Make sure to set them for Production, Preview, and Development environments
3. **Deploy** - Vercel will automatically build and deploy

### How to get Supabase credentials:

1. **Go to your Supabase project dashboard**
2. **Settings → API**
3. **Copy these values:**
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Local Development

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

## Build Process

The build process includes:

1. **Environment check** - Verifies required variables
2. **Mock mode fallback** - If variables are missing, uses mock mode
3. **Static generation** - Generates static pages where possible
4. **Dynamic rendering** - Renders auth-dependent pages dynamically

## Troubleshooting

### Build Errors

If you see "Supabase environment variables are required in production":

1. **Check environment variables** are set correctly in Vercel
2. **Verify variable names** match exactly (case-sensitive)
3. **Ensure values** are not placeholder values
4. **Redeploy** after setting variables

### Mock Mode

If the app runs in mock mode:

- Signup/login will be simulated
- No real database operations
- Perfect for testing UI/UX

### Production Setup

For production:

1. Set up Supabase project
2. Configure environment variables in Vercel
3. Run database migrations
4. Deploy application

## Support

If you encounter issues:

1. Check the build logs in Vercel
2. Verify environment variables are set
3. Test locally with `npm run dev`
4. Check Supabase project status
