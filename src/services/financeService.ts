import { supabase } from '@/lib/supabase';

export interface Revenue {
  id: number;
  month: string;
  amount: number;
  created_at: string;
}

export interface Expense {
  id: number;
  month: string;
  amount: number;
  category: string;
  created_at: string;
}

export const getRevenue = async () => {
  const { data, error } = await supabase
    .from('revenue')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getExpenses = async () => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const addRevenue = async (revenue: Omit<Revenue, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('revenue')
    .insert([revenue])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const addExpense = async (expense: Omit<Expense, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([expense])
    .select()
    .single();

  if (error) throw error;
  return data;
};