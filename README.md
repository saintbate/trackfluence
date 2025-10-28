# Trackfluence

An influencer marketing analytics platform built with Next.js, Supabase, and NextAuth.

## Features

- 🔐 **Authentication** - Google OAuth & email magic links
- 📊 **Analytics Dashboard** - Revenue, orders, ROAS tracking
- 📈 **Visual Charts** - Bar charts with Recharts
- 🏢 **Brand Management** - Create and manage multiple brands
- 👥 **Influencer Tracking** - Monitor influencer performance
- 📥 **Data Ingestion** - Import from Shopify & Google Analytics 4
- 📤 **CSV Export** - Export influencer data
- 🎨 **Modern UI** - Tailwind CSS with responsive design
- 🚨 **Error Tracking** - Sentry integration
- ⚡ **Health Checks** - Monitoring endpoint

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database (Supabase recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd trackfluence

# Install dependencies
npm install

# Copy environment variables
cp .env.production.example .env.local

# Edit .env.local with your values
# See AUTH_SETUP.md for detailed instructions
```

### Database Setup

```bash
# Run migrations
npm run db:migrate

# Apply RLS policies
npm run db:rls

# Seed demo data (optional)
npm run seed:demo
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you'll be redirected to sign in.

## Documentation

### Setup & Configuration
- **[AUTH_SETUP.md](AUTH_SETUP.md)** - Complete authentication setup guide
- **[BRAND_CREATION.md](BRAND_CREATION.md)** - Brand creation feature documentation
- **[CHART_FEATURE.md](CHART_FEATURE.md)** - Revenue charts and enhanced tables

### Data & Integration
- **[INGESTION_API.md](INGESTION_API.md)** - Shopify & GA4 data import API
- **[sql/](sql/)** - Database migrations and RLS policies

### Deployment & Operations
- **[docs/DEPLOY.md](docs/DEPLOY.md)** - Production deployment guide
- **[docs/MONITORING.md](docs/MONITORING.md)** - Health checks & Sentry setup
- **[docs/BILLING.md](docs/BILLING.md)** - Stripe billing & subscriptions

## Technology Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication:** [NextAuth.js v5](https://next-auth.js.org/)
- **UI:** [Tailwind CSS](https://tailwindcss.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Error Tracking:** [Sentry](https://sentry.io/)
- **Data Fetching:** [SWR](https://swr.vercel.app/)

## Project Structure

```
trackfluence/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth handlers
│   │   ├── brands/       # Brand CRUD
│   │   ├── campaigns/    # Campaign data
│   │   ├── overview/     # Analytics data
│   │   ├── ingest/       # Data ingestion
│   │   └── health/       # Health check
│   ├── signin/           # Sign-in page
│   ├── page.tsx          # Overview dashboard
│   └── layout.tsx        # Root layout
├── components/
│   ├── BrandSelect.tsx           # Brand dropdown
│   ├── CampaignControls.tsx     # Campaign & date selector
│   ├── CreateBrandModal.tsx     # Brand creation modal
│   ├── OverviewKpis.tsx          # KPI cards
│   ├── TopInfluencers.tsx        # Influencer table
│   ├── RevenueByInfluencerChart.tsx  # Bar chart
│   ├── ExportCsvButton.tsx       # CSV export
│   ├── UserMenu.tsx              # User dropdown
│   └── SessionProvider.tsx       # Auth wrapper
├── sql/
│   ├── rls-policies.sql          # Row level security
│   ├── add-owner-column.sql      # Auth migration
│   ├── add-brand-columns.sql     # Brand fields
│   ├── add-order-tracking-columns.sql  # Order fields
│   └── seed-demo.sql             # Demo data
├── docs/
│   ├── DEPLOY.md         # Deployment guide
│   └── MONITORING.md     # Monitoring setup
├── auth.ts               # NextAuth config
├── middleware.ts         # Route protection
├── sentry.*.config.ts    # Sentry configs
└── next.config.ts        # Next.js config
```

## Key Features

### Authentication
- Google OAuth integration
- Email magic links (Resend)
- Protected routes with middleware
- User session management

### Brand Management
- Create multiple brands
- Shop domain & timezone settings
- Auto-generated starter campaigns
- User ownership via email

### Analytics
- Revenue, orders, spend tracking
- ROAS calculations with color-coded badges
- Date range filtering
- Campaign-specific views
- "All campaigns" aggregate view

### Data Ingestion
- Shopify order import
- Google Analytics 4 integration
- Batch upload support
- Automatic influencer resolution
- Upsert by order number

### Visualizations
- Revenue bar charts
- Color-coded ROAS badges
- Totals footer rows
- CSV export functionality

## API Endpoints

### Public
- `GET /api/health` - Health check

### Authenticated
- `GET /api/brands` - List brands
- `POST /api/brands` - Create brand
- `GET /api/campaigns` - List campaigns
- `GET /api/overview` - Analytics data
- `GET /api/brand-date-bounds` - Date range
- `POST /api/ingest/shopify` - Import Shopify data
- `POST /api/ingest/ga4` - Import GA4 data

## Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:migrate       # Run migrations
npm run db:rls           # Apply RLS policies
npm run seed:demo        # Seed demo data
```

## Environment Variables

See `.env.production.example` for a complete list of required and optional environment variables.

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

**Optional:**
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `RESEND_API_KEY` / `EMAIL_FROM`
- `NEXT_PUBLIC_SENTRY_DSN`
- `STRIPE_SECRET_KEY` / `STRIPE_PRICE_ID` / `STRIPE_WEBHOOK_SECRET`

## Deployment

See **[docs/DEPLOY.md](docs/DEPLOY.md)** for detailed deployment instructions for:
- Vercel (recommended)
- Railway
- Docker
- Custom servers

## Monitoring

- **Health Check:** `GET /api/health`
- **Error Tracking:** Sentry (automatic)
- **Performance:** Sentry transactions
- **Session Replay:** Sentry replays (on errors)

See **[docs/MONITORING.md](docs/MONITORING.md)** for setup instructions.

## Security

- Row Level Security (RLS) on all tables
- Server-side session validation
- Environment variable validation
- HTTPS enforcement in production
- Auth tokens stored server-side only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linter: `npm run lint`
5. Test your changes
6. Submit a pull request

## Support

For issues and questions:
- Check the [documentation](#documentation)
- Review existing issues on GitHub
- Create a new issue with details

## License

[Your License Here]

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Sentry](https://sentry.io/)
