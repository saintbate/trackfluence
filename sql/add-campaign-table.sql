-- Create campaign table if it doesn't exist
create table if not exists public.campaign (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brand(id) on delete cascade,
  name text not null,
  start_date date,
  end_date date,
  budget numeric(12, 2),
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_campaign_brand_id on public.campaign(brand_id);
create index if not exists idx_campaign_dates on public.campaign(start_date, end_date);

-- Seed a demo campaign (optional, adjust brand_id as needed)
-- Uncomment and adjust if you want a seed row:
-- INSERT INTO public.campaign (brand_id, name, start_date, end_date, budget)
-- VALUES (
--   (SELECT id FROM public.brand LIMIT 1),
--   'Demo Campaign',
--   CURRENT_DATE,
--   CURRENT_DATE + INTERVAL '30 days',
--   10000.00
-- )
-- ON CONFLICT DO NOTHING;

