alter table expenses 
add column title text not null default 'Untitled Expense';

-- Modify the default after adding the column to make it required
alter table expenses 
alter column title drop default,
alter column title set not null;