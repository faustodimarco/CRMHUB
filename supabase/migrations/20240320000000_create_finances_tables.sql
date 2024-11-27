create table revenue (
  id bigint primary key generated always as identity,
  month text not null,
  amount decimal(12,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table expenses (
  id bigint primary key generated always as identity,
  title text not null,
  month text not null,
  amount decimal(12,2) not null,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table revenue enable row level security;
alter table expenses enable row level security;

create policy "Enable read access for authenticated users" on revenue
  for select using (auth.role() = 'authenticated');

create policy "Enable insert access for authenticated users" on revenue
  for insert with check (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users" on expenses
  for select using (auth.role() = 'authenticated');

create policy "Enable insert access for authenticated users" on expenses
  for insert with check (auth.role() = 'authenticated');

create policy "Enable delete access for authenticated users" on expenses
  for delete using (auth.role() = 'authenticated');