# Authentication Setup Guide

This guide explains how to set up authentication for Trackfluence using NextAuth.js v5 with Google OAuth and email magic links.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database URL (for running SQL scripts)
DATABASE_URL=postgresql://user:password@host:port/database

# NextAuth Configuration
NEXTAUTH_URL=https://app.trackfluence.app
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (optional - for Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Resend API (optional - for email magic links)
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com
```

## Setup Steps

### 1. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Add this to your `.env.local` as `NEXTAUTH_SECRET`.

### 2. Set Up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URI: `https://app.trackfluence.app/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env.local`

### 3. Set Up Resend for Email Magic Links (Optional)

1. Sign up at [Resend](https://resend.com/)
2. Get your API key from the dashboard
3. Add your API key to `.env.local` as `RESEND_API_KEY`
4. Set `EMAIL_FROM` to a verified email address/domain

### 4. Run Database Migrations

Run migrations to add required columns to your brand table:

```bash
npm run db:migrate
```

This adds:
- `owner_user_id` (TEXT) - Stores user email from NextAuth
- `shop_domain` (TEXT) - Optional Shopify store domain
- `timezone` (TEXT) - Brand timezone (defaults to UTC)

### 5. Apply Row Level Security (RLS) Policies

Run the RLS policies to secure your database:

```bash
npm run db:rls
```

Or manually in Supabase SQL editor:

```sql
-- See sql/rls-policies.sql for complete policies
```

**RLS Policy Summary:**
- Demo brands (owner_user_id IS NULL) are readable by everyone
- Users can manage brands with non-NULL owner_user_id
- Server-side code validates ownership using session email
- All authenticated users can read influencers (shared resource)
- Cascading permissions for campaigns and orders

**Note:** The current implementation uses the Supabase service role key on the server, which bypasses RLS. Ownership validation happens in the API routes using NextAuth sessions. For stricter security, you can integrate NextAuth with Supabase Auth.

### 6. Seed Demo Data

Seed the database with demo data:

```bash
npm run seed:demo
```

This creates:
- 3 demo brands (Demo Brand, Acme Co, Sample Shop)
- 5 influencers
- 4 campaigns
- 20 shop orders

### 7. Start the Development Server

```bash
npm run dev
```

Visit `https://app.trackfluence.app` - you'll be redirected to the sign-in page.

## Authentication Flow

1. **Unauthenticated users** → Redirected to `/signin`
2. **Sign in options:**
   - Google OAuth (instant)
   - Email magic link (check your inbox)
3. **Authenticated users** → Access to Overview dashboard
4. **User menu** → Top-right corner with sign out option

## Row Level Security (RLS)

The app uses Supabase RLS to ensure users only see their own data:

- ✅ Users see brands they own
- ✅ Everyone sees "Demo Brand" for testing
- ✅ Users see campaigns/orders for their brands
- ✅ Influencers are shared across all users

## Features

### Brand Creation
- Click "New Brand" button next to brand selector
- Fill in brand details:
  - **Brand Name** (required)
  - **Shop Domain** (optional) - e.g., mystore.myshopify.com
  - **Timezone** - Select your brand's timezone
- Automatically creates a "Starter Campaign" spanning 30 days
- Brand is linked to your user account via email
- New brand is automatically selected after creation

### Authentication
- Sign in with Google OAuth or email magic link
- Protected routes redirect to `/signin` when unauthenticated
- User menu in top-right shows profile and sign out option

## Testing

1. Sign in with Google or email
2. You should see the "Demo Brand" in the brand selector
3. Click "New Brand" to create your own brand
4. Your created brand will be automatically selected
5. Select Demo Brand to view sample campaign data
6. User menu appears in top-right corner

## Troubleshooting

### "Server configuration error: missing required environment variables"
- Check that all Supabase env vars are set correctly
- Restart your dev server after adding env vars

### Google sign-in redirects to error page
- Verify Google OAuth credentials are correct
- Check authorized redirect URIs include `/api/auth/callback/google`

### Email magic link not working
- Verify Resend API key is valid
- Check EMAIL_FROM is a verified domain
- Look for emails in spam folder

### Can't see any brands
- Check RLS policies are applied (`npm run db:rls`)
- Verify Demo Brand exists in database
- Check `owner_user_id` column exists on brand table

## Production Deployment

For production:

1. Update `NEXTAUTH_URL` to your production domain
2. Add production callback URLs to Google OAuth settings
3. Use a production-grade secret for `NEXTAUTH_SECRET`
4. Ensure RLS policies are applied to production database
5. Set up proper email domain verification in Resend

## Security Notes

- Never commit `.env.local` to version control
- Use strong, random secrets for `NEXTAUTH_SECRET`
- Keep service role keys secure (server-side only)
- RLS policies protect data at the database level
- NextAuth middleware protects routes at the app level

