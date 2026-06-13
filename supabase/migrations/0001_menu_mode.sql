-- MYSTORR.IN — Migration 0001: Daily Menu mode fields
-- Additive only. Safe to re-run. Does NOT change catalogue-mode behaviour.
-- Run this in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- stores: kitchen ordering hours, operating days, holiday mode, delivery info
-- ---------------------------------------------------------------------------
alter table public.stores
  add column if not exists order_start_time text,                 -- 'HH:MM' 24h, e.g. '08:00'
  add column if not exists order_end_time text,                   -- 'HH:MM' 24h, e.g. '11:00'
  add column if not exists operating_days jsonb not null default '[0,1,2,3,4,5,6]'::jsonb, -- 0=Sun..6=Sat
  add column if not exists delivery_info text,                    -- free text, e.g. 'Free above ₹200'
  add column if not exists min_order text,                        -- free text, e.g. '₹100'
  add column if not exists advance_order_notice text,             -- free text, e.g. 'Order 1 day ahead'
  add column if not exists holiday_mode boolean not null default false,
  add column if not exists holiday_return_date date;

-- ---------------------------------------------------------------------------
-- products: category, scheduling, dietary + serving metadata
-- ---------------------------------------------------------------------------
alter table public.products
  add column if not exists category text not null default 'todays_special',
  -- 'todays_special' | 'always_available' | 'weekly_special' | 'festival_special' | 'preorder'
  add column if not exists weekly_day smallint,                   -- 0=Sun..6=Sat, for weekly_special
  add column if not exists festival_name text,                    -- for festival_special
  add column if not exists festival_deadline date,                -- for festival_special / preorder
  add column if not exists prep_time_mins integer,                -- ready-in estimate
  add column if not exists dietary_tags text[] not null default '{}', -- Veg, Jain, Contains dairy, ...
  add column if not exists serves text;                           -- '1' | '2' | '4' | 'family'
