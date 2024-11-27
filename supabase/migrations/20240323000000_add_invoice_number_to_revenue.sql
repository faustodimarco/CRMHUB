-- Add invoice_number column to revenue table
alter table revenue add column invoice_number text;

-- Update the handle_invoice_paid function to include invoice number
create or replace function handle_invoice_paid()
returns trigger as $$
begin
  if new.status = 'paid' and (old.status is null or old.status != 'paid') then
    insert into revenue (month, amount, description, invoice_id, title, invoice_number)
    values (
      to_char(new.date, 'YYYY-MM'),
      new.amount,
      'Payment for invoice #' || new.id,
      new.id,
      'Invoice #' || new.id || ' Payment',
      new.id::text -- Convert invoice ID to text for invoice_number
    );
  end if;
  return new;
end;
$$ language plpgsql;