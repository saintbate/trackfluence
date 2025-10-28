# Data Ingestion API Documentation

This document explains how to use the data ingestion endpoints to import order data from Shopify, Google Analytics 4, and other platforms.

## Overview

Trackfluence provides two ingestion endpoints:
- `/api/ingest/shopify` - For Shopify order data
- `/api/ingest/ga4` - For Google Analytics 4 e-commerce data

Both endpoints support:
- **Single or batch uploads** - Send one order or an array of orders
- **Upsert operations** - Automatically updates existing orders or inserts new ones
- **Influencer resolution** - Maps discount codes or UTM parameters to influencers
- **Validation** - Returns detailed error messages for invalid data
- **Authentication** - Requires valid NextAuth session

## Database Setup

Before using the ingestion endpoints, run the migration:

```bash
npm run db:migrate
```

This adds the required columns to the `shop_order` table:
- `order_number` - Unique order identifier
- `discount_code` - Discount code used
- `utm_source`, `utm_medium`, `utm_campaign` - GA4 tracking parameters
- Unique constraint on `(brand_id, order_number)` for upsert operations

## Endpoint: POST /api/ingest/shopify

Import order data from Shopify or other e-commerce platforms.

### Authentication

Requires a valid NextAuth session (user must be signed in).

### Request Format

**Single Order:**
```json
POST /api/ingest/shopify
Content-Type: application/json

{
  "brand_id": "demo-brand-001",
  "influencer_id": "inf-001",
  "order_number": "SHOP-1234",
  "order_date": "2025-10-27",
  "total_gross": 125.50,
  "discount_code": "FASHION10",
  "influencer_spend": 25.00,
  "campaign_id": "camp-001"
}
```

**Batch Orders:**
```json
POST /api/ingest/shopify
Content-Type: application/json

[
  {
    "brand_id": "demo-brand-001",
    "discount_code": "FASHION10",
    "order_number": "SHOP-1234",
    "order_date": "2025-10-27",
    "total_gross": 125.50
  },
  {
    "brand_id": "demo-brand-001",
    "influencer_id": "inf-002",
    "order_number": "SHOP-1235",
    "order_date": "2025-10-27",
    "total_gross": 89.99
  }
]
```

### Required Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `brand_id` | string | Yes | Brand UUID |
| `influencer_id` | string | Conditional* | Influencer UUID |
| `discount_code` | string | Conditional* | Discount code to resolve influencer |
| `order_number` | string | Yes | Unique order identifier |
| `order_date` | string | Yes | Order date (YYYY-MM-DD) |
| `total_gross` | number | Yes | Total order value |

**Either `influencer_id` OR `discount_code` must be provided.*

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `influencer_spend` | number | Amount spent on influencer |
| `campaign_id` | string | Campaign UUID |

### Response

**Success (200 or 400 with partial success):**
```json
{
  "success": true,
  "inserted": 5,
  "updated": 2,
  "total": 7,
  "errors": [
    "Order SHOP-999: Could not resolve influencer from discount code 'INVALID'"
  ]
}
```

**Error (401, 500):**
```json
{
  "error": "Unauthorized"
}
```

### Upsert Behavior

The endpoint uses `(brand_id, order_number)` as a unique key:
- If an order with the same `brand_id` and `order_number` exists → **UPDATE**
- If no matching order exists → **INSERT**

This allows you to safely re-import data without creating duplicates.

### Influencer Resolution

If `influencer_id` is not provided, the system attempts to find the influencer:

1. **By discount code**: Searches `influencer.handle` for matching text (case-insensitive)
2. If no match is found, the order is skipped and an error is returned

## Endpoint: POST /api/ingest/ga4

Import order data from Google Analytics 4 with UTM tracking.

### Authentication

Requires a valid NextAuth session (user must be signed in).

### Request Format

**Single Order:**
```json
POST /api/ingest/ga4
Content-Type: application/json

{
  "brand_id": "demo-brand-001",
  "transaction_id": "GA-TXN-12345",
  "order_date": "2025-10-27",
  "total_gross": 150.00,
  "utm_source": "instagram",
  "utm_medium": "social",
  "utm_campaign": "fashionista-promo",
  "discount_code": "FASHION10"
}
```

**Batch Orders:**
```json
POST /api/ingest/ga4
Content-Type: application/json

[
  {
    "brand_id": "demo-brand-001",
    "transaction_id": "GA-TXN-001",
    "order_date": "2025-10-27",
    "total_gross": 99.99,
    "utm_source": "instagram",
    "utm_campaign": "influencer-campaign"
  },
  {
    "brand_id": "demo-brand-001",
    "order_number": "GA-TXN-002",
    "order_date": "2025-10-27",
    "total_gross": 149.99,
    "influencer_id": "inf-001"
  }
]
```

### Required Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `brand_id` | string | Yes | Brand UUID |
| `influencer_id` | string | Conditional* | Influencer UUID |
| `discount_code` | string | Conditional* | Discount code |
| `utm_source` | string | Conditional* | UTM source parameter |
| `utm_campaign` | string | Conditional* | UTM campaign parameter |
| `order_number` or `transaction_id` | string | Yes | Unique order identifier |
| `order_date` | string | Yes | Order date (YYYY-MM-DD) |
| `total_gross` | number | Yes | Total order value |

**At least one of: `influencer_id`, `discount_code`, `utm_source`, or `utm_campaign` must be provided.*

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `utm_medium` | string | UTM medium parameter |
| `influencer_spend` | number | Amount spent on influencer |
| `campaign_id` | string | Campaign UUID |

### Response

Same format as Shopify endpoint.

### Influencer Resolution Strategy

The GA4 endpoint uses multiple strategies to find influencers:

1. **Exact `influencer_id`** - If provided, use directly
2. **Discount code match** - Search `influencer.handle` for discount code
3. **UTM source match** - Search `influencer.handle` for utm_source
4. **UTM campaign match** - Search `influencer.name` for utm_campaign

The first successful match is used.

## Example Use Cases

### 1. Import Shopify Orders

```bash
curl -X POST https://yourapp.com/api/ingest/shopify \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '[
    {
      "brand_id": "demo-brand-001",
      "discount_code": "FASHION10",
      "order_number": "1234",
      "order_date": "2025-10-27",
      "total_gross": 125.50,
      "influencer_spend": 25.00
    }
  ]'
```

### 2. Import GA4 E-commerce Data

```bash
curl -X POST https://yourapp.com/api/ingest/ga4 \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "brand_id": "demo-brand-001",
    "transaction_id": "GA-12345",
    "order_date": "2025-10-27",
    "total_gross": 99.99,
    "utm_source": "instagram",
    "utm_campaign": "spring-sale"
  }'
```

### 3. Update Existing Orders

If you need to update order data (e.g., correcting revenue), simply re-POST with the same `brand_id` and `order_number`:

```json
{
  "brand_id": "demo-brand-001",
  "order_number": "1234",
  "order_date": "2025-10-27",
  "total_gross": 150.00,  // Updated value
  "influencer_id": "inf-001"
}
```

The endpoint will update the existing order instead of creating a duplicate.

## Error Handling

### Common Errors

**Missing required fields:**
```json
{
  "success": true,
  "inserted": 0,
  "updated": 0,
  "total": 1,
  "errors": [
    "Order unknown: brand_id is required"
  ]
}
```

**Could not resolve influencer:**
```json
{
  "success": true,
  "inserted": 0,
  "updated": 0,
  "total": 1,
  "errors": [
    "Order SHOP-1234: Could not resolve influencer from discount code 'INVALID'"
  ]
}
```

**Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

### Partial Success

The endpoints process orders individually. If some orders succeed and others fail, you'll get a 200 status with errors listed:

```json
{
  "success": true,
  "inserted": 3,
  "updated": 1,
  "total": 5,
  "errors": [
    "Order SHOP-999: Could not resolve influencer"
  ]
}
```

## Integration Examples

### JavaScript/TypeScript

```typescript
async function importOrders(orders: any[]) {
  const response = await fetch('/api/ingest/shopify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orders),
  });

  const result = await response.json();
  
  console.log(`Inserted: ${result.inserted}, Updated: ${result.updated}`);
  
  if (result.errors) {
    console.error('Errors:', result.errors);
  }
  
  return result;
}
```

### Python

```python
import requests

def import_ga4_orders(orders):
    response = requests.post(
        'https://yourapp.com/api/ingest/ga4',
        json=orders,
        cookies={'next-auth.session-token': 'your-session-token'}
    )
    
    result = response.json()
    print(f"Inserted: {result['inserted']}, Updated: {result['updated']}")
    
    if 'errors' in result:
        for error in result['errors']:
            print(f"Error: {error}")
    
    return result
```

### Shopify Webhook Integration

```javascript
// Express.js webhook handler
app.post('/webhooks/shopify/orders/create', async (req, res) => {
  const order = req.body;
  
  const trackfluenceData = {
    brand_id: process.env.BRAND_ID,
    order_number: order.order_number,
    order_date: order.created_at.split('T')[0],
    total_gross: parseFloat(order.total_price),
    discount_code: order.discount_codes[0]?.code,
  };
  
  await fetch(process.env.TRACKFLUENCE_URL + '/api/ingest/shopify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trackfluenceData),
  });
  
  res.status(200).send('OK');
});
```

## Best Practices

1. **Batch imports** - When importing historical data, batch orders in groups of 100-500 for better performance

2. **Error handling** - Always check the `errors` array in the response and log failed orders for review

3. **Idempotency** - Use unique `order_number` values consistently to avoid duplicates

4. **Authentication** - Use API tokens or session cookies for authentication

5. **Data validation** - Validate data client-side before sending to reduce errors

6. **Rate limiting** - Implement exponential backoff if ingesting large volumes

7. **Monitoring** - Track `inserted` vs `updated` counts to monitor data quality

## Troubleshooting

### Orders not appearing in dashboard

- Check that `brand_id` matches an existing brand
- Verify `order_date` is within the selected date range
- Ensure influencer was successfully resolved (check `errors` array)

### "Could not resolve influencer" errors

- Verify influencer exists in database with matching handle/name
- Check discount code or UTM parameters match influencer data
- Consider providing `influencer_id` directly if resolution fails

### "Unauthorized" error

- Ensure user is signed in with valid session
- Check NextAuth configuration is correct
- Verify session cookie is being sent with request

### Duplicate orders

- Make sure `order_number` is unique per brand
- Check if unique constraint is applied: `npm run db:migrate`
- Existing duplicates must be cleaned up manually before constraint can be added

## Security

- All endpoints require authentication via NextAuth
- Users can only import data for brands they have access to
- Server-side validation prevents invalid data
- RLS policies protect data at database level
- Service role key used for database operations

## Future Enhancements

Planned features:
- Webhook endpoints for real-time ingestion
- CSV file upload interface
- Scheduled data syncs
- Data transformation rules
- Conflict resolution strategies
- Bulk delete operations


