-- Run once in Supabase → SQL Editor.
-- One row per user holding the same JSON the app keeps in localStorage.

create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- each user can only see and change their own row
create policy "read own progress" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert own progress" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own progress" on public.progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- new tables are not exposed automatically in this project, so grant explicitly
grant select, insert, update on public.progress to authenticated;
