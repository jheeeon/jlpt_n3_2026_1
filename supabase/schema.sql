create extension if not exists pgcrypto;

create table if not exists vocabulary (
  id uuid primary key default gen_random_uuid(),
  word text not null,
  reading text not null,
  meaning_ko text not null,
  meaning_en text,
  jlpt_level integer not null default 3 check (jlpt_level = 3),
  priority integer not null default 3 check (priority between 1 and 5),
  tags text[] not null default '{}',
  source text,
  source_order integer,
  translation_status text not null default 'manual' check (
    translation_status in ('manual', 'auto_exact', 'auto_token', 'needs_review')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (word, reading)
);

create table if not exists vocabulary_progress (
  vocabulary_id uuid primary key references vocabulary(id) on delete cascade,
  is_memorized boolean not null default false,
  is_favorite boolean not null default false,
  review_count integer not null default 0,
  last_studied_on date,
  updated_at timestamptz not null default now()
);

create index if not exists vocabulary_priority_idx on vocabulary (priority desc, source_order asc);
create index if not exists vocabulary_tags_idx on vocabulary using gin (tags);
create index if not exists vocabulary_progress_updated_idx on vocabulary_progress (updated_at desc);

alter table vocabulary enable row level security;
alter table vocabulary_progress enable row level security;

drop policy if exists "Public read vocabulary" on vocabulary;
create policy "Public read vocabulary"
  on vocabulary for select
  to anon
  using (true);

drop policy if exists "Public read progress" on vocabulary_progress;
create policy "Public read progress"
  on vocabulary_progress for select
  to anon
  using (true);

drop policy if exists "Public insert progress" on vocabulary_progress;
create policy "Public insert progress"
  on vocabulary_progress for insert
  to anon
  with check (true);

drop policy if exists "Public update progress" on vocabulary_progress;
create policy "Public update progress"
  on vocabulary_progress for update
  to anon
  using (true)
  with check (true);
