import { supabase } from "@/lib/supabase";
import type { Invoice } from "@/types";

export const getInvoices = async () => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const uploadInvoice = async (file: File, invoice: Omit<Invoice, 'id' | 'file_path' | 'created_at' | 'user_id'>) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('User not authenticated');

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('invoices')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { error: insertError } = await supabase
    .from('invoices')
    .insert({
      ...invoice,
      file_path: filePath,
      user_id: user.id,
    });

  if (insertError) throw insertError;
};

export const updateInvoice = async (id: string, invoice: Partial<Omit<Invoice, 'id' | 'file_path' | 'created_at' | 'user_id'>>) => {
  const { error } = await supabase
    .from('invoices')
    .update(invoice)
    .eq('id', id);

  if (error) throw error;
};

export const deleteInvoice = async (id: string, filePath: string) => {
  const { error: storageError } = await supabase.storage
    .from('invoices')
    .remove([filePath]);

  if (storageError) throw storageError;

  const { error: dbError } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (dbError) throw dbError;
};

export const downloadInvoices = async (invoices: Invoice[]) => {
  if (invoices.length === 0) throw new Error('No invoices selected');

  if (invoices.length === 1) {
    const { data, error } = await supabase.storage
      .from('invoices')
      .download(invoices[0].file_path);

    if (error) throw error;
    return data;
  }

  // For multiple invoices, we'll need to implement zip functionality
  throw new Error('Multiple invoice download not implemented yet');
};