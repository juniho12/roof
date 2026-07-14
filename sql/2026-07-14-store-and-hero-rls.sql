-- Loja ROOF: store_settings table + store-images bucket
-- Idempotent. Mirrors the existing project security model: reads are public,
-- writes are gated by public.is_admin() for role `authenticated`.
--
-- NOTE ON THE HERO BACKGROUND BUG:
-- The hero RLS is NOT broken. Verified against the live DB: hero_section has a
-- correct UPDATE policy (USING is_admin()) and the hero-images bucket has correct
-- INSERT/UPDATE/DELETE policies (is_admin()); a valid admin session updates the
-- row and uploads successfully. The "row-level security policy" error occurs when
-- the request arrives WITHOUT a valid admin session (expired/stale token -> anon
-- -> is_admin() = false). Fix that by re-authenticating in /admin, not by changing
-- the schema. This script therefore does NOT touch hero_section or hero-images.

-- 1. Table -------------------------------------------------------------------
create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  link_url text,
  image_1_url text,
  image_2_url text,
  image_3_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Seed exactly one row ----------------------------------------------------
insert into public.store_settings (link_url)
select null
where not exists (select 1 from public.store_settings);

-- 3. RLS on store_settings (mirror hero_section) -----------------------------
alter table public.store_settings enable row level security;

drop policy if exists "Anyone can view store settings" on public.store_settings;
create policy "Anyone can view store settings"
  on public.store_settings for select
  using (true);

drop policy if exists "Admins can insert store settings" on public.store_settings;
create policy "Admins can insert store settings"
  on public.store_settings for insert
  to authenticated
  with check (is_admin());

drop policy if exists "Admins can update store settings" on public.store_settings;
create policy "Admins can update store settings"
  on public.store_settings for update
  to authenticated
  using (is_admin());

drop policy if exists "Admins can delete store settings" on public.store_settings;
create policy "Admins can delete store settings"
  on public.store_settings for delete
  to authenticated
  using (is_admin());

-- 4. store-images bucket (public, mirror hero-images) ------------------------
insert into storage.buckets (id, name, public)
values ('store-images', 'store-images', true)
on conflict (id) do nothing;

-- Public read is served directly (bucket is public); no SELECT policy needed,
-- matching the existing hero-/slider-/about-images buckets.
drop policy if exists "Admins can upload store images" on storage.objects;
create policy "Admins can upload store images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'store-images' and is_admin());

drop policy if exists "Admins can update store images" on storage.objects;
create policy "Admins can update store images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'store-images' and is_admin());

drop policy if exists "Admins can delete store images" on storage.objects;
create policy "Admins can delete store images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'store-images' and is_admin());
