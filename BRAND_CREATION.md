# Brand Creation Feature

This document explains the brand creation feature that allows authenticated users to create and manage their own brands.

## Overview

Authenticated users can create new brands directly from the Overview page. Each brand is automatically linked to the user's account and comes with a starter campaign.

## User Interface

### Brand Selector Enhancement

The brand selector now includes a "New Brand" button (+ icon):
- **Desktop**: Shows "+ New Brand" with icon
- **Mobile**: Shows just the + icon to save space
- **Location**: Next to the brand dropdown in the Overview page

### Create Brand Modal

A beautiful modal form with three fields:

1. **Brand Name** (Required)
   - Primary identifier for the brand
   - Must not be empty

2. **Shop Domain** (Optional)
   - Shopify store URL (e.g., `mystore.myshopify.com`)
   - Can be used for API integrations in the future

3. **Timezone** (Required, defaults to UTC)
   - Available options:
     - UTC (Universal)
     - Eastern, Central, Mountain, Pacific Time (US)
     - Alaska, Hawaii Time
     - London (GMT)
     - Paris (CET)
     - Tokyo (JST)
     - Sydney (AEDT)

## API Implementation

### POST /api/brands

**Authentication:** Requires valid NextAuth session

**Request Body:**
```json
{
  "name": "My Awesome Brand",
  "shop_domain": "mystore.myshopify.com",
  "timezone": "America/New_York"
}
```

**Success Response (201):**
```json
{
  "brandId": "uuid-here",
  "campaignId": "uuid-here",
  "message": "Brand created successfully"
}
```

**Error Responses:**
- `400`: Missing or invalid brand name
- `401`: Unauthorized (no session)
- `500`: Server error or missing env vars

### Automatic Campaign Creation

When a brand is created, a "Starter Campaign" is automatically generated:
- **Name**: "Starter Campaign"
- **Start Date**: Today
- **End Date**: Today + 30 days
- **Brand ID**: Linked to the new brand

This allows users to immediately start tracking influencer data.

## Database Schema

### Brand Table Columns

```sql
CREATE TABLE brand (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  shop_domain TEXT,              -- Optional Shopify domain
  timezone TEXT DEFAULT 'UTC',   -- Brand timezone
  owner_user_id TEXT             -- User email from NextAuth
);
```

### Ownership Model

- `owner_user_id` stores the user's **email** from NextAuth session
- Demo brands have `owner_user_id = NULL` (accessible by everyone)
- RLS policies allow users to read Demo brands and manage their own brands

## User Flow

1. **User clicks "New Brand" button**
   - Modal opens with form

2. **User fills in brand details**
   - Name (required)
   - Shop domain (optional)
   - Timezone (defaults to UTC)

3. **User submits form**
   - POST request to `/api/brands`
   - Session is validated
   - Brand is created with `owner_user_id = user.email`
   - Starter campaign is created

4. **Success**
   - Modal closes
   - Brand list refreshes (via SWR mutate)
   - New brand is automatically selected
   - User can immediately start using the brand

## Implementation Details

### Files Created

1. **`components/CreateBrandModal.tsx`**
   - Modal component with form
   - Form validation
   - Error handling
   - Loading states

2. **`sql/add-brand-columns.sql`**
   - Migration to add `shop_domain` and `timezone` columns

### Files Modified

1. **`components/BrandSelect.tsx`**
   - Added "New Brand" button
   - Integrated CreateBrandModal
   - Added SWR mutate for refresh
   - Auto-select newly created brand

2. **`app/api/brands/route.ts`**
   - Added POST handler
   - Session validation
   - Brand creation logic
   - Automatic campaign creation

3. **`sql/add-owner-column.sql`**
   - Updated to use TEXT instead of UUID for email storage

4. **`sql/rls-policies.sql`**
   - Updated policies to handle email-based ownership
   - Allow NULL owner_user_id for Demo brands

5. **`package.json`**
   - Updated `db:migrate` script to include brand columns

## Security

### Server-Side Validation

- Session is verified using NextAuth `auth()` function
- Only authenticated users can create brands
- `owner_user_id` is set server-side (cannot be spoofed)
- Uses Supabase service role key (bypasses RLS)

### Client-Side

- Modal only accessible when authenticated
- Form validation prevents empty names
- Error messages shown for failed requests

### Row Level Security (RLS)

Current policies:
- Demo brands (`owner_user_id IS NULL`) readable by all
- Users can manage brands with non-NULL `owner_user_id`
- Server validates ownership in API routes

**Note:** For production, consider integrating NextAuth with Supabase Auth for database-level security.

## Testing

### Manual Testing Steps

1. **Sign in** to the application
2. **Navigate** to Overview page
3. **Click** "New Brand" button
4. **Fill in** brand details:
   - Name: "Test Brand"
   - Shop Domain: "test.myshopify.com"
   - Timezone: "America/New_York"
5. **Submit** the form
6. **Verify**:
   - Modal closes
   - New brand appears in dropdown
   - New brand is selected
   - Can view campaigns for new brand

### Error Cases to Test

1. **Submit without name** → Should show validation error
2. **Submit while offline** → Should show network error
3. **Submit with invalid session** → Should return 401
4. **Create brand, sign out, sign in** → Should still see your brand

## Future Enhancements

Possible improvements:

1. **Brand Logo Upload**
   - Add logo/image field
   - Store in Supabase Storage

2. **Brand Settings**
   - Edit brand details
   - Delete brands (with confirmation)
   - Archive old brands

3. **Shopify Integration**
   - Use shop_domain to connect to Shopify API
   - Import orders automatically
   - Sync product data

4. **Multi-User Brands**
   - Add team members to brands
   - Role-based permissions
   - Shared brand access

5. **Brand Analytics**
   - Aggregate data across all campaigns
   - Year-over-year comparisons
   - Brand health metrics

## Troubleshooting

### "Unauthorized" error when creating brand
- Ensure you're signed in
- Check NextAuth session is valid
- Verify NEXTAUTH_SECRET is set

### Brand not appearing after creation
- Check browser console for errors
- Verify database columns exist (`npm run db:migrate`)
- Check Supabase logs for insert errors

### Can't select newly created brand
- Check that SWR mutate is being called
- Verify brand ID is returned from API
- Check onChange handler in parent component

### Starter campaign not created
- Check Supabase logs for campaign insert errors
- Verify campaign table exists
- Note: Brand creation still succeeds even if campaign fails

## Additional Resources

- **AUTH_SETUP.md** - Complete authentication setup guide
- **sql/rls-policies.sql** - Row level security policies
- **sql/add-brand-columns.sql** - Brand table migration
- **NextAuth Documentation** - https://next-auth.js.org/
- **Supabase RLS Guide** - https://supabase.com/docs/guides/auth/row-level-security


