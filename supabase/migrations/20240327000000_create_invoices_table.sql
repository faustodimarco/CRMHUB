-- Create storage bucket for invoices
insert into storage.buckets (id, name, public) 
values ('invoices', 'invoices', false);

-- Enable RLS for the bucket
create policy "Authenticated users can upload invoices"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'invoices' 
  and auth.role() = 'authenticated'
);

create policy "Authenticated users can view their invoices"
on storage.objects for select to authenticated
using (
  bucket_id = 'invoices' 
  and auth.role() = 'authenticated'
);

create policy "Authenticated users can delete their invoices"
on storage.objects for delete to authenticated
using (
  bucket_id = 'invoices' 
  and auth.role() = 'authenticated'
);

-- Create invoices table
create table public.invoices (
  id uuid default gen_random_uuid() primary key,
  invoice_number text not null unique,
  client_name text not null,
  amount decimal(10,2) not null,
  issue_date date not null,
  due_date date not null,
  status text not null check (status in ('draft', 'pending', 'paid')),
  file_path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) not null
);

-- Enable RLS
alter table public.invoices enable row level security;

-- Create RLS policies
create policy "Users can view their own invoices"
on public.invoices for select
using (auth.uid() = user_id);

create policy "Users can insert their own invoices"
on public.invoices for insert
with check (auth.uid() = user_id);

create policy "Users can update their own invoices"
on public.invoices for update
using (auth.uid() = user_id);

create policy "Users can delete their own invoices"
on public.invoices for delete
using (auth.uid() = user_id);