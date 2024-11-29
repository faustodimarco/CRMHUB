create table if not exists public.users (
  id uuid references auth.users on delete cascade not null primary key,
  is_admin boolean default false,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;

-- Create policies
create policy "Users can view their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Admin users can view all data"
  on public.users for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and is_admin = true
    )
  );

-- Create a trigger to automatically update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_users_updated
  before update on public.users
  for each row
  execute procedure public.handle_updated_at();

-- Create a function to create a user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id)
  values (new.id);
  return new;
end;
$$ language plpgsql;

-- Create a trigger to call the function on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();