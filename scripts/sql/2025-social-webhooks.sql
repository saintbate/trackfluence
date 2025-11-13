create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('instagram','tiktok')),
  payload jsonb not null,
  received_at timestamptz not null default now()
);
alter table public.webhook_events enable row level security;

do $$ begin
  create policy webhook_events_no_access on public.webhook_events for all using (false) with check (false);
exception when duplicate_object then null; end $$;


