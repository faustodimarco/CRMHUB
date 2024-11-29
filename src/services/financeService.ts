import { supabase } from '@/lib/supabase';
import Papa from 'papaparse';

export interface Revenue {
  id: number;
  month: string;
  amount: number;
  title?: string;
  invoice_number?: string;
  created_at: string;
  is_recurring: boolean;
  recurring_end_date?: string;
}

export interface Expense {
  id: number;
  title: string;
  month: string;
  amount: number;
  category: string;
  created_at: string;
  is_recurring: boolean;
  recurring_end_date?: string;
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
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const addExpense = async (expense: Omit<Expense, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([expense])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const editRevenue = async (id: number, revenue: Partial<Omit<Revenue, 'id' | 'created_at'>>) => {
  const { data, error } = await supabase
    .from('revenue')
    .update(revenue)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const editExpense = async (id: number, expense: Partial<Omit<Expense, 'id' | 'created_at'>>) => {
  const { data, error } = await supabase
    .from('expenses')
    .update(expense)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteExpense = async (id: number) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

export const deleteRevenue = async (id: number) => {
  const { error } = await supabase
    .from('revenue')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting revenue:', error);
    throw error;
  }
};

export const uploadCsv = async (file: File, type: 'revenue' | 'expenses') => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const { data, error } = await supabase
            .from(type)
            .insert(results.data);
          
          if (error) throw error;
          resolve(data);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};
