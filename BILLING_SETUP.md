# Billing Setup - Quick Start

This is a quick start guide for setting up Stripe billing. For complete documentation, see [docs/BILLING.md](docs/BILLING.md).

## Quick Setup (5 minutes)

### 1. Install Dependencies ✅

Already installed: `stripe` package

### 2. Run Database Migration

```bash
npm run db:migrate
```

This creates the `app_user` table with tier support.

### 3. Configure Stripe

**Create Product:**
1. Go to https://dashboard.stripe.com/test/products
2. Click "Add product"
3. Name: "Trackfluence PRO"
4. Price: $29/month (recurring)
5. Copy **Price ID** (starts with `price_`)

**Get API Keys:**
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy **Secret key** (starts with `sk_test_`)

**Set Up Webhook:**
1. Go to https://dashboard.stripe.com/test/webhooks
2. Add endpoint: `https://yourdomain.com/api/billing/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy **Signing secret** (starts with `whsec_`)

### 4. Add Environment Variables

Add to `.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PRICE_ID=price_your_price_id_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

### 5. Test Locally

```bash
# Start dev server
npm run dev

# In another terminal, forward webhooks
stripe listen --forward-to localhost:3000/api/billing/webhook
```

### 6. Test Upgrade Flow

1. Sign in to your app
2. Click "Export CSV" button
3. Click "Upgrade to PRO"
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. CSV export should now work!

## What's Included

### API Endpoints

- ✅ `POST /api/billing/checkout` - Create Stripe Checkout session
- ✅ `POST /api/billing/webhook` - Handle Stripe webhooks
- ✅ `GET /api/billing/status` - Get user tier

### Database

- ✅ `app_user` table with tier column
- ✅ Stores stripe_customer_id and subscription status
- ✅ Automatic updated_at timestamp

### UI Components

- ✅ ExportCsvButton with PRO gate
- ✅ Upgrade modal with call-to-action
- ✅ PRO badge indicator
- ✅ Loading states

### Features

- ✅ FREE tier (default)
- ✅ PRO tier ($29/month)
- ✅ CSV export (PRO only)
- ✅ Webhook handling for subscription lifecycle
- ✅ Automatic tier upgrades/downgrades

## User Flow

```
FREE User → Click Export CSV
    ↓
Show "Upgrade to PRO" modal
    ↓
Redirect to Stripe Checkout
    ↓
Complete payment
    ↓
Webhook upgrades to PRO
    ↓
CSV export now works ✅
```

## Testing

**Test Card Numbers:**
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`

**Test Webhooks:**
```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.deleted
```

## Production Checklist

- [ ] Switch to Stripe live mode
- [ ] Update keys to `sk_live_`, `price_live_`, `whsec_live_`
- [ ] Configure production webhook URL
- [ ] Test with real card (cancel immediately)
- [ ] Set up billing alerts in Stripe
- [ ] Enable email receipts in Stripe

## Troubleshooting

**"Stripe is not configured"**
- Check environment variables are set
- Restart dev server

**Webhook not working**
- Verify signing secret is correct
- Use Stripe CLI for local testing
- Check webhook URL is publicly accessible

**User not upgraded after payment**
- Check Stripe webhook logs
- Verify database connection
- Check server logs for errors

## Next Steps

1. **Customize pricing** - Change price or add tiers
2. **Add more PRO features** - Use the same pattern
3. **Customer portal** - Let users manage subscriptions
4. **Analytics** - Track conversion rates

## Documentation

- **Full guide:** [docs/BILLING.md](docs/BILLING.md)
- **Stripe docs:** https://stripe.com/docs
- **Webhooks:** https://stripe.com/docs/webhooks

---

**Need help?** Check the full documentation in `docs/BILLING.md`.


