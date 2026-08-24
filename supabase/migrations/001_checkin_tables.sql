-- Daily post-treatment check-ins with encrypted notes and clinic alerting.
-- Enable RLS on all tables; photos live in private storage bucket.

create extension if not exists "pgcrypto";

create table if not exists public.daily_check_ins (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null,
  physician_id uuid not null,
  photo_storage_path text not null,
  symptoms_summary jsonb not null,
  notes_encrypted text,
  red_flags jsonb not null default '[]'::jsonb,
  has_red_flags boolean not null default false,
  max_severity text check (max_severity in ('high', 'critical')),
  check_in_day int,
  locale text not null default 'en' check (locale in ('en', 'he', 'ar')),
  created_at timestamptz not null default now()
);

create table if not exists public.clinic_alerts (
  id uuid primary key default gen_random_uuid(),
  check_in_id uuid not null references public.daily_check_ins(id) on delete cascade,
  patient_id uuid not null,
  physician_id uuid not null,
  red_flags jsonb not null,
  max_severity text not null check (max_severity in ('high', 'critical')),
  acknowledged boolean not null default false,
  locale text not null default 'en',
  created_at timestamptz not null default now()
);

create table if not exists public.push_tokens (
  user_id uuid primary key,
  expo_push_token text not null,
  locale text not null default 'en',
  updated_at timestamptz not null default now()
);

create index if not exists idx_check_ins_patient on public.daily_check_ins(patient_id, created_at desc);
create index if not exists idx_clinic_alerts_physician on public.clinic_alerts(physician_id, acknowledged, created_at desc);

alter table public.daily_check_ins enable row level security;
alter table public.clinic_alerts enable row level security;
alter table public.push_tokens enable row level security;

-- Patients read/write own check-ins; physicians read assigned patients (simplified policies).
create policy "patients_insert_own_checkins"
  on public.daily_check_ins for insert
  with check (auth.uid() = patient_id);

create policy "patients_read_own_checkins"
  on public.daily_check_ins for select
  using (auth.uid() = patient_id);

create policy "physicians_read_patient_checkins"
  on public.daily_check_ins for select
  using (auth.uid() = physician_id);

create policy "physicians_read_alerts"
  on public.clinic_alerts for select
  using (auth.uid() = physician_id);

create policy "physicians_update_alerts"
  on public.clinic_alerts for update
  using (auth.uid() = physician_id);

create policy "users_manage_own_push_token"
  on public.push_tokens for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
