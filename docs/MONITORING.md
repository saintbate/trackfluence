# Monitoring & Health Checks

This document covers monitoring, health checks, and error tracking for Trackfluence.

## Table of Contents

1. [Health Check Endpoint](#health-check-endpoint)
2. [Sentry Integration](#sentry-integration)
3. [Performance Monitoring](#performance-monitoring)
4. [Alerting](#alerting)

## Health Check Endpoint

### Overview

The health check endpoint provides a simple way to verify the application is running and responding to requests.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "ok": true,
  "ts": 1730000000000
}
```

**Fields:**
- `ok` - Always `true` when the endpoint responds
- `ts` - Current server timestamp in milliseconds

### Usage

#### Command Line
```bash
curl https://yourdomain.com/api/health
```

#### JavaScript/TypeScript
```typescript
const checkHealth = async () => {
  const response = await fetch('/api/health');
  const data = await response.json();
  
  if (data.ok) {
    console.log('Application is healthy');
    console.log('Server time:', new Date(data.ts));
  }
};
```

#### Python
```python
import requests

response = requests.get('https://yourdomain.com/api/health')
data = response.json()

if data['ok']:
    print(f"Application is healthy at {data['ts']}")
```

### Integration Examples

#### UptimeRobot

1. Go to https://uptimerobot.com/
2. Click "Add New Monitor"
3. Monitor Type: HTTP(s)
4. URL: `https://yourdomain.com/api/health`
5. Monitoring Interval: 5 minutes
6. Advanced Settings:
   - Alert Contacts: Add your email/Slack
   - Keyword: `"ok":true`

#### Pingdom

1. Go to https://www.pingdom.com/
2. Add New Check
3. Check Type: HTTP
4. URL: `https://yourdomain.com/api/health`
5. Check Frequency: 1 minute
6. Alert Settings: Configure notifications

#### Docker Health Check

Add to your `Dockerfile`:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('https://app.trackfluence.app/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

#### Kubernetes Liveness Probe

Add to your deployment YAML:

```yaml
livenessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```

#### Load Balancer Health Check

**AWS Application Load Balancer:**
- Health Check Path: `/api/health`
- Success Codes: `200`
- Healthy Threshold: 2
- Unhealthy Threshold: 3
- Interval: 30 seconds

**Nginx:**
```nginx
upstream trackfluence {
  server app1:3000 max_fails=3 fail_timeout=30s;
  server app2:3000 max_fails=3 fail_timeout=30s;
}

location /api/health {
  proxy_pass http://trackfluence;
  proxy_connect_timeout 2s;
  proxy_read_timeout 5s;
}
```

## Sentry Integration

### Overview

Sentry provides real-time error tracking, performance monitoring, and session replay for both client and server-side code.

### Setup

#### 1. Create Sentry Account

1. Go to https://sentry.io/signup/
2. Create a new organization
3. Create a new project (Next.js)
4. Copy your DSN

#### 2. Configure Environment Variables

Add to `.env.local` (development) or platform environment (production):

```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token
```

#### 3. Generate Auth Token

1. Go to https://sentry.io/settings/account/api/auth-tokens/
2. Click "Create New Token"
3. Scopes: `project:read`, `project:write`, `project:releases`
4. Copy the token

#### 4. Test Integration

Create a test error to verify Sentry is working:

```typescript
// In any component or API route
throw new Error('Sentry test error');
```

Check Sentry dashboard - error should appear within seconds.

### Features

#### Error Tracking

Sentry automatically captures:
- ❌ Unhandled JavaScript exceptions
- ❌ Promise rejections
- ❌ API route errors
- ❌ React component errors
- ❌ Network failures

**Manual error capture:**
```typescript
import * as Sentry from "@sentry/nextjs";

try {
  // Your code
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'brand-creation',
    },
    level: 'error',
  });
}
```

#### Performance Monitoring

Sentry tracks:
- 📊 Page load times
- 📊 API response times
- 📊 Database query performance
- 📊 Component render times

**Custom transactions:**
```typescript
import * as Sentry from "@sentry/nextjs";

const transaction = Sentry.startTransaction({
  name: 'Import Orders',
  op: 'task',
});

try {
  // Your code
  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('error');
  throw error;
} finally {
  transaction.finish();
}
```

#### Session Replay

Sentry records user sessions when errors occur:
- 🎥 Video-like replay of user actions
- 🎥 Network requests
- 🎥 Console logs
- 🎥 DOM mutations

**Privacy settings** (already configured):
- `maskAllText: true` - Masks all text content
- `blockAllMedia: true` - Blocks images/videos

#### Breadcrumbs

Automatic tracking of user actions:
- 🍞 Navigation
- 🍞 Clicks
- 🍞 Form submissions
- 🍞 API calls
- 🍞 Console logs

### Configuration

#### Client-Side (Browser)

File: `sentry.client.config.ts`

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,          // 100% of transactions
  replaysSessionSampleRate: 0.1,   // 10% of sessions
  replaysOnErrorSampleRate: 1.0,   // 100% when error occurs
});
```

#### Server-Side (Node.js)

File: `sentry.server.config.ts`

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

#### Edge Runtime

File: `sentry.edge.config.ts`

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Best Practices

#### 1. Environment Filtering

Filter environments to avoid mixing dev/staging/prod errors:

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV, // 'development' | 'production'
});
```

#### 2. User Context

Set user context for better error attribution:

```typescript
import * as Sentry from "@sentry/nextjs";

// After user signs in
Sentry.setUser({
  id: session.user.id,
  email: session.user.email,
  username: session.user.name,
});

// On sign out
Sentry.setUser(null);
```

#### 3. Tags & Context

Add custom tags for filtering:

```typescript
Sentry.setTag('brand_id', brandId);
Sentry.setContext('order', {
  order_number: 'SHOP-1234',
  total: 125.50,
});
```

#### 4. Sampling

Adjust sample rates for cost management:

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Production: 10% of transactions
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Production: 1% of sessions, 100% on error
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

## Performance Monitoring

### Metrics to Track

#### Application Performance
- 📈 **Response Times** - API endpoint latency
- 📈 **Page Load Times** - Initial page load duration
- 📈 **Database Queries** - Query execution time
- 📈 **Error Rate** - Percentage of failed requests

#### Infrastructure
- 💻 **CPU Usage** - Server CPU utilization
- 💻 **Memory Usage** - RAM consumption
- 💻 **Disk I/O** - Read/write operations
- 💻 **Network** - Bandwidth usage

#### Business Metrics
- 📊 **Active Users** - Daily/monthly active users
- 📊 **Orders Ingested** - Data ingestion rate
- 📊 **API Requests** - Request volume
- 📊 **Conversion Rate** - Sign-ups to active users

### Monitoring Dashboard

Sentry provides built-in dashboards:

1. **Issues** - Error tracking and trends
2. **Performance** - Transaction performance
3. **Replays** - Session recordings
4. **Releases** - Deployment tracking
5. **Alerts** - Custom alert rules

### Custom Metrics

Track custom metrics with Sentry:

```typescript
import * as Sentry from "@sentry/nextjs";

// Track order ingestion
Sentry.metrics.increment('orders.ingested', 5, {
  tags: { source: 'shopify' },
});

// Track revenue
Sentry.metrics.distribution('orders.revenue', 125.50, {
  tags: { brand: brandId },
});
```

## Alerting

### Sentry Alert Rules

Set up alerts for critical issues:

#### 1. High Error Rate

1. Go to Alerts → Create Alert Rule
2. Trigger: "Error count" is above "100" in "1 hour"
3. Filters: Environment = production
4. Actions: Send email, Slack notification

#### 2. Performance Degradation

1. Trigger: "Transaction duration" is above "2000ms" in "10 minutes"
2. Filters: Transaction = "/api/overview"
3. Actions: Send PagerDuty alert

#### 3. User Impact

1. Trigger: "Users affected" is above "10" in "1 hour"
2. Filters: Error level = error
3. Actions: Send email to on-call engineer

### Uptime Monitoring Alerts

Configure alerts in your uptime monitoring tool:

**UptimeRobot:**
- Email alerts on downtime
- SMS alerts (optional)
- Webhook to Slack/Discord

**Pingdom:**
- Multi-channel alerts
- Escalation policies
- Integration with PagerDuty

### Custom Webhooks

Send alerts to custom endpoints:

```typescript
// Health check failure webhook
if (!healthCheck.ok) {
  await fetch('https://hooks.slack.com/services/YOUR/WEBHOOK', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: '🚨 Trackfluence health check failed!',
    }),
  });
}
```

## Troubleshooting

### Health Check Fails

**Symptoms:** `/api/health` returns 500 or times out

**Solutions:**
1. Check application logs for errors
2. Verify server is running
3. Check network/firewall rules
4. Review recent deployments

### Sentry Not Capturing Errors

**Symptoms:** Errors not appearing in Sentry dashboard

**Solutions:**
1. Verify `NEXT_PUBLIC_SENTRY_DSN` is set correctly
2. Check browser console for Sentry errors
3. Ensure error occurs after Sentry initialization
4. Check Sentry rate limits (free tier restrictions)

### Missing Source Maps

**Symptoms:** Stack traces show minified code

**Solutions:**
1. Verify `SENTRY_AUTH_TOKEN` is set in build environment
2. Check build logs for source map upload errors
3. Ensure `SENTRY_ORG` and `SENTRY_PROJECT` are correct
4. Run `npm run build` locally to test

### High Error Rate

**Symptoms:** Too many errors in Sentry

**Solutions:**
1. Review error patterns in Sentry dashboard
2. Group similar errors together
3. Ignore known issues (e.g., browser extensions)
4. Fix underlying bugs causing errors

## Best Practices

### Health Checks
- ✅ Keep health checks fast (<100ms)
- ✅ Don't perform expensive operations
- ✅ Return consistent response format
- ✅ Monitor from multiple locations

### Error Tracking
- ✅ Set appropriate sample rates
- ✅ Add user context when available
- ✅ Use tags for filtering
- ✅ Resolve issues promptly

### Performance
- ✅ Track key user journeys
- ✅ Set performance budgets
- ✅ Monitor trends over time
- ✅ Optimize slow endpoints

### Alerting
- ✅ Avoid alert fatigue
- ✅ Set appropriate thresholds
- ✅ Use escalation policies
- ✅ Test alert delivery

## Related Documentation

- [DEPLOY.md](./DEPLOY.md) - Deployment guide
- [AUTH_SETUP.md](../AUTH_SETUP.md) - Authentication setup
- [Sentry Documentation](https://docs.sentry.io/)
- [Next.js Monitoring](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)


