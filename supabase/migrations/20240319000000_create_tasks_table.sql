create table
  public.tasks (
    id bigint generated by default as identity primary key,
    title text not null,
    description text,
    status text not null default 'todo' check (status in ('todo', 'in_progress', 'review', 'done')),
    priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
    due_date timestamp with time zone,
    assigned_to uuid references auth.users(id),
    client_id bigint references clients(id),
    created_by uuid references auth.users(id) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    position integer not null default 0
);

-- Enable Row Level Security
alter table tasks enable row level security;

-- Create policy to allow authenticated users to read all tasks
create policy "Users can view all tasks"
  on tasks for select
  to authenticated
  using (true);

-- Create policy to allow users to insert their own tasks
create policy "Users can insert their own tasks"
  on tasks for insert
  to authenticated
  with check (auth.uid() = created_by);

-- Create policy to allow users to update their own tasks
create policy "Users can update their own tasks"
  on tasks for update
  to authenticated
  using (auth.uid() = created_by);

-- Create policy to allow users to delete their own tasks
create policy "Users can delete their own tasks"
  on tasks for delete
  to authenticated
  using (auth.uid() = created_by);

-- Create function to automatically update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_tasks_updated_at
  before update on tasks
  for each row
  execute procedure public.handle_updated_at();