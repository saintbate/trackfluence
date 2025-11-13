-- Instagram Integration (Phase 1)
-- Do NOT drop existing tables.

-- Secrets table (server-only access)
create table if not exists public.secrets (
  key text primary key,
  value text not null,
  created_at timestamptz not null default now()
);

-- Connected IG account per brand (one or more)
create table if not exists public.brand_social_account (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brand(id) on delete cascade,
  platform text not null check (platform in ('instagram')),
  external_account_id text not null,    -- ig user id
  account_name text,
  connected_at timestamptz not null default now(),
  secret_key text not null,             -- key in public.secrets for token
  unique (brand_id, platform, external_account_id)
);

-- Daily account insights (rollup for charts/KPIs)
create table if not exists public.ig_account_insights_daily (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brand(id) on delete cascade,
  ig_user_id text not null,
  date date not null,
  impressions bigint not null default 0,
  reach bigint not null default 0,
  profile_views bigint not null default 0,
  follower_count bigint not null default 0,
  created_at timestamptz not null default now(),
  unique (brand_id, ig_user_id, date)
);

-- Media insights (per post/reel, normalized)
create table if not exists public.ig_media_insights (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brand(id) on delete cascade,
  ig_user_id text not null,
  media_id text not null,
  media_type text,
  permalink text,
  caption text,
  posted_at timestamptz,
  impressions bigint not null default 0,
  reach bigint not null default 0,
  engagement bigint not null default 0,
  likes bigint not null default 0,
  comments bigint not null default 0,
  saves bigint not null default 0,
  video_views bigint not null default 0,
  plays bigint not null default 0,
  created_at timestamptz not null default now(),
  unique (brand_id, media_id)
);

-- RLS skeletons (adjust per tenant scheme)
alter table public.secrets enable row level security;
alter table public.brand_social_account enable row level security;
alter table public.ig_account_insights_daily enable row level security;
alter table public.ig_media_insights enable row level security;

do $$ begin
  create policy secrets_no_access on public.secrets
    for all using (false) with check (false);
exception when duplicate_object then null; end $$;


