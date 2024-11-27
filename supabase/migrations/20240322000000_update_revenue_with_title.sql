-- Add title column to revenue table
alter table revenue add column title text;

-- Update the handle_invoice_paid function to include invoice title
create or replace function handle_invoice_paid()
returns trigger as $$
begin
  if new.status = 'paid' and (old.status is null or old.status != 'paid') then
    insert into revenue (month, amount, description, invoice_id, title)
    values (
      to_char(new.date, 'YYYY-MM'),
      new.amount,
      'Payment for invoice #' || new.id,
      new.id,
      'Invoice #' || new.id || ' Payment' -- Default title for invoice-generated revenue
    );
  end if;
  return new;
end;
$$ language plpgsql;