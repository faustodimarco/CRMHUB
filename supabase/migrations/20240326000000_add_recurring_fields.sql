-- Add recurring fields to revenue table
alter table revenue add column is_recurring boolean default false;
alter table revenue add column recurring_end_date date;

-- Add recurring fields to expenses table
alter table expenses add column is_recurring boolean default false;
alter table expenses add column recurring_end_date date;

-- Create function to handle recurring entries
create or replace function handle_recurring_entries()
returns trigger as $$
declare
  next_month date;
  end_date date;
begin
  -- Only proceed if is_recurring is true
  if NEW.is_recurring = true then
    -- Get the end date, default to 1 year if not specified
    end_date := coalesce(NEW.recurring_end_date, (date_trunc('month', NEW.created_at) + interval '1 year')::date);
    
    -- Calculate next month's date
    next_month := (date_trunc('month', NEW.created_at) + interval '1 month')::date;
    
    -- Create recurring entries until end date
    while next_month <= end_date loop
      if TG_TABLE_NAME = 'revenue' then
        insert into revenue (
          month,
          amount,
          title,
          invoice_number,
          is_recurring,
          recurring_end_date
        ) values (
          to_char(next_month, 'YYYY-MM'),
          NEW.amount,
          NEW.title || ' (Recurring)',
          null, -- Don't copy invoice number for recurring entries
          false, -- Don't make the copies recurring
          null
        );
      else -- expenses
        insert into expenses (
          title,
          month,
          amount,
          category,
          is_recurring,
          recurring_end_date
        ) values (
          NEW.title || ' (Recurring)',
          to_char(next_month, 'YYYY-MM'),
          NEW.amount,
          NEW.category,
          false, -- Don't make the copies recurring
          null
        );
      end if;
      
      next_month := (next_month + interval '1 month')::date;
    end loop;
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