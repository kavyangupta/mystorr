-- MYSTORR.IN — Supabase schema
-- Run this in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  store_name text not null unique,            -- URL slug
  display_name text not null,
  bio text,
  profile_image_url text,
  instagram_handle text,
  whatsapp_number text,                       -- stored as 91XXXXXXXXXX
  upi_id text,
  store_mode text not null default 'catalogue', -- 'catalogue' | 'menu'
  is_open boolean not null default true,
  is_pro boolean not null default false,
  -- daily menu mode (see migrations/0001_menu_mode.sql)
  order_start_time text,                         -- 'HH:MM' 24h
  order_end_time text,                           -- 'HH:MM' 24h
  operating_days jsonb not null default '[0,1,2,3,4,5,6]'::jsonb, -- 0=Sun..6=Sat
  delivery_info text,
  min_order text,
  advance_order_notice text,
  holiday_mode boolean not null default false,
  holiday_return_date date,
  created_at timestamptz not null default now()
);

create unique index if not exists stores_user_id_idx on public.stores (user_id);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  name text not null,
  description text,
  price integer not null default 0,           -- paise (₹299 = 29900)
  image_url text,
  quantity_available integer not null default -1, -- -1 = unlimited, 0 = sold out
  is_available boolean not null default true,
  is_todays_special boolean not null default false,
  -- daily menu mode (see migrations/0001_menu_mode.sql)
  category text not null default 'todays_special', -- todays_special | always_available | weekly_special | festival_special | preorder
  weekly_day smallint,                           -- 0=Sun..6=Sat
  festival_name text,
  festival_deadline date,
  prep_time_mins integer,
  dietary_tags text[] not null default '{}',
  serves text,                                   -- '1' | '2' | '4' | 'family'
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists products_store_id_idx on public.products (store_id);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  amount integer not null default 0,          -- paise
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists orders_store_id_idx on public.orders (store_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- stores: readable by anyone, manageable only by owner
drop policy if exists "stores_select_public" on public.stores;
create policy "stores_select_public" on public.stores
  for select using (true);

drop policy if exists "stores_insert_owner" on public.stores;
create policy "stores_insert_owner" on public.stores
  for insert with check (auth.uid() = user_id);

drop policy if exists "stores_update_owner" on public.stores;
create policy "stores_update_owner" on public.stores
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "stores_delete_owner" on public.stores;
create policy "stores_delete_owner" on public.stores
  for delete using (auth.uid() = user_id);

-- products: readable by anyone, manageable only by store owner
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public" on public.products
  for select using (true);

drop policy if exists "products_insert_owner" on public.products;
create policy "products_insert_owner" on public.products
  for insert with check (
    exists (
      select 1 from public.stores s
      where s.id = store_id and s.user_id = auth.uid()
    )
  );

drop policy if exists "products_update_owner" on public.products;
create policy "products_update_owner" on public.products
  for update using (
    exists (
      select 1 from public.stores s
      where s.id = store_id and s.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.stores s
      where s.id = store_id and s.user_id = auth.uid()
    )
  );

drop policy if exists "products_delete_owner" on public.products;
create policy "products_delete_owner" on public.products
  for delete using (
    exists (
      select 1 from public.stores s
      where s.id = store_id and s.user_id = auth.uid()
    )
  );

-- orders: insertable by anyone, viewable only by store owner
drop policy if exists "orders_insert_public" on public.orders;
create policy "orders_insert_public" on public.orders
  for insert with check (true);

drop policy if exists "orders_select_owner" on public.orders;
create policy "orders_select_owner" on public.orders
  for select using (
    exists (
      select 1 from public.stores s
      where s.id = store_id and s.user_id = auth.uid()
    )
  );
