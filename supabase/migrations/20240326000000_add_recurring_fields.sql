-- Add recurring fields to revenue table if they don't exist
do $$ 
begin
    if not exists (select 1 from information_schema.columns where table_name = 'revenue' and column_name = 'is_recurring') then
        alter table revenue add column is_recurring boolean default false;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'revenue' and column_name = 'recurring_end_date') then
        alter table revenue add column recurring_end_date date;
    end if;
end $$;

-- Add recurring fields to expenses table if they don't exist
do $$ 
begin
    if not exists (select 1 from information_schema.columns where table_name = 'expenses' and column_name = 'is_recurring') then
        alter table expenses add column is_recurring boolean default false;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'expenses' and column_name = 'recurring_end_date') then
        alter table expenses add column recurring_end_date date;
    end if;
end $$;

-- Create function to handle recurring entries
create or replace function handle_recurring_entries()
returns trigger as $$
declare
  current_month date;
  end_date date;
begin
  if NEW.is_recurring = true then
    end_date := coalesce(NEW.recurring_end_date, (date_trunc('month', NEW.created_at) + interval '1 year')::date);
    current_month := date_trunc('month', current_date);
    
    if current_month <= end_date then
      if TG_TABLE_NAME = 'revenue' then
        if not exists (
          select 1 
          from revenue 
          where month = to_char(current_month, 'YYYY-MM')
          and title = NEW.title || ' (Recurring)'
        ) then
          insert into revenue (
            month,
            amount,
            title,
            invoice_number,
            is_recurring,
            recurring_end_date
          ) values (
            to_char(current_month, 'YYYY-MM'),
            NEW.amount,
            NEW.title || ' (Recurring)',
            null,
            false,
            null
          );
        end if;
      else
        if not exists (
          select 1 
          from expenses 
          where month = to_char(current_month, 'YYYY-MM')
          and title = NEW.title || ' (Recurring)'
        ) then
          insert into expenses (
            title,
            month,
            amount,
            category,
            is_recurring,
            recurring_end_date
          ) values (
            NEW.title || ' (Recurring)',
            to_char(current_month, 'YYYY-MM'),
            NEW.amount,
            NEW.category,
            false,
            null
          );
        end if;
      end if;
    end if;
  end if;
  
  return NEW;
end;
$$ language plpgsql;

-- Create triggers for both tables
drop trigger if exists handle_revenue_recurring on revenue;
drop trigger if exists handle_expenses_recurring on expenses;

create trigger handle_revenue_recurring
  after insert or update of is_recurring, recurring_end_date on revenue
  for each row
  execute function handle_recurring_entries();

create trigger handle_expenses_recurring
  after insert or update of is_recurring, recurring_end_date on expenses
  for each row
  execute function handle_recurring_entries();

-- Create a function to handle monthly recurring entries
create or replace function process_monthly_recurring_entries()
returns void as $$
declare
  current_month date;
begin
  current_month := date_trunc('month', current_date);
  
  insert into revenue (month, amount, title, is_recurring, recurring_end_date)
  select 
    to_char(current_month, 'YYYY-MM'),
    amount,
    title || ' (Recurring)',
    false,
    null
  from revenue
  where is_recurring = true
  and recurring_end_date >= current_month
  and not exists (
    select 1
    from revenue r2
    where r2.month = to_char(current_month, 'YYYY-MM')
    and r2.title = revenue.title || ' (Recurring)'
  );
  
  insert into expenses (month, amount, title, category, is_recurring, recurring_end_date)
  select 
    to_char(current_month, 'YYYY-MM'),
    amount,
    title || ' (Recurring)',
    category,
    false,
    null
  from expenses
  where is_recurring = true
  and recurring_end_date >= current_month
  and not exists (
    select 1
    from expenses e2
    where e2.month = to_char(current_month, 'YYYY-MM')
    and e2.title = expenses.title || ' (Recurring)'
  );
end;
$$ language plpgsql;

-- Create a cron job to run the recurring entries function on the first of each month
select cron.schedule(
  'process-recurring-entries',
  '0 0 1 * *',
  $$
  select process_monthly_recurring_entries();
  $$
);