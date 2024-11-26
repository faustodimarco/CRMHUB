import { supabase } from '@/lib/supabase';

export interface Client {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_prefix: string;
  phone_number: string;
  country: string;
  city: string;
  website?: string;
  linkedin?: string;
  created_at?: string;
}

export const addClient = async (client: Omit<Client, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('clients')
    .insert([client])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getClients = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};