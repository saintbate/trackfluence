-- Speeds brand/date timeseries & aggregations
create index concurrently if not exists idx_report_brand_date
  on public.report (brand_id, period_start);

create index concurrently if not exists idx_report_brand_campaign
  on public.report (brand_id, campaign_id);

-- Influencer leaderboard scanning
create index concurrently if not exists idx_report_brand_influencer
  on public.report (brand_id, influencer_id);


