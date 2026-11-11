-- VIP Capture: run once in Supabase → SQL Editor → New query → Run.

-- Shared shot checklist: one row per ticked item.
create table if not exists public.ticks (
  id   text primary key,
  done boolean not null default true,
  who  text,
  at   timestamptz not null default now()
);

-- Inspo board.
create table if not exists public.inspo (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null default 'shot' check (kind in ('shot','reel')),
  title        text not null check (char_length(title) <= 80),
  note         text check (char_length(note) <= 400),
  link         text check (link is null or link ~* '^https?://'),
  scene        text,
  file_path    text,
  content_type text,
  who          text,
  tried        boolean not null default false,
  at           timestamptz not null default now()
);

alter table public.ticks enable row level security;
alter table public.inspo enable row level security;

-- Anyone with the app can read and write (a crew tool, no logins).
create policy "crew read ticks"   on public.ticks for select to anon using (true);
create policy "crew add ticks"    on public.ticks for insert to anon with check (true);
create policy "crew change ticks" on public.ticks for update to anon using (true) with check (true);
create policy "crew clear ticks"  on public.ticks for delete to anon using (true);

create policy "crew read inspo"   on public.inspo for select to anon using (true);
create policy "crew add inspo"    on public.inspo for insert to anon with check (true);
create policy "crew change inspo" on public.inspo for update to anon using (true) with check (true);
create policy "crew remove inspo" on public.inspo for delete to anon using (true);

-- Live sync: push every change to every open phone.
alter publication supabase_realtime add table public.ticks, public.inspo;

-- Photo/video storage for the inspo board (public read, 50 MB per file).
insert into storage.buckets (id, name, public, file_size_limit)
values ('inspo', 'inspo', true, 52428800)
on conflict (id) do nothing;

create policy "crew read inspo files"   on storage.objects for select to anon using (bucket_id = 'inspo');
create policy "crew upload inspo files" on storage.objects for insert to anon with check (bucket_id = 'inspo');
create policy "crew delete inspo files" on storage.objects for delete to anon using (bucket_id = 'inspo');
