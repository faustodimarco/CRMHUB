-- Add recurring fields to revenue table
alter table revenue add column is_recurring boolean default false;
alter table revenue add column recurring_end_date date;

-- Add recurring fields to expenses table
alter table expenses add column is_recurring boolean default false;
alter table expenses add column recurring_end_date date;

-- Create function to handle recurring entries only for the current month
create or replace function handle_recurring_entries()
returns trigger as $$
declare
  current_month date;
  end_date date;
begin
  -- Only proceed if is_recurring is true
  if NEW.is_recurring = true then
    -- Get the end date, default to 1 year if not specified
    end_date := coalesce(NEW.recurring_end_date, (date_trunc('month', NEW.created_at) + interval '1 year')::date);
    
    -- Get current month
    current_month := date_trunc('month', current_date);
    
    -- Only create entry if we haven't reached the end date
    if current_month <= end_date then
      if TG_TABLE_NAME = 'revenue' then
        -- Check if an entry already exists for this month
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
            null, -- Don't copy invoice number for recurring entries
            false, -- Don't make the copies recurring
            null
          );
        end if;
      else -- expenses
        -- Check if an entry already exists for this month
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
            false, -- Don't make the copies recurring
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
  
  -- Process recurring revenue
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
  
  -- Process recurring expenses
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
  '0 0 1 * *', -- Run at midnight on the first day of each month
  $$
  select process_monthly_recurring_entries();
  $$
);