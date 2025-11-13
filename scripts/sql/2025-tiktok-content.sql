-- TikTok Content API for Business (Phase 1)
-- Do NOT drop existing tables.

create table if not exists public.secrets (
  key text primary key,
  value text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.brand_social_account (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brand(id) on delete cascade,
  platform text not null check (platform in ('instagram','tiktok')),
  external_account_id text not null,
  account_name text,
  connected_at timestamptz not null default now(),
  secret_key text not null,
  unique (brand_id, platform, external_account_id)
);

create table if not exists public.tiktok_account_insights_daily (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brand(id) on delete cascade,
  tiktok_business_account_id text not null,
  date date not null,
  followers bigint not null default 0,
  views bigint not null default 0,
  likes bigint not null default 0,
  comments bigint not null default 0,
  shares bigint not null default 0,
  created_at timestamptz not null default now(),
  unique (brand_id, tiktok_business_account_id, date)
);

create table if not exists public.tiktok_media_insights (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brand(id) on delete cascade,
  tiktok_business_account_id text not null,
  video_id text not null,
  title text,
  permalink text,
  posted_at timestamptz,
  views bigint not null default 0,
  likes bigint not null default 0,
  comments bigint not null default 0,
  shares bigint not null default 0,
  avg_watch_time_seconds numeric,
  completion_rate numeric,
  created_at timestamptz not null default now(),
  unique (brand_id, video_id)
);

alter table public.secrets enable row level security;
alter table public.brand_social_account enable row level security;
alter table public.tiktok_account_insights_daily enable row level security;
alter table public.tiktok_media_insights enable row level security;

do $$ begin
  create policy secrets_no_access on public.secrets for all using (false) with check (false);
exception when duplicate_object then null; end $$;


