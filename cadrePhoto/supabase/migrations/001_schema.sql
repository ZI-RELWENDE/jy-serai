-- ============================================================
-- MIGRATION 001 — Schéma complet de la plateforme
-- ============================================================

-- Extension UUID
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────
-- PROFILES (extension de auth.users)
-- ────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  role        text not null default 'free' check (role in ('free', 'organizer')),
  created_at  timestamptz not null default now()
);

-- Trigger : crée le profil automatiquement à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ────────────────────────────────────────
-- FRAMES
-- ────────────────────────────────────────
create table public.frames (
  id              uuid primary key default uuid_generate_v4(),
  owner_id        uuid not null references public.profiles(id) on delete cascade,
  title           text not null,
  description     text,
  image_url       text not null,
  thumbnail_url   text not null,
  is_public       boolean not null default true,
  category        text,
  download_count  integer not null default 0,
  quota_limit     integer,           -- null = illimité
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);

-- Fonction pour incrémenter le compteur de téléchargements (atomique)
create or replace function public.increment_download_count(frame_id uuid)
returns void language sql security definer as $$
  update public.frames
  set download_count = download_count + 1
  where id = frame_id;
$$;

-- ────────────────────────────────────────
-- QUOTA PACKAGES
-- ────────────────────────────────────────
create table public.quota_packages (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  download_limit  integer not null,
  price_xof       integer not null,
  description     text,
  active          boolean not null default true
);

-- Packs de départ
insert into public.quota_packages (name, download_limit, price_xof, description) values
  ('Pack Starter',    50,  2500,  'Idéal pour un petit événement'),
  ('Pack Standard',  200,  7500,  'Pour un événement de taille moyenne'),
  ('Pack Premium',   500, 15000,  'Pour les grandes célébrations');

-- ────────────────────────────────────────
-- PURCHASES
-- ────────────────────────────────────────
create table public.purchases (
  id                    uuid primary key default uuid_generate_v4(),
  owner_id              uuid not null references public.profiles(id) on delete cascade,
  frame_id              uuid not null references public.frames(id) on delete cascade,
  package_id            uuid not null references public.quota_packages(id),
  transaction_id        text not null unique,
  amount_xof            integer not null,
  status                text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  downloads_remaining   integer not null default 0,
  created_at            timestamptz not null default now()
);

-- Quand un achat est confirmé : augmenter le quota du cadre
create or replace function public.handle_purchase_completed()
returns trigger language plpgsql security definer as $$
declare
  pkg_limit integer;
begin
  if new.status = 'completed' and old.status = 'pending' then
    select download_limit into pkg_limit
    from public.quota_packages
    where id = new.package_id;

    update public.frames
    set quota_limit = coalesce(quota_limit, 0) + pkg_limit
    where id = new.frame_id;

    update public.purchases
    set downloads_remaining = pkg_limit
    where id = new.id;
  end if;
  return new;
end;
$$;

create trigger on_purchase_completed
  after update of status on public.purchases
  for each row execute procedure public.handle_purchase_completed();

-- ────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ────────────────────────────────────────
alter table public.profiles    enable row level security;
alter table public.frames      enable row level security;
alter table public.purchases   enable row level security;

-- Profiles : chacun ne voit que le sien
create policy "Profil personnel" on public.profiles
  for all using (auth.uid() = id);

-- Frames : lecture publique, écriture propriétaire
create policy "Lecture cadres publics" on public.frames
  for select using (is_public = true or auth.uid() = owner_id);

create policy "Gestion propriétaire" on public.frames
  for all using (auth.uid() = owner_id);

-- Purchases : propriétaire uniquement
create policy "Achats personnels" on public.purchases
  for all using (auth.uid() = owner_id);

-- ────────────────────────────────────────
-- STORAGE BUCKETS
-- ────────────────────────────────────────
insert into storage.buckets (id, name, public) values
  ('frames', 'frames', true),
  ('photos', 'photos', false);

-- Frames bucket : lecture publique, upload authentifié seulement
create policy "Lecture publique frames" on storage.objects
  for select using (bucket_id = 'frames');

create policy "Upload frames authentifié" on storage.objects
  for insert with check (bucket_id = 'frames' and auth.role() = 'authenticated');

-- Photos bucket : accès propriétaire seulement
create policy "Photos personnelles" on storage.objects
  for all using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);
