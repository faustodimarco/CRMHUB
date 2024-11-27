-- First drop existing revenue table if it exists
drop table if exists revenue cascade;

-- Create the updated revenue table with invoice reference
create table revenue (
  id bigint primary key generated always as identity,
  month text not null,
  amount decimal(12,2) not null,
  description text,
  invoice_id bigint references invoices(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table revenue enable row level security;

-- Policies for revenue table
create policy "Enable read access for authenticated users" on revenue
  for select using (auth.role() = 'authenticated');

create policy "Enable insert access for authenticated users" on revenue
  for insert with check (auth.role() = 'authenticated');

create policy "Enable delete access for authenticated users" on revenue
  for delete using (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_revenue_updated_at
  before update on revenue
  for each row
  execute function handle_updated_at();

-- Create function to automatically create revenue when invoice is marked as paid
create or replace function handle_invoice_paid()
returns trigger as $$
begin
  if new.status = 'paid' and (old.status is null or old.status != 'paid') then
    insert into revenue (month, amount, description, invoice_id)
    values (
      to_char(new.date, 'YYYY-MM'),
      new.amount,
      'Payment for invoice #' || new.id,
      new.id
    );
  end if;
  return new;
end;
$$ language plpgsql;

-- Create trigger for invoice status changes
create trigger handle_invoice_payment
  after insert or update of status on invoices
  for each row
  execute function handle_invoice_paid();