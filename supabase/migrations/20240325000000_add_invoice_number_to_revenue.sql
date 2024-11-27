-- Add invoice_number column to revenue table if it doesn't exist
alter table revenue add column if not exists invoice_number text;

-- Update existing policies to include the new column
drop policy if exists "Enable read access for authenticated users" on revenue;
drop policy if exists "Enable insert access for authenticated users" on revenue;
drop policy if exists "Enable delete access for authenticated users" on revenue;

-- Recreate policies
create policy "Enable read access for authenticated users" on revenue
  for select using (auth.role() = 'authenticated');

create policy "Enable insert access for authenticated users" on revenue
  for insert with check (auth.role() = 'authenticated');

create policy "Enable delete access for authenticated users" on revenue
  for delete using (auth.role() = 'authenticated');