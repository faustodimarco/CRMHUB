import { supabase } from '@/lib/supabase';
import Papa from 'papaparse';

export interface Revenue {
  id: number;
  month: string;
  amount: number;
  created_at: string;
}

export interface Expense {
  id: number;
  title: string;
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