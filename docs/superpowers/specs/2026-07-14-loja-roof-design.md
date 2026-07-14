# Loja ROOF — Design

Date: 2026-07-14

## Goal

Add an official-store presence to the ROOF landing site plus backoffice control, and
fix the row-level-security error that currently blocks changing the hero background image.

Three deliverables:

1. **Bug fix** — updating the hero background image fails with an RLS error.
2. **New landing section "LOJA OFICIAL DA ROOF"** below the "A Produtora" section, styled
   like the "Veja o que te espera nas próximas edições" section, but with **3 backoffice-configured
   images** (not the 2-card image+video carousel).
3. **New "LOJA ROOF" button** in the hero, plus backoffice configuration of the store link.
   The same link is used by the 3 store-section images when clicked.

## Non-goals

- No per-image links in the store section — all 3 images and the hero button share one URL.
- No add/remove/reorder UI for store images — exactly 3 fixed slots.
- Store section title/subtitle are hardcoded, not editable in backoffice.

## Decisions (from brainstorming)

- Hero button placement: **3rd item on the bottom links row** → 2 buttons on top, 3 items on bottom.
- Store section title/subtitle: **fixed in code**.
- Store images: **exactly 3**, fixed slots.

## Data model

New single-row table `store_settings`:

| column        | type        | notes                          |
|---------------|-------------|--------------------------------|
| id            | uuid pk     | default gen_random_uuid()      |
| link_url      | text null   | shared store URL               |
| image_1_url   | text null   | store image slot 1             |
| image_2_url   | text null   | store image slot 2             |
| image_3_url   | text null   | store image slot 3             |
| created_at    | timestamptz | default now()                  |
| updated_at    | timestamptz | default now()                  |

Seeded with exactly one row (all nullable fields NULL). App always reads `.single()`.

New TypeScript type `StoreSettings` in `src/types/database.ts` mirroring the table.

## Storage

New public bucket `store-images`, matching existing buckets (`hero-images`, `about-images`,
`slider-images`): public read, authenticated write. Public URLs built the same way:
`${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-images/${filename}`.

## Landing changes

### `src/components/landing/StoreSection.tsx` (new)

- Props: `settings: StoreSettings`.
- Section shell mirrors `PhotoSlider`'s outer markup: `py-16` section, centered header with
  `font-display` title + subtitle paragraph.
- Title: `LOJA OFICIAL DA ROOF`. Subtitle: `Retire sua peça favorita em nossos eventos ou combine a retirada`.
- Grid: `grid-cols-1 sm:grid-cols-3 gap-6`, three cards, `aspect-[4/3] rounded-2xl overflow-hidden`.
- Each set image renders via `next/image` (`fill`, `object-cover`, `quality={60}`, `loading="lazy"`,
  `sizes` for 3-up). Unset slot → neutral gradient placeholder (same as PhotoSlider empty state).
- If `link_url` set, each image wrapped in `<a href={link_url} target="_blank" rel="noopener noreferrer">`
  with `cursor-pointer`; otherwise not clickable.
- Background color: distinct from the `#140004` Produtora section directly above and readable —
  reuse the PhotoSlider `#99001f` shell for visual parity with the reference section.

### `src/components/landing/Hero.tsx`

- Add `storeUrl: string | null` to `Props`.
- Add a **3rd item to the bottom links row** using the existing `renderLink` visual style:
  `ShoppingBag` icon (lucide), label `LOJA ROOF`, href = `storeUrl`. When `storeUrl` is falsy,
  render the inactive/disabled style (same treatment as inactive links).
- The links row container currently holds 2 items in a `flex ... max-w-xl`; it now holds 3.

### `src/app/page.tsx`

- Add `supabase.from('store_settings').select('*').single()` to the `Promise.all` in `getData()`.
- Return `storeSettings`.
- Pass `storeUrl={data.storeSettings?.link_url ?? null}` to `<Hero>`.
- Render `<LazyMount minHeight={500}><StoreSection settings={data.storeSettings} /></LazyMount>`
  immediately after `<ProdutoraSection>` and before the `Footer`.
- If `storeSettings` is null (row missing), skip the section (guard like `contentSection`).

## Backoffice changes

### `src/app/admin/(protected)/loja/page.tsx` (new)

Client component, same conventions as `hero/page.tsx` + `produtora/page.tsx`:

- Load the single `store_settings` row on mount.
- Link editor: text input bound to `link_url` + "Salvar" button → `update({ link_url, updated_at })`.
- Three `ImageUploader` components (bucket `store-images`), one per slot, each `onUploaded`
  writing its column (`image_1_url` / `image_2_url` / `image_3_url`) via
  `update({ [col]: url, updated_at })` on the row id.
- `PageHeader` title "Loja ROOF", description about managing store link + images.

### `src/components/admin/Sidebar.tsx`

- Add nav item `{ href: '/admin/loja', label: 'Loja ROOF', icon: ShoppingBag }` (import `ShoppingBag`
  from lucide-react). Place after "Seção Produtora".

## SQL script

File `sql/2026-07-14-store-and-hero-rls.sql`, idempotent, run in the Supabase SQL editor (repo has
no migration tooling). Contents:

1. `create table if not exists store_settings (...)` with the columns above.
2. Seed: insert one row if the table is empty.
3. Enable RLS on `store_settings`; policies:
   - public `select` (matches other content tables read by the anon landing client).
   - `all` for role `authenticated` (backoffice writes).
   Use `drop policy if exists` + `create policy` for idempotency.
4. `insert into storage.buckets (id, name, public) values ('store-images','store-images', true)
   on conflict do nothing;`
5. Storage policies on `storage.objects` for bucket `store-images`: public read,
   authenticated insert/update/delete — mirroring the existing image buckets.
6. **Hero fix**: ensure `hero_section` has an `authenticated` `update` policy and `hero-images`
   bucket has authenticated write policies. Written idempotently (`drop policy if exists` first) so
   it is safe whether the missing piece is the table policy, the bucket policy, or both.

Diagnosis note: at implementation time confirm via the Supabase SQL editor / MCP which policy was
actually missing (table `hero_section` UPDATE vs `hero-images` bucket write) and verify the fix
resolves the reported error; the script covers both regardless.

## Verification

- Backoffice: set store link + upload 3 images at `/admin/loja`; reload → values persist.
- Landing: store section renders 3 images under Produtora with correct title/subtitle; clicking an
  image opens the store link; hero shows a 3rd "LOJA ROOF" item linking to the same URL.
- Hero bug: changing the hero background image in `/admin/hero` succeeds (no RLS error) after the
  SQL script is applied.
- `next build` / typecheck passes; new `StoreSettings` type used end-to-end.

## Files touched

- New: `src/components/landing/StoreSection.tsx`, `src/app/admin/(protected)/loja/page.tsx`,
  `sql/2026-07-14-store-and-hero-rls.sql`.
- Edited: `src/app/page.tsx`, `src/components/landing/Hero.tsx`,
  `src/components/admin/Sidebar.tsx`, `src/types/database.ts`.
