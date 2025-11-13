-- RLS Policies for Secrets & Social Accounts (idempotent)

-- Secrets
alter table public.secrets enable row level security;
do $$ begin
  drop policy if exists secrets_no_access on public.secrets;
  create policy secrets_no_access on public.secrets
    for all using (false) with check (false);
exception when duplicate_object then null; end $$;

-- Brand social account (assumes brand has owner_user_id/email)
alter table public.brand_social_account enable row level security;

do $$ begin
  drop policy if exists bsa_owner_read on public.brand_social_account;
  create policy bsa_owner_read on public.brand_social_account
    for select using (
      exists (
        select 1 from public.brand b
        where b.id = brand_social_account.brand_id
          and (b.owner_user_id = auth.uid() or b.owner_user_email = auth.email())
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  drop policy if exists bsa_owner_write on public.brand_social_account;
  create policy bsa_owner_write on public.brand_social_account
    for insert with check (
      exists (
        select 1 from public.brand b
        where b.id = brand_social_account.brand_id
          and (b.owner_user_id = auth.uid() or b.owner_user_email = auth.email())
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  drop policy if exists bsa_owner_delete on public.brand_social_account;
  create policy bsa_owner_delete on public.brand_social_account
    for delete using (
      exists (
        select 1 from public.brand b
        where b.id = brand_social_account.brand_id
          and (b.owner_user_id = auth.uid() or b.owner_user_email = auth.email())
      )
    );
exception when duplicate_object then null; end $$;


