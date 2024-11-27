-- First drop the existing title column if it exists
alter table expenses 
drop column if exists title;

-- Add the title column
alter table expenses 
add column title text not null default 'Untitled Expense';

-- Remove the default constraint after adding the column
alter table expenses 
alter column title drop default,
alter column title set not null;