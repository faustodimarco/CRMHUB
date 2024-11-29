import { supabase } from "@/lib/supabase";

export interface Expense {
  id: number;
  title: string;
  month: string;
  amount: number;
  category: string;
  created_at: string;
  is_recurring?: boolean;
  recurring_end_date?: string | null;
}

export interface Revenue {
  id: number;
  title?: string;
  month: string;
  amount: number;
  created_at: string;
  invoice_number?: string | null;
  is_recurring?: boolean;
  recurring_end_date?: string | null;
  invoice_id?: string | null;
}

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

export const getExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getRevenue = async (): Promise<Revenue[]> => {
  const { data, error } = await supabase
    .from('revenue')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const addExpense = async (expenseData: ExpenseData): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expenseData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const editExpense = async (id: number, expenseData: Partial<ExpenseData>): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expenses')
    .update(expenseData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteExpense = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addRevenue = async (revenueData: RevenueData): Promise<Revenue> => {
  const { data, error } = await supabase
    .from('revenue')
    .insert(revenueData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const editRevenue = async (id: number, revenueData: Partial<RevenueData>): Promise<Revenue> => {
  const { data, error } = await supabase
    .from('revenue')
    .update(revenueData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteRevenue = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('revenue')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const uploadCsv = async (file: File, type: 'revenue' | 'expenses'): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await fetch('/api/upload-csv', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload CSV');
  }
};

export const calculateMonthlyTotal = (items: { amount: number }[]): number => {
  return items.reduce((total, item) => total + item.amount, 0);
};

export const calculateMonthlyBalance = (
  revenue: { amount: number }[], 
  expenses: { amount: number }[]
): number => {
  const totalRevenue = calculateMonthlyTotal(revenue);
  const totalExpenses = calculateMonthlyTotal(expenses);
  return totalRevenue - totalExpenses;
};