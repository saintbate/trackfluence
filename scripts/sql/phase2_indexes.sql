-- Run these statements in the Supabase SQL editor manually (do not run via migrations).
-- Phase 2 indexes to improve influencer activity and campaign summaries.

-- Activity scans by influencer + time
create index if not exists report_influencer_time_idx
  on public.report (influencer_id, period_start, period_end);

-- Campaign summaries by brand + time
create index if not exists report_brand_campaign_time_idx
  on public.report (brand_id, campaign_id, period_start, period_end);

-- Tighten join on (brand_id, influencer_id)
create index if not exists report_brand_influencer_idx
  on public.report (brand_id, influencer_id);


