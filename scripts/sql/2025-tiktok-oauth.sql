-- TikTok OAuth tables (idempotent)
create table if not exists public.secrets (
  key text primary key,
  value text not null,
  created_at timestamptz not null default now()
);
alter table public.secrets enable row level security;
do $$ begin
  create policy secrets_no_access on public.secrets for all using (false) with check (false);
exception when duplicate_object then null; end $$;

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
alter table public.brand_social_account enable row level security;


