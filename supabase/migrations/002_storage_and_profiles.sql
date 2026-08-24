-- Profiles, clinic insert path, and private medical-image storage.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'patient' check (role in ('patient', 'physician', 'clinic_admin')),
  display_name text,
  locale text not null default 'he' check (locale in ('en', 'he', 'ar')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users_read_own_profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "users_update_own_profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "users_insert_own_profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, locale)
  values (new.id, 'patient', 'he')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Edge functions use the service role and bypass RLS. Keep a physician insert
-- policy for dashboard tools that run as the signed-in doctor.
create policy "physicians_insert_alerts"
  on public.clinic_alerts for insert
  with check (auth.uid() = physician_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'medical-images',
  'medical-images',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "patients_upload_own_images"
  on storage.objects for insert
  with check (
    bucket_id = 'medical-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "patients_read_own_images"
  on storage.objects for select
  using (
    bucket_id = 'medical-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "physicians_read_medical_images"
  on storage.objects for select
  using (
    bucket_id = 'medical-images'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('physician', 'clinic_admin')
    )
  );
