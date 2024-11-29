import { supabase } from "@/lib/supabase";

interface ExpenseData {
  amount: number;
  category: string;
  title: string;
  month: string;
  is_recurring?: boolean;
  recurring_end_date?: string;
}

interface RevenueData {
  amount: number;
  month: string;
  title?: string;
  invoice_number?: string;
  is_recurring?: boolean;
  recurring_end_date?: string;
}

export const addExpense = async (expenseData: ExpenseData) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expenseData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateExpense = async (id: number, expenseData: Partial<ExpenseData>) => {
  const { data, error } = await supabase
    .from('expenses')
    .update(expenseData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteExpense = async (id: number) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addRevenue = async (revenueData: RevenueData) => {
  const { data, error } = await supabase
    .from('revenue')
    .insert(revenueData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateRevenue = async (id: number, revenueData: Partial<RevenueData>) => {
  const { data, error } = await supabase
    .from('revenue')
    .update(revenueData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteRevenue = async (id: number) => {
  const { error } = await supabase
    .from('revenue')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getExpensesByMonth = async (month: string) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('month', month)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getRevenueByMonth = async (month: string) => {
  const { data, error } = await supabase
    .from('revenue')
    .select('*')
    .eq('month', month)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const calculateMonthlyTotal = (items: { amount: number }[]) => {
  return items.reduce((total, item) => total + item.amount, 0);
};

export const calculateMonthlyBalance = (revenue: { amount: number }[], expenses: { amount: number }[]) => {
  const totalRevenue = calculateMonthlyTotal(revenue);
  const totalExpenses = calculateMonthlyTotal(expenses);
  return totalRevenue - totalExpenses;
};