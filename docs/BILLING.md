# Billing & Subscription Management

This document covers the Stripe billing integration, user tiers, and feature gating in Trackfluence.

## Table of Contents

1. [Overview](#overview)
2. [User Tiers](#user-tiers)
3. [Stripe Setup](#stripe-setup)
4. [API Endpoints](#api-endpoints)
5. [Feature Gating](#feature-gating)
6. [Webhook Configuration](#webhook-configuration)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

## Overview

Trackfluence uses Stripe for subscription management with two tiers:
- **FREE** - Basic features
- **PRO** - All features including CSV export

## User Tiers

### Database Schema

The `app_user` table stores user subscription information:

```sql
CREATE TABLE app_user (
  id TEXT PRIMARY KEY,                        -- User email
  tier TEXT DEFAULT 'FREE' NOT NULL,          -- FREE or PRO
  stripe_customer_id TEXT,                    -- Stripe customer ID
  stripe_subscription_id TEXT,                -- Subscription ID
  subscription_status TEXT,                   -- active, canceled, etc.
  subscription_current_period_end TIMESTAMP,  -- Period end date
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Migration

Run the migration to create the table:

```bash
npm run db:migrate
```

This executes `sql/add-user-tier.sql`.

## Stripe Setup

### 1. Create Stripe Account

1. Go to https://stripe.com/ and sign up
2. Complete account verification
3. Switch to Test Mode for development

### 2. Create Product & Price

1. Go to Products → Add Product
2. Product name: "Trackfluence PRO"
3. Pricing:
   - Type: Recurring
   - Billing period: Monthly (or your choice)
   - Price: Set your price (e.g., $29/month)
4. Click "Save product"
5. Copy the **Price ID** (starts with `price_`)

### 3. Get API Keys

1. Go to Developers → API Keys
2. Copy **Secret key** (starts with `sk_test_` for test mode)
3. Copy **Publishable key** (optional, not used in current implementation)

### 4. Set Up Webhook

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/billing/webhook`
4. Description: "Trackfluence subscription events"
5. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Click "Add endpoint"
7. Click "Reveal" to see **Signing secret** (starts with `whsec_`)
8. Copy the signing secret

### 5. Configure Environment Variables

Add to `.env.local` (development) or your deployment platform (production):

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PRICE_ID=price_your_price_id_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

For production, use live mode keys (start with `sk_live_` and `whsec_live_`).

## API Endpoints

### POST /api/billing/checkout

Creates a Stripe Checkout session for upgrading to PRO.

**Authentication:** Required (NextAuth session)

**Request:**
```typescript
POST /api/billing/checkout
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/...",
  "sessionId": "cs_test_..."
}
```

**Usage:**
```typescript
const response = await fetch('/api/billing/checkout', {
  method: 'POST',
});
const { url } = await response.json();
window.location.href = url;
```

### POST /api/billing/webhook

Handles Stripe webhook events for subscription lifecycle.

**Authentication:** Verified by Stripe signature

**Events Handled:**
- `checkout.session.completed` - User completes payment → Set tier to PRO
- `customer.subscription.updated` - Subscription changes → Update status
- `customer.subscription.deleted` - User cancels → Downgrade to FREE
- `invoice.payment_succeeded` - Payment successful → Log success
- `invoice.payment_failed` - Payment fails → Set status to past_due

**Implementation:**
```typescript
// On successful checkout
{
  tier: "PRO",
  stripe_customer_id: "cus_...",
  stripe_subscription_id: "sub_...",
  subscription_status: "active"
}

// On subscription canceled
{
  tier: "FREE",
  subscription_status: "canceled"
}
```

### GET /api/billing/status

Returns current user's tier and subscription status.

**Authentication:** Required (NextAuth session)

**Request:**
```typescript
GET /api/billing/status
```

**Response:**
```json
{
  "tier": "PRO",
  "subscription_status": "active",
  "subscription_current_period_end": "2025-11-27T00:00:00Z"
}
```

**Usage:**
```typescript
const response = await fetch('/api/billing/status');
const { tier } = await response.json();

if (tier === 'PRO') {
  // Show PRO features
}
```

## Feature Gating

### CSV Export (PRO Feature)

The `ExportCsvButton` component checks user tier before allowing export.

**Implementation:**

```typescript
// components/ExportCsvButton.tsx

// 1. Fetch user tier on mount
useEffect(() => {
  const fetchUserTier = async () => {
    const response = await fetch("/api/billing/status");
    const data = await response.json();
    setUserTier(data.tier || "FREE");
  };
  fetchUserTier();
}, []);

// 2. Check tier before export
const handleExport = () => {
  if (userTier !== "PRO") {
    setShowUpgradeModal(true);  // Show upgrade prompt
    return;
  }
  // Proceed with export
};
```

**UI Indicators:**
- PRO badge on button (amber badge in top-right)
- Tooltip: "PRO feature - Upgrade to export"
- Upgrade modal with call-to-action

### Adding More PRO Features

To gate additional features:

```typescript
// 1. Check user tier
const { tier } = await fetch('/api/billing/status').then(r => r.json());

// 2. Conditionally render or enable feature
{tier === 'PRO' ? (
  <AdvancedFeature />
) : (
  <UpgradePrompt />
)}
```

**Example: Limiting Data Access**

```typescript
// Limit data range for FREE users
const maxDaysBack = tier === 'PRO' ? 365 : 30;
```

## Webhook Configuration

### Local Development Testing

Use Stripe CLI to test webhooks locally:

```bash
# 1. Install Stripe CLI
brew install stripe/stripe-cli/stripe

# 2. Login
stripe login

# 3. Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/billing/webhook

# 4. Trigger test events
stripe trigger checkout.session.completed
```

### Production Webhook Setup

1. Deploy your application
2. Go to Stripe Dashboard → Developers → Webhooks
3. Add endpoint: `https://yourdomain.com/api/billing/webhook`
4. Select events (listed in [Stripe Setup](#stripe-setup))
5. Copy signing secret to environment variable

### Webhook Security

The webhook endpoint verifies the Stripe signature:

```typescript
const signature = headers().get("stripe-signature");
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

This prevents unauthorized requests from triggering subscription changes.

## Testing

### Test Checkout Flow

1. Start dev server: `npm run dev`
2. Sign in to the application
3. Click "Export CSV" button
4. Click "Upgrade to PRO" in modal
5. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
6. Complete checkout
7. Webhook should upgrade user to PRO
8. CSV export should now work

### Test Cards

Stripe provides test cards for different scenarios:

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Card declined |
| 4000 0025 0000 3155 | 3D Secure required |
| 4000 0000 0000 9995 | Insufficient funds |

### Test Webhooks

```bash
# Test successful checkout
stripe trigger checkout.session.completed

# Test subscription canceled
stripe trigger customer.subscription.deleted

# Test payment failure
stripe trigger invoice.payment_failed
```

## User Flow

### FREE → PRO Upgrade

```
1. User clicks "Export CSV"
   ↓
2. Check tier → FREE
   ↓
3. Show upgrade modal
   ↓
4. User clicks "Upgrade to PRO"
   ↓
5. POST /api/billing/checkout
   ↓
6. Redirect to Stripe Checkout
   ↓
7. User completes payment
   ↓
8. Stripe webhook → checkout.session.completed
   ↓
9. Update app_user: tier = "PRO"
   ↓
10. User returns to app
   ↓
11. CSV export now works
```

### Subscription Management

Users can manage their subscription in Stripe Customer Portal:

```typescript
// Create customer portal session
const session = await stripe.billingPortal.sessions.create({
  customer: stripe_customer_id,
  return_url: 'https://yourdomain.com',
});

// Redirect user
window.location.href = session.url;
```

## Troubleshooting

### "Stripe is not configured" Error

**Cause:** Missing `STRIPE_SECRET_KEY` or `STRIPE_PRICE_ID`

**Solution:**
1. Verify environment variables are set
2. Restart dev server after adding variables
3. Check variable names match exactly

### Webhook Not Receiving Events

**Cause:** Webhook signing secret mismatch or URL not accessible

**Solution:**
1. Verify `STRIPE_WEBHOOK_SECRET` is correct
2. Check webhook URL is publicly accessible
3. Review Stripe Dashboard → Webhooks → Event Logs
4. Use Stripe CLI for local testing

### User Not Upgraded After Payment

**Cause:** Webhook not processed or failed

**Solution:**
1. Check Stripe Dashboard → Webhooks → Event Logs
2. Look for errors in webhook responses
3. Check server logs for errors
4. Verify database connection is working
5. Test webhook manually with Stripe CLI

### CSV Export Still Blocked After Upgrade

**Cause:** Frontend hasn't refetched user tier

**Solution:**
1. Refresh the page
2. Check `/api/billing/status` returns "PRO"
3. Clear browser cache
4. Check database for user record

### Test Mode vs Live Mode

**Issue:** Accidentally using test keys in production

**Solution:**
- Test keys start with `sk_test_`, `price_test_`, `whsec_test_`
- Live keys start with `sk_live_`, `price_live_`, `whsec_live_`
- Use separate environment variables for test/live
- Never commit keys to version control

## Security Best Practices

1. **Never expose secret key** - Server-side only
2. **Verify webhook signatures** - Already implemented
3. **Use HTTPS in production** - Required by Stripe
4. **Store customer ID securely** - In database, not cookies
5. **Validate user permissions** - Check tier server-side
6. **Log webhook events** - For debugging and auditing
7. **Handle edge cases** - Payment failures, cancellations

## Pricing Strategy

Consider these pricing models:

### Monthly Subscription
- Simple recurring billing
- Predictable revenue
- Example: $29/month

### Annual Subscription
- Discount for annual payment
- Better retention
- Example: $290/year (save $58)

### Usage-Based
- Pay per export or API call
- Good for high-volume users
- Example: $0.10 per export

### Tiered Plans
- Multiple PRO tiers
- Different feature sets
- Example: PRO ($29), ENTERPRISE ($99)

## Analytics

Track billing metrics:

```typescript
// Track upgrade attempts
Sentry.metrics.increment('billing.upgrade.attempted');

// Track successful upgrades
Sentry.metrics.increment('billing.upgrade.completed');

// Track monthly recurring revenue
Sentry.metrics.gauge('billing.mrr', totalMRR);
```

## Future Enhancements

Possible improvements:

1. **Customer Portal** - Let users manage subscriptions
2. **Usage Limits** - Soft limits before requiring upgrade
3. **Trial Period** - 14-day free trial of PRO
4. **Team Plans** - Multiple users per subscription
5. **Annual Billing** - Discounted yearly option
6. **Custom Plans** - Enterprise pricing
7. **Promo Codes** - Discount codes for marketing
8. **Refund Handling** - Webhook for refunds

## Related Documentation

- [DEPLOY.md](./DEPLOY.md) - Deployment guide
- [MONITORING.md](./MONITORING.md) - Error tracking
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)

## Support

For Stripe-related issues:
- Check Stripe Dashboard for detailed logs
- Review webhook event history
- Contact Stripe support if needed
- Test with Stripe CLI before deploying


