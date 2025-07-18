# COMPLai Deployment Guide

## Vercel Deployment

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Environment Variables**: Configure all required environment variables

### Environment Variables Setup

#### Required Variables for Production

**IMPORTANT**: You must configure these environment variables in your Vercel project settings. The build will fail without them.

Configure these environment variables in your Vercel project settings:

```bash
# Supabase Configuration (REQUIRED for basic functionality)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI Configuration (OPTIONAL - for Contract Generator)
OPENAI_API_KEY=sk-...

# Pinecone Configuration (OPTIONAL - for AI Auditor)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=complai-legal-embeddings

# PandaDoc Configuration (OPTIONAL - for E-Signatures)
PANDADOC_API_KEY=your_pandadoc_api_key
```

#### Where to Find Your Supabase Credentials

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to Settings** → **API**
4. **Copy the values**:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public**: The public API key
   - **service_role secret**: The service role key (keep this secret!)

#### How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your COMPLai project
3. Go to **Settings** → **Environment Variables**
4. Add each variable with the exact names above
5. Set the environment to **Production** (and optionally Preview/Development)
6. Click **Save**

### Deployment Steps

#### Option 1: Automatic Deployment (Recommended)

1. **Connect Repository**:

   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

2. **Configure Project**:

   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

3. **Set Environment Variables**:

   - Add all required environment variables as listed above
   - Ensure they are set for Production environment

4. **Deploy**:
   - Click **Deploy**
   - Vercel will build and deploy your application

#### Option 2: Manual Deployment

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Post-Deployment Setup

#### 1. Database Migration

After deployment, run the database migration:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the migration in Supabase dashboard
```

#### 2. Verify Environment Variables

Check that all environment variables are working:

```bash
# Test the health endpoint
curl https://your-app.vercel.app/api/health
```

#### 3. Test Authentication Flow

1. Visit your deployed app
2. Try to register a new user
3. Verify email confirmation works
4. Test login functionality

### Troubleshooting

#### Build Errors

**Error**: "Supabase environment variables are required in production"

**Solution**:

1. Ensure all environment variables are set in Vercel
2. Check that variable names match exactly (case-sensitive)
3. Redeploy after adding variables

**Error**: "Environment Variable references Secret which does not exist"

**Solution**:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable manually (don't use secrets):
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://your-project-id.supabase.co`
   - Environment: Production
4. Repeat for all required variables
5. Redeploy the project

**Error**: "Build fails during static generation"

**Solution**:

1. The app now handles missing env vars gracefully
2. Ensure at least Supabase variables are set for full functionality
3. Optional variables can be added later as features are developed

#### Runtime Errors

**Error**: "Database connection failed"

**Solution**:

1. Verify Supabase URL and keys are correct
2. Check Supabase project is active
3. Ensure RLS policies are configured

#### Authentication Issues

**Error**: "OAuth callback failed"

**Solution**:

1. Update OAuth redirect URLs in Supabase
2. Add your Vercel domain to allowed origins
3. Configure OAuth providers properly

### Custom Domain Setup

1. **Add Custom Domain**:

   - Go to Vercel project settings
   - Navigate to **Domains**
   - Add your custom domain

2. **Update Supabase Settings**:

   - Add custom domain to Supabase allowed origins
   - Update OAuth redirect URLs

3. **SSL Certificate**:
   - Vercel automatically provisions SSL certificates
   - No additional configuration needed

### Monitoring & Analytics

#### Vercel Analytics

Enable Vercel Analytics for performance monitoring:

1. Go to project settings
2. Navigate to **Analytics**
3. Enable **Web Analytics**

#### Error Monitoring

Consider adding error monitoring:

```bash
# Install Sentry (optional)
npm install @sentry/nextjs
```

### Performance Optimization

#### Build Optimization

- Enable **Build Cache** in Vercel settings
- Use **Edge Functions** for API routes when possible
- Optimize images with Next.js Image component

#### Database Optimization

- Add proper indexes to your Supabase tables
- Use connection pooling for high traffic
- Monitor query performance

### Security Considerations

#### Environment Variables

- Never commit sensitive keys to Git
- Use Vercel's environment variable encryption
- Rotate keys regularly

#### API Security

- Implement rate limiting
- Add CORS configuration
- Use proper authentication headers

### Backup Strategy

#### Database Backups

- Enable automatic backups in Supabase
- Set up manual backup schedule
- Test restore procedures

#### Code Backups

- Use Git for version control
- Enable branch protection
- Set up automated testing

### Support

For deployment issues:

1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review build logs in Vercel dashboard
3. Check environment variable configuration
4. Verify Supabase project status

---

**Last Updated**: July 18, 2024
**Version**: 1.0.0
