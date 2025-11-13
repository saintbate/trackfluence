-- Create brand table if it doesn't exist
create table if not exists public.brand (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_email text not null,
  created_at timestamptz not null default now()
);

-- Helpful index
create index if not exists idx_brand_owner_email on public.brand(owner_user_email);

