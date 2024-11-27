-- Enable delete policies for revenue table
create policy "Enable delete access for authenticated users" on revenue
  for delete using (auth.role() = 'authenticated');

-- Enable delete policies for expenses table (if not already present)
create policy "Enable delete access for authenticated users" on expenses
  for delete using (auth.role() = 'authenticated');