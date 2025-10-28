# Deployment Guide

This guide covers deploying Trackfluence to production environments like Vercel, Railway, or custom servers.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Database Setup](#database-setup)
4. [Deployment Platforms](#deployment-platforms)
5. [Post-Deployment](#post-deployment)
6. [Monitoring & Health Checks](#monitoring--health-checks)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- ✅ Supabase project created
- ✅ Database schema applied (see [Database Setup](#database-setup))
- ✅ OAuth credentials (Google, optional)
- ✅ Email provider configured (Resend, optional)
- ✅ Sentry account (optional, for error tracking)

## Environment Variables

### Required Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database Connection (for migrations)
DATABASE_URL=postgresql://user:password@host:port/database

# NextAuth Configuration
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
```

### Optional Variables

```bash
# Google OAuth (for Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Resend Email (for magic link authentication)
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com

# Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=your-org-name
SENTRY_PROJECT=your-project-name
SENTRY_AUTH_TOKEN=your-auth-token
```

### Generating Secrets

**NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**SENTRY_AUTH_TOKEN:**
1. Go to https://sentry.io/settings/account/api/auth-tokens/
2. Create a new token with project write access
3. Copy the token value

## Database Setup

### 1. Apply Schema

First, ensure your Supabase database has all required tables. If not already done, create them via Supabase SQL Editor or migrations.

### 2. Run Migrations

Add required columns for authentication and data ingestion:

```bash
npm run db:migrate
```

This runs:
- `sql/add-owner-column.sql` - Adds owner_user_id to brand table
- `sql/add-brand-columns.sql` - Adds shop_domain and timezone
- `sql/add-order-tracking-columns.sql` - Adds order tracking fields

### 3. Apply RLS Policies

Enable row-level security:

```bash
npm run db:rls
```

This applies policies from `sql/rls-policies.sql` to secure data access.

### 4. Seed Demo Data (Optional)

For testing in staging:

```bash
npm run seed:demo
```

**⚠️ Do not run this in production with real customer data!**

## Deployment Platforms

### Vercel (Recommended)

Vercel provides the best experience for Next.js applications.

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login

```bash
vercel login
```

#### Step 3: Configure Project

```bash
vercel
```

Follow the prompts to link your project.

#### Step 4: Set Environment Variables

Using Vercel CLI:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
# Add all other required variables
```

Or via Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add all required variables for production
3. Copy to Preview and Development environments as needed

#### Step 5: Deploy

```bash
vercel --prod
```

#### Step 6: Configure Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update `NEXTAUTH_URL` to your custom domain

### Railway

Railway is great for full-stack applications with database included.

#### Step 1: Create Project

1. Go to https://railway.app/
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository

#### Step 2: Add Environment Variables

In Railway dashboard:
1. Go to Variables tab
2. Add all required environment variables
3. Click "Deploy"

#### Step 3: Add Custom Domain

1. Go to Settings → Domains
2. Generate a Railway domain or add custom domain
3. Update `NEXTAUTH_URL` accordingly

### Docker Deployment

For custom servers or cloud providers.

#### Step 1: Create Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Step 2: Update next.config.ts

Add output configuration:

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  // ... other config
};
```

#### Step 3: Build and Run

```bash
docker build -t trackfluence .
docker run -p 3000:3000 --env-file .env.production trackfluence
```

## Post-Deployment

### 1. Verify Health Check

Test the health endpoint:

```bash
curl https://yourdomain.com/api/health
```

Expected response:
```json
{
  "ok": true,
  "ts": 1730000000000
}
```

### 2. Test Authentication

1. Visit your deployed URL
2. You should be redirected to `/signin`
3. Test Google OAuth or email sign-in
4. Verify you can access the dashboard

### 3. Check Sentry Integration

If Sentry is configured:
1. Trigger a test error
2. Check Sentry dashboard for the event
3. Verify source maps are uploaded

### 4. Run Database Migrations

If not done during build:

```bash
# Connect to your production database
psql $DATABASE_URL -f sql/add-owner-column.sql
psql $DATABASE_URL -f sql/add-brand-columns.sql
psql $DATABASE_URL -f sql/add-order-tracking-columns.sql
psql $DATABASE_URL -f sql/rls-policies.sql
```

### 5. Create First Brand

1. Sign in to the application
2. Click "New Brand"
3. Create your first brand
4. Verify it appears in the dropdown

## Monitoring & Health Checks

### Health Check Endpoint

**URL:** `https://yourdomain.com/api/health`

**Response:**
```json
{
  "ok": true,
  "ts": 1730000000000
}
```

**Use Cases:**
- Uptime monitoring (UptimeRobot, Pingdom)
- Load balancer health checks
- Deployment verification
- Status page integration

### Sentry Error Tracking

Sentry automatically captures:
- ❌ Unhandled exceptions
- ❌ API errors
- ❌ Network failures
- ❌ React component errors

**Dashboard:** https://sentry.io/

**Monitoring:**
1. Check error rate
2. Review performance metrics
3. Set up alert rules
4. Monitor release health

### Performance Monitoring

Sentry also tracks:
- 📊 Page load times
- 📊 API response times
- 📊 Database query performance
- 📊 User interactions (Session Replay)

## Environment-Specific Configuration

### Development

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=dev-key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret
```

### Staging

```bash
# Same as production but with staging endpoints
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
NEXTAUTH_URL=https://staging.yourdomain.com
```

### Production

```bash
# Production values
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXTAUTH_URL=https://yourdomain.com
```

## Security Checklist

Before going to production:

- [ ] All secrets are generated securely (not "test123")
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is kept secret (server-only)
- [ ] RLS policies are applied and tested
- [ ] HTTPS is enabled (automatic on Vercel/Railway)
- [ ] CORS is properly configured
- [ ] Rate limiting is in place (optional)
- [ ] Google OAuth is configured with production callback URLs
- [ ] Email domain is verified in Resend
- [ ] Sentry is configured to filter sensitive data

## Troubleshooting

### "Server configuration error: missing required environment variables"

**Cause:** Environment variables not set or not accessible

**Solution:**
1. Verify all required env vars are set in your platform
2. Rebuild/redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

### "Unauthorized" on API requests

**Cause:** NextAuth session not working

**Solution:**
1. Check `NEXTAUTH_URL` matches your domain
2. Ensure `NEXTAUTH_SECRET` is set
3. Clear cookies and sign in again
4. Check browser console for errors

### Can't see any brands

**Cause:** RLS policies blocking access or demo data not seeded

**Solution:**
1. Run `npm run db:rls` to apply policies
2. Create a brand via "New Brand" button
3. Check Supabase logs for query errors

### Google sign-in fails

**Cause:** OAuth credentials not configured

**Solution:**
1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. Add production callback URL to Google Cloud Console:
   - `https://yourdomain.com/api/auth/callback/google`
3. Check authorized domains include your production domain

### Database connection fails

**Cause:** Wrong `DATABASE_URL` or network access

**Solution:**
1. Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/db`
2. Check Supabase connection pooler settings
3. Ensure deployment platform can reach Supabase

### Build fails with Sentry errors

**Cause:** Missing Sentry configuration

**Solution:**
1. Set `SENTRY_AUTH_TOKEN` environment variable
2. Or disable Sentry in build: Remove Sentry config from `next.config.ts`
3. Verify `SENTRY_ORG` and `SENTRY_PROJECT` are correct

## Rollback Procedure

If deployment fails:

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback <deployment-url>
```

### Railway
1. Go to Deployments tab
2. Click on previous successful deployment
3. Click "Redeploy"

### Docker
```bash
# Switch to previous image
docker pull trackfluence:previous
docker stop trackfluence
docker run -d trackfluence:previous
```

## Backup Strategy

### Database Backups

Supabase provides automatic daily backups. For additional safety:

```bash
# Manual backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup-20251027.sql
```

### Environment Variables

Keep a secure copy of all environment variables:
```bash
vercel env pull .env.backup
# Store .env.backup in password manager or secure location
```

## Scaling Considerations

### Database
- Supabase auto-scales (check plan limits)
- Consider connection pooling for high traffic
- Monitor query performance in Supabase dashboard

### Application
- Vercel auto-scales (serverless functions)
- Railway scales with plan upgrades
- Consider CDN for static assets

### API Rate Limits
- Implement rate limiting for public endpoints
- Use Redis for distributed rate limiting
- Monitor API usage in Sentry

## Support & Resources

- **NextAuth.js:** https://next-auth.js.org/
- **Supabase Docs:** https://supabase.com/docs
- **Sentry Docs:** https://docs.sentry.io/
- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app/

## Deployment Checklist

Final checklist before production launch:

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Health check endpoint responding
- [ ] Authentication working (Google/Email)
- [ ] Sentry capturing errors
- [ ] Custom domain configured
- [ ] SSL/HTTPS enabled
- [ ] Demo data removed (if any)
- [ ] Monitoring alerts configured
- [ ] Backup strategy in place
- [ ] Rollback procedure tested
- [ ] Documentation updated
- [ ] Team members have access
- [ ] Status page updated (if applicable)

---

**Need help?** Check the troubleshooting section or review the README.md and other documentation files.


