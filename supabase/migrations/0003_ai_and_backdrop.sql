-- MYSTORR.IN — Migration 0003: AI description usage + product backdrop style
-- Additive only. Safe to re-run.
-- 1) Per-store monthly quota for the AI product-description writer (10 free /
--    calendar month). `ai_generations_used` counts this period; the period
--    rolls over once `now >= ai_generations_reset` (reset stores the first day
--    of the next month).
-- 2) `backdrop_style` on products drives a CSS-only styled photo backdrop on the
--    storefront product card. Defaults to 'plain' for every existing product.
-- Run this in the Supabase SQL editor.

alter table public.stores
  add column if not exists ai_generations_used integer not null default 0;

alter table public.stores
  add column if not exists ai_generations_reset date;

alter table public.products
  add column if not exists backdrop_style text not null default 'plain';
  -- 'plain' | 'soft-gradient' | 'boutique'

-- Value guard for backdrop_style.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_backdrop_style_check'
  ) then
    alter table public.products
      add constraint products_backdrop_style_check
      check (backdrop_style in ('plain','soft-gradient','boutique'));
  end if;
end $$;
