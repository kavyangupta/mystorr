-- MYSTORR.IN — Migration 0002: Store category
-- Additive only. Safe to re-run.
-- Drives the public storefront layout density (jewellery/clothing = single
-- column 4:5, homemade = 2-col square, food = daily-menu mode). Set once at
-- signup; no seller-facing settings UI. Does NOT change colours/fonts/branding.
-- Run this in the Supabase SQL editor.

alter table public.stores
  add column if not exists category text;
  -- 'jewellery' | 'clothing' | 'homemade' | 'food'  (null = legacy catalogue)

-- Optional value guard. Allows null for pre-existing stores.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'stores_category_check'
  ) then
    alter table public.stores
      add constraint stores_category_check
      check (category is null or category in ('jewellery','clothing','homemade','food'));
  end if;
end $$;
