-- Loja ROOF: store_settings table + store-images bucket + hero RLS fix
-- Idempotent. Run in the Supabase SQL editor.

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

-- 3. RLS on store_settings ---------------------------------------------------
alter table public.store_settings enable row level security;

drop policy if exists "store_settings public read" on public.store_settings;
create policy "store_settings public read"
  on public.store_settings for select
  using (true);

drop policy if exists "store_settings authenticated write" on public.store_settings;
create policy "store_settings authenticated write"
  on public.store_settings for all
  to authenticated
  using (true)
  with check (true);

-- 4. store-images bucket -----------------------------------------------------
insert into storage.buckets (id, name, public)
values ('store-images', 'store-images', true)
on conflict (id) do nothing;

drop policy if exists "store-images public read" on storage.objects;
create policy "store-images public read"
  on storage.objects for select
  using (bucket_id = 'store-images');

drop policy if exists "store-images authenticated write" on storage.objects;
create policy "store-images authenticated write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'store-images');

drop policy if exists "store-images authenticated update" on storage.objects;
create policy "store-images authenticated update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'store-images')
  with check (bucket_id = 'store-images');

drop policy if exists "store-images authenticated delete" on storage.objects;
create policy "store-images authenticated delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'store-images');

-- 5. Hero RLS fix ------------------------------------------------------------
-- The reported bug: changing the hero background image fails with a
-- row-level-security error. Ensure both the table UPDATE policy and the
-- hero-images bucket write policies exist. Safe whichever was missing.
alter table public.hero_section enable row level security;

drop policy if exists "hero_section public read" on public.hero_section;
create policy "hero_section public read"
  on public.hero_section for select
  using (true);

drop policy if exists "hero_section authenticated write" on public.hero_section;
create policy "hero_section authenticated write"
  on public.hero_section for all
  to authenticated
  using (true)
  with check (true);

insert into storage.buckets (id, name, public)
values ('hero-images', 'hero-images', true)
on conflict (id) do nothing;

drop policy if exists "hero-images public read" on storage.objects;
create policy "hero-images public read"
  on storage.objects for select
  using (bucket_id = 'hero-images');

drop policy if exists "hero-images authenticated write" on storage.objects;
create policy "hero-images authenticated write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'hero-images');

drop policy if exists "hero-images authenticated update" on storage.objects;
create policy "hero-images authenticated update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'hero-images')
  with check (bucket_id = 'hero-images');
