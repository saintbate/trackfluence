🚀 Trackfluence

Trackfluence is a next-generation influencer marketing analytics platform designed for brands, agencies, and creators who need clear visibility into revenue, ROAS, influencer performance, and campaign-level insights. Built with Next.js, Supabase, and NextAuth, it delivers production-ready analytics with a premium UI and a fast developer workflow.

Trackfluence integrates with Shopify, Google Analytics 4, and soon TikTok + Instagram APIs to give teams a consolidated view of campaign performance across platforms.
⸻
🌟 Why Trackfluence Exists
Influencer marketing has outgrown spreadsheets. Brands struggle to measure:

- What influencers actually drive revenue
- Which campaigns produce profitable returns
- How ROAS changes over time
- How performance compares across influencers, products, and time ranges

Trackfluence solves this with automated ingestion pipelines, visual dashboards, and creator-level tracking.
⸻
📊 Features

Authentication
- Google OAuth & email magic links
- Protected routes with middleware
- Server-stored auth tokens
- User session management

Analytics Dashboard
- Revenue, orders, and spend tracking
- ROAS calculations with color-coded badges
- Date-range filtering
- Campaign-level breakdowns
- “All campaigns” aggregate view

Brand Management
- Create & manage multiple brands
- Shop domain + timezone settings
- Auto-generated starter campaigns
- Brand-level filtering + ownership via email

Influencer Tracking
- Track influencer-level revenue + orders
- Bar charts built with Recharts
- CSV export functionality

Data Ingestion
- Shopify order import
- Google Analytics 4 ingestion
- Automatic influencer match resolution
- Upsert behavior for duplicate orders
- Batch ingestion support

Visual Charts
- Bar charts for revenue and ROAS
- Color-coded performance tags
- Clean, modern UI built with Tailwind

Export Tools
- CSV export for influencer or order data

Error Tracking & Observability
- Sentry monitoring & replay
- Performance tracing
- API health checks (/api/health)
⸻
🧱 Technology Stack
Category	Tech
Framework	Next.js 15 (App Router)
Database	Supabase (PostgreSQL)
Auth	NextAuth.js v5
UI	Tailwind CSS
Charts	Recharts
Monitoring	Sentry
Data Fetching	SWR
⸻
⚙️ Quick Start

Prerequisites
- Node.js 20+
- PostgreSQL (Supabase recommended)
- npm or yarn

Installation

# Clone the repository
git clone <your-repo-url>
cd trackfluence

# Install dependencies
npm install

# Copy environment variables
cp .env.production.example .env.local

# Edit .env.local with your values
# See AUTH_SETUP.md for detailed instructions

⸻
🗄️ Database Setup

# Run migrations
npm run db:migrate

# Apply RLS policies
npm run db:rls

# Seed demo data (optional)
npm run seed:demo

⸻
💻 Development

npm run dev


App will run at:

http://localhost:3000


You will be redirected to the sign-in page.
⸻
📚 Documentation

Setup & Configuration
- AUTH_SETUP.md – Authentication setup
- BRAND_CREATION.md – Brand creation feature
- CHART_FEATURE.md – Revenue charts + tables

Data & Integration
- INGESTION_API.md – Shopify + GA4 import APIs
- SQL Migrations – Located in /sql directory

Deployment
- docs/DEPLOY.md – Vercel / Railway / Docker deployment

Monitoring
- docs/MONITORING.md – Sentry setup + health checks
⸻
🧩 Project Structure

trackfluence/
│
├── app/                      # App Router
│   ├── api/                  # API routes
│   │   ├── auth/             # NextAuth handlers
│   │   ├── brands/           # Brand CRUD
│   │   ├── campaigns/        # Campaign data
│   │   ├── overview/         # Analytics overview
│   │   ├── ingest/           # Data ingestion
│   │   └── ingest/ga4        # GA4 ingestion
│   ├── health/               # Health check
│   ├── signin/               # Sign-in page
│   └── layout.tsx            # Root layout
│
├── components/               # Reusable components
│   ├── BrandSelect.tsx
│   ├── CampaignDateControls.tsx
│   ├── CreateBrandModal.tsx
│   ├── KpiCards.tsx
│   ├── TopInfluencers.tsx
│   ├── RevenueByInfluencerChart.tsx
│   ├── ExportCsvButton.tsx
│   └── SessionProvider.tsx
│
├── sql/                      # Database + RLS scripts
│   ├── rls-policies.sql
│   ├── add-owner-column.sql
│   ├── add-brand-columns.sql
│   ├── add-order-tracking-columns.sql
│   └── seed-demo.sql
│
└── docs/                     # Documentation

⸻
🔌 API Endpoints

Public
- GET /api/health – Health check

Authenticated
- GET /api/brands
- POST /api/brands
- GET /api/campaigns
- GET /api/overview
- GET /api/brand-date-bounds
- POST /api/ingest/shopify
- POST /api/ingest/ga4
⸻
🔐 Environment Variables

See .env.production.example for the full list.

Required
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET


Optional
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
RESEND_API_KEY
EMAIL_FROM
NEXT_PUBLIC_SENTRY_DSN
STRIPE_SECRET_KEY
STRIPE_PRICE_ID
STRIPE_WEBHOOK_SECRET

⸻
🛡 Security

- Row Level Security (RLS) on all database tables
- Server-side session validation
- Environment variable validation
- HTTPS enforcement
- Secure token handling
⸻
🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Run: npm run lint
5. Test your changes
6. Submit a PR
⸻
🆘 Support

For issues and questions:
- Check the documentation
- Open a new GitHub issue
⸻
📄 License

MIT or custom license — add your preferred license here.
⸻
🙌 Acknowledgments

Built with:

- Next.js
- Supabase
- NextAuth
- TailwindCSS
- Recharts
- Sentry
