-- rep² — שלב 1: זוגות, פרופילים, אימונים
-- להדביק ב-Supabase: SQL Editor → New query → Run

create table couples (
  id uuid primary key default gen_random_uuid(),
  invite_code text unique not null default upper(substr(md5(random()::text), 1, 6)),
  created_at timestamptz default now()
);

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  couple_id uuid references couples on delete set null,
  name text not null default '',
  created_at timestamptz default now()
);

create table workout_slots (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples on delete cascade,
  weekday int not null check (weekday between 0 and 6), -- 0 = ראשון
  time time not null,
  duration_min int not null default 60,
  type text not null,
  together boolean not null default true,
  owner_id uuid references profiles on delete cascade,
  created_at timestamptz default now()
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples on delete cascade,
  slot_id uuid references workout_slots on delete cascade,
  original_date date,
  date date not null,
  time time not null,
  duration_min int not null default 60,
  type text not null,
  together boolean not null default true,
  owner_id uuid references profiles on delete cascade,
  status text not null default 'planned' check (status in ('planned', 'done', 'skipped')),
  created_at timestamptz default now(),
  unique (slot_id, original_date)
);

-- הזוג של המשתמש המחובר
create function my_couple() returns uuid
language sql stable security definer set search_path = public as $$
  select couple_id from profiles where id = auth.uid()
$$;

-- פרופיל נוצר אוטומטית בהרשמה
create function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, name) values (new.id, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function handle_new_user();

-- יצירת זוג חדש (מחזיר קוד הזמנה)
create function create_couple() returns text
language plpgsql security definer set search_path = public as $$
declare c couples;
begin
  insert into couples default values returning * into c;
  update profiles set couple_id = c.id where id = auth.uid();
  return c.invite_code;
end $$;

-- הצטרפות לזוג לפי קוד
create function join_couple(code text) returns boolean
language plpgsql security definer set search_path = public as $$
declare cid uuid;
begin
  select id into cid from couples where invite_code = upper(trim(code));
  if cid is null then return false; end if;
  if (select count(*) from profiles where couple_id = cid) >= 2 then return false; end if;
  update profiles set couple_id = cid where id = auth.uid();
  return true;
end $$;

-- אבטחה: כל אחד רואה רק את הזוג שלו
alter table couples enable row level security;
alter table profiles enable row level security;
alter table workout_slots enable row level security;
alter table sessions enable row level security;

create policy "couple read" on couples for select using (id = my_couple());
create policy "profile read" on profiles for select using (id = auth.uid() or couple_id = my_couple());
create policy "profile update" on profiles for update using (id = auth.uid());
create policy "slots" on workout_slots for all using (couple_id = my_couple()) with check (couple_id = my_couple());
create policy "sessions" on sessions for all using (couple_id = my_couple()) with check (couple_id = my_couple());
